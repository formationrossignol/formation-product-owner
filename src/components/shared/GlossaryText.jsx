import { GLOSSARY, GLOSSARY_TERMS } from '../../engine/glossary'

/**
 * Wraps recognized acronyms/terms in text with a CSS tooltip.
 * Sorted longest-first to avoid partial matches (e.g. "RGPD" before "R").
 */
export default function GlossaryText({ children }) {
  if (!children || typeof children !== 'string') return <>{children}</>

  const parts = splitWithTerms(children)

  return (
    <>
      {parts.map((part, i) =>
        part.isTerm ? (
          <span
            key={i}
            className="glossary-term"
            data-tooltip={GLOSSARY[part.text]}
          >
            {part.text}
          </span>
        ) : (
          <span key={i}>{part.text}</span>
        )
      )}
    </>
  )
}

function splitWithTerms(text) {
  // Build a regex that matches any known term (word-boundary aware)
  const pattern = GLOSSARY_TERMS.map(t => `\\b${escapeRegex(t)}\\b`).join('|')
  const regex = new RegExp(`(${pattern})`, 'g')

  const parts = []
  let lastIndex = 0
  let match

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ text: text.slice(lastIndex, match.index), isTerm: false })
    }
    parts.push({ text: match[0], isTerm: true })
    lastIndex = regex.lastIndex
  }

  if (lastIndex < text.length) {
    parts.push({ text: text.slice(lastIndex), isTerm: false })
  }

  return parts
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
