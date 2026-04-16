# Redesign IHM — TP Product Owner

**Date :** 2026-04-15  
**Stack :** React 18 + Vite + Framer Motion + CSS vanilla  
**Approche :** Refonte CSS complète + retouches JSX ciblées (WorkspaceLayout, CaseSelection)

---

## Design System

| Token | Valeur |
|-------|--------|
| `--bg` | `#FAFAFA` |
| `--surface` | `#FFFFFF` |
| `--border` | `#E4E4E7` |
| `--border-hover` | `#A1A1AA` |
| `--text` | `#09090B` |
| `--muted` | `#71717A` |
| `--muted-bg` | `#F4F4F5` |
| `--radius` | `6px` |
| `--radius-lg` | `10px` |

**Couleurs par section (icônes sidebar) :**
- Module : `#3B82F6` (blue-500)
- KPIs : `#22C55E` (green-500)
- Inbox : `#F97316` (orange-500)
- Équipe : `#A855F7` (purple-500)

**Font :** Geist (Google Fonts fallback → Inter)  
**Icons :** Lucide React (SVG — remplace les emojis comme icônes structurelles)

---

## Pages

### CaseSelection
- Header simple : titre + sous-titre
- 1 card "featured" pour la mission recommandée (fond blanc, border subtile, highlight sobre)
- 5 autres missions en liste compacte (row hover state)
- Aucune bordure colorée en haut des cartes

### Onboarding
- Stepper horizontal avec dots (done = filled, active = outlined bold, pending = gray)
- Animations Framer Motion conservées
- Fond `--bg`, cartes `--surface`

### Workspace
- Sidebar icônes 52px à gauche (fond blanc, border-right)
- Chaque icône a sa couleur propre (blue/green/orange/purple)
- État actif : background coloré léger (`rgba(color, 0.1)`) + icône colorée
- Topbar breadcrumb + badge module
- Contenu plein écran à droite

### Module tasks
- Steps linéaires en haut (dots + ligne)
- Bloc situation (border-left sobre, pas colorée)
- 3 choix en colonnes (border noir au survol/sélection)
- Champ justification optionnel
- Footer : bouton ghost + bouton primary (fond noir)

### Debrief
- Score en grand chiffre centré
- Barres de progression par module (fond `--muted-bg`, fill `--text`)
- Timeline décisions sobre

---

## Ce qui ne change PAS
- Toute la logique métier (engines, store, YAML)
- La structure des composants JSX (sauf WorkspaceLayout et CaseSelection)
- Les animations Framer Motion existantes
