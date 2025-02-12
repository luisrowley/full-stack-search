import { vi, expect, test, beforeEach, afterEach, describe } from 'vitest';
import { MongoClient } from 'mongodb';
import { connectDB } from './db/init';

// Mocks for MongoDB client and memory server
vi.mock('mongodb', () => ({
  MongoClient: vi.fn().mockImplementation(() => ({
    connect: vi.fn(),
    db: vi.fn().mockReturnValue({
      collection: vi.fn().mockReturnValue({
        insertMany: vi.fn(),
        find: vi.fn().mockReturnValue({ toArray: vi.fn().mockResolvedValue([]) }),
      }),
    }),
    close: vi.fn(),
  })),
}));

vi.mock('mongodb-memory-server', () => {
  const mockStart = vi.fn();
  const mockGetUri = vi.fn().mockReturnValue('mongodb://localhost:3003');
  const mockStop = vi.fn();

  return {
    MongoMemoryServer: vi.fn().mockImplementation(() => ({
      start: mockStart,
      getUri: mockGetUri,
      stop: mockStop,
    })),
  };
});

// Reset mocks before each test
beforeEach(() => {
  vi.clearAllMocks();
});

// Test for `connectDB`
describe('connectDB', () => {
  test('should connect to database when DATABASE_URL is set', async () => {
    process.env.DATABASE_URL = 'mongodb://localhost:3003';

    const client = await connectDB();
    
    expect(MongoClient).toHaveBeenCalledWith('mongodb://localhost:3003');
    expect(client.connect).toHaveBeenCalled();
  });
});