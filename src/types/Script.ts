export type Script = {
  exchange: "NSE" | "BSE";
  instType: "EQ" | "FS" | "OS" | "OI" | "FI" | "IF" | "-";
  series: "EQ" | "A";
  optType: "-" | "XX" | "PE-PUT" | "CE-CALL";
  symbol: string;
  company: string;
  strikePrice: string;
  scripKey: string;
  exchangeId: string;
  tickSize: string;
  lotSize: string;
  coCode: string;
  trdSymbol: string;
  altExchangeId: string;
  altExchange: string;
  exseg: string; // "nse_cm","bse_cm","nse_fo"
  multipler: number;
  precision: number;
  numerator: number;
  denominator: number;
  quotationUnit: string;
  quotationPrice: number;
  instGroup: string;
  indexExpiryType: string;
  expiryDate: string;
  underlyingCompanyName: string;
  corpType: string;
  readableExpiryDate?: string;
  ltp?: string;
};
