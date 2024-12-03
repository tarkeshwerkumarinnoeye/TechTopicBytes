import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminStatus } from '@/hooks/useAdminStatus';
import { toast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  FileText, 
  PenTool, 
  ChevronLeft, 
  ChevronRight,
  LogOut,
  Home
} from 'lucide-react';

// Import components
import Dashboard from './Dashboard';
import ManagePosts from './ManagePosts';
import WritePost from './WritePost';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { user, signOut } = useAuth();
  const { isAdmin, isLoading: isAdminStatusLoading } = useAdminStatus(user);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabParam || 'dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Update activeTab when URL parameters change
  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  // Handle tab changes
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    navigate(`/admin?tab=${tab}`);
  };

  useEffect(() => {
    if (!isAdminStatusLoading) {
      if (!user) {
        console.log('No user found');
        navigate('/');
        return;
      }

      if (!isAdmin) {
        toast({
          title: "Access Denied",
          description: "You do not have admin permissions.",
          variant: "destructive"
        });
        navigate('/');
      }
    }
  }, [user, isAdmin, isAdminStatusLoading, navigate]);

  if (isAdminStatusLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard user={user} />;
      case 'manage-posts':
        return <ManagePosts user={user} setActiveTab={handleTabChange} />;
      case 'write-post':
        return <WritePost 
          user={user} 
          onPostCreated={() => handleTabChange('manage-posts')} 
        />;
      default:
        return <Dashboard user={user} />;
    }
  };

  // Enhanced Sidebar Component
  const AdminSidebar = ({ 
    activeTab, 
    onTabChange, 
    isCollapsed, 
    toggleCollapse 
  }: { 
    activeTab: string;
    onTabChange: (tab: string) => void;
    isCollapsed: boolean;
    toggleCollapse: () => void;
  }) => {
    const tabs = [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'manage-posts', label: 'Manage Posts', icon: FileText },
      { id: 'write-post', label: 'Write Post', icon: PenTool },
    ];

    return (
      <div className={cn(
        "h-screen fixed left-0 top-0 z-40 bg-gradient-to-br from-[#1e293b] to-[#0f172a] text-white transition-all duration-300 ease-in-out shadow-2xl",
        isCollapsed ? "w-16" : "w-64"
      )}>
        <div className="h-full flex flex-col">
          {/* Logo and Collapse Button */}
          <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-900/30">
            {!isCollapsed && (
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 text-transparent bg-clip-text">
                  TechTonic
                </span>
                <span className="text-xl font-bold text-rose-500">Bytes</span>
              </div>
            )}
            <Button 
              variant="ghost" 
              size="icon"
              onClick={toggleCollapse}
              className="text-white hover:bg-slate-700 transition-colors"
            >
              {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </Button>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={cn(
                    "w-full flex items-center px-3 py-2 rounded-lg transition-all duration-200 group",
                    "hover:bg-slate-700/50",
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-indigo-600/30 to-purple-600/30 text-white shadow-md"
                      : "text-slate-300 hover:text-white"
                  )}
                >
                  <Icon 
                    size={20} 
                    className={cn(
                      "shrink-0 transition-all duration-300", 
                      activeTab === tab.id 
                        ? "text-indigo-400 group-hover:rotate-6" 
                        : "group-hover:scale-110"
                    )} 
                  />
                  {!isCollapsed && (
                    <span className="ml-3 truncate text-sm font-medium">
                      {tab.label}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* User Profile or Additional Actions */}
          {!isCollapsed && (
            <div className="p-4 border-t border-slate-700 bg-slate-900/30">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {user?.displayName?.[0].toUpperCase()}
                  </span>
                </div>
                <div>
                  <div className="text-sm font-medium text-white truncate">
                    {user?.displayName}
                  </div>
                  <div className="text-xs text-slate-400 truncate">
                    {user?.email}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar 
        activeTab={activeTab} 
        onTabChange={handleTabChange}
        isCollapsed={isCollapsed}
        toggleCollapse={() => setIsCollapsed(!isCollapsed)}
      />

      {/* Main Content Area with Margin Adjusted for Sidebar */}
      <div 
        className={cn(
          "flex-1 transition-all duration-300 ease-in-out",
          isCollapsed ? "ml-16" : "ml-64"
        )}
      >
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm sticky top-0 z-30">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-slate-900 bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
              {activeTab.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </h1>
            <Link to="/">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 hover:border-indigo-300 transition-colors group"
              >
                <Home size={16} className="group-hover:rotate-12 transition-transform" />
                Home
              </Button>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600 font-medium">
              Welcome, <span className="text-indigo-600">{user?.displayName}</span>
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => signOut()}
              className="flex items-center gap-2 text-slate-600 hover:text-rose-600 hover:border-rose-300 transition-colors group"
            >
              <LogOut size={16} className="group-hover:rotate-180 transition-transform" />
              Sign Out
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6 bg-slate-50">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;