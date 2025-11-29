import { databases, DATABASE_ID } from './appwrite';
import { ID, Query } from 'appwrite';

const MENU_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_MENU_COLLECTION_ID || 'menuItems';
const DRINKS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_DRINKS_COLLECTION_ID || 'drinks';

export interface MenuItem {
  $id?: string;
  name: string;
  price: number;
  image: string;
  category: string;
  calories?: number;
  hasDiscountedDrinks: boolean;
  available: boolean;
  createdAt?: string;
}

export interface Drink {
  $id?: string;
  name: string;
  originalPrice: number;
  discountedPrice: number;
  image: string;
  available: boolean;
  createdAt?: string;
}

// Menu Items
export async function createMenuItem(item: MenuItem) {
  try {
    const doc = await databases.createDocument(
      DATABASE_ID,
      MENU_COLLECTION_ID,
      ID.unique(),
      {
        name: item.name,
        price: item.price,
        image: item.image,
        category: item.category,
        calories: item.calories || 0,
        hasDiscountedDrinks: item.hasDiscountedDrinks,
        available: item.available,
        createdAt: new Date().toISOString(),
      }
    );
    return doc;
  } catch (error) {
    console.error('Error creating menu item:', error);
    throw error;
  }
}

export async function getMenuItems() {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      MENU_COLLECTION_ID,
      [Query.orderDesc('createdAt'), Query.limit(100)]
    );
    return response.documents as unknown as MenuItem[];
  } catch (error) {
    console.error('Error getting menu items:', error);
    throw error;
  }
}

export async function getAvailableMenuItems() {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      MENU_COLLECTION_ID,
      [Query.equal('available', true), Query.orderDesc('createdAt')]
    );
    return response.documents as unknown as MenuItem[];
  } catch (error) {
    console.error('Error getting available menu items:', error);
    throw error;
  }
}

export async function updateMenuItem(id: string, updates: Partial<MenuItem>) {
  try {
    const doc = await databases.updateDocument(
      DATABASE_ID,
      MENU_COLLECTION_ID,
      id,
      updates
    );
    return doc;
  } catch (error) {
    console.error('Error updating menu item:', error);
    throw error;
  }
}

export async function deleteMenuItem(id: string) {
  try {
    await databases.deleteDocument(DATABASE_ID, MENU_COLLECTION_ID, id);
  } catch (error) {
    console.error('Error deleting menu item:', error);
    throw error;
  }
}

// Drinks
export async function createDrink(drink: Drink) {
  try {
    const doc = await databases.createDocument(
      DATABASE_ID,
      DRINKS_COLLECTION_ID,
      ID.unique(),
      {
        name: drink.name,
        originalPrice: drink.originalPrice,
        discountedPrice: drink.discountedPrice,
        image: drink.image,
        available: drink.available,
        createdAt: new Date().toISOString(),
      }
    );
    return doc;
  } catch (error) {
    console.error('Error creating drink:', error);
    throw error;
  }
}

export async function getDrinks() {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      DRINKS_COLLECTION_ID,
      [Query.orderDesc('createdAt'), Query.limit(100)]
    );
    return response.documents as unknown as Drink[];
  } catch (error) {
    console.error('Error getting drinks:', error);
    throw error;
  }
}

export async function getAvailableDrinks() {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      DRINKS_COLLECTION_ID,
      [Query.equal('available', true), Query.orderDesc('createdAt')]
    );
    return response.documents as unknown as Drink[];
  } catch (error) {
    console.error('Error getting available drinks:', error);
    throw error;
  }
}

export async function updateDrink(id: string, updates: Partial<Drink>) {
  try {
    const doc = await databases.updateDocument(
      DATABASE_ID,
      DRINKS_COLLECTION_ID,
      id,
      updates
    );
    return doc;
  } catch (error) {
    console.error('Error updating drink:', error);
    throw error;
  }
}

export async function deleteDrink(id: string) {
  try {
    await databases.deleteDocument(DATABASE_ID, DRINKS_COLLECTION_ID, id);
  } catch (error) {
    console.error('Error deleting drink:', error);
    throw error;
  }
}
