"use client";

import { useEffect, useRef } from "react";
import { tourCities, tourRoute, findCity } from "@/lib/tour";
import { decodeWorldMask, isLand } from "@/lib/world-mask";

export type GlobeAnchor = {
  /** Position of the active marker inside the frame, in CSS px. */
  x: number;
  y: number;
  /** Which side of the marker the information card should sit on. */
  side: "left" | "right";
};

type TourGlobeProps = {
  activeCity: string | null;
  onHoverCity: (city: string | null) => void;
  onSelectCity: (city: string) => void;
  onAnchorChange: (anchor: GlobeAnchor | null) => void;
};

const ACCENT = "255, 213, 0"; // --accent as an rgb triplet, for alpha compositing

/** Degrees of spin per frame while nothing is focused — one turn takes ~3 min. */
const IDLE_SPIN = 0.035;
/** The globe leans back slightly, the way a desk globe sits. */
const BASE_TILT = 14;

/** One tour leg: a slow flight, then a pause at the arrival city. */
const FLY_MS = 9000;
const DWELL_MS = 3400;
const LEG_MS = FLY_MS + DWELL_MS;

const DEG = Math.PI / 180;

/**
 * The section builds itself once, in the order the eye should read it: the
 * land resolves out of the dark, the nine cities light one after another, and
 * only then does the route join the announced dates. One clock drives all
 * three — `intro`, 0 to 1 — so the stages can never drift apart. Skipped
 * outright against a reduced-motion preference, which lands the finished
 * globe rather than an animated one.
 */
const INTRO_MS = 1700;
const LAND_IN = 0.42;
const MARKER_START = 0.26;
const MARKER_STAGGER = 0.05;
const MARKER_IN = 0.16;
const ROUTE_START = 0.74;

/**
 * Degrees between land samples. The mask underneath is 1° per cell, so going
 * finer than this only samples the same cell twice; this is about as dense as
 * the geography actually is.
 */
const DOT_STEP = 1.5;

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

type Vec3 = { x: number; y: number; z: number };
type Projected = { x: number; y: number; z: number };

/** Unit vector for a coordinate, with longitude 0 facing the viewer. */
function toVector(lat: number, lng: number): Vec3 {
  const phi = lat * DEG;
  const lambda = lng * DEG;
  const cosPhi = Math.cos(phi);
  return { x: cosPhi * Math.sin(lambda), y: Math.sin(phi), z: cosPhi * Math.cos(lambda) };
}

/** Great-circle interpolation, so a route follows the surface rather than the screen. */
function slerp(a: Vec3, b: Vec3, t: number): Vec3 {
  const dot = Math.min(1, Math.max(-1, a.x * b.x + a.y * b.y + a.z * b.z));
  const omega = Math.acos(dot);
  if (omega < 1e-6) return a;

  const sin = Math.sin(omega);
  const wa = Math.sin((1 - t) * omega) / sin;
  const wb = Math.sin(t * omega) / sin;
  return {
    x: a.x * wa + b.x * wb,
    y: a.y * wa + b.y * wb,
    z: a.z * wa + b.z * wb,
  };
}

/**
 * The tour globe — a dotted, monochrome sphere drawn on a single 2D canvas.
 *
 * Land comes from the baked 1° mask (`lib/world-mask.ts`) sampled once into a
 * unit-sphere point cloud; every frame rotates that cloud and projects it
 * orthographically, so there is no mapping library, no WebGL and no texture to
 * download. The globe turns slowly on its own and swings a focused city to
 * face the viewer. The loop is suspended whenever the section is off-screen.
 */
