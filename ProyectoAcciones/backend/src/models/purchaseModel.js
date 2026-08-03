const { query, pool } = require('../database/postgres');

const getUserStockPosition = async ({ userId, symbol }) => {
  const result = await query(
    `
      SELECT
        COALESCE((
          SELECT SUM(compras.cantidad)
          FROM compras
          INNER JOIN empresas ON empresas.id = compras.empresa_id
          WHERE compras.usuario_id = $1
            AND empresas.simbolo = $2
        ), 0) AS total_compradas,
        COALESCE((
          SELECT SUM(ventas.cantidad)
          FROM ventas
          INNER JOIN empresas ON empresas.id = ventas.empresa_id
          WHERE ventas.usuario_id = $1
            AND empresas.simbolo = $2
        ), 0) AS total_vendidas,
        COALESCE((
          SELECT SUM(compras.cantidad * compras.precio_unitario)
          / NULLIF(SUM(compras.cantidad), 0)
          FROM compras
          INNER JOIN empresas ON empresas.id = compras.empresa_id
          WHERE compras.usuario_id = $1
            AND empresas.simbolo = $2
        ), 0) AS precio_promedio_compra
    `,
    [userId, symbol]
  );

  const row = result.rows[0] || {};
  const totalCompradas = Number(row.total_compradas || 0);
  const totalVendidas = Number(row.total_vendidas || 0);
  const precioPromedioCompra = Number(row.precio_promedio_compra || 0);

  return {
    totalCompradas,
    totalVendidas,
    availableQuantity: totalCompradas - totalVendidas,
    averageCost: precioPromedioCompra,
  };
};

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

const saveSaleTransaction = async ({
  userId,
  symbol,
  nombre,
  quantity,
  unitPrice,
  total,
  averageCost,
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

    const positionResult = await client.query(
      `
        SELECT
          COALESCE((
            SELECT SUM(compras.cantidad)
            FROM compras
            INNER JOIN empresas ON empresas.id = compras.empresa_id
            WHERE compras.usuario_id = $1
              AND empresas.simbolo = $2
          ), 0) AS total_compradas,
          COALESCE((
            SELECT SUM(ventas.cantidad)
            FROM ventas
            INNER JOIN empresas ON empresas.id = ventas.empresa_id
            WHERE ventas.usuario_id = $1
              AND empresas.simbolo = $2
          ), 0) AS total_vendidas
      `,
      [userId, symbol]
    );

    const ownedQuantity = Number(positionResult.rows[0]?.total_compradas || 0);
    const soldQuantity = Number(positionResult.rows[0]?.total_vendidas || 0);
    const availableQuantity = ownedQuantity - soldQuantity;

    if (availableQuantity < quantity) {
      throw new Error('No puedes vender más acciones de las disponibles en tu portafolio.');
    }

    const saleResult = await client.query(
      `
        INSERT INTO ventas (usuario_id, empresa_id, cantidad, precio_unitario, total)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, usuario_id, empresa_id, cantidad, precio_unitario, total, fecha_venta
      `,
      [userId, company.id, quantity, unitPrice, total]
    );

    const historyResult = await client.query(
      `
        INSERT INTO historial (usuario_id, empresa_id, tipo, cantidad, precio_unitario, total, descripcion)
        VALUES ($1, $2, 'venta', $3, $4, $5, $6)
        RETURNING id, tipo, cantidad, precio_unitario, total, fecha_operacion
      `,
      [userId, company.id, quantity, unitPrice, total, `Venta de ${quantity} acciones de ${symbol}`]
    );

    const balanceResult = await client.query(
      `
        UPDATE usuarios
        SET saldo = saldo + $1,
            updated_at = NOW()
        WHERE id = $2
        RETURNING id, saldo
      `,
      [total, userId]
    );

    const profitLoss = total - (averageCost * quantity);

    await client.query('COMMIT');

    return {
      sale: saleResult.rows[0],
      history: historyResult.rows[0],
      company,
      balance: balanceResult.rows[0],
      profitLoss,
      availableQuantity,
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
  getUserStockPosition,
  savePurchaseTransaction,
  saveSaleTransaction,
  getCompanyBySymbol,
};
