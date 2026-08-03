const { verifyToken } = require('../utils/jwt');
const { isTokenRevoked } = require('../utils/tokenStore');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Token no proporcionado',
    });
  }

  const token = authHeader.split(' ')[1];

  if (isTokenRevoked(token)) {
    return res.status(401).json({
      success: false,
      message: 'Token revocado',
    });
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token inválido o expirado',
    });
  }
};

module.exports = {
  authenticateToken,
};
