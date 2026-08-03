const bcrypt = require('bcryptjs');
const { createUser, findUserByEmail, findUserById } = require('../models/userModel');
const { signToken } = require('../utils/jwt');
const { revokeToken } = require('../utils/tokenStore');

const register = async (req, res, next) => {
  try {
    const { nombre, email, password } = req.body;

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'El correo ya está registrado',
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await createUser({ nombre, email, passwordHash });
    const token = signToken({ id: user.id, email: user.email, nombre: user.nombre });

    return res.status(201).json({
      success: true,
      message: 'Usuario registrado correctamente',
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        saldo: user.saldo,
      },
    });
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas',
      });
    }

    const token = signToken({ id: user.id, email: user.email, nombre: user.nombre });

    return res.json({
      success: true,
      message: 'Inicio de sesión correcto',
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        saldo: user.saldo,
      },
    });
  } catch (error) {
    return next(error);
  }
};

const logout = (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (token) {
    revokeToken(token);
  }

  res.json({
    success: true,
    message: 'Sesión cerrada correctamente',
  });
};

const me = async (req, res, next) => {
  try {
    const user = await findUserById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado',
      });
    }

    return res.json({
      success: true,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        saldo: user.saldo,
      },
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  register,
  login,
  logout,
  me,
};
