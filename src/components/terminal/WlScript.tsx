import { Script } from "@/types/Script";
import React, { useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
// import { OrderShema } from "@/validation/order";
import { useToast } from "../ui/use-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { KotakNeo } from "@/lib/KotakNeo";

const WlScript = ({ script, neo }: { script: Script; neo: KotakNeo }) => {
  const [prctyp, setPrctyp] = useState("LMT");

  const qtyRef = useRef<HTMLInputElement>(null);
  const prcRef = useRef<HTMLInputElement>(null);

  const { toast } = useToast();

  function handleOrder() {
    neo.placeOreder();
  }

  return (
    <div className="border px-4 py-2 space-y-2 grow rounded-xl">
      <div className="flex justify-between items-center font-bold text-xs">
        <span className="">
          {script.trdSymbol.slice(0, 5)} {script.trdSymbol.slice(-7)}
        </span>
        <span>LTP: {script.ltp ?? 0}</span>
      </div>
      <div className="flex gap-2">
        <div className="flex items-center gap-1">
          <Label htmlFor="qty" className="font-thin">
            Qty:
          </Label>
          <Input
            id="qty"
            defaultValue={script.lotSize}
            key={script.trdSymbol}
            ref={qtyRef}
            type="number"
            step={script.lotSize}
            min={script.lotSize}
            className="w-16 h-6"
          />
        </div>
        <div className="flex items-center gap-1">
          {/* <Label htmlFor="prctyp">OT:</Label> */}
          <Select value={prctyp} onValueChange={(v) => setPrctyp(v)}>
            <SelectTrigger id="prctyp" className="h-6">
              <SelectValue placeholder="Select Index" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="LMT">LIMIT</SelectItem>
              <SelectItem value="MKT">MKT</SelectItem>
              <SelectItem value="SL-LMT">SLM</SelectItem>
              {/* <SelectItem value="SL-LMT">SL-LMT</SelectItem> */}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex justify-around items-center">
        <Input
          type="number"
          ref={prcRef}
          min={script.tickSize}
          placeholder={script.ltp ?? "Price"}
          className="w-20 h-6"
        />
        <Button
          onClick={handleOrder}
          size="sm"
          className="p-2 h-6 w-16 font-bold text-sm"
        >
          Buy
        </Button>
      </div>
    </div>
  );
};

export default WlScript;
