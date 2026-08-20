export const CURRENCY_SYMBOLS = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  INR: '₹',
  JPY: '¥',
  AUD: 'A$',
  CAD: 'C$',
  CHF: 'CHF',
  CNY: '¥',
  HKD: 'HK$',
  NZD: 'NZ$',
  SEK: 'kr',
  KRW: '₩',
  SGD: 'S$',
  NOK: 'kr',
  MXN: 'Mex$',
  ZAR: 'R',
  TRY: '₺',
  BRL: 'R$',
  AED: 'AED',
};

export const EXCHANGE_RATES = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.78,
  INR: 83.5,
  JPY: 155.0,
  AUD: 1.52,
  CAD: 1.36,
  CHF: 0.90,
  CNY: 7.23,
  HKD: 7.82,
  NZD: 1.64,
  SEK: 10.65,
  KRW: 1370.0,
  SGD: 1.35,
  NOK: 10.75,
  MXN: 17.10,
  ZAR: 18.50,
  TRY: 32.50,
  BRL: 5.20,
  AED: 3.67,
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
  'Switzerland': 'CHF',
  'China': 'CNY',
  'Hong Kong': 'HKD',
  'New Zealand': 'NZD',
  'Sweden': 'SEK',
  'South Korea': 'KRW',
  'Singapore': 'SGD',
  'Norway': 'NOK',
  'Mexico': 'MXN',
  'South Africa': 'ZAR',
  'Turkey': 'TRY',
  'Brazil': 'BRL',
  'United Arab Emirates': 'AED',
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
