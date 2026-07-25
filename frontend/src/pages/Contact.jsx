import React, { useState } from "react";
import RevealSection, { Reveal } from "../components/RevealSection";
import { apiUrl } from "../lib/api";
import { GOOGLE_FORM_VIEW_URL } from "../lib/googleForm";
import contactHeroImage from "../assets/images/contact-hero.jpeg";

const contactIntro = {
  title: "Voltgrid Insights",
  text: "Professional training and capability-building platform for technical, operational, and compliance-focused learning.",
};

const contactReach = [
  {
    title: "Email",
    text: "contact@voltgridinsights.com",
  },
  {
    title: "Registered Address",
    text: "VASWANI CHAMBERS, WORLI, MUMBAI, MAHARASHTRA-400030",
  },
];

const enquiryTopics = [
  "Training programs",
  "Customized institutional programs",
  "Safety and compliance learning",
  "Partnerships and collaborations",
];

const emptyForm = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

export default function Contact() {
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  function updateField(field) {
    return (event) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
      if (status) setStatus(null);
    };
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setStatus(null);
    try {
      const res = await fetch(apiUrl("/api/contact"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus({
          type: "error",
          text: data.error || "Could not send your message. Please try again.",
        });
        return;
      }
      setForm(emptyForm);
      setStatus({
        type: "success",
        text: "Thank you — your message was sent. Our team will get back to you soon.",
      });
    } catch {
      setStatus({
        type: "error",
        text: "Cannot reach the server. Please try again in a moment.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="contact-page-main">
      <section
        className="about-hero"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), url(${contactHeroImage})`,
        }}
      >
        <div className="about-hero-overlay">
          <div className="about-hero-content">
            <h1>Connect with Voltgrid Insights</h1>
            <p>
              Reach out for training programs, customized institutional
              learning, partnerships, and capability-building enquiries.
            </p>
          </div>
        </div>
      </section>

      <div className="contact-page contact-page--reveal">
        <RevealSection
          className="contact-reveal-main"
          ariaLabel="Contact information and form"
          eyebrow="Get in touch"
          title="We’d Be Glad to Support Your Training Requirement"
          description="Share your requirement and we will connect your enquiry to the most relevant program area, learning format, or engagement track."
          compactHeader
        >
          <div className="contact-grid">
            <div className="contact-info-panel">
              <div className="contact-card-grid">
                <Reveal as="div" className="contact-card" delay="0.34s">
                  <h3 className="head-sec text-center">{contactIntro.title}</h3>
                  <p>{contactIntro.text}</p>
                </Reveal>

                <Reveal
                  as="div"
                  className="contact-card contact-card--reach"
                  delay="0.42s"
                >
                  {contactReach.map((item) => (
                    <div key={item.title} className="contact-reach-item">
                      <h3 className="head-sec">{item.title}</h3>
                      <p>{item.text}</p>
                    </div>
                  ))}
                </Reveal>
              </div>

              <Reveal className="contact-highlight-panel" delay="0.5s">
                <h3 className="text-center">How We Can Help</h3>
                <div className="contact-topic-grid">
                  {enquiryTopics.map((topic, index) => (
                    <Reveal
                      key={topic}
                      as="div"
                      className="contact-topic-card"
                      delay={`${0.56 + index * 0.06}s`}
                    >
                      {topic}
                    </Reveal>
                  ))}
                </div>
              </Reveal>
            </div>

            <Reveal className="contact-form-box" delay="0.38s">
              <h2 className="head-sec text-center">Contact Form</h2>
              <p className="contact-form-copy">
                Send your enquiry below. Submissions appear in the admin
                dashboard so our team can respond quickly.
              </p>

              <form className="contact-form" onSubmit={handleSubmit}>
                <label className="visually-hidden" htmlFor="contact-name">
                  Name
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  placeholder="Your name"
                  value={form.name}
                  onChange={updateField("name")}
                  required
                  autoComplete="name"
                />
                <label className="visually-hidden" htmlFor="contact-email">
                  Email
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  placeholder="Your email"
                  value={form.email}
                  onChange={updateField("email")}
                  required
                  autoComplete="email"
                />
                <label className="visually-hidden" htmlFor="contact-subject">
                  Subject
                </label>
                <input
                  id="contact-subject"
                  name="subject"
                  type="text"
                  placeholder="Subject (optional)"
                  value={form.subject}
                  onChange={updateField("subject")}
                />
                <label className="visually-hidden" htmlFor="contact-message">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  placeholder="How can we help?"
                  value={form.message}
                  onChange={updateField("message")}
                  required
                  rows={6}
                />
                <button
                  type="submit"
                  className="btn btn-primary contact-submit"
                  disabled={submitting}
                >
                  {submitting ? "Sending…" : "Send message"}
                </button>
              </form>

              {status && (
                <p
                  className={`contact-status contact-status--${status.type}`}
                  role="status"
                >
                  {status.text}
                </p>
              )}

              <p className="contact-form-alt">
                Prefer Google Forms?{" "}
                <a href={GOOGLE_FORM_VIEW_URL} target="_blank" rel="noreferrer">
                  Open Google Form
                </a>
              </p>
            </Reveal>
          </div>
        </RevealSection>
      </div>
    </main>
  );
}
