# Refonte visuelle du frontend EventHub2026 — Design

Date : 2026-10-02
Mise à jour des choix créatifs : 2026-11-06
Branche : `feature/frontend-redesign`
Repo : `EventHub2026-main/frontend`

## 1. Contexte et problème

Le frontend (React 19 + Vite 8 + Tailwind v4 + `lucide-react` + `react-router-dom` v7) a un rendu "générique IA" : zéro design system. Constats vérifiés dans le code, pas supposés :

- `src/index.css` ne contient que `@import "tailwindcss";` et un reset trivial — aucun token de couleur, typographie, espacement ou rayon custom.
- La couleur `#3B82F6` (bleu par défaut de Tailwind) est codée en dur dans **74 occurrences** à travers 14 fichiers (`Login.jsx`, `Register.jsx`, `Sidebar.jsx`, `UserLayout.jsx`, toutes les pages `user/*` et `scan-agent/*`).
- Tous les titres (`<h1>`, `<h2>`, `<h3>`, `<h4>`) sont rendus **sans aucune classe Tailwind**. Le preflight de Tailwind v4 force `font-size: inherit; font-weight: inherit` sur les headings (`node_modules/tailwindcss/preflight.css:84-85`) : résultat, chaque titre de l'app s'affiche actuellement à la même taille et la même graisse que le texte courant qui l'entoure. C'est un bug visuel silencieux, pas juste une absence de style.
- `index.html` charge la police Inter via Google Fonts, mais elle n'est appliquée nulle part (`font-family` reste au fallback `system-ui` de Tailwind).
- Aucune librairie de motion/animation n'est installée.

Le motion seul plaqué sur ces fondations resterait générique : la priorité est l'identité visuelle (couleur, typo, composants), le motion vient renforcer cette identité une fois posée.

Contexte produit : EventHub a basculé (2026-08-20) vers un produit commercial vendu à des entreprises, une instance déployée par client (pas de SaaS multi-tenant). Le back-office vit dans Filament (Laravel), hors scope de ce chantier — ce frontend React ne sert que l'espace participant et l'espace scan-agent.

## 2. Objectif

Sortir l'app du look Tailwind-par-défaut en construisant un vrai design system (tokens + composants partagés + identité de marque) et en y intégrant du motion fonctionnel, sans sur-architecturer pour des besoins non confirmés (theming multi-client, dark mode).

## 3. Direction créative retenue

- **Personnalité de marque** : pro & rassurant — registre B2B SaaS confiant et sobre (Linear/Stripe/Notion), pas festif/flashy, pas froid/minimal à l'extrême.
- **Couleur** : on s'éloigne du bleu Tailwind par défaut. À la demande d'Alec (« je te laisse me surprendre »), proposition de palette terre cuite, encre vert profond et ivoire ; valeurs documentées en §4.
- **Typographie** : Fraunces pour les titres et DM Sans pour l'interface. Les deux polices sont centralisées dans les tokens et chargées depuis Google Fonts.
- **Motion** : subtil et fonctionnel — micro-interactions soignées, pas de moments d'animation "signature" spectaculaires.
- **Theming multi-client** : explicitement **hors scope maintenant**. Une seule identité forte et cohérente est construite. Comme Tailwind v4 génère déjà des variables CSS depuis `@theme`, un swap de palette futur restera simple le jour où un besoin client concret apparaît — pas de couche de config à construire par anticipation.
- **Espace scan-agent** : variante sobre et rapide du même design system (mêmes tokens/composants de base), priorité à la lisibilité/contraste et à la vitesse plutôt qu'à la richesse visuelle — c'est un outil utilisé par du personnel pendant un événement en direct, pas une vitrine.
- **Identité "EventHub"** : un wordmark + un symbole géométrique simple (SVG/CSS, pas de designer externe), pas juste du texte stylisé.
- **Retour d’Alec au premier checkpoint** : l’accroche anglaise a été remplacée par une formulation en français centrée sur l’entreprise et ses activités ; Register reprend la même identité, et les champs mot de passe peuvent afficher/masquer la saisie.

## 4. Architecture des tokens

Tout est défini via le bloc `@theme` de Tailwind v4 (CSS-first, pas de `tailwind.config.js`) dans `src/index.css`. Les tokens sémantiques centralisent les valeurs retenues pour cette proposition — un seul point de modification au lieu de 14 fichiers :

- Couleur : `--color-brand: #A95036`, `--color-brand-strong: #843A28`, `--color-brand-subtle: #F1E4DD`, `--color-ink: #222923`, `--color-ink-muted: #6B736D`, `--color-surface: #FFFEFA`, `--color-surface-alt: #F3F1EB`, `--color-border: #E4E0D7`, `--color-success: #26734D`, `--color-warning: #A65B16`, `--color-danger: #B33C38`, `--color-info: #426B78`.
- Typographie : `--font-display: Fraunces`, `--font-body: DM Sans`, plus une échelle de titres (tailles + line-height) pour corriger le bug `inherit` du §1.
- Forme : `--radius-sm` / `--radius-md` / `--radius-lg`, `--shadow-sm` / `--shadow-md`.
- Motion : `--ease-standard`, `--duration-fast`, `--duration-base`.

Les couleurs sémantiques de statut (`success`/`warning`/`danger`) remplacent les classes Tailwind littérales actuelles (`bg-green-500`, `text-orange-600`, etc. dispersées dans le code) par des tokens centralisés, tout en gardant la même intention visuelle (vert=succès, orange=attention, rouge=erreur) pour ne pas casser la compréhension existante des statuts billet/événement/invitation.

