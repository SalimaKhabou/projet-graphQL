const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

const client = jwksClient({
  jwksUri: 'http://localhost:8080/realms/travel-realm/protocol/openid-connect/certs'
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) return callback(err);
    callback(null, key.getPublicKey());
  });
}

async function verifyToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, getKey, {
      issuer: 'http://localhost:8080/realms/travel-realm',
      algorithms: ['RS256']
    }, (err, decoded) => {
      if (err) reject(err);
      else resolve(decoded);
    });
  });
}

async function authMiddleware(req) {
  const authHeader = req.headers.authorization || '';
  if (!authHeader.startsWith('Bearer ')) return { user: null };

  const token = authHeader.split(' ')[1];

  try {
    const user = await verifyToken(token);
    return { user };
  } catch {
    return { user: null };
  }
}

module.exports = { authMiddleware };