"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

/** Mask buffer resolution relative to the layer. Coarser on touch, for budget. */
const MASK_SCALE_FINE = 0.5;
const MASK_SCALE_COARSE = 0.4;

/** Particles emitted per frame while the plume is being driven. */
const EMIT_PER_FRAME = 4;

/** Frames a particle lives for. At 60fps this is a touch under a second. */
const PARTICLE_LIFE = 54;

/**
 * Particle radius in CSS px at birth and death — wisps widen as they thin out.
 * Tuned against `REFERENCE_WIDTH` and scaled to the layer, so the plume stays
 * proportionate on a phone instead of swamping the frame.
 */
const RADIUS_START = 26;
const RADIUS_END = 58;
const REFERENCE_WIDTH = 1280;

/** Upward pull, in px/frame². What makes the plume rise like flame. */
const BUOYANCY = 0.13;

/** Strength of the swirling field that fingers the plume out. */
const SWIRL = 0.1;

/** Per-frame velocity damping. */
const DRAG = 0.94;

/** How much of the pointer's own motion a new particle inherits. */
const INHERIT = 0.22;

/** Frames without real input before touch devices fall back to an ambient drift. */
const AMBIENT_IDLE_FRAMES = 80;

/** Frames to keep simulating after input stops, so the plume can burn out. */
const IDLE_FRAMES = PARTICLE_LIFE + 20;

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  seed: number;
};


type ColourPlumeProps = {
  /** Frame the plume reveals. Also the canvas's draw source — fetched once. */
  src: string;
  /** Classes for the wrapper. Must position the layer within its section. */
  className?: string;
  /**
   * Classes for the source image: object-fit/position, any grade, and its
   * visibility. Pass `opacity-0` for sections where only the plume should
   * show the frame and the rest of the background stays dark — the canvas
   * draws from the image's own pixels, which CSS opacity does not touch.
   */
  imageClassName?: string;
  priority?: boolean;
  sizes?: string;
  /**
   * What the plume's size is measured against.
   *
   * `layer` keeps it proportionate to the frame it burns in, which is right
   * for a full-bleed background. `viewport` sizes it as though the frame were
   * the width of the screen — for a framed image that should still carry the
   * same fire as the banner, rather than a scaled-down copy of it.
   */
  sizing?: "layer" | "viewport";
  /**
   * Describes the frame where it carries meaning, as the footer's does.
   * Left empty the layer stays decorative and out of the accessibility tree,
   * which is what a full-bleed background wants.
   */
  alt?: string;
};

/**
 * A frame of photography revealed only through a drifting plume of colour.
 *
 * Particles are emitted at the pointer, each inheriting a little of its
 * motion before rising, swirling and fading out. The result reads as a
 * floating flame that smears behind fast movement and burns away once input
 * stops. Touch devices get it too: the plume follows a finger while one is
 * down, and falls back to a slow ambient drift otherwise, so the effect is
 * visible to someone who only ever scrolls past.
 *
 * The reference this is modelled on does the same thing with a Navier-Stokes
 * fluid solver, revealing colour through the dissipating density field. A
 * buoyant particle plume is the same silhouette for a fraction of the
 * machinery — no GPU pressure solve, and it scales down to a phone rather
 * than holding a WebGL context open.
 *
 * The canvas draws from the very `<img>` next/image already rendered, so the
 * colour pass costs no extra request and — by reading that image's own
 * `object-position` — lines up exactly with it at every breakpoint.
 */
export function ColourPlume({
  src,
  className,
  imageClassName,
  priority,
  sizes = "100vw",
  sizing = "layer",
  alt = "",
}: ColourPlumeProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarse = window.matchMedia("(pointer: coarse)");

    // Whether the plume should run is re-evaluated on every media change
    // rather than only at mount, so switching input type (or mounting before
    // layout has settled) starts and stops it correctly.
    let stop: (() => void) | null = null;

    const sync = () => {
      stop?.();
      stop = null;
      if (reducedMotion.matches) return;

      // The region the plume answers to: a `[data-plume-region]` wrapper when
      // one frame is shared across several sections, otherwise the single
      // section the layer sits in. Pointer movement outside it is ignored.
      const bounds =
        root.closest("[data-plume-region]") ?? root.closest("section");
      const photo = root.querySelector("img");
      if (bounds && photo) {
        stop = runColourPlume(canvas, bounds, photo, coarse.matches, sizing);
      }
    };

    sync();
    reducedMotion.addEventListener("change", sync);
    coarse.addEventListener("change", sync);

    return () => {
      reducedMotion.removeEventListener("change", sync);
      coarse.removeEventListener("change", sync);
      stop?.();
    };
  }, [sizing]);

  return (
    <div ref={rootRef} className={className} aria-hidden={alt ? undefined : true}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className={imageClassName}
      />
      <canvas
        ref={canvasRef}
        className="plume-canvas absolute inset-0 h-full w-full"
      />
    </div>
  );
}

