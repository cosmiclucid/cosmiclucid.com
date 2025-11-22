import React from "react";
import { motion } from "motion/react";
import ContactForm from "../components/ui/ContactForm";
import AuroraButton from "../components/ui/AuroraButton";

const ContactPage: React.FC = () => {
  return (
    <main className="contact-page">
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative text-center mb-20 mt-10 md:mt-20 flex flex-col items-center"
      >
        <motion.div
          className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[260px] bg-gradient-radial from-[#51158C]/25 via-[#182E6F]/30 to-transparent blur-[120px] opacity-70 pointer-events-none"
          animate={{ opacity: [0.55, 0.85, 0.55], scale: [1, 1.07, 1] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.h1
          initial={{ opacity: 0, filter: "blur(20px)", y: 30 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
          className="mb-5 tracking-wide headline-gradient"
          style={{
            fontSize: "clamp(3rem, 6vw, 5.5rem)",
            lineHeight: 1.05,
            textTransform: "uppercase",
            color: "transparent",
          }}
        >
          CONTACT
        </motion.h1>

        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "520px", opacity: 1 }}
          transition={{ duration: 1.1, delay: 0.7, ease: "easeOut" }}
          className="mt-5 mx-auto h-[2px] w-full max-w-[580px] relative overflow-visible"
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
      </motion.div>

      <div className="contact-layout">
        <section className="contact-left" style={{ marginTop: "3rem" }}>
          <h2
            className="headline-gradient"
            style={{
              fontSize: "clamp(2rem, 3.4vw, 2.8rem)",
              lineHeight: 1.3,
              textTransform: "uppercase",
              letterSpacing: "0.01em",
              color: "transparent",
            }}
          >
            Connect with me
            <br />
            and bring your
            <br />
            vision to life
          </h2>
          <p
            className="contact-subline"
            style={{
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              fontSize: "1rem",
              marginTop: "1.5rem",
              marginBottom: "2.5rem",
            }}
          >
            <br />
            SHARE YOUR IDEAS, 
            <br />YOUR CHALLENGES
            <br /> AND YOUR GOALS AND VISIONS.
            <br />
            <br />
            I&apos;LL HELP YOU TURN THEM INTO REALITY!
          </p>

          <div
            style={{
              marginTop: "4rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: "1rem",
            }}
          >
            <p
              className="contact-subline"
              style={{
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                fontSize: "0.95rem",
                marginBottom: "0.5rem",
                marginTop: "4.8rem",
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
        </section>

        <section className="contact-right">
          <div className="contact-form-card" style={{ marginTop: "3rem" }}>
            <ContactForm />
          </div>
        </section>
      </div>
    </main>
  );
};

export default ContactPage;
