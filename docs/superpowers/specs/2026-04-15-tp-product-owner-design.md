---
name: TP Product Owner — Simulation immersive
description: Application web de simulation du rôle de Product Owner consommant des cas YAML, couvrant 11 modules de responsabilités PO
type: project
---

# TP Product Owner — Design Spec

**Date :** 2026-04-15
**Stack :** React 18 + Vite (frontend pur, pas de backend)
**Durée par cas :** 2–3 heures
**Cas :** 6 fichiers YAML indépendants (un par secteur)

---

## 1. Vision produit

L'application simule le poste de travail d'un Product Owner. L'apprenant n'est pas dans un LMS — il est dans un environnement fictif mais crédible qui ressemble aux outils qu'un vrai PO utiliserait. Chaque cas = une mission de quelques semaines compressée en 2–3h. L'apprenant reçoit des messages, consulte des données, prend des décisions et subit des imprévus.

---

## 2. Les 6 cas (fichiers YAML indépendants)

| Fichier | Entreprise | Problématique centrale |
|---|---|---|
| `case-ecommerce.yaml` | Panier+ — marketplace mode seconde main | Arbitrer acquisition vs rétention, taux d'abandon panier |
| `case-saas-b2b.yaml` | OpsFlow — SaaS gestion de projets PME | Dette technique critique vs nouvelles features pour renouveler les contrats |
| `case-sante.yaml` | MediLink — coordination soignants | Prioriser dans un contexte réglementé (RGPD, HDS), multi-personas |
| `case-finance.yaml` | Finio — app épargne & investissement | Lancer un nouveau produit + faille UX qui fait fuir les nouveaux inscrits |
| `case-rh.yaml` | TalentOS — SIRH pour ETI | Backlog post-acquisition, deux bases clients aux besoins contradictoires |
| `case-education.yaml` | Learnify — edtech B2C | Améliorer engagement et complétion face à une chute de rétention J30 |

Chaque cas est autonome. Aucune dépendance entre fichiers.

---

## 3. Flux de l'expérience

```
Sélection du cas (Mission Board)
  → Briefing animé (onboarding)
  → Poste de travail (Workspace)
    → Modules débloqués progressivement (11 modules)
    → Événements imprévus (3 minimum par cas)
  → Débrief final
  → Export PDF
```

---

## 4. Les 11 modules — 3 actes

### Acte 1 — Stratégie
| Module | Type | Interaction principale |
|---|---|---|
| `okr_setting` | Définir OKRs du trimestre | Formulaire OKR avec validation logique (KR mesurable ?) |
| `competitive_analysis` | Analyser marché et concurrents | Matrice de positionnement drag & drop (axes X/Y) |
| `roadmap_planning` | Construire la roadmap | Timeline trimestrielle avec cards draggables par thème |

### Acte 2 — Discovery & Build
| Module | Type | Interaction principale |
|---|---|---|
| `discovery` | Interviews + analytics | Lire artifacts, identifier les vrais problèmes |
| `story_writing` | Rédiger US + critères d'acceptance | Éditeur avec checklist INVEST en temps réel |
| `refinement` | Découper, estimer, prioriser | Tableau d'estimation : glisser les stories dans des t-shirt sizes |
| `sprint_planning` | Composer le sprint | Board capacité avec jauge story points, drag & drop, warnings dépendances |

### Acte 3 — Delivery & Pilotage
| Module | Type | Interaction principale |
|---|---|---|
| `sprint_review` | Accepter/refuser stories livrées | Swipe accept/reject avec critères d'acceptance visibles |
| `kpi_analysis` | Lire données, diagnostiquer | Dashboard recharts interactif (courbes, funnels, heatmaps) |
| `stakeholder_mgmt` | Gérer stakeholders conflictuels | Simulation réunion : messages contradictoires, arbitrage |
| `release_communication` | Communiquer les changements | match_pairs / multi_select sur bon message selon l'audience |

---

## 5. Types de tâches

| Type | Description |
|---|---|
| `single_choice` | 1 bonne réponse parmi N options |
| `multi_select` | Plusieurs bonnes réponses parmi N options |
| `ranking` | Ordonner une liste selon un critère |
| `match_pairs` | Associer deux colonnes |
| `numeric_input` | Saisir une valeur numérique |
| `keywords_text` | Texte libre corrigé par mots-clés attendus |

Toutes les tâches sont corrigibles sans IA.

---

## 6. Structure YAML complète

```yaml
id: string
title: string
version: string
domain: ecommerce | saas_b2b | sante | finance | rh | education
level: junior | intermediate | advanced
duration_minutes: integer

context:
  company: string
  role: string
  industry: string
  summary: string
  business_goal: string
  constraints: []

personas:
  - id: string
    name: string
    role: string
    avatar: string
    personality: string
    goals: []
    frustrations: []

kpis:
  - id: string
    label: string
    value: number
    unit: string
    trend: up | down | stable
    target: number

datasets:
  interviews:
    - persona_id: string
      excerpt: string
      key_insight: string
  analytics:
    - metric: string
      data:                         # format recharts : liste de points {label: string, value: number}
        - label: string
          value: number
      insight: string
  feedback_clients:
    - source: string
      verbatim: string
      sentiment: positive | neutral | negative

modules:
  - id: string
    type: okr_setting | competitive_analysis | roadmap_planning |
          discovery | story_writing | refinement | sprint_planning |
          sprint_review | kpi_analysis | stakeholder_mgmt |
          release_communication
    title: string
    objectives: []
    artifacts:
      - type: email | dashboard | document | chart | table
        title: string
        content: string | object
    instructions: string
    tasks:
      - id: string
        type: single_choice | multi_select | ranking | match_pairs |
              numeric_input | keywords_text
        label: string
        hint: string
        options: []
        expected: any
        points: integer
        rationale: string
    debrief: string
    scoring:
      max_points: integer
      pass_threshold: integer

events:
  - id: string
    trigger: string               # after_module:<module_id>
    title: string
    description: string
    urgency: low | medium | high
    choices:
      - id: string
        label: string
        points: integer
        rationale: string
        effects:
          kpi_id: string
          delta: number

feedback:
  success_thresholds:
    junior:
      max_percent: 39
      message: string
    intermediate:
      min_percent: 40
      max_percent: 74
      message: string
    advanced:
      min_percent: 75
      message: string
  total_points: integer
```

