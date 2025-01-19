
let db: Db | null = null;

export const getDbInstance = async (access: "admin" | "readonly"): Promise<Db> => {
  if (!db) {
    db = await connectToDatabase(access);
  }
  return db;
};