import { 
  collection, 
  query, 
  getDocs,
  where,
  orderBy,
  limit,
  Timestamp 
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export const adminDashboardApi = {
  getDashboardStats: async () => {
    try {
      const postsRef = collection(db, "posts");
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      
      // Get all posts
      const allPostsSnapshot = await getDocs(postsRef);
      const totalPosts = allPostsSnapshot.size;

      // Get posts from this month
      const thisMonthQuery = query(
        postsRef,
        where("createdAt", ">=", Timestamp.fromDate(firstDayOfMonth))
      );
      const thisMonthSnapshot = await getDocs(thisMonthQuery);
      const postsThisMonth = thisMonthSnapshot.size;

      // Calculate total views and find most active category
      let totalViews = 0;
      const categoryCount: { [key: string]: number } = {};

      allPostsSnapshot.forEach(doc => {
        const post = doc.data();
        totalViews += post.views || 0;
        
        if (post.categories) {
          post.categories.forEach((category: string) => {
            categoryCount[category] = (categoryCount[category] || 0) + 1;
          });
        }
      });

      const mostActiveCategory = Object.entries(categoryCount)
        .sort(([, a], [, b]) => b - a)[0]?.[0] || 'None';

      return {
        totalPosts,
        postsThisMonth,
        mostActiveCategory,
        totalViews
      };
    } catch (error) {
      console.error("Error getting dashboard stats:", error);
      throw error;
    }
  },

  getCategoryDistribution: async () => {
    try {
      const postsRef = collection(db, "posts");
      const snapshot = await getDocs(postsRef);
      const categoryCount: { [key: string]: number } = {};

      snapshot.forEach(doc => {
        const post = doc.data();
        if (post.categories) {
          post.categories.forEach((category: string) => {
            categoryCount[category] = (categoryCount[category] || 0) + 1;
          });
        }
      });

      return Object.entries(categoryCount).map(([name, count]) => ({
        name,
        count
      }));
    } catch (error) {
      console.error("Error getting category distribution:", error);
      throw error;
    }
  }
};
