import { z } from "zod";

export const AccountSchema = z.object({
  appKey: z.string().trim().min(1, { message: "Api Key is requierd" }),
  appSecret: z.string().trim().min(1, { message: "Api Password is requierd" }),
  appId: z.string().trim().min(1, { message: "Api User Id is requierd" }),
  appPass: z.string().trim().min(1, { message: "Api password is requierd" }),
  mobile: z.string().trim().min(1, { message: "Mobile is requierd" }),
  password: z.string().trim().min(1, { message: "Password is requierd" }),
  userId: z.string().trim().optional(),
  accessToken: z.string().trim().optional(),
  token: z.string().trim().optional(),
  sid: z.string().trim().optional(),
  tokenExp: z.string().trim().optional(),
});
