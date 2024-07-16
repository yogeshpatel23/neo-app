import { string, z } from "zod";

export const OrderBase = z.object({
  es: z.string(), // "nse_cm",
  ts: z.string(), // "IDEA-EQ",
  pc: z.enum(["CNC", "NRML", "MIS", "CO"]), // "CNC",
  //   pt: z.string(), // enum(["MKT", "L", "SL", "SL-M"]), // "MKT",
  tt: z.string(), // "B",
  qt: z.string(), // "1",
  //   pr: z.string().default("0"), // "3000",
  //   tp: z.string().default("0"), // "0",
  rt: z.string().default("DAY"), // "DAY",
  pf: z.string().default("N"), // "N",
  mp: z.string().default("0"), // "0",
  am: z.string().default("NO"), // "NO",
  dq: z.string().default("0"), // "0",
  //   ig: z.string().default("Neo-App"), //  ""
});

const OrderMkt = OrderBase.merge(
  z.object({
    pt: z.enum(["MKT"]),
    pr: z.string().default("0"),
  })
);
const OrderLimit = OrderBase.merge(
  z.object({
    pt: z.enum(["L"]),
    pr: z.string().min(1, { message: "Price is required" }),
  })
);

const OrderStopMkt = OrderBase.merge(
  z.object({
    pt: z.enum(["SL"]),
    pr: z.string().default("0"),
    tp: z.string().min(1, { message: "Trg Price is required" }),
  })
);

export const OrderShema = z.discriminatedUnion("pt", [
  OrderMkt,
  OrderLimit,
  OrderStopMkt,
]);

export type OrderType = z.infer<typeof OrderShema>;
