import { Script } from "@/types/Script";
import React, { useRef, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useToast } from "../ui/use-toast";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { KotakNeo } from "@/lib/KotakNeo";
import { OrderShema, OrderType } from "@/validation/order";
import { TrashIcon } from "@heroicons/react/24/outline";
import { removeScript } from "@/store/watchlistSlice";

const WlScript = ({
  script,
  neo,
  tabid,
}: {
  script: Script;
  neo: KotakNeo;
  tabid: string;
}) => {
  const [prctyp, setPrctyp] = useState("L");
  const [intraday, setIntrady] = useState(
    script.exseg === "nse_cm" ? true : false
  );

  const qtyRef = useRef<HTMLInputElement>(null);
  const prcRef = useRef<HTMLInputElement>(null);

  const { toast } = useToast();
  const dispatch = useDispatch();

  async function handleOrder(tt: string) {
    if (!script.ltp) return;
    const data: any = {
      es: script.exseg,
      pc: intraday ? "MIS" : script.exseg === "nse_cm" ? "CNC" : "NRML",
      pt: prctyp,
      tt: tt,
      ts: script.trdSymbol,
      pr:
        tt === "B"
          ? (
              parseFloat(script.ltp) +
              Math.round((parseFloat(script.ltp) * 0.01) / 0.05) * 0.05
            ).toFixed(script.precision)
          : (
              parseFloat(script.ltp) -
              Math.round((parseFloat(script.ltp) * 0.01) / 0.05) * 0.05
            ).toFixed(script.precision),
      qt: qtyRef.current?.value,
    };

    if (prctyp === "L") {
      if (!prcRef.current) return;
      data.pr = prcRef.current.value;
    }

    if (prctyp === "SL") {
      if (!prcRef.current) return;
      if (
        tt === "B" &&
        parseFloat(prcRef.current.value) < parseFloat(script.ltp!)
      ) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Trigger price higher then LTP",
        });
        prcRef.current.classList.add("border-red-500");
        return;
      }
      if (
        tt === "S" &&
        parseFloat(prcRef.current.value) > parseFloat(script.ltp!)
      ) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Trigger price lower then LTP",
        });
        prcRef.current.classList.add("border-red-500");
        return;
      }
      data.tp = prcRef.current.value;
      data.pr =
        tt === "B"
          ? (
              parseFloat(prcRef.current.value) +
              Math.round((parseFloat(prcRef.current.value) * 0.01) / 0.05) *
                0.05
            ).toFixed(script.precision)
          : (
              parseFloat(prcRef.current.value) -
              Math.round((parseFloat(prcRef.current.value) * 0.01) / 0.05) *
                0.05
            ).toFixed(script.precision);
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
    prcRef.current?.classList.remove("border-red-500");
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

  return (
    <div className="border relative px-4 py-2 space-y-2 grow rounded-xl">
      <div className="flex justify-between items-center font-bold text-xs">
        <span className="">{script.trdSymbol}</span>
        {script.optType !== "-" && <span>{script.optType}</span>}
        <span>{script.ltp ?? 0}</span>
      </div>
      <div className="flex gap-2">
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={intraday}
            onChange={() => {
              setIntrady(!intraday);
            }}
            className="sr-only peer"
          />
          <div
            className="relative w-20 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-['CNC'] peer-checked:after:content-['MIS']
          after:text-gray-800 after:text-center after:text-sm after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-10 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
          ></div>
        </label>
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
        <Select value={prctyp} onValueChange={(v) => setPrctyp(v)}>
          <SelectTrigger id="prctyp" className="h-6">
            <SelectValue placeholder="Select Index" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="L">LIMIT</SelectItem>
            <SelectItem value="MKT">MKT</SelectItem>
            <SelectItem value="SL">SLM</SelectItem>
            {/* <SelectItem value="SL-LMT">SL-LMT</SelectItem> */}
          </SelectContent>
        </Select>
        <Input
          type="number"
          ref={prcRef}
          min={script.tickSize}
          placeholder={script.ltp ?? "Price"}
          className="w-20 h-6"
        />
      </div>
      <div className="flex justify-around items-center">
        <Button
          onClick={() => {
            handleOrder("S");
          }}
          size="sm"
          className="p-2 h-6 w-16 font-bold text-sm bg-rose-600"
        >
          Sell
        </Button>
        <Button
          onClick={() => {
            handleOrder("B");
          }}
          size="sm"
          className="p-2 h-6 w-16 font-bold text-sm bg-teal-500 text-white"
        >
          Buy
        </Button>
      </div>
      <TrashIcon
        className="size-4 text-red-600 cursor-pointer absolute bottom-2 right-4"
        onClick={() => {
          dispatch(
            removeScript({ exchangeId: script.exchangeId, tabid: tabid })
          );
        }}
      />
    </div>
  );
};

export default WlScript;
