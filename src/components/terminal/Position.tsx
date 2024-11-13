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
    if (!position.lp) return;
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
    tslPrice.current = parseFloat(position.lp);
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
        console.log("sl buy tiggerd");
        handleClosePosition(netQty);
      }
    }
    if (parseInt(netQty) < 0) {
      if (sl < parseFloat(position.lp)) {
        console.log("sl sell tiggerd");
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
        console.log("Target Hit of sell");
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
      es: position.exSeg,
      ts: position.trdSym,
      qt: Math.abs(parseInt(qty)).toString(),
      pc: position.prod,
      tt: parseInt(netQty) < 0 ? "B" : "S",
      pt: "MKT",
      pr: position.lp ?? "0",
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
      pc: position.exSeg != "nse_cm" ? "NRML" : "MIS",
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
    console.log(validData.data);
    /* const res = await neo.placeOreder({ ...validData.data });
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
    } */
  }

  return parseInt(netQty) !== 0 ? (
    <div className="flex justify-between items-center text-xs md:text-sm border-y px-2 gap-4 mt-1 p-1">
      <div className="w-full flex flex-col lg:flex-row gap-2 justify-between items-center">
        <div className="w-full flex text-xs justify-start gap-2">
          <span>{position.trdSym}</span>
          <span>
            Qty:{netQty} | AP:{" "}
            {(
              (parseFloat(position.buyAmt) - parseFloat(position.sellAmt)) /
              parseInt(netQty)
            ).toFixed(2)}{" "}
            | LP:
            {position.lp}
          </span>
        </div>
        <div className="w-full flex justify-between items-center lg:justify-end gap-4">
          <div className="relative flex text-xs items-center gap-2">
            <span className="">Qty</span>
            <Input
              className="w-12 h-6 text-xs px-2"
              key={netQty}
              type="number"
              ref={exQtyInpRef}
              max={netQty}
              min={position.lotSz}
              step={position.lotSz}
              defaultValue={netQty}
              placeholder="Qty"
            />
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
                defaultValue={sl ? sl : ""}
                className="w-16 h-6 text-xs px-2"
              />
              <CheckIcon
                onClick={handleSetSl}
                className="size-4 cursor-pointer"
              />
            </div>
          ) : sl ? (
            <div className="relative w-24 text-xs flex gap-2">
              <span className="text-red-600">SL :</span>
              <span onClick={() => setEditSl(true)} className="cursor-pointer">
                {sl.toFixed(2)}
              </span>
            </div>
          ) : (
            <span
              onClick={() => setEditSl(true)}
              className="cursor-pointer text-xs w-24"
            >
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
                defaultValue={tsl ? tsl : ""}
                placeholder="TSL"
                className="w-12 h-6 text-xs px-2"
              />
              <CheckIcon
                onClick={handleSetTsl}
                className="size-4 cursor-pointer"
              />
            </div>
          ) : tsl ? (
            <div className="relative text-xs flex gap-2 w-20">
              <span className="text-red-600">TSL :</span>
              <span onClick={() => setEditTsl(true)} className="cursor-pointer">
                {tsl}
              </span>
            </div>
          ) : (
            <span
              onClick={() => setEditTsl(true)}
              className="cursor-pointer text-xs w-20"
            >
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
                defaultValue={tgt ? tgt : ""}
                className="w-16 h-6 text-xs px-2"
                placeholder="Target"
              />
              <CheckIcon
                onClick={handleSetTgt}
                className="size-4 cursor-pointer"
              />
            </div>
          ) : tgt ? (
            <div className="relative text-xs flex gap-2 w-24">
              <span className="text-red-600">TGT :</span>
              <span onClick={() => setEditTgt(true)} className="cursor-pointer">
                {tgt}
              </span>
            </div>
          ) : (
            <span
              onClick={() => setEditTgt(true)}
              className="cursor-pointer text-xs w-24"
            >
              Set TGT
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-col md:flex-row items-center justify-center gap-2">
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
          className="h-6 p-2 bg-rose-600"
        >
          <XMarkIcon className="size-4" />
        </Button>
      </div>
    </div>
  ) : showNewOrder ? (
    <div className="flex justify-between items-center text-xs border-y px-2 gap-4 mt-1 p-1">
      <div className="grow flex flex-col lg:flex-row items-stretch lg:items-center gap-2">
        <div className="flex justify-between items-center grow">
          <span className="w-20 lg:w-40 overflow-hidden grow">
            {position.trdSym}
          </span>
          <span>LTP:{position.lp}</span>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <label className="inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" />
            <div
              className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-['C'] peer-checked:after:content-['M']
          after:text-gray-800 after:text-center after:text-sm after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
            ></div>
          </label>
          <Input
            ref={qtyInpRef}
            placeholder="qty"
            type="number"
            defaultValue={position.lotSz}
            min={position.lotSz}
            step={position.lotSz}
            className="h-6 w-12 text-xs px-2"
          />
          <Select value={prctyp} onValueChange={(val) => setPrctyp(val)}>
            <SelectTrigger className="w-16 h-6 text-xs px-2">
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
            className="h-6 w-14 text-xs px-2"
          />
        </div>
        <div className="flex justify-around gap-2">
          <Button
            onClick={newOrder}
            variant="outline"
            size="sm"
            className="h-6 p-2 bg-rose-500"
          >
            Sell
          </Button>
          <Button
            onClick={newOrder}
            variant="outline"
            size="sm"
            className="h-6 p-2 bg-teal-500"
          >
            Buy
          </Button>
        </div>
      </div>
      <div className="flex">
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
        <div className="w-28 lg:w-60 overflow-hidden">{position.trdSym}</div>
        <div className="flex w-40">
          <div className="flex gap-2">
            <span>LTP</span>
            <span className="w-16">{position.lp ?? 0}</span>
          </div>
          <div className="flex gap-2">
            <span>Profit/Loss</span>
            <span className="text-right">
              {(
                parseFloat(position.sellAmt) - parseFloat(position.buyAmt)
              ).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
      <div>
        <Button
          onClick={() => setShowNewOrder(true)}
          variant="outline"
          size="sm"
          className="h-6 p-2"
        >
          +
        </Button>
      </div>
    </div>
  );
};

export default Position;
