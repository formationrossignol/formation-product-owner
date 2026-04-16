import OkrSetting from './OkrSetting'
import CompetitiveAnalysis from './CompetitiveAnalysis'
import RoadmapPlanning from './RoadmapPlanning'
import Discovery from './Discovery'
import StoryWriting from './StoryWriting'
import Refinement from './Refinement'
import SprintPlanning from './SprintPlanning'
import SprintReview from './SprintReview'
import KpiAnalysis from './KpiAnalysis'
import StakeholderMgmt from './StakeholderMgmt'
import ReleaseCommunication from './ReleaseCommunication'
import Prioritization from './Prioritization'

const MODULE_MAP = {
  okr_setting: OkrSetting,
  competitive_analysis: CompetitiveAnalysis,
  roadmap_planning: RoadmapPlanning,
  discovery: Discovery,
  story_writing: StoryWriting,
  refinement: Refinement,
  sprint_planning: SprintPlanning,
  sprint_review: SprintReview,
  kpi_analysis: KpiAnalysis,
  stakeholder_mgmt: StakeholderMgmt,
  release_communication: ReleaseCommunication,
  prioritization: Prioritization,
}

export default function ModuleRouter({ module, onComplete }) {
  const Component = MODULE_MAP[module.type]
  if (!Component) return (
    <div className="unknown-module">
      <p>Module non reconnu : <code>{module.type}</code></p>
    </div>
  )
  return <Component module={module} onComplete={onComplete} />
}
