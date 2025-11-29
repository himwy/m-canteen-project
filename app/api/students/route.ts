import { NextRequest, NextResponse } from 'next/server';
import { serverDatabases as databases, DATABASE_ID, ORDERS_COLLECTION_ID } from '@/lib/appwrite-server';
import { Query } from 'appwrite';

// Secure API token - in production, store this in environment variables
const API_TOKEN = process.env.API_TOKEN || 'hsu_sk_1234567890abcdef';



export async function GET(request: NextRequest) {
  try {
    // Check authorization header
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token || token !== API_TOKEN) {
      return NextResponse.json(
        { error: 'Unauthorized. Invalid or missing API token.' },
        { status: 401 }
      );
    }

    // Get query parameters for pagination
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;

    // Since Appwrite's account.list() requires admin API key on server-side,
    // we'll get users from orders (students who have placed orders)
    // In a real implementation, you'd use Appwrite Server SDK with API key
    
    const orders = await databases.listDocuments(
      DATABASE_ID,
      ORDERS_COLLECTION_ID,
      [Query.limit(1000)] // Get all orders
    );

    // Aggregate student data from orders
    const studentMap = new Map();

    orders.documents.forEach((order: any) => {
      const studentId = order.studentId;
      
      if (!studentMap.has(studentId)) {
        studentMap.set(studentId, {
          id: studentId,
          name: order.studentName,
          email: order.email || `${studentId}@student.hsu.edu.hk`,
          programme: 'Unknown', // We don't store this in orders
          yearOfEntrance: null,
          lastLogin: order.createdAt,
          totalOrders: 1,
          totalSpent: order.total
        });
      } else {
        const student = studentMap.get(studentId);
        student.totalOrders += 1;
        student.totalSpent += order.total;
        
        // Update last login to most recent order
        if (new Date(order.createdAt) > new Date(student.lastLogin)) {
          student.lastLogin = order.createdAt;
        }
      }
    });

    const students = Array.from(studentMap.values());
    
    // Apply pagination
    const paginatedStudents = students.slice(offset, offset + limit);

    return NextResponse.json({
      students: paginatedStudents,
      total: students.length,
      page: page,
      limit: limit,
      totalPages: Math.ceil(students.length / limit)
    });

  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}
