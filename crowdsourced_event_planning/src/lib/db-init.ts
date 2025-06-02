import { ensureCollections } from "@/db/config/mongodb";

// Initialize database collections
export async function initializeDatabase() {
  try {
    console.log("Initializing database collections...");
    await ensureCollections();
    console.log("Database collections initialized successfully");
    return true;
  } catch (error) {
    console.error("Failed to initialize database collections:", error);
    return false;
  }
}
