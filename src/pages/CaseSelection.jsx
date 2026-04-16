import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronRight, Clock } from 'lucide-react'

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
  const featured = CASES.find(c => c.featured)
  const others = CASES.filter(c => !c.featured)

  return (
    <div className="case-selection">
      <motion.div
        className="case-selection-inner"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
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
