import { getDb as getDbFromConfig } from "@/db/config/mongodb";

// Re-export the getDb function from the main MongoDB config
// This ensures we're using a single connection throughout the application
export async function getDb() {
  return getDbFromConfig();
}
