/**
 * A single shared pointer tracker.
 *
 * One set of window listeners serves every interaction component, and the
 * state is read from a mutable object inside each consumer's own animation
 * frame — so pointer movement never triggers a React re-render.
 */

export type PointerTargetKind = "default" | "interactive" | "play";

export type PointerState = {
  /** Latest viewport coordinates. */
  x: number;
  y: number;
  /** Pixels per frame, smoothed — drives the knob's rotation. */
  vx: number;
  vy: number;
  /** False before the first move, and while the pointer is outside the window. */
  visible: boolean;
  /** Whether the pointer is over something the cursor should react to. */
  target: PointerTargetKind;
};

const state: PointerState = {
  x: 0,
  y: 0,
  vx: 0,
  vy: 0,
  visible: false,
  target: "default",
};

const subscribers = new Set<() => void>();

let lastX = 0;
let lastY = 0;
let lastTime = 0;
let listening = false;

const INTERACTIVE_SELECTOR = 'a, button, input, select, textarea, [data-cursor], [role="button"]';

function resolveTarget(node: EventTarget | null): PointerTargetKind {
  if (!(node instanceof Element)) return "default";

  const match = node.closest(INTERACTIVE_SELECTOR);
  if (!match) return "default";

  const explicit = match.getAttribute("data-cursor");
  if (explicit === "play") return "play";

  return "interactive";
}

function onPointerMove(event: PointerEvent) {
  const now = event.timeStamp;
  const elapsed = lastTime ? Math.max(now - lastTime, 1) : 16;

  // Normalise to "pixels per 16ms frame" so velocity is refresh-rate agnostic.
  const frames = elapsed / 16;
  const instantVx = (event.clientX - lastX) / frames;
  const instantVy = (event.clientY - lastY) / frames;

  // Light smoothing keeps the rotation from twitching on jittery input.
  state.vx += (instantVx - state.vx) * 0.35;
  state.vy += (instantVy - state.vy) * 0.35;

  state.x = event.clientX;
  state.y = event.clientY;
  state.target = resolveTarget(event.target);

  if (!state.visible) {
    state.visible = true;
    notify();
  }

  lastX = event.clientX;
  lastY = event.clientY;
  lastTime = now;
}

function onPointerLeave() {
  state.visible = false;
  state.vx = 0;
  state.vy = 0;
  notify();
}

function notify() {
  for (const callback of subscribers) callback();
}

function startListening() {
  if (listening) return;
  listening = true;

  window.addEventListener("pointermove", onPointerMove, { passive: true });
  document.addEventListener("pointerleave", onPointerLeave);
  window.addEventListener("blur", onPointerLeave);
}

function stopListening() {
  if (!listening) return;
  listening = false;

  window.removeEventListener("pointermove", onPointerMove);
  document.removeEventListener("pointerleave", onPointerLeave);
  window.removeEventListener("blur", onPointerLeave);

  lastTime = 0;
  state.visible = false;
  state.vx = 0;
  state.vy = 0;
}

/**
 * Attaches the shared listeners on first use and tears them down again once
 * the last consumer unmounts. `onVisibilityChange` fires only when the pointer
 * enters or leaves — never per move.
 */
export function subscribeToPointer(onVisibilityChange: () => void): () => void {
  subscribers.add(onVisibilityChange);
  startListening();

  return () => {
    subscribers.delete(onVisibilityChange);
    if (subscribers.size === 0) stopListening();
  };
}

/** Live pointer state. Read it inside an animation frame; never mutate it. */
export function readPointer(): Readonly<PointerState> {
  return state;
}

/** Velocity decays on its own so the knob settles when the pointer stops. */
export function decayPointerVelocity(factor: number) {
  state.vx *= factor;
  state.vy *= factor;
}
