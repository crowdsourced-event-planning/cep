import { MongoClient, Db } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined");
}

interface CachedConnection {
  client: MongoClient | null;
  db: Db | null;
  promise: Promise<{ client: MongoClient; db: Db }> | null;
}

const cached: CachedConnection =
  global.mongodb ??
  (global.mongodb = { client: null, db: null, promise: null });

export async function dbConnect(): Promise<{ client: MongoClient; db: Db }> {
  if (cached.client && cached.db) {
    return { client: cached.client, db: cached.db };
  }

  if (!cached.promise) {
    cached.promise = MongoClient.connect(MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    }).then((client) => {
      const db = client.db("collabora");
      return { client, db };
    });
  }

  const connection = await cached.promise;
  cached.client = connection.client;
  cached.db = connection.db;
  global.mongodb = cached;

  return connection;
}

export async function getDb(): Promise<Db> {
  const { db } = await dbConnect();
  return db;
}
