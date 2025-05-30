import { MongoClient, Db } from "mongodb";

declare global {
  // eslint-disable-next-line no-var
  var mongodb:
    | {
        client: MongoClient | null;
        db: Db | null;
        promise: Promise<{ client: MongoClient; db: Db }> | null;
      }
    | undefined;
}

export {};
