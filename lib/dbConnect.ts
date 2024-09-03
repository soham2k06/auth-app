import mongoose, { type ConnectOptions, type Mongoose } from "mongoose";

const MONGODB_URI: string | undefined = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

type GlobalMongoose = {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
};

type Global = {
  mongoose: GlobalMongoose;
};

const globalMongoose = global as unknown as Global;

let cached: GlobalMongoose = globalMongoose.mongoose;
if (!cached) {
  cached = globalMongoose.mongoose = { conn: null, promise: null };
}

async function dbConnect(): Promise<Mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts: ConnectOptions = {
      bufferCommands: false,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI ?? "", opts)
      .then((mongoose) => mongoose);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
