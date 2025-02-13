import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import NodeCache from "node-cache";
import { connectDB, getDB } from "./db/init";
import { escapeRegExp } from "utils/sanitizers";

dotenv.config();

const PORT = process.env.PORT || 3001;
const cache = new NodeCache({ stdTTL: 300, checkperiod: 320 });

async function startServer() {
  await connectDB();

  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get("/hotels", async (req, res) => {
    try {
      const search = req.query.search as string;
      const sanitizedSearch = escapeRegExp(search);

      // Check search in cache
      const cacheKey = `hotels_${sanitizedSearch || "all"}`;
      const cachedData = cache.get(cacheKey);
      if (cachedData) {
        return res.json(cachedData);
      }

      // Query MongoDB if cache miss
      const db = getDB();
      const collection = db.collection("hotels");

      const filter = search
        ? {
            $or: [
              { hotel_name: { $regex: sanitizedSearch, $options: "i" } },
              { country: { $regex: sanitizedSearch, $options: "i" } },
              { city: { $regex: sanitizedSearch, $options: "i" } },
            ],
          }
        : {};

      const hotels = await collection.find(filter).toArray();

      // Store in cache
      cache.set(cacheKey, hotels);

      res.json(hotels);
    } catch (error) {
      console.error("Error fetching hotels:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  app.listen(PORT, () => {
    console.log(`API Server started on port ${PORT}`);
  });
}

startServer().catch(console.error);
