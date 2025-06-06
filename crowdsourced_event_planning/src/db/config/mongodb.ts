import { MongoClient, Db } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined");
}

const DB_NAME = "collabora";

// List of collections in the database for reference and initialization
export const COLLECTIONS = {
  USERS: "users",
  EVENTS: "events",
  TASKS: "tasks",
  WORKBOOKS: "workbooks",
  CHATS: "chats",
  RATINGS: "ratings",
  FUNDINGS: "fundings",
  USEREVENTS: "userevents",
  TRANSACTIONS: "transactions",
};

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
      const db = client.db(DB_NAME);
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

// Helper function to ensure all required collections exist
export async function ensureCollections(): Promise<void> {
  const db = await getDb();

  // Get list of existing collections
  const collections = await db.listCollections().toArray();
  const collectionNames = collections.map((c) => c.name);

  // Create collections that don't exist
  for (const collectionName of Object.values(COLLECTIONS)) {
    if (!collectionNames.includes(collectionName)) {
      await db.createCollection(collectionName);
      console.log(`Created collection: ${collectionName}`);
    }
  }
}
