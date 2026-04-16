import { BrowserRouter, Routes, Route } from 'react-router-dom'
import CaseSelection from './pages/CaseSelection'
import Onboarding from './pages/Onboarding'
import Workspace from './pages/Workspace'
import Debrief from './pages/Debrief'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CaseSelection />} />
        <Route path="/onboarding/:caseId" element={<Onboarding />} />
        <Route path="/workspace/:caseId" element={<Workspace />} />
        <Route path="/debrief" element={<Debrief />} />
      </Routes>
    </BrowserRouter>
  )
}
