"use client";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { KotakNeo } from "@/lib/KotakNeo";
import { Script } from "@/types/Script";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { useToast } from "../ui/use-toast";
import { addToWatchlist } from "@/store/watchlistSlice";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import WlScript from "./WlScript";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { searchtest } from "@/app/action";

const Watchlist = ({ neo, wsfun }: { neo: KotakNeo; wsfun: Function }) => {
  const [tabId, setTabId] = useState("1");
  const [stext, setStext] = useState("");
  const [searchResult, setSearchResult] = useState<Script[]>([]);

  const watchlistScripts = useSelector((store: RootState) => store.watchlist);

  const dispatch = useDispatch();
  const { toast } = useToast();

  useEffect(() => {
    if (stext.length < 3) return;
    const to = setTimeout(async () => {
      let queryString = btoa(stext.toUpperCase());
      try {
        setSearchResult(await searchtest(queryString, neo.accessToken));
      } catch (e) {
        console.log(e);
      }
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
    <div className="w-full md:w-96 pt-4 space-y-3 flex flex-col">
      <div className="relative flex gap-2 px-4">
        <div className="relative w-full">
          <Input
            value={stext}
            onChange={(e) => setStext(e.target.value)}
            className="w-full"
          />
        </div>
        {stext.length !== 0 && (
          <XMarkIcon
            className="absolute size-6 top-2 right-6 text-gray-500 cursor-pointer"
            onClick={() => {
              setStext("");
              setSearchResult([]);
            }}
          />
        )}
        {searchResult.length > 0 && (
          <div className="z-10 absolute top-10 inset-x-2 h-52 overflow-y-scroll rouded-b-xl bg-gray-600">
            {searchResult.map((script) => {
              return watchlistScripts[parseInt(tabId) - 1].find(
                (sc) => sc.exchangeId === script.exchangeId
              ) ? (
                <div
                  key={script.exchangeId}
                  className="text-sm flex justify-between cursor-not-allowed px-4"
                >
                  {script.trdSymbol !== "-" ? (
                    <span>{script.trdSymbol}</span>
                  ) : (
                    <span>{script.company}</span>
                  )}
                  {script.readableExpiryDate && (
                    <span className="text-xs">
                      {script.readableExpiryDate.substring(0, 6)}
                    </span>
                  )}
                </div>
              ) : (
                <div
                  key={script.exchangeId}
                  onClick={() => {
                    handleSelect(script);
                  }}
                  className="text-sm flex justify-between cursor-pointer px-4 hover:bg-slate-700"
                >
                  {script.trdSymbol !== "-" ? (
                    <span>{script.trdSymbol}</span>
                  ) : (
                    <span>{script.company}</span>
                  )}
                  {script.readableExpiryDate && (
                    <span className="text-xs">
                      {script.readableExpiryDate.substring(0, 6)}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      <Tabs
        defaultValue={tabId}
        onValueChange={(val) => {
          setTabId(val);
        }}
        className="flex flex-col grow pb-4 min-h-72"
      >
        <div className="grow">
          <TabsContent
            value="1"
            className="flex flex-wrap items-center justify-around gap-3 mt-0 px-2"
          >
            {watchlistScripts[0].length > 0 &&
              watchlistScripts[0].map((script) => (
                <WlScript
                  key={script.exchangeId}
                  script={script}
                  neo={neo}
                  tabid="1"
                />
              ))}
          </TabsContent>
          <TabsContent
            value="2"
            className="flex flex-wrap items-center justify-around gap-3 mt-0 px-2"
          >
            {watchlistScripts[1].length > 0 &&
              watchlistScripts[1].map((script) => (
                <WlScript
                  key={script.exchangeId}
                  script={script}
                  neo={neo}
                  tabid="2"
                />
              ))}
          </TabsContent>
          <TabsContent
            value="3"
            className="flex flex-wrap items-center justify-around gap-3 mt-0 px-2"
          >
            {watchlistScripts[2].length > 0 &&
              watchlistScripts[2].map((script) => (
                <WlScript
                  key={script.exchangeId}
                  script={script}
                  neo={neo}
                  tabid="3"
                />
              ))}
          </TabsContent>
        </div>

        <div className="flex justify-center mt-2">
          <TabsList className="">
            <TabsTrigger value="1">1</TabsTrigger>
            <TabsTrigger value="2">2</TabsTrigger>
            <TabsTrigger value="3">3</TabsTrigger>
          </TabsList>
        </div>
      </Tabs>
    </div>
  );
};

export default Watchlist;
