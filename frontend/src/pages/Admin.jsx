import React, { useEffect, useState } from 'react'
import ImageLightbox from '../components/ImageLightbox'
import { apiUrl } from '../lib/api'

const adminGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: 20,
  marginTop: 16,
}

const adminCardStyle = {
  background: '#fff',
  border: '1px solid #dfe8ee',
  borderRadius: 12,
  padding: 16,
  boxShadow: '0 8px 20px rgba(2, 12, 27, 0.06)',
  display: 'grid',
  gridTemplateColumns: '72px minmax(0, 1fr)',
  gap: 12,
  alignItems: 'start',
}

const adminThumbWrapStyle = {
  width: 72,
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'center',
}

const adminThumbStyle = {
  width: 64,
  height: 64,
  objectFit: 'cover',
  borderRadius: 8,
  display: 'block',
  border: '1px solid rgba(2, 12, 27, 0.06)',
}

const adminBodyStyle = {
  minWidth: 0,
  overflowWrap: 'anywhere',
  wordBreak: 'break-word',
}

const adminTopStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: 12,
  flexWrap: 'wrap',
}

function useFetch(url, token, refreshKey){
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(()=>{
    let aborted = false
    async function load(){
      if(!token) return
      setLoading(true); setError(null)
      try{
      const res = await fetch(apiUrl(url), { headers: { Authorization: 'Bearer ' + token } })
        const text = await res.text()
        let d = null
        try{ d = text ? JSON.parse(text) : null }catch(e){ d = null }
        if(!res.ok){
          const msg = (d && d.error) || res.statusText || 'Request failed'
          if(!aborted) setError(msg)
        } else {
          // if API returns { success: true, data: [...] }
          if(d && d.success) { if(!aborted) setData(d.data) }
          // or if it returns array directly
          else if(Array.isArray(d)) { if(!aborted) setData(d) }
          else { if(!aborted) setData(d)
          }
        }
      }catch(e){ if(!aborted) setError(e.message) }
      finally{ if(!aborted) setLoading(false) }
    }
    load()
    return ()=>{ aborted = true }
  },[url,token,refreshKey])

  return { data, loading, error }
}

function formatDate(value){
  if(!value) return ''
  const d = new Date(value)
  if(Number.isNaN(d.getTime())) return String(value)
  return d.toLocaleString()
}

