import { db } from '../firebase';
import { 
  collection, 
  getDocs, 
  addDoc, 
  doc, 
  query, 
  orderBy,
  updateDoc
} from 'firebase/firestore';
import { Comment } from '../types';

const COMMENTS_COLLECTION = 'comments';

export const commentApi = {
  getComments: async (postId: string): Promise<Comment[]> => {
    try {
      const commentsQuery = query(
        collection(db, COMMENTS_COLLECTION),
        orderBy('date', 'desc')
      );
      const snapshot = await getDocs(commentsQuery);
      return snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Comment))
        .filter(comment => comment.postId === postId);
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw new Error('Failed to fetch comments. Please check your network connection.');
    }
  },

  createComment: async (comment: Partial<Comment>): Promise<Comment> => {
    try {
      // Create base comment object without parentId
      const baseComment = {
        postId: comment.postId,
        author: comment.author,
        content: comment.content,
        date: new Date().toISOString(),
        likes: 0,
        dislikes: 0,
      };

      // Only add parentId if it exists and is not null/undefined
      const newComment = comment.parentId
        ? { ...baseComment, parentId: comment.parentId }
        : baseComment;

      const docRef = await addDoc(collection(db, COMMENTS_COLLECTION), newComment);
      return {
        id: docRef.id,
        ...newComment
      } as Comment;
    } catch (error) {
      console.error('Error creating comment:', error);
      throw error;
    }
  },

  updateCommentVotes: async (commentId: string, likes: number, dislikes: number): Promise<void> => {
    try {
      const commentRef = doc(db, COMMENTS_COLLECTION, commentId);
      await updateDoc(commentRef, { likes, dislikes });
    } catch (error) {
      console.error('Error updating comment votes:', error);
      throw new Error('Failed to update comment votes. Please check your network connection.');
    }
  },
};