/**
 * One soft round sprite, drawn once and then blitted per particle — far cheaper
 * than building a fresh radial gradient for every particle every frame.
 */
function createBrush(): HTMLCanvasElement {
  const size = 128;
  const brush = document.createElement("canvas");
  brush.width = size;
  brush.height = size;

  const bctx = brush.getContext("2d");
  if (bctx) {
    const half = size / 2;
    const gradient = bctx.createRadialGradient(half, half, 0, half, half, half);
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.4, "rgba(255,255,255,0.62)");
    gradient.addColorStop(0.72, "rgba(255,255,255,0.2)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    bctx.fillStyle = gradient;
    bctx.fillRect(0, 0, size, size);
  }

  return brush;
}

/**
 * Resolves one axis of a computed `object-position` into a pixel offset.
 *
 * `free` is the leftover space on that axis (container minus drawn size, so
 * normally negative). Percentages align that fraction of the image with the
 * same fraction of the box — the background-position rule — while lengths are
 * a straight offset from the start edge.
 */
function resolveObjectPosition(token: string | undefined, free: number): number {
  if (!token) return free * 0.5;
  if (token === "left" || token === "top") return 0;
  if (token === "right" || token === "bottom") return free;
  if (token === "center") return free * 0.5;
  if (token.endsWith("%")) return free * (parseFloat(token) / 100);
  if (token.endsWith("px")) return parseFloat(token);
  return free * 0.5;
}

/**
 * Runs the colour plume until the returned teardown is called.
 *
 * Split out of the component so the effect above only decides *whether* the
 * plume should run, not how it works.
 */
