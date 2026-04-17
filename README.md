

# 🌍 Travel API — GraphQL avec Node.js, Apollo Server & MongoDB

Une API GraphQL complète autour du thème des voyages, permettant de consulter, ajouter, modifier et supprimer des destinations, utilisateurs, notes et avis en temps réel.

---

## 📋 Table des matières

1. Présentation du projet
2. Technologies utilisées
3. Architecture du projet
4. Prérequis
5. Installation
6. Configuration
7. Import des données
8. Lancement du serveur
9. Schéma GraphQL
10. Exemples de requêtes
11. Améliorations (Phase 2)
12. Interface React (client)
13. Documentation API
14. Structure MongoDB
15. Scripts disponibles
16. Auteur

---

## 📖 Présentation du projet

Ce projet est une API GraphQL développée dans le cadre d'un mini-projet académique. Elle expose des données liées aux voyages à travers quatre entités principales :

* **Places** : destinations touristiques
* **Users** : voyageurs
* **Ratings** : notes
* **Reviews** : avis

L'API implémente :

* **Queries**
* **Mutations**
* **Subscriptions**

---

## 🛠 Technologies utilisées

| Technologie   | Rôle               |
| ------------- | ------------------ |
| Node.js       | Backend            |
| Apollo Server | GraphQL Server     |
| GraphQL       | API Query Language |
| MongoDB       | Base de données    |
| Mongoose      | ODM                |
| React         | Frontend           |
| Apollo Client | Client GraphQL     |
| Keycloak      | Authentification   |
| JWT           | Sécurité           |

---

## 🏗 Architecture du projet

```
travel-api/
travel-client/
```

* `travel-api` → backend GraphQL
* `travel-client` → frontend React

---

## ⚙️ Prérequis

* Node.js 18+
* MongoDB
* Keycloak (optionnel mais utilisé)
* npm

---

## 🚀 Installation

### Backend

```bash
cd travel-api
npm install
```

### Frontend

```bash
cd travel-client
npm install
```

---

## 🔐 Configuration sécurité (Keycloak)

Token récupéré via :

```bash
POST http://localhost:8080/realms/travel-realm/protocol/openid-connect/token
```

Utilisé ensuite dans les headers :

```json
{
  "Authorization": "Bearer YOUR_TOKEN"
}
```

---

## 📥 Import des données

```bash
node scripts/importData.js
```

---

## ▶️ Lancement

### Backend

```bash
npm run dev
```

Serveur :

```
http://localhost:4000/graphql
```

### Frontend

```bash
npm start
```

React :

```
http://localhost:3000
```

---

# 🧠 Phase 2 — Amélioration & sécurisation

## ✅ Pagination des résultats

Exemple backend :

```graphql
type Query {
  places(limit: Int, offset: Int): [Place]
}
```

Utilisation :

```graphql
query {
  places(limit: 10, offset: 0) {
    name
  }
}
```

---

## 🔎 Filtrage des données

```graphql
type Query {
  placesByCountry(country: String): [Place]
  searchPlaces(keyword: String): [Place]
}
```

---

## ↕️ Tri des résultats

```graphql
type Query {
  places(sortBy: String, order: String): [Place]
}
```

Exemple :

```graphql
query {
  places(sortBy: "popularity_score", order: "DESC") {
    name
    popularity_score
  }
}
```

---

# ⚛️ Interface React (Client)

## 📦 Installation

```bash
cd travel-client
npx create-react-app travel-client
npm install @apollo/client graphql
```

---

## 🔗 Apollo Client (src/index.js)

```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import App from './App';

const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('kc_token');

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    }
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
```

---

## 🔐 Login Keycloak (React)

```javascript
const login = async () => {
  const res = await fetch('http://localhost:8080/realms/travel-realm/protocol/openid-connect/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'password',
      client_id: 'travel-api',
      client_secret: 'YOUR_SECRET',
      username: 'testuser',
      password: 'test123'
    })
  });

  const data = await res.json();
  localStorage.setItem('kc_token', data.access_token);
};
```

---

## 🖥 App React (extrait)

* Affichage des places
* Tri dynamique
* Grid UI

---

# 📄 Documentation API

## Installation

```bash
npm install -g @2fd/graphdoc
```

## Génération

👉 dans le dossier backend :

```bash
cd travel-api
graphdoc -e http://localhost:4000/graphql -o ./doc
```

## Résultat

```
travel-api/doc/index.html
```

---

# 📌 Améliorations ajoutées (Phase 2)

✔ Pagination
✔ Filtrage
✔ Tri dynamique
✔ Sécurisation JWT + Keycloak
✔ Interface React (Apollo Client)
✔ Documentation GraphQL
✔ Login Keycloak
✔ Gestion token automatique

---

## 🗄 Structure MongoDB

(identique à ta version initiale — inchangée)

---

## 📜 Scripts

```bash
npm run dev
npm start
node scripts/importData.js
```

---

## 👤 Auteur

**Salima Khabou**
Projet académique — GraphQL + React + Keycloak + MongoDB

