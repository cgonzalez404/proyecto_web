const axios = require('axios');
const { alphaVantageKey } = require('../config/env');

const BASE_URL = 'https://www.alphavantage.co/query';

const getQuoteBySymbol = async (symbol) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        function: 'GLOBAL_QUOTE',
        symbol,
        apikey: alphaVantageKey,
      },
      timeout: 8000,
    });

    const quote = response.data?.['Global Quote'];
    const note = response.data?.Note;

    if (note) {
      return {
        success: false,
        message: 'Alpha Vantage no está disponible con la clave actual. Intenta más tarde o verifica tu API key.',
      };
    }

    if (!quote || Object.keys(quote).length === 0) {
      return {
        success: false,
        message: 'No se encontró información para ese símbolo bursátil.',
      };
    }

    const price = Number(quote['05. price'] || 0);
    const open = Number(quote['02. open'] || 0);
    const high = Number(quote['03. high'] || 0);
    const low = Number(quote['04. low'] || 0);
    const volume = Number(quote['06. volume'] || 0);
    const date = quote['07. latest trading day'] || null;

    return {
      success: true,
      symbol: quote['01. symbol'] || symbol.toUpperCase(),
      priceCurrent: price,
      opening: open,
      highest: high,
      lowest: low,
      volume,
      date,
    };
  } catch (error) {
    return {
      success: false,
      message: 'No se pudo consultar Alpha Vantage en este momento. Inténtalo más tarde.',
    };
  }
};

module.exports = {
  getQuoteBySymbol,
};
