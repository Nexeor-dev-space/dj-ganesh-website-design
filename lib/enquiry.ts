import { bookingEmail, eventTypes } from "@/data/contact";

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
export function validateEnquiry(values: EnquiryValues): EnquiryErrors {
  const errors: EnquiryErrors = {};

  if (!values.name.trim()) errors.name = "Please enter your name.";
  if (!EMAIL.test(values.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }
  if (!eventTypes.includes(values.eventType as (typeof eventTypes)[number])) {
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
 * The one place a backend plugs in.
 *
 * There is no endpoint on this project — no API route, no action, no form
 * service — so nothing here claims to have delivered anything. What it does
 * instead is real: it hands the composed enquiry to the visitor's own mail
 * client, addressed and filled in, which is the same path every other booking
 * control on this site uses.
 *
 * To connect a service later, replace the body of this function with the
 * request and return "handed-off" on success. The form's states, validation
 * and copy are already written against this contract, and the success panel
 * says the enquiry is ready to send rather than that it was received — keep
 * that honest if the mailto stays.
 */
export async function submitEnquiry(
  values: EnquiryValues,
): Promise<EnquiryOutcome> {
  const { subject, body } = composeEnquiry(values);
  const href = `mailto:${bookingEmail}?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(body)}`;

  try {
    window.location.href = href;
    return "handed-off";
  } catch {
    return "failed";
  }
}
