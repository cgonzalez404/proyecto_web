const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateRegister = (req, res, next) => {
  const { nombre, email, password } = req.body;

  if (!nombre || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Nombre, email y password son obligatorios',
    });
  }

  if (typeof nombre !== 'string' || nombre.trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: 'El nombre debe tener al menos 2 caracteres',
    });
  }

  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Formato de email inválido',
    });
  }

  if (typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'La password debe tener al menos 6 caracteres',
    });
  }

  return next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email y password son obligatorios',
    });
  }

  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Formato de email inválido',
    });
  }

  if (typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'La password debe tener al menos 6 caracteres',
    });
  }

  return next();
};

module.exports = {
  validateRegister,
  validateLogin,
};
