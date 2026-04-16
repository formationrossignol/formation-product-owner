import { motion, AnimatePresence } from 'framer-motion'
import GlossaryText from './GlossaryText'

const URGENCY = {
  high: { color: '#ef4444', label: '🚨 URGENT', bg: 'rgba(239,68,68,0.1)' },
  medium: { color: '#f59e0b', label: '⚠️ IMPORTANT', bg: 'rgba(245,158,11,0.1)' },
  low: { color: '#22c55e', label: 'ℹ️ INFO', bg: 'rgba(34,197,94,0.1)' },
}

export default function EventOverlay({ event, onChoice }) {
  return (
    <AnimatePresence>
      {event && (
        <motion.div
          className="event-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="event-modal"
            initial={{ scale: 0.85, y: -30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.85, y: -30 }}
            style={{ borderTop: `4px solid ${URGENCY[event.urgency]?.color ?? '#6366f1'}` }}
          >
            <div
              className="event-urgency-badge"
              style={{
                background: URGENCY[event.urgency]?.bg,
                color: URGENCY[event.urgency]?.color,
              }}
            >
              {URGENCY[event.urgency]?.label ?? event.urgency}
            </div>
            <h2 className="event-title"><GlossaryText>{event.title}</GlossaryText></h2>
            <p className="event-description"><GlossaryText>{event.description}</GlossaryText></p>
            <div className="event-choices">
              {event.choices.map(choice => (
                <button
                  key={choice.id}
                  className="event-choice-btn"
                  onClick={() => onChoice(event, choice.id)}
                >
                  {choice.label}
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
