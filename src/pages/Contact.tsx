import React from "react";
import { motion } from "motion/react";
import ContactForm from "../components/ui/ContactForm";
import AuroraButton from "../components/ui/AuroraButton";
import CalendlyInline from "../components/ui/CalendlyInline";

const CALENDLY_URL = "https://calendly.com/louiskuschnir/30min?month=2025-12";

const ContactPage: React.FC = () => {
  return (
    <main className="contact-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="contact-hero relative text-center flex flex-col items-center"
        style={{ marginTop: "2rem", marginBottom: "1rem", gap: "0.2rem" }}
      >
        <motion.div
          className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[260px] bg-gradient-radial from-[#51158C]/25 via-[#182E6F]/30 to-transparent blur-[120px] opacity-70 pointer-events-none"
          animate={{ opacity: [0.55, 0.85, 0.55], scale: [1, 1.07, 1] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.h1
          initial={{ opacity: 0, filter: "blur(20px)", y: 30 }}
          whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="tracking-wide headline-gradient"
          style={{
            fontSize: "clamp(3rem, 6vw, 5.5rem)",
            lineHeight: 1.05,
            textTransform: "uppercase",
            color: "transparent",
            marginBottom: "0.5rem",
          }}
        >
          CONTACT
        </motion.h1>

        <motion.div
          initial={{ width: 0, opacity: 0 }}
          whileInView={{ width: "620px", opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="contact-divider mx-auto h-[2px] w-full max-w-[580px] relative overflow-visible"
          style={{ marginTop: "0.5rem", marginBottom: "0.5rem" }}
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "linear-gradient(90deg, rgba(81,21,140,0.25) 0%, rgba(102,51,204,0.95) 50%, rgba(81,21,140,0.25) 100%)",
              boxShadow:
                "0 0 28px rgba(102, 51, 204, 0.9), 0 0 60px rgba(81, 21, 140, 0.6)",
              filter: "drop-shadow(0 0 22px rgba(81, 21, 140, 0.85))",
              height: "100%",
              borderRadius: "999px",
              opacity: 1,
            }}
          />
          <div
            className="absolute inset-0 rounded-full blur-lg pointer-events-none"
            style={{
              background:
                "linear-gradient(90deg, rgba(81,21,140,0.18) 0%, rgba(102,51,204,0.3) 50%, rgba(81,21,140,0.18) 100%)",
            }}
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="portfolio-subline text-center text-white leading-relaxed"
          style={{
            marginTop: "1rem",
            marginBottom: "1.2rem",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            fontSize: "clamp(0.82rem, 3vw, 1.05rem)",
            whiteSpace: "pre-line",
          }}
        >
          Connect with me{"\n"}— and bring your vision to life —
        </motion.p>
      </motion.div>

      <div className="contact-layout">
        <section
          className="contact-left"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <h2
            className="headline-gradient contact-book-heading"
            style={{
              fontSize: "clamp(2rem, 3.4vw, 2.8rem)",
              lineHeight: 1.3,
              textTransform: "uppercase",
              letterSpacing: "0.01em",
              color: "transparent",
              marginBottom: "0.8rem",
            }}
          >
            Share your vision
          </h2>

          <div
            style={{
              marginTop: "1rem",
              width: "100%",
              maxWidth: "780px",
            }}
          >
            <div
              className="contact-form-card"
              style={{
                width: "100%",
              }}
            >
              <ContactForm />
              <div
                style={{
                  marginTop: "2rem",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  gap: "0.75rem",
                }}
              >
                <p
                  className="contact-subline"
                  style={{
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    fontSize: "0.95rem",
                    marginBottom: "0.35rem",
                    marginTop: "0.2rem",
                  }}
                >
                  Prefer a quick chat? <br />
                  Reach me instantly via WhatsApp.
                </p>
                <form className="contact-form" onSubmit={(e) => e.preventDefault()} noValidate>
                  <div className="contact-footer">
                    <AuroraButton
                      label="WRITE ME ON WHATSAPP"
                      className="px-12 py-4 text-sm tracking-[0.28em]"
                      onClick={() => window.open("https://wa.me/4915257256800", "_blank", "noopener,noreferrer")}
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>

        </section>

        <section
          className="contact-right"
          style={{
            marginTop: "0.5rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <h2
            className="headline-gradient contact-book-heading"
            style={{
              fontSize: "clamp(2rem, 3.4vw, 2.8rem)",
              lineHeight: 1.3,
              textTransform: "uppercase",
              letterSpacing: "0.01em",
              color: "transparent",
              marginTop: "-0.5rem",
            }}
          >
            Book your call
          </h2>

          <div
            style={{
              marginTop: "1.8rem",
              width: "100%",
              maxWidth: "720px",
            }}
          >
            <div
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "16px",
                padding: "0.75rem",
                boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
                margin: "0 auto",
              }}
            >
              <CalendlyInline url={CALENDLY_URL} height={760} />
            </div>
            <div className="contact-footer" style={{ marginTop: "0.9rem" }}>
              <AuroraButton
                label="Open Calendly in a new tab"
                className="px-10 py-4 text-sm tracking-[0.26em] w-full"
                href={CALENDLY_URL}
                target="_blank"
                rel="noopener,noreferrer"
              />
            </div>
          </div>

        </section>
      </div>
    </main>
  );
};

export default ContactPage;
