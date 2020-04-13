export function createDb () {
  return {
    nextFreeId: 0,
    sites: new Map()
  }
}

export function addAll (db, sites) {
  for (const site of sites) {
    add(db, site)
  }
}

export function add (db, site) {
  const id = db.nextFreeId
  db.nextFreeId += 1
  db.sites.set(id, site)
}

export function getAll (db) {
  const entries = Array.from(db.sites.entries())
  return entries
    .map(([id, site]) => ({
      ...site,
      id
    }))
}

export function get (db, id) {
  const site = db.sites.get(id)
  if (site) {
    return {
      ...site,
      id
    }
  } else {
    return null
  }
}

export function remove (db, id) {
  db.sites.delete(id)
}

export function update (db, id, site) {
  if (db.sites.has(id)) {
    db.sites.set(id, site)
  }
}

export function findMatching (db, url) {
  const sites = Array.from(db.sites.values())
  return sites.filter(site => url.match(site.pattern))
}
