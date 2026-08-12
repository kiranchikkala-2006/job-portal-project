import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoMemoryServer = null;

export const connectDB = async () => {
  try {
    let uri = process.env.MONGO_URI;

    if (!uri || uri.trim() === '') {
      console.log('No MONGO_URI provided. Starting in-memory MongoDB server...');
      mongoMemoryServer = await MongoMemoryServer.create();
      uri = mongoMemoryServer.getUri();
      console.log(`In-memory MongoDB started at: ${uri}`);
    }

    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    // If external URI fails, try fallback memory server
    if (!mongoMemoryServer) {
      try {
        console.log('Attempting fallback to in-memory MongoDB server...');
        mongoMemoryServer = await MongoMemoryServer.create();
        const fallbackUri = mongoMemoryServer.getUri();
        const conn = await mongoose.connect(fallbackUri);
        console.log(`Fallback MongoDB Connected: ${conn.connection.host}`);
        return conn;
      } catch (fallbackErr) {
        console.error('Fallback MongoDB failed:', fallbackErr.message);
        process.exit(1);
      }
    } else {
      process.exit(1);
    }
  }
};
