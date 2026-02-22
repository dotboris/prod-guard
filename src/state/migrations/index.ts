import { type CURRENT_DATA_VERSION } from "../../schema";
import { applyMigrations } from "./apply-migrations";
import { migrations } from "./migrations";
import { type StateVersions } from "./state-versions";

export function migrateStorageData(
  storageData: unknown,
): [boolean, StateVersions[typeof CURRENT_DATA_VERSION]] {
  return applyMigrations(migrations, storageData);
}
