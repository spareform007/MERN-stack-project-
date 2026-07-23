import dns from 'node:dns/promises';
dns.setServers(['8.8.8.8', '1.1.1.1']);


import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoMemoryServer = null;

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (mongoUri) {
      console.log(`[MongoDB Engine] Connecting to MongoDB Atlas Cluster...`);
      const conn = await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 8000
      });
      console.log(`====================================================`);
      console.log(` [MongoDB Atlas Connected Successfully]`);
      console.log(` Database Host: ${conn.connection.host}`);
      console.log(` Database Name: ${conn.connection.name}`);
      console.log(`====================================================`);
    } else {
      console.log('[MongoDB Notice] MONGO_URI not found. Initializing in-memory MongoDB server...');
      mongoMemoryServer = await MongoMemoryServer.create();
      const uri = mongoMemoryServer.getUri();
      const conn = await mongoose.connect(uri);
      console.log(`[In-Memory MongoDB Connected] Listening at: ${uri}`);
    }
  } catch (error) {
    console.error(`\n⚠️ [MongoDB Atlas Connection Failed]: ${error.message}`);
    console.error(`💡 Note: If connecting to MongoDB Atlas, please ensure your IP address is whitelisted (0.0.0.0/0) in MongoDB Atlas -> Network Access.\n`);

    if (!mongoMemoryServer) {
      try {
        console.log('[MongoDB Fallback] Falling back to In-Memory MongoDB Server for uninterrupted local testing...');
        mongoMemoryServer = await MongoMemoryServer.create();
        const uri = mongoMemoryServer.getUri();
        await mongoose.connect(uri);
        console.log('[In-Memory MongoDB Connected via Fallback]');
      } catch (fallbackErr) {
        console.error(`[MongoDB Fallback Failed] ${fallbackErr.message}`);
        process.exit(1);
      }
    }
  }
};
