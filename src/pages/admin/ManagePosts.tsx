import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { adminPostsApi } from "@/lib/api";
import { Post } from "@/types/Post";
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Edit2, 
  Trash2, 
  Plus, 
  ChevronRight, 
  ChevronLeft, 
  Search, 
  Filter 
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface ManagePostsProps {
  user: any;
  setActiveTab: (tab: string) => void;
}

const ManagePosts: React.FC<ManagePostsProps> = ({ user, setActiveTab }) => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [lastVisible, setLastVisible] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Extract unique categories from all posts
  const allCategories = useMemo(() => {
    const categories = new Set<string>();
    posts.forEach(post => {
      post.categories?.forEach(category => {
        categories.add(category);
      });
    });
    return Array.from(categories);
  }, [posts]);

  // Filtered posts based on search and category
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesSearch = 
        !searchQuery || 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategories = 
        selectedCategories.length === 0 ||
        post.categories?.some(category => selectedCategories.includes(category));
      
      return matchesSearch && matchesCategories;
    });
  }, [posts, searchQuery, selectedCategories]);

  const fetchPosts = async (lastDoc: any = null) => {
    try {
      const { posts: newPosts, lastVisible: newLastVisible } = await adminPostsApi.getPosts(lastDoc);
      if (!lastDoc) {
        setPosts(newPosts);
      } else {
        setPosts(prev => [...prev, ...newPosts]);
      }
      setLastVisible(newLastVisible);
      setHasMore(newPosts.length === 10); // Assuming page size is 10
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: "Error",
        description: "Failed to fetch posts",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (postId: string) => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      await adminPostsApi.deletePost(postId);
      setPosts(posts.filter(post => post.id !== postId));
      toast({
        title: "Success",
        description: "Post deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Posts</h2>
          <p className="text-muted-foreground">
            Manage your blog posts here
          </p>
        </div>
        <Button
          onClick={() => {
            setActiveTab('write-post');
            navigate('/admin?tab=write-post');
          }}
          className="flex items-center gap-2"
        >
          <Plus size={16} />
          New Post
        </Button>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={18} />
          <Input
            placeholder="Search posts by title or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter size={16} />
              Filter
              {selectedCategories.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {selectedCategories.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {allCategories.map((category) => (
              <DropdownMenuCheckboxItem
                key={category}
                checked={selectedCategories.includes(category)}
                onCheckedChange={(checked) => {
                  setSelectedCategories(prev =>
                    checked
                      ? [...prev, category]
                      : prev.filter(c => c !== category)
                  );
                }}
              >
                {category}
              </DropdownMenuCheckboxItem>
            ))}
            {selectedCategories.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={() => setSelectedCategories([])}
                  className="text-red-600"
                >
                  Clear Filters
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Categories</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence mode="popLayout">
                {filteredPosts.map((post) => (
                  <motion.tr
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                    className="group"
                  >
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {post.categories?.map((category, index) => (
                          <Badge key={index} variant="secondary">
                            {category}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      {post.createdAt?.toDate ? format(post.createdAt.toDate(), 'MMM d, yyyy') : 'N/A'}
                    </TableCell>
                    <TableCell>
                      {post.updatedAt?.toDate ? format(post.updatedAt.toDate(), 'MMM d, yyyy') : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setActiveTab('write-post');
                            navigate(`/admin?tab=write-post&edit=${post.id}`);
                          }}
                          className="flex items-center gap-1 hover:bg-slate-100"
                        >
                          <Edit2 size={14} />
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(post.id)}
                          className="flex items-center gap-1 hover:bg-red-100 hover:text-red-600"
                        >
                          <Trash2 size={14} />
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {hasMore && filteredPosts.length === posts.length && (
        <div className="flex justify-center mt-4">
          <Button
            variant="outline"
            onClick={() => fetchPosts(lastVisible)}
            className="flex items-center gap-2"
          >
            Load More
            <ChevronRight size={16} />
          </Button>
        </div>
      )}
    </motion.div>
  );
};

export default ManagePosts;