function runColourPlume(
  canvas: HTMLCanvasElement,
  /** The area the pointer has to be inside for the plume to burn. */
  bounds: Element,
  photo: HTMLImageElement,
  isTouch: boolean,
  sizing: "layer" | "viewport",
): (() => void) | null {
  const ctx = canvas.getContext("2d");
  const mask = document.createElement("canvas");
  const mctx = mask.getContext("2d");
  if (!ctx || !mctx) return null;

  const brush = createBrush();
  const maskScale = isTouch ? MASK_SCALE_COARSE : MASK_SCALE_FINE;

  // Layer size in CSS px; each buffer gets its own device-pixel backing store.
  let width = 0;
  let height = 0;
  let scale = 1;

  const resize = () => {
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    if (!width || !height) return;

    // Keep the plume proportionate to the frame it burns in — or to the
    // screen, for a frame narrower than the page that should still carry the
    // banner's fire rather than a shrunken copy of it. Measured off the layer,
    // a 500px frame lands on the 0.6 floor while a full-bleed banner runs at
    // 1.1, and the same effect reads at half the size in one and not the other.
    const basis = sizing === "viewport" ? window.innerWidth : width;
    scale = Math.min(1.5, Math.max(0.6, basis / REFERENCE_WIDTH));

    const dpr = Math.min(window.devicePixelRatio || 1, isTouch ? 1.5 : 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    mask.width = Math.max(1, Math.round(width * maskScale));
    mask.height = Math.max(1, Math.round(height * maskScale));
    mctx.setTransform(maskScale, 0, 0, maskScale, 0, 0);
  };

  resize();
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas);

  const particles: Particle[] = [];
  let pointerX = 0;
  let pointerY = 0;
  let lastX = 0;
  let lastY = 0;
  let driving = false;
  let entering = true;
  let idle = IDLE_FRAMES;
  let sinceInput = AMBIENT_IDLE_FRAMES;
  let time = 0;
  let frame = 0;

  /** Points the emitter at a spot in canvas-local coordinates. */
  const aim = (x: number, y: number) => {
    pointerX = x;
    pointerY = y;
    if (entering) {
      lastX = x;
      lastY = y;
      entering = false;
    }
    driving = true;
    idle = 0;
  };

  /**
   * Regions nested inside this one, re-read at most once a frame.
   *
   * The list is not fixed for the layer's lifetime: the page-wide region wraps
   * `children`, so it outlives navigation while the regions inside it come and
   * go with the route. Reading it per frame rather than per pointer move keeps
   * that correct without a DOM query on every move.
   */
  let nested: Element[] = [];
  let nestedDirty = true;

  const nestedRegions = () => {
    if (nestedDirty) {
      nested = Array.from(bounds.querySelectorAll("[data-plume-region]"));
      nestedDirty = false;
    }
    return nested;
  };

  /**
   * Whether a point belongs to a region nested inside this one.
   *
   * A nested region keeps its own photograph, so this plume has to stop at its
   * edge. The banner is the case this exists for: it sits inside the page-wide
   * region the layout wraps every route in, and the page's layer paints *over*
   * the banner's own — so without this, the flame over the banner revealed the
   * page's frame instead of the banner's, in the page frame's colours.
   *
   * Tested geometrically rather than from the event's target, because the
   * things that sit over the banner — the fixed navigation, most of all — are
   * not inside its region even though they are inside its frame.
   */
  const inNestedRegion = (clientX: number, clientY: number) =>
    nestedRegions().some((region) => {
      const r = region.getBoundingClientRect();
      return (
        clientX >= r.left &&
        clientX <= r.right &&
        clientY >= r.top &&
        clientY <= r.bottom
      );
    });

  const onPointerMove = (event: PointerEvent) => {
    // On touch, only track while a finger is actually down; a stray hover from
    // a stylus proximity sensor shouldn't drive the plume.
    if (event.pointerType === "touch" && event.pressure === 0) return;

    const rect = bounds.getBoundingClientRect();
    const over =
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom;

    if (!over || inNestedRegion(event.clientX, event.clientY)) {
      driving = false;
      entering = true;
      return;
    }

    // Map the pointer into the canvas's own untransformed coordinates. Going
    // through the live rect means the drift and load-zoom transforms on the
    // ancestors are accounted for automatically.
    const canvasRect = canvas.getBoundingClientRect();
    if (!canvasRect.width || !canvasRect.height) return;

    sinceInput = 0;
    aim(
      ((event.clientX - canvasRect.left) / canvasRect.width) * width,
      ((event.clientY - canvasRect.top) / canvasRect.height) * height,
    );
  };

  const onPointerRelease = () => {
    driving = false;
    entering = true;
  };

  /** Emit along the path travelled this frame, so a fast flick leaves a tail. */
  const emit = () => {
    const dx = pointerX - lastX;
    const dy = pointerY - lastY;
    const jitter = 12 * scale;

    for (let i = 0; i < EMIT_PER_FRAME; i += 1) {
      const t = (i + 1) / EMIT_PER_FRAME;
      particles.push({
        x: lastX + dx * t + (Math.random() - 0.5) * jitter,
        y: lastY + dy * t + (Math.random() - 0.5) * jitter,
        vx: dx * INHERIT + (Math.random() - 0.5) * 0.7,
        vy: dy * INHERIT + (Math.random() - 0.5) * 0.7,
        life: PARTICLE_LIFE,
        seed: Math.random() * Math.PI * 2,
      });
    }

    lastX = pointerX;
    lastY = pointerY;
  };

  /** Is any part of the region the plume belongs to still on screen? */
  const boundsOnScreen = () => {
    const rect = bounds.getBoundingClientRect();
    return rect.bottom > 0 && rect.top < window.innerHeight;
  };

  const tick = () => {
    frame = requestAnimationFrame(tick);
    nestedDirty = true;
    if (!width || !height) return;

    time += 0.016;
    sinceInput += 1;

    // Touch devices may never produce a drag over the region — someone can just
    // scroll past. Keep the plume alive on a slow wander so they still see it.
    // Checked before the idle bail-out below, which would otherwise park the
    // loop before the plume ever got going. Skipped once the region has scrolled
    // away, so an off-screen frame isn't burning frames on a phone.
    if (isTouch && sinceInput > AMBIENT_IDLE_FRAMES && boundsOnScreen()) {
      const driftX = width * (0.5 + 0.26 * Math.cos(time * 0.62));
      const driftY = height * (0.55 + 0.15 * Math.sin(time * 0.94));

      // The drift has no pointer to tell it whose frame it is wandering over,
      // so it asks. Without this the page-wide plume drifts across the banner
      // on a phone and paints the page's frame over the banner's own — the
      // same leak as above, arriving without anyone touching the screen.
      const canvasRect = canvas.getBoundingClientRect();
      const overNested =
        canvasRect.width > 0 &&
        canvasRect.height > 0 &&
        inNestedRegion(
          canvasRect.left + (driftX / width) * canvasRect.width,
          canvasRect.top + (driftY / height) * canvasRect.height,
        );

      if (overNested) {
        driving = false;
        entering = true;
      } else {
        aim(driftX, driftY);
      }
    }

    if (!driving && idle >= IDLE_FRAMES && particles.length === 0) return;
    if (!driving) idle += 1;

    if (driving) emit();

    mctx.clearRect(0, 0, width, height);
    mctx.globalCompositeOperation = "lighter";

    const radiusStart = RADIUS_START * scale;
    const radiusSpan = (RADIUS_END - RADIUS_START) * scale;
    const buoyancy = BUOYANCY * scale;

    for (let i = particles.length - 1; i >= 0; i -= 1) {
      const p = particles[i];
      p.life -= 1;
      if (p.life <= 0) {
        particles.splice(i, 1);
        continue;
      }

      // A cheap divergence-free-ish field: each axis is driven by the other's
      // position, which curls the plume instead of just blowing it sideways.
      p.vx += Math.sin(p.y * 0.021 + time * 1.3 + p.seed) * SWIRL;
      p.vy += Math.cos(p.x * 0.019 - time * 1.1 + p.seed) * SWIRL - buoyancy;
      p.vx *= DRAG;
      p.vy *= DRAG;
      p.x += p.vx;
      p.y += p.vy;

      // Fade in briefly so new particles don't pop, then out over the tail.
      const age = 1 - p.life / PARTICLE_LIFE;
      const alpha = Math.min(1, age * 6) * (1 - age) ** 1.6;
      const radius = radiusStart + radiusSpan * age;

      mctx.globalAlpha = alpha * 0.55;
      mctx.drawImage(brush, p.x - radius, p.y - radius, radius * 2, radius * 2);
    }

    mctx.globalAlpha = 1;
    mctx.globalCompositeOperation = "source-over";

    // Paint the colour frame, then keep only what the plume covers.
    ctx.clearRect(0, 0, width, height);
    const iw = photo.naturalWidth;
    const ih = photo.naturalHeight;
    if (!iw || !ih) return;

    // Match the base image's own `object-cover` + `object-position`, which is
    // art-directed per breakpoint, so the two frames stay registered.
    const cover = Math.max(width / iw, height / ih);
    const dw = iw * cover;
    const dh = ih * cover;
    const [posX, posY] = window
      .getComputedStyle(photo)
      .objectPosition.split(" ");

    ctx.drawImage(
      photo,
      resolveObjectPosition(posX, width - dw),
      resolveObjectPosition(posY, height - dh),
      dw,
      dh,
    );
    ctx.globalCompositeOperation = "destination-in";
    ctx.drawImage(mask, 0, 0, width, height);
    ctx.globalCompositeOperation = "source-over";
  };

  window.addEventListener("pointermove", onPointerMove, { passive: true });
  window.addEventListener("pointerdown", onPointerMove, { passive: true });
  window.addEventListener("pointerup", onPointerRelease);
  window.addEventListener("pointercancel", onPointerRelease);
  document.addEventListener("pointerleave", onPointerRelease);
  frame = requestAnimationFrame(tick);

  return () => {
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerdown", onPointerMove);
    window.removeEventListener("pointerup", onPointerRelease);
    window.removeEventListener("pointercancel", onPointerRelease);
    document.removeEventListener("pointerleave", onPointerRelease);
    cancelAnimationFrame(frame);
    resizeObserver.disconnect();
  };
}
