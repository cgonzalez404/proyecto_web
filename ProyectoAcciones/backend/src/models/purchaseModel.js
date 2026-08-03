const { query, pool } = require('../database/postgres');

const savePurchaseTransaction = async ({
  userId,
  symbol,
  nombre,
  quantity,
  unitPrice,
  total,
}) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const companyResult = await client.query(
      `
        INSERT INTO empresas (simbolo, nombre, precio_actual)
        VALUES ($1, $2, $3)
        ON CONFLICT (simbolo)
        DO UPDATE SET
          nombre = EXCLUDED.nombre,
          precio_actual = EXCLUDED.precio_actual,
          updated_at = NOW()
        RETURNING id, simbolo, nombre, precio_actual
      `,
      [symbol, nombre, unitPrice]
    );

    const company = companyResult.rows[0];

    const purchaseResult = await client.query(
      `
        INSERT INTO compras (usuario_id, empresa_id, cantidad, precio_unitario, total)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, usuario_id, empresa_id, cantidad, precio_unitario, total, fecha_compra
      `,
      [userId, company.id, quantity, unitPrice, total]
    );

    const historyResult = await client.query(
      `
        INSERT INTO historial (usuario_id, empresa_id, tipo, cantidad, precio_unitario, total, descripcion)
        VALUES ($1, $2, 'compra', $3, $4, $5, $6)
        RETURNING id, tipo, cantidad, precio_unitario, total, fecha_operacion
      `,
      [userId, company.id, quantity, unitPrice, total, `Compra de ${quantity} acciones de ${symbol}`]
    );

    const balanceResult = await client.query(
      `
        UPDATE usuarios
        SET saldo = saldo - $1,
            updated_at = NOW()
        WHERE id = $2
        RETURNING id, saldo
      `,
      [total, userId]
    );

    await client.query('COMMIT');

    return {
      purchase: purchaseResult.rows[0],
      history: historyResult.rows[0],
      company,
      balance: balanceResult.rows[0],
    };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const getCompanyBySymbol = async (symbol) => {
  const result = await query(
    `SELECT id, simbolo, nombre, precio_actual FROM empresas WHERE simbolo = $1`,
    [symbol]
  );

  return result.rows[0];
};

module.exports = {
  savePurchaseTransaction,
  getCompanyBySymbol,
};
