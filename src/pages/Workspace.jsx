import { useEffect, useState } from 'react'
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
  const [reviewingModuleId, setReviewingModuleId] = useState(null)

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

  // Module displayed: review mode shows a past module, otherwise the next to complete
  const displayModule = reviewingModuleId
    ? currentCase.modules.find(m => m.id === reviewingModuleId)
    : nextModule

  function handleModuleComplete(moduleId) {
    // Clear review mode when completing
    setReviewingModuleId(null)
    completeModule(moduleId)
    const newCompleted = [...completedModuleIds, moduleId]
    const newEvents = getTriggeredEvents(currentCase.events, newCompleted, answeredEventIds)
    if (!getNextModule(currentCase.modules, newCompleted) && newEvents.length === 0) {
      completeSession()
      navigate('/debrief')
    }
  }

  function handleGoHome() {
    navigate('/')
  }

  function handleSelectModule(moduleId) {
    setReviewingModuleId(moduleId)
  }

  const isReviewing = reviewingModuleId != null

  return (
    <WorkspaceLayout
      caseData={currentCase}
      completedCount={completedModuleIds.length}
      modules={currentCase.modules}
      completedModuleIds={completedModuleIds}
      currentModuleTitle={displayModule?.title}
      reviewingModuleId={reviewingModuleId}
      onSelectModule={handleSelectModule}
      onGoHome={handleGoHome}
    >
      {/* Normal module flow */}
      {!isReviewing && nextModule && !currentEvent && (
        <ModuleRouter module={nextModule} onComplete={handleModuleComplete} />
      )}

      {/* Review mode — completed module, tasks are disabled (answers already set) */}
      {isReviewing && displayModule && (
        <ModuleRouter module={displayModule} onComplete={() => setReviewingModuleId(null)} />
      )}

      {/* All done, no event */}
      {!isReviewing && !nextModule && !currentEvent && (
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

      {/* Event blocking normal progress */}
      {!isReviewing && currentEvent && (
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
