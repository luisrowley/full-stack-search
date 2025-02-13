import { describe, it, expect, beforeEach, vi, afterEach, Mock } from "vitest";
import NodeCache from "node-cache";
import { fetchHotels } from "./hotelService";
import { getDB } from "../db/init";

vi.mock("node-cache", () => {
  const cacheStore = new Map<string, any>();
  return {
    default: vi.fn().mockImplementation(() => ({
      get: vi.fn((key) => cacheStore.get(key)),
      set: vi.fn((key, value) => cacheStore.set(key, value)),
      flushAll: vi.fn(() => cacheStore.clear()),
    })),
  };
});

vi.mock("../db/init", () => ({
  getDB: vi.fn(),
}));

describe("hotelService", () => {
  let mockCollectionFind: Mock;
  let mockDb: any;
  let cache: any;

  beforeEach(() => {
    cache = new NodeCache();
    
    mockCollectionFind = vi.fn();
    mockDb = {
      collection: vi.fn(() => ({
        find: mockCollectionFind,
      })),
    };

    (getDB as Mock).mockReturnValue(mockDb);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    cache.flushAll();
  });

  it("should return cached results if available", async () => {
    const mockHotels = [{ hotel_name: "Hotel A", city: "City A" }];
    cache.set("hotels_test", mockHotels);

    const result = await fetchHotels("test");

    expect(result).toEqual(mockHotels);
    expect(getDB).not.toHaveBeenCalled();
  });
});
