import type { Milestone } from "@/types/legacy";

type ArchiveLineProps = {
  milestones: readonly Milestone[];
  /** The milestone currently hovered, focused or open — its node lights up. */
  activeId: string | null;
};

/**
 * The thin rail that ties the six entries together.
 *
 * Presentational only, and hidden from assistive tech: every year it shows is
 * already announced by the block it belongs to, so a second set of controls
 * here would only add duplicate tab stops. The line draws itself in once the
 * section is in view, then each node tracks its block's state.
 */
export function ArchiveLine({ milestones, activeId }: ArchiveLineProps) {
  return (
    <div className="archive-line" aria-hidden>
      {milestones.map((milestone) => (
        <span
          key={milestone.id}
          data-active={milestone.id === activeId}
          className="archive-node"
        >
          <span className="archive-node__dot" />
          <span className="archive-node__year">{milestone.year}</span>
        </span>
      ))}
    </div>
  );
}
