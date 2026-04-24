import React, { useState, useEffect } from 'react';
import { useApi } from '../context/ApiContext';
import { 
  Users, 
  BookOpen, 
  MessageSquare, 
  CreditCard, 
  TrendingUp, 
  Calendar,
  Clock,
  ArrowRight,
  Zap,
  CheckCircle2,
  CalendarDays
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const api = useApi();
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalCourses: 0,
        totalInquiries: 0,
        totalRevenue: 0,
        pendingStudents: 0
    });
    const [recentInquiries, setRecentInquiries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, [api]);

    const fetchDashboardData = async () => {
        try {
            const { data } = await api.get('/api/dashboard');
            if (data.success) {
                setStats({
                    totalStudents: data.data.totalStudents || 0,
                    totalCourses: data.data.totalCourses || 0,
                    totalInquiries: data.data.totalInquiries || 0,
                    totalRevenue: data.data.totalRevenue || 0,
                    pendingStudents: data.data.pendingStudents || 0
                });
                setRecentInquiries(data.data.recentInquiries || []);
            }
        } catch (error) {
            console.error('Failed to fetch dashboard data', error);
            toast.error('Failed to load dashboard statistics');
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        { title: 'Students', value: stats.totalStudents, icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { title: 'Courses', value: stats.totalCourses, icon: BookOpen, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { title: 'Revenue', value: stats.totalRevenue ? `₹${(stats.totalRevenue / 1000).toFixed(0)}K` : '₹0', icon: CreditCard, color: 'text-teal-600', bg: 'bg-teal-50' },
        { title: 'Pending', value: stats.pendingStudents, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-3"></div>
                    <p className="text-slate-600 text-sm font-medium">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 to-white">
            {/* Main Container - Reduced padding for compact view */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
                
                {/* Welcome Header - Compact */}
                <div className="mb-5">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                        <div>
                            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                                Welcome back, {user?.name?.split(' ')[0] || 'Admin'}
                                <span className="text-xl animate-bounce">👋</span>
                            </h1>
                            <p className="text-slate-500 text-xs sm:text-sm mt-0.5">{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                        </div>
                        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-slate-200">
                            <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-xs font-semibold text-slate-700">Live</span>
                        </div>
                    </div>
                </div>

                {/* Stats Grid - Compact Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                    {statCards.map((stat, i) => (
                        <div key={i} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
                            <div className={`w-8 h-8 ${stat.bg} ${stat.color} rounded-lg flex items-center justify-center mb-2`}>
                                <stat.icon className="w-4 h-4" />
                            </div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{stat.title}</p>
                            <p className="text-lg font-extrabold text-slate-900 mt-0.5">{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Two Column Layout - More compact */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    
                    {/* Left Column - Takes 2/3 on desktop */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Quick Action Card - Compact */}
                        <div className="bg-linear-to-r from-slate-900 to-slate-800 rounded-xl p-4 text-white relative overflow-hidden shadow-lg">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-600/20 rounded-full blur-2xl -mr-10 -mt-10"></div>
                            <div className="relative z-10">
                                <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-white/10 backdrop-blur rounded-full border border-white/10 mb-2">
                                    <Zap className="w-3 h-3 fill-current text-emerald-400" />
                                    <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider">Quick Action</span>
                                </div>
                                <h3 className="text-base sm:text-lg font-extrabold mb-1">Launch New Course</h3>
                                <p className="text-slate-300 text-xs mb-3">Start a new batch and boost enrollment</p>
                                <button 
                                    onClick={() => navigate('/admin/courses')}
                                    className="bg-white text-slate-900 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 hover:scale-105 transition-transform"
                                >
                                    Create Now <ArrowRight className="w-3 h-3" />
                                </button>
                            </div>
                        </div>

                        {/* Recent Activity - Compact Table */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="px-4 py-3 border-b border-slate-100">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <MessageSquare className="w-4 h-4 text-emerald-600" />
                                        <h3 className="text-sm font-bold text-slate-900">Recent Inquiries</h3>
                                    </div>
                                    <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                                        {recentInquiries.length} new
                                    </span>
                                </div>
                            </div>
                            <div className="divide-y divide-slate-50">
                                {recentInquiries.length > 0 ? recentInquiries.slice(0, 3).map((inq, i) => (
                                    <div key={i} className="px-4 py-2.5 hover:bg-slate-50 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-slate-900 text-sm truncate">{inq.name}</p>
                                                <p className="text-xs text-slate-500 truncate">{inq.message || 'Interested in courses'}</p>
                                            </div>
                                            <div className="text-[9px] font-medium text-slate-400 ml-2 whitespace-nowrap">
                                                {new Date(inq.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="px-4 py-6 text-center">
                                        <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-1" />
                                        <p className="text-xs text-slate-400">No inquiries yet</p>
                                    </div>
                                )}
                                <button 
                                    onClick={() => navigate('/admin/inquiries')}
                                    className="w-full px-4 py-2.5 text-center text-xs font-semibold text-emerald-600 hover:bg-emerald-50 transition-colors flex items-center justify-center gap-1"
                                >
                                    View All <ArrowRight className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Takes 1/3 on desktop */}
                    <div className="space-y-4">
                        {/* Quick Stats Card */}
                        <div className="bg-linear-to-br from-emerald-600 to-emerald-700 rounded-xl p-4 text-white shadow-lg">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <CheckCircle2 className="w-6 h-6 text-emerald-200 opacity-80 mb-1" />
                                    <h3 className="text-sm font-black">All Systems</h3>
                                    <p className="text-emerald-100 text-[10px] font-medium">Operational</p>
                                </div>
                                <div className="bg-emerald-500/30 px-2 py-1 rounded-lg">
                                    <span className="text-[9px] font-bold">99.9%</span>
                                </div>
                            </div>
                            <div className="bg-emerald-500/30 p-2 rounded-lg">
                                <div className="flex justify-between text-[9px] font-bold mb-1">
                                    <span>Storage</span>
                                    <span>12%</span>
                                </div>
                                <div className="w-full h-1 bg-emerald-900/20 rounded-full overflow-hidden">
                                    <div className="w-[12%] h-full bg-white rounded-full"></div>
                                </div>
                            </div>
                        </div>

                        {/* Performance Preview */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                                    <h3 className="text-sm font-bold text-slate-900">Performance</h3>
                                </div>
                                <span className="text-[9px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                                    +25%
                                </span>
                            </div>
                            <div className="h-16 bg-slate-50 rounded-lg flex items-center justify-center border border-slate-100">
                                <p className="text-[10px] text-slate-400 font-medium">Chart view coming soon</p>
                            </div>
                        </div>

                        {/* Total Overview */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-slate-600">Total Students</span>
                                    <span className="text-sm font-bold text-slate-900">{stats.totalStudents}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-slate-600">Active Courses</span>
                                    <span className="text-sm font-bold text-slate-900">{stats.totalCourses}</span>
                                </div>
                                <div className="flex justify-between items-center pt-1 border-t border-slate-100">
                                    <span className="text-xs text-slate-600">Total Revenue</span>
                                    <span className="text-sm font-bold text-emerald-600">{stats.totalRevenue ? `₹${stats.totalRevenue.toLocaleString()}` : '₹0'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Quick Actions Row - Only visible on mobile */}
                <div className="grid grid-cols-3 gap-2 mt-4 lg:hidden">
                    <button 
                        onClick={() => navigate('/admin/students')}
                        className="bg-white p-2 rounded-xl border border-slate-200 flex flex-col items-center gap-1 hover:bg-slate-50 transition-colors"
                    >
                        <Users className="w-4 h-4 text-emerald-600" />
                        <span className="text-[9px] font-medium text-slate-600">Students</span>
                    </button>
                    <button 
                        onClick={() => navigate('/admin/courses')}
                        className="bg-white p-2 rounded-xl border border-slate-200 flex flex-col items-center gap-1 hover:bg-slate-50 transition-colors"
                    >
                        <BookOpen className="w-4 h-4 text-emerald-600" />
                        <span className="text-[9px] font-medium text-slate-600">Courses</span>
                    </button>
                    <button 
                        onClick={() => navigate('/admin/finance')}
                        className="bg-white p-2 rounded-xl border border-slate-200 flex flex-col items-center gap-1 hover:bg-slate-50 transition-colors"
                    >
                        <CreditCard className="w-4 h-4 text-emerald-600" />
                        <span className="text-[9px] font-medium text-slate-600">Finance</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;