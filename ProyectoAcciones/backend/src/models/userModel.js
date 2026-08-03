const { query } = require('../database/postgres');

const createUser = async ({ nombre, email, passwordHash }) => {
  const result = await query(
    `
      INSERT INTO usuarios (nombre, email, password_hash, saldo)
      VALUES ($1, $2, $3, 0)
      RETURNING id, nombre, email, saldo, created_at
    `,
    [nombre, email, passwordHash]
  );

  return result.rows[0];
};

const findUserByEmail = async (email) => {
  const result = await query(
    `SELECT id, nombre, email, password_hash, saldo FROM usuarios WHERE email = $1`,
    [email]
  );

  return result.rows[0];
};

const findUserById = async (id) => {
  const result = await query(
    `SELECT id, nombre, email, saldo FROM usuarios WHERE id = $1`,
    [id]
  );

  return result.rows[0];
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
};
