"use client";
import { IAccount } from "@/models/Account";
import React, { useEffect, useRef } from "react";
import Watchlist from "./Watchlist";
import { KotakNeo } from "@/lib/KotakNeo";
import { useToast } from "../ui/use-toast";
import { useDispatch, useSelector } from "react-redux";
import { initOrderlist, updateOrderltp } from "@/store/orderlistSlice";
import { initPositions, updatePositonltp } from "@/store/positionsSlice";
import { RootState } from "@/store";
import Orders from "./Orders";
import { OrderBook } from "@/types/orderbook";
import { updateScript } from "@/store/watchlistSlice";

const Terminal = ({ account }: { account: IAccount }) => {
  const neo = new KotakNeo(
    account.accessToken!,
    account.token!,
    account.sid!,
    account.hsServerId!
  );
  const { toast } = useToast();
  const dispatch = useDispatch();

  const orders = useSelector((store: RootState) => store.orderlist);
  const positons = useSelector((store: RootState) => store.positions);
  const {
    ceScript,
    peScript,
    ceScript2,
    peScript2,
    ceScript3,
    peScript3,
    ceScript4,
    peScript4,
    eqScript,
  } = useSelector((store: RootState) => store.watchlist);

  const ws = useRef<any>();

  async function getOrders() {
    let res = await neo.getOrderBook();
    if (res.stat !== "Ok") {
      toast({
        variant: "destructive",
        title: `Error : ${res.message}`,
        description: res.description,
      });
      return;
    }
    let orders: OrderBook[] = res.data;
    console.log(orders);
    const openOrders = orders.filter((o) => o.ordSt === "open");
    dispatch(initOrderlist(openOrders));
  }

  async function getPosition() {
    let res = await neo.getPosition();
    if (res.stat !== "Ok") {
      toast({
        variant: "destructive",
        title: `Error : ${res.message}`,
        description: res.description,
      });
      return;
    }
    dispatch(initPositions(res.data));
  }

  function wsOpen() {
    console.log("wsoptn");
    ws.current.send(
      JSON.stringify({
        Authorization: account.token!,
        Sid: account.sid!,
        type: "cn",
      })
    );
  }

  function wsMsg(msg: any) {
    let data = JSON.parse(msg);
    console.log(data);
    if (data[0].stat === "Ok" && data[0].type === "cn") {
      let tokens: string[] = [];
      if (ceScript) tokens.push(`${ceScript.exseg}|${ceScript.exchangeId}`);
      if (peScript) tokens.push(`${peScript.exseg}|${peScript.exchangeId}`);
      if (ceScript2) tokens.push(`${ceScript2.exseg}|${ceScript2.exchangeId}`);
      if (peScript2) tokens.push(`${peScript2.exseg}|${peScript2.exchangeId}`);
      if (ceScript3) tokens.push(`${ceScript3.exseg}|${ceScript3.exchangeId}`);
      if (peScript3) tokens.push(`${peScript3.exseg}|${peScript3.exchangeId}`);
      if (ceScript4) tokens.push(`${ceScript4.exseg}|${ceScript4.exchangeId}`);
      if (peScript4) tokens.push(`${peScript4.exseg}|${peScript4.exchangeId}`);
      if (eqScript) tokens.push(`${eqScript.exseg}|${eqScript.exchangeId}`);
      ws.current.send(
        JSON.stringify({
          type: "mws",
          scrips: tokens.join("&"),
          channelnum: "1",
        })
      );
    } else {
      data.forEach((element: any) => {
        if (element.ltp) {
          dispatch(updateScript({ exchangeId: element.tk, lp: element.ltp }));
          dispatch(updateOrderltp({ token: element.tk, lp: element.ltp }));
          dispatch(updatePositonltp({ token: element.tk, lp: element.lp }));
        }
      });
    }
  }

  function wsfun(exch: string, tk: string) {
    console.log(exch, tk);
    ws.current.send(
      JSON.stringify({
        type: "mws",
        scrips: `${exch}|${tk}`,
        channelnum: "1",
      })
    );
  }

  function connectWs() {
    let url = "wss://mlhsm.kotaksecurities.com";
    // const userWS = new HSWebSocket(url);
    // @ts-ignore
    ws.current = new HSWebSocket(url);
    ws.current.onclose = () => {
      console.log("ws close");
    };
    ws.current.onerror = () => {
      console.log("ws error");
    };

    ws.current.onmessage = wsMsg;

    ws.current.onopen = wsOpen;
  }

  useEffect(() => {
    // getOrders();
    // getPosition();

    connectWs();
    return () => {
      ws.current?.close();
    };
  }, []);

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Watchlist neo={neo} wsfun={wsfun} />
      <div className="border grow pt-2 md:pt-4 flex flex-col">
        <div className="h-24 overflow-y-scroll">
          <h2 className="text-sm text-green-600 px-2">Orders</h2>
          {orders.length === 0 ? (
            <p className="px-2">No Order to show</p>
          ) : (
            orders.map((order) => (
              <Orders key={order.nOrdNo} order={order} neo={neo} />
            ))
          )}
        </div>
        <div className="h-24">
          <h2 className="text-sm text-green-600 px-2">Positons</h2>
        </div>
      </div>
    </div>
  );
};

export default Terminal;
