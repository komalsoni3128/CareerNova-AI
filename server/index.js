import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

dotenv.config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '.env') })

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json({ limit: '1mb' }))
const frontendPath = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  'public'
)

app.use(express.static(frontendPath))

function getAiConfig() {
  const groqKey = process.env.GROQ_API_KEY
  const openaiKey = process.env.OPENAI_API_KEY

  if (groqKey) {
    return {
      apiKey: groqKey,
      baseUrl: 'https://api.groq.com/openai/v1',
      model: process.env.OPENAI_MODEL || 'llama-3.3-70b-versatile',
    }
  }

  if (openaiKey) {
    return {
      apiKey: openaiKey,
      baseUrl: (process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1').replace(/\/$/, ''),
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    }
  }

  return null
}

function extractJson(text) {
  if (!text || typeof text !== 'string') return null
  const trimmed = text.trim()
  try {
    return JSON.parse(trimmed)
  } catch {
    const fence = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i)
    if (fence) {
      try {
        return JSON.parse(fence[1].trim())
      } catch {
        /* continue */
      }
    }
    const start = trimmed.indexOf('{')
    const end = trimmed.lastIndexOf('}')
    if (start !== -1 && end > start) {
      try {
        return JSON.parse(trimmed.slice(start, end + 1))
      } catch {
        return null
      }
    }
    return null
  }
}

