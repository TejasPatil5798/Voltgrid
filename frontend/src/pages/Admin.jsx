import React, { useEffect, useState } from 'react'

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
        const res = await fetch(url, { headers: { Authorization: 'Bearer ' + token } })
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

export default function Admin(){
  const token = localStorage.getItem('vg_token')
  const [refresh, setRefresh] = useState(0)
  const contacts = useFetch('/api/admin/contacts', token, refresh)
  const regs = useFetch('/api/admin/registrations', token, refresh)

  async function approve(id){
    if(!token) return alert('Not authenticated')
    try{
      const res = await fetch('/api/admin/registrations/'+id+'/approve',{ method: 'POST', headers: { Authorization: 'Bearer '+token } })
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
          <div className="admin-experts-grid">
            {regs.data.map((r, idx) => (
              <div key={r._id || r.id || idx} className="expert-card admin-card">
                <div className="expert-card-left">
                  <img src={r.profilePhotoUrl || '/experts/default.jpg'} alt={r.name} className="expert-photo" />
                </div>
                <div className="expert-card-body">
                  <div className="admin-card-top">
                    <div>
                      <h4 style={{margin:0}}>{r.name}</h4>
                      <div className="muted">{r.title || ''} {r.yearsExperience ? `· ${r.yearsExperience} yrs` : ''}</div>
                    </div>
                    <div className="admin-card-action">
                      {r.approved ? <span style={{color:'green'}}>Approved</span> : <button onClick={()=>approve(r._id || r.id)} className="btn">Approve</button>}
                    </div>
                  </div>

                  <div style={{marginTop:8}}>
                    <strong>Domains:</strong> {Array.isArray(r.domains) ? r.domains.join(', ') : (r.domains || '')}
                  </div>
                  {r.keySpecialisation && <div style={{marginTop:6}}><strong>Specialisation:</strong> {r.keySpecialisation}</div>}
                  {r.profileSummary && <p style={{marginTop:8,color:'#33475b'}}>{r.profileSummary}</p>}

                  <div className="muted small admin-card-meta" style={{marginTop:8}}>
                    {r.organization ? <span>{r.organization} · </span> : null}
                    {r.contactNumber ? <span>{r.contactNumber} · </span> : null}
                    {r.linkedin ? <a href={r.linkedin} target="_blank" rel="noreferrer">LinkedIn</a> : null}
                  </div>
                  <div className="small" style={{marginTop:8}}>{r.createdAt}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
