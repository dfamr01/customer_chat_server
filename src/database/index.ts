class DB {
  private db: Map<any, any>;
  constructor() {
    this.db = new Map();
  }

  getDB() {
    return this.db;
  }

  set(key, value) {
    this.db.set(key, value);
  }

  get(key) {
    return this.db.get(key);
  }

  delete(key) {
    this.db.delete(key);
  }

  has(key) {
    return this.db.has(key);
  }
}

export const db = new DB();
