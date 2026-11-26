// Tiny IndexedDB wrapper. Everything stays on this device.
const DB_NAME = 'lumi-tahed';
const STORES = ['audio', 'kv'];
let dbPromise;

function open() {
  dbPromise ??= new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      for (const s of STORES) if (!req.result.objectStoreNames.contains(s)) req.result.createObjectStore(s);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return dbPromise;
}

async function run(store, mode, fn) {
  const db = await open();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, mode);
    const req = fn(tx.objectStore(store));
    tx.oncomplete = () => resolve(req?.result);
    tx.onerror = () => reject(tx.error);
  });
}

export const db = {
  get: (store, key) => run(store, 'readonly', (s) => s.get(key)),
  put: (store, value, key) => run(store, 'readwrite', (s) => s.put(value, key)),
  del: (store, key) => run(store, 'readwrite', (s) => s.delete(key)),
};

export async function getSetting(key, fallback) {
  const v = await db.get('kv', key);
  return v === undefined ? fallback : v;
}
export const setSetting = (key, value) => db.put('kv', value, key);