async function chatCompletion(messages, { json = false, temperature = 0.4 } = {}) {
  const config = getAiConfig()
  if (!config) {
    const error = new Error(
      'No AI API key configured. Add GROQ_API_KEY or OPENAI_API_KEY to a .env file in the project root.',
    )
    error.status = 503
    throw error
  }

  const body = {
    model: config.model,
    messages,
    temperature,
  }

  if (json) {
    body.response_format = { type: 'json_object' }
  }

  const response = await fetch(`${config.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  const payload = await response.json().catch(() => ({}))

  if (!response.ok) {
    const message =
      payload?.error?.message ||
      `AI provider returned ${response.status}. Check your API key, model name, and quota.`
    const error = new Error(message)
    error.status = response.status >= 400 && response.status < 600 ? response.status : 502
    throw error
  }

  const content = payload?.choices?.[0]?.message?.content
  if (!content) {
    const error = new Error('The AI returned an empty response. Try again in a moment.')
    error.status = 502
    throw error
  }

  return content
}

function requireText(value, field, min = 8) {
  if (typeof value !== 'string' || !value.trim()) {
    const error = new Error(`${field} is required.`)
    error.status = 400
    throw error
  }
  if (value.trim().length < min) {
    const error = new Error(`${field} is too short. Please add more detail.`)
    error.status = 400
    throw error
  }
  return value.trim()
}

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    aiConfigured: Boolean(getAiConfig()),
  })
})

app.post('/api/chat', async (req, res) => {
  try {
    const messages = Array.isArray(req.body?.messages) ? req.body.messages : []
    if (!messages.length) {
      return res.status(400).json({ error: 'Send at least one chat message.' })
    }

    const sanitized = messages
      .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
      .map((m) => ({ role: m.role, content: m.content.slice(0, 8000) }))
      .slice(-16)

    if (!sanitized.length || sanitized[sanitized.length - 1].role !== 'user') {
      return res.status(400).json({ error: 'The last message must come from you.' })
    }

    const last = sanitized[sanitized.length - 1].content.trim()
    if (last.length < 2) {
      return res.status(400).json({ error: 'Please type a longer question.' })
    }

    const reply = await chatCompletion(
      [
        {
          role: 'system',
          content:
            'You are CareerCraft AI, a practical career coach for students, graduates, and job seekers. Help with resumes, interviews, job search strategy, skill building, and career decisions. Be specific, encouraging, and honest. Use short sections and bullet points when useful. Do not invent job offers, salaries, or employer facts. If something is unknown, say so.',
        },
        ...sanitized,
      ],
      { temperature: 0.6 },
    )

    res.json({ reply })
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message || 'Chat request failed.' })
  }
})

app.post('/api/analyze-resume', async (req, res) => {
  try {
    const resumeText = requireText(req.body?.resumeText, 'Resume text', 40)
    const targetRole = requireText(req.body?.targetRole, 'Target role', 2)

    const content = await chatCompletion(
      [
        {
          role: 'system',
          content:
            'You are an expert recruiter and resume coach. Return ONLY valid JSON with keys: overallScore (0-100 number), summary (string), strengths (string array), gaps (string array), atsTips (string array), rewriteSuggestions (array of {section, current, improved}), keywordMatches (string array), missingKeywords (string array).',
        },
        {
          role: 'user',
          content: `Target role: ${targetRole}\n\nResume:\n${resumeText.slice(0, 12000)}`,
        },
      ],
      { json: true, temperature: 0.3 },
    )

    const data = extractJson(content)
    if (!data) {
      return res.status(502).json({ error: 'Could not parse the analysis. Please try again.' })
    }

    res.json(data)
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message || 'Resume analysis failed.' })
  }
})

app.post('/api/interview-questions', async (req, res) => {
  try {
    const role = requireText(req.body?.role, 'Role', 2)
    const level = ['entry', 'mid', 'senior'].includes(req.body?.level) ? req.body.level : 'entry'
    const focus = ['mixed', 'behavioral', 'technical'].includes(req.body?.focus)
      ? req.body.focus
      : 'mixed'

    const content = await chatCompletion(
      [
        {
          role: 'system',
          content:
            'You generate realistic interview questions. Return ONLY valid JSON: { questions: array of { id, type (behavioral|technical|situational), question, tip } }. Provide 6 questions. Tips should help the candidate prepare, not give a full scripted answer.',
        },
        {
          role: 'user',
          content: `Role: ${role}\nExperience level: ${level}\nFocus: ${focus}`,
        },
      ],
      { json: true, temperature: 0.5 },
    )

    const data = extractJson(content)
    if (!data?.questions?.length) {
      return res.status(502).json({ error: 'Could not generate questions. Please try again.' })
    }

    res.json(data)
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message || 'Question generation failed.' })
  }
})

app.post('/api/interview-feedback', async (req, res) => {
  try {
    const role = requireText(req.body?.role, 'Role', 2)
    const question = requireText(req.body?.question, 'Question', 8)
    const answer = requireText(req.body?.answer, 'Answer', 12)

    const content = await chatCompletion(
      [
        {
          role: 'system',
          content:
            'You are a hiring manager giving mock-interview feedback. Return ONLY valid JSON: { score (0-100), verdict, whatWorked (string array), improve (string array), strongerAnswer (string), followUpQuestion (string) }.',
        },
        {
          role: 'user',
          content: `Role: ${role}\nQuestion: ${question}\nCandidate answer: ${answer}`,
        },
      ],
      { json: true, temperature: 0.4 },
    )

    const data = extractJson(content)
    if (!data) {
      return res.status(502).json({ error: 'Could not score this answer. Please try again.' })
    }

    res.json(data)
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message || 'Feedback request failed.' })
  }
})

app.post('/api/skill-gap', async (req, res) => {
  try {
    const targetRole = requireText(req.body?.targetRole, 'Target role', 2)
    const skills = requireText(req.body?.skills, 'Current skills', 3)
    const background = typeof req.body?.background === 'string' ? req.body.background.trim() : ''

    const content = await chatCompletion(
      [
        {
          role: 'system',
          content:
            'You are a career skills analyst for students and job seekers. Return ONLY valid JSON: { fitScore (0-100), snapshot (string), matchedSkills (string array), missingSkills (array of { skill, whyItMatters, howToLearn }), learningPlan (array of { week, focus, actions }), projectIdeas (string array) }.',
        },
        {
          role: 'user',
          content: `Target role: ${targetRole}\nCurrent skills: ${skills}\nBackground: ${background || 'Not provided'}`,
        },
      ],
      { json: true, temperature: 0.35 },
    )

    const data = extractJson(content)
    if (!data) {
      return res.status(502).json({ error: 'Could not analyze the skill gap. Please try again.' })
    }

    res.json(data)
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message || 'Skill gap analysis failed.' })
  }
})

app.post('/api/improve-summary', async (req, res) => {
  try {
    const resume = req.body?.resume
    if (!resume || typeof resume !== 'object') {
      return res.status(400).json({ error: 'Resume data is required.' })
    }

    const content = await chatCompletion(
      [
        {
          role: 'system',
          content:
            'Write a professional 3-4 sentence resume summary. Return ONLY valid JSON: { summary: string }.',
        },
        {
          role: 'user',
          content: JSON.stringify(resume).slice(0, 8000),
        },
      ],
      { json: true, temperature: 0.5 },
    )

    const data = extractJson(content)
    if (!data?.summary) {
      return res.status(502).json({ error: 'Could not generate a summary. Please try again.' })
    }

    res.json(data)
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message || 'Summary generation failed.' })
  }
})
app.get('/{*splat}', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'))
})

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`CareerNova AI server running on http://127.0.0.1:${PORT}`)
  })
}

export default app