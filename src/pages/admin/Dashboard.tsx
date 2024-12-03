import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Calendar, 
  Layers, 
  Eye 
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { adminDashboardApi } from "@/lib/api";

interface DashboardProps {
  user: any;
}

interface DashboardStats {
  totalPosts: number;
  postsThisMonth: number;
  mostActiveCategory: string;
  totalViews: number;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [stats, setStats] = useState<DashboardStats>({
    totalPosts: 0,
    postsThisMonth: 0,
    mostActiveCategory: '',
    totalViews: 0
  });

  const [chartData, setChartData] = useState<any[]>([]);
  const [pieChartData, setPieChartData] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const dashboardStats = await adminDashboardApi.getDashboardStats();
        setStats(dashboardStats);

        // Process chart data
        const categoryData = await adminDashboardApi.getCategoryDistribution();
        setChartData(categoryData);
        setPieChartData(categoryData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  // Custom color palette
  const colorPalette = [
    'from-indigo-500 to-blue-500',
    'from-purple-500 to-pink-500',
    'from-green-500 to-teal-500',
    'from-rose-500 to-red-500'
  ];

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { 
            title: 'Total Posts', 
            value: stats.totalPosts, 
            gradient: colorPalette[0],
            icon: FileText 
          },
          { 
            title: 'Posts This Month', 
            value: stats.postsThisMonth, 
            gradient: colorPalette[1],
            icon: Calendar 
          },
          { 
            title: 'Most Active Category', 
            value: stats.mostActiveCategory, 
            gradient: colorPalette[2],
            icon: Layers 
          },
          { 
            title: 'Total Views', 
            value: stats.totalViews, 
            gradient: colorPalette[3],
            icon: Eye 
          }
        ].map(({ title, value, gradient, icon: Icon }, index) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              delay: index * 0.1, 
              duration: 0.5,
              type: "spring",
              stiffness: 100 
            }}
            className={`
              relative overflow-hidden rounded-xl shadow-lg 
              bg-gradient-to-br ${gradient} 
              text-white p-6 
              transform transition-all duration-300 
              hover:scale-105 hover:shadow-xl
            `}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-medium opacity-80 mb-2">{title}</h3>
                <div className="text-3xl font-bold">{value}</div>
              </div>
              <Icon 
                className="w-12 h-12 opacity-50 absolute -right-2 -top-2" 
                strokeWidth={1.5} 
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-xl font-semibold text-slate-800 mb-4">
            Category Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="name" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip 
                cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  borderRadius: '8px', 
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)' 
                }}
              />
              <Bar 
                dataKey="count" 
                fill="url(#barGradient)" 
                barSize={30}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pie Chart */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-xl font-semibold text-slate-800 mb-4">
            Post Categories
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
                label={({ name, percent }) => 
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {pieChartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={`hsl(${index * 60 + 200}, 70%, 50%)`} 
                  />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  borderRadius: '8px', 
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)' 
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
