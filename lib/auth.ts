import { account } from './appwrite';
import { ID } from 'appwrite';

export interface User {
  $id: string;
  email: string;
  name: string;
  labels: string[];
  prefs: {
    studentId?: string;
    programme?: string;
    yearOfEntrance?: string;
  };
}

// Register a new student
export async function registerStudent(data: {
  email: string;
  password: string;
  name: string;
  studentId: string;
  programme: string;
  yearOfEntrance: string;
}) {
  try {
    // Create account
    const user = await account.create(
      ID.unique(),
      data.email,
      data.password,
      data.name
    );

    // Log in the user
    await account.createEmailPasswordSession(data.email, data.password);

    // Update user preferences with student info
    await account.updatePrefs({
      studentId: data.studentId,
      programme: data.programme,
      yearOfEntrance: data.yearOfEntrance,
    });

    return user;
  } catch (error) {
    console.error('Error registering:', error);
    throw error;
  }
}

// Login
export async function login(email: string, password: string) {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
}

// Logout
export async function logout() {
  try {
    await account.deleteSession('current');
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
}

// Get current user
export async function getCurrentUser(): Promise<User | null> {
  try {
    const user = await account.get();
    return user as User;
  } catch (error) {
    return null;
  }
}

// Check if user is authenticated
export async function isAuthenticated(): Promise<boolean> {
  try {
    await account.get();
    return true;
  } catch (error) {
    return false;
  }
}

// Check if user is admin
export async function isAdmin(): Promise<boolean> {
  try {
    const user = await account.get() as User;
    console.log('User data:', user);
    console.log('User labels:', user.labels);
    console.log('Is admin?', user.labels?.includes('admin'));
    return user.labels?.includes('admin') || false;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}
