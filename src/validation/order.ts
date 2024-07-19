import { z } from "zod";

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

const MOrderBase = z.object({
  es: z.string(),
  no: z.string(),
  qt: z.string(),
  tk: z.string(),
  pc: z.string(),
  ts: z.string(),
  tt: z.string(),
  mp: z.string().default("0"),
  dq: z.string().default("0"),
  dd: z.string().default("NA"),
  am: z.string().default("NO"),
  vd: z.string().default("DAY"),
});

const MOrderMkt = MOrderBase.merge(
  z.object({
    pt: z.enum(["MKT"]),
    pr: z.string().default("0"),
    tp: z.string().default("0"),
  })
);
const MOrderLmt = MOrderBase.merge(
  z.object({
    pt: z.enum(["L"]),
    pr: z.string().min(1, { message: "Price is required" }),
    tp: z.string().default("0"),
  })
);
const MOrderStop = MOrderBase.merge(
  z.object({
    pt: z.enum(["SL"]),
    pr: z.string().default("0"),
    tp: z.string().min(1, { message: "Trg Price is required" }),
  })
);

export const MOrderSchema = z.discriminatedUnion("pt", [
  MOrderLmt,
  MOrderMkt,
  MOrderStop,
]);

// export type MOrderT
