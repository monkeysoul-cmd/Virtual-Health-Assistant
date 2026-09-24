/**
 * Persistent File-based JSON Database Driver
 * Provides reliable, synchronized storage for appointments and audit records.
 */

const fs = require('fs');
const path = require('path');
const config = require('./index');

class JsonDatabase {
  constructor(storageDir) {
    this.storageDir = storageDir;
    this.ensureDirectoryExists();
  }

  ensureDirectoryExists() {
    if (!fs.existsSync(this.storageDir)) {
      fs.mkdirSync(this.storageDir, { recursive: true });
    }
  }

  getFilePath(collectionName) {
    return path.join(this.storageDir, `${collectionName}.json`);
  }

  /**
   * Reads all documents in a collection
   * @param {string} collectionName
   * @returns {Array<any>}
   */
  readCollection(collectionName) {
    const filePath = this.getFilePath(collectionName);
    try {
      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify([], null, 2), 'utf8');
        return [];
      }
      const raw = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(raw || '[]');
    } catch (err) {
      console.error(`[DB] Error reading collection "${collectionName}":`, err.message);
      return [];
    }
  }

  /**
   * Writes all documents in a collection
   * @param {string} collectionName
   * @param {Array<any>} data
   * @returns {boolean}
   */
  writeCollection(collectionName, data) {
    const filePath = this.getFilePath(collectionName);
    try {
      const tempPath = `${filePath}.tmp`;
      fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf8');
      fs.renameSync(tempPath, filePath);
      return true;
    } catch (err) {
      console.error(`[DB] Error writing collection "${collectionName}":`, err.message);
      return false;
    }
  }

  /**
   * Finds documents matching a predicate or filter object
   * @param {string} collectionName
   * @param {Function|object} query
   * @returns {Array<any>}
   */
  find(collectionName, query = {}) {
    const items = this.readCollection(collectionName);
    if (typeof query === 'function') {
      return items.filter(query);
    }
    return items.filter(item => {
      return Object.keys(query).every(key => item[key] === query[key]);
    });
  }

  /**
   * Finds a single document by ID or filter
   * @param {string} collectionName
   * @param {string|Function|object} query
   * @returns {any|null}
   */
  findOne(collectionName, query) {
    const items = this.readCollection(collectionName);
    if (typeof query === 'string') {
      return items.find(item => item.id === query) || null;
    }
    if (typeof query === 'function') {
      return items.find(query) || null;
    }
    return items.find(item => {
      return Object.keys(query).every(key => item[key] === query[key]);
    }) || null;
  }

  /**
   * Inserts a document into collection
   * @param {string} collectionName
   * @param {object} doc
   * @returns {object}
   */
  insert(collectionName, doc) {
    const items = this.readCollection(collectionName);
    const newDoc = {
      id: doc.id || `doc_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...doc
    };
    items.push(newDoc);
    this.writeCollection(collectionName, items);
    return newDoc;
  }

  /**
   * Updates an existing document
   * @param {string} collectionName
   * @param {string} id
   * @param {object} updates
   * @returns {object|null}
   */
  update(collectionName, id, updates) {
    const items = this.readCollection(collectionName);
    const idx = items.findIndex(item => item.id === id);
    if (idx === -1) return null;
    
    items[idx] = {
      ...items[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.writeCollection(collectionName, items);
    return items[idx];
  }

  /**
   * Deletes a document by id
   * @param {string} collectionName
   * @param {string} id
   * @returns {boolean}
   */
  delete(collectionName, id) {
    const items = this.readCollection(collectionName);
    const initialLen = items.length;
    const filtered = items.filter(item => item.id !== id);
    if (filtered.length === initialLen) return false;
    this.writeCollection(collectionName, filtered);
    return true;
  }
}

const db = new JsonDatabase(config.storageDir);

module.exports = db;
