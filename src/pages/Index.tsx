import { useState } from "react";
import { Link } from "react-router-dom";
import { Post } from "@/types/Post";
import { postApi } from "@/lib/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CalendarDays, Clock, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export const addPost = async (post: Partial<Post>) => {
  return await postApi.createPost(post);
};

const Index = () => {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: () => postApi.getPosts(),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        <Header />
        <div className="container py-8">Loading...</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="grid gap-8">
            {posts?.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <CalendarDays className="h-4 w-4 mr-1" />
                      <time>{post.date}</time>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>5 min read</span>
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold mb-2">
                    <Link
                      to={`/post/${post.id}`}
                      className="text-gray-900 hover:text-purple-600 transition-colors"
                    >
                      {post.title}
                    </Link>
                  </h2>
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  <Link
                    to={`/post/${post.id}`}
                    className="inline-flex items-center text-purple-600 hover:text-purple-700"
                  >
                    Read more
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;