import mongoose from 'mongoose';

const srvUri = "mongodb+srv://23UCS028:23UCS028@cluster0.bha2nhq.mongodb.net/mae_beauty?retryWrites=true&w=majority&appName=Cluster0";
const directUri = "mongodb://23UCS028:23UCS028@ac-a80fao7-shard-00-00.bha2nhq.mongodb.net:27017,ac-a80fao7-shard-00-01.bha2nhq.mongodb.net:27017,ac-a80fao7-shard-00-02.bha2nhq.mongodb.net:27017/mae_beauty?ssl=true&replicaSet=atlas-jgb99e-shard-0&authSource=admin&retryWrites=true&w=majority";

console.log("Attempting direct MongoDB Atlas connection...");

mongoose.connect(directUri, { serverSelectionTimeoutMS: 5000 })
  .then((conn) => {
    console.log("DIRECT CONNECTION SUCCESS! Host:", conn.connection.host);
    process.exit(0);
  })
  .catch((err) => {
    console.error("DIRECT CONNECTION FAILED:", err.message);
    process.exit(1);
  });
