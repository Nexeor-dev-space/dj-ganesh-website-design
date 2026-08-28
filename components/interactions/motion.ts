/**
 * Pure motion helpers shared by the cursor and the knob.
 *
 * Kept free of DOM and React so the feel can be tuned — and reasoned about —
 * in one place. Every function is frame-local: given the current value it
 * returns the next one.
 */

/**
 * Moves `current` a fraction of the way toward `target`.
 * `factor` is per-frame at 60fps: lower trails further behind.
 */
export function approach(current: number, target: number, factor: number): number {
  return current + (target - current) * factor;
}

export type Spin = { angle: number; velocity: number };

/**
 * Advances a dial. Horizontal pointer travel adds torque, the spin then bleeds
 * off through `damping`, so releasing the pointer lets the knob coast to rest
 * rather than stopping dead.
 */
export function spinStep(
  spin: Spin,
  pointerVelocityX: number,
  torque: number,
  damping = 0.9,
): Spin {
  const velocity = (spin.velocity + pointerVelocityX * torque * 0.06) * damping;
  return { angle: spin.angle + velocity, velocity };
}

/** True once a dial has effectively come to rest. */
export function isSettled(spin: Spin, epsilon = 0.01): boolean {
  return Math.abs(spin.velocity) < epsilon;
}
