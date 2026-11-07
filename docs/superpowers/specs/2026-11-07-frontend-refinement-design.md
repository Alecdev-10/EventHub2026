# EventHub — affinage frontend et notifications

Date : 2026-11-07
Repo : `EventHub2026-main/frontend`
Chantier : 1 sur 2 — expérience frontend et finition visuelle

## Intention

Poursuivre le design system déjà appliqué à l’espace Participant et ScanAgent, corriger les détails visuels signalés par Alec et rendre les actions importantes plus lisibles grâce à des notifications animées. L’identité existante (encre vert profond, terre cuite, ivoire, Fraunces + DM Sans) est conservée.

La séparation en deux chantiers est décidée. Le chantier 2 traitera le modèle événement, les affectations d’agents, le prix XOF, les couvertures et l’audit des politiques/validations BO/API. La double authentification BO reste au backlog futur.

## Approches considérées

1. **Reprendre toutes les pages à zéro** : cohérence visuelle maximale, mais risque élevé de régression fonctionnelle et de perte des retouches déjà validées.
2. **Affiner le système existant et ajouter un feedback global partagé** — **approche retenue** : corriger les points observés et construire une seule primitive de notifications réutilisable par tous les parcours. Elle respecte l’identité en place et limite les changements de comportement.
3. **Ajouter une bibliothèque de toasts** : mise en place rapide, mais introduit une seconde convention visuelle et une dépendance alors que Framer Motion est déjà installé.

## Périmètre

### Connexion et inscription

- Retirer uniquement le lien visible « Accéder au back-office » de la page Login.
- Préserver sans modification fonctionnelle l’authentification par rôle et la redirection automatique actuelle vers l’URL Filament configurée pour `superAdmin` et `eventManager`. Le lien disparaît de l’interface publique; la redirection conditionnelle après authentification réussie reste opérationnelle.
- Afficher au moment de ce transfert un message bref : « Vous serez redirigés vers la bonne adresse pour vous connecter. » L’URL cible et les règles de rôle restent identiques. La notification a une courte entrée visuelle avant la navigation afin que son texte soit perceptible; aucun écran ou choix supplémentaire n’est ajouté.
- Ajouter la signature de copyright dans les écrans publics d’authentification.

### Contact

- Corriger l’en-tête observé sur la capture : le lien de retour ne doit plus empiéter sur le logo. Sur petit écran comme sur grand écran, le logo et le lien disposent de lignes/espaces propres.
- Remplacer l’icône de « Nous contacter » par une enveloppe (Lucide `Mail`), cohérente avec l’action et distincte de l’icône de signalement.
- Garder les champs, règles d’envoi et réponses du formulaire inchangés.

### Notifications d’action

- Créer une primitive partagée et un hôte global en haut de l’écran, alimentés par Framer Motion déjà installé; aucune dépendance supplémentaire.
- Style « liquid glass » interprété dans la palette EventHub : surface ivoire/translucide, flou maîtrisé, bordure claire et ombre discrète. Le contenu reste fortement contrasté et le style ne doit pas empêcher la lecture.
- Prévoir succès, information et erreur, empilement borné, fermeture manuelle, durée de vie adaptée et annonces accessibles (`role=status` / `role=alert`, région live).
- Déclencher des retours sur les actions métier principales : connexion/transfert BO, inscription et annulation d’un événement, invitation, mise à jour de profil, envoi de contact, ainsi que scans valides, déjà utilisés et invalides. Ne pas notifier les simples clics de navigation ou chaque changement de champ.
- Les messages de scan restent immédiatement lisibles pour permettre un enchaînement rapide en situation d’accueil.
- Motion court de type apparition/départ, respect de `prefers-reduced-motion`, clavier et focus visibles. Les erreurs importantes ne doivent pas disparaître avant que l’utilisateur ait le temps de les lire.

### Signature

Ajouter une mention discrète et cohérente aux espaces public, Participant et ScanAgent : `© 2026 Alecdev-10 · EventHub`. Le pseudo provient du remote Git vérifié (`Alecdev-10/EventHub2026`). Ne pas attribuer de copyright légal supplémentaire ni changer de licence.

## Direction visuelle

- Palette héritée : encre `#222923`, terre cuite `#A95036`, ivoire `#FFFEFA`, fond doux `#F3F1EB`, texte secondaire `#6B736D`.
- Fraunces pour les titres, DM Sans pour l’interface.
- Mise en page existante conservée. Pour le retour/contact, alignement à gauche dans un en-tête verticalement rythmé plutôt qu’une ligne comprimée avec le logo.
- La notification est le seul nouvel élément à effet matière marqué; les cartes et formulaires gardent les surfaces actuelles pour que le « liquid glass » reste un accent fonctionnel, pas une décoration omniprésente.
- Pas d’animation décorative continue ni de déplacement piloté par la souris pour les notifications.

## Hors périmètre

- Tout changement API, schéma, permission, politique ou fonctionnalité Filament.
- Nouvelle authentification, nouvelle URL admin, SSO, modification du rôle ou des règles de redirection après connexion.
- Le chantier fonctionnel événements du chantier 2 et la 2FA.
- Une refonte globale des layouts déjà validés en dehors de la signature et du point de montage des notifications.

## Conditions d’acceptation

- Le lien BO n’apparaît plus dans Login; la redirection admin existante demeure conditionnée à une authentification valide et à la réponse de rôle de l’API.
- Le message de transfert est annoncé brièvement avant la redirection; son URL cible et ses règles restent inchangées.
- Sur `/contact`, le lien de retour n’empiète sur le logo aux largeurs mobile et desktop; l’icône contact exprime l’envoi d’un message.
- Chaque action listée produit une notification appropriée, sans doublon avec une erreur inline qui ferait répéter le même texte.
- Les notifications sont accessibles, contrastées, utilisables au clavier et compatibles avec la réduction du mouvement.
- La signature `Alecdev-10` est présente dans les trois espaces concernés.
- Le reste des comportements métier est préservé.

## Décisions de l’utilisateur

- Découper en deux chantiers; terminer l’affinage frontend avant d’entamer le chantier événements/BO.
- Retirer visuellement le lien vers le BO, en gardant le routage automatique existant pour les rôles BO après authentification.
- Employer le message : « Vous serez redirigés vers la bonne adresse pour vous connecter. »
- Ajouter le pseudo GitHub `Alecdev-10` à la signature visuelle du projet.


## Ajustement de périmètre confirmé avant planification

Le frontend EventHub a un bouton « Participer » sans handler et utilise des événements mock. Puisque le feedback d’inscription événementielle fait partie du besoin, ce premier chantier ajoute le branchement participant vers les endpoints déjà disponibles (`GET /events`, `GET /events/{event}`, `GET /tickets`, `POST /events/{event}/tickets`, `DELETE /tickets/{ticket}`). Aucun changement backend ni de règle de capacité/statut n’est prévu; l’API reste l’autorité. Les écrans Profil et Invitations ont des contrôles sans action persistée : pas de notification de succès tant que ces fonctions ne sont pas réellement implémentées.
