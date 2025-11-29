import { NextRequest, NextResponse } from 'next/server';
import { serverDatabases as databases, DATABASE_ID, ORDERS_COLLECTION_ID } from '@/lib/appwrite-server';
import { Query } from 'appwrite';

const API_TOKEN = process.env.API_TOKEN || 'hsu_sk_1234567890abcdef';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const studentId = params.id;

    // Get all orders for this student
    const orders = await databases.listDocuments(
      DATABASE_ID,
      ORDERS_COLLECTION_ID,
      [
        Query.equal('studentId', studentId),
        Query.limit(1000)
      ]
    );

    if (orders.documents.length === 0) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    // Calculate statistics
    const firstOrder = orders.documents[0];
    let totalSpent = 0;
    let lastOrderDate = orders.documents[0].createdAt;

    orders.documents.forEach((order: any) => {
      totalSpent += order.total;
      if (new Date(order.createdAt) > new Date(lastOrderDate)) {
        lastOrderDate = order.createdAt;
      }
    });

    const studentData = {
      id: studentId,
      name: firstOrder.studentName,
      email: `${studentId}@student.hsu.edu.hk`,
      programme: 'Unknown',
      yearOfEntrance: null,
      lastLogin: lastOrderDate,
      totalOrders: orders.documents.length,
      totalSpent: totalSpent,
      orders: orders.documents.map((order: any) => ({
        orderNumber: order.orderNumber,
        total: order.total,
        status: order.status,
        createdAt: order.createdAt
      }))
    };

    return NextResponse.json(studentData);

  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}
