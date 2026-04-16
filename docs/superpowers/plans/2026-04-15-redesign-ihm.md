# Redesign IHM Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refondre l'IHM de l'app TP Product Owner vers un style sobre light-mode shadcn-inspired avec icônes Lucide colorées et sidebar latérale.

**Architecture:** Réécriture complète de `index.css` + retouches JSX ciblées sur `WorkspaceLayout`, `Navbar`, et `CaseSelection`. La logique métier (engines, store, YAML) reste intacte.

**Tech Stack:** React 18, Vite, Framer Motion, lucide-react (déjà installé), CSS vanilla

---

## File Map

| Fichier | Action | Responsabilité |
|---------|--------|----------------|
| `index.html` | Modify | Changer la font Google vers Geist |
| `src/index.css` | Rewrite | Design system complet (tokens, reset, tous les composants) |
| `src/components/workspace/Navbar.jsx` | Rewrite | Sidebar icônes Lucide colorées |
| `src/components/workspace/WorkspaceLayout.jsx` | Modify | Intégrer la nouvelle sidebar, layout flex |
| `src/pages/CaseSelection.jsx` | Modify | Card featured + liste compacte sans bordures colorées |
| `src/components/workspace/ProgressBar.jsx` | Modify | Style sobres steps/barre |

---

### Task 1 : Font + tokens CSS

**Files:**
- Modify: `index.html`
- Rewrite: `src/index.css` (tokens + reset seulement)

- [ ] **Step 1 : Mettre à jour la font dans index.html**

Remplacer le `<link>` Google Fonts existant :

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
```

- [ ] **Step 2 : Écrire les tokens CSS et reset dans index.css**

Remplacer intégralement le contenu de `src/index.css` par :

```css
/* ===== TOKENS ===== */
:root {
  --bg: #FAFAFA;
  --surface: #FFFFFF;
  --border: #E4E4E7;
  --border-hover: #A1A1AA;
  --text: #09090B;
  --text-muted: #71717A;
  --muted-bg: #F4F4F5;
  --radius: 6px;
  --radius-lg: 10px;
  --font: 'Geist', 'Inter', system-ui, -apple-system, sans-serif;

  /* Section colors */
  --c-module: #3B82F6;
  --c-kpi: #22C55E;
  --c-inbox: #F97316;
  --c-team: #A855F7;

  /* Semantic */
  --success: #22C55E;
  --warning: #F59E0B;
  --danger: #EF4444;
  --primary: #09090B;
  --primary-fg: #FAFAFA;
}

/* ===== RESET ===== */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body {
  background: var(--bg);
  color: var(--text);
  font-family: var(--font);
  font-size: 14px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}
h1 { font-size: 1.75rem; font-weight: 700; line-height: 1.25; }
h2 { font-size: 1.25rem; font-weight: 600; line-height: 1.3; }
h3 { font-size: 1rem;    font-weight: 600; }
h4 { font-size: 0.875rem; font-weight: 600; }
a  { color: var(--primary); text-decoration: none; }
button {
  cursor: pointer; border: none; font-family: var(--font);
  font-size: 13px; font-weight: 500;
  border-radius: var(--radius); transition: all 0.15s;
}
input, textarea { font-family: var(--font); }
ul { padding-left: 18px; }

