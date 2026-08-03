const { getQuoteBySymbol } = require('../services/alphaVantageService');
const { savePurchaseTransaction, getCompanyBySymbol } = require('../models/purchaseModel');
const { query } = require('../database/postgres');

const purchaseStock = async (req, res, next) => {
  try {
    const { symbol, quantity } = req.body;
    const userId = req.user.id;

    if (!symbol || !quantity || Number(quantity) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Debes enviar un símbolo y una cantidad válida.',
      });
    }

    const quote = await getQuoteBySymbol(symbol);
    if (!quote.success) {
      return res.status(502).json({
        success: false,
        message: quote.message,
      });
    }

    const total = Number(quote.priceCurrent) * Number(quantity);

    const userBalanceResult = await query(
      `SELECT saldo FROM usuarios WHERE id = $1`,
      [userId]
    );

    const userBalance = Number(userBalanceResult.rows[0]?.saldo || 0);
    if (userBalance < total) {
      return res.status(400).json({
        success: false,
        message: 'Saldo insuficiente para completar la compra.',
      });
    }

    const existingCompany = await getCompanyBySymbol(symbol.toUpperCase());
    const purchase = await savePurchaseTransaction({
      userId,
      symbol: symbol.toUpperCase(),
      nombre: existingCompany?.nombre || symbol.toUpperCase(),
      quantity: Number(quantity),
      unitPrice: Number(quote.priceCurrent),
      total,
    });

    return res.status(201).json({
      success: true,
      message: 'Compra registrada correctamente',
      data: purchase,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  purchaseStock,
};
