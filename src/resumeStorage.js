const KEY = 'careercraft-resume'

export const emptyResume = {
  fullName: '',
  title: '',
  email: '',
  phone: '',
  location: '',
  linkedin: '',
  summary: '',
  skills: '',
  experience: [{ company: '', role: '', dates: '', details: '' }],
  education: [{ school: '', degree: '', dates: '' }],
  projects: [{ name: '', details: '' }],
}

export function loadResume() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return structuredClone(emptyResume)
    return { ...structuredClone(emptyResume), ...JSON.parse(raw) }
  } catch {
    return structuredClone(emptyResume)
  }
}

export function saveResume(resume) {
  localStorage.setItem(KEY, JSON.stringify(resume))
}

export const sampleResume = {
  fullName: 'Aisha Rahman',
  title: 'Product Analyst Intern',
  email: 'aisha.rahman@email.com',
  phone: '+91 90000 12345',
  location: 'Bengaluru, India',
  linkedin: 'linkedin.com/in/aisharahman',
  summary:
    'Computer Science graduate who turns messy campus data into decisions people actually use. Built dashboards for four student clubs, ran user interviews for a campus marketplace, and wants an internship where analytics meets product.',
  skills: 'SQL, Python, Excel, Figma, Tableau, Stakeholder interviews, A/B testing basics',
  experience: [
    {
      company: 'Campus Marketplace',
      role: 'Product Analyst (student team)',
      dates: 'Jan 2025 – Present',
      details:
        'Interviewed 32 students, cut checkout drop-off by 18% after simplifying the listing form, and shipped a weekly funnel dashboard used in standups.',
    },
    {
      company: 'Data Club',
      role: 'Workshop lead',
      dates: 'Aug 2024 – Dec 2024',
      details:
        'Taught SQL to 60 beginners and mentored 8 teams on their first portfolio projects.',
    },
  ],
  education: [
    {
      school: 'National Institute of Technology',
      degree: 'B.Tech, Computer Science',
      dates: '2022 – 2026',
    },
  ],
  projects: [
    {
      name: 'ClubPulse',
      details:
        'Python + SQL dashboard that tracks event attendance and budget burn for student clubs. Used by 4 organizations.',
    },
  ],
}

export function resumeToText(resume) {
  const lines = [
    resume.fullName,
    resume.title,
    [resume.email, resume.phone, resume.location, resume.linkedin].filter(Boolean).join(' | '),
    '',
    'Summary',
    resume.summary,
    '',
    'Skills',
    resume.skills,
    '',
    'Experience',
    ...resume.experience.map(
      (item) => `${item.role} — ${item.company} (${item.dates})\n${item.details}`,
    ),
    '',
    'Education',
    ...resume.education.map((item) => `${item.degree} — ${item.school} (${item.dates})`),
    '',
    'Projects',
    ...resume.projects.map((item) => `${item.name}\n${item.details}`),
  ]
  return lines.join('\n')
}
