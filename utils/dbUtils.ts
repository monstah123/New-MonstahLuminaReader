import { BookInfo, StoredBook, StoredTrack } from '../types';

const DB_NAME = 'MonstahLuminaReaderDB';
const DB_VERSION = 1;
const STORE_BOOKS = 'books';
const STORE_TRACKS = 'tracks';

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_BOOKS)) {
        db.createObjectStore(STORE_BOOKS, { keyPath: 'info.title' });
      }
      if (!db.objectStoreNames.contains(STORE_TRACKS)) {
        db.createObjectStore(STORE_TRACKS, { keyPath: ['bookTitle', 'trackName'] });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const saveBookToLibrary = async (book: BookInfo, coverImage: string | null) => {
  const db = await openDB();
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_BOOKS, 'readwrite');
    const store = tx.objectStore(STORE_BOOKS);
    
    const storedBook: StoredBook = {
      info: book,
      coverImage,
      lastAccessed: Date.now()
    };
    
    store.put(storedBook);
    
    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
  });
};

export const getLibraryBooks = async (): Promise<StoredBook[]> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_BOOKS, 'readonly');
    const store = tx.objectStore(STORE_BOOKS);
    const request = store.getAll();
    
    request.onsuccess = () => {
      const books = request.result as StoredBook[];
      books.sort((a, b) => b.lastAccessed - a.lastAccessed);
      resolve(books);
    };
    request.onerror = () => reject(request.error);
    
    tx.oncomplete = () => db.close();
  });
};

export const saveTrackToLibrary = async (track: StoredTrack) => {
  const db = await openDB();
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_TRACKS, 'readwrite');
    const store = tx.objectStore(STORE_TRACKS);
    store.put(track);
    
    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
  });
};

export const getTrackFromLibrary = async (bookTitle: string, trackName: string): Promise<StoredTrack | undefined> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_TRACKS, 'readonly');
    const store = tx.objectStore(STORE_TRACKS);
    const request = store.get([bookTitle, trackName]);
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    
    tx.oncomplete = () => db.close();
  });
};

export const clearLibrary = async () => {
  // Aggressive approach: Delete the entire database file
  return new Promise<void>((resolve, reject) => {
    const request = indexedDB.deleteDatabase(DB_NAME);
    
    request.onsuccess = () => {
      console.log("Database deleted successfully");
      resolve();
    };
    
    request.onerror = () => {
      console.error("Error deleting database", request.error);
      reject(request.error);
    };
    
    request.onblocked = () => {
      console.warn("Database delete blocked - likely another tab is open");
      // We can't force close other tabs, but this warning helps debug
    };
  });
};