/* ===== BOUTONS ===== */
.btn {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 7px 14px; border-radius: var(--radius);
  font-size: 13px; font-weight: 500; font-family: var(--font);
  cursor: pointer; transition: all 0.15s;
}
.btn-primary {
  background: var(--primary); color: var(--primary-fg);
  border: 1px solid var(--primary);
}
.btn-primary:hover { background: #27272A; }
.btn-ghost {
  background: var(--surface); color: var(--text-muted);
  border: 1px solid var(--border);
}
.btn-ghost:hover { border-color: var(--border-hover); color: var(--text); }

/* ===== ÉCRANS D'ÉTAT ===== */
.error-screen, .loading-screen {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; min-height: 100vh; gap: 16px;
  color: var(--text-muted);
}
.loading-spinner {
  width: 32px; height: 32px;
  border: 2px solid var(--border);
  border-top-color: var(--text);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
```

- [ ] **Step 3 : Vérifier que l'app démarre sans erreur**

```bash
npm run dev
```

Ouvrir http://localhost:5173 — l'app doit s'afficher (styles cassés c'est normal, on les refera dans les prochaines tâches).

---

### Task 2 : Sidebar navigation (Navbar.jsx)

**Files:**
- Rewrite: `src/components/workspace/Navbar.jsx`
- Modify: `src/index.css` (ajouter section `.sidebar`)

- [ ] **Step 1 : Réécrire Navbar.jsx**

```jsx
import { LayoutGrid, LineChart, Inbox, Users } from 'lucide-react'

const NAV_ITEMS = [
  { id: 'module',   Icon: LayoutGrid, color: 'var(--c-module)',  label: 'Module'  },
  { id: 'kpis',     Icon: LineChart,  color: 'var(--c-kpi)',     label: 'KPIs'    },
  { id: 'inbox',    Icon: Inbox,      color: 'var(--c-inbox)',   label: 'Inbox'   },
  { id: 'personas', Icon: Users,      color: 'var(--c-team)',    label: 'Équipe'  },
]

export default function Navbar({ company, activeTab, onTabChange, inboxCount }) {
  return (
    <nav className="sidebar">
      <div className="sidebar-logo" title={company}>
        {company?.[0] ?? 'P'}
      </div>

      <div className="sidebar-sep" />

      {NAV_ITEMS.map(({ id, Icon, color, label }) => {
        const isActive = activeTab === id
        const showBadge = id === 'inbox' && inboxCount > 0
        return (
          <button
            key={id}
            className={`nav-btn ${isActive ? 'active' : ''}`}
            style={{ '--nav-color': color }}
            onClick={() => onTabChange(id)}
            title={label}
            aria-label={label}
          >
            <Icon size={18} strokeWidth={1.75} />
            {showBadge && (
              <span className="nav-badge">{inboxCount}</span>
            )}
          </button>
        )
      })}
    </nav>
  )
}
```

- [ ] **Step 2 : Ajouter les styles `.sidebar` dans index.css**

```css
/* ===== SIDEBAR ===== */
.sidebar {
  width: 52px;
  background: var(--surface);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 0;
  gap: 2px;
  flex-shrink: 0;
  height: 100vh;
  position: sticky;
  top: 0;
}
.sidebar-logo {
  width: 30px; height: 30px;
  background: var(--primary);
  border-radius: var(--radius);
  display: flex; align-items: center; justify-content: center;
  color: var(--primary-fg);
  font-size: 12px; font-weight: 700;
  margin-bottom: 10px;
  flex-shrink: 0;
}
.sidebar-sep {
  width: 28px; height: 1px;
  background: var(--border);
  margin: 4px 0 6px;
}
.nav-btn {
  position: relative;
  width: 36px; height: 36px;
  border-radius: var(--radius);
  display: flex; align-items: center; justify-content: center;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: background 0.12s;
  color: var(--text-muted);
}
.nav-btn:hover {
  background: var(--muted-bg);
  color: var(--nav-color, var(--text));
}
.nav-btn.active {
  background: color-mix(in srgb, var(--nav-color) 12%, transparent);
  color: var(--nav-color, var(--text));
}
.nav-btn svg { flex-shrink: 0; }
.nav-badge {
  position: absolute;
  top: 4px; right: 4px;
  min-width: 14px; height: 14px;
  background: var(--c-inbox);
  color: white;
  font-size: 9px; font-weight: 700;
  border-radius: 7px;
  display: flex; align-items: center; justify-content: center;
  padding: 0 3px;
}
```

---

### Task 3 : WorkspaceLayout

**Files:**
- Modify: `src/components/workspace/WorkspaceLayout.jsx`
- Modify: `src/index.css` (ajouter section `.workspace-layout`)

- [ ] **Step 1 : Modifier WorkspaceLayout.jsx**

```jsx
import Navbar from './Navbar'
import Inbox from './Inbox'
import KpiDashboard from '../shared/KpiDashboard'
import PersonaCard from '../shared/PersonaCard'
import { useState } from 'react'

export default function WorkspaceLayout({ caseData, completedCount, children }) {
  const [activeTab, setActiveTab] = useState('module')
  const inbox = caseData.inbox ?? []
  const totalModules = caseData.modules?.length ?? 0

  return (
    <div className="workspace-layout">
      <Navbar
        company={caseData.context.company}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        inboxCount={inbox.length}
      />
      <div className="workspace-body">
        <div className="workspace-topbar">
          <div className="ws-breadcrumb">
            <span className="ws-company">{caseData.context.company}</span>
            <span className="ws-sep">/</span>
            <span className="ws-page">
              {activeTab === 'module'   && 'Module en cours'}
              {activeTab === 'kpis'     && 'Tableau de bord KPIs'}
              {activeTab === 'inbox'    && 'Inbox'}
              {activeTab === 'personas' && 'Équipe & Parties prenantes'}
            </span>
          </div>
          <div className="ws-badge">
            Module {completedCount + 1} / {totalModules}
          </div>
        </div>

        <main className="workspace-main">
          {activeTab === 'module' && children}

          {activeTab === 'kpis' && (
            <div className="tab-content">
              <h2>Tableau de bord KPIs</h2>
              <KpiDashboard
                kpis={caseData.kpis}
                analyticsData={caseData.datasets?.analytics}
              />
            </div>
          )}

          {activeTab === 'inbox' && (
            <div className="tab-content">
              <h2>Inbox</h2>
              <Inbox messages={inbox} />
            </div>
          )}

          {activeTab === 'personas' && (
            <div className="tab-content">
              <h2>Équipe & Parties prenantes</h2>
              <div className="personas-grid">
                {caseData.personas?.map(p => <PersonaCard key={p.id} persona={p} />)}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
```

- [ ] **Step 2 : Ajouter les styles `.workspace-layout` dans index.css**

```css
/* ===== WORKSPACE LAYOUT ===== */
.workspace-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
}
.workspace-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.workspace-topbar {
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  height: 48px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}
.ws-breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}
.ws-company { font-weight: 600; color: var(--text); }
.ws-sep { color: var(--border); }
.ws-page { color: var(--text-muted); }
.ws-badge {
  margin-left: auto;
  background: var(--muted-bg);
  border: 1px solid var(--border);
  color: var(--text-muted);
  font-size: 11px;
  font-weight: 500;
  padding: 3px 9px;
  border-radius: 4px;
}
.workspace-main {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}
.tab-content { max-width: 860px; }
.tab-content h2 { margin-bottom: 20px; }
```

---

### Task 4 : CaseSelection

**Files:**
- Modify: `src/pages/CaseSelection.jsx`
- Modify: `src/index.css` (ajouter section `.case-selection`)

- [ ] **Step 1 : Modifier CaseSelection.jsx**

```jsx
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
```

- [ ] **Step 2 : Ajouter les styles `.case-selection` dans index.css**

```css
/* ===== CASE SELECTION ===== */
.case-selection {
  min-height: 100vh;
  background: var(--bg);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 48px 24px;
}
.case-selection-inner {
  width: 100%;
  max-width: 640px;
}
.cs-header {
  margin-bottom: 28px;
}
.cs-header h1 { font-size: 1.5rem; margin-bottom: 4px; }
.cs-header p  { color: var(--text-muted); font-size: 13px; }

/* Featured card */
.cs-featured {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 18px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  transition: border-color 0.15s, box-shadow 0.15s;
  margin-bottom: 6px;
}
.cs-featured:hover {
  border-color: var(--border-hover);
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}
.cs-featured-left {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  flex: 1;
  min-width: 0;
}
.cs-emoji { font-size: 28px; flex-shrink: 0; line-height: 1; margin-top: 2px; }
.cs-tag-row { display: flex; align-items: center; gap: 6px; margin-bottom: 4px; flex-wrap: wrap; }
.cs-domain { font-size: 11px; color: var(--text-muted); font-weight: 500; }
.cs-title { font-size: 15px; font-weight: 700; margin-bottom: 4px; }
.cs-summary { font-size: 13px; color: var(--text-muted); line-height: 1.55; }
.cs-featured-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  flex-shrink: 0;
}
.cs-duration {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--text-muted);
}
.cs-arrow { color: var(--border-hover); }

/* Level badges */
.cs-level {
  font-size: 10px;
  font-weight: 600;
  padding: 2px 7px;
  border-radius: 4px;
}
.cs-level--junior       { background: rgba(34,197,94,0.1);  color: #16A34A; }
.cs-level--intermediate { background: rgba(249,115,22,0.1); color: #EA580C; }
.cs-level--advanced     { background: rgba(168,85,247,0.1); color: #9333EA; }

.cs-recommended {
  font-size: 10px;
  font-weight: 600;
  padding: 2px 7px;
  border-radius: 4px;
  background: rgba(59,130,246,0.1);
  color: #2563EB;
}

/* Others label */
.cs-others-label {
  font-size: 11px;
  font-weight: 500;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 16px 0 4px 4px;
}

/* Row items */
.cs-list { display: flex; flex-direction: column; gap: 1px; }
.cs-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: var(--radius);
  cursor: pointer;
  transition: background 0.1s;
  border: 1px solid transparent;
}
.cs-row:hover {
  background: var(--surface);
  border-color: var(--border);
}
.cs-row-emoji { font-size: 20px; flex-shrink: 0; }
.cs-row-info  { flex: 1; display: flex; align-items: center; gap: 8px; min-width: 0; }
.cs-row-title  { font-size: 13px; font-weight: 600; }
.cs-row-domain { font-size: 12px; color: var(--text-muted); }
.cs-row-meta  { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
```

---

### Task 5 : Onboarding

**Files:**
- Modify: `src/index.css` (ajouter section `.onboarding`)

- [ ] **Step 1 : Ajouter les styles onboarding dans index.css**

```css
/* ===== ONBOARDING ===== */
.onboarding {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  padding: 40px 24px;
  gap: 28px;
  background: var(--bg);
}
.onboarding-stepper {
  display: flex;
  align-items: center;
  gap: 0;
}
.stepper-item {
  display: flex;
  align-items: center;
  gap: 0;
}
.stepper-item + .stepper-item::before {
  content: '';
  display: block;
  width: 40px;
  height: 1px;
  background: var(--border);
  margin: 0 4px;
}
.stepper-item.done + .stepper-item::before { background: var(--text); }
.stepper-dot {
  width: 26px; height: 26px;
  border-radius: 50%;
  border: 1.5px solid var(--border);
  background: var(--surface);
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 600;
  color: var(--text-muted);
}
.stepper-item.active .stepper-dot {
  border-color: var(--text);
  color: var(--text);
  font-weight: 700;
}
.stepper-item.done .stepper-dot {
  background: var(--text);
  border-color: var(--text);
  color: var(--primary-fg);
}
.stepper-label {
  display: none;
}
.onboarding-step {
  max-width: 680px;
  width: 100%;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 32px;
}
.step-company    { text-align: center; padding: 16px 0; }
.company-logo-big {
  width: 72px; height: 72px;
  border-radius: 16px;
  background: var(--primary);
  display: flex; align-items: center; justify-content: center;
  font-size: 28px; font-weight: 800;
  color: var(--primary-fg);
  margin: 0 auto 20px;
}
.company-meta { margin: 8px 0 12px; }
.company-industry {
  background: var(--muted-bg);
  border: 1px solid var(--border);
  padding: 3px 12px;
  border-radius: 4px;
  font-size: 12px;
  color: var(--text-muted);
}
.company-role { font-size: 13px; color: var(--text-muted); }
.context-summary {
  font-size: 14px;
  color: var(--text-muted);
  line-height: 1.7;
  margin: 12px 0;
}
.context-goal {
  background: var(--muted-bg);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 14px;
  margin: 12px 0;
}
.goal-label {
  display: block;
  font-size: 11px; font-weight: 600;
  text-transform: uppercase; letter-spacing: 0.5px;
  color: var(--text-muted);
  margin-bottom: 6px;
}
.context-constraints {
  background: var(--muted-bg);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 14px;
  margin: 12px 0;
}
.constraints-label {
  display: block;
  font-size: 11px; font-weight: 600;
  text-transform: uppercase; letter-spacing: 0.5px;
  color: var(--text-muted);
  margin-bottom: 8px;
}
.context-constraints ul { font-size: 13px; color: var(--text-muted); }
.step-personas h2, .step-kpis h2 { margin-bottom: 6px; }
.step-subtitle { font-size: 13px; color: var(--text-muted); margin-bottom: 16px; }
.personas-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px; }
.step-start { text-align: center; padding: 16px 0; }
.start-icon { font-size: 48px; margin-bottom: 16px; }
.start-reminders {
  text-align: left;
  font-size: 13px;
  color: var(--text-muted);
  margin: 16px 0 24px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  list-style: none;
  padding: 0;
}
.start-reminders li::before { content: '→ '; color: var(--text-muted); }
.start-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 24px;
  background: var(--primary);
  color: var(--primary-fg);
  border-radius: var(--radius);
  font-size: 14px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: background 0.15s;
}
.start-btn:hover { background: #27272A; }
.onboarding-nav {
  display: flex;
  gap: 8px;
}
.nav-btn-ob {
  padding: 8px 16px;
  border-radius: var(--radius);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}
.nav-btn-ob.prev {
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--text-muted);
}
.nav-btn-ob.prev:hover { border-color: var(--border-hover); color: var(--text); }
.nav-btn-ob.next {
  background: var(--primary);
  border: 1px solid var(--primary);
  color: var(--primary-fg);
}
.nav-btn-ob.next:hover { background: #27272A; }
```

- [ ] **Step 2 : Mettre à jour les classes des boutons nav dans Onboarding.jsx**

Dans `src/pages/Onboarding.jsx`, remplacer les classes des boutons navigation :

```jsx
{step > 0 && (
  <button className="nav-btn-ob prev" onClick={() => setStep(s => s - 1)}>← Précédent</button>
)}
{!isLast && (
  <button className="nav-btn-ob next" onClick={() => setStep(s => s + 1)}>Suivant →</button>
)}
```

---

### Task 6 : Module tasks (wizard)

**Files:**
- Modify: `src/index.css` (ajouter section module workspace)

- [ ] **Step 1 : Ajouter les styles du module dans index.css**

```css
/* ===== MODULE WORKSPACE ===== */
.session-complete {
  text-align: center;
  padding: 60px 24px;
}
.complete-icon { font-size: 48px; margin-bottom: 16px; }
.session-complete h2 { margin-bottom: 8px; }
.session-complete p { color: var(--text-muted); margin-bottom: 24px; }

/* Progress Bar */
.progress-bar-wrap {
  margin-bottom: 20px;
}
.progress-bar-steps {
  display: flex;
  align-items: center;
  gap: 0;
  margin-bottom: 8px;
}
.pb-step {
  display: flex;
  align-items: center;
  flex: 1;
}
.pb-dot {
  width: 22px; height: 22px;
  border-radius: 50%;
  border: 1.5px solid var(--border);
  background: var(--surface);
  display: flex; align-items: center; justify-content: center;
  font-size: 10px; font-weight: 600;
  color: var(--text-muted);
  flex-shrink: 0;
  transition: all 0.2s;
}
.pb-dot.done { background: var(--text); border-color: var(--text); color: var(--primary-fg); }
.pb-dot.active { border-color: var(--text); color: var(--text); font-weight: 700; }
.pb-line {
  flex: 1;
  height: 1px;
  background: var(--border);
  transition: background 0.2s;
}
.pb-line.done { background: var(--text); }
.pb-label {
  font-size: 11px;
  color: var(--text-muted);
  margin-top: 4px;
}

/* Artifact panel */
.artifact-panel {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 16px;
  margin-bottom: 16px;
}
.artifact-label {
  font-size: 11px; font-weight: 600;
  text-transform: uppercase; letter-spacing: 0.5px;
  color: var(--text-muted);
  margin-bottom: 10px;
}

/* Task renderer */
.task-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 760px;
}
.task-header {
  margin-bottom: 4px;
}
.task-module-label {
  font-size: 11px;
  font-weight: 500;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}
.task-title { font-size: 18px; font-weight: 700; }
.task-situation {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 16px;
}
.task-situation-label {
  font-size: 11px; font-weight: 600;
  text-transform: uppercase; letter-spacing: 0.5px;
  color: var(--text-muted);
  margin-bottom: 8px;
}
.task-situation p { font-size: 14px; line-height: 1.65; }

.task-choices {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 8px;
}
.task-choice {
  background: var(--surface);
  border: 1.5px solid var(--border);
  border-radius: var(--radius);
  padding: 14px;
  cursor: pointer;
  transition: border-color 0.12s, background 0.12s;
  text-align: left;
}
.task-choice:hover { border-color: var(--border-hover); }
.task-choice.selected {
  border-color: var(--text);
  background: var(--muted-bg);
}
.task-choice-letter {
  font-size: 10px; font-weight: 700;
  color: var(--text-muted);
  margin-bottom: 6px;
}
.task-choice.selected .task-choice-letter { color: var(--text); }
.task-choice p { font-size: 13px; line-height: 1.5; color: var(--text); }

.task-rationale {
  background: var(--surface);
  border: 1.5px solid var(--border);
  border-radius: var(--radius);
  padding: 12px 14px;
  color: var(--text-muted);
  font-size: 13px;
}
.task-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

/* Event overlay */
.workspace-blocked {
  padding: 24px;
  color: var(--text-muted);
  font-size: 14px;
}
```

---

### Task 7 : Debrief

**Files:**
- Modify: `src/index.css` (ajouter section `.debrief`)

- [ ] **Step 1 : Ajouter les styles debrief dans index.css**

```css
/* ===== DEBRIEF ===== */
.debrief-page {
  min-height: 100vh;
  background: var(--bg);
  padding: 48px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
}
#debrief-export {
  width: 100%;
  max-width: 700px;
  display: flex;
  flex-direction: column;
  gap: 28px;
}
.debrief-header { text-align: center; }
.debrief-header h1 { margin-bottom: 4px; }
.debrief-case { font-size: 14px; color: var(--text-muted); }

.score-section {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40px;
  flex-wrap: wrap;
}
.score-circle {
  width: 130px; height: 130px;
  border-radius: 50%;
  border: 3px solid var(--text);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--surface);
}
.score-percent { font-size: 28px; font-weight: 800; }
.score-pts { font-size: 11px; color: var(--text-muted); }

.badge-block { text-align: center; }
.badge-icon { font-size: 40px; margin-bottom: 4px; }
.badge-label { font-size: 18px; font-weight: 700; }
.badge-message { font-size: 13px; color: var(--text-muted); max-width: 280px; line-height: 1.55; margin-top: 6px; }

.module-scores { display: flex; flex-direction: column; gap: 10px; }
.module-scores h2 { margin-bottom: 6px; }
.module-score-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
}
.module-score-title { font-size: 13px; font-weight: 500; flex: 1; min-width: 0; }
.module-score-pts { font-size: 12px; color: var(--text-muted); white-space: nowrap; }
.module-score-bar {
  width: 100px;
  height: 4px;
  background: var(--muted-bg);
  border-radius: 2px;
  overflow: hidden;
  flex-shrink: 0;
}
.module-score-fill { height: 100%; background: var(--text); border-radius: 2px; }
.module-score-pct { font-size: 12px; font-weight: 600; width: 36px; text-align: right; }

