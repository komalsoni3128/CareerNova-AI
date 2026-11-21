async function request(path, body) {
  let response
  try {
    response = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  } catch {
    throw new Error('Cannot reach the CareerNova AI server. Start it with npm run dev.')
  }

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong. Please try again.')
  }
  return data
}

export function sendChat(messages) {
  return request('/api/chat', { messages })
}

export function analyzeResume(resumeText, targetRole) {
  return request('/api/analyze-resume', { resumeText, targetRole })
}

export function generateInterviewQuestions(payload) {
  return request('/api/interview-questions', payload)
}

export function scoreInterviewAnswer(payload) {
  return request('/api/interview-feedback', payload)
}

export function analyzeSkillGap(payload) {
  return request('/api/skill-gap', payload)
}

export function improveSummary(resume) {
  return request('/api/improve-summary', { resume })
}

export async function checkHealth() {
  try {
    const response = await fetch('/api/health')
    return await response.json()
  } catch {
    return { ok: false, aiConfigured: false }
  }
}
