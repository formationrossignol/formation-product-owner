import SingleChoice from './SingleChoice'
import MultiSelect from './MultiSelect'
import Ranking from './Ranking'
import MatchPairs from './MatchPairs'
import NumericInput from './NumericInput'
import KeywordsText from './KeywordsText'

const MAP = {
  single_choice: SingleChoice,
  multi_select: MultiSelect,
  ranking: Ranking,
  match_pairs: MatchPairs,
  numeric_input: NumericInput,
  keywords_text: KeywordsText,
}

export default function TaskRenderer({ task, onAnswer, answered }) {
  const Component = MAP[task.type]
  if (!Component) return <p className="unknown-task">Type de tâche inconnu : {task.type}</p>
  return <Component task={task} onAnswer={onAnswer} disabled={!!answered} />
}
