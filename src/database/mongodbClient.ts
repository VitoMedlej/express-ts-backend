import { MongoClient, Db, WithId } from "mongodb";
import { Product } from "@/api/products/productModel";
import { User } from "@/api/user/userModel";
import { Admin } from "@/api/dashboard/dashboardModel";
import { OrderData } from "@/common/models/orderModel";

type MongoDBModels = {
  Products: Product;
  Users: User;
  Admins : Admin;
  Orders: OrderData;
};

type MongoDocument<T> = WithId<Document> & Partial<Record<keyof T, any>>;



// Singleton for MongoDB client and database connection
let mongoClient: MongoClient | null = null;
let db: Db | null = null;

const connectToDatabase = async (): Promise<Db> => {
  if (!mongoClient) {
    const connectionString = process.env.MONGODB_CONNECTION;
    if (!connectionString) {
      throw new Error("MongoDB connection string is missing.");
    }
    console.time('DB-start')
    mongoClient = new MongoClient(connectionString, { maxPoolSize: 100, minPoolSize: 1 });
    await mongoClient.connect();
    db = mongoClient.db(process.env.MONGO_DB_NAME);
    console.timeEnd('DB-start')
    console.log("MongoDB connection established.");
    
  }

  return db!;
};

const getCollection = <K extends keyof MongoDBModels>(collectionName: K) => {
  if (!db) {
    throw new Error("Database not connected. Ensure that connectToDatabase is called.");
  }
  return db.collection<MongoDocument<MongoDBModels[K]>>(collectionName);
};

// Exporting functions to use the database connection and collections
export { connectToDatabase, getCollection };