---

## 7. Architecture technique

### Stack
```
React 18 + Vite
├── react-router-dom       navigation
├── zustand                état global de session
├── @dnd-kit/core          drag & drop
├── recharts               graphiques KPIs
├── js-yaml                parsing YAML
├── jsPDF + html2canvas    export PDF
└── framer-motion          animations
```

### Structure des fichiers
```
src/
├── cases/                          # 6 fichiers YAML
│
├── engine/
│   ├── caseLoader.js               # Parse YAML → état JS
│   ├── moduleEngine.js             # Déverrouillage progressif des modules
│   ├── scoreEngine.js              # Calcul scores
│   ├── eventEngine.js              # Déclenchement événements
│   └── pdfExporter.js              # Génération PDF
│
├── components/
│   ├── workspace/                  # Shell "poste de travail"
│   │   ├── WorkspaceLayout.jsx
│   │   ├── Inbox.jsx
│   │   ├── Navbar.jsx
│   │   └── ProgressBar.jsx
│   │
│   ├── modules/                    # 11 composants modules
│   │   ├── OkrSetting.jsx
│   │   ├── CompetitiveAnalysis.jsx
│   │   ├── RoadmapPlanning.jsx
│   │   ├── Discovery.jsx
│   │   ├── StoryWriting.jsx
│   │   ├── Refinement.jsx
│   │   ├── SprintPlanning.jsx
│   │   ├── SprintReview.jsx
│   │   ├── KpiAnalysis.jsx
│   │   ├── StakeholderMgmt.jsx
│   │   └── ReleaseCommunication.jsx
│   │
│   ├── tasks/                      # 6 composants types de tâches
│   │   ├── SingleChoice.jsx
│   │   ├── MultiSelect.jsx
│   │   ├── Ranking.jsx
│   │   ├── MatchPairs.jsx
│   │   ├── NumericInput.jsx
│   │   └── KeywordsText.jsx
│   │
│   └── shared/
│       ├── ArtifactPanel.jsx
│       ├── EventOverlay.jsx
│       ├── PersonaCard.jsx
│       └── KpiDashboard.jsx
│
├── pages/
│   ├── CaseSelection.jsx           # Mission Board
│   ├── Onboarding.jsx              # Briefing animé
│   ├── Workspace.jsx               # Poste de travail
│   └── Debrief.jsx                 # Résultats + PDF
│
└── store/
    └── sessionStore.js             # Zustand
```

### Flux de données
```
YAML → caseLoader → sessionStore (zustand)
                         ↓
              Workspace lit l'état courant
                         ↓
         moduleEngine déverrouille les modules
                         ↓
         eventEngine surveille les triggers
                         ↓
         scoreEngine accumule les points
                         ↓
         Debrief → historique décisions → jsPDF
```

---

## 8. Écrans principaux

### Mission Board (CaseSelection)
Grille de 6 cartes avec illustration sectorielle, niveau, durée, badge de complétion. Effet hover avec preview du contexte.

### Briefing animé (Onboarding)
Séquence narrative : logo + nom entreprise → avatar manager qui brief → organigramme personas cliquable → dashboard KPIs "jour 1".

### Poste de travail (Workspace)
```
┌─────────────────────────────────────────────────────┐
│  [Logo entreprise]   Workspace PO                   │
│  ─────────────────────────────────────────────────  │
│  📥 Inbox (3)  │  📋 Backlog  │  📊 Analytics  │ 📅 Sprint │
│  ─────────────────────────────────────────────────  │
│                                                     │
│         [Contenu du module actif]                   │
│                                                     │
│  ─────────────────────────────────────────────────  │
│  Progression : ████████░░░░  Module 3/11            │
└─────────────────────────────────────────────────────┘
```

### Événements — interruptions visuelles
Notification style "alerte Slack" en overlay avec animation framer-motion. Urgency colorée (vert/orange/rouge). 3+ choix. Feedback immédiat sur impact KPI.

### Débrief + Export PDF
Score animé → timeline des décisions → comparaison décision vs optimale par module → badge niveau → export PDF complet.

---

## 9. Scoring

- Total ~250–300 pts par cas
- Seuils globaux :
  - Junior : < 40%
  - Intermediate : 40–74%
  - Advanced : ≥ 75%
- Score par module avec `pass_threshold` individuel
- Événements contribuent au score global

---

## 10. Périmètre hors scope

- Mode multi-apprenants / facilitation
- Backend / persistance serveur
- Correction par IA (texte libre)
- Clarifications en cours de sprint (nécessite IA)
- Build vs Buy (trop de données financières)
