import React, { useState, useEffect } from 'react';
import { useApi } from '../context/ApiContext';
import { 
  MessageSquare, 
  Search, 
  Filter, 
  MoreVertical, 
  Phone, 
  User, 
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  Plus
} from 'lucide-react';
import toast from 'react-hot-toast';

const Inquiries = () => {
    const api = useApi();
    const [inquiries, setInquiries] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        message: '',
        courseInterested: ''
    });

    useEffect(() => {
        fetchData();
    }, [api]);

    const fetchData = async () => {
        try {
            const [inquiriesRes, coursesRes] = await Promise.all([
                api.get('/api/inquiries'),
                api.get('/api/courses')
            ]);
            setInquiries(inquiriesRes.data.data);
            setCourses(coursesRes.data.data);
        } catch (error) {
            toast.error('Failed to fetch inquiries');
        } finally {
            setLoading(false);
        }
    };

    const handleAddInquiry = async (e) => {
        e.preventDefault();
        try {
            await api.post('/api/inquiries', formData);
            toast.success('Inquiry submitted');
            setIsAddModalOpen(false);
            setFormData({ name: '', phone: '', message: '', courseInterested: '' });
            fetchData();
        } catch (error) {
            toast.error('Failed to submit inquiry');
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await api.put(`/api/inquiries/${id}`, { status });
            toast.success(`Marked as ${status}`);
            fetchData();
        } catch (error) {
            toast.error('Update failed');
        }
    };

    const filteredInquiries = inquiries.filter(inquiry => 
        inquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inquiry.phone.includes(searchTerm)
    );

    const getStatusColor = (status) => {
        switch(status) {
            case 'converted': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'contacted': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            default: return 'bg-amber-50 text-amber-600 border-amber-100';
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Leads & Inquiries</h1>
                    <p className="text-slate-500 font-medium mt-1">Track and convert potential student inquiries</p>
                </div>
                <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3.5 rounded-2xl font-bold shadow-lg shadow-emerald-200 transition-all active:scale-[0.98]"
                >
                    <Plus className="w-5 h-5" />
                    <span>New Lead</span>
                </button>
            </div>

            {/* Leads Listing */}
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Search leads..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-emerald-500 transition-all text-slate-800 font-medium"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Lead Name</th>
                                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Interested In</th>
                                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Received On</th>
                                <th className="px-8 py-5"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredInquiries.length > 0 ? filteredInquiries.map((inquiry) => (
                                <tr key={inquiry._id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-slate-100 text-slate-400 rounded-xl flex items-center justify-center">
                                                <User className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900">{inquiry.name}</p>
                                                <p className="text-xs text-slate-500 flex items-center gap-1 font-medium mt-0.5">
                                                    <Phone className="w-3 h-3" /> {inquiry.phone}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="text-sm font-semibold text-slate-700">
                                            {inquiry.courseInterested?.title || 'General Inquiry'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(inquiry.status)}`}>
                                                {inquiry.status}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="text-sm font-semibold text-slate-500 flex items-center gap-2">
                                            <Calendar className="w-4 h-4 opacity-40" />
                                            {new Date(inquiry.createdAt).toLocaleDateString()}
                                        </p>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                            {inquiry.status !== 'converted' && (
                                                <button 
                                                    onClick={() => handleStatusUpdate(inquiry._id, inquiry.status === 'new' ? 'contacted' : 'converted')}
                                                    className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg"
                                                    title={inquiry.status === 'new' ? 'Mark Contacted' : 'Mark Converted'}
                                                >
                                                    <CheckCircle2 className="w-5 h-5" />
                                                </button>
                                            )}
                                            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg">
                                                <MoreVertical className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="px-8 py-16 text-center text-slate-400 italic">
                                        No active inquiries
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Inquiry Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsAddModalOpen(false)}></div>
                    <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in-95 duration-300 transition-all">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold text-slate-900">New Potential Lead</h2>
                            <button onClick={() => setIsAddModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-900 bg-slate-50 rounded-xl transition-all"><X /></button>
                        </div>

                        <form onSubmit={handleAddInquiry} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
                                <input 
                                    type="text" 
                                    placeholder="Lead name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 outline-none focus:bg-white focus:border-emerald-500 transition-all font-medium"
                                    required 
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Contact Phone</label>
                                <input 
                                    type="tel" 
                                    placeholder="e.g. 9876543210"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 outline-none focus:bg-white focus:border-emerald-500 transition-all font-medium"
                                    required 
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Interested Course</label>
                                <select 
                                    value={formData.courseInterested}
                                    onChange={(e) => setFormData({...formData, courseInterested: e.target.value})}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 outline-none focus:bg-white focus:border-emerald-500 transition-all font-medium appearance-none"
                                >
                                    <option value="">General Inquiry</option>
                                    {courses.map(course => (
                                        <option key={course._id} value={course._id}>{course.title}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Message/Note</label>
                                <textarea 
                                    placeholder="What are they asking about?"
                                    value={formData.message}
                                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 outline-none focus:bg-white focus:border-emerald-500 transition-all font-medium h-24 resize-none"
                                />
                            </div>

                            <button 
                                type="submit" 
                                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-5 rounded-4xl shadow-xl transform active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-6"
                            >
                                <span>Save Lead Details</span>
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const X = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

export default Inquiries;
