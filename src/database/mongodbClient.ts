import { Product } from "@/api/products/productModel";
import { User } from "@/api/user/userModel";
import { MongoClient, Db, WithId } from "mongodb";


let client: MongoClient | null = null;
let database: Db | null = null;



let adminClient: MongoClient | null = null;
let readOnlyClient: MongoClient | null = null;

export const connectToDatabase = async (access: "admin" | "readonly"): Promise<Db> => {
  const MONGODB_CONNECTION = process.env.MONGODB_CONNECTION;
  const MONGODB_CONNECTION_READONLY = process.env.MONGODB_CONNECTION_READONLY;
  const MONGO_DB_NAME = process.env.MONGO_DB_NAME;
  const connectionString =
  access === "admin" ? MONGODB_CONNECTION : MONGODB_CONNECTION_READONLY;
  console.log('MONGODB_CONNECTION_READONLY: ', MONGODB_CONNECTION_READONLY);
  console.log('MONGODB_CONNECTION: ', MONGODB_CONNECTION);
  
  console.log('connectionString: ', connectionString);
  if (!connectionString) {
    throw new Error("MongoDB connection string is missing.");
  }

  const client = access === "admin" ? adminClient : readOnlyClient;

  if (client) {
    return client.db(MONGO_DB_NAME);
  }

  const newClient = new MongoClient(connectionString);
  await newClient.connect();

  if (access === "admin") {
    adminClient = newClient;
  } else {
    readOnlyClient = newClient;
  }

  return newClient.db(MONGO_DB_NAME);
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
