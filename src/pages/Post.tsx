import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageCircle, Share2, CalendarDays, Clock } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Post as PostType } from "@/types/Post";
import { postApi, commentApi } from "@/lib/api";
import ReactMarkdown from 'react-markdown';
import { useQuery } from "@tanstack/react-query";
import CommentSection from "@/components/CommentSection";

const Post = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  // Extract post ID from slug (last part after the last hyphen)
  const postId = slug?.split('-').pop() || '';
  
  const { data: post, isLoading: isLoadingPost } = useQuery({
    queryKey: ["post", postId],
    queryFn: () => postApi.getPost(postId),
  });

  const { data: comments = [], isLoading: isLoadingComments } = useQuery({
    queryKey: ["comments", postId],
    queryFn: () => commentApi.getComments(postId),
    enabled: !!postId,
  });

  if (isLoadingPost || isLoadingComments) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-3xl mx-auto px-4 py-12">Loading...</div>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-3xl mx-auto px-4 py-12">Post not found</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <article className="max-w-4xl mx-auto">
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <CalendarDays className="h-4 w-4 mr-1" />
                <time>{post.date}</time>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>5 min read</span>
              </div>
            </div>
          </header>

          <div className="prose prose-lg max-w-none prose-custom">
            <ReactMarkdown>{post.content || ''}</ReactMarkdown>
          </div>

          <div className="mt-8 pt-8 border-t">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Discussion</h2>
              <Button variant="outline" size="sm" onClick={() => navigate('/')} >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>

            <CommentSection postId={postId} comments={comments} />
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default Post;