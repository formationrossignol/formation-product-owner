import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronRight, Clock, PlayCircle } from 'lucide-react'
import useSessionStore from '../store/sessionStore'

const CASES = [
  {
    id: 'case-ecommerce',
    title: 'Panier+',
    domain: 'E-commerce',
    level: 'intermediate',
    duration: 120,
    emoji: '🛒',
    summary: 'Arbitrer acquisition vs rétention sur une marketplace mode seconde main en pleine croissance.',
    featured: true,
  },
  {
    id: 'case-saas-b2b',
    title: 'OpsFlow',
    domain: 'SaaS B2B',
    level: 'advanced',
    duration: 150,
    emoji: '⚙️',
    summary: 'Gérer la dette technique critique face aux demandes de renouvellement clients.',
  },
  {
    id: 'case-sante',
    title: 'MediLink',
    domain: 'Santé',
    level: 'advanced',
    duration: 150,
    emoji: '🏥',
    summary: 'Prioriser dans un contexte réglementé RGPD/HDS avec des utilisateurs aux profils très différents.',
  },
  {
    id: 'case-finance',
    title: 'Finio',
    domain: 'Finance',
    level: 'intermediate',
    duration: 120,
    emoji: '💰',
    summary: "Lancer un nouveau produit épargne tout en corrigeant une faille UX critique à l'onboarding.",
  },
  {
    id: 'case-rh',
    title: 'TalentOS',
    domain: 'RH',
    level: 'intermediate',
    duration: 130,
    emoji: '👥',
    summary: 'Gérer un backlog explosé après une acquisition : deux bases clients aux besoins contradictoires.',
  },
  {
    id: 'case-education',
    title: 'Learnify',
    domain: 'Éducation',
    level: 'junior',
    duration: 100,
    emoji: '🎓',
    summary: "Améliorer l'engagement et la complétion face à une chute de rétention J30.",
  },
]

const LEVEL_LABELS = {
  junior: 'Junior',
  intermediate: 'Intermédiaire',
  advanced: 'Avancé',
}

