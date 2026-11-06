# Refonte visuelle du frontend EventHub2026 — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remplacer le style Tailwind générique du frontend React par une identité visuelle cohérente, des composants partagés et un motion discret, sans modifier le comportement métier.

**Architecture:** Les tokens Tailwind v4 de `src/index.css` centralisent la palette, la typographie, les rayons et les ombres. Des primitives UI réutilisables portent les styles communs ; des composants motion dédiés gèrent transitions et listes, avec réduction de mouvement et un rendu immédiat pour le scan-agent. Le déploiement commence par Login et Dashboard participant, avec une validation visuelle avant les autres pages.

**Tech Stack:** React 19, Vite 8, Tailwind CSS v4, React Router v7, lucide-react, framer-motion.

**Spec:** `docs/superpowers/specs/2026-10-02-frontend-redesign-design.md`

## Global Constraints

- Aucun changement à la logique métier, aux routes ou aux appels API.
- Le Scanner reste simulé ; son branchement caméra/API reste hors périmètre.
- Pas de dark mode ni de système de theming multi-client.
- Les couleurs et les polices finales seront fournies par Alec ; les valeurs provisoires ne doivent pas être considérées comme la charte finale.
- Le scan-agent garde la même base visuelle avec priorité à la lisibilité, au contraste et au feedback rapide.
- Respecter `prefers-reduced-motion` pour toutes les animations non essentielles.
- Ne créer que les primitives justifiées par les écrans existants : Button, Card, Badge, Input, EmptyState, PageHeader, échelle de titres et Logo.
- Pas de co-auteur Claude dans les commits et aucun push sans accord explicite d’Alec.

## Review Focus

- Formulaire invalide / serveur en erreur : labels, message d’erreur et champs restent lisibles et correctement associés.
- Chargement et désactivation d’un bouton : texte et état disabled restent visibles sans saut de mise en page.
- Listes vides : EmptyState propose une action cohérente si elle existe déjà, sans fabriquer de nouvelle logique métier.
- URL d’événement ou de billet inconnue : état introuvable conserve son lien de retour et le style de navigation.
- Préférence OS de réduction des animations : pas de translation/cascade non essentielle ; résultat du scan reste immédiat et compréhensible.

---

## Fichiers et responsabilités

- `frontend/src/index.css` — tokens Tailwind v4, reset d’application, typographie globale et préférences motion.
- `frontend/src/components/ui/Button.jsx` — bouton partagé et variantes.
- `frontend/src/components/ui/Card.jsx` — surface et conteneur partagé.
- `frontend/src/components/ui/Badge.jsx` — statuts sémantiques.
- `frontend/src/components/ui/Input.jsx` — champ avec label, icône optionnelle et erreur.
- `frontend/src/components/ui/EmptyState.jsx` — état de liste vide.
- `frontend/src/components/ui/PageHeader.jsx` — titre et sous-titre de page.
- `frontend/src/components/ui/Heading.jsx` — échelle sémantique de titres.
- `frontend/src/components/Logo.jsx` — symbole SVG et wordmark EventHub.
- `frontend/src/components/motion/PageTransition.jsx` — transition d’Outlet selon l’URL et reduced-motion.
- `frontend/src/components/motion/Stagger.jsx` — animation en cascade réutilisable, désactivable par écran.
- `frontend/src/components/Sidebar.jsx`, `frontend/src/layouts/UserLayout.jsx`, `frontend/src/layouts/ScanAgentLayout.jsx` — shell commun et logo, menus mobiles préservés.
- `frontend/src/pages/**` — application des primitives et de l’identité visuelle aux 12 écrans routés.
- `frontend/index.html` — métadonnées de police uniquement si la nouvelle paire nécessite d’ajuster le chargement existant.
- `frontend/package.json`, `frontend/package-lock.json` — dépendance framer-motion.

## Plan de travail

### Task 1: Installer les tokens et la typographie de base

**Fichiers:**
- Modifier : `frontend/src/index.css`
- Consulter : `frontend/index.html`

**Interfaces:**
- Produit les variables Tailwind v4 sémantiques : brand/brand-strong/brand-subtle, ink/ink-muted, surface/surface-alt, border, success/warning/danger/info, font-display/body, radius-sm/md/lg, shadow-sm/md, ease-standard et duration-fast/base.
- Les valeurs couleur et font restent provisoires jusqu’à réception de la charte d’Alec.

