
import { Link } from 'react-router-dom'

const features = [
  {
    title: 'AI Resume Builder',
    text: 'Create a professional resume with your education, skills, projects and experience.',
    to: '/resume-builder',
    icon: '📄',
  },
  {
    title: 'Resume Analyzer',
    text: 'Review your resume and discover ways to improve its content for your target role.',
    to: '/resume-analyzer',
    icon: '🔍',
  },
  {
    title: 'Interview Preparation',
    text: 'Practice technical and HR interview questions and improve your answers.',
    to: '/interview',
    icon: '🎤',
  },
  {
    title: 'Skill Gap Analyzer',
    text: 'Identify skills to improve and get a learning plan for your desired career.',
    to: '/skill-gap',
    icon: '🎯',
  },
  {
    title: 'AI Career Assistant',
    text: 'Get guidance about resumes, interviews, job searches and career decisions.',
    to: '/chat',
    icon: '💬',
  },
  {
    title: 'Resume Download',
    text: 'Preview your resume and prepare a professional copy for job applications.',
    to: '/resume-builder',
    icon: '🖨️',
  },
]

export default function Home() {
  return (
    <>
      <section className="container hero">
        <div>
          <div className="eyebrow">
            Your journey from student to professional starts here
          </div>

          <h1>
            Build Your Future with{' '}
            <span className="gradient-text">CareerNova AI</span>
          </h1>

          <p className="lede">
            Create professional resumes, improve your skills, prepare for
            interviews and explore career opportunities with the help of AI.
            Everything you need to take the next step in your career, in one place.
          </p>

          <div className="hero-actions">
            <Link className="btn btn-primary" to="/resume-builder">
              Get Started
            </Link>

            <Link className="btn btn-ghost" to="/chat">
              Explore AI Assistant
            </Link>
          </div>
        </div>

        <div className="hero-card">
          <div className="preview-resume">
            <h4>Your Future Starts Today!</h4>
            <div>Discover your skills. Showcase your talent.</div>

            <p>
              Turn your education, projects and experience into a professional
              profile that helps you move closer to your dream career.
            </p>

            <div className="chip-row">
              <span className="chip">Resume Building</span>
              <span className="chip">Interview Prep</span>
              <span className="chip">Career Growth</span>
              <span className="chip">AI Assistance</span>
            </div>
          </div>

          <p className="lede" style={{ margin: '14px 0 0' }}>
            One platform to prepare, practice and progress towards your career goals.
          </p>
        </div>
      </section>

      <section className="container stats">
        <div className="stat">
          <strong>6</strong>
          Career tools
        </div>

        <div className="stat">
          <strong>3</strong>
          Resume templates
        </div>

        <div className="stat">
          <strong>AI</strong>
          Career assistance
        </div>

        <div className="stat">
          <strong>24/7</strong>
          Access to the platform
        </div>
      </section>

      <section className="container section">
        <div className="section-head">
          <div>
            <h2>Everything You Need to Grow Your Career</h2>
            <p className="lede">
              Explore tools designed to help you become career-ready.
            </p>
          </div>
        </div>

        <div className="grid-3">
          {features.map((feature) => (
            <Link
              key={feature.title}
              to={feature.to}
              className="card"
            >
              <div className="icon-bubble">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p className="lede">{feature.text}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="container section">
        <h2>How CareerNova AI Works</h2>

        <div className="steps">
          <div className="step">
            <span>01</span>
            <h3>Create Your Resume</h3>
            <p>Add your education, skills, projects and experience.</p>
          </div>

          <div className="step">
            <span>02</span>
            <h3>Improve Your Profile</h3>
            <p>Review your resume and discover areas for improvement.</p>
          </div>

          <div className="step">
            <span>03</span>
            <h3>Prepare for Interviews</h3>
            <p>Practice questions and improve your interview confidence.</p>
          </div>

          <div className="step">
            <span>04</span>
            <h3>Build Your Skills</h3>
            <p>Identify skill gaps and follow a learning plan.</p>
          </div>
        </div>
      </section>

      <section className="container">
        <div className="cta-banner">
          <div>
            <h2>Ready to Take the Next Step?</h2>
            <p>
              Start exploring your career opportunities with CareerNova AI.
            </p>
          </div>

          <Link className="btn btn-ghost" to="/chat">
            Talk to AI Assistant
          </Link>
        </div>
      </section>
    </>
  )
}
