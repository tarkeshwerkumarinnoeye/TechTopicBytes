import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  orderBy, 
  limit,
  startAfter,
  getDoc,
  serverTimestamp
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Post } from "@/types/Post";
import { categoriesApi } from "../categories-api";

export const adminPostsApi = {
  createPost: async (postData: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (!postData.userId) {
        throw new Error('User ID is required to create a post');
      }

      const postsRef = collection(db, 'posts');
      const newPostRef = await addDoc(postsRef, {
        ...postData,
        views: 0,
        likes: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        categories: postData.categories || [],
        tags: postData.tags || []
      });

      return newPostRef.id;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  },

  updatePost: async (postId: string, postData: Partial<Post>) => {
    try {
      const postRef = doc(db, 'posts', postId);
      const currentPost = await getDoc(postRef);
      
      if (!currentPost.exists()) {
        throw new Error('Post not found');
      }

      const updateData = {
        title: postData.title,
        content: postData.content,
        categories: postData.categories || [],
        tags: postData.tags || [],
        published: postData.published,
        userId: postData.userId,
        updatedAt: serverTimestamp()
      };

      await updateDoc(postRef, updateData);
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  },

  getPost: async (postId: string): Promise<Post> => {
    try {
      const postRef = doc(db, 'posts', postId);
      const postDoc = await getDoc(postRef);
      
      if (!postDoc.exists()) {
        throw new Error('Post not found');
      }

      return {
        id: postDoc.id,
        ...postDoc.data()
      } as Post;
    } catch (error) {
      console.error('Error fetching post:', error);
      throw error;
    }
  },

  deletePost: async (postId: string) => {
    try {
      // First get the post to get its categories
      const postRef = doc(db, 'posts', postId);
      const postDoc = await getDoc(postRef);
      
      if (!postDoc.exists()) {
        throw new Error('Post not found');
      }

      const post = postDoc.data();
      const categories = post.categories || [];

      // Delete the post
      await deleteDoc(postRef);

      // Decrement category counts
      for (const categoryName of categories) {
        try {
          const categoryId = await categoriesApi.getCategoryIdByName(categoryName);
          if (categoryId) {
            await categoriesApi.decrementPostCount(categoryId);
          }
        } catch (error) {
          console.error(`Error decrementing count for category ${categoryName}:`, error);
          // Continue with other categories even if one fails
        }
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  },

  getPosts: async (lastVisible: any = null, pageSize = 10) => {
    try {
      const postsRef = collection(db, "posts");
      let q;

      if (lastVisible) {
        q = query(
          postsRef, 
          orderBy("createdAt", "desc"), 
          startAfter(lastVisible), 
          limit(pageSize)
        );
      } else {
        q = query(
          postsRef, 
          orderBy("createdAt", "desc"), 
          limit(pageSize)
        );
      }

      const snapshot = await getDocs(q);
      const posts = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as Post));

      const lastDoc = snapshot.docs[snapshot.docs.length - 1];
      const hasMore = snapshot.docs.length === pageSize;

      return {
        posts,
        lastVisible: lastDoc,
        hasMore
      };
    } catch (error) {
      console.error("Error fetching posts:", error);
      throw error;
    }
  },

  getPostById: async (postId: string) => {
    try {
      const postRef = doc(db, "posts", postId);
      const postSnap = await getDoc(postRef);
      
      if (!postSnap.exists()) {
        throw new Error("Post not found");
      }

      return {
        id: postSnap.id,
        ...postSnap.data()
      } as Post;
    } catch (error) {
      console.error("Error getting post:", error);
      throw error;
    }
  }
};
