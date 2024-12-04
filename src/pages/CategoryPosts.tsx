import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { adminPostsApi } from '@/lib/api/admin/posts-api';
import { categoriesApi } from '@/lib/api/categories-api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format, parseISO, isValid } from 'date-fns';
import { motion } from 'framer-motion';
import { ChevronRight, Calendar, User, Eye } from 'lucide-react';
import { createSlug } from '@/lib/utils';

const CategoryPosts = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const [lastVisible, setLastVisible] = useState<any>(null);

  const { data: categoryData } = useQuery({
    queryKey: ['category', categoryName],
    queryFn: async () => {
      const categories = await categoriesApi.getCategories();
      return categories.find(cat => cat.name === categoryName);
    }
  });

  const { data: postsData, isFetching, fetchNextPage } = useQuery({
    queryKey: ['posts', categoryName, lastVisible],
    queryFn: () => adminPostsApi.getPostsByCategory(categoryName || '', lastVisible),
    enabled: !!categoryName
  });

  const handleLoadMore = async () => {
    if (postsData?.lastVisible) {
      setLastVisible(postsData.lastVisible);
    }
  };

  // Helper function to safely format date
  const formatDate = (dateString: any) => {
    try {
      // If it's a Firestore timestamp, convert to Date
      if (dateString?.toDate) {
        const date = dateString.toDate();
        return format(date, 'MMM d, yyyy');
      }
      
      // If it's a string, try parsing
      if (typeof dateString === 'string') {
        const parsedDate = parseISO(dateString);
        return isValid(parsedDate) ? format(parsedDate, 'MMM d, yyyy') : 'Unknown Date';
      }
      
      // If it's already a Date object
      if (dateString instanceof Date) {
        return isValid(dateString) ? format(dateString, 'MMM d, yyyy') : 'Unknown Date';
      }
      
      return 'Unknown Date';
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Unknown Date';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Header />
      
      <main className="container py-8 px-4">
        {/* Category Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            {categoryName}
          </h1>
          {categoryData && (
            <div className="flex items-center justify-center gap-4">
              <Badge variant="secondary" className="text-sm">
                {categoryData.postCount || 0} Posts
              </Badge>
              {categoryData.description && (
                <p className="text-gray-600">{categoryData.description}</p>
              )}
            </div>
          )}
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {postsData?.posts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Link to={`/post/${createSlug(post.title)}-${post.id}`}>
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-3 line-clamp-2 hover:text-purple-600 transition-colors">
                      {post.title}
                    </h2>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.content.substring(0, 150)}...
                    </p>

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        {formatDate(post.createdAt)}
                      </div>
                      
                      {post.author && (
                        <div className="flex items-center gap-1">
                          <User size={14} />
                          {post.author}
                        </div>
                      )}
                      
                      <div className="flex items-center gap-1">
                        <Eye size={14} />
                        {post.views || 0}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Load More Button */}
        {postsData?.hasMore && (
          <div className="flex justify-center mt-8">
            <Button
              variant="outline"
              onClick={handleLoadMore}
              disabled={isFetching}
              className="flex items-center gap-2"
            >
              {isFetching ? 'Loading...' : 'Load More'}
              {!isFetching && <ChevronRight size={16} />}
            </Button>
          </div>
        )}

        {/* Empty State */}
        {postsData?.posts.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No Posts Found</h3>
            <p className="text-gray-600">
              There are no posts in this category yet.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CategoryPosts;
