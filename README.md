# HSU M Canteen Ordering System

A modern canteen ordering system for HSU students with real-time order management.

**🔗 Prototype Website:** https://m-canteen-project.vercel.app/

## Features

### Student Side

- Browse menu and add items to cart
- Place orders that get assigned a unique order number
- Track order status in real-time (Received → Preparing → Ready → Taken → Completed)
- View order history

### Admin Side (Canteen/Shop)

- View all incoming orders in real-time
- Manage order workflow through different statuses:
  - **Received**: New orders waiting to be prepared
  - **Preparing**: Orders currently being prepared
  - **Ready**: Orders ready for student pickup
  - **Taken (Unpaid)**: Orders taken by students but not yet paid
  - **Completed**: Fully paid and completed orders
- Dashboard with statistics (new orders, preparing, ready, today's total)
- Auto-refresh every 10 seconds for new orders

## Setup Instructions

### 1. Appwrite Configuration

1. **Create an Appwrite project** at [cloud.appwrite.io](https://cloud.appwrite.io)

2. **Enable Email/Password Authentication:**

   - Go to **Auth** section in your Appwrite project
   - Make sure **Email/Password** is enabled under "Auth Methods"

3. **Create a new database**

4. **Create an Orders collection** with the following attributes:

   - `orderNumber` (integer, required)
   - `studentName` (string, required, size: 255)
   - `studentId` (string, required, size: 50)
   - `items` (string, required, size: 10000) - stores JSON
   - `total` (integer, required)
   - `status` (string, required, size: 50)
   - `createdAt` (string, required, size: 50)
   - `updatedAt` (string, size: 50)

5. **Set collection permissions:**
   - Go to the Orders collection **Settings** → **Permissions**
   - Add permission: "All users" (or "Any") with Read, Create, Update, Delete access
   - Or for production: "Users" with appropriate permissions

### 2. Environment Variables

Update `.env.local` with your Appwrite credentials:

\`\`\`env
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your-project-id
NEXT_PUBLIC_APPWRITE_DATABASE_ID=your-database-id
NEXT_PUBLIC_APPWRITE_ORDERS_COLLECTION_ID=your-orders-collection-id
NEXT_PUBLIC_APPWRITE_MENU_COLLECTION_ID=your-menu-collection-id
NEXT_PUBLIC_APPWRITE_DRINKS_COLLECTION_ID=your-drinks-collection-id

# API Security - Change this to a secure random token
API_TOKEN=your-secure-api-token-here
\`\`\`

**Note:** The `API_TOKEN` is used to protect the student data API endpoint. Generate a secure random token and share it only with authorized HSU personnel.

### 3. Install & Run

\`\`\`bash
npm install
npm run dev
\`\`\`

## Order Status Flow

1. **Received** - Student places order → Order appears in admin's "New Orders"
2. **Preparing** - Admin clicks "Start Preparing" → Moves to "Preparing" section
3. **Ready** - Admin clicks "Mark as Ready" → Student sees "Order Ready" notification
4. **Taken (Unpaid)** - Admin clicks "Taken (Unpaid)" when student collects order
5. **Completed** - Admin clicks "Mark as Paid" after payment is received

## Authentication Flow

### Student Registration & Login

1. Students register with:

   - Full name
   - Email
   - Student ID
   - Programme
   - Year of entrance
   - Password (min 8 characters)

2. Student info is stored in Appwrite Auth with preferences
3. After login, students are redirected to `/menu`
4. Students can logout from the menu page

### Order Creation

- Orders automatically use the logged-in user's name and student ID
- Student ID is stored in user preferences and linked to orders

## Pages

- `/` - Landing page
- `/register` - Student registration
- `/login` - Student login
- `/menu` - Browse menu and add to cart (requires login)
- `/cart` - Review cart and place order (requires login)
- `/orders` - Student order history and tracking (requires login)
- `/admin/login` - Admin login
- `/admin/dashboard` - Order management dashboard

## Tech Stack

- Next.js 15
- Appwrite (Backend as a Service)
- Tailwind CSS
- TypeScript
