import { MongoMemoryServer } from "mongodb-memory-server";
import { MongoClient } from "mongodb";
import { cities } from "./seeds/cities.js";
import { countries } from "./seeds/countries";
import { hotels } from "./seeds/hotels";

let mongod: MongoMemoryServer | null = null;

export async function startAndSeedMemoryDB(): Promise<string> {
  mongod = await MongoMemoryServer.create({
    instance: {
      port: 3002,
    },
  });

  const uri = mongod.getUri();
  console.log("MongoMemoryServer started on", uri);

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db();
    await db.collection("cities").insertMany(cities);
    await db.collection("countries").insertMany(countries);
    await db.collection("hotels").insertMany(hotels);
    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await client.close();
  }

  return uri;
}

// Gracefully stop the in-memory DB on process exit
process.on("SIGTERM", async () => {
  if (mongod) {
    await mongod.stop();
    console.log("MongoMemoryServer stopped.");
  }
  process.exit(0);
});
