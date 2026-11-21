function Meta({ resume }) {
  return (
    <div className="resume-meta">
      {[resume.email, resume.phone, resume.location, resume.linkedin].filter(Boolean).join(' · ') ||
        'email · phone · city'}
    </div>
  )
}

function Skills({ resume }) {
  const skills = resume.skills
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  return (
    <section className="resume-section">
      <h4>Skills</h4>
      {skills.length ? (
        <div className="resume-skills">
          {skills.map((skill) => (
            <span key={skill}>{skill}</span>
          ))}
        </div>
      ) : (
        <p>List your strongest skills.</p>
      )}
    </section>
  )
}

function Experience({ resume }) {
  return (
    <section className="resume-section">
      <h4>Experience</h4>
      {resume.experience.map((item, index) => (
        <div key={index} className="item-row">
          <div>
            <strong>{item.role || 'Role'}</strong>
            <div>{item.company || 'Company'}</div>
            <p>{item.details || 'Impact-focused bullet points.'}</p>
          </div>
          <em>{item.dates || 'Dates'}</em>
        </div>
      ))}
    </section>
  )
}

function Education({ resume }) {
  return (
    <section className="resume-section">
      <h4>Education</h4>
      {resume.education.map((item, index) => (
        <div key={index} className="item-row">
          <div>
            <strong>{item.degree || 'Degree'}</strong>
            <div>{item.school || 'School'}</div>
          </div>
          <em>{item.dates || 'Dates'}</em>
        </div>
      ))}
    </section>
  )
}

function Projects({ resume }) {
  return (
    <section className="resume-section">
      <h4>Projects</h4>
      {resume.projects.map((item, index) => (
        <div key={index}>
          <strong>{item.name || 'Project name'}</strong>
          <p>{item.details || 'What you built and the result.'}</p>
        </div>
      ))}
    </section>
  )
}

export default function ResumePreview({ resume, template }) {
  if (template === 'modern') {
    return (
      <article className="resume-sheet resume-modern" id="resume-preview">
        <aside className="resume-sidebar">
          <h3 className="name">{resume.fullName || 'Your Name'}</h3>
          <p className="resume-title">{resume.title || 'Target role'}</p>
          <Meta resume={resume} />
          <Skills resume={resume} />
          <Education resume={resume} />
        </aside>
        <div className="resume-main">
          <section className="resume-section">
            <h4>Summary</h4>
            <p>{resume.summary || 'A short professional summary will appear here.'}</p>
          </section>
          <Experience resume={resume} />
          <Projects resume={resume} />
        </div>
      </article>
    )
  }

  return (
    <article className={`resume-sheet resume-${template}`} id="resume-preview">
      <header className="resume-top">
        <h3 className="name">{resume.fullName || 'Your Name'}</h3>
        <p className="resume-title">{resume.title || 'Target role'}</p>
        <Meta resume={resume} />
      </header>
      <section className="resume-section">
        <h4>Summary</h4>
        <p>{resume.summary || 'A short professional summary will appear here.'}</p>
      </section>
      <Skills resume={resume} />
      <Experience resume={resume} />
      <Education resume={resume} />
      <Projects resume={resume} />
    </article>
  )
}
