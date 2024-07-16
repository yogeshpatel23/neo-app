import mongoose, { Schema, Types } from "mongoose";

export interface IAccount {
  _id: string;
  user: Types.ObjectId;
  appKey: string;
  appSecret: string;
  appId: string;
  appPass: string;
  mobile: string;
  password: string;
  userId?: string;
  accessToken?: string;
  token?: string;
  sid?: string;
  tokenExp?: string;
  hsServerId?: string;
}

const accountSchema = new Schema<IAccount>({
  user: {
    required: true,
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  appKey: {
    type: String,
    required: [true, "App Key is required"],
  },
  appSecret: {
    type: String,
    required: [true, "App secret is required"],
  },
  appId: {
    type: String,
    required: [true, "App Id is required"],
  },
  appPass: {
    type: String,
    required: [true, "App Pass is required"],
  },
  mobile: {
    type: String,
    required: [true, "mobile is required"],
  },
  password: {
    type: String,
    trim: true,
    required: [true, "password is required"],
  },
  userId: String,
  accessToken: String,
  token: String,
  sid: String,
  tokenExp: String,
});

accountSchema.pre("save", function (next) {
  if (!this.isModified("accessToken")) return next();
  this.tokenExp = new Date().toDateString();
  next();
});

const Account =
  mongoose.models.Account || mongoose.model("Account", accountSchema);

export default Account;
