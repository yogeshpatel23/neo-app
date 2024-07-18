"use client";
import { RootState } from "@/store";
import { PositionBook } from "@/types/positionbook";
import React, { useRef, useState } from "react";
import { useToast } from "../ui/use-toast";
import { KotakNeo } from "@/lib/KotakNeo";
import { Button } from "../ui/button";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";

const Position = ({
  position,
  neo,
}: {
  position: PositionBook;
  neo: KotakNeo;
}) => {
  const [editSl, setEditSl] = useState(false);
  const [sl, setSl] = useState<number | null>(null);
  const slInpRef = useRef<HTMLInputElement>(null);

  const [editTgt, setEditTgt] = useState(false);
  const [tgt, setTgt] = useState<number | null>(null);
  const tgtInpRef = useRef<HTMLInputElement>(null);

  const [editTsl, setEditTsl] = useState(false);
  const [tsl, setTsl] = useState<number | null>(null);
  const tslInpRef = useRef<HTMLInputElement>(null);
  const tslPrice = useRef<number | null>(null);

  const [showNewOrder, setShowNewOrder] = useState(false);
  const [prctyp, setPrctyp] = useState("L");
  const qtyInpRef = useRef<HTMLInputElement>(null);
  const prcInpRef = useRef<HTMLInputElement>(null);

  const { toast } = useToast();

  function handleSetSl() {
    if (!slInpRef.current) {
      setEditSl(false);
      setSl(null);
      return;
    }
    setSl(parseFloat(slInpRef.current.value));
    setEditSl(false);
  }

  function handleSetTsl() {
    if (!sl) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Set SL first",
      });
      return;
    }
    if (!tslInpRef.current) {
      setEditTsl(false);
      setTsl(null);
      tslPrice.current = null;
      return;
    }

    setTsl(parseFloat(tslInpRef.current.value));
    tslPrice.current = parseFloat(position.lp ?? "0");
    setEditTsl(false);
  }

  function handleSetTgt() {
    if (!tgtInpRef.current) {
      setEditTgt(false);
      setTgt(null);
      return;
    }
    setTgt(parseFloat(tgtInpRef.current.value));
    setEditTgt(false);
  }

  if (tsl) {
    if (!tslPrice.current) return;
    if (!sl) return;
    if (!position.lp) return;

    if (parseInt(position.flBuyQty) - parseInt(position.flSellQty) > 0) {
      let diff = parseFloat(position.lp) - tslPrice.current;
      if (diff > tsl) {
        setSl((prev) => prev! + diff);
        tslPrice.current = parseFloat(position.lp);
      }
    }

    if (parseInt(position.flBuyQty) - parseInt(position.flSellQty) < 0) {
      let diff = tslPrice.current - parseFloat(position.lp);
      if (diff > tsl) {
        setSl((prev) => prev! - diff);
        tslPrice.current = parseFloat(position.lp);
      }
    }
  }

  if (sl) {
    if (!position.lp) return;
    if (parseInt(position.flBuyQty) - parseInt(position.flSellQty) > 0) {
      if (sl > parseFloat(position.lp)) {
        console.log("sl tiggerd");
        handleClosePosition();
      }
    }
    if (parseInt(position.flBuyQty) - parseInt(position.flSellQty) < 0) {
      if (sl < parseFloat(position.lp)) {
        console.log("sl tiggerd");
        handleClosePosition();
      }
    }
  }

  if (tgt) {
    if (!position.lp) return;
    if (parseInt(position.flBuyQty) - parseInt(position.flSellQty) > 0) {
      if (tgt < parseFloat(position.lp)) {
        console.log("Target Hit");
        handleClosePosition();
      }
    }
    if (parseInt(position.flBuyQty) - parseInt(position.flSellQty) < 0) {
      if (tgt > parseFloat(position.lp)) {
        console.log("Target Hit");
        handleClosePosition();
      }
    }
  }

  async function handleClosePosition() {
    console.log("Positon close");
  }

  async function newOrder() {
    console.log("PLACE NEW ORDER");
  }

  return parseInt(position.flBuyQty) - parseInt(position.flSellQty) !== 0 ? (
    <div className="flex justify-between items-center text-xs md:text-sm border-y px-2 gap-4 mt-1 p-1">
      <div className="w-full flex flex-col lg:flex-row justify-between items-center">
        <div className="w-full flex text-xs justify-start gap-2">
          <span>{position.trdSym}</span>
          <span>
            Qty:{parseInt(position.flBuyQty) - parseInt(position.flSellQty)} |
            AP: 0 | LP:
            {position.lp}
          </span>
        </div>
        <div className="w-full flex justify-between lg:justify-end gap-4">
          <div>Exit Qty</div>
          {/* SL input */}
          {editSl ? (
            <div className="flex items-center">
              <XMarkIcon
                onClick={() => setEditSl(false)}
                className="size-4 cursor-pointer"
              />
              <Input
                ref={slInpRef}
                defaultValue={sl ?? ""}
                className="w-20 h-6 text-xs"
              />
              <CheckIcon
                onClick={handleSetSl}
                className="size-4 cursor-pointer"
              />
            </div>
          ) : sl ? (
            <span onClick={() => setEditSl(true)} className="cursor-pointer">
              {sl}
            </span>
          ) : (
            <span onClick={() => setEditSl(true)} className="cursor-pointer">
              Set SL
            </span>
          )}
          {/* TSL Input */}
          {editTsl ? (
            <div className="flex items-center">
              <XMarkIcon
                onClick={() => setEditTsl(false)}
                className="size-4 cursor-pointer"
              />
              <Input
                ref={tslInpRef}
                defaultValue={tsl ?? ""}
                className="w-12 h-6 text-xs"
              />
              <CheckIcon
                onClick={handleSetTsl}
                className="size-4 cursor-pointer"
              />
            </div>
          ) : tsl ? (
            <span onClick={() => setEditTsl(true)} className="cursor-pointer">
              {tsl}
            </span>
          ) : (
            <span onClick={() => setEditTsl(true)} className="cursor-pointer">
              Set TSL
            </span>
          )}
          {/* TGT Input */}
          {editTgt ? (
            <div className="flex items-center">
              <XMarkIcon
                onClick={() => setEditTgt(false)}
                className="size-4 cursor-pointer"
              />
              <Input
                ref={tgtInpRef}
                defaultValue={tgt ?? ""}
                className="w-20 h-6 text-xs"
              />
              <CheckIcon
                onClick={handleSetTgt}
                className="size-4 cursor-pointer"
              />
            </div>
          ) : tgt ? (
            <span onClick={() => setEditTgt(true)} className="cursor-pointer">
              {tgt}
            </span>
          ) : (
            <span onClick={() => setEditTgt(true)} className="cursor-pointer">
              Set TGT
            </span>
          )}
        </div>
      </div>
      <div>
        <div className="text-xs">
          {/* {(
            (parseInt(position.flBuyQty) - parseInt(position.flSellQty)) *
              (parseFloat(position.lp?? "0") - parseFloat(position.netavgprc)) *
              parseFloat(position.prcftr) +
            parseFloat(position.rpnl)
          ).toFixed(2)} */}
          npl cl
        </div>
        <Button
          onClick={handleClosePosition}
          variant="outline"
          size="sm"
          className="h-6 p-2"
        >
          <XMarkIcon className="size-4" />
        </Button>
      </div>
    </div>
  ) : showNewOrder ? (
    <div className="flex justify-between items-center text-xs md:text-sm border-y px-2 gap-4 mt-1 p-1">
      <div className="w-full flex flex-row items-center gap-2">
        <span className="w-20 lg:w-60 overflow-hidden">{position.trdSym}</span>
        <div className="flex items-center gap-2 md:gap-4">
          <Input
            ref={qtyInpRef}
            placeholder="qty"
            type="number"
            defaultValue={position.lotSz}
            min={position.lotSz}
            step={position.lotSz}
            className="h-6 w-16 text-xs"
          />
          <Select value={prctyp} onValueChange={(val) => setPrctyp(val)}>
            <SelectTrigger className="w-20 h-6 text-xs">
              <SelectValue placeholder="Order Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="L">LMT</SelectItem>
              <SelectItem value="MKT">MARKET</SelectItem>
              <SelectItem value="SL">MARKET</SelectItem>
            </SelectContent>
          </Select>
          <Input
            ref={prcInpRef}
            placeholder={position.lp}
            type="number"
            className="h-6 w-20 text-xs"
          />
        </div>
      </div>
      <div className="flex">
        <Button
          onClick={newOrder}
          variant="outline"
          size="sm"
          className="h-6 p-2"
        >
          Buy
        </Button>
        <Button
          onClick={() => setShowNewOrder(false)}
          variant="outline"
          size="sm"
          className="h-6 p-2"
        >
          <XMarkIcon className="size-4 text-red-500" />
        </Button>
      </div>
    </div>
  ) : (
    <div className="flex justify-between items-center text-xs md:text-sm border-y px-2 gap-4 mt-1 p-1">
      <div className="w-full flex item-center gap-2">
        <div className="w-40 lg:w-60 overflow-hidden">{position.trdSym}</div>
        <div className="flex w-40">
          <span className="w-16">{position.lp ?? 0}</span>
          <span className="w-16 text-right">
            {parseInt(position.sellAmt) - parseInt(position.buyAmt)}
          </span>
        </div>
      </div>
      <div>
        <Button
          onClick={() => setShowNewOrder(true)}
          variant="outline"
          size="sm"
          className="h-6 p-2"
        >
          Buy
        </Button>
      </div>
    </div>
  );
};

export default Position;
