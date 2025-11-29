import { Client, Databases } from 'appwrite';

// Server-side client for API routes (no session required)
const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || '';
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '';

export const serverClient = new Client()
  .setEndpoint(endpoint)
  .setProject(projectId);

export const serverDatabases = new Databases(serverClient);

export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '';
export const ORDERS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_ORDERS_COLLECTION_ID || 'orders';
