import { OrderBook } from "./orderbook";

export interface Success {
  tid: string;
  stat: string;
  stCode: number;
  data: OrderBook[];
}

export interface Error {
  stat: string;
  errMsg: string;
  stCode: number;
  tid: string;
}
