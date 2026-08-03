const { getQuoteBySymbol } = require('../services/alphaVantageService');

const getStockQuote = async (req, res, next) => {
  try {
    const { symbol } = req.query;

    if (!symbol || typeof symbol !== 'string' || symbol.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Debes enviar un símbolo bursátil válido.',
      });
    }

    const result = await getQuoteBySymbol(symbol.trim().toUpperCase());

    if (!result.success) {
      return res.status(502).json(result);
    }

    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getStockQuote,
};
