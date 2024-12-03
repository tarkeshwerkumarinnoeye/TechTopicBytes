import { Timestamp } from "firebase/firestore";

export interface Comment {
  id: string;
  postId: string;
  parentId?: string;
  author: string;
  content: string;
  date: string;
  likes: number;
  dislikes: number;
}
