import { MongoClient } from "mongodb";
import { startAndSeedMemoryDB } from "./startAndSeedMemoryDB";

let mongoClient: MongoClient | null = null;
let DATABASE_URL = process.env.DATABASE_URL;

export async function connectDB(): Promise<MongoClient> {
  if (process.env.NODE_ENV !== "production" && !DATABASE_URL) {
    console.log("Starting in-memory MongoDB...");
    DATABASE_URL = await startAndSeedMemoryDB();
  }

  if (!DATABASE_URL) {
    throw new Error("DATABASE_URL is not set and no in-memory DB is available");
  }

  if (!mongoClient) {
    mongoClient = new MongoClient(DATABASE_URL);
    await mongoClient.connect();
    console.log("Connected to MongoDB");
  }

  return mongoClient;
}

export function getDB() {
  if (!mongoClient) {
    throw new Error("Database connection has not been initialized. Call connectDB() first.");
  }
  return mongoClient.db();
}
