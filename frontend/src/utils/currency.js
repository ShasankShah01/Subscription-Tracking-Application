export const CURRENCY_SYMBOLS = {
  USD: '$',
  INR: '₹',
  EUR: '€',
  GBP: '£',
  CAD: 'C$',
  AUD: 'A$',
  JPY: '¥',
};

export const EXCHANGE_RATES = {
  USD: 1.0,
  INR: 83.5,
  EUR: 0.92,
  GBP: 0.78,
  CAD: 1.36,
  AUD: 1.52,
  JPY: 155.0,
};

export const COUNTRY_CURRENCY_MAP = {
  'India': 'INR',
  'United States': 'USD',
  'United Kingdom': 'GBP',
  'Canada': 'CAD',
  'Australia': 'AUD',
  'Germany': 'EUR',
  'France': 'EUR',
  'Japan': 'JPY',
};

export const getCurrencyByCountry = (country) => {
  return COUNTRY_CURRENCY_MAP[country] || 'USD';
};

export const convertCurrency = (amount, fromCurr = 'USD', toCurr = 'USD') => {
  const num = parseFloat(amount) || 0;
  const fromRate = EXCHANGE_RATES[fromCurr] || 1.0;
  const toRate = EXCHANGE_RATES[toCurr] || 1.0;
  
  // Convert to base USD then to target currency
  const inUSD = num / fromRate;
  const converted = inUSD * toRate;
  
  return converted;
};

export const formatPrice = (amount, currency = 'USD') => {
  const symbol = CURRENCY_SYMBOLS[currency] || '$';
  const num = parseFloat(amount) || 0;
  return `${symbol}${num.toFixed(2)}`;
};
