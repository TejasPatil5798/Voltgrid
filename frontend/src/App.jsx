import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Programs from './pages/Programs'
import Safety from './pages/Safety'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Experts from './pages/Experts'
import Admin from './pages/Admin'

export default function App(){
  return (
    <div className="app">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/programs" element={<Programs />} />
        <Route path="/safety" element={<Safety />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/experts" element={<Experts />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      <Footer />
    </div>
  )
}
