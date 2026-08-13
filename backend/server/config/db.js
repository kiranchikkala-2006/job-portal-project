import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async () => {
  if (isConnected && mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error('MONGO_URI environment variable is not configured');
  }

  try {
    const conn = await mongoose.connect(uri);

    isConnected = true;

    console.log(`MongoDB Connected: ${conn.connection.host}`);

    return conn;
  } catch (error) {
    isConnected = false;
    console.error(`MongoDB Connection Error: ${error.message}`);
    throw error;
  }
};