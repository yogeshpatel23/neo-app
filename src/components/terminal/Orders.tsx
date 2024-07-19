"use client";

import { OrderBook } from "@/types/orderbook";
import { useRef, useState } from "react";
import { CheckIcon, PencilIcon, XMarkIcon } from "@heroicons/react/24/outline";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { KotakNeo } from "@/lib/KotakNeo";
import { useToast } from "../ui/use-toast";
import { MOrderSchema } from "@/validation/order";

const Orders = ({ order, neo }: { order: OrderBook; neo: KotakNeo }) => {
  const [editMode, setEditMode] = useState(false);
  const [prctyp, setPrctyp] = useState(order.prcTp);

  const qtyRef = useRef<HTMLInputElement>(null);
  const prcRef = useRef<HTMLInputElement>(null);

  const { toast } = useToast();

  async function handleCancle() {
    let res = await neo.cancleOreder(order.nOrdNo);
    if (res.stat === "Ok") {
      toast({
        title: "Order cancled",
        description: `Order no ${res.result} is canceled`,
      });
    }
  }

  async function handleModify() {
    if (!order.ltp) return;
    let data: any = {
      es: order.exSeg,
      no: order.nOrdNo,
      ts: order.trdSym,
      tt: order.trnsTp,
      qt: qtyRef.current?.value,
      tk: order.tok,
      pt: prctyp,
      pc: order.prod,
    };

    if (prctyp === "MKT") {
      data["pr"] = (
        parseFloat(order.ltp ?? "0") +
        Math.round((parseFloat(order.ltp ?? "0") * 0.01) / 0.05) * 0.05
      ).toString();
    }

    if (prctyp === "L") {
      if (!prcRef.current) return;
      data.pr = prcRef.current.value;
    }

    if (prctyp === "SL") {
      if (!prcRef.current) return;
      if (parseFloat(prcRef.current.value) < parseFloat(order.ltp!)) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Triger price greate then LTP",
        });
        return;
      }
      data.tp = prcRef.current.value;
      data.pr = (
        parseFloat(prcRef.current.value) +
        Math.round((parseFloat(prcRef.current.value) * 0.01) / 0.05) * 0.05
      ).toString();
    }

    const validData = MOrderSchema.safeParse(data);
    if (!validData.success) {
      console.error(validData.error.flatten());
    }
    let mo_res = await neo.modifyOreder({ ...validData.data });
    if (mo_res.stat !== "Ok") {
      toast({
        variant: "destructive",
        title: "Modification Error",
        description: mo_res.errMsg,
      });
      return;
    }
    toast({
      title: "Order Modifyed",
      description: `Order no. ${mo_res.nOrdNo} is modifyed`,
    });
    setEditMode(false);
  }

  return editMode ? (
    <div className="flex justify-between items-center bg-gray-600 text-xs md:text-sm border-y px-2 gap-4">
      <div className="w-full flex flex-col md:flex-row justify-between gap-2 md:gap-8">
        <div className="flex justify-between grow">
          <div>{order.trdSym}</div>
          <div>
            <Input
              id="qty"
              defaultValue={order.qty}
              key={order.trdSym}
              ref={qtyRef}
              type="number"
              step={order.lotSz}
              min={order.lotSz}
              className="w-16 h-6"
            />
          </div>
        </div>
        <div className="flex justify-between grow">
          <div>
            <Select value={prctyp} onValueChange={(v) => setPrctyp(v)}>
              <SelectTrigger id="prctyp" className="h-6">
                <SelectValue placeholder="Select Index" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="L">LIMIT</SelectItem>
                <SelectItem value="MKT">MARKET</SelectItem>
                <SelectItem value="SL">SL-LMT</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Input
              type="number"
              ref={prcRef}
              min={order.tckSz}
              defaultValue={order.prc}
              placeholder={order.ltp ?? "Price"}
              className="w-20 h-6"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-1">
        <Button
          onClick={handleModify}
          size="sm"
          variant="outline"
          className="h-6 p-2"
        >
          <CheckIcon className="size-4" />
        </Button>
        <Button
          onClick={() => setEditMode(false)}
          size="sm"
          variant="outline"
          className="h-6 p-2"
        >
          <XMarkIcon className="size-4" />
        </Button>
      </div>
    </div>
  ) : (
    <div className="flex justify-between items-center text-xs md:text-sm border-y px-2 gap-4">
      <div className="w-full flex flex-col md:flex-row justify-between gap-2 md:gap-8">
        <div className="flex justify-between grow">
          <div>{order.trdSym}</div>
          <div>{order.qty}</div>
        </div>
        <div className="flex justify-between grow">
          <div>{order.prcTp}</div>
          <div>
            {order.prc}/{order.ltp ?? "00.00"}
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-1">
        <Button
          onClick={() => setEditMode(true)}
          size="sm"
          variant="outline"
          className="h-6 p-2"
        >
          <PencilIcon className="size-4" />
        </Button>
        <Button
          onClick={handleCancle}
          size="sm"
          variant="outline"
          className="h-6 p-2"
        >
          <XMarkIcon className="size-4 text-red-500" />
        </Button>
      </div>
    </div>
  );
};

export default Orders;
