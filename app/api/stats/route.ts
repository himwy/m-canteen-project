import { NextRequest, NextResponse } from 'next/server';
import { serverDatabases as databases, DATABASE_ID, ORDERS_COLLECTION_ID } from '@/lib/appwrite-server';
import { Query } from 'appwrite';

const API_TOKEN = process.env.API_TOKEN || 'hsu_sk_1234567890abcdef';

export async function GET(request: NextRequest) {
  try {
    // Check authorization
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token || token !== API_TOKEN) {
      return NextResponse.json(
        { error: 'Unauthorized. Invalid or missing API token.' },
        { status: 401 }
      );
    }

    // Get all orders
    const orders = await databases.listDocuments(
      DATABASE_ID,
      ORDERS_COLLECTION_ID,
      [Query.limit(2000)]
    );

    // Calculate statistics
    const uniqueStudents = new Set();
    const ordersByStatus: any = {
      received: 0,
      preparing: 0,
      ready: 0,
      'taken-unpaid': 0,
      completed: 0
    };
    let totalRevenue = 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const thisWeek = new Date();
    thisWeek.setDate(thisWeek.getDate() - 7);

    let ordersToday = 0;
    let ordersThisWeek = 0;

    orders.documents.forEach((order: any) => {
      uniqueStudents.add(order.studentId);
      ordersByStatus[order.status] = (ordersByStatus[order.status] || 0) + 1;
      
      if (order.status === 'completed') {
        totalRevenue += order.total;
      }

      const orderDate = new Date(order.createdAt);
      if (orderDate >= today) {
        ordersToday++;
      }
      if (orderDate >= thisWeek) {
        ordersThisWeek++;
      }
    });

    const stats = {
      totalStudents: uniqueStudents.size,
      totalOrders: orders.documents.length,
      totalRevenue: totalRevenue,
      ordersToday: ordersToday,
      ordersThisWeek: ordersThisWeek,
      ordersByStatus: ordersByStatus,
      averageOrderValue: orders.documents.length > 0 
        ? Math.round(totalRevenue / orders.documents.length) 
        : 0
    };

    return NextResponse.json(stats);

  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}
