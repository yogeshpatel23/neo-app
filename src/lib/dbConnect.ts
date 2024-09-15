import mongoose from "mongoose";

if (!process.env.MONGODB_URL) {
  throw new Error("Please define MONGODB_URL environment variable in .env");
}

if (!process.env.DBNAME) {
  throw new Error("Please define DBNAME environment variable in .env");
}

const MONGODB_URL = process.env.MONGODB_URL;

let globalWithMongoose = global as typeof globalThis & { mongoose: any };

let cached = globalWithMongoose.mongoose;

if (!cached) {
  cached = globalWithMongoose.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      dbName: process.env.DBNAME,
      bufferCommands: true,
    };

    cached.promise = mongoose
      .connect(MONGODB_URL, opts)
      .then((mongoose) => mongoose)
      .catch((err) => {
        console.log("monggose error");
        console.log(err.message);
      });
  }
  try {
    cached.conn = await cached.promise;
  } catch (err: any) {
    console.log("mongo connect error");
    console.log(err.message);
  }
  return cached.conn;
}

export default dbConnect;
