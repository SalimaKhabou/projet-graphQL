# 🌍 Travel API — GraphQL avec Node.js, Apollo Server & MongoDB

Une API GraphQL complète autour du thème des voyages, permettant de consulter, ajouter, modifier et supprimer des destinations, utilisateurs, notes et avis en temps réel.

---

## 📋 Table des matières

1. [Présentation du projet](#-présentation-du-projet)
2. [Technologies utilisées](#-technologies-utilisées)
3. [Architecture du projet](#-architecture-du-projet)
4. [Prérequis](#-prérequis)
5. [Installation](#-installation)
6. [Configuration](#-configuration)
7. [Import des données](#-import-des-données)
8. [Lancement du serveur](#-lancement-du-serveur)
9. [Schéma GraphQL](#-schéma-graphql)
10. [Exemples de requêtes](#-exemples-de-requêtes)
11. [Structure des collections MongoDB](#-structure-des-collections-mongodb)
12. [Scripts disponibles](#-scripts-disponibles)
13. [Auteur](#-auteur)

---

## 📖 Présentation du projet

Ce projet est une API GraphQL développée dans le cadre d'un mini-projet académique. Elle expose des données liées aux voyages à travers quatre entités principales reliées entre elles :

- **Places** : destinations touristiques du monde entier
- **Users** : profils de voyageurs avec leurs préférences
- **Ratings** : notes attribuées par les utilisateurs aux destinations
- **Reviews** : avis textuels laissés par les utilisateurs

L'API implémente les trois piliers fondamentaux de GraphQL :
- **Queries** : consultation des données
- **Mutations** : ajout, modification et suppression
- **Subscriptions** : notifications en temps réel

---

## 🛠 Technologies utilisées

| Technologie | Version | Rôle |
|-------------|---------|------|
| Node.js | 18+ | Environnement d'exécution |
| Apollo Server | 3.x | Serveur GraphQL |
| GraphQL | 16.x | Langage de requêtes |
| Mongoose | 9.x | ODM pour MongoDB |
| MongoDB | 6+ | Base de données NoSQL |
| csv-parser | 3.x | Import des fichiers CSV |
| dotenv | 16.x | Gestion des variables d'environnement |
| nodemon | 3.x | Rechargement automatique en développement |

---

## 🏗 Architecture du projet

```
travel-api/
│
├── index.js                  # Point d'entrée — connexion MongoDB + démarrage Apollo
│
├── schema/
│   └── typeDefs.js           # Définition du schéma GraphQL (types, queries, mutations, subscriptions)
│
├── resolvers/
│   └── index.js              # Logique de résolution des champs GraphQL
│
├── models/
│   ├── Place.js              # Modèle Mongoose — destinations
│   ├── User.js               # Modèle Mongoose — utilisateurs
│   ├── Rating.js             # Modèle Mongoose — notes
│   └── Review.js             # Modèle Mongoose — avis
│
├── scripts/
│   └── importData.js         # Script d'import CSV vers MongoDB
│
├── data/
│   ├── places.csv            # Données des destinations (100+ lieux)
│   ├── users.csv             # Données des utilisateurs
│   ├── ratings.csv           # Données des notes
│   └── reviews.csv           # Données des avis
│
├── .env                      # Variables d'environnement (non versionné)
├── .gitignore                # Fichiers ignorés par Git
├── package.json              # Dépendances et scripts npm
└── README.md                 # Documentation du projet
```

---

## ✅ Prérequis

Avant de commencer, assure-toi d'avoir installé :

- [Node.js](https://nodejs.org/) version 18 ou supérieure
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) ou accès à MongoDB Atlas
- [MongoDB Compass](https://www.mongodb.com/products/compass) (optionnel, interface graphique recommandée)
- npm (inclus avec Node.js)

Pour vérifier tes installations :

```bash
node --version     # doit afficher v18.x ou plus
npm --version      # doit afficher 9.x ou plus
mongod --version   # doit afficher 6.x ou plus
```

---

## 🚀 Installation

### 1. Cloner le dépôt

```bash
git clone https://github.com/ton-username/travel-api.git
cd travel-api
```

### 2. Installer les dépendances

```bash
npm install
```

Les packages suivants seront installés automatiquement :

```
apollo-server      → serveur GraphQL
graphql            → moteur GraphQL
mongoose           → interaction avec MongoDB
csv-parser         → lecture des fichiers CSV
dotenv             → variables d'environnement
nodemon            → rechargement auto (devDependency)
```

---

## ⚙️ Configuration

### 1. Créer le fichier `.env`

Crée un fichier `.env` à la racine du projet :

```env
# MongoDB local (avec MongoDB Compass)
MONGODB_URI=mongodb://localhost:27017/travel-db

# OU MongoDB Atlas (cloud)
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/travel-db

PORT=4000
```

### 2. Configurer MongoDB local avec MongoDB Compass

1. Ouvre **MongoDB Compass**
2. Connecte-toi à `mongodb://localhost:27017`
3. Crée une nouvelle base de données nommée `travel-db`
4. Ajoute une première collection nommée `places`

> Les autres collections (`users`, `ratings`, `reviews`) seront créées automatiquement lors de l'import des données.

### 3. Ajouter `.env` au `.gitignore`

Crée un fichier `.gitignore` à la racine :

```
node_modules/
.env
```

---

## 📥 Import des données

Les données source sont fournies sous forme de fichiers CSV dans le dossier `data/`. Le script d'import les lit et les insère automatiquement dans MongoDB.

### Lancer l'import (une seule fois)

```bash
node scripts/importData.js
```

**Résultat attendu dans le terminal :**

```
✓ 100 documents importés dans Place
✓ 50 documents importés dans User
✓ 500 documents importés dans Rating
✓ 300 documents importés dans Review
Import terminé !
```

> ⚠️ Ce script **supprime et recrée** toutes les données à chaque exécution. Ne le relance pas si tu as des données importantes ajoutées manuellement.

**Vérification dans MongoDB Compass :**
Après l'import, tu devrais voir les 4 collections dans la base `travel-db` avec leurs documents respectifs.

---

## ▶️ Lancement du serveur

### Mode développement (avec rechargement automatique)

```bash
npm run dev
```
probléme résolu: dans Apollo Server 3, PubSub n'est plus inclus dans apollo-server — il faut l'installer séparément.
Solution — installer le bon package:  npm install graphql-subscriptions


### Mode production

```bash
npm start
```

**Résultat attendu :**

```
Connecté à MongoDB
API GraphQL disponible sur http://localhost:4000/
```

Ouvre [http://localhost:4000](http://localhost:4000) dans ton navigateur pour accéder au **Apollo Sandbox** (interface interactive pour tester l'API).

---

## 📐 Schéma GraphQL

### Types principaux

```graphql
type Place {
  id: ID!
  place_id: String!
  name: String!
  country: String!
  region: String!
  tags: [String]
  latitude: Float
  longitude: Float
  average_cost: Float
  description: String
  popularity_score: Float
  reviews: [Review]     # relation vers les avis
  ratings: [Rating]     # relation vers les notes
}

type User {
  id: ID!
  user_id: String!
  age: Int
  gender: String
  country: String
  travel_style: [String]
  budget: String
  preferred_activities: [String]
}

type Rating {
  id: ID!
  user_id: String!
  place_id: String!
  rating: Float!
}

type Review {
  id: ID!
  user_id: String!
  place_id: String!
  review_text: String!
  timestamp: String
}
```

### Queries disponibles

| Query | Description | Paramètre |
|-------|-------------|-----------|
| `places` | Liste toutes les destinations | — |
| `place(place_id)` | Récupère une destination par ID | `place_id: String!` |
| `placesByCountry(country)` | Filtre les destinations par pays | `country: String!` |
| `users` | Liste tous les utilisateurs | — |
| `user(user_id)` | Récupère un utilisateur par ID | `user_id: String!` |
| `reviews(place_id)` | Avis d'une destination | `place_id: String!` |
| `ratings(place_id)` | Notes d'une destination | `place_id: String!` |

### Mutations disponibles

| Mutation | Description |
|----------|-------------|
| `addPlace(name, country, region, ...)` | Ajoute une nouvelle destination |
| `updatePlace(place_id, ...)` | Modifie une destination existante |
| `deletePlace(place_id)` | Supprime une destination |
| `addReview(user_id, place_id, review_text)` | Ajoute un avis |

### Subscriptions disponibles

| Subscription | Déclencheur |
|--------------|-------------|
| `placeAdded` | Lors de l'ajout d'une destination |
| `reviewAdded` | Lors de l'ajout d'un avis |
| `placeDeleted` | Lors de la suppression d'une destination |

---

## 💡 Exemples de requêtes

### Query — Lister toutes les destinations

```graphql
query {
  places {
    place_id
    name
    country
    region
    tags
    average_cost
    popularity_score
  }
}
```

### Query — Destination par ID avec ses avis

```graphql
query {
  place(place_id: "p0") {
    name
    country
    description
    reviews {
      user_id
      review_text
      timestamp
    }
    ratings {
      user_id
      rating
    }
  }
}
```

### Query — Destinations par pays

```graphql
query {
  placesByCountry(country: "france") {
    name
    average_cost
    tags
  }
}
```

### Mutation — Ajouter une destination

```graphql
mutation {
  addPlace(
    name: "Marrakech"
    country: "Morocco"
    region: "africa"
    description: "Ville impériale aux mille couleurs"
    average_cost: 60.0
  ) {
    place_id
    name
    country
  }
}
```

### Mutation — Modifier une destination

```graphql
mutation {
  updatePlace(
    place_id: "p0"
    description: "Description mise à jour"
    average_cost: 70.0
  ) {
    name
    description
    average_cost
  }
}
```

### Mutation — Supprimer une destination

```graphql
mutation {
  deletePlace(place_id: "p99")
}
```

### Mutation — Ajouter un avis

```graphql
mutation {
  addReview(
    user_id: "u0"
    place_id: "p1"
    review_text: "Destination magnifique, à faire absolument !"
  ) {
    user_id
    review_text
    timestamp
  }
}
```

### Subscription — Écouter les nouvelles destinations

> Ouvrir dans un premier onglet du Sandbox, puis exécuter une mutation `addPlace` dans un second onglet.

```graphql
subscription {
  placeAdded {
    place_id
    name
    country
  }
}
```

---

## 🗄 Structure des collections MongoDB

### Collection `places`

```json
{
  "place_id": "p0",
  "name": "agra",
  "country": "india",
  "region": "asia",
  "tags": ["Historical", "Culture"],
  "latitude": 27.1767,
  "longitude": 78.0081,
  "average_cost": 65.3,
  "description": "Home of the majestic Taj Mahal.",
  "popularity_score": 8.0
}
```

### Collection `users`

```json
{
  "user_id": "u0",
  "age": 34,
  "gender": "male",
  "country": "indonesia",
  "travel_style": ["Adventure", "Nature"],
  "budget": "medium",
  "preferred_activities": ["Hiking", "Beach"]
}
```

### Collection `ratings`

```json
{
  "user_id": "u0",
  "place_id": "p1",
  "rating": 4.0
}
```

### Collection `reviews`

```json
{
  "user_id": "u0",
  "place_id": "p1",
  "review_text": "Really enjoyed the vibrant street markets...",
  "timestamp": "2025-01-15T10:23:45.000Z"
}
```

---

## 📜 Scripts disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Lance le serveur en mode développement avec nodemon |
| `npm start` | Lance le serveur en mode production |
| `node scripts/importData.js` | Importe les données CSV vers MongoDB |

---

## 👤 Auteur

**Salima Khabou**
- Projet académique — API GraphQL (Phase 1)
- Stack : Node.js · Apollo Server · GraphQL · MongoDB · Mongoose
