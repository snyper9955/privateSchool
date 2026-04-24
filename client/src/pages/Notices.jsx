import React, { useState, useEffect } from 'react';
import { useApi } from '../context/ApiContext';
import { 
  Bell, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Trash2, 
  Edit3, 
  Clock, 
  CheckCircle2, 
  Tag, 
  ArrowRight,
  FileText,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';

const Notices = () => {
    const api = useApi();
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [showFilters, setShowFilters] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category: 'General',
        isActive: true
    });

    const categories = ['All', 'General', 'Exam', 'Holiday', 'Admission', 'Event'];

    useEffect(() => {
        fetchNotices();
    }, [api]);

    const fetchNotices = async () => {
        try {
            const { data } = await api.get('/api/notices/admin');
            setNotices(data.data);
        } catch (error) {
            toast.error('Failed to fetch notices');
        } finally {
            setLoading(false);
        }
    };

    const handleAddNotice = async (e) => {
        e.preventDefault();
        if (!formData.title.trim() || !formData.content.trim()) {
            toast.error('Please fill in all required fields');
            return;
        }
        try {
            await api.post('/api/notices', formData);
            toast.success('Notice published successfully');
            setIsAddModalOpen(false);
            setFormData({ title: '', content: '', category: 'General', isActive: true });
            fetchNotices();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to publish notice');
        }
    };

    const handleDeleteNotice = async (id) => {
        if (!window.confirm('Are you sure you want to delete this notice?')) return;
        try {
            await api.delete(`/api/notices/${id}`);
            toast.success('Notice deleted');
            fetchNotices();
        } catch (error) {
            toast.error('Failed to delete notice');
        }
    };

    const toggleNoticeStatus = async (id, currentStatus) => {
        try {
            await api.put(`/api/notices/${id}`, { isActive: !currentStatus });
            toast.success('Notice status updated');
            fetchNotices();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const filteredNotices = notices.filter(notice => {
        const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             notice.content.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || notice.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 to-white pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 lg:py-8 space-y-5 sm:space-y-6 lg:space-y-8">
                
                {/* Page Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                            Notice <span className="text-blue-600">Board</span>
                        </h1>
                        <p className="text-slate-500 text-sm sm:text-base mt-1">Manage announcements and student notifications</p>
                    </div>
                    <button 
                        onClick={() => setIsAddModalOpen(true)}
                        className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 sm:px-6 py-3 rounded-xl sm:rounded-2xl font-bold shadow-lg shadow-blue-200 transition-all active:scale-95 text-sm sm:text-base"
                    >
                        <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span>Create Notice</span>
                    </button>
                </div>

                {/* Search & Filters */}
                <div className="space-y-3">
                    <div className="flex gap-2">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 sm:w-5 sm:h-5" />
                            <input 
                                type="text" 
                                placeholder="Search notices..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 sm:pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl sm:rounded-2xl outline-none focus:border-blue-500 transition-all text-sm sm:text-base"
                            />
                        </div>
                        <button 
                            onClick={() => setShowFilters(!showFilters)}
                            className="px-4 py-3 bg-white border border-slate-200 rounded-xl sm:rounded-2xl text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                            <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                    </div>
                    
                    {/* Filter Chips */}
                    {showFilters && (
                        <div className="flex flex-wrap gap-2 animate-in slide-in-from-top-2 duration-200">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
                                        selectedCategory === cat
                                            ? 'bg-blue-600 text-white shadow-md'
                                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Stats Summary */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-white rounded-xl p-3 border border-slate-200">
                        <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase">Total</p>
                        <p className="text-xl sm:text-2xl font-black text-slate-900">{notices.length}</p>
                    </div>
                    <div className="bg-white rounded-xl p-3 border border-slate-200">
                        <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase">Active</p>
                        <p className="text-xl sm:text-2xl font-black text-emerald-600">{notices.filter(n => n.isActive).length}</p>
                    </div>
                    <div className="bg-white rounded-xl p-3 border border-slate-200">
                        <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase">Inactive</p>
                        <p className="text-xl sm:text-2xl font-black text-slate-400">{notices.filter(n => !n.isActive).length}</p>
                    </div>
                    <div className="bg-white rounded-xl p-3 border border-slate-200">
                        <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase">Categories</p>
                        <p className="text-xl sm:text-2xl font-black text-blue-600">{new Set(notices.map(n => n.category)).size}</p>
                    </div>
                </div>

                {/* Notices Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
                    {filteredNotices.length > 0 ? filteredNotices.map((notice) => (
                        <div key={notice._id} className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200 hover:shadow-xl transition-all group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-full -mr-12 -mt-12 group-hover:bg-blue-50 transition-colors"></div>
                            
                            <div className="flex justify-between items-start mb-4">
                                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center ${
                                    notice.isActive ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-400'
                                }`}>
                                    <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
                                </div>
                                <div className="flex items-center gap-1 sm:gap-2">
                                    <button 
                                        onClick={() => toggleNoticeStatus(notice._id, notice.isActive)}
                                        className={`p-1.5 sm:p-2 rounded-lg border transition-all ${
                                            notice.isActive 
                                                ? 'text-emerald-600 bg-emerald-50 border-emerald-100' 
                                                : 'text-slate-400 bg-slate-50 border-slate-100'
                                        }`}
                                        title={notice.isActive ? 'Deactivate' : 'Activate'}
                                    >
                                        <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    </button>
                                    <button 
                                        onClick={() => handleDeleteNotice(notice._id)}
                                        className="p-1.5 sm:p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                                    >
                                        <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 mb-3">
                                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                                    {notice.category}
                                </span>
                                <span className="text-[9px] sm:text-[10px] font-medium text-slate-400 flex items-center gap-1">
                                    <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> 
                                    {new Date(notice.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </span>
                                {!notice.isActive && (
                                    <span className="text-[9px] sm:text-[10px] font-black text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full">
                                        Inactive
                                    </span>
                                )}
                            </div>

                            <h3 className="text-base sm:text-lg lg:text-xl font-black text-slate-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                                {notice.title}
                            </h3>
                            <p className="text-slate-600 text-xs sm:text-sm font-medium leading-relaxed mb-4 line-clamp-3">
                                {notice.content}
                            </p>

                            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-1.5 text-slate-400">
                                    <FileText className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                    <span className="text-[9px] sm:text-[10px] font-medium uppercase tracking-wider">
                                        Notice
                                    </span>
                                </div>
                                <div className="text-[9px] sm:text-[10px] text-slate-400">
                                    {new Date(notice.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="col-span-full py-12 sm:py-16 text-center bg-white rounded-2xl sm:rounded-3xl border border-slate-200">
                            <Bell className="w-12 h-12 sm:w-16 sm:h-16 text-slate-300 mx-auto mb-3 sm:mb-4" />
                            <p className="text-slate-400 font-medium text-sm sm:text-base">No notices found</p>
                            {searchTerm && (
                                <button 
                                    onClick={() => setSearchTerm('')}
                                    className="mt-3 text-blue-600 text-xs sm:text-sm font-semibold underline"
                                >
                                    Clear search
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Add Notice Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
                    <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)}></div>
                    <div className="relative bg-white w-full max-w-lg rounded-2xl sm:rounded-3xl shadow-2xl max-h-[90vh] flex flex-col">
                        
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-white rounded-t-2xl sm:rounded-t-3xl border-b border-slate-100 px-5 sm:px-6 py-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Create New Notice</h2>
                                <button 
                                    onClick={() => setIsAddModalOpen(false)} 
                                    className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
                            <form onSubmit={handleAddNotice} className="space-y-4">
                                <div>
                                    <label className="text-sm font-bold text-slate-700 block mb-2">
                                        Notice Title <span className="text-rose-500">*</span>
                                    </label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. Upcoming Semester Holidays"
                                        value={formData.title}
                                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:bg-white focus:border-blue-500 transition-all text-sm"
                                        required 
                                    />
                                </div>
                                
                                <div>
                                    <label className="text-sm font-bold text-slate-700 block mb-2">Category</label>
                                    <select 
                                        value={formData.category}
                                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:bg-white focus:border-blue-500 transition-all text-sm appearance-none"
                                    >
                                        <option value="General">📢 General Announcement</option>
                                        <option value="Exam">📝 Exam Notification</option>
                                        <option value="Holiday">🎉 Holiday Notice</option>
                                        <option value="Admission">🎓 Admission Update</option>
                                        <option value="Event">🎪 Event Alert</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label className="text-sm font-bold text-slate-700 block mb-2">
                                        Notice Content <span className="text-rose-500">*</span>
                                    </label>
                                    <textarea 
                                        placeholder="Write your announcement here..."
                                        value={formData.content}
                                        onChange={(e) => setFormData({...formData, content: e.target.value})}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:bg-white focus:border-blue-500 transition-all text-sm h-28 resize-none"
                                        required
                                    />
                                </div>

                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                    <span className="text-sm font-medium text-slate-700">Publish immediately</span>
                                    <button 
                                        type="button"
                                        onClick={() => setFormData({...formData, isActive: !formData.isActive})}
                                        className={`w-11 h-6 rounded-full transition-colors relative ${
                                            formData.isActive ? 'bg-blue-600' : 'bg-slate-300'
                                        }`}
                                    >
                                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                                            formData.isActive ? 'right-1' : 'left-1'
                                        }`}></div>
                                    </button>
                                </div>

                                <button 
                                    type="submit" 
                                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl shadow-lg transform active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4"
                                >
                                    <span>Publish Notice</span>
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Notices;