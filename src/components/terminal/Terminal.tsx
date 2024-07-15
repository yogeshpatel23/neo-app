"use client";
import { IAccount } from "@/models/Account";
import React from "react";
import Watchlist from "./Watchlist";
import { KotakNeo } from "@/lib/KotakNeo";

const Terminal = ({ account }: { account: IAccount }) => {
  const neo = new KotakNeo(account.accessToken!, account.token!, account.sid!);

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Watchlist neo={neo} />
      <div>
        <div>orders</div>
        <div>positn</div>
      </div>
    </div>
  );
};

export default Terminal;
