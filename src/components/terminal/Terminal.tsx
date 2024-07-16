"use client";
import { IAccount } from "@/models/Account";
import React, { useEffect } from "react";
import Watchlist from "./Watchlist";
import { KotakNeo } from "@/lib/KotakNeo";
import { useToast } from "../ui/use-toast";
import { useDispatch, useSelector } from "react-redux";
import { initOrderlist } from "@/store/orderlistSlice";
import { initPositions } from "@/store/positionsSlice";
import { RootState } from "@/store";
import Orders from "./Orders";
import { OrderBook } from "@/types/orderbook";

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

  useEffect(() => {
    getOrders();
    getPosition();

    return () => {};
  }, []);

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Watchlist neo={neo} />
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
