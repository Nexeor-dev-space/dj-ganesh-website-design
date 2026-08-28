/**
 * A one-owner-at-a-time claim on audible audio.
 *
 * The site has two independent sources — the site-wide background mix and the
 * Music section's player. Both are legitimate; neither should ever be heard
 * over the other. Rather than wiring them together through React (they sit on
 * different branches of the tree), each claims the bus when it starts and
 * releases it when it stops, and both listen for someone else taking over.
 */

export type AudioOwner = "background" | "music";

let owner: AudioOwner | null = null;
const subscribers = new Set<(owner: AudioOwner | null) => void>();

function notify() {
  for (const callback of subscribers) callback(owner);
}

/** Take the bus. Any other source is expected to silence itself. */
export function claimAudio(next: AudioOwner) {
  if (owner === next) return;
  owner = next;
  notify();
}

/** Give the bus up, but only if you still hold it. */
export function releaseAudio(previous: AudioOwner) {
  if (owner !== previous) return;
  owner = null;
  notify();
}

export function getAudioOwner(): AudioOwner | null {
  return owner;
}

export function subscribeAudioOwner(
  callback: (owner: AudioOwner | null) => void,
): () => void {
  subscribers.add(callback);
  return () => {
    subscribers.delete(callback);
  };
}
