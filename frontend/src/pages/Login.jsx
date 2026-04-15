import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  async function handleSubmit(e){
    e.preventDefault()
    setError(null)
    try{
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if(!res.ok) return setError(data?.error || 'Login failed')
      localStorage.setItem('vg_token', data.token)
      navigate('/admin')
      // reload so Nav reads auth state and Admin page shows correctly
      window.location.reload()
    }catch(err){
      setError('Network error')
    }
  }

  return (
    <main style={{padding:'60px 8%'}}>
      <h1>Login</h1>
      <form onSubmit={handleSubmit} style={{maxWidth:400}}>
        <input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="Email" />
        <input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="Password" />
        <button type="submit">Login</button>
        {error && <p style={{color:'red'}}>{error}</p>}
      </form>
    </main>
  )
}
