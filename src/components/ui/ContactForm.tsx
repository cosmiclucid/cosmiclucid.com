"use client";

import React, { useState } from "react";
import AuroraLogo from "./AuroraLogo";


type FormStatus = "idle" | "loading" | "success" | "error";

const WEB3FORMS_ACCESS_KEY = "8aaeb7f4-fedd-40fb-813b-dd9bab0eedb9";


// n8n newsletter signup webhook (client-safe)
// Works in Vite (import.meta.env) and Next.js (process.env).
// Vite: set VITE_N8N_NEWSLETTER_SIGNUP_URL in `.env` / `.env.local`
// Next: set NEXT_PUBLIC_N8N_NEWSLETTER_SIGNUP_URL in `.env.local` / `.env`
// Example (test): https://n8n.cosmiclucid.com/webhook-test/newsletter/signup
// Example (prod): https://n8n.cosmiclucid.com/webhook/newsletter/signup
const getPublicEnv = (key: string): string => {
  // Vite
  const viteEnv = (typeof import.meta !== "undefined" && (import.meta as any).env)
    ? (import.meta as any).env
    : undefined;
  if (viteEnv && typeof viteEnv[key] === "string") return String(viteEnv[key]);

  // Next.js / Node-ish bundlers
  const procEnv = (globalThis as any)?.process?.env;
  if (procEnv && typeof procEnv[key] === "string") return String(procEnv[key]);

  return "";
};

const N8N_NEWSLETTER_SIGNUP_URL = (
  getPublicEnv("VITE_N8N_NEWSLETTER_SIGNUP_URL") ||
  getPublicEnv("NEXT_PUBLIC_N8N_NEWSLETTER_SIGNUP_URL")
).trim();

