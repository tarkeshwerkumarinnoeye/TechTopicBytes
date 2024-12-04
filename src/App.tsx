import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes as ReactRoutes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Post from "./pages/Post";
import NewPost from "./pages/NewPost";
import About from "./pages/About";
import Contact from "./pages/Contact";
import AdminIndex from "./pages/admin/Index";
import Categories from "./pages/Categories";
import CategoryPosts from "./pages/CategoryPosts";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <ReactRoutes>
            <Route path="/" element={<Index />} />
            <Route path="/post/:slug" element={<Post />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/category/:categoryName" element={<CategoryPosts />} />
            <Route path="/admin" element={<AdminIndex />}>
              <Route path="write-post" element={<AdminIndex />} />
            </Route>
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </ReactRoutes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;