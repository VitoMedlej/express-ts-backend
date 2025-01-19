import { MongoClient, Db, WithId } from "mongodb";
import { Product } from "@/api/products/productModel";
import { User } from "@/api/user/userModel";

type MongoDBModels = {
  Products: Product;
  Users: User;
};

type MongoDocument<T> = WithId<Document> & Partial<Record<keyof T, any>>;

let mongoClient: MongoClient | null = null;

const connectToDatabase = async (): Promise<Db> => {
  if (!mongoClient) {
    const connectionString = process.env.MONGODB_CONNECTION;
    if (!connectionString) {
      throw new Error("MongoDB connection string is missing.");
    }
    
    mongoClient = new MongoClient(connectionString, { maxPoolSize: 100, minPoolSize: 1 });
    await mongoClient.connect();
    console.log("MongoDB connection established.");
  }

  return mongoClient.db(process.env.MONGO_DB_NAME);
};

const getCollection = async <K extends keyof MongoDBModels>(collectionName: K) => {
  const db = await connectToDatabase();
  return db.collection<MongoDocument<MongoDBModels[K]>>(collectionName);
};

export { connectToDatabase, getCollection };
