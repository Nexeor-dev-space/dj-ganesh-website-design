import type { Testimonial as TestimonialData } from "@/types/testimonials";

type TestimonialProps = {
  testimonial: TestimonialData;
};

/**
 * One reaction, set as a card in the running band.
 *
 * A fixed-width panel rather than a row of a table: the quotes now travel past
 * the reader instead of stacking, so each one has to be a self-contained unit
 * of the same size — a hairline frame, the number and the mark at the top, the
 * words, then the attribution held to the foot so every card's baseline of
 * names lines up as the run goes by.
 */
export function Testimonial({ testimonial }: TestimonialProps) {
  return (
    <li className="reaction-card">
      <div className="reaction-card__head">
        {/* The list is ordered; the number is decoration for the eye. */}
        <span className="reaction-card__index" aria-hidden>
          {testimonial.id}
        </span>
        <span className="reaction-card__mark" aria-hidden>
          &ldquo;
        </span>
      </div>

      <blockquote className="reaction-card__quote">
        <p className="reaction-card__text">{testimonial.quote}</p>
      </blockquote>

      <p className="reaction-card__by">
        <cite className="reaction-card__author">{testimonial.author}</cite>
        <span className="reaction-card__place">{testimonial.location}</span>
      </p>
    </li>
  );
}
