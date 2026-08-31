"use client";

import { useRef, useState, type FormEvent } from "react";
import { FormField } from "@/components/contact/FormField";
import { enquiryMeta, eventTypes } from "@/data/contact";
import {
  emptyEnquiry,
  submitEnquiry,
  today,
  validateEnquiry,
  type EnquiryErrors,
  type EnquiryValues,
} from "@/lib/enquiry";

type Status = "idle" | "sending" | "sent" | "failed";

/**
 * The booking enquiry form.
 *
 * Validation runs on submit rather than on every keystroke — being corrected
 * mid-word while still typing an address is the most irritating pattern in
 * forms — and after that a field re-checks itself as it is edited, so an
 * error clears the moment it is fixed. A failed submit moves focus to the
 * first field that needs attention, which is the only way a keyboard or
 * screen reader user learns what stopped it.
 *
 * Nothing here claims an enquiry was delivered. `submitEnquiry` hands the
 * composed message to the visitor's own mail client — the same route every
 * other booking control on this site takes — and the panel below says exactly
 * that. See `lib/enquiry.ts` for the single seam a real endpoint plugs into.
 */
export function BookingForm() {
  const [values, setValues] = useState<EnquiryValues>(emptyEnquiry);
  const [errors, setErrors] = useState<EnquiryErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const formRef = useRef<HTMLFormElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const set = (field: keyof EnquiryValues) => (value: string) => {
    setValues((current) => ({ ...current, [field]: value }));

    // Only re-check a field that is already showing an error, so the form
    // never starts complaining about something still being typed.
    setErrors((current) => {
      if (!current[field]) return current;
      const next = validateEnquiry({ ...values, [field]: value });
      const merged = { ...current };
      if (next[field]) merged[field] = next[field];
      else delete merged[field];
      return merged;
    });
  };

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const found = validateEnquiry(values);
    setErrors(found);

    const firstInvalid = Object.keys(found)[0];
    if (firstInvalid) {
      const control = formRef.current?.elements.namedItem(firstInvalid);
      if (control instanceof HTMLElement) control.focus();
      return;
    }

    setStatus("sending");
    const outcome = await submitEnquiry(values);
    setStatus(outcome === "handed-off" ? "sent" : "failed");
    // The panel replaces the form, so focus has to follow it.
    window.requestAnimationFrame(() => panelRef.current?.focus());
  }

  if (status === "sent") {
    return (
      <div
        ref={panelRef}
        tabIndex={-1}
        role="status"
        className="enquiry-done reveal-fade"
      >
        <p className="enquiry-done__title">Thank you.</p>
        <p className="enquiry-done__lede">
          Your enquiry is composed and waiting in your mail app — send it and
          we&apos;ll get back to you as soon as possible.
        </p>

        <button
          type="button"
          onClick={() => {
            setValues(emptyEnquiry);
            setErrors({});
            setStatus("idle");
          }}
          className="enquiry-done__again"
        >
          Send another enquiry
          <span aria-hidden> →</span>
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="enquiry-form">
      <div className="enquiry-grid">
        <FormField id="name" label="Name" error={errors.name}>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Your name"
            value={values.name}
            onChange={(event) => set("name")(event.target.value)}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
            className="enquiry-input"
          />
        </FormField>

        <FormField id="email" label="Email" error={errors.email}>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="your@email.com"
            value={values.email}
            onChange={(event) => set("email")(event.target.value)}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            className="enquiry-input"
          />
        </FormField>

        <FormField id="phone" label="Phone" optional>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="Your phone number"
            value={values.phone}
            onChange={(event) => set("phone")(event.target.value)}
            className="enquiry-input"
          />
        </FormField>

        <FormField id="organisation" label="Event / organisation" optional>
          <input
            id="organisation"
            name="organisation"
            type="text"
            placeholder="Event, venue or organisation"
            value={values.organisation}
            onChange={(event) => set("organisation")(event.target.value)}
            className="enquiry-input"
          />
        </FormField>

        <FormField id="eventType" label="Event type" error={errors.eventType}>
          <span className="enquiry-select">
            <select
              id="eventType"
              name="eventType"
              value={values.eventType}
              onChange={(event) => set("eventType")(event.target.value)}
              aria-invalid={!!errors.eventType}
              aria-describedby={errors.eventType ? "eventType-error" : undefined}
              className="enquiry-input"
            >
              <option value="">Select an event type</option>
              {eventTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <span aria-hidden className="enquiry-select__arrow">
              ↓
            </span>
          </span>
        </FormField>

        <FormField id="eventDate" label="Event date" error={errors.eventDate}>
          <input
            id="eventDate"
            name="eventDate"
            type="date"
            min={today()}
            value={values.eventDate}
            onChange={(event) => set("eventDate")(event.target.value)}
            aria-invalid={!!errors.eventDate}
            aria-describedby={errors.eventDate ? "eventDate-error" : undefined}
            className="enquiry-input"
          />
        </FormField>

        <FormField id="location" label="Location" error={errors.location}>
          <input
            id="location"
            name="location"
            type="text"
            placeholder="City, Country"
            value={values.location}
            onChange={(event) => set("location")(event.target.value)}
            aria-invalid={!!errors.location}
            aria-describedby={errors.location ? "location-error" : undefined}
            className="enquiry-input"
          />
        </FormField>

        <FormField id="audience" label="Expected audience" optional>
          <input
            id="audience"
            name="audience"
            type="text"
            inputMode="numeric"
            placeholder="Approximate number of guests"
            value={values.audience}
            onChange={(event) => set("audience")(event.target.value)}
            className="enquiry-input"
          />
        </FormField>

        <FormField id="budget" label="Budget / fee range" optional wide>
          <input
            id="budget"
            name="budget"
            type="text"
            placeholder="Optional"
            value={values.budget}
            onChange={(event) => set("budget")(event.target.value)}
            className="enquiry-input"
          />
        </FormField>

        <FormField id="message" label="Message" error={errors.message} wide>
          <textarea
            id="message"
            name="message"
            rows={6}
            placeholder="Tell us about your event, venue, timings and anything else we should know."
            value={values.message}
            onChange={(event) => set("message")(event.target.value)}
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? "message-error" : undefined}
            className="enquiry-input enquiry-input--area"
          />
        </FormField>
      </div>

      {status === "failed" ? (
        <p role="alert" className="enquiry-form__failed">
          Something went wrong. Please try again, or email us directly using the
          address below.
        </p>
      ) : null}

      <button type="submit" data-cursor="book" className="enquiry-submit btn-sweep btn-sweep--onAccent">
        {status === "sending" ? "Sending…" : enquiryMeta.submitLabel}
        <span aria-hidden className="enquiry-submit__arrow">
          →
        </span>
      </button>
    </form>
  );
}
