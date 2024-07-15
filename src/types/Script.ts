export type Script = {
  exchange: string; // "NSE",
  instType: string; // "OI",
  series: string; // "-",
  optType: string; // "CE-CALL",
  symbol: string; // "FINNIFTY",
  strikePrice: string; // "24500.00",
  exchangeId: string; // "48213",
  tickSize: string; // "0.05",
  lotSize: string; // "40",
  trdSymbol: string; // "FINNIFTY2471624500CE",
  exseg: string; // "nse_fo",
  multipler: string; // 1,
  precision: string; // 2,
  numerator: string; // 1,
  denominator: string; // 1,
  instGroup: string; // "OPT",
  indexExpiryType: string; // "Weekly",
  readableExpiryDate?: string; // "16-JUL-2024"
  ltp?: string;
};
