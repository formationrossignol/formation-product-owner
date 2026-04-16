import { useState } from 'react'

export default function Inbox({ messages }) {
  const [open, setOpen] = useState(null)
  const [read, setRead] = useState(new Set())

  if (!messages?.length) {
    return <div className="inbox-empty">📭 Aucun message pour l'instant.</div>
  }

  function openMessage(i) {
    setOpen(open === i ? null : i)
    setRead(prev => new Set([...prev, i]))
  }

  return (
    <div className="inbox">
      {messages.map((msg, i) => (
        <div
          key={i}
          className={`inbox-message ${open === i ? 'expanded' : ''} ${read.has(i) ? 'read' : 'unread'}`}
          onClick={() => openMessage(i)}
        >
          <div className="inbox-header">
            <span className="inbox-from">{msg.from}</span>
            {!read.has(i) && <span className="unread-dot" />}
            <span className="inbox-subject">{msg.subject}</span>
          </div>
          {open === i && (
            <div className="inbox-body">
              <p>{msg.body}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
