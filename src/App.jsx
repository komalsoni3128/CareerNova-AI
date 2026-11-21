import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Chatbot from './pages/Chatbot'
import Home from './pages/Home'
import InterviewPrep from './pages/InterviewPrep'
import ResumeAnalyzer from './pages/ResumeAnalyzer'
import ResumeBuilder from './pages/ResumeBuilder'
import SkillGap from './pages/SkillGap'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/resume-builder" element={<ResumeBuilder />} />
        <Route path="/resume-analyzer" element={<ResumeAnalyzer />} />
        <Route path="/interview" element={<InterviewPrep />} />
        <Route path="/skill-gap" element={<SkillGap />} />
        <Route path="/chat" element={<Chatbot />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