export default function CaseSelection() {
  const navigate = useNavigate()
  const { currentCase, completedModuleIds, resetSession } = useSessionStore()
  const featured = CASES.find(c => c.featured)
  const others = CASES.filter(c => !c.featured)

  const inProgressCase = currentCase
    ? CASES.find(c => c.id === currentCase.id) ?? null
    : null
  const progressPct = inProgressCase && currentCase?.modules?.length > 0
    ? Math.round((completedModuleIds.length / currentCase.modules.length) * 100)
    : 0

  return (
    <div className="case-selection">
      <motion.div
        className="case-selection-inner"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="illus-hero">
          <svg width="200" height="100" viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            {/* Backlog stack */}
            <rect x="8" y="30" width="52" height="62" rx="5" fill="#F4F4F5" stroke="#E4E4E7" strokeWidth="1.5"/>
            <rect x="14" y="24" width="52" height="62" rx="5" fill="#FAFAFA" stroke="#E4E4E7" strokeWidth="1.5"/>
            <rect x="20" y="18" width="52" height="62" rx="5" fill="white" stroke="#E4E4E7" strokeWidth="1.5"/>
            <rect x="28" y="28" width="36" height="3" rx="1.5" fill="#E4E4E7"/>
            <rect x="28" y="35" width="28" height="3" rx="1.5" fill="#E4E4E7"/>
            <rect x="28" y="42" width="32" height="3" rx="1.5" fill="#E4E4E7"/>
            {/* Arrow */}
            <path d="M82 50 L98 50" stroke="#A1A1AA" strokeWidth="2" strokeLinecap="round"/>
            <path d="M94 46 L98 50 L94 54" stroke="#A1A1AA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            {/* Sprint board */}
            <rect x="104" y="15" width="88" height="70" rx="6" fill="white" stroke="#E4E4E7" strokeWidth="1.5"/>
            <rect x="104" y="15" width="88" height="18" rx="6" fill="#F4F4F5" stroke="#E4E4E7" strokeWidth="1.5"/>
            <rect x="112" y="21" width="20" height="6" rx="3" fill="#3B82F6"/>
            <rect x="136" y="21" width="12" height="6" rx="3" fill="#E4E4E7"/>
            {/* Cards in sprint */}
            <rect x="112" y="40" width="30" height="20" rx="3" fill="#F0FDF4" stroke="#22C55E" strokeWidth="1.2"/>
            <rect x="114" y="44" width="18" height="2.5" rx="1.2" fill="#22C55E" opacity="0.6"/>
            <rect x="114" y="49" width="12" height="2.5" rx="1.2" fill="#22C55E" opacity="0.4"/>
            <rect x="148" y="40" width="30" height="20" rx="3" fill="#FFF7ED" stroke="#F97316" strokeWidth="1.2"/>
            <rect x="150" y="44" width="18" height="2.5" rx="1.2" fill="#F97316" opacity="0.6"/>
            <rect x="150" y="49" width="14" height="2.5" rx="1.2" fill="#F97316" opacity="0.4"/>
            {/* Star */}
            <circle cx="170" cy="16" r="7" fill="#FEF9C3" stroke="#FDE047" strokeWidth="1.2"/>
            <text x="170" y="20" textAnchor="middle" fontSize="8" fill="#CA8A04">★</text>
          </svg>
        </div>

        {inProgressCase && (
          <motion.div
            className="cs-resume"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="cs-resume-left">
              <span className="cs-resume-emoji">{inProgressCase.emoji}</span>
              <div className="cs-resume-info">
                <span className="cs-resume-label">Mission en cours</span>
                <span className="cs-resume-title">{inProgressCase.title} — {inProgressCase.domain}</span>
                <div className="cs-resume-bar">
                  <div className="cs-resume-fill" style={{ width: `${progressPct}%` }} />
                </div>
                <span className="cs-resume-pct">{completedModuleIds.length} / {currentCase.modules.length} modules · {progressPct}%</span>
              </div>
            </div>
            <div className="cs-resume-actions">
              <button
                className="cs-resume-btn"
                onClick={() => navigate(`/workspace/${currentCase.id}`)}
              >
                <PlayCircle size={15} />
                Reprendre
              </button>
              <button
                className="cs-resume-reset"
                onClick={() => { resetSession() }}
                title="Abandonner cette mission"
              >
                Nouvelle partie
              </button>
            </div>
          </motion.div>
        )}

        <div className="cs-header">
          <h1>Missions</h1>
          <p>Choisissez votre scénario d'immersion Product Owner</p>
        </div>

        {/* Featured */}
        {featured && (
          <motion.div
            className="cs-featured"
            whileHover={{ y: -2 }}
            onClick={() => navigate(`/onboarding/${featured.id}`)}
          >
            <div className="cs-featured-left">
              <span className="cs-emoji">{featured.emoji}</span>
              <div>
                <div className="cs-tag-row">
                  <span className="cs-domain">{featured.domain}</span>
                  <span className={`cs-level cs-level--${featured.level}`}>
                    {LEVEL_LABELS[featured.level]}
                  </span>
                  <span className="cs-recommended">Recommandée</span>
                </div>
                <div className="cs-title">{featured.title}</div>
                <div className="cs-summary">{featured.summary}</div>
              </div>
            </div>
            <div className="cs-featured-right">
              <div className="cs-duration">
                <Clock size={13} />
                {featured.duration} min
              </div>
              <ChevronRight size={20} className="cs-arrow" />
            </div>
          </motion.div>
        )}

        {/* Others */}
        <div className="cs-others-label">Autres missions</div>
        <div className="cs-list">
          {others.map((c, i) => (
            <motion.div
              key={c.id}
              className="cs-row"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => navigate(`/onboarding/${c.id}`)}
            >
              <span className="cs-row-emoji">{c.emoji}</span>
              <div className="cs-row-info">
                <span className="cs-row-title">{c.title}</span>
                <span className="cs-row-domain">{c.domain}</span>
              </div>
              <div className="cs-row-meta">
                <span className={`cs-level cs-level--${c.level}`}>
                  {LEVEL_LABELS[c.level]}
                </span>
                <span className="cs-duration">
                  <Clock size={12} />
                  {c.duration} min
                </span>
                <ChevronRight size={16} className="cs-arrow" />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
