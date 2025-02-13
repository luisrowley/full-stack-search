import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./db/init";
import { fetchHotels } from "services/hotelService";

dotenv.config();

const PORT = process.env.PORT || 3001;

async function startServer() {
  await connectDB();

  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get("/hotels", async (req, res) => {
    try {
      const search = (req.query.search as string) || "";
      const hotels = await fetchHotels(search);
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