export default function Admin(){
  const token = localStorage.getItem('vg_token')
  const [refresh, setRefresh] = useState(0)
  const [previewImage, setPreviewImage] = useState(null)
  const contacts = useFetch('/api/admin/contacts', token, refresh)
  const regs = useFetch('/api/admin/registrations', token, refresh)

  async function approve(id){
    if(!token) return alert('Not authenticated')
    try{
      const res = await fetch(apiUrl('/api/admin/registrations/'+id+'/approve'),{ method: 'POST', headers: { Authorization: 'Bearer '+token } })
      let ok = res.ok
      let msg = ''
      try{ const t = await res.text(); if(t) { const d = JSON.parse(t); if(d && d.success) ok = true; if(d && d.error) msg = d.error } }catch(e){ /* ignore parse */ }
      if(ok) setRefresh(r=>r+1)
      else alert('Approve failed: '+(msg||res.statusText))
    }catch(e){ alert('Approve failed: '+e.message) }
  }

  if(!token) return <main className="page-main container">Please login to view admin data.</main>

  return (
    <main className="page-main container">
      <h2>Admin</h2>
      

      <section style={{marginTop:30}}>
        <h3>Expert Registrations</h3>
        {regs.loading && <div>Loading...</div>}
        {regs.error && <div style={{color:'red'}}>{regs.error}</div>}
        {regs.data && regs.data.length===0 && <div>No registrations yet.</div>}
        {regs.data && (
          <div className="admin-experts-grid" style={adminGridStyle}>
            {regs.data.map((r, idx) => (
              <div key={r._id || r.id || idx} className="expert-card admin-card" style={adminCardStyle}>
                <div className="expert-card-left" style={adminThumbWrapStyle}>
                  <button
                    type="button"
                    className="expert-photo-button"
                    onClick={() => setPreviewImage({ src: r.profilePhotoUrl || '/experts/default.jpg', alt: r.name })}
                    aria-label={`Open photo of ${r.name}`}
                  >
                    <img src={r.profilePhotoUrl || '/experts/default.jpg'} alt={r.name} className="expert-photo" style={adminThumbStyle} />
                  </button>
                </div>
                <div className="expert-card-body" style={adminBodyStyle}>
                  <div className="admin-card-top" style={adminTopStyle}>
                    <div>
                      <h4 style={{margin:0}}>{r.name}</h4>
                      <div className="muted">{r.title || ''} {r.yearsExperience ? `· ${r.yearsExperience} yrs` : ''}</div>
                    </div>
                    <div className="admin-card-action">
                      {r.approved ? <span style={{color:'green'}}>Approved</span> : <button onClick={()=>approve(r._id || r.id)} className="btn">Approve</button>}
                    </div>
                  </div>

                  <div className="admin-card-detail" style={{marginTop:8}}>
                    <strong>Domains:</strong> {Array.isArray(r.domains) ? r.domains.join(', ') : (r.domains || '')}
                  </div>
                  {r.keySpecialisation && <div className="admin-card-detail" style={{marginTop:6}}><strong>Specialisation:</strong> {r.keySpecialisation}</div>}
                  {r.email && <div className="admin-card-detail" style={{marginTop:6}}><strong>Email:</strong> <a href={`mailto:${r.email}`}>{r.email}</a></div>}
                  {r.contactNumber && <div className="admin-card-detail" style={{marginTop:6}}><strong>Contact:</strong> {r.contactNumber}</div>}
                  {r.organization && <div className="admin-card-detail" style={{marginTop:6}}><strong>Organization:</strong> {r.organization}</div>}
                  {r.linkedin && <div className="admin-card-detail" style={{marginTop:6}}><strong>LinkedIn:</strong> <a href={r.linkedin} target="_blank" rel="noreferrer">{r.linkedin}</a></div>}
                  {r.profileSummary && <p style={{marginTop:8,color:'#33475b'}}>{r.profileSummary}</p>}
                  {r.detailedExperience && <div className="admin-card-detail admin-card-long" style={{marginTop:8}}><strong>Detailed Experience:</strong> {r.detailedExperience}</div>}
                  {r.message && <div className="admin-card-detail admin-card-long" style={{marginTop:8}}><strong>Message:</strong> {r.message}</div>}
                  <div className="admin-consent-grid" style={{marginTop:10}}>
                    <div className="admin-consent-chip">{r.consentDisplay ? 'Display consent: Yes' : 'Display consent: No'}</div>
                    <div className="admin-consent-chip">{r.consentAccurate ? 'Accuracy confirmed' : 'Accuracy not confirmed'}</div>
                    <div className="admin-consent-chip">{r.consentReviewed ? 'Reviewed terms: Yes' : 'Reviewed terms: No'}</div>
                  </div>

                  <div className="muted small admin-card-meta" style={{marginTop:8}}>
                    {r.organization ? <span>{r.organization} · </span> : null}
                    {r.contactNumber ? <span>{r.contactNumber} · </span> : null}
                    {r.linkedin ? <a href={r.linkedin} target="_blank" rel="noreferrer">LinkedIn</a> : null}
                  </div>
                  <div className="muted small admin-card-meta" style={{marginTop:10}}>
                    {r.approvedAt ? <span>Approved: {formatDate(r.approvedAt)}</span> : null}
                  </div>
                  <div className="small" style={{marginTop:8}}>Submitted: {formatDate(r.createdAt)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
      {previewImage && (
        <ImageLightbox
          src={previewImage.src}
          alt={previewImage.alt}
          onClose={() => setPreviewImage(null)}
        />
      )}
    </main>
  )
}