- [ ] Remplacer le CSS brut par `@theme` et les tokens listés dans la spec.
- [ ] Définir les styles globaux du body et une échelle explicite h1–h4 afin de corriger le `inherit` du preflight.
- [ ] Vérifier que les classes Tailwind construites depuis les noms sémantiques se compilent : `npm run build` depuis `frontend/`.
- [ ] Vérifier `npm run lint` depuis `frontend/`.

### Task 2: Créer les primitives d’interface et le wordmark

**Fichiers:**
- Créer : `frontend/src/components/ui/Button.jsx`
- Créer : `frontend/src/components/ui/Card.jsx`
- Créer : `frontend/src/components/ui/Badge.jsx`
- Créer : `frontend/src/components/ui/Input.jsx`
- Créer : `frontend/src/components/ui/EmptyState.jsx`
- Créer : `frontend/src/components/ui/PageHeader.jsx`
- Créer : `frontend/src/components/ui/Heading.jsx`
- Créer : `frontend/src/components/Logo.jsx`

**Interfaces:**
- `Button({ variant = "solid", loading = false, disabled, className, children, ...buttonProps })` : variantes solid, outline, ghost ; loading désactive le bouton et conserve son contenu accessible.
- `Card({ className, children, ...divProps })` : surface cohérente et extensible par composition.
- `Badge({ tone = "neutral", children, className })` : tons neutral, brand, success, warning, danger, info.
- `Input({ id, label, icon: Icon, error, className, ...inputProps })` : label associé, icône optionnelle, erreur annoncée et liée au champ.
- `EmptyState({ icon: Icon, title, description, action })` : action optionnelle.
- `PageHeader({ title, description, action })` : titre de page et description optionnelle.
- `Heading({ as = "h2", className, children })` : niveaux h1–h4 sans casser la sémantique HTML.
- `Logo({ compact = false, className })` : symbole géométrique SVG et wordmark ; compact masque le mot seulement si l’espace l’exige.

- [ ] Implémenter les primitives avec les tokens de Task 1, sans ajouter de dépendance de composants.
- [ ] Confirmer par lint/build que chaque export est importable et que les props transmises restent valides.

### Task 3: Ajouter les composants motion partagés

**Fichiers:**
- Modifier : `frontend/package.json`
- Modifier : `frontend/package-lock.json`
- Créer : `frontend/src/components/motion/PageTransition.jsx`
- Créer : `frontend/src/components/motion/Stagger.jsx`
- Modifier : `frontend/src/layouts/UserLayout.jsx`
- Modifier : `frontend/src/layouts/ScanAgentLayout.jsx`

**Interfaces:**
- `PageTransition()` consomme `useLocation` et `useOutlet`, anime le changement de `pathname` avec une légère opacité/translation et supprime la translation si `useReducedMotion()` le demande.
- `Stagger({ children, disabled = false, className })` et `StaggerItem({ children, className })` fournissent une entrée en cascade discrète ; `disabled` rend les éléments immédiatement.
- Les deux layouts remplacent leur `<Outlet />` par `<PageTransition />`. Le layout scan-agent désactive les cascades de listes au niveau de ses pages.

- [ ] Ajouter `framer-motion` avec le gestionnaire npm et mettre à jour le lockfile.
- [ ] Implémenter PageTransition avec `AnimatePresence` et les animations conditionnées par reduced-motion.
- [ ] Implémenter Stagger et StaggerItem avec une option de rendu immédiat.
- [ ] Intégrer PageTransition dans les deux layouts sans changer la sidebar responsive, les menus, ni le contenu des headers.
- [ ] Vérifier build/lint et naviguer entre deux routes dans chaque layout ; confirmer que chaque page reste montée et que la route active s’affiche.

### Task 4: Première tranche visible — Login et Dashboard participant

**Fichiers:**
- Modifier : `frontend/src/pages/Login.jsx`
- Modifier : `frontend/src/pages/user/Dashboard.jsx`
- Modifier : `frontend/src/components/Sidebar.jsx`
- Modifier : `frontend/src/layouts/UserLayout.jsx`

**Interfaces:**
- Ces écrans utilisent Button, Card, Input, PageHeader, Heading et Logo.
- Les statistiques et événements du Dashboard utilisent Stagger/StaggerItem ; la navigation et les micro-interactions simples restent CSS.

