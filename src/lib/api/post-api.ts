import { db } from '../firebase';
import { 
  collection, 
  getDocs, 
  getDoc, 
  addDoc, 
  doc, 
  query, 
  orderBy,
} from 'firebase/firestore';
import { Post } from '../types';

const POSTS_COLLECTION = 'posts';

export const postApi = {
  getPosts: async (): Promise<Post[]> => {
    try {
      const postsQuery = query(collection(db, POSTS_COLLECTION), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(postsQuery);
      return snapshot.docs.map(doc => {
        const data = doc.data();
        const createdAt = data.createdAt?.toDate?.();
        return {
          id: doc.id,
          ...data,
          date: createdAt ? createdAt.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
        } as Post;
      });
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw new Error('Failed to fetch posts. Please check your network connection.');
    }
  },

  createPost: async (post: Partial<Post>): Promise<Post> => {
    try {
      const newPost = {
        title: post.title,
        content: post.content,
        excerpt: post.content ? post.content.split('\n')[0].substring(0, 150) + "..." : "",
        createdAt: new Date(),
        date: new Date().toISOString().split('T')[0],
        imageUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&q=80",
        published: true,
        views: 0,
        likes: 0,
        categories: post.categories || [],
        tags: post.tags || []
      };

      const docRef = await addDoc(collection(db, POSTS_COLLECTION), newPost);
      return {
        id: docRef.id,
        ...newPost
      } as Post;
    } catch (error) {
      console.error('Error creating post:', error);
      throw new Error('Failed to create post. Please check your network connection.');
    }
  },

  getPost: async (id: string): Promise<Post> => {
    try {
      const docRef = doc(db, POSTS_COLLECTION, id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        throw new Error('Post not found');
      }

      return {
        id: docSnap.id,
        ...docSnap.data()
      } as Post;
    } catch (error) {
      console.error('Error fetching post:', error);
      throw new Error('Failed to fetch post. Please check your network connection.');
    }
  },
};
