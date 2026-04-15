import React, { useState } from "react";
import { apiUrl } from '../lib/api'

export default function RegisterModal({ expert, onClose }) {
  const [form, setForm] = useState({
    name: "",
    title: "",
    yearsExperience: '',
    domains: [],
    keySpecialisation: '',
    profileSummary: '',
    profilePhotoUrl: '',
    email: "",
    contactNumber: '',
    organization: "",
    detailedExperience: '',
    linkedin: '',
    consentDisplay: false,
    consentAccurate: false,
    consentReviewed: false,
    message: "",
  });
  const [status, setStatus] = useState(null);

  async function submit(e) {
    e.preventDefault();
    setStatus("sending");

    try {
      const payload = { ...form }
      if (expert && expert.id) payload.expertId = expert.id
      const res = await fetch(apiUrl('/api/experts/register'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await res.json().catch(()=>null)
      if(res.ok && data && data.success) setStatus('sent')
      else setStatus('error')
    } catch (err) {
      setStatus('error')
    }
  }

  function updateField(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function toggleDomain(domain){
    setForm(prev=>{
      const has = Array.isArray(prev.domains) && prev.domains.includes(domain)
      return { ...prev, domains: has ? prev.domains.filter(d=>d!==domain) : [...(prev.domains||[]), domain] }
    })
  }

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>{expert?.name ? `Register Interest for ${expert.name}` : 'Register for Training / Enquire'}</h2>
        <p className="modal-copy">
          Submit your details and program requirement. We will connect the enquiry to the most relevant expert or training track.
        </p>

        <form onSubmit={submit} className="form-grid">
          <h3>Public profile (displayed)</h3>
          <input
            className="form-input"
            required
            placeholder="Full name (as displayed)"
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
          />

          <input
            className="form-input"
            placeholder="Professional title / designation"
            value={form.title}
            onChange={(e) => updateField("title", e.target.value)}
          />

          <input
            className="form-input"
            type="number"
            min="0"
            placeholder="Years of experience"
            value={form.yearsExperience}
            onChange={(e) => updateField("yearsExperience", e.target.value)}
          />

          <label style={{marginTop:6}}>Domain expertise (select one or more)</label>
          <div className="domains-grid">
            {['Power & Energy Systems','Infrastructure & Utilities','Industrial & Manufacturing Systems','Safety & Compliance','Asset & Maintenance Management','Project & Contract Management','Regulatory / Financial / Leadership','Other'].map(d=> (
              <label key={d} className="domain-item">
                <input type="checkbox" checked={form.domains?.includes(d)} onChange={()=>toggleDomain(d)} />
                <span className="domain-label">{d}</span>
              </label>
            ))}
          </div>

          <input className="form-input" placeholder="Key areas of specialisation (2-3 lines)" value={form.keySpecialisation} onChange={e=>updateField('keySpecialisation', e.target.value)} />

          <textarea className="form-input" placeholder="Profile summary (100-120 words)" rows={4} value={form.profileSummary} onChange={e=>updateField('profileSummary', e.target.value)} />

          <label style={{fontSize:14, marginTop:6}}>Profile photograph (take photo or upload)</label>
          <div style={{display:'flex',gap:10,alignItems:'center'}}>
            <input
              className="form-input"
              type="file"
              accept="image/*"
              capture="user"
              onChange={(e)=>{
                const f = e.target.files && e.target.files[0]
                if(!f) return
                const reader = new FileReader()
                reader.onload = ()=> updateField('profilePhotoUrl', reader.result)
                reader.readAsDataURL(f)
              }}
            />
            {form.profilePhotoUrl && (
              <img src={form.profilePhotoUrl} alt="preview" style={{width:72,height:72,objectFit:'cover',borderRadius:6,border:'1px solid #ddd'}} />
            )}
          </div>

          <h3>Internal information (not displayed)</h3>
          <input
            className="form-input"
            required
            type="email"
            placeholder="Email address"
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
          />

          <input className="form-input" placeholder="Contact number" value={form.contactNumber} onChange={e=>updateField('contactNumber', e.target.value)} />

          <input className="form-input" placeholder="Organisation / Affiliation" value={form.organization} onChange={e=>updateField('organization', e.target.value)} />

          <textarea className="form-input" placeholder="Detailed professional experience (150-200 words)" rows={5} value={form.detailedExperience} onChange={e=>updateField('detailedExperience', e.target.value)} />

          <input className="form-input" placeholder="LinkedIn profile URL" value={form.linkedin} onChange={e=>updateField('linkedin', e.target.value)} />

          <h3>Declaration & consent</h3>
          <label style={{display:'flex',gap:8,alignItems:'center'}}><input type="checkbox" checked={form.consentAccurate} onChange={e=>updateField('consentAccurate', e.target.checked)} /> I confirm the information is accurate.</label>
          <label style={{display:'flex',gap:8,alignItems:'center'}}><input type="checkbox" checked={form.consentDisplay} onChange={e=>updateField('consentDisplay', e.target.checked)} /> I consent to Voltgrid displaying my profile publicly.</label>
          <label style={{display:'flex',gap:8,alignItems:'center'}}><input type="checkbox" checked={form.consentReviewed} onChange={e=>updateField('consentReviewed', e.target.checked)} /> I understand inclusion is subject to review and approval.</label>

          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button type="button" onClick={onClose} className="btn">Cancel</button>

            <button
              type="submit"
              className="btn btn-primary"
            >
              {status === "sending"
                ? "Sending..."
                : status === "sent"
                  ? "Sent"
                  : "Submit"}
            </button>
          </div>

          {status === "sent" && (
            <p style={{ margin: 0, color: "green" }}>Your enquiry has been submitted successfully.</p>
          )}

          {status === "error" && (
            <p style={{ margin: 0, color: "red" }}>
              Failed to submit. Try again.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
