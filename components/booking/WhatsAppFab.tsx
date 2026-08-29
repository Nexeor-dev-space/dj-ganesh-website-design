import {
  whatsappHref,
  whatsappLabel,
  whatsappNumber,
  whatsappPlaceholderNumber,
} from "@/data/booking";

/**
 * The floating booking button.
 *
 * One control, bottom-right, above every section: a WhatsApp glyph that opens
 * out into "Quick Booking" on hover or keyboard focus and collapses again when
 * the pointer leaves. No state and no library — the label is a track that goes
 * from zero width to its natural width, so the button is a server component
 * and costs the page nothing at runtime.
 *
 * The whole thing is one `<a>`, so the label is the accessible name at all
 * times, whether or not it happens to be showing.
 */
export function WhatsAppFab() {
  // Never ship a live link to the placeholder number. See `data/booking.ts`.
  if (
    whatsappNumber === whatsappPlaceholderNumber &&
    process.env.NODE_ENV === "production"
  ) {
    return null;
  }

  return (
    <a
      href={whatsappHref}
      target="_blank"
      rel="noreferrer noopener"
      data-cursor="book"
      className="whatsapp-fab"
    >
      <span className="whatsapp-fab__glyph" aria-hidden>
        <svg viewBox="0 0 24 24" fill="currentColor" focusable="false">
          <path d="M12.04 2C6.6 2 2.18 6.42 2.18 11.86c0 1.74.46 3.44 1.32 4.94L2 22l5.34-1.4a9.83 9.83 0 0 0 4.7 1.2h.01c5.43 0 9.85-4.42 9.85-9.86 0-2.63-1.02-5.1-2.88-6.96A9.78 9.78 0 0 0 12.04 2Zm0 1.8c2.15 0 4.17.84 5.69 2.36a8 8 0 0 1 2.36 5.7c0 4.45-3.62 8.06-8.06 8.06a8.2 8.2 0 0 1-4.16-1.14l-.3-.18-3.09.81.83-3.01-.2-.31a8.02 8.02 0 0 1-1.23-4.24c0-4.45 3.62-8.05 8.16-8.05Zm-3.4 4.3c-.16 0-.42.06-.64.3-.22.24-.85.83-.85 2.02s.87 2.34 1 2.5c.12.16 1.7 2.6 4.13 3.64.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.44-.59 1.64-1.16.2-.57.2-1.05.14-1.16-.06-.1-.22-.16-.46-.28-.24-.12-1.44-.71-1.66-.79-.22-.08-.38-.12-.54.12-.16.24-.62.79-.76.95-.14.16-.28.18-.52.06-.24-.12-1.03-.38-1.96-1.21-.72-.65-1.21-1.45-1.35-1.69-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.32-.76-1.8-.2-.47-.4-.41-.54-.42h-.46Z" />
        </svg>
      </span>

      {/* The track collapses to nothing until the button is hovered or
          focused; the text inside keeps its own width so it never reflows. */}
      <span className="whatsapp-fab__track">
        <span className="whatsapp-fab__label">{whatsappLabel}</span>
      </span>
    </a>
  );
}
