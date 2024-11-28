import { Product } from "@/api/products/productModel";
import { User } from "@/api/user/userModel";
import { MongoClient, Db, Collection, WithId } from "mongodb";

const MONGODB_CONNECTION = process.env.MONGODB_CONNECTION;
const MONGO_DB_NAME = process.env.MONGO_DB_NAME;

let client: MongoClient | null = null;
let database: Db | null = null;


export const connectToDatabase = async (): Promise<Db> => {
    if (database) {
        return database; // Return existing database instance
    }

    if (!MONGODB_CONNECTION) {
        throw new Error("MongoDB URI is not defined in environment variables.");
    }

    try {
        client = new MongoClient(MONGODB_CONNECTION);
        await client.connect();
        database = client.db(MONGO_DB_NAME);
        console.log(`Connected to MongoDB: ${MONGO_DB_NAME}`);
        return database;
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw new Error("Failed to connect to MongoDB.");
    }
};



// 1. Define your MongoDB model mappings centrally
type MongoDBModels = {
    Products: Product;
    Users: User;
};

// 2. Generic type for a MongoDB document
type MongoDocument<T> = WithId<Document> & Partial<Record<keyof T, any>>;

// 3. Typed collection getter
export const getCollection = async <K extends keyof MongoDBModels>(
  db: Db,
  collectionName: K
) => {
  return db.collection<MongoDocument<MongoDBModels[K]>>(collectionName);
};


export const closeDatabaseConnection = async (): Promise<void> => {
    if (client) {
        await client.close();
        console.log("MongoDB connection closed.");
        client = null;
        database = null;
    }
};
