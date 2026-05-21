import React, { useState, useId, useRef } from "react";
import { apiUrl } from "../lib/api";

const DOMAIN_OPTIONS = [
  "Power & Energy Systems",
  "Infrastructure & Utilities",
  "Industrial & Manufacturing Systems",
  "Safety & Compliance",
  "Asset & Maintenance Management",
  "Project & Contract Management",
  "Regulatory / Financial / Leadership",
  "Other",
];

function Field({ id, label, hint, required, error, children }) {
  return (
    <div className="register-field">
      <label htmlFor={id || undefined} className="register-label">
        {label}
        {required && <span className="register-required">*</span>}
      </label>
      {children}
      {hint && <p className="register-hint">{hint}</p>}
      {error && <p className="register-error">{error}</p>}
    </div>
  );
}

export default function RegisterModal({ expert, onClose }) {
  const [form, setForm] = useState({
    name: "",
    title: "",
    yearsExperience: "",
    domains: [],
    otherDomain: "",
    keySpecialisation: "",
    profileSummary: "",
    profilePhotoUrl: "",
    email: "",
    contactNumber: "",
    organization: "",
    detailedExperience: "",
    linkedin: "",
    consentDisplay: false,
    consentAccurate: false,
    consentReviewed: false,
    message: "",
  });
  const [status, setStatus] = useState(null);
  const photoInputRef = useRef(null);
  const formId = useId();

  React.useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  async function submit(e) {
    e.preventDefault();

    if (!form.domains || form.domains.length === 0) {
      setStatus("domains-error");
      return;
    }

    if (form.domains.includes("Other") && !form.otherDomain.trim()) {
      setStatus("other-domain-error");
      return;
    }

    if (!form.profilePhotoUrl) {
      setStatus("photo-error");
      return;
    }

    setStatus("sending");

    try {
      const payload = { ...form };
      if (expert && expert.id) payload.expertId = expert.id;
      const res = await fetch(apiUrl("/api/experts/register"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data && data.success) {
        setStatus("sent");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  function updateField(field, value) {
    setStatus((prev) =>
      prev === "domains-error" || prev === "other-domain-error" || prev === "photo-error"
        ? null
        : prev
    );
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function toggleDomain(domain) {
    setForm((prev) => {
      const has = Array.isArray(prev.domains) && prev.domains.includes(domain);
      const nextDomains = has
        ? prev.domains.filter((d) => d !== domain)
        : [...(prev.domains || []), domain];
      return {
        ...prev,
        domains: nextDomains,
        otherDomain: domain === "Other" && has ? "" : prev.otherDomain,
      };
    });
    setStatus((prev) =>
      prev === "domains-error" || prev === "other-domain-error" ? null : prev
    );
  }

  function handlePhotoChange(e) {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => updateField("profilePhotoUrl", reader.result);
    reader.readAsDataURL(f);
    setStatus((prev) => (prev === "photo-error" ? null : prev));
  }

  const title = expert?.name
    ? `Register interest — ${expert.name}`
    : "Register as Expert";

  return (
    <div
      className="register-modal-backdrop"
      role="presentation"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="register-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${formId}-title`}
      >
        <header className="register-modal-header">
          <div className="register-modal-header-text">
            <span className="section-tag register-modal-tag">Expert application</span>
            <h2 id={`${formId}-title`}>{title}</h2>
            <p className="register-modal-copy">
              Share your professional profile for review. Approved experts are listed on
              our platform and matched to relevant training engagements.
            </p>
          </div>
          <button
            type="button"
            className="register-modal-close"
            onClick={onClose}
            aria-label="Close registration form"
          >
            <i className="fas fa-times" aria-hidden="true" />
          </button>
        </header>

        {status === "sent" ? (
          <div className="register-success-panel">
            <div className="register-success-icon">
              <i className="fas fa-check-circle" aria-hidden="true" />
            </div>
            <h3>Application submitted</h3>
            <p>
              Thank you. Your registration has been received and will be reviewed by our
              team. We will contact you using the email provided.
            </p>
            <button type="button" className="btn btn-primary" onClick={onClose}>
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="register-form">
            <section className="register-section">
              <div className="register-section-heading">
                <span className="register-section-icon" aria-hidden="true">
                  <i className="fas fa-user-tie" />
                </span>
                <div>
                  <h3>Public profile</h3>
                  <p>Information shown on your expert listing after approval.</p>
                </div>
              </div>

              <div className="register-fields-row">
                <Field id={`${formId}-name`} label="Full name" required>
                  <input
                    id={`${formId}-name`}
                    className="register-input"
                    required
                    placeholder="As you want it displayed"
                    value={form.name}
                    onChange={(e) => updateField("name", e.target.value)}
                  />
                </Field>
                <Field id={`${formId}-title`} label="Professional title" required>
                  <input
                    id={`${formId}-title`}
                    className="register-input"
                    required
                    placeholder="e.g. Senior Electrical Engineer"
                    value={form.title}
                    onChange={(e) => updateField("title", e.target.value)}
                  />
                </Field>
              </div>

              <Field
                id={`${formId}-years`}
                label="Years of experience"
                required
                hint="Total years in your primary field of practice."
              >
                <input
                  id={`${formId}-years`}
                  className="register-input"
                  type="number"
                  min="0"
                  required
                  placeholder="e.g. 12"
                  value={form.yearsExperience}
                  onChange={(e) => updateField("yearsExperience", e.target.value)}
                />
              </Field>

              <Field
                label="Domain expertise"
                required
                hint="Select all areas that match your experience."
                error={
                  status === "domains-error"
                    ? "Please select at least one domain."
                    : null
                }
              >
                <div className="register-domains-grid">
                  {DOMAIN_OPTIONS.map((d) => {
                    const selected = form.domains?.includes(d);
                    return (
                      <label
                        key={d}
                        className={
                          "register-domain-chip" + (selected ? " is-selected" : "")
                        }
                      >
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={() => toggleDomain(d)}
                        />
                        <span>{d}</span>
                      </label>
                    );
                  })}
                </div>
              </Field>

              {form.domains?.includes("Other") && (
                <Field
                  id={`${formId}-other-domain`}
                  label="Other domain"
                  required
                  error={
                    status === "other-domain-error"
                      ? "Please specify your other domain."
                      : null
                  }
                >
                  <input
                    id={`${formId}-other-domain`}
                    className="register-input"
                    required
                    placeholder="Describe your domain"
                    value={form.otherDomain}
                    onChange={(e) => updateField("otherDomain", e.target.value)}
                  />
                </Field>
              )}

              <Field
                id={`${formId}-specialisation`}
                label="Key specialisation"
                required
                hint="2–3 lines highlighting your core strengths."
              >
                <input
                  id={`${formId}-specialisation`}
                  className="register-input"
                  required
                  placeholder="e.g. Grid operations, protection systems, SCADA"
                  value={form.keySpecialisation}
                  onChange={(e) => updateField("keySpecialisation", e.target.value)}
                />
              </Field>

              <Field
                id={`${formId}-summary`}
                label="Profile summary"
                required
                hint="100–120 words for your public expert profile."
              >
                <textarea
                  id={`${formId}-summary`}
                  className="register-textarea"
                  required
                  rows={4}
                  placeholder="Brief overview of your background, sectors, and training delivery experience…"
                  value={form.profileSummary}
                  onChange={(e) => updateField("profileSummary", e.target.value)}
                />
              </Field>

              <Field
                label="Profile photograph"
                required
                hint="Professional headshot. JPG or PNG, max 5 MB."
                error={
                  status === "photo-error" ? "Please upload a profile photo." : null
                }
              >
                <div className="register-photo-zone">
                  <input
                    ref={photoInputRef}
                    id={`${formId}-photo`}
                    type="file"
                    accept="image/*"
                    capture="user"
                    className="register-photo-input"
                    onChange={handlePhotoChange}
                  />
                  {form.profilePhotoUrl ? (
                    <div className="register-photo-preview-wrap">
                      <img
                        src={form.profilePhotoUrl}
                        alt="Profile preview"
                        className="register-photo-preview"
                      />
                      <div className="register-photo-actions">
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={() => photoInputRef.current?.click()}
                        >
                          Change photo
                        </button>
                        <button
                          type="button"
                          className="btn"
                          onClick={() => updateField("profilePhotoUrl", "")}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label htmlFor={`${formId}-photo`} className="register-photo-empty">
                      <i className="fas fa-camera" aria-hidden="true" />
                      <span className="register-photo-empty-title">Upload photo</span>
                      <span className="register-photo-empty-hint">
                        Tap to take a photo or choose from gallery
                      </span>
                    </label>
                  )}
                </div>
              </Field>
            </section>

            <section className="register-section register-section-muted">
              <div className="register-section-heading">
                <span className="register-section-icon" aria-hidden="true">
                  <i className="fas fa-lock" />
                </span>
                <div>
                  <h3>Internal information</h3>
                  <p>Used for verification only — not displayed publicly.</p>
                </div>
              </div>

              <div className="register-fields-row">
                <Field id={`${formId}-email`} label="Email address" required>
                  <input
                    id={`${formId}-email`}
                    className="register-input"
                    required
                    type="email"
                    placeholder="you@company.com"
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                  />
                </Field>
                <Field id={`${formId}-phone`} label="Contact number" required>
                  <input
                    id={`${formId}-phone`}
                    className="register-input"
                    required
                    placeholder="+91 …"
                    value={form.contactNumber}
                    onChange={(e) => updateField("contactNumber", e.target.value)}
                  />
                </Field>
              </div>

              <Field id={`${formId}-org`} label="Organisation / affiliation" required>
                <input
                  id={`${formId}-org`}
                  className="register-input"
                  required
                  placeholder="Current employer or primary affiliation"
                  value={form.organization}
                  onChange={(e) => updateField("organization", e.target.value)}
                />
              </Field>

              <Field
                id={`${formId}-experience`}
                label="Detailed professional experience"
                required
                hint="150–200 words covering roles, sectors, and delivery experience."
              >
                <textarea
                  id={`${formId}-experience`}
                  className="register-textarea"
                  required
                  rows={5}
                  placeholder="Expand on your career history, key projects, and training or advisory work…"
                  value={form.detailedExperience}
                  onChange={(e) => updateField("detailedExperience", e.target.value)}
                />
              </Field>

              <Field id={`${formId}-linkedin`} label="LinkedIn profile URL" required>
                <input
                  id={`${formId}-linkedin`}
                  className="register-input"
                  required
                  type="url"
                  placeholder="https://linkedin.com/in/…"
                  value={form.linkedin}
                  onChange={(e) => updateField("linkedin", e.target.value)}
                />
              </Field>
            </section>

            <section className="register-section register-section-consent">
              <div className="register-section-heading">
                <span className="register-section-icon" aria-hidden="true">
                  <i className="fas fa-file-signature" />
                </span>
                <div>
                  <h3>Declaration & consent</h3>
                  <p>Please confirm before submitting your application.</p>
                </div>
              </div>

              <div className="register-consent-list">
                <label className="register-consent-item">
                  <input
                    required
                    type="checkbox"
                    checked={form.consentAccurate}
                    onChange={(e) => updateField("consentAccurate", e.target.checked)}
                  />
                  <span>I confirm the information provided is accurate and complete.</span>
                </label>
                <label className="register-consent-item">
                  <input
                    required
                    type="checkbox"
                    checked={form.consentDisplay}
                    onChange={(e) => updateField("consentDisplay", e.target.checked)}
                  />
                  <span>
                    I consent to Voltgrid Insights displaying my approved profile on the
                    platform.
                  </span>
                </label>
                <label className="register-consent-item">
                  <input
                    required
                    type="checkbox"
                    checked={form.consentReviewed}
                    onChange={(e) => updateField("consentReviewed", e.target.checked)}
                  />
                  <span>
                    I understand inclusion is subject to review and approval by Voltgrid
                    Insights.
                  </span>
                </label>
              </div>
            </section>

            {status === "error" && (
              <p className="register-form-banner register-form-banner-error" role="alert">
                <i className="fas fa-exclamation-circle" aria-hidden="true" />
                Submission failed. Please check your connection and try again.
              </p>
            )}

            <footer className="register-form-footer">
              <p className="register-form-note">
                <i className="fas fa-shield-alt" aria-hidden="true" />
                Your data is handled securely and reviewed by our admin team.
              </p>
              <div className="register-form-actions">
                <button type="button" onClick={onClose} className="btn register-btn-cancel">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary register-btn-submit"
                  disabled={status === "sending"}
                >
                  {status === "sending" ? (
                    <>
                      <i className="fas fa-spinner fa-spin" aria-hidden="true" /> Submitting…
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane" aria-hidden="true" /> Submit application
                    </>
                  )}
                </button>
              </div>
            </footer>
          </form>
        )}
      </div>
    </div>
  );
}
