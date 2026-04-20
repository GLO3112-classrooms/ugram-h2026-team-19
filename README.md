# 📷 Ugram

Ugram est une application de partage de photos inspirée d'Instagram, développée dans le cadre du cours GLO-3112 à l'Université Laval.\
L'objectif de ce projet est de créer une plateforme conviviale pour les utilisateurs afin de partager leurs moments en images, tout en mettant en pratique les compétences acquises en développement web.

## 🎨 Technologies utilisées (Design)
- Frontend
    - Framework : [SvelteKit](https://svelte.dev)
    - CSS : [Tailwind](https://tailwindcss.com)
    - Composants : [shadcn](https://www.shadcn-svelte.com)
- Backend
    - Langage : [TypeScript](https://www.typescriptlang.org)
    - Framework : [NestJS](https://nestjs.com)
        - ORM : [Prisma](https://www.prisma.io)
- Base de données : [PostgreSQL](https://www.postgresql.org)
- Stockage de fichiers : [AWS S3](https://aws.amazon.com/s3)
- Cache : [Redis](https://redis.io)
- CI/CD : [GitHub Actions](https://docs.github.com/actions), [ESLint](https://eslint.org), [Prettier](https://prettier.io), Git hooks ([Husky](https://typicode.github.io/husky)), analyse de code / coverage, Dependabot
- Méthode de déploiement : AWS et Terraform

## 🧪 Tests

Pour tester l'application, rendez-vous sur cette adresse : https://ugram.zowks.fr. Si vous avez des difficultés à accéder à l'application, essayez à l'adresse suivante : https://ugram.wshs.dev.

Vous pouvez également installer et exécuter le projet en local en suivant [les instructions d'installation ci-dessous](#-installation).

- Création de compte (`/signup`)
  - Créez un compte en remplissant les informations du formulaire
- Connexion (`/signin`)
  - Connectez-vous avec les informations de votre compte
- Connexion avec Google (`/signin`)
  - Connectez-vous en utilisant votre compte Google
- Page d'accueil (`/`)
  - Visualisez les photos partagées par les utilisateurs
- Profil utilisateur (`/account`)
  - Accédez à votre profil pour voir et modifier vos informations personnelles
- Créez un nouveau post (`/create`)
  - Partagez une nouvelle photo en remplissant le formulaire de création de post
- Réagir au post d'un utilisateur
  - Cliquez sur le cœur pour aimer un post ou cliquez à nouveau pour retirer votre like
- Commenter un post
  - Cliquez sur l'icône de commentaire pour ajouter un commentaire à un post
- Consulter les réactions et les commentaires d'un post
  - Cliquez sur le nombre de likes ou de commentaires pour voir les détails
- Notifications lorsqu'un utilisateur interagit avec votre post
  - Une notification s'affiche dans la zone de notifications (cloche en haut à droite sur la page d'accueil) lorsque quelqu'un aime ou commente votre post
- Profil d'un utilisateur (`/user/[userId]` et `/user/me`)
  - Cliquez sur le nom d'un utilisateur pour voir son profil et ses posts
  - Votre profil est également accessible depuis la barre de navigation
- Voir les détails d'un post (`/post/[postId]`)
  - Cliquez sur un post depuis la page profil d'un utilisateur pour voir ses détails
- Recherche d'utilisateurs et de posts (`/search`)
  - Recherchez d'autres utilisateurs et visualisez leurs profils
  - Recherchez des posts par mots-clés ou hashtags et visualisez les résultats
- Modifier les détails d'un post (`/update/[postId]`)
  - Modifiez les détails d'un post que vous avez créé
- Messages privés
  - Un usager peut envoyer un message privé à un autre utilisateur en cliquant sur le bouton "Message" sur le profil de cet utilisateur
  - Les messages privés sont affichés en direct lorsque l'utilisateur est sur la conversation correspondante
- Mots clés populaires
  - Sur la page de recherche, les mots clés populaires sont affichés pour aider les utilisateurs à découvrir du contenu tendance

- La documentation du backend (API) peut être consultée à l'adresse suivante : https://2mwpsg4nxd.us-east-1.awsapprunner.com/openapi.

## 🚀 Installation

Voici les différentes étapes pour installer et exécuter le projet en local :

> [!NOTE]
> Veuillez noter que le projet nécessite Docker, vous pouvez retrouver les informations d'installation sur leur site officiel : [https://docs.docker.com/engine/install/](https://docs.docker.com/engine/install/).

1. Cloner le dépôt et se positionner sur la branche de release :
```bash
git clone git@github.com:GLO3112-classrooms/ugram-h2026-team-19.git
```
2. Se rendre sur la branche de release :
```bash
git switch release-2
```
3. Configurer les variables d'environnement en créant un fichier `.env` basé sur le `.env.example` à la racine du projet
  - Pour la plupart des valeurs, vous pouvez vous référer au fichier `.env.example`.
  - Pour `GOOGLE_CLIENT_ID` et `GOOGLE_CLIENT_SECRET`, il vous faudra créer et configurer une application dans la console de développeur Google pour obtenir ces informations.
    - Dans "origines JavaScript autorisées", mettez `http://127.0.0.1:3000` (ou la valeur correspondante à `STATIC_ORIGIN` dans votre `.env`).
    - Dans "URI de redirection autorisés", mettez `http://127.0.0.1:8080/auth/google/callback` (ou la valeur correspondante à `FRONTEND_ORIGIN` dans votre `.env` suivie de `/auth/google/callback`, soit la valeur correspondante à `GOOGLE_CALLBACK_URL` dans votre `.env`).
4. Démarrer le projet avec Docker Compose :
```bash
docker compose up --build
```

## 👥 Équipe

- Clément Liénard
- Jules Weishaus
- Malo Durand
- Merlin Cyffers
