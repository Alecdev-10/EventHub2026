# Séparation du back-office et demandes de support

## Objectif

Le frontend EventHub ne sert qu’aux participants et aux agents de scan. Les rôles `superAdmin` et `eventManager` utilisent Filament sur le serveur backend avec une authentification de session distincte. Les visiteurs et les utilisateurs connectés peuvent contacter l’entreprise ou signaler un problème sans pièce jointe.

## Décisions

- Pas de SSO entre la SPA et Filament. Un compte organisateur détecté par l’API est redirigé vers l’URL réelle du formulaire Filament ; il doit s’y authentifier séparément.
- L’API n’émet pas et le frontend ne conserve pas de jeton Sanctum pour `superAdmin`/`eventManager` dans ce flux.
- Les demandes vont à une boîte configurable (`SUPPORT_INBOX_ADDRESS`) via le mailer Laravel, de sorte que le fournisseur puisse être changé par configuration.
- Types de demande : `contact` et `problem`. Leur schéma serveur est validé selon le type.
- Les demandes sont persistées avant notification. Une clé `Idempotency-Key` UUID unique empêche les doublons lors des répétitions réseau ; une même clé réutilisée avec un contenu différent reçoit HTTP 409.
- Limitation côté serveur par IP et adresse e-mail ; pièces jointes non acceptées.
- En l’absence de boîte configurée, la demande est enregistrée, mais le retour utilisateur indique que l’e-mail n’a pas été transmis.

## Étapes

1. **Séparer les rôles et le point d’entrée Filament**
   - Ajouter `FILAMENT_ADMIN_URL` (valeur locale `/admin/login`, configurable en production).
   - Faire retourner cette URL par le login API pour les rôles d’administration, sans créer de jeton.
   - Adapter `AuthContext` et la page Login ; ne conserver que Participant et ScanAgent dans les routes protégées du frontend.
   - Ajouter un lien d’accès direct au back-office.

2. **Créer l’API de demandes**
   - Ajouter migration, modèle, contrôleur et route publique `POST /api/support-requests`.
   - Valider et normaliser les champs communs et conditionnels ; associer l’utilisateur uniquement si un jeton Sanctum valide est présent.
   - Imposer une clé d’idempotence, hacher le contenu normalisé et répondre sans doublon aux répétitions identiques.
   - Limiter les soumissions côté serveur par IP et par e-mail.

3. **Préparer la notification par e-mail**
   - Ajouter un Mailable séparé du contrôleur et un modèle Blade échappant le contenu utilisateur.
   - Lire la boîte depuis `SUPPORT_INBOX_ADDRESS`; utiliser le mailer Laravel standard pour permettre le changement de fournisseur sans coupler le contrôleur à un service.
   - Envoyer en synchrone pour cette première version : le projet n’a actuellement ni table `jobs` ni infrastructure de traitement de queue documentée.
   - Enregistrer l’état de notification et fournir un retour honnête si l’adresse ou le transport ne sont pas configurés.

4. **Construire la page dynamique**
   - Ajouter `/contact`, atteignable depuis Login/Register et les deux espaces connectés.
   - Préremplir nom/e-mail pour les comptes connectés ; proposer des champs adaptés à `contact` ou `problem`.
   - Générer une clé UUID stable pendant une tentative, la réutiliser lors d’une reprise réseau, puis la renouveler après succès ou modification du contenu.
   - Afficher confirmation, état de notification, validation par champ et états de limitation réseau.

5. **Vérifier**
   - Contrôler build, lint, diff, URL de redirection et routes enregistrées sans lancer de tests automatisés.
   - Vérifier l’absence de la table puis appliquer uniquement la migration additive `support_requests`; ne pas appliquer les autres migrations déjà en attente.

## Hors périmètre

- SSO / connexion unique entre serveurs.
- Pièces jointes, CAPTCHA, outil externe de support ou changement de fournisseur mail.
- Modifications du seeder déjà présent dans le working tree.

## Backlog BO et événements (à planifier avant implémentation)

- [ ] **Double authentification du back-office** : ajouter une deuxième étape d’authentification pour Filament, avec récupération et règles de session à définir.
- [ ] **Affectation des ScanAgents** : permettre d’affecter un ou plusieurs agents à un événement depuis Filament. Modèle recommandé à confirmer au moment du plan : relation plusieurs-à-plusieurs (un agent peut couvrir plusieurs événements et un événement plusieurs agents), puis limiter les événements et scans visibles aux agents affectés.
- [ ] **Validation cohérente de bout en bout** : auditer les formulaires Filament, les endpoints API et les contraintes DB. Pour les événements, refuser un début antérieur à maintenant et une fin antérieure au début, en appliquant le même fuseau horaire et les mêmes règles en création comme en modification. Valider aussi formats, longueurs, bornes numériques, unicité et cohérence des statuts/relations.
- [ ] **Prix des événements** : champ nullable, valeur absente = gratuit, valeur positive = payant. Préciser devise et précision décimale avant l’implémentation; le prix seul ne met pas en place le paiement.
- [ ] **Image de couverture gérée par le BO** : ajouter l’upload à la création et à la modification, stocker le fichier dans le stockage applicatif, enregistrer le chemin/URL, valider type MIME et taille, et gérer proprement le remplacement/suppression.
- [ ] **Intégrité de la section Tickets du BO** : remplacer les champs bruts par des choix liés aux utilisateurs et protéger les invariants QR/statut/horodatages/compteur `activeRegistered`; les actions manuelles ne doivent pas désynchroniser l’inscription.
