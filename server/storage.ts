// This is a client-side only application using localStorage
// No server-side storage is needed as all data is managed on the frontend

export interface IStorage {
  // Placeholder interface - all data operations happen in the frontend
}

export class MemStorage implements IStorage {
  constructor() {
    // No server-side data storage needed
  }
}

export const storage = new MemStorage();
