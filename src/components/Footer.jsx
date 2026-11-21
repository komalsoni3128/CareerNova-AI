import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div>© {new Date().getFullYear()} CareerNova AI · Built for students and job seekers</div>
        <div>
          <Link to="/resume-builder">Build a resume</Link>
          {' · '}
          <Link to="/chat">Talk to the assistant</Link>
        </div>
      </div>
    </footer>
  )
}