- [ ] Remplacer la mise en page et les styles Tailwind codés en dur par les primitives et tokens.
- [ ] Garder exactement le flux login, ses champs, son message d’erreur, son indicateur de chargement et ses destinations.
- [ ] Appliquer Logo dans Sidebar et préserver l’ouverture/fermeture mobile de la sidebar.
- [ ] Donner à Dashboard une hiérarchie claire entre titre, métriques et événements.
- [ ] Vérifier Login et Dashboard sur grand écran et mobile, puis demander à Alec de valider le rendu avant de dérouler les autres pages.

### Task 5: Restyler Register et les pages événements/billets du participant

**Fichiers:**
- Modifier : `frontend/src/pages/Register.jsx`
- Modifier : `frontend/src/pages/user/EventsList.jsx`
- Modifier : `frontend/src/pages/user/EventDetails.jsx`
- Modifier : `frontend/src/pages/user/Tickets.jsx`
- Modifier : `frontend/src/pages/user/TicketDetail.jsx`

**Interfaces:**
- Utilise les primitives validées à Task 4 ; aucune nouvelle API de composant.
- Stagger est appliqué aux cartes de listes ; les états introuvables gardent leurs liens de retour.

- [ ] Migrer le formulaire Register vers Input, Button, Logo, Heading et les styles de feedback partagés.
- [ ] Migrer les cartes d’événements, détails et billets vers Card, Badge, Button, EmptyState et tokens.
- [ ] Garder les liens, données mockées, conditions de statut, QR illustratifs et actions existantes inchangés fonctionnellement.
- [ ] Vérifier les routes de liste, détail, état introuvable et liste vide à largeur mobile et desktop.

### Task 6: Restyler Invitations et Profil participant

**Fichiers:**
- Modifier : `frontend/src/pages/user/Invitations.jsx`
- Modifier : `frontend/src/pages/user/Profile.jsx`

**Interfaces:**
- Utilise PageHeader, Heading, Card, Badge, Button et tokens validés.

- [ ] Restyler les lignes/cartes d’invitation et leurs statuts sans ajouter de logique d’acceptation/refus.
- [ ] Restyler les cartes de profil, informations et préférences en conservant leur contenu et contrôles existants.
- [ ] Vérifier la lisibilité des valeurs longues, des labels et des contrôles sur mobile.

### Task 7: Appliquer la variante scan-agent

**Fichiers:**
- Modifier : `frontend/src/layouts/ScanAgentLayout.jsx`
- Modifier : `frontend/src/pages/scan-agent/Dashboard.jsx`
- Modifier : `frontend/src/pages/scan-agent/Events.jsx`
- Modifier : `frontend/src/pages/scan-agent/Scanner.jsx`

**Interfaces:**
- Utilise les mêmes tokens et primitives UI que le participant.
- Les listes et métriques scan-agent utilisent Stagger disabled ou aucun wrapper ; le feedback de scan conserve une transition courte et reduced-motion compatible.

- [ ] Restyler shell, dashboard, événements et scanner avec contraste renforcé et commandes lisibles rapidement.
- [ ] Garder la zone de scan, ses états prêt/traitement/valide/déjà utilisé/invalide et le timer simulé fonctionnellement inchangés.
- [ ] Éviter toute animation en cascade pendant l’usage opérationnel ; conserver uniquement un feedback d’état bref.
- [ ] Vérifier les scénarios de scan simulés et l’utilisation du layout sur mobile.

### Task 8: Revue visuelle et cohérence finale

**Fichiers:**
- Modifier au besoin : `frontend/src/index.css`, `frontend/index.html`, tous les fichiers du périmètre ci-dessus.

- [ ] Remplacer les valeurs provisoires dans les tokens par les couleurs et polices communiquées par Alec ; ajuster le chargement de police dans index.html si nécessaire.
- [ ] Rechercher les usages résiduels du bleu Tailwind codé en dur et les couleurs d’état dispersées ; migrer les occurrences de présentation vers les tokens sémantiques.
- [ ] Parcourir les 12 routes : Login, Register, 7 routes participant (Dashboard, liste/détail événement, liste/détail billet, Invitations, Profil) et 3 routes scan-agent.
- [ ] Contrôler les formats responsive, erreurs de formulaire, états vides/introuvables et reduced-motion.
- [ ] Exécuter `npm run lint` et `npm run build` depuis `frontend/`; corriger les erreurs avant clôture.
