"use server";

import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/dbConnect";
import Account, { IAccount } from "@/models/Account";
import User from "@/models/User";
import { AccountSchema } from "@/validation/account";
import { registerSchema } from "@/validation/register";
import { HydratedDocument, MongooseError, Types } from "mongoose";
import { getServerSession, Session } from "next-auth";
import { redirect } from "next/navigation";

export async function registerUserAction(prevState: any, formData: FormData) {
  try {
    const data = Object.fromEntries(formData.entries());
    const validatedFields = registerSchema.safeParse(data);
    if (!validatedFields.success) {
      return {
        errors: {
          name: validatedFields.error.flatten().fieldErrors.name?.[0],
          email: validatedFields.error.flatten().fieldErrors.email?.[0],
          password: validatedFields.error.flatten().fieldErrors.password?.[0],
          cpassword: validatedFields.error.flatten().fieldErrors.cpassword?.[0],
        },
      };
    }

    await dbConnect();
    const user = await User.findOne({ email: validatedFields.data.email });
    if (user) {
      return {
        errors: {
          email: "This email is already registred",
        },
      };
    }
    await User.create(validatedFields.data);
  } catch (error) {
    console.log(error);
    console.log(typeof error);
    return {
      errors: {},
    };
  }
  redirect("/login");
}

export async function addAccount(prevState: any, formData: FormData) {
  try {
    const data = Object.fromEntries(formData.entries());
    const validatedFields = AccountSchema.safeParse(data);
    if (!validatedFields.success) {
      return { errors: validatedFields.error.flatten().fieldErrors };
    }

    const session: any = await getServerSession(authOptions);
    if (!session) throw Error("User session not found");
    const id = session.user.id;
    await dbConnect();
    await Account.create({ user: id, ...validatedFields.data });
  } catch (error) {
    if (error instanceof MongooseError) {
      console.log(error);
      return {
        errors: {
          message: "All field are required",
        },
      };
    }
    return {
      errors: {
        message: "Something went wrong",
      },
    };
  }
  redirect("/dashboard");
}

export async function getAccount() {
  const session: any = await getServerSession(authOptions);
  const user: string = session?.user.id;
  await dbConnect();
  try {
    const accounts: HydratedDocument<IAccount>[] = await Account.aggregate([
      {
        $match: {
          user: new Types.ObjectId(user),
        },
      },
      {
        $project: {
          _id: {
            $toString: "$_id",
          },
          user: {
            $toString: "$user",
          },
          appKey: 1,
          appSecret: 1,
          appId: 1,
          appPass: 1,
          mobile: 1,
          password: 1,
          userId: 1,
          accessToken: 1,
          token: 1,
          sid: 1,
          tokenExp: 1,
        },
      },
    ]);
    if (accounts.length == 0) return null;
    return accounts[0];
  } catch (error) {
    console.log(error);
  }
}

export async function getAccessToken(account: IAccount) {
  try {
    await dbConnect();
    const dbaccount: HydratedDocument<IAccount> | null = await Account.findById(
      account._id
    );
    console.log(dbaccount);
    if (!dbaccount) return false;
    let base64 = btoa(`${account.appKey}:${account.appSecret}`);
    const urlencoded = new URLSearchParams();
    urlencoded.append("grant_type", "password");
    urlencoded.append("username", account.appId);
    urlencoded.append("password", account.appPass);
    const getAccessRes = await fetch(
      "https://napi.kotaksecurities.com/oauth2/token",
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${base64}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: urlencoded,
      }
    );
    const getAccessResData = await getAccessRes.json();
    if (getAccessRes.status >= 300) return false;
    const accessToken = getAccessResData.access_token;

    const getTokenRes = await fetch(
      "https://gw-napi.kotaksecurities.com/login/1.0/login/v2/validate",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mobileNumber: account.mobile,
          password: account.password,
        }),
      }
    );
    const tokenResData = await getTokenRes.json();
    console.log(getTokenRes.status);
    console.log(tokenResData);
    const token = tokenResData.data.token;
    const sid = tokenResData.data.sid;
    // TODO:: JWT IO se userid nikalna hai
    const userId = "0aac2bd1-4691-4a71-8108-df601e3ebbc2";

    const genOTPRes = await fetch(
      "https://gw-napi.kotaksecurities.com/login/1.0/login/otp/generate",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          sendEmail: true,
          isWhitelisted: true,
        }),
      }
    );

    const otpResData = await genOTPRes.json();
    console.log(genOTPRes.status);
    console.log(otpResData);
    dbaccount.sid = sid;
    dbaccount.accessToken = accessToken;
    dbaccount.token = token;
    dbaccount.userId = userId;
    dbaccount.save();

    return true;
  } catch (error) {
    console.log("error");
    console.log(typeof error);
    console.log(error);
  }
  return false;
}

export async function verifyToken(id: string, otp: string) {
  try {
    await dbConnect();
    const account: HydratedDocument<IAccount> | null = await Account.findById(
      id
    );
    if (!account) throw Error("No Account");
    if (!account.accessToken || !account.token || !account.sid)
      throw Error("some field are missing");
    const res = await fetch(
      "https://gw-napi.kotaksecurities.com/login/1.0/login/v2/validate",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${account.accessToken}`,
          Auth: account.token,
          sid: account.sid,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: account.userId,
          otp: otp,
        }),
      }
    );
    const resData = await res.json();
    console.log(res.status);
    console.log(resData);
    const token = resData.data.token;
    account.token = token;
    await account.save();
  } catch (error) {
    console.log(error);
  }
}
