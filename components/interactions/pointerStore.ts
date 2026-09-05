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
  /** False before the first move, and while the pointer is outside the window. */
  visible: boolean;
  /** Whether the pointer is over something the cursor should react to. */
  target: PointerTargetKind;
};

const state: PointerState = {
  x: 0,
  y: 0,
  visible: false,
  target: "default",
};

const subscribers = new Set<() => void>();

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
  state.x = event.clientX;
  state.y = event.clientY;
  state.target = resolveTarget(event.target);

  if (!state.visible) {
    state.visible = true;
    notify();
  }
}

function onPointerLeave() {
  state.visible = false;
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

  state.visible = false;
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
