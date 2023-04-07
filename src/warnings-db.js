import { v4 as uuidV4 } from 'uuid'

export function createDb() {
  return {
    warnings: new Map(),
  }
}

export function importAll(db, warnings) {
  for (const { id, ...warning } of warnings) {
    db.warnings.set(id, warning)
  }
}

export function add(db, warning) {
  db.warnings.set(uniqueWarningId(db), warning)
}

function uniqueWarningId(db) {
  let candidate
  do {
    candidate = uuidV4()
  } while (db.warnings.has(candidate))

  return candidate
}

export function getAll(db) {
  const entries = Array.from(db.warnings.entries())
  return entries.map(([id, warning]) => ({
    ...warning,
    id,
  }))
}

export function get(db, id) {
  const res = db.warnings.get(id)
  if (res) {
    return { ...res, id }
  } else {
    return null
  }
}

export function remove(db, id) {
  db.warnings.delete(id)
}

export function update(db, id, warning) {
  if (db.warnings.has(id)) {
    db.warnings.set(id, warning)
  }
}

export function findMatching(db, url) {
  const warnings = Array.from(db.warnings.values())
  return warnings.filter((warning) => url.match(warning.pattern))
}
