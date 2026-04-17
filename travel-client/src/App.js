import React, { useState } from 'react';
import { useQuery, gql } from '@apollo/client';

// 🔍 Query GraphQL
const GET_PLACES = gql`
  query GetPlaces($sortBy: PlaceSortField, $order: SortOrder) {
    places(sortBy: $sortBy, order: $order) {
      place_id
      name
      country
      region
      tags
      average_cost
      popularity_score
      description
    }
  }
`;

function App() {
  const [sortBy, setSortBy] = useState('popularity_score');
  const [order, setOrder] = useState('DESC');
  const [isLogged, setIsLogged] = useState(false);

  // 🔐 LOGIN KEYCLOAK
  const login = async () => {
    const res = await fetch('http://localhost:8080/realms/travel-realm/protocol/openid-connect/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'password',
        client_id: 'travel-api',
        client_secret: 'iEsP7pXZvIyvPxlsPDoJkIAOPQKwhMLS', // ⚠️ remplace par ton vrai secret
        username: 'testuser',
        password: 'test123'
      })
    });

    const data = await res.json();

    localStorage.setItem('kc_token', data.access_token);
    setIsLogged(true);
  };

  const { loading, error, data } = useQuery(GET_PLACES, {
    variables: { sortBy, order },
    skip: !isLogged // 🚨 ne lance pas la requête si pas connecté
  });

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>🌍 Travel App</h1>

      {/* 🔐 LOGIN BUTTON */}
      {!isLogged && (
        <button onClick={login} style={{
          padding: '10px 20px',
          background: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          marginBottom: '20px'
        }}>
          🔐 Login with Keycloak
        </button>
      )}

      {/* 🎯 CONTENU APRÈS LOGIN */}
      {isLogged && (
        <>
          {/* TRI */}
          <div style={{ marginBottom: '1rem' }}>
            <label>Trier par : </label>

            <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="popularity_score">Popularité</option>
              <option value="average_cost">Coût</option>
              <option value="name">Nom</option>
            </select>

            <select value={order} onChange={e => setOrder(e.target.value)} style={{ marginLeft: '1rem' }}>
              <option value="DESC">Décroissant</option>
              <option value="ASC">Croissant</option>
            </select>
          </div>

          {/* LOADING / ERROR */}
          {loading && <p>Chargement...</p>}
          {error && <p style={{ color: 'red' }}>Erreur : {error.message}</p>}

          {/* LISTE */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '1rem'
          }}>
            {data?.places.map(place => (
              <div key={place.place_id} style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '1rem',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <h3>{place.name}</h3>
                <p>🌐 {place.country} — {place.region}</p>
                <p>💰 {place.average_cost}$/jour</p>
                <p>⭐ {place.popularity_score}/10</p>
                <p style={{ fontSize: '0.85rem', color: '#666' }}>
                  {place.description}
                </p>

                <div>
                  {place.tags?.map(tag => (
                    <span key={tag} style={{
                      background: '#e0f0ff',
                      borderRadius: '4px',
                      padding: '2px 8px',
                      marginRight: '4px',
                      fontSize: '0.8rem'
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default App;