export function TourGlobe({
  activeCity,
  onHoverCity,
  onSelectCity,
  onAnchorChange,
}: TourGlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef<string | null>(activeCity);
  const anchorHandlerRef = useRef(onAnchorChange);
  const hoverHandlerRef = useRef(onHoverCity);
  const selectHandlerRef = useRef(onSelectCity);

  // Keep the animation loop's view of props current without restarting it.
  useEffect(() => {
    activeRef.current = activeCity;
    anchorHandlerRef.current = onAnchorChange;
    hoverHandlerRef.current = onHoverCity;
    selectHandlerRef.current = onSelectCity;
  }, [activeCity, onAnchorChange, onHoverCity, onSelectCity]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    /* ── The land point cloud, sampled once ──────────────────────────────── */

    const land = decodeWorldMask();
    const points: number[] = [];

    // Even coverage: the longitude step widens as the parallels shorten.
    for (let lat = -78; lat <= 84; lat += DOT_STEP) {
      // The parallels shorten toward the poles, so the longitude step widens
      // to match — without it the dots bunch into a solid cap at each end.
      const spacing = DOT_STEP / Math.max(Math.cos(lat * DEG), 0.18);
      for (let lng = -180; lng < 180; lng += spacing) {
        if (!isLand(land, lat, lng)) continue;
        const v = toVector(lat, lng);
        points.push(v.x, v.y, v.z);
      }
    }

    const cloud = new Float32Array(points);
    const dotCount = cloud.length / 3;

    /* ── Layout ──────────────────────────────────────────────────────────── */

    let width = 0;
    let height = 0;
    let cx = 0;
    let cy = 0;
    let radius = 0;

    const layout = () => {
      width = container.clientWidth;
      height = container.clientHeight;
      if (!width || !height) return;

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      cx = width / 2;
      cy = height / 2;
      radius = Math.min(width, height) * 0.44;
      reportedAnchor = null;
    };

    /* ── Rotation ────────────────────────────────────────────────────────── */

    // `yaw` spins around the poles; `tilt` leans the globe toward the viewer.
    const view = { yaw: -72, tilt: BASE_TILT };
    let cosYaw = 1;
    let sinYaw = 0;
    let cosTilt = 1;
    let sinTilt = 0;

    const cacheRotation = () => {
      cosYaw = Math.cos(view.yaw * DEG);
      sinYaw = Math.sin(view.yaw * DEG);
      cosTilt = Math.cos(view.tilt * DEG);
      sinTilt = Math.sin(view.tilt * DEG);
    };

    /** Rotates a unit vector into view space and projects it to the canvas. */
    const project = (v: Vec3, lift = 1): Projected => {
      const x1 = v.x * cosYaw + v.z * sinYaw;
      const z1 = -v.x * sinYaw + v.z * cosYaw;
      const y2 = v.y * cosTilt - z1 * sinTilt;
      const z2 = v.y * sinTilt + z1 * cosTilt;
      const r = radius * lift;
      return { x: cx + x1 * r, y: cy - y2 * r, z: z2 };
    };

    const projectCity = (city: { lat: number; lng: number }, lift = 1) =>
      project(toVector(city.lat, city.lng), lift);

    /* ── Drawing ─────────────────────────────────────────────────────────── */

    const drawSphere = () => {
      // A faint atmosphere so the globe reads as a body, not a scatter of dots.
      const halo = ctx.createRadialGradient(cx, cy, radius * 0.82, cx, cy, radius * 1.14);
      halo.addColorStop(0, "rgba(255, 255, 255, 0.045)");
      halo.addColorStop(0.55, "rgba(255, 213, 0, 0.035)");
      halo.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.14, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "rgba(255, 255, 255, 0.07)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.stroke();
    };

    // Alpha is bucketed so the whole cloud paints in a handful of fill calls.
    const BUCKETS = 5;
    const bucketPaths = Array.from({ length: BUCKETS }, () => [] as number[]);

    const drawLand = (reveal: number) => {
      for (const bucket of bucketPaths) bucket.length = 0;

      const size = radius > 220 ? 1.5 : 1.2;
      // The cloud is sampled for a full-size globe. On a phone the same dots
      // land within a couple of pixels of each other and read as a solid ball,
      // so half of them are dropped rather than drawn on top of one another.
      const stride = radius < 200 ? 2 : 1;

      for (let i = 0; i < dotCount; i += stride) {
        const o = i * 3;
        const x = cloud[o];
        const y = cloud[o + 1];
        const z = cloud[o + 2];

        const x1 = x * cosYaw + z * sinYaw;
        const z1 = -x * sinYaw + z * cosYaw;
        const y2 = y * cosTilt - z1 * sinTilt;
        const z2 = y * sinTilt + z1 * cosTilt;
        if (z2 <= 0.04) continue; // behind the horizon

        const bucket = Math.min(BUCKETS - 1, Math.floor(z2 * BUCKETS));
        bucketPaths[bucket].push(cx + x1 * radius, cy - y2 * radius);
      }

      for (let b = 0; b < BUCKETS; b += 1) {
        const coords = bucketPaths[b];
        if (!coords.length) continue;

        // Dots near the limb fade out, which gives the sphere its curvature.
        const depth = (b + 0.5) / BUCKETS;
        ctx.fillStyle = `rgba(255, 255, 255, ${((0.1 + depth * 0.3) * reveal).toFixed(3)})`;
        for (let i = 0; i < coords.length; i += 2) {
          ctx.fillRect(coords[i] - size / 2, coords[i + 1] - size / 2, size, size);
        }
      }
    };

    /** Route arcs bow away from the surface at their midpoint. */
    const legLift = (index: number, length: number) =>
      1 + Math.sin((index / (length - 1)) * Math.PI) * 0.11;

    /** Draws the visible part of a great-circle leg, up to `progress` (0–1). */
    const strokeLeg = (
      leg: Vec3[],
      progress: number,
      alpha: number,
      lineWidth: number,
    ) => {
      const last = Math.max(1, Math.floor(progress * (leg.length - 1)));
      ctx.strokeStyle = `rgba(${ACCENT}, ${alpha})`;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = "round";

      let drawing = false;
      ctx.beginPath();
      for (let i = 0; i <= last; i += 1) {
        const p = project(leg[i], legLift(i, leg.length));
        if (p.z <= 0) {
          drawing = false;
          continue;
        }
        if (!drawing) {
          ctx.moveTo(p.x, p.y);
          drawing = true;
        } else {
          ctx.lineTo(p.x, p.y);
        }
      }
      ctx.stroke();
    };

    const drawComet = (p: Projected) => {
      const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 13);
      glow.addColorStop(0, `rgba(${ACCENT}, 0.55)`);
      glow.addColorStop(1, `rgba(${ACCENT}, 0)`);
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 13, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawMarker = (
      city: (typeof tourCities)[number],
      time: number,
      isActive: boolean,
      onRoute: boolean,
      appear: number,
    ) => {
      const p = projectCity(city);
      if (p.z <= 0.02) return; // on the far side of the globe

      // Markers fade as they approach the limb, like the land beneath them,
      // and again while the city is still arriving.
      const facing = Math.min(1, p.z * 2.6) * appear;
      if (facing <= 0.001) return;
      const base = city.hub ? 3.6 : 2.8;

      const glowRadius = base * (isActive ? 6 : 3);
      const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowRadius);
      glow.addColorStop(0, `rgba(${ACCENT}, ${(isActive ? 0.5 : 0.2) * facing})`);
      glow.addColorStop(1, `rgba(${ACCENT}, 0)`);
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(p.x, p.y, glowRadius, 0, Math.PI * 2);
      ctx.fill();

      if (isActive && !reduceMotion) {
        for (let k = 0; k < 2; k += 1) {
          const phase = (time * 0.42 + k * 0.5) % 1;
          ctx.strokeStyle = `rgba(${ACCENT}, ${((1 - phase) * 0.42 * facing).toFixed(3)})`;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(p.x, p.y, base + phase * 26, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      ctx.fillStyle = isActive
        ? `rgba(255, 255, 255, ${facing.toFixed(3)})`
        : onRoute
          ? `rgba(${ACCENT}, ${(0.92 * facing).toFixed(3)})`
          : `rgba(255, 255, 255, ${(0.55 * facing).toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, isActive ? base + 1 : base, 0, Math.PI * 2);
      ctx.fill();

      // A small globe cannot carry nine labels — keep the tour, drop the rest.
      if (width < 640 && !isActive && !onRoute) return;
      // Labels only where the surface faces us squarely enough to read.
      if (p.z < 0.3) return;

      const labelSize = width < 640 ? 9 : 10;
      ctx.font = `${isActive || city.hub ? 600 : 400} ${labelSize}px ui-sans-serif, system-ui, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = (city.labelDy ?? 0) < 0 ? "bottom" : "top";

      const labelAlpha = Math.min(1, (p.z - 0.3) * 3.4);
      ctx.fillStyle = isActive
        ? `rgba(${ACCENT}, ${labelAlpha.toFixed(3)})`
        : city.hub
          ? `rgba(255, 255, 255, ${(0.82 * labelAlpha).toFixed(3)})`
          : `rgba(255, 255, 255, ${(0.45 * labelAlpha).toFixed(3)})`;
      // Keep the label inside the canvas — near the limb the offset can push
      // a name off the edge, where it would simply be clipped mid-word.
      const label = city.name.toUpperCase();
      const halfLabel = ctx.measureText(label).width / 2 + 6;
      const labelX = Math.min(
        Math.max(p.x + (city.labelDx ?? 0) * 0.6, halfLabel),
        Math.max(halfLabel, width - halfLabel),
      );

      ctx.fillText(label, labelX, p.y + (city.labelDy ?? 12));
    };

    /* ── Route geometry, resolved once ───────────────────────────────────── */

    const legs: Vec3[][] = [];
    for (let i = 0; i < tourRoute.length - 1; i += 1) {
      const from = findCity(tourRoute[i]);
      const to = findCity(tourRoute[i + 1]);
      if (!from || !to) continue;

      const a = toVector(from.lat, from.lng);
      const b = toVector(to.lat, to.lng);
      const samples: Vec3[] = [];
      for (let s = 0; s <= 72; s += 1) samples.push(slerp(a, b, s / 72));
      legs.push(samples);
    }

    /* ── Loop ────────────────────────────────────────────────────────────── */

    let frameId: number | null = null;
    let lastTs: number | null = null;
    let tourClock = 0;
    // Straight to the finished globe when motion is unwelcome.
    let intro = reduceMotion ? 1 : 0;
    let reportedAnchor: GlobeAnchor | null = null;

    const publishAnchor = (anchor: GlobeAnchor | null) => {
      const unchanged =
        (anchor === null && reportedAnchor === null) ||
        (anchor !== null &&
          reportedAnchor !== null &&
          Math.abs(anchor.x - reportedAnchor.x) < 1 &&
          Math.abs(anchor.y - reportedAnchor.y) < 1 &&
          anchor.side === reportedAnchor.side);
      if (unchanged) return;
      reportedAnchor = anchor;
      anchorHandlerRef.current(anchor);
    };

    const frame = (ts: number) => {
      frameId = requestAnimationFrame(frame);
      if (lastTs === null) lastTs = ts;
      const dt = Math.min(50, ts - lastTs);
      lastTs = ts;
      if (!width || !height) return;

      const active = findCity(activeRef.current);
      const time = ts * 0.001;
      if (intro < 1) intro = Math.min(1, intro + dt / INTRO_MS);

      if (active) {
        // Swing the focused city round to face the viewer, by the short way.
        const targetYaw = -active.lng;
        const targetTilt = BASE_TILT + (active.lat - BASE_TILT) * 0.55;
        const ease = reduceMotion ? 1 : 1 - Math.exp(-dt / 240);

        const delta = ((targetYaw - view.yaw + 540) % 360) - 180;
        view.yaw += delta * ease;
        view.tilt += (targetTilt - view.tilt) * ease;
      } else {
        if (!reduceMotion) {
          view.yaw += IDLE_SPIN * (dt / 16);
          tourClock += dt;
        }
        view.tilt += (BASE_TILT - view.tilt) * (reduceMotion ? 1 : 1 - Math.exp(-dt / 400));
      }

      view.yaw = ((view.yaw + 180) % 360) - 180;
      cacheRotation();

      ctx.clearRect(0, 0, width, height);
      drawSphere();
      drawLand(clamp01(intro / LAND_IN));

      // The route: always faintly present, with a slow pulse travelling it.
      const activeIndex = active ? tourRoute.indexOf(active.name) : -1;
      const routeIn = clamp01((intro - ROUTE_START) / (1 - ROUTE_START));
      const share = legs.length ? 1 / legs.length : 1;

      legs.forEach((leg, index) => {
        // Each leg owns a slice of the route's window, so the line travels the
        // circuit once rather than every leg growing at the same time.
        const drawn = clamp01((routeIn - index * share) / share);
        if (drawn <= 0) return;

        const touchesActive = activeIndex === index || activeIndex === index + 1;
        strokeLeg(leg, drawn, touchesActive ? 0.5 : 0.14, touchesActive ? 1.4 : 1);
      });

      // The travelling pulse waits for the route it runs on.
      if (!reduceMotion && legs.length && intro >= 1) {
        const cycle = legs.length * LEG_MS;
        const tc = tourClock % cycle;
        const legIndex = Math.floor(tc / LEG_MS);
        const within = tc - legIndex * LEG_MS;
        const leg = legs[legIndex];

        if (within < FLY_MS) {
          const raw = within / FLY_MS;
          const eased = 0.5 - 0.5 * Math.cos(Math.PI * raw);
          strokeLeg(leg, eased, 0.55, 1.5);

          const head = Math.max(1, Math.floor(eased * (leg.length - 1)));
          const p = project(leg[head], legLift(head, leg.length));
          if (p.z > 0) drawComet(p);
        } else {
          strokeLeg(leg, 1, 0.55, 1.5);
        }
      }

      tourCities.forEach((city, index) => {
        const appear = clamp01(
          (intro - (MARKER_START + index * MARKER_STAGGER)) / MARKER_IN,
        );
        drawMarker(
          city,
          time,
          active?.name === city.name,
          tourRoute.includes(city.name),
          appear,
        );
      });

      // Leader line out to the information card.
      if (active) {
        const p = projectCity(active);
        const side: GlobeAnchor["side"] = p.x > width * 0.6 ? "left" : "right";
        const dir = side === "right" ? 1 : -1;
        const reach = width < 640 ? 26 : 44;

        ctx.strokeStyle = `rgba(${ACCENT}, 0.55)`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(p.x + dir * 8, p.y);
        ctx.lineTo(p.x + dir * reach, p.y);
        ctx.stroke();

        // Keep the card inside the frame — the section clips its overflow.
        const CARD_HALF_HEIGHT = 100;
        const anchorY = Math.min(
          Math.max(p.y, CARD_HALF_HEIGHT),
          Math.max(CARD_HALF_HEIGHT, height - CARD_HALF_HEIGHT),
        );

        publishAnchor({ x: p.x + dir * reach, y: anchorY, side });
      } else {
        publishAnchor(null);
      }
    };

    /* ── Pointer interaction ─────────────────────────────────────────────── */

    const hitTest = (clientX: number, clientY: number, tolerance: number) => {
      const rect = canvas.getBoundingClientRect();
      const mx = clientX - rect.left;
      const my = clientY - rect.top;
      let hit: string | null = null;
      let best = tolerance;

      tourCities.forEach((city) => {
        const p = projectCity(city);
        if (p.z <= 0.02) return; // not on the visible hemisphere
        const distance = Math.hypot(p.x - mx, p.y - my);
        if (distance < best) {
          best = distance;
          hit = city.name;
        }
      });

      return hit;
    };

    let hovered: string | null = null;

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const hit = hitTest(event.clientX, event.clientY, 18);
      canvas.style.cursor = hit ? "pointer" : "default";
      if (hit === hovered) return;
      hovered = hit;
      hoverHandlerRef.current(hit);
    };

    const onPointerLeave = () => {
      if (hovered === null) return;
      hovered = null;
      hoverHandlerRef.current(null);
    };

    const onPointerDown = (event: PointerEvent) => {
      const hit = hitTest(
        event.clientX,
        event.clientY,
        event.pointerType === "mouse" ? 18 : 28,
      );
      if (hit) selectHandlerRef.current(hit);
    };

    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerleave", onPointerLeave);
    canvas.addEventListener("pointerdown", onPointerDown);

    /* ── Lifecycle ───────────────────────────────────────────────────────── */

    const start = () => {
      if (frameId !== null) return;
      lastTs = null;
      frameId = requestAnimationFrame(frame);
    };

    const stop = () => {
      if (frameId === null) return;
      cancelAnimationFrame(frameId);
      frameId = null;
    };

    layout();
    cacheRotation();
    start();

    const resizeObserver = new ResizeObserver(() => layout());
    resizeObserver.observe(container);

    const inViewObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => (entry.isIntersecting ? start() : stop()));
      },
      { threshold: 0.05 },
    );
    inViewObserver.observe(container);

    return () => {
      stop();
      resizeObserver.disconnect();
      inViewObserver.disconnect();
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      canvas.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0">
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={`Rotating globe of the DJ Ganesh tour: ${tourCities
          .map((city) => city.name)
          .join(", ")}. The city list below gives the same information.`}
        className="h-full w-full touch-pan-y"
      />
    </div>
  );
}
