import React, { useState } from "react";
import { apiUrl } from '../lib/api'

const contactCards = [
  {
    title: "Voltgrid Insights",
    text: "Professional training and capability-building platform for technical, operational, and compliance-focused learning.",
  },
  {
    title: "Email",
    text: "voltgridinsights@gmail.com",
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

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch(apiUrl("/api/contact"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: form.message,
        }),
      });
      if (res.ok) {
        setStatus("sent");
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    }
  }

  return (
    <main>
      <section className="contact-hero contact-banner">
        <div className="contact-hero-overlay">
          <div className="contact-hero-content container">
            <span className="section-tag">Contact</span>
            <h1>Connect with Voltgrid Insights</h1>
            <p>
              Reach out for training programs, customized institutional
              learning, partnerships, and capability-building enquiries.
            </p>
          </div>
        </div>
      </section>

      <section className="contact-page">
        <div className="section-header contact-header">
          <span className="section-tag">Get in Touch</span>
          <h2>We’d Be Glad to Support Your Training Requirement</h2>
          <p>
            Share your requirement and we will connect your enquiry to the most
            relevant program area, learning format, or engagement track.
          </p>
        </div>

        <div className="contact-grid">
          <div className="contact-info-panel">
            <div className="contact-card-grid">
              {contactCards.map((card) => (
                <div key={card.title} className="contact-card">
                  <h3>{card.title}</h3>
                  <p>{card.text}</p>
                </div>
              ))}
            </div>

            <div className="contact-highlight-panel">
              <span className="section-tag contact-section-tag-light">
                Common Enquiries
              </span>
              <h3>How We Can Help</h3>
              <div className="contact-topic-grid">
                {enquiryTopics.map((topic) => (
                  <div key={topic} className="contact-topic-card">
                    {topic}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="contact-form-box">
            <span className="section-tag">Send Us a Message</span>
            <h2>Contact Form</h2>
            <p className="contact-form-copy">
              Tell us about your organization, subject of interest, or program
              requirement and we will get back to you.
            </p>
            <form onSubmit={handleSubmit} className="contact-form">
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                type="text"
                placeholder="Full name"
                required
              />
              <input
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                type="email"
                placeholder="Official email"
                required
              />
              <input
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                type="text"
                placeholder="Subject"
              />
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows="6"
                placeholder="Your message"
                required
              />
              <button type="submit" className="btn btn-primary contact-submit">
                {status === "sending" ? "Sending..." : "Submit"}
              </button>
            </form>
            {status === "sent" && (
              <p className="contact-status contact-status-success">
                Your message has been sent successfully.
              </p>
            )}
            {status === "error" && (
              <p className="contact-status contact-status-error">
                Failed to send your message. Please try again.
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
