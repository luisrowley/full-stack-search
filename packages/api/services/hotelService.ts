import NodeCache from "node-cache";
import { getDB } from "../db/init";
import { escapeRegExp } from "../utils/sanitizers";

const cache = new NodeCache({ stdTTL: 300, checkperiod: 320 });

/**
 * Fetch hotels with caching.
 * @param search Search query string.
 * @returns List of hotels.
 */
export async function fetchHotels(search: string) {
  const sanitizedSearch = escapeRegExp(search);
  const cacheKey = `hotels_${sanitizedSearch || "all"}`;

  // Check if search is in cache
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  // If not in cache, query database
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

  // Store in cache before returning
  cache.set(cacheKey, hotels);

  return hotels;
}