.decisions-timeline { display: flex; flex-direction: column; gap: 8px; }
.decisions-timeline h2 { margin-bottom: 6px; }
.decision-item {
  display: flex;
  gap: 12px;
  padding: 12px 14px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
}
.decision-item.optimal { border-left: 3px solid var(--success); }
.decision-item.partial  { border-left: 3px solid var(--warning); }
.decision-item.wrong    { border-left: 3px solid var(--danger); }
.decision-type { font-size: 16px; flex-shrink: 0; }
.decision-content { flex: 1; }
.decision-score { font-size: 12px; font-weight: 600; color: var(--text-muted); margin-bottom: 4px; }
.decision-rationale { font-size: 13px; color: var(--text-muted); line-height: 1.5; }

.debrief-actions {
  display: flex;
  gap: 10px;
}
.export-btn {
  padding: 9px 18px;
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--text);
  border-radius: var(--radius);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  font-family: var(--font);
  transition: border-color 0.15s;
}
.export-btn:hover { border-color: var(--border-hover); }
.export-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.restart-btn {
  padding: 9px 18px;
  background: var(--primary);
  border: 1px solid var(--primary);
  color: var(--primary-fg);
  border-radius: var(--radius);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  font-family: var(--font);
  transition: background 0.15s;
}
.restart-btn:hover { background: #27272A; }
```

---

### Task 8 : Composants partagés

**Files:**
- Modify: `src/index.css` (persona card, KPI dashboard, event overlay, inbox)

- [ ] **Step 1 : Ajouter les styles des composants partagés dans index.css**

```css
/* ===== PERSONA CARD ===== */
.persona-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 16px;
  cursor: pointer;
  transition: border-color 0.12s;
}
.persona-card:hover { border-color: var(--border-hover); }
.persona-card-header { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
.persona-avatar {
  width: 36px; height: 36px;
  border-radius: 50%;
  background: var(--muted-bg);
  border: 1px solid var(--border);
  display: flex; align-items: center; justify-content: center;
  font-size: 16px;
}
.persona-name { font-size: 13px; font-weight: 600; }
.persona-role { font-size: 12px; color: var(--text-muted); }
.persona-details { font-size: 12px; color: var(--text-muted); line-height: 1.5; }

/* ===== KPI DASHBOARD ===== */
.kpi-dashboard { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 10px; }
.kpi-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 14px;
}
.kpi-label { font-size: 11px; color: var(--text-muted); font-weight: 500; margin-bottom: 4px; }
.kpi-value { font-size: 20px; font-weight: 700; }
.kpi-delta { font-size: 11px; margin-top: 2px; }
.kpi-delta.positive { color: var(--success); }
.kpi-delta.negative { color: var(--danger); }

