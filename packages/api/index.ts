import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB, getDB } from "./db/init";
import { escapeRegExp } from "utils/sanitizers";

dotenv.config();

const PORT = process.env.PORT || 3001;

async function startServer() {
  await connectDB();

  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get("/hotels", async (req, res) => {
    try {
      const search = req.query.search as string;
      const sanitizedSearch = escapeRegExp(search);
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
