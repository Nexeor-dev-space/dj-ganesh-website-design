import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import {
  AudioController,
  AudioPlayToggle,
} from "@/components/interactions/AudioController";
import { AudioVisualizer } from "@/components/interactions/AudioVisualizer";
import { CustomCursor } from "@/components/interactions/CustomCursor";
import { resolveHeroAudio } from "@/lib/media";

export const metadata: Metadata = {
  title: "Interaction sandbox",
  robots: { index: false, follow: false },
};

/**
 * Development sandbox for the interaction system. Not linked from the site —
 * it exists so the cursor, knob, audio engine and visualizer can be exercised
 * before the hero adopts them.
 */
export default function InteractionSandboxPage() {
  const audioSrc = resolveHeroAudio();

  return (
    <AudioController src={audioSrc}>
      <CustomCursor />

      <main className="min-h-svh py-4xl">
        <Container>
          <p className="text-[10px] uppercase tracking-[0.24em] text-accent">
            Interaction sandbox
          </p>
          <h1 className="font-display mt-md text-4xl font-bold uppercase tracking-tight">
            DJ visual system
          </h1>
          <p className="mt-md max-w-[640px] text-sm text-muted-foreground">
            Move the pointer to drive the knob. Hover the links and the play
            control to see the accent and energy states. Audio source:{" "}
            <span className="text-foreground">{audioSrc ?? "none supplied"}</span>.
          </p>

          <div className="mt-2xl flex flex-wrap items-center gap-2xl">
            <AudioPlayToggle />
            <AudioVisualizer />
          </div>

          <div className="mt-2xl flex flex-wrap items-center gap-xl">
            <a
              href="#"
              className="border-b border-white/25 pb-sm text-[11px] uppercase tracking-[0.24em] transition-colors hover:border-accent hover:text-accent"
            >
              Interactive link
            </a>
            <button
              type="button"
              className="border border-border px-md py-xs text-[11px] uppercase tracking-[0.24em] transition-colors hover:border-accent hover:text-accent"
            >
              Interactive button
            </button>
            <label className="flex items-center gap-sm text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
              Caret check
              <input
                type="text"
                className="border border-border bg-surface px-md py-xs text-foreground"
              />
            </label>
          </div>
        </Container>
      </main>
    </AudioController>
  );
}
