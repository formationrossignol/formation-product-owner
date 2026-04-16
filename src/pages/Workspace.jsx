import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import WorkspaceLayout from '../components/workspace/WorkspaceLayout'
import ModuleRouter from '../components/modules/ModuleRouter'
import EventOverlay from '../components/shared/EventOverlay'
import useSessionStore from '../store/sessionStore'
import { getNextModule } from '../engine/moduleEngine'
import { getTriggeredEvents } from '../engine/eventEngine'

export default function Workspace() {
  const { caseId } = useParams()
  const navigate = useNavigate()
  const {
    currentCase,
    completedModuleIds,
    eventAnswers,
    completeModule,
    submitEventChoice,
    completeSession,
  } = useSessionStore()

  useEffect(() => {
    if (!currentCase) navigate(`/onboarding/${caseId}`)
  }, [currentCase, caseId, navigate])

  if (!currentCase) return null

  const nextModule = getNextModule(currentCase.modules, completedModuleIds)
  const answeredEventIds = Object.keys(eventAnswers)
  const pendingEvents = getTriggeredEvents(currentCase.events, completedModuleIds, answeredEventIds)
  const currentEvent = pendingEvents[0] ?? null

  function handleModuleComplete(moduleId) {
    completeModule(moduleId)
    const newCompleted = [...completedModuleIds, moduleId]
    const remaining = getNextModule(currentCase.modules, newCompleted)
    const newEvents = getTriggeredEvents(currentCase.events, newCompleted, answeredEventIds)
    if (!remaining && newEvents.length === 0) {
      completeSession()
      navigate('/debrief')
    }
  }

  return (
    <WorkspaceLayout caseData={currentCase} completedCount={completedModuleIds.length}>
      {nextModule && !currentEvent && (
        <ModuleRouter module={nextModule} onComplete={handleModuleComplete} />
      )}

      {!nextModule && !currentEvent && (
        <div className="session-complete">
          <div className="complete-icon">🎉</div>
          <h2>Mission accomplie !</h2>
          <p>Tous les modules sont terminés.</p>
          <button
            className="start-btn"
            onClick={() => { completeSession(); navigate('/debrief') }}
          >
            Voir mon bilan →
          </button>
        </div>
      )}

      {currentEvent && (
        <div className="workspace-blocked">
          <p>⏸ Un événement inattendu interrompt votre travail…</p>
        </div>
      )}

      <EventOverlay
        event={currentEvent}
        onChoice={(event, choiceId) => {
          submitEventChoice(event, choiceId)
          const newAnswered = [...answeredEventIds, event.id]
          const newPending = getTriggeredEvents(currentCase.events, completedModuleIds, newAnswered)
          if (!newPending.length && !nextModule) {
            completeSession()
            navigate('/debrief')
          }
        }}
      />
    </WorkspaceLayout>
  )
}
