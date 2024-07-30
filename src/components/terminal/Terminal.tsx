"use client";
import { IAccount } from "@/models/Account";
import React, { useEffect, useRef } from "react";
import Watchlist from "./Watchlist";
import { KotakNeo } from "@/lib/KotakNeo";
import { useToast } from "../ui/use-toast";
import { useDispatch, useSelector } from "react-redux";
import {
  initOrderlist,
  removeOrdrer,
  updateOrderltp,
} from "@/store/orderlistSlice";
import { initPositions, updatePositonltp } from "@/store/positionsSlice";
import { RootState } from "@/store";
import Orders from "./Orders";
import { OrderBook } from "@/types/orderbook";
import { updateScript } from "@/store/watchlistSlice";
import Position from "./Position";
import { PositionBook } from "@/types/positionbook";
import Link from "next/link";
import { ArrowPathIcon, HomeIcon } from "@heroicons/react/24/outline";

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

  let invt: NodeJS.Timeout;

  const ws = useRef<any>();
  const orws = useRef<any>();

  async function getOrders(): Promise<OrderBook[]> {
    let res = await neo.getOrderBook();
    if (res.stat !== "Ok") {
      toast({
        variant: res.errMsg === "No Data" ? "default" : "destructive",
        title: res.errMsg === "No Data" ? "Order Info" : "Error",
        description: res.errMsg,
      });
      return [];
    }
    let orders: OrderBook[] = res.data;
    const openOrders = orders.filter(
      (o) => o.ordSt === "open" || o.ordSt === "trigger pending"
    );

    dispatch(initOrderlist(openOrders));
    return openOrders;
  }

  async function getPosition(): Promise<PositionBook[]> {
    let res = await neo.getPosition();
    if (res.stat !== "Ok") {
      toast({
        variant: res.errMsg === "No Data" ? "default" : "destructive",
        title: res.errMsg === "No Data" ? "Position Info" : "Error",
        description: res.errMsg,
      });
      return [];
    }

    dispatch(initPositions(res.data));
    return res.data;
  }

  function wsOpen() {
    console.info("wsoptn");
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

      Promise.allSettled([getOrders(), getPosition()]).then((responses) => {
        if (responses[0].status === "fulfilled") {
          if (responses[0].value) {
            responses[0].value.forEach((o) => {
              tokens.push(`${o.exSeg}|${o.tok}`);
            });
          }
        }

        if (responses[1].status === "fulfilled") {
          if (responses[1].value) {
            responses[1].value.forEach((p) => {
              tokens.push(`${p.exSeg}|${p.tok}`);
            });
          }
        }

        ws.current.send(
          JSON.stringify({
            type: "mws",
            scrips: tokens.join("&"),
            channelnum: "1",
          })
        );
      });
    } else {
      data.forEach((element: any) => {
        if (element.ltp) {
          dispatch(updateScript({ exchangeId: element.tk, lp: element.ltp }));
          dispatch(updateOrderltp({ token: element.tk, lp: element.ltp }));
          dispatch(updatePositonltp({ token: element.tk, lp: element.ltp }));
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

  function orwsMsg(msg: any) {
    let data = JSON.parse(msg);
    switch (data.type) {
      case "cn":
        if (data.ak !== "ok") {
          toast({
            title: "WS Error",
            description: data.msg,
          });
        }
        break;
      case "order":
        switch (data.data.ordSt) {
          case "open":
          case "trigger pending":
            getOrders();
            break;
          case "complete":
            getPosition();
            dispatch(removeOrdrer(data.data.nOrdNo));
            break;
          case "cancelled":
            dispatch(removeOrdrer(data.data.nOrdNo));
            break;
          case "put order req received":
          case "validation pending":
          case "open pending":
          case "modify validation pending":
          case "modify pending":
          case "modified":
          case "cancel pending":
            // console.error(data.data.ordSt);
            break;

          default:
            console.error(data.data);
            break;
        }
        break;
      case "position":
        toast({
          title: "Order Placed",
          description: `Order for ${data.data.trdSym} is placed.`,
        });
        break;
      default:
        console.error(data);
        break;
    }
  }

  function connectWs() {
    let url = "wss://mlhsm.kotaksecurities.com";
    // const userWS = new HSWebSocket(url);
    // @ts-ignore
    ws.current = new HSWebSocket(url);
    ws.current.onclose = () => {
      console.info("ws close");
    };
    ws.current.onerror = () => {
      console.info("ws error");
    };

    ws.current.onmessage = wsMsg;

    ws.current.onopen = wsOpen;

    // Order websocket
    // @ts-ignore
    orws.current = new HSIWebSocket(
      `wss://clhsi.kotaksecurities.com/realtime?sId=${account.hsServerId}`
    );

    orws.current.onclose = () => {
      console.warn("order ws close");
    };
    orws.current.onerror = () => {
      console.warn("order ws error");
    };
    orws.current.onopen = () => {
      orws.current.send(
        JSON.stringify({
          type: "cn",
          Authorization: account.token!,
          Sid: account.sid!,
          source: "API",
        })
      );
    };

    orws.current.onmessage = orwsMsg;
  }

  useEffect(() => {
    connectWs();
    invt = setInterval(() => {
      orws.current.send(
        JSON.stringify({
          type: "fcn",
        })
      );
    }, 60000);
    return () => {
      ws.current?.close();
      orws.current?.close();
      if (invt) clearInterval(invt);
    };
  }, []);

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <div className="fixed flex gap-2 top-2 right-2 p-1 z-10">
        <Link href="/dashboard">
          <HomeIcon className="size-7 cursor-pointer rounded-full border border-white/50 p-1 hover:animate-pulse" />
        </Link>
        <ArrowPathIcon
          onClick={connectWs}
          className="size-7 cursor-pointer rounded-full border border-white/50 p-1 hover:animate-spin"
        />
      </div>
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
          {positons.length === 0 ? (
            <p className="px-2">No Positions</p>
          ) : (
            positons.map((pos) => (
              <Position key={pos.trdSym} neo={neo} position={pos} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Terminal;
