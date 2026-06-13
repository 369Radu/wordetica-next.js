"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ApiError } from "@/lib/api/http";
import { ContactApi } from "@/lib/api/contact";
import "./contact.scss";

// Mirrors Angular's Validators.email regex (empty value is treated as valid by it).
const EMAIL_REGEXP =
  /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

type FieldName = "name" | "email" | "subject" | "message";

const EMPTY_FORM = { name: "", email: "", subject: "", message: "" };

const EMPTY_FLAGS: Record<FieldName, boolean> = {
  name: false,
  email: false,
  subject: false,
  message: false,
};

function nameInvalid(value: string): boolean {
  return value.length === 0 || value.length < 2;
}

function emailInvalid(value: string): boolean {
  if (value.length === 0) return true; // required
  return !EMAIL_REGEXP.test(value);
}

function messageInvalid(value: string): boolean {
  return value.length === 0 || value.length < 10;
}

export function Contact() {
  const searchParams = useSearchParams();
  const topic = searchParams?.get('topic') ?? "";
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [touched, setTouched] = useState<Record<FieldName, boolean>>({ ...EMPTY_FLAGS });
  const [dirty, setDirty] = useState<Record<FieldName, boolean>>({ ...EMPTY_FLAGS });

  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    // const topic = searchParams.get("topic")?.trim();
    if (!topic) return;

    setForm((prev) => ({
      ...prev,
      subject: `Research article idea: ${topic}`,
      message:
        `I'd love to read a Wordetica article about ${topic}.\n\n` +
        "Here is what interests me:\n\n",
    }));
  }, [topic]);

  const invalid: Record<FieldName, boolean> = {
    name: nameInvalid(form.name),
    email: emailInvalid(form.email),
    subject: false,
    message: messageInvalid(form.message),
  };

  const formInvalid = invalid.name || invalid.email || invalid.message;

  const showError = (controlName: FieldName): boolean => {
    return invalid[controlName] && (dirty[controlName] || touched[controlName]);
  };

  const handleChange = (controlName: FieldName, value: string) => {
    setForm((prev) => ({ ...prev, [controlName]: value }));
    setDirty((prev) => ({ ...prev, [controlName]: true }));
  };

  const handleBlur = (controlName: FieldName) => {
    setTouched((prev) => ({ ...prev, [controlName]: true }));
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    setTouched({ name: true, email: true, subject: true, message: true });
    if (formInvalid || sending) return;

    setSending(true);
    setSubmitError(null);

    const { name, email, subject, message } = form;

    ContactApi.send({ name, email, subject, message }).then(
      () => {
        setSent(true);
        setSending(false);
        setForm({ ...EMPTY_FORM });
        setTouched({ ...EMPTY_FLAGS });
        setDirty({ ...EMPTY_FLAGS });
      },
      (err: unknown) => {
        setSending(false);
        const detail =
          err instanceof ApiError
            ? (err.error as { detail?: string } | null)?.detail
            : undefined;
        const msg = detail || "Something went wrong. Please try again or email us directly.";
        setSubmitError(msg);
      },
    );
  };

  return (
    <section className="wo-section">
      <div className="wo-container layout">
        <div className="intro wo-center">
          <span className="wo-tag">Contact</span>
          <h1>Tell us about your project.</h1>
          <p>
            Good language work starts with a real conversation. Whether you need translation, interpreting,
            language &amp; communication coaching or training on AI literacy and digital skills, tell us what
            you&apos;re trying to achieve - we&apos;ll take it from there.
          </p>
          <p>
            Interested in becoming a <strong>contributing author</strong>? We welcome researchers, practitioners,
            and language professionals who want to share their expertise through published work on Wordetica.
            Reach out and let&apos;s start the conversation.
          </p>
          <p>
            Write in <strong>EN, FR, DE, ES, or RO</strong>.
          </p>

          <ul className="info">
            <li>
              <strong>Email</strong>
              <a href="mailto:office@wordetica.eu">office@wordetica.eu</a>
            </li>
            <li className="info__locations-item">
              <strong>Locations</strong>
              <ul className="info__locations">
                <li>Trier, Germany</li>
                <li>Luxembourg, Luxembourg</li>
                <li>Brașov, Romania</li>
              </ul>
            </li>
          </ul>

          <figure className="contact-visual" aria-hidden="true">
            <img
              className="contact-visual__img"
              src="/assets/poza_contact.png"
              alt=""
              loading="lazy"
              decoding="async"
            />
          </figure>
        </div>

        <form className="form" onSubmit={submit} noValidate>
          <div className="field">
            <label className="wo-label" htmlFor="name">Your name</label>
            <input
              id="name"
              className="wo-input"
              autoComplete="name"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              onBlur={() => handleBlur("name")}
            />
          </div>

          <div className="field">
            <label className="wo-label" htmlFor="email">Email</label>
            <input
              id="email"
              className="wo-input"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              onBlur={() => handleBlur("email")}
            />
            {showError("email") && <p className="wo-error">Please provide a valid email.</p>}
          </div>

          <div className="field">
            <label className="wo-label" htmlFor="subject">Subject</label>
            <input
              id="subject"
              className="wo-input"
              value={form.subject}
              onChange={(e) => handleChange("subject", e.target.value)}
              onBlur={() => handleBlur("subject")}
            />
          </div>

          <div className="field">
            <label className="wo-label" htmlFor="message">Message</label>
            <textarea
              id="message"
              className="wo-textarea"
              rows={6}
              value={form.message}
              onChange={(e) => handleChange("message", e.target.value)}
              onBlur={() => handleBlur("message")}
            ></textarea>
            {showError("message") && <p className="wo-error">A short message is required.</p>}
          </div>

          <p className="form__legal">
            By sending this form, you agree to our{" "}
            <Link href="/privacy">Privacy Policy</Link>
            {" "}and{" "}
            <Link href="/terms">Terms of Service</Link>.
          </p>

          <button type="submit" className="wo-btn wo-btn--primary" disabled={formInvalid || sending}>
            {sending ? "Sending…" : "Send message"}
          </button>

          {sent && (
            <p className="wo-help form__success">
              Thanks! We received your message and will get back to you soon.
            </p>
          )}
          {submitError && <p className="wo-error">{submitError}</p>}
        </form>
      </div>
    </section>
  );
}
