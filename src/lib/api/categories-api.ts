import { db } from "@/lib/firebase";
import { collection, getDocs, doc, updateDoc, increment, getDoc } from "firebase/firestore";

export interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  postCount?: number;
}

export const categoriesApi = {
  getCategories: async (): Promise<Category[]> => {
    try {
      const categoriesRef = collection(db, "categories");
      const snapshot = await getDocs(categoriesRef);
      const categories = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Category));
      return categories;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  },

  incrementPostCount: async (categoryId: string): Promise<void> => {
    try {
      const categoryRef = doc(db, "categories", categoryId);
      await updateDoc(categoryRef, {
        postCount: increment(1)
      });
    } catch (error) {
      console.error(`Error incrementing post count for category ${categoryId}:`, error);
      throw error;
    }
  },

  decrementPostCount: async (categoryId: string): Promise<void> => {
    try {
      // First get the current count to prevent negative values
      const categoryRef = doc(db, "categories", categoryId);
      const categoryDoc = await getDoc(categoryRef);
      const currentCount = categoryDoc.data()?.postCount || 0;

      // Only decrement if count is greater than 0
      if (currentCount > 0) {
        await updateDoc(categoryRef, {
          postCount: increment(-1)
        });
      }
    } catch (error) {
      console.error(`Error decrementing post count for category ${categoryId}:`, error);
      throw error;
    }
  },

  // Helper function to get category ID by name
  getCategoryIdByName: async (categoryName: string): Promise<string | null> => {
    try {
      const categoriesRef = collection(db, "categories");
      const snapshot = await getDocs(categoriesRef);
      const category = snapshot.docs.find(doc => doc.data().name === categoryName);
      return category ? category.id : null;
    } catch (error) {
      console.error(`Error finding category ID for name ${categoryName}:`, error);
      throw error;
    }
  }
};
