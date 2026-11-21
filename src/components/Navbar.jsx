
import { useState } from 'react'
import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Home' },
  { to: '/resume-builder', label: 'Resume Builder' },
  { to: '/resume-analyzer', label: 'Analyzer' },
  { to: '/interview', label: 'Interviews' },
  { to: '/skill-gap', label: 'Skill Gap' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="nav">
      <div className="container nav-inner">
        <NavLink
          to="/"
          className="brand"
          onClick={() => setOpen(false)}
          aria-label="CareerNova AI Home"
        >
          <span className="brand-mark" aria-hidden="true">
            CN
          </span>
          CareerNova AI
        </NavLink>

        <button
          className="menu-btn"
          type="button"
          aria-expanded={open}
          aria-label="Toggle navigation"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? 'Close' : 'Menu'}
        </button>

        <nav className={`nav-links ${open ? 'open' : ''}`}>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}

          <NavLink
            to="/chat"
            className="nav-cta"
            onClick={() => setOpen(false)}
          >
            AI Assistant
          </NavLink>
        </nav>
      </div>
    </header>
  )
}
