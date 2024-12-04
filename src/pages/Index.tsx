import { useState } from "react";
import { Link } from "react-router-dom";
import { Post } from "@/types/Post";
import { postApi } from "@/lib/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CalendarDays, Clock, ArrowRight, Search, Tag } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { createSlug } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const addPost = async (post: Partial<Post>) => {
  return await postApi.createPost(post);
};

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: () => postApi.getPosts(),
  });

  const getPostUrl = (post: Post) => {
    const titleSlug = createSlug(post.title);
    return `/post/${titleSlug}-${post.id}`;
  };

  const categories = [
    { name: "Technology", icon: "💻", count: 12 },
    { name: "Programming", icon: "👨‍💻", count: 8 },
    { name: "AI & ML", icon: "🤖", count: 6 },
    { name: "Web Development", icon: "🌐", count: 10 },
  ];

  const featuredPosts = posts.slice(0, 3);
  const recentPosts = posts.slice(3);

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
      
      {/* Hero Section */}
      <section className="relative h-[500px] bg-gradient-to-r from-purple-700 to-purple-900 text-white">
        <div className="absolute inset-0 bg-black/30" />
        <div className="container relative z-10 h-full flex flex-col justify-center items-center text-center px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
            Tech Topic Bytes
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl">
            Discover the latest insights, tutorials, and trends in technology and programming
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
            <Input
              type="text"
              placeholder="Search articles..."
              className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button size="lg" className="bg-white text-purple-900 hover:bg-white/90">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="container px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Popular Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category) => (
              <div
                key={category.name}
                className="group p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform">
                  {category.icon}
                </div>
                <h3 className="font-semibold mb-2">{category.name}</h3>
                <p className="text-sm text-gray-500">{category.count} articles</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="py-16 bg-gray-50">
        <div className="container px-4">
          <h2 className="text-3xl font-bold mb-12">Featured Posts</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {featuredPosts.map((post) => (
              <article
                key={post.id}
                className="group bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all"
              >
                <div className="aspect-video bg-gray-100"></div>
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
                  <h3 className="text-xl font-bold mb-2 group-hover:text-purple-600 transition-colors">
                    <Link to={getPostUrl(post)}>{post.title}</Link>
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>
                  <Link
                    to={getPostUrl(post)}
                    className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium"
                  >
                    Read more
                    <ArrowRight className="ml-1 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Posts */}
      <section className="py-16 bg-white">
        <div className="container px-4">
          <h2 className="text-3xl font-bold mb-12">Recent Posts</h2>
          <div className="grid gap-8">
            {recentPosts.map((post) => (
              <article
                key={post.id}
                className="group bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all"
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
                    <div className="flex items-center">
                      <Tag className="h-4 w-4 mr-1" />
                      <span>Technology</span>
                    </div>
                  </div>
                  <div className="md:flex md:items-center md:gap-8">
                    <div className="md:flex-1">
                      <h3 className="text-xl font-bold mb-2 group-hover:text-purple-600 transition-colors">
                        <Link to={getPostUrl(post)}>{post.title}</Link>
                      </h3>
                      <p className="text-gray-600 mb-4">{post.excerpt}</p>
                      <Link
                        to={getPostUrl(post)}
                        className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium"
                      >
                        Read more
                        <ArrowRight className="ml-1 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;