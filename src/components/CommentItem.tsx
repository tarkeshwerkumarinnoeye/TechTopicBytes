import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ThumbsUp, ThumbsDown, Reply } from "lucide-react";
import { Comment } from "@/lib/types";
import { Button } from "./ui/button";

interface CommentItemProps {
  comment: Comment;
  onReply: (parentId: string) => void;
}

export const CommentItem = ({ comment, onReply }: CommentItemProps) => {
  const [likes, setLikes] = useState(comment.likes);
  const [dislikes, setDislikes] = useState(comment.dislikes);
  const queryClient = useQueryClient();

  const handleVote = async (type: "like" | "dislike") => {
    // Optimistic update
    if (type === "like") {
      setLikes(prev => prev + 1);
    } else {
      setDislikes(prev => prev + 1);
    }

    try {
      // TODO: Implement actual vote API call
      // await apiService.voteComment(comment.id, type);
    } catch (error) {
      // Revert on error
      if (type === "like") {
        setLikes(prev => prev - 1);
      } else {
        setDislikes(prev => prev - 1);
      }
    }
  };

  return (
    <div className="group relative flex flex-col gap-2">
      <div className="flex items-start justify-between">
        <div className="flex flex-col">
          <span className="font-medium">{comment.author}</span>
          <span className="text-sm text-gray-500">
            {(() => {
              const date = new Date(comment.date);
              const day = date.getDate().toString().padStart(2, '0');
              const month = (date.getMonth() + 1).toString().padStart(2, '0');
              const year = date.getFullYear();
              const hours = date.getHours().toString().padStart(2, '0');
              const minutes = date.getMinutes().toString().padStart(2, '0');
              const seconds = date.getSeconds().toString().padStart(2, '0');
              return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
            })()}
          </span>
        </div>
      </div>

      <p className="text-gray-700">{comment.content}</p>

      <div className="flex items-center gap-4">
        <button
          onClick={() => handleVote("like")}
          className="flex items-center gap-1 text-gray-500 hover:text-purple-600 transition-colors"
        >
          <ThumbsUp className="w-4 h-4" />
          <span>{likes}</span>
        </button>

        <button
          onClick={() => handleVote("dislike")}
          className="flex items-center gap-1 text-gray-500 hover:text-purple-600 transition-colors"
        >
          <ThumbsDown className="w-4 h-4" />
          <span>{dislikes}</span>
        </button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onReply(comment.id)}
          className="flex items-center gap-1 text-gray-500 hover:text-purple-600 transition-colors"
        >
          <Reply className="w-4 h-4" />
          <span>Reply</span>
        </Button>
      </div>
    </div>
  );
};
