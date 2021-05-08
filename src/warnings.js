export function createDb () {
  return {
    nextFreeId: 0,
    warnings: new Map()
  }
}

export function addAll (db, warnings) {
  for (const warning of warnings) {
    add(db, warning)
  }
}

export function add (db, warning) {
  const id = db.nextFreeId
  db.nextFreeId += 1
  db.warnings.set(id, warning)
}

export function getAll (db) {
  const entries = Array.from(db.warnings.entries())
  return entries
    .map(([id, warning]) => ({
      ...warning,
      id
    }))
}

export function get (db, id) {
  const res = db.warnings.get(id)
  if (res) {
    return { ...res, id }
  } else {
    return null
  }
}

export function remove (db, id) {
  db.warnings.delete(id)
}

export function update (db, id, warning) {
  if (db.warnings.has(id)) {
    db.warnings.set(id, warning)
  }
}

export function findMatching (db, url) {
  const warnings = Array.from(db.warnings.values())
  return warnings.filter(warning => url.match(warning.pattern))
}
