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
import { OrderShema } from "@/validation/order";

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

  const exQtyInpRef = useRef<HTMLInputElement>(null);

  const { toast } = useToast();

  let netQty = (
    parseInt(position.flBuyQty) - parseInt(position.flSellQty)
  ).toString();

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

    if (parseInt(netQty) > 0) {
      let diff = parseFloat(position.lp) - tslPrice.current;
      if (diff > tsl) {
        setSl((prev) => prev! + diff);
        tslPrice.current = parseFloat(position.lp);
      }
    }

    if (parseInt(netQty) < 0) {
      let diff = tslPrice.current - parseFloat(position.lp);
      if (diff > tsl) {
        setSl((prev) => prev! - diff);
        tslPrice.current = parseFloat(position.lp);
      }
    }
  }

  if (sl) {
    if (!position.lp) return;
    if (parseInt(netQty) > 0) {
      if (sl > parseFloat(position.lp)) {
        console.log("sl tiggerd");
        handleClosePosition(netQty);
      }
    }
    if (parseInt(netQty) < 0) {
      if (sl < parseFloat(position.lp)) {
        console.log("sl tiggerd");
        handleClosePosition(netQty);
      }
    }
  }

  if (tgt) {
    if (!position.lp) return;
    if (parseInt(netQty) > 0) {
      if (tgt < parseFloat(position.lp)) {
        console.log("Target Hit");
        handleClosePosition(netQty);
      }
    }
    if (parseInt(netQty) < 0) {
      if (tgt > parseFloat(position.lp)) {
        console.log("Target Hit");
        handleClosePosition(netQty);
      }
    }
  }

  async function handleClosePosition(qty: string) {
    setSl(null);
    setTsl(null);
    setTgt(null);
    tslPrice.current = null;
    let data = {
      exch: position.exSeg,
      tsym: position.trdSym,
      qty: Math.abs(parseInt(qty)).toString(),
      prd: position.prod,
      trantype: parseInt(netQty) < 0 ? "B" : "S",
      prctyp: "LMT",
      prc: (
        parseFloat(position.lp!) -
        Math.round((parseFloat(position.lp!) * 0.01) / 0.05) * 0.05
      ).toString(),
    };

    const validData = OrderShema.safeParse(data);
    if (!validData.success) {
      console.log(validData.error.flatten());
      return;
    }

    const res = await neo.placeOreder({ ...validData.data });
    if (res.stat === "Ok") {
      toast({
        title: "Position Closed",
        description: `Order no: ${res.nOrdNo}`,
      });
    } else {
      console.error(res);
      toast({
        variant: "destructive",
        title: "Error",
        description: res.errMsg,
      });
    }
  }

  async function newOrder() {
    if (!position.lp) return;
    const data: any = {
      es: position.exSeg,
      pc: "MIS",
      pt: prctyp,
      tt: "B",
      ts: position.trdSym,
      pr: (
        parseFloat(position.lp ?? "0") +
        Math.round((parseFloat(position.lp ?? "0") * 0.01) / 0.05) * 0.05
      ).toString(),
      qt: qtyInpRef.current?.value,
    };

    if (prctyp === "L") {
      if (!prcInpRef.current) return;
      data.pr = prcInpRef.current.value;
    }

    if (prctyp === "SL") {
      if (!prcInpRef.current) return;
      if (parseFloat(prcInpRef.current.value) < parseFloat(position.lp)) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Triger price greater then LTP",
        });
        return;
      }
      data.tp = prcInpRef.current.value;
      data.pr = (
        parseFloat(prcInpRef.current.value) +
        Math.round((parseFloat(prcInpRef.current.value) * 0.01) / 0.05) * 0.05
      ).toString();
    }
    const validData = OrderShema.safeParse(data);
    if (!validData.success) {
      // console.log(validData.error.flatten());
      toast({
        variant: "destructive",
        title: "Error",
        description: "Some field are missing",
      });
      return;
    }

    const res = await neo.placeOreder({ ...validData.data });
    if (res.stat === "Ok") {
      toast({
        title: "Order placed",
        description: `Order no: ${res.nOrdNo}`,
      });
    } else {
      console.error(res);
      toast({
        variant: "destructive",
        title: "Error",
        description: res.errMsg,
      });
    }
  }

  return parseInt(netQty) !== 0 ? (
    <div className="flex justify-between items-center text-xs md:text-sm border-y px-2 gap-4 mt-1 p-1">
      <div className="w-full flex flex-col lg:flex-row justify-between items-center">
        <div className="w-full flex text-xs justify-start gap-2">
          <span>{position.trdSym}</span>
          <span>
            Qty:{netQty} | AP: 0 | LP:
            {position.lp}
          </span>
        </div>
        <div className="w-full flex justify-between lg:justify-end gap-4">
          <div className="relative text-xs pt-4">
            <Input
              className="w-16 h-6 text-xs"
              type="number"
              ref={exQtyInpRef}
              max={netQty}
              min={position.lotSz}
              step={position.lotSz}
              defaultValue={position.flBuyQty}
            />
            <span className="absolute top-0 left-0">Qty</span>
          </div>
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
            <div className="relative text-xs pt-4">
              <span onClick={() => setEditSl(true)} className="cursor-pointer">
                {sl}
              </span>
              <span className="absolute top-0 left-0 text-red-600">SL</span>
            </div>
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
          {(
            parseInt(netQty) * parseFloat(position.lp ?? "0") +
            parseFloat(position.sellAmt) -
            parseFloat(position.buyAmt)
          ).toFixed(2)}
        </div>
        <Button
          onClick={() => {
            let qty = exQtyInpRef.current?.value
              ? exQtyInpRef.current?.value
              : netQty;
            handleClosePosition(qty);
          }}
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
        <span className="w-20 lg:w-60 overflow-hidden grow">
          {position.trdSym}
        </span>
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
              <SelectItem value="SL">SL</SelectItem>
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
