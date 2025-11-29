# Appwrite Setup Guide

## Step-by-Step Instructions

### 1. Create Appwrite Project
1. Go to [https://cloud.appwrite.io](https://cloud.appwrite.io)
2. Sign up or log in
3. Click **"Create Project"**
4. Give it a name: "HSU M Canteen"
5. Copy your **Project ID**

### 2. Enable Authentication
1. In your project, click **"Auth"** in the left sidebar
2. Under **"Auth Methods"**, make sure **"Email/Password"** is **enabled** (toggle should be ON)
3. You can disable other methods if you want

### 3. Create Database
1. Click **"Databases"** in the left sidebar
2. Click **"Create Database"**
3. Name it: "canteen"
4. Copy your **Database ID**

### 4. Create Orders Collection
1. Inside your database, click **"Create Collection"**
2. Name it: "orders"
3. Copy your **Collection ID**
4. Click on the collection to open it

### 5. Add Attributes to Orders Collection
Click **"Attributes"** tab, then add these one by one:

| Attribute Name | Type    | Size  | Required | Default |
|---------------|---------|-------|----------|---------|
| orderNumber   | Integer | -     | Yes      | -       |
| studentName   | String  | 255   | Yes      | -       |
| studentId     | String  | 50    | Yes      | -       |
| items         | String  | 10000 | Yes      | -       |
| total         | Integer | -     | Yes      | -       |
| status        | String  | 50    | Yes      | -       |
| createdAt     | String  | 50    | Yes      | -       |
| updatedAt     | String  | 50    | No       | -       |

**For each attribute:**
- Click **"Create Attribute"**
- Choose the type
- Enter the attribute key (name)
- Set size (for strings)
- Check "Required" if needed
- Click **"Create"**

### 6. Set Collection Permissions
1. Click **"Settings"** tab in your Orders collection
2. Scroll to **"Permissions"**
3. Click **"Add Permission"**
4. Select **"All users"** (or "Any" for development)
5. Check: **Create**, **Read**, **Update**, **Delete**
6. Click **"Add"**

### 7. Get Your Endpoint
1. Click **"Settings"** in the left sidebar (project settings)
2. Copy your **API Endpoint** (usually `https://cloud.appwrite.io/v1`)

### 8. Update Your .env.local File
Open `.env.local` and update with your IDs:

```env
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your-project-id-here
NEXT_PUBLIC_APPWRITE_DATABASE_ID=your-database-id-here
NEXT_PUBLIC_APPWRITE_ORDERS_COLLECTION_ID=your-orders-collection-id-here
NEXT_PUBLIC_APPWRITE_MENU_COLLECTION_ID=your-menu-collection-id-here
```

**Note:** The menu collection ID is not used yet, you can leave it blank or use the same as orders for now.

### 9. Test Your Setup
1. Run `npm run dev`
2. Go to `http://localhost:3000`
3. Click **"Register as Student"**
4. Fill in the form and create an account
5. You should be redirected to `/menu` after successful registration
6. Try adding items and placing an order
7. Check your Appwrite dashboard → Databases → orders collection to see the order!

## Common Issues

### "User (role: guests) missing scope (account)"
- Make sure you're logged in
- Clear browser cookies and try again
- Check that Email/Password auth is enabled

### "Document with the requested ID could not be found"
- Make sure your database ID and collection ID are correct in `.env.local`
- Restart your dev server after changing `.env.local`

### "Unauthorized permissions"
- Check collection permissions (should allow "All users" for Create, Read, Update)
- Make sure you've saved the permission changes

### Orders not appearing
- Check Appwrite console → Databases → orders collection → Documents
- Check browser console for errors
- Verify all environment variables are set correctly

## Ready to Go!
Once you complete these steps, your authentication and ordering system will be fully functional! 🎉
