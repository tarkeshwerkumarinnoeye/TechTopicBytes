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
  LogOut
} from 'lucide-react';

// Import components
import Dashboard from './Dashboard';
import ManagePosts from './ManagePosts';
import WritePost from './WritePost';
import { Button } from '@/components/ui/button';

// Sidebar Component
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
      "h-screen bg-slate-900 text-white transition-all duration-300 ease-in-out",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        {!isCollapsed && <h2 className="text-xl font-bold">Admin Panel</h2>}
        <Button 
          variant="ghost" 
          size="icon"
          onClick={toggleCollapse}
          className="text-white hover:bg-slate-800"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </Button>
      </div>
      <div className="space-y-2 p-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "w-full flex items-center px-3 py-2 rounded-lg transition-all duration-200",
                "hover:bg-slate-800",
                activeTab === tab.id
                  ? "bg-slate-800 text-white"
                  : "text-slate-300"
              )}
            >
              <Icon size={20} className="shrink-0" />
              {!isCollapsed && (
                <span className="ml-3 truncate">{tab.label}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

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

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar 
        activeTab={activeTab} 
        onTabChange={handleTabChange}
        isCollapsed={isCollapsed}
        toggleCollapse={() => setIsCollapsed(!isCollapsed)}
      />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">
            {activeTab.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600">
              Welcome, {user?.displayName}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => signOut()}
              className="flex items-center gap-2"
            >
              <LogOut size={16} />
              Sign Out
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
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