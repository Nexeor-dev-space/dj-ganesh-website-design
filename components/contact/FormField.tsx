import type { ReactNode } from "react";

type FormFieldProps = {
  id: string;
  label: string;
  /** Shown beside the label when a field can be left empty. */
  optional?: boolean;
  error?: string;
  /** Spans both columns of the grid from `md` up. */
  wide?: boolean;
  children: ReactNode;
};

/**
 * One labelled field.
 *
 * The label is always present — placeholders disappear the moment someone
 * types, so they cannot be the only name a control has. The error is rendered
 * in a live region tied to the control by `aria-describedby`, so it is
 * announced when it appears rather than only seen.
 */
export function FormField({
  id,
  label,
  optional,
  error,
  wide,
  children,
}: FormFieldProps) {
  return (
    <p className="enquiry-field" data-wide={wide || undefined} data-invalid={!!error || undefined}>
      <label htmlFor={id} className="enquiry-field__label">
        {label}
        {optional ? <span className="enquiry-field__optional"> (optional)</span> : null}
      </label>

      {children}

      <span id={`${id}-error`} role="alert" className="enquiry-field__error">
        {error}
      </span>
    </p>
  );
}
