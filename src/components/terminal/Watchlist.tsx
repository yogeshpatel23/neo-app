"use client";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { KotakNeo } from "@/lib/KotakNeo";
import { Script } from "@/types/Script";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { useToast } from "../ui/use-toast";
import { addToWatchlist } from "@/store/watchlistSlice";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import WlScript from "./WlScript";

const Watchlist = ({ neo, wsfun }: { neo: KotakNeo; wsfun: Function }) => {
  const [tabId, setTabId] = useState("1");
  const [index, setIndex] = useState("NIFTY");
  const [exch, setExch] = useState("NFO");
  const [stext, setStext] = useState("");
  const [searchResult, setSearchResult] = useState<Script[]>([]);

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

  const dispatch = useDispatch();
  const { toast } = useToast();

  useEffect(() => {
    switch (index) {
      case "SENSEX":
      case "BANKEX":
        setExch("BFO");
        break;
      case "CRUDE":
        setExch("MCX");
        break;
      case "NIFTY":
      case "BANKNIFTY":
      case "FINNIFTY":
      case "MIDCPNIFTY":
        setExch("NFO");
        break;
      case "EQUITY":
        setExch("NSE");
        break;
      default:
        break;
    }
  }, [index]);

  useEffect(() => {
    if (stext.length < 3) return;
    const to = setTimeout(async () => {
      let queryString = btoa(
        `${index === "EQUITY" ? "" : index} ${stext}`.toUpperCase()
      );
      setSearchResult(await neo.searchScript(queryString));
    }, 1000);
    return () => {
      clearTimeout(to);
    };
  }, [stext]);

  function handleSelect(script: Script) {
    wsfun(script.exseg, script.exchangeId);

    dispatch(addToWatchlist({ script, tabId }));
    setSearchResult([]);
    setStext("");
  }

  return (
    <div className="w-full md:w-72 pt-4 space-y-3">
      <div className="relative flex gap-2 px-4">
        <Select
          value={index}
          onValueChange={(v) => {
            setIndex(v);
            setSearchResult([]);
          }}
        >
          <SelectTrigger className="w-32 text-xs overflow-clip">
            <SelectValue placeholder="Select Index" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="NIFTY">NIFTY</SelectItem>
            <SelectItem value="BANKNIFTY">BANKNIFTY</SelectItem>
            <SelectItem value="FINNIFTY">FINNIFTY</SelectItem>
            <SelectItem value="MIDCPNIFTY">MIDCPNIFTY</SelectItem>
            <SelectItem value="SENSEX">SENSEX</SelectItem>
            <SelectItem value="BANKEX">BANKEX</SelectItem>
            <SelectItem value="CRUDE">CRUDE</SelectItem>
            <SelectItem value="EQUITY">EQUITY</SelectItem>
          </SelectContent>
        </Select>
        <div className="relative">
          <Input
            value={stext}
            onChange={(e) => setStext(e.target.value)}
            className="w-32"
          />
        </div>
        {searchResult.length > 0 && (
          <div className="z-10 absolute top-10 inset-x-2 h-52 overflow-y-scroll rouded-b-xl bg-gray-600">
            {searchResult.map((script) => (
              <div
                key={script.exchangeId}
                onClick={() => {
                  handleSelect(script);
                }}
                className="text-sm flex justify-between cursor-pointer px-4 hover:bg-slate-700"
              >
                <span>{script.trdSymbol}</span>
                {script.readableExpiryDate && (
                  <span className="text-xs">
                    {script.readableExpiryDate.substring(0, 6)}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <Tabs
        defaultValue={tabId}
        onValueChange={(val) => {
          if (val === "EQ") {
            setIndex("EQUITY");
          }
          setTabId(val);
        }}
        className=""
      >
        <TabsContent
          value="1"
          className="flex flex-wrap items-center justify-around gap-3 mt-0 px-2"
        >
          {ceScript ? (
            <WlScript script={ceScript} neo={neo} />
          ) : (
            <div className="w-52 border rounded-lg h-24">{exch}</div>
          )}
          {peScript ? (
            <WlScript script={peScript} neo={neo} />
          ) : (
            <div className="w-52 border rounded-lg h-24">{exch}</div>
          )}
        </TabsContent>
        <TabsContent
          value="2"
          className="flex flex-wrap items-center justify-around gap-3 mt-0 px-2"
        >
          {ceScript2 ? (
            <WlScript script={ceScript2} neo={neo} />
          ) : (
            <div className="w-52 border rounded-lg h-24">{exch}</div>
          )}
          {peScript2 ? (
            <WlScript script={peScript2} neo={neo} />
          ) : (
            <div className="w-52 border rounded-lg h-24">{exch}</div>
          )}
        </TabsContent>
        <TabsContent
          value="3"
          className="flex flex-wrap items-center justify-around gap-3 mt-0 px-2"
        >
          {ceScript3 ? (
            <WlScript script={ceScript3} neo={neo} />
          ) : (
            <div className="w-52 border rounded-lg h-24">{exch}</div>
          )}
          {peScript3 ? (
            <WlScript script={peScript3} neo={neo} />
          ) : (
            <div className="w-52 border rounded-lg h-24">{exch}</div>
          )}
        </TabsContent>
        <TabsContent
          value="4"
          className="flex flex-wrap items-center justify-around gap-3 mt-0 px-2"
        >
          {ceScript4 ? (
            <WlScript script={ceScript4} neo={neo} />
          ) : (
            <div className="w-52 border rounded-lg h-24">{exch}</div>
          )}
          {peScript4 ? (
            <WlScript script={peScript4} neo={neo} />
          ) : (
            <div className="w-52 border rounded-lg h-24">{exch}</div>
          )}
        </TabsContent>
        <TabsContent
          value="EQ"
          className="flex flex-wrap items-center justify-around gap-3 mt-0 px-2"
        >
          {eqScript ? (
            <WlScript script={eqScript} neo={neo} />
          ) : (
            <div className="w-52 border rounded-lg h-24">{exch}</div>
          )}
        </TabsContent>

        <div className="flex justify-center mt-2">
          <TabsList className="">
            <TabsTrigger value="1">
              {ceScript?.trdSymbol[0] ?? peScript?.trdSymbol[0] ?? "1"}
            </TabsTrigger>
            <TabsTrigger value="2">
              {ceScript2?.trdSymbol[0] ?? peScript2?.trdSymbol[0] ?? "2"}
            </TabsTrigger>
            <TabsTrigger value="3">
              {ceScript3?.trdSymbol[0] ?? peScript3?.trdSymbol[0] ?? "3"}
            </TabsTrigger>
            <TabsTrigger value="4">
              {ceScript4?.trdSymbol[0] ?? peScript4?.trdSymbol[0] ?? "4"}
            </TabsTrigger>
            <TabsTrigger value="EQ">EQ</TabsTrigger>
          </TabsList>
        </div>
      </Tabs>
    </div>
  );
};

export default Watchlist;
