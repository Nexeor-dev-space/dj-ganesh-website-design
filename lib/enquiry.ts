import { eventTypes } from "../data/contact.ts";

/** Everything the booking form collects. Empty strings, never `undefined`. */
export type EnquiryValues = {
  name: string;
  email: string;
  phone: string;
  organisation: string;
  eventType: string;
  eventDate: string;
  location: string;
  audience: string;
  budget: string;
  message: string;
  honeypot?: string;
};

export type EnquiryErrors = Partial<Record<keyof EnquiryValues, string>>;

export const emptyEnquiry: EnquiryValues = {
  name: "",
  email: "",
  phone: "",
  organisation: "",
  eventType: "",
  eventDate: "",
  location: "",
  audience: "",
  budget: "",
  message: "",
  honeypot: "",
};

/** Today in the input's own `YYYY-MM-DD` shape, in the visitor's timezone. */
export function today(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

/**
 * Deliberately loose: one `@`, something either side, a dot in the domain.
 * A stricter pattern rejects addresses that are perfectly valid, and the real
 * check is whether the reply lands.
 */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Returns a message per field that needs one. Phone, organisation, audience
 * and budget are optional and never produce an error.
 */
export function validateEnquiry(
  values: EnquiryValues,
  /** The event types the form offers; the built-in list when not given. */
  types: readonly string[] = eventTypes,
): EnquiryErrors {
  const errors: EnquiryErrors = {};

  if (!values.name.trim()) errors.name = "Please enter your name.";
  if (!EMAIL.test(values.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }
  if (!types.includes(values.eventType)) {
    errors.eventType = "Please select an event type.";
  }
  if (!values.eventDate) {
    errors.eventDate = "Please select an event date.";
  } else if (values.eventDate < today()) {
    errors.eventDate = "Please choose a date that hasn't passed.";
  }
  if (!values.location.trim()) {
    errors.location = "Please enter the event location.";
  }
  if (values.message.trim().length < 10) {
    errors.message = "Please tell us a little about your event.";
  }

  return errors;
}

/** The enquiry as an email, in the order it is useful to read. */
export function composeEnquiry(values: EnquiryValues) {
  const line = (label: string, value: string) =>
    value.trim() ? `${label}: ${value.trim()}` : null;

  const body = [
    line("Name", values.name),
    line("Email", values.email),
    line("Phone", values.phone),
    line("Event / organisation", values.organisation),
    line("Event type", values.eventType),
    line("Date", values.eventDate),
    line("Location", values.location),
    line("Expected audience", values.audience),
    line("Budget", values.budget),
    "",
    values.message.trim(),
  ]
    .filter((entry) => entry !== null)
    .join("\n");

  const subject = `Booking enquiry — ${values.eventType} — ${values.eventDate}`;

  return { subject, body };
}

export type EnquiryOutcome = "handed-off" | "failed";

/**
 * Submits the enquiry to Payload CMS (/api/contact-submissions).
 *
 * Sends dedicated structured fields for eventDate, location, audience,
 * budget, and organisation, while preserving message for additional details.
 * Includes honeypot spam protection and triggers email notification to the
 * booking inbox.
 *
 * Returns "handed-off" only when the API responds with a successful OK status (2xx).
 */
export async function submitEnquiry(
  values: EnquiryValues,
): Promise<EnquiryOutcome> {
  try {
    const res = await fetch("/api/contact-submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        organisation: values.organisation.trim(),
        eventType: values.eventType,
        eventDate: values.eventDate || null,
        location: values.location.trim(),
        audience: values.audience.trim(),
        budget: values.budget.trim(),
        message: values.message.trim(),
        honeypot: values.honeypot || "",
      }),
    });
    return res.ok ? "handed-off" : "failed";
  } catch {
    return "failed";
  }
}
