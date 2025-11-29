import { databases, DATABASE_ID, ORDERS_COLLECTION_ID } from './appwrite';
import { ID, Query } from 'appwrite';

export type OrderStatus = 'received' | 'preparing' | 'ready' | 'taken-unpaid' | 'completed';

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  $id?: string;
  orderNumber: number;
  studentName: string;
  studentId: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt?: string;
}

// Create a new order
export async function createOrder(orderData: Omit<Order, '$id' | 'orderNumber' | 'createdAt'>) {
  try {
    // Generate order number (you might want to use a counter in the database)
    const orderNumber = Math.floor(Math.random() * 9000) + 1000;
    
    const order = await databases.createDocument(
      DATABASE_ID,
      ORDERS_COLLECTION_ID,
      ID.unique(),
      {
        orderNumber,
        studentName: orderData.studentName,
        studentId: orderData.studentId,
        items: JSON.stringify(orderData.items),
        total: orderData.total,
        status: 'received',
        createdAt: new Date().toISOString(),
      }
    );
    
    return order;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

// Get all orders (for admin)
export async function getAllOrders() {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      ORDERS_COLLECTION_ID,
      [Query.orderDesc('createdAt')]
    );
    
    return response.documents.map(doc => ({
      ...doc,
      items: JSON.parse(doc.items as string),
    })) as unknown as Order[];
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
}

// Get orders by status
export async function getOrdersByStatus(status: OrderStatus) {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      ORDERS_COLLECTION_ID,
      [
        Query.equal('status', status),
        Query.orderDesc('createdAt')
      ]
    );
    
    return response.documents.map(doc => ({
      ...doc,
      items: JSON.parse(doc.items as string),
    })) as unknown as Order[];
  } catch (error) {
    console.error('Error fetching orders by status:', error);
    throw error;
  }
}

// Get orders by student ID
export async function getOrdersByStudent(studentId: string) {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      ORDERS_COLLECTION_ID,
      [
        Query.equal('studentId', studentId),
        Query.orderDesc('createdAt')
      ]
    );
    
    return response.documents.map(doc => ({
      ...doc,
      items: JSON.parse(doc.items as string),
    })) as unknown as Order[];
  } catch (error) {
    console.error('Error fetching student orders:', error);
    throw error;
  }
}

// Update order status
export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  try {
    const order = await databases.updateDocument(
      DATABASE_ID,
      ORDERS_COLLECTION_ID,
      orderId,
      {
        status,
        updatedAt: new Date().toISOString(),
      }
    );
    
    return {
      ...order,
      items: JSON.parse(order.items as string),
    } as unknown as Order;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
}

// Get order by ID
export async function getOrderById(orderId: string) {
  try {
    const order = await databases.getDocument(
      DATABASE_ID,
      ORDERS_COLLECTION_ID,
      orderId
    );
    
    return {
      ...order,
      items: JSON.parse(order.items as string),
    } as unknown as Order;
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
}
