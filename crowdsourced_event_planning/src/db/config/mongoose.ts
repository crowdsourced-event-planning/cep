import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined");
}

const cached =
  global.mongoose ?? (global.mongoose = { conn: null, promise: null });

export async function dbConnect(): Promise<mongoose.Connection> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        dbName: "collabora",
        bufferCommands: false,
        autoIndex: false,
      })
      .then((mongoose) => mongoose.connection);
  }

  cached.conn = await cached.promise;
  global.mongoose = cached;

  return cached.conn;
}
