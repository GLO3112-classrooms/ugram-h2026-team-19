# 📷 ugram
Ugram est une application de partage de photos inspirée d'Instagram, développée dans le cadre du cours GLO-3112 à l'Université Laval. L'objectif de ce projet est de créer une plateforme conviviale pour les utilisateurs afin de partager leurs moments en images, tout en mettant en pratique les compétences acquises en développement web.

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
- CI/CD : [GitHub Actions](https://docs.github.com/actions), [ESLint](https://eslint.org), [Prettier](https://prettier.io), Git hooks ([Husky](https://typicode.github.io/husky)), analyse de code / coverage, Dependabot
- Méthode de déploiement : le déploiement suivra les méthodes démontrées dans le cours

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
git switch release-1
```
3. Configurer les variables d'environnement en créant un fichier `.env` à la racine du projet et en y ajoutant les variables nécessaires (vous pouvez vous référer au fichier `.env.example` pour connaître les variables requises).
4. Démarrer le projet avec Docker Compose :
```bash
docker-compose up
```

## 🧪 Tests
Pour tester l'application, assurez-vous d'avoir suivi les étapes d'installation de la section précédente.
Une fois cela fait, vous pourrez vous rendre sur l'adresse indiquée dans votre console (http://localhost:5173 par défaut)

- Création de compte (`/signup`)
  - Créez un compte en remplissant les informations du formulaire
- Connexion (`/signin`)
  - Connectez-vous avec les informations de votre compte
- Page d'accueil (`/`)
  - Visualisez les photos partagées par les utilisateurs
- Profil utilisateur (`/account`)
  - Accédez à votre profil pour voir et modifier vos informations personnelles
- Recherche d'utilisateurs (`/search`)
  - Recherchez d'autres utilisateurs et visualisez leurs profils
- Créez un nouveau post (`/create`)
  - Partagez une nouvelle photo en remplissant le formulaire de création de post

## 👥 Équipe

- Clément Liénard
- Jules Weishaus
- Malo Durand
- Merlin Cyffers
