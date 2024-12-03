import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Send } from "lucide-react";
import { useState, useRef, useEffect, memo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { commentApi } from "@/lib/api/comment-api";
import { Comment } from "@/lib/types";
import { CommentItem } from "./CommentItem";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "@/components/AuthModal";

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
}

const CommentSection = ({ postId, comments }: CommentSectionProps) => {
  const { user, loading, signIn } = useAuth();
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [visibleReplies, setVisibleReplies] = useState<Record<string, number>>({});
  const [mainCommentsLimit, setMainCommentsLimit] = useState(10);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleSignIn = async () => {
    try {
      await signIn();
      toast({
        title: "Success",
        description: "Successfully signed in!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign in. Please try again.",
        variant: "destructive",
      });
    }
  };

  const CommentInput = ({ onSubmit, placeholder = "Write a comment...", isReply = false }: { onSubmit: (text: string) => void, placeholder?: string, isReply?: boolean }) => {
    const [text, setText] = useState("");
    const { user } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!text.trim() || isSubmitting) return;

      if (!user) {
        setShowAuthModal(true);
        return;
      }

      setIsSubmitting(true);
      try {
        await onSubmit(text);
        setText("");
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to post comment. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex space-x-4">
          <div className="flex-grow">
            {user ? (
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={placeholder}
                className="min-h-[100px] resize-none"
              />
            ) : (
              <div 
                onClick={() => setShowAuthModal(true)}
                className="min-h-[100px] p-3 bg-gray-50 border rounded-md cursor-pointer hover:bg-gray-100 flex items-center justify-center text-gray-500"
              >
                Sign in to write a comment
              </div>
            )}
          </div>
        </div>
        {user && text.trim() && (
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              <Send className="h-4 w-4 mr-2" />
              {isReply ? "Reply" : "Comment"}
            </Button>
          </div>
        )}
      </form>
    );
  };

  const createCommentMutation = useMutation({
    mutationFn: (comment: Partial<Comment>) => commentApi.createComment(comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      setNewComment("");
      setReplyTo(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to post comment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleMainSubmit = async (text: string) => {
    if (!user) return;
    
    try {
      await createCommentMutation.mutateAsync({
        postId,
        content: text,
        author: user.displayName || 'Anonymous',
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post comment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleReplySubmit = async (parentId: string, text: string) => {
    if (!user) return;

    try {
      await createCommentMutation.mutateAsync({
        postId,
        parentId,
        content: text,
        author: user.displayName || 'Anonymous',
      });
      setReplyTo(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post reply. Please try again.",
        variant: "destructive",
      });
    }
  };

  const ReplyForm = memo(({ parentId }: { parentId: string }) => {
    return (
      <div className="mt-2">
        <CommentInput
          onSubmit={(text) => handleReplySubmit(parentId, text)}
          placeholder="Write a reply..."
          isReply={true}
        />
      </div>
    );
  });

  // Organize comments into a tree structure
  const commentsByParent = comments.reduce((acc, comment) => {
    const parentId = comment.parentId || "root";
    acc[parentId] = acc[parentId] || [];
    acc[parentId].push(comment);
    return acc;
  }, {} as Record<string, Comment[]>);

  // Sort comments by date in descending order (newest first)
  const mainComments = (commentsByParent["root"] || [])
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, mainCommentsLimit);

  const getDirectReplies = (commentId: string) => {
    // Get only direct replies to this comment
    const directReplies = (commentsByParent[commentId] || [])
      .filter(reply => reply.parentId === commentId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    const limit = visibleReplies[commentId] || 3;
    
    return {
      shownReplies: directReplies.slice(0, limit),
      hasMoreReplies: directReplies.length > limit,
      totalReplies: directReplies.length
    };
  };

  const getNestedReplies = (replyId: string): Comment[] => {
    const replies = commentsByParent[replyId] || [];
    return replies.reduce((acc, reply) => {
      return [...acc, reply, ...getNestedReplies(reply.id)];
    }, [] as Comment[]);
  };

  const renderReplies = (parentId: string, level: number = 0) => {
    const replies = commentsByParent[parentId] || [];
    return replies.map(reply => (
      <div 
        key={reply.id} 
        className={`border-l-2 border-gray-100 pl-4 ${level > 0 ? 'ml-8' : ''}`}
      >
        <CommentItem comment={reply} onReply={handleReply} />
        {replyTo === reply.id && <ReplyForm parentId={reply.id} />}
        {renderReplies(reply.id, level + 1)}
      </div>
    ));
  };

  const renderComments = (parentId: string = "root", level: number = 0) => {
    if (level === 0) {
      return mainComments.map((comment) => {
        const { shownReplies, hasMoreReplies, totalReplies } = getDirectReplies(comment.id);
        
        return (
          <div key={comment.id} className="space-y-4">
            <CommentItem comment={comment} onReply={handleReply} />
            {replyTo === comment.id && <ReplyForm parentId={comment.id} />}
            
            <div className="ml-8 space-y-4">
              {/* Show paginated direct replies */}
              {shownReplies.map((reply) => (
                <div key={reply.id} className="space-y-4">
                  <div className="border-l-2 border-gray-100 pl-4">
                    <CommentItem comment={reply} onReply={handleReply} />
                    {replyTo === reply.id && <ReplyForm parentId={reply.id} />}
                  </div>
                  {/* Show all nested replies for this direct reply */}
                  {renderReplies(reply.id, 1)}
                </div>
              ))}
              
              {/* Show more direct replies button */}
              {hasMoreReplies && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-sm text-muted-foreground hover:text-primary"
                  onClick={() => handleLoadMoreReplies(comment.id)}
                >
                  Show more replies ({totalReplies - shownReplies.length} remaining)
                </Button>
              )}
            </div>
          </div>
        );
      });
    }
    return null;
  };

  const handleLoadMoreReplies = (commentId: string) => {
    setVisibleReplies(prev => ({
      ...prev,
      [commentId]: (prev[commentId] || 3) + 3
    }));
  };

  const handleLoadMoreComments = () => {
    setMainCommentsLimit(prev => prev + 10);
  };

  const handleReply = (parentId: string) => {
    if (parentId === replyTo) {
      setReplyTo(null);
    } else {
      setReplyTo(parentId);
    }
  };

  useEffect(() => {
  }, [user]);

  return (
    <div className="mt-8 space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Comments</h2>
      
      <CommentInput
        onSubmit={handleMainSubmit}
        placeholder="Write a comment..."
      />

      <div className="space-y-4">
        {renderComments()}
        
        <div className="py-2">
          {(commentsByParent["root"]?.length || 0) > mainCommentsLimit ? (
            <Button
              variant="ghost"
              className="w-full mt-4"
              onClick={handleLoadMoreComments}
            >
              Load More Comments ({(commentsByParent["root"]?.length || 0) - mainCommentsLimit} remaining)
            </Button>
          ) : (
            <div className="text-sm text-gray-500 text-center">
              {commentsByParent["root"]?.length || 0} comments total
            </div>
          )}
        </div>
      </div>
      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
    </div>
  );
};

export default CommentSection;
