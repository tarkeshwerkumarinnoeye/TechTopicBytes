import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

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
  }
};
