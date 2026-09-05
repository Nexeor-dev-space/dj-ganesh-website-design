/**
 * Pure motion helper shared by the cursor's ring and dot.
 *
 * Kept free of DOM and React so the feel can be tuned — and reasoned about —
 * in one place. Frame-local: given the current value it returns the next one.
 */

/**
 * Moves `current` a fraction of the way toward `target`.
 * `factor` is per-frame at 60fps: lower trails further behind.
 */
export function approach(current: number, target: number, factor: number): number {
  return current + (target - current) * factor;
}
