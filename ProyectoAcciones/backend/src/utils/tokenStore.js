const revokedTokens = new Set();

const revokeToken = (token) => {
  revokedTokens.add(token);
};

const isTokenRevoked = (token) => revokedTokens.has(token);

module.exports = {
  revokeToken,
  isTokenRevoked,
};
