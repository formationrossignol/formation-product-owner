export function scoreTask(task, answer) {
  if (answer === null || answer === undefined) return 0
  switch (task.type) {
    case 'single_choice':
      return answer === task.expected ? task.points : 0
    case 'multi_select': {
      const correct = answer.filter(a => task.expected.includes(a)).length
      return Math.round(task.points * (correct / task.expected.length))
    }
    case 'ranking':
      return JSON.stringify(answer) === JSON.stringify(task.expected_order) ? task.points : 0
    case 'match_pairs': {
      const total = Object.keys(task.expected).length
      const correct = Object.entries(answer).filter(([k, v]) => task.expected[k] === v).length
      return Math.round(task.points * (correct / total))
    }
    case 'numeric_input': {
      const tolerance = task.tolerance ?? 0
      return Math.abs(answer - task.expected) <= tolerance ? task.points : 0
    }
    case 'keywords_text': {
      const found = task.expected.filter(kw =>
        answer.toLowerCase().includes(kw.toLowerCase())
      ).length
      return Math.round(task.points * (found / task.expected.length))
    }
    default:
      return 0
  }
}

export function scoreModule(module, answers) {
  const max = module.tasks.reduce((sum, t) => sum + t.points, 0)
  const earned = module.tasks.reduce((sum, t) => sum + scoreTask(t, answers[t.id] ?? null), 0)
  return { earned, max }
}

export function scoreTotalSession(caseData, answers, eventAnswers) {
  let earned = 0
  let max = 0
  for (const module of caseData.modules) {
    const s = scoreModule(module, answers)
    earned += s.earned
    max += s.max
  }
  for (const event of caseData.events ?? []) {
    const choice = event.choices.find(c => c.id === eventAnswers[event.id])
    if (choice) earned += choice.points
    const maxPoints = Math.max(...event.choices.map(c => c.points))
    max += maxPoints
  }
  return { earned, max, percent: max > 0 ? Math.round((earned / max) * 100) : 0 }
}