export default function ContactForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");
  const [errorDetail, setErrorDetail] = useState<string | null>(null);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const buttonLabel = status === "loading" ? "Sending..." : "Send Message";

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (status === "loading") return;

    setStatus("loading");
    setMessage("Sending your message...");
    setErrorDetail(null);

    const form = event.currentTarget;
    const formData = new FormData(form);

    const botcheck = ((formData.get("botcheck") as string) || "").trim();
    // If the hidden field is filled, treat as spam and exit silently.
    if (botcheck) {
      setStatus("success");
      setMessage("Message sent!");
      form.reset();
      return;
    }

    const firstName = ((formData.get("first_name") as string) || "").trim();
    const lastName = ((formData.get("last_name") as string) || "").trim();
    const email = ((formData.get("email") as string) || "").trim();
    const subject = ((formData.get("subject") as string) || "").trim();
    const bodyMessage = ((formData.get("message") as string) || "").trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!firstName || !lastName || !email || !bodyMessage) {
      setTouched({
        first_name: !firstName,
        last_name: !lastName,
        email: !email || !emailRegex.test(email),
        subject: false,
        message: !bodyMessage,
      });
      setStatus("error");
      setMessage("Please fill in all required fields.");
      setErrorDetail(null);
      return;
    }

    if (!emailRegex.test(email)) {
      setTouched((prev) => ({ ...prev, email: true }));
      setStatus("error");
      setMessage("Please enter a valid email address.");
      setErrorDetail(null);
      return;
    }

    formData.set("first_name", firstName);
    formData.set("last_name", lastName);
    formData.set("email", email);
    formData.set("subject", subject);
    formData.set("message", bodyMessage);

    // 1) Try n8n first (newsletter signup + Google Sheets + double opt-in)
    const n8nPayload = {
      Email: email,
      "First Name": firstName,
      "Last Name": lastName,
      Subject: subject,
      Message: bodyMessage,
      Source: "contact_form",
      Consent: true,
      SubmittedAt: new Date().toISOString(),

      // lowercase/camel variants for robustness
      email,
      firstName,
      lastName,
      subject,
      message: bodyMessage,
      source: "contact_form",
      consent: true,
    };

    let n8nOk = false;

    try {
      if (!N8N_NEWSLETTER_SIGNUP_URL) {
        throw new Error("N8N webhook URL is not configured");
      }

      const n8nRes = await fetch(N8N_NEWSLETTER_SIGNUP_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(n8nPayload),
      });

      if (n8nRes.ok) {
        n8nOk = true;
      }
    } catch {
      n8nOk = false;
    }

    // 2) If n8n failed, FALL BACK to Web3Forms so dev never breaks
    if (!n8nOk) {
      try {
        const fallbackData = new FormData();
        fallbackData.set("first_name", firstName);
        fallbackData.set("last_name", lastName);
        fallbackData.set("email", email);
        fallbackData.set("subject", subject);
        fallbackData.set("message", bodyMessage);
        fallbackData.append("access_key", WEB3FORMS_ACCESS_KEY);

        const response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          body: fallbackData,
        });

        const data = await response.json();
        if (!data.success) {
          throw new Error(data.message || "Web3Forms failed");
        }
      } catch (err) {
        setStatus("error");
        setMessage("Something went wrong. Please try again.");
        setErrorDetail(err instanceof Error ? err.message : null);
        return;
      }
    }

    // 3) Success UI (either path)
    setStatus("success");
    setMessage("Almost done — please check your email to confirm your subscription.");
    form.reset();
  };

  return (
    <form className="contact-form" onSubmit={onSubmit} noValidate>
     <input
       type="text"
       name="botcheck"
        className="contact-honeypot"
        autoComplete="off"
        tabIndex={-1}
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "-10000px",
          opacity: 0,
          pointerEvents: "none",
        }}
      />

      <div className="contact-row">
        <div className={`contact-field ${touched.first_name ? "contact-field--error" : ""}`}>
          <label htmlFor="first_name">First Name</label>
          <input
            id="first_name"
            name="first_name"
            type="text"
            required
            placeholder="First Name"
            onChange={(e) => {
              setTouched((prev) => ({ ...prev, first_name: false }));
              setStatus("idle");
              setMessage("");
            }}
          />
        </div>

        <div className={`contact-field ${touched.last_name ? "contact-field--error" : ""}`}>
          <label htmlFor="last_name">Last Name</label>
          <input
            id="last_name"
            name="last_name"
            type="text"
            required
            placeholder="Last Name"
            onChange={(e) => {
              setTouched((prev) => ({ ...prev, last_name: false }));
              setStatus("idle");
              setMessage("");
            }}
          />
        </div>
      </div>

      <div className={`contact-field ${touched.email ? "contact-field--error" : ""}`}>
        <label htmlFor="email">Email Address</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="Email Address"
          onChange={(e) => {
            setTouched((prev) => ({ ...prev, email: false }));
            setStatus("idle");
            setMessage("");
          }}
        />
      </div>

      <div className={`contact-field ${touched.subject ? "contact-field--error" : ""}`}>
        <label htmlFor="subject">Subject</label>
        <input
          id="subject"
          name="subject"
          type="text"
          placeholder="Subject"
          onChange={(e) => {
            setTouched((prev) => ({ ...prev, subject: false }));
            setStatus("idle");
            setMessage("");
          }}
        />
      </div>

      <div className={`contact-field ${touched.message ? "contact-field--error" : ""}`}>
        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          name="message"
          required
          minLength={10}
          placeholder="Write your message here..."
          onChange={(e) => {
            setTouched((prev) => ({ ...prev, message: false }));
            setStatus("idle");
            setMessage("");
          }}
        ></textarea>
      </div>

      <div className="contact-footer">
        <button
          type="submit"
          className={`neon-btn neon-btn--aurora is-purple contact-submit-btn`}
          disabled={status === "loading"}
          data-text={buttonLabel}
        >
          <span className="neon-label__content">
            <span className="neon-label__text">
              <span className="neon-label__text-base">{buttonLabel}</span>
              <span className="neon-label__text-aurora">
                <AuroraLogo text={buttonLabel} />
              </span>
            </span>
          </span>
        </button>

        {message && (
          <div
            className={`contact-status contact-status--${status}`}
            aria-live="polite"
            style={{ marginTop: "-0.5rem" }}
          >
            {message}
            {status === "error" && errorDetail && (
              <span className="contact-status-detail">
                ({errorDetail})
              </span>
            )}
          </div>
        )}
      </div>
    </form>
  );
}
