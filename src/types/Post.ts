import { Timestamp } from 'firebase/firestore';

export interface Post {
  id: string;
  title: string;
  content: string;
  userId: string;
  published: boolean;
  categories?: string[];
  tags?: string[];
  views: number;
  likes: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