Cette palette et ce pairing sont la proposition créative demandée par Alec. Ils peuvent être affinés en modifiant uniquement les tokens et les liens de chargement de police.

## 5. Composants UI partagés

Nouveau dossier `src/components/ui/`. Inventaire basé sur les patterns réels identifiés dans le code existant (pas de composants spéculatifs — YAGNI) :

- `Button` — variantes solid / outline / ghost, état disabled/loading. Remplace les boutons `bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563EB]` dupliqués dans Login, Register, Dashboard, Tickets, EventsList, Scanner.
- `Card` — remplace le pattern `bg-white rounded-xl shadow-sm border border-gray-200` répété dans quasiment toutes les pages (cartes stats, cartes événement, cartes billet, conteneurs de liste).
- `Badge` — remplace les pills de statut (`px-3 py-1 rounded-full text-sm` avec couleur conditionnelle) utilisées pour les statuts billet/événement/invitation et les stats de scan.
- `Input` — champ texte avec slot icône (pattern déjà présent dans Login avec `Mail`/`Lock` de lucide-react), label, état d'erreur. Utilisé dans Login, Register, Profile.
- `EmptyState` — icône + titre + description + CTA, pattern déjà présent dans `Tickets.jsx` (liste vide), généralisé pour les autres listes.
- `PageHeader` — le pattern `<h1>Titre</h1><p>Sous-titre</p>` répété en tête des 10 pages.
- Échelle de titres (`Heading` ou classes utilitaires dédiées) pour corriger le bug du §1.
- `Logo` — symbole SVG + wordmark, remplace le texte brut "EventHub" dans `Sidebar.jsx`, `Login.jsx`, `Register.jsx`.

Explicitement exclus car aucun pattern existant ne les justifie : Modal, Table, Tabs, Avatar complexe. Si un besoin apparaît pendant l'implémentation, il sera traité au cas par cas, pas anticipé ici.

## 6. Architecture motion

Nouvelle dépendance : `framer-motion` (publié aussi sous le nom `motion`, version installée `14.10.1`, compatible React 19). Choisi plutôt que GSAP, qui cible surtout le scroll-storytelling complexe sur des sites vitrine — absent ici (pas de page marketing publique, l'app commence directement sur `/Login`).

Répartition CSS vs JS :
- **CSS/Tailwind** (pas de JS) pour les micro-interactions simples et peu coûteuses : hover de carte, focus d'input, transitions de couleur sur bouton. Ces comportements sont déjà en grande partie présents via `transition-colors` dans le code actuel.
- **`framer-motion`** pour ce que CSS gère mal : transitions de page (`AnimatePresence` au niveau des layouts `UserLayout`/`ScanAgentLayout`, fade + léger slide), apparition en cascade des grilles/listes au montage (cartes d'événements, billets, stats du dashboard), et l'overlay de résultat du `Scanner`.
- Respect systématique de `prefers-reduced-motion` via le hook `useReducedMotion` de `framer-motion` — le motion non essentiel est désactivé pour les utilisateurs qui l'ont demandé au niveau OS.

**Variante scan-agent** : mêmes composants et tokens, mais l'apparition en cascade des listes/stats est désactivée (rendu instantané — vitesse avant polish). Seul le feedback de résultat de scan (`ScanAgentScanner`) garde une transition, courte, pour signaler clairement le changement d'état sans ralentir l'enchaînement des scans.

## 7. Périmètre et ordre de déploiement

Approche retenue : fondations d'abord, validation précoce, puis déploiement méthodique (plutôt qu'une réécriture en un seul passage ou un restylage page par page sans composants partagés — ces deux alternatives ont été écartées : la première retarde toute validation du "look" jusqu'à ce que tout soit fait, la seconde reproduirait le problème actuel de duplication).

Ordre :
1. Socle : tokens (`index.css`), composants `src/components/ui/`, composant `Logo`.
2. Validation sur un sous-ensemble représentatif : `Login` + `Dashboard` participant. Point de passage avec Alec avant de continuer.
3. Reste de l'espace participant : `Register`, `EventsList`, `EventDetails`, `Tickets`, `TicketDetail`, `Invitations`, `Profile`.
4. Espace scan-agent (variante sobre) : `Dashboard`, `Events`, `Scanner`.

## 8. Hors scope

- Le `Scanner` reste simulé : le `TODO` déjà présent dans le code pour le câblage caméra/QR réel et l'appel API n'est pas traité dans ce chantier, uniquement son habillage visuel.
- Pas de dark mode.
- Pas de page vitrine/marketing publique (l'app n'en a pas aujourd'hui, elle démarre sur `/Login`).
- Pas de système de theming multi-client (voir §3).
- Pas de changement de logique métier, de routes, ou d'appels API — ce chantier est strictement visuel/structurel côté présentation.

## 9. Vérification

Pas d'outillage de test visuel automatisé dans ce repo. Vérification à chaque étape via :
- `npm run dev` + contrôle manuel dans le navigateur (golden path de chaque écran retouché, plus le comportement responsive mobile de la Sidebar/UserLayout, déjà existant et à préserver).
- `npm run lint` et `npm run build` pour détecter toute régression de build.
- Vérification explicite que `prefers-reduced-motion` est respecté (simulation navigateur) avant de considérer le chantier motion terminé.

## 10. Gouvernance

- Pas de co-auteur Claude dans les commits de ce repo.
- Aucun `git push` sans accord explicite préalable d'Alec, à chaque fois.
- Une branche dédiée (`feature/frontend-redesign`) pour tout ce chantier.
