import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { adminPostsApi } from "@/lib/api";
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Save, X } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

interface WritePostProps {
  user: any;
  onPostCreated?: () => void;
}

const WritePost: React.FC<WritePostProps> = ({ user, onPostCreated }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editPostId = searchParams.get('edit');
  const [isLoading, setIsLoading] = useState(false);

  const [postForm, setPostForm] = useState({
    title: '',
    content: '',
    categories: [] as string[],
    tags: [] as string[]
  });
  const [isPreview, setIsPreview] = useState(false);

  // Fetch post data if editing
  useEffect(() => {
    const fetchPost = async () => {
      if (editPostId) {
        setIsLoading(true);
        try {
          const post = await adminPostsApi.getPost(editPostId);
          setPostForm({
            title: post.title || '',
            content: post.content || '',
            categories: post.categories || [],
            tags: post.tags || []
          });
        } catch (error) {
          console.error('Error fetching post:', error);
          toast({
            title: "Error",
            description: "Failed to fetch post for editing",
            variant: "destructive"
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchPost();
  }, [editPostId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPostForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleArrayInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'categories' | 'tags') => {
    const values = e.target.value.split(',').map(item => item.trim());
    setPostForm(prev => ({
      ...prev,
      [field]: values
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (editPostId) {
        await adminPostsApi.updatePost(editPostId, {
          title: postForm.title,
          content: postForm.content,
          categories: postForm.categories,
          tags: postForm.tags,
          userId: user.uid,
          published: true
        });
        toast({
          title: "Success",
          description: "Post updated successfully"
        });
      } else {
        await adminPostsApi.createPost({
          ...postForm,
          userId: user.uid,
          published: true,
          views: 0,
          likes: 0
        });
        toast({
          title: "Success",
          description: "Post created successfully"
        });
      }

      if (onPostCreated) {
        onPostCreated();
      }
    } catch (error) {
      console.error('Error saving post:', error);
      toast({
        title: "Error",
        description: editPostId ? "Failed to update post" : "Failed to create post",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
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
      className="max-w-4xl mx-auto"
    >
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Title</label>
                <Input
                  name="title"
                  placeholder="Enter post title..."
                  value={postForm.title}
                  onChange={handleInputChange}
                  required
                  className="text-lg"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Categories</label>
                <Input
                  placeholder="Technology, Programming, Web Development..."
                  value={postForm.categories.join(', ')}
                  onChange={(e) => handleArrayInputChange(e, 'categories')}
                  className="text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Tags</label>
                <Input
                  placeholder="react, typescript, web..."
                  value={postForm.tags.join(', ')}
                  onChange={(e) => handleArrayInputChange(e, 'tags')}
                  className="text-sm"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-slate-700">Content</label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsPreview(!isPreview)}
                    className="flex items-center gap-2"
                  >
                    {isPreview ? (
                      <>
                        <EyeOff size={16} />
                        Exit Preview
                      </>
                    ) : (
                      <>
                        <Eye size={16} />
                        Preview
                      </>
                    )}
                  </Button>
                </div>

                {isPreview ? (
                  <div className="prose prose-slate max-w-none min-h-[400px] p-4 rounded-lg border bg-white">
                    <ReactMarkdown>{postForm.content}</ReactMarkdown>
                  </div>
                ) : (
                  <Textarea
                    name="content"
                    placeholder="Write your post content in Markdown..."
                    value={postForm.content}
                    onChange={handleInputChange}
                    required
                    className="min-h-[400px] font-mono text-sm"
                  />
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/admin')}
                className="flex items-center gap-2"
                disabled={isLoading}
              >
                <X size={16} />
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <Save size={16} />
                {editPostId ? 'Update Post' : 'Create Post'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default WritePost;
