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
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get all orders
    const orders = await databases.listDocuments(
      DATABASE_ID,
      ORDERS_COLLECTION_ID,
      [Query.limit(2000)]
    );

    // Group by student to get usage statistics
    const studentMap = new Map();

    orders.documents.forEach((order: any) => {
      if (!studentMap.has(order.studentId)) {
        studentMap.set(order.studentId, {
          studentId: order.studentId,
          name: order.studentName,
          lastLogin: order.createdAt,
          totalOrders: 1
        });
      } else {
        const student = studentMap.get(order.studentId);
        student.totalOrders += 1;
        // Update to most recent order date
        if (new Date(order.createdAt) > new Date(student.lastLogin)) {
          student.lastLogin = order.createdAt;
        }
      }
    });

    return NextResponse.json({
      students: Array.from(studentMap.values())
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}
