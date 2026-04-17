const { AuthenticationError } = require('apollo-server-express');

function requireAuth(context) {
  if (!context.user) {
    throw new AuthenticationError('Authentification requise');
  }
}

module.exports = { requireAuth };