/* ===== EVENT OVERLAY ===== */
.event-overlay-backdrop {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex; align-items: center; justify-content: center;
  z-index: 100;
  padding: 24px;
}
.event-overlay {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 28px;
  max-width: 560px;
  width: 100%;
  box-shadow: 0 8px 40px rgba(0,0,0,0.12);
}
.event-type-badge {
  font-size: 10px; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.5px;
  color: var(--c-inbox);
  margin-bottom: 8px;
}
.event-title { font-size: 17px; font-weight: 700; margin-bottom: 10px; }
.event-description { font-size: 14px; color: var(--text-muted); line-height: 1.65; margin-bottom: 20px; }
.event-choices { display: flex; flex-direction: column; gap: 8px; }
.event-choice {
  background: var(--bg);
  border: 1.5px solid var(--border);
  border-radius: var(--radius);
  padding: 12px 14px;
  cursor: pointer;
  text-align: left;
  font-size: 13px;
  font-family: var(--font);
  transition: border-color 0.12s, background 0.12s;
}
.event-choice:hover { border-color: var(--border-hover); background: var(--surface); }

/* ===== INBOX ===== */
.inbox-list { display: flex; flex-direction: column; gap: 8px; }
.inbox-message {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 14px;
}
.inbox-from { font-size: 12px; font-weight: 600; margin-bottom: 2px; }
.inbox-subject { font-size: 13px; font-weight: 500; margin-bottom: 4px; }
.inbox-body { font-size: 13px; color: var(--text-muted); line-height: 1.55; }
```

---

### Task 9 : Vérification finale

**Files:** aucun fichier modifié

- [ ] **Step 1 : Lancer le serveur de dev et tester chaque page**

```bash
npm run dev
```

Tester dans cet ordre :
1. http://localhost:5173 → CaseSelection : liste propre, featured en haut, pas de bordures colorées
2. Cliquer sur Panier+ → Onboarding : stepper sobre, cartes blanches
3. Démarrer la mission → Workspace : sidebar icônes colorées à gauche
4. Compléter un module → Debrief : score + barres

- [ ] **Step 2 : Lancer les tests**

```bash
npm run test
```

Attendu : tous les tests passent (aucun test ne couvre le CSS).

- [ ] **Step 3 : Commit final**

```bash
git add src/index.css src/components/workspace/Navbar.jsx src/components/workspace/WorkspaceLayout.jsx src/pages/CaseSelection.jsx src/pages/Onboarding.jsx index.html docs/superpowers/
git commit -m "feat: redesign IHM light mode shadcn-style avec sidebar Lucide colorée"
```
