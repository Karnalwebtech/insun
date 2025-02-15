import mongoose from "mongoose";

const DB: string | undefined = process.env.DB;

if (!DB) {
  throw new Error("Database URL is not provided");
}

interface Cached {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

/* eslint-disable-next-line prefer-const */
let cached: Cached = { conn: null, promise: null };

async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
    };

    // DB! is safe here since we already checked for undefined above
    cached.promise = mongoose.connect(DB!, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

export default connectDB;
