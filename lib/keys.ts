/**
 * A React list key that two identical CMS entries can never share: the
 * entry's CMS id when it carries one, otherwise its position in the list.
 * Keying by a name or a line of copy breaks as soon as an editor enters the
 * same text twice.
 */
export function itemKey(item: unknown, index: number): string | number {
  const id = item && typeof item === "object" ? (item as { id?: unknown }).id : undefined;
  return typeof id === "string" || typeof id === "number" ? id : index;
}
