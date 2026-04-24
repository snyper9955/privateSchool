import React, { useState, useEffect } from 'react';
import { useApi } from '../context/ApiContext';
import { 
  Award, 
  Plus, 
  Search, 
  Trash2, 
  User, 
  GraduationCap, 
  Star, 
  ArrowRight,
  TrendingUp,
  Image as ImageIcon,
  X,
  Crown,
  Medal,
  Trophy,
  Sparkles,
  Calendar,
  MessageSquare,
  ExternalLink,
  Pencil,
  Upload
} from 'lucide-react';
import toast from 'react-hot-toast';

const Toppers = () => {
    const api = useApi();
    const [toppers, setToppers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedYear, setSelectedYear] = useState('all');
    const [viewMode, setViewMode] = useState('grid');
    
    const [editingTopper, setEditingTopper] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        course: '',
        rank: '',
        year: new Date().getFullYear().toString(),
        message: '',
        image: '',
        isFeatured: false
    });

    const getImageUrl = (imagePath) => {
        if (!imagePath) return null;
        if (imagePath.startsWith('http')) return imagePath;
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        return `${baseUrl.replace(/\/$/, '')}${imagePath}`;
    };

    useEffect(() => {
        fetchToppers();
    }, [api]);

    const fetchToppers = async () => {
        try {
            const { data } = await api.get('/api/toppers');
            setToppers(data.data);
        } catch (error) {
            toast.error('Failed to fetch toppers');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenAddModal = () => {
        setEditingTopper(null);
        setFormData({ name: '', course: '', rank: '', year: new Date().getFullYear().toString(), message: '', image: '', isFeatured: false });
        setImageFile(null);
        setImagePreview(null);
        setIsAddModalOpen(true);
    };

    const handleEdit = (topper) => {
        setEditingTopper(topper);
        setFormData({
            name: topper.name,
            course: topper.course,
            rank: topper.rank,
            year: topper.year,
            message: topper.message || '',
            image: topper.image || '',
            isFeatured: topper.isFeatured
        });
        setImageFile(null);
        setImagePreview(topper.image ? getImageUrl(topper.image) : null);
        setIsAddModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.course || !formData.rank) {
            toast.error('Please fill in all required fields');
            return;
        }

        const data = new FormData();
        data.append('name', formData.name);
        data.append('course', formData.course);
        data.append('rank', formData.rank);
        data.append('year', formData.year);
        data.append('message', formData.message);
        data.append('isFeatured', formData.isFeatured);
        if (imageFile) {
            data.append('image', imageFile);
        } else {
            data.append('image', formData.image);
        }

        try {
            const topperId = editingTopper?._id || editingTopper?.id;
            
            if (editingTopper) {
                if (!topperId) {
                    toast.error('Cannot identify topper for update');
                    return;
                }
                const response = await api.put(`/api/toppers/${topperId}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                if (response.data.success) {
                    toast.success('Achiever details updated! ✨');
                }
            } else {
                const response = await api.post('/api/toppers', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                if (response.data.success) {
                    toast.success('Topper added to the gallery! 🎉');
                }
            }
            setIsAddModalOpen(false);
            fetchToppers();
        } catch (error) {
            console.error('Submit error:', error);
            toast.error(error.response?.data?.message || 'Failed to save topper');
        }
    };

    const handleDeleteTopper = async (id) => {
        if (!id) {
            toast.error('Invalid ID');
            return;
        }
        if (!window.confirm('Are you sure you want to remove this achiever?')) return;
        
        try {
            const response = await api.delete(`/api/toppers/${id}`);
            if (response.data.success) {
                toast.success('Achiever removed! 🗑️');
                fetchToppers();
            }
        } catch (error) {
            console.error('Delete error:', error);
            toast.error(error.response?.data?.message || 'Failed to remove achiever');
        }
    };

    const getRankIcon = (rank) => {
        const rankLower = rank.toLowerCase();
        if (rankLower.includes('1') || rankLower.includes('first') || rankLower.includes('air 1')) 
            return <Trophy className="w-5 h-5 text-amber-500" />;
        if (rankLower.includes('2') || rankLower.includes('second')) 
            return <Medal className="w-5 h-5 text-gray-400" />;
        if (rankLower.includes('3') || rankLower.includes('third')) 
            return <Medal className="w-5 h-5 text-amber-600" />;
        return <Award className="w-5 h-5 text-emerald-500" />;
    };

    const getRankColor = (rank) => {
        const rankLower = rank.toLowerCase();
        if (rankLower.includes('1') || rankLower.includes('first')) 
            return 'from-amber-500 to-orange-500';
        if (rankLower.includes('2') || rankLower.includes('second')) 
            return 'from-gray-400 to-gray-500';
        if (rankLower.includes('3') || rankLower.includes('third')) 
            return 'from-amber-600 to-amber-700';
        return 'from-emerald-500 to-teal-500';
    };

    const years = ['all', ...new Set(toppers.map(t => t.year))].sort().reverse();
    const filteredToppers = toppers.filter(topper => {
        const name = topper.name || '';
        const course = topper.course || '';
        const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             course.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesYear = selectedYear === 'all' || topper.year === selectedYear;
        return matchesSearch && matchesYear;
    });

    const featuredToppers = filteredToppers.filter(t => t.isFeatured);
    const regularToppers = filteredToppers.filter(t => !t.isFeatured);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-96 gap-4">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-gray-200 border-t-emerald-500 rounded-full animate-spin"></div>
                    <Award className="w-6 h-6 text-emerald-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <p className="text-gray-500 font-medium">Loading achievers gallery...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-12">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 rounded-3xl p-6 md:p-10 text-white">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-400/20 rounded-full blur-2xl -ml-24 -mb-24"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="bg-white/20 backdrop-blur-sm p-2 rounded-xl">
                                <Trophy className="w-6 h-6" />
                            </div>
                            <span className="text-sm font-semibold uppercase tracking-wider bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                                Hall of Fame
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold mb-2">Achievers Gallery</h1>
                        <p className="text-emerald-100 text-sm md:text-base max-w-md">
                            Celebrating excellence and inspiring the next generation of achievers
                        </p>
                    </div>
                    <button 
                        onClick={handleOpenAddModal}
                        className="inline-flex items-center gap-2 bg-white text-emerald-700 hover:bg-emerald-50 px-5 py-2.5 rounded-xl font-bold shadow-lg transition-all active:scale-95"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Achiever</span>
                    </button>
                </div>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm">
                    <p className="text-xs text-gray-400">Total Achievers</p>
                    <p className="text-2xl font-bold text-gray-800">{toppers.length}</p>
                </div>
                <div className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm">
                    <p className="text-xs text-gray-400">Featured</p>
                    <p className="text-2xl font-bold text-amber-500">{toppers.filter(t => t.isFeatured).length}</p>
                </div>
                <div className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm">
                    <p className="text-xs text-gray-400">Courses</p>
                    <p className="text-2xl font-bold text-emerald-500">{new Set(toppers.map(t => t.course)).size}</p>
                </div>
                <div className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm">
                    <p className="text-xs text-gray-400">Years Active</p>
                    <p className="text-2xl font-bold text-blue-500">{years.length - 1}</p>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search by name or course..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-emerald-500 focus:bg-white transition-all"
                        />
                    </div>
                    <div className="flex gap-2">
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                            className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-emerald-500"
                        >
                            {years.map(year => (
                                <option key={year} value={year}>
                                    {year === 'all' ? 'All Years' : year}
                                </option>
                            ))}
                        </select>
                        <div className="flex bg-gray-100 rounded-xl p-1">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`px-3 py-1.5 rounded-lg text-sm transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-emerald-600' : 'text-gray-500'}`}
                            >
                                Grid
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`px-3 py-1.5 rounded-lg text-sm transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-emerald-600' : 'text-gray-500'}`}
                            >
                                List
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Featured Section */}
            {featuredToppers.length > 0 && viewMode === 'grid' && (
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="w-5 h-5 text-amber-500" />
                        <h2 className="text-lg font-bold text-gray-800">Featured Achievers</h2>
                        <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Top Performers</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {featuredToppers.map((topper) => (
                            <FeaturedTopperCard 
                                key={topper._id} 
                                topper={topper} 
                                onDelete={handleDeleteTopper}
                                onEdit={handleEdit}
                                getRankIcon={getRankIcon}
                                getRankColor={getRankColor}
                                getImageUrl={getImageUrl}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Main Grid/List View */}
            <div>
                {filteredToppers.length > 0 ? (
                    viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {regularToppers.map((topper) => (
                                <TopperCard 
                                    key={topper._id} 
                                    topper={topper} 
                                    onDelete={handleDeleteTopper}
                                    onEdit={handleEdit}
                                    getRankIcon={getRankIcon}
                                    getRankColor={getRankColor}
                                    getImageUrl={getImageUrl}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredToppers.map((topper) => (
                                <ToListCard 
                                    key={topper._id} 
                                    topper={topper} 
                                    onDelete={handleDeleteTopper}
                                    onEdit={handleEdit}
                                    getRankIcon={getRankIcon}
                                />
                            ))}
                        </div>
                    )
                ) : (
                    <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
                        <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Award className="w-10 h-10 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-1">No achievers found</h3>
                        <p className="text-gray-400 text-sm">Try adjusting your search or add a new achiever</p>
                    </div>
                )}
            </div>

            {/* Add Modal */}
            {isAddModalOpen && (
                <TopperModal 
                    formData={formData}
                    setFormData={setFormData}
                    editingTopper={editingTopper}
                    imageFile={imageFile}
                    imagePreview={imagePreview}
                    setImagePreview={setImagePreview}
                    setImageFile={setImageFile}
                    onSubmit={handleSubmit}
                    onClose={() => setIsAddModalOpen(false)}
                />
            )}
        </div>
    );
};

// Featured Topper Card Component
const FeaturedTopperCard = ({ topper, onDelete, onEdit, getRankIcon, getRankColor, getImageUrl }) => (
    <div className="group relative bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all">
        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${getRankColor(topper.rank)} opacity-10 rounded-full blur-2xl`}></div>
        <div className="p-5">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className={`w-14 h-14 bg-gradient-to-br ${getRankColor(topper.rank)} rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
                        {topper.name?.charAt(0) || 'A'}
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-800 text-lg">{topper.name}</h3>
                        <p className="text-emerald-600 text-xs font-semibold flex items-center gap-1">
                            <GraduationCap className="w-3 h-3" /> {topper.course}
                        </p>
                    </div>
                </div>
                <div className="flex gap-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onEdit(topper)} className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-white rounded-lg transition-all shadow-sm">
                        <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => onDelete(topper._id || topper.id)} className="p-1.5 text-gray-400 hover:text-white hover:bg-red-500 rounded-lg transition-all shadow-sm">
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
            
            {(topper.image) && (
                <div className="mb-4 rounded-xl overflow-hidden h-40">
                    <img src={getImageUrl(topper.image)} alt={topper.name} className="w-full h-full object-cover" />
                </div>
            )}
            
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    {getRankIcon(topper.rank)}
                    <span className="font-bold text-gray-800">{topper.rank}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-400 text-xs">
                    <Calendar className="w-3 h-3" />
                    <span>{topper.year}</span>
                </div>
            </div>
            
            {topper.message && (
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3">
                    <div className="flex gap-2">
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-gray-600 italic">"{topper.message}"</p>
                    </div>
                </div>
            )}
            
            <div className="absolute top-3 right-3">
                <div className="bg-amber-400 text-white p-1 rounded-full shadow-md">
                    <Star className="w-3 h-3 fill-current" />
                </div>
            </div>
        </div>
    </div>
);

// Regular Topper Card Component
const TopperCard = ({ topper, onDelete, onEdit, getRankIcon, getRankColor, getImageUrl }) => (
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 overflow-hidden">
        <div className={`h-1.5 bg-gradient-to-r ${getRankColor(topper.rank)}`}></div>
        <div className="p-5">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 bg-gradient-to-br ${getRankColor(topper.rank)} rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md`}>
                        {topper.name?.charAt(0) || 'S'}
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-800">{topper.name}</h3>
                        <p className="text-emerald-600 text-xs font-medium">{topper.course}</p>
                    </div>
                </div>
                <div className="flex gap-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onEdit(topper)} className="p-1.5 text-gray-300 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all">
                        <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => onDelete(topper._id || topper.id)} className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
            
            {topper.image && (
                <div className="mb-4 rounded-xl overflow-hidden h-36">
                    <img src={getImageUrl(topper.image)} alt={topper.name} className="w-full h-full object-cover" />
                </div>
            )}
            
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5">
                    {getRankIcon(topper.rank)}
                    <span className="font-semibold text-gray-800 text-sm">{topper.rank}</span>
                </div>
                <div className="text-gray-400 text-xs flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {topper.year}
                </div>
            </div>
            
            {topper.message && (
                <p className="text-gray-500 text-xs italic line-clamp-2">"{topper.message}"</p>
            )}
        </div>
    </div>
);

// List View Card Component
const ToListCard = ({ topper, onDelete, onEdit, getRankIcon }) => (
    <div className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-all">
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center text-white font-bold shadow-md flex-shrink-0">
                {topper.name?.charAt(0) || 'S'}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                        <h3 className="font-bold text-gray-800">{topper.name}</h3>
                        <p className="text-emerald-600 text-xs">{topper.course}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                            {getRankIcon(topper.rank)}
                            <span className="text-sm font-semibold text-gray-700">{topper.rank}</span>
                        </div>
                        <span className="text-xs text-gray-400">{topper.year}</span>
                        <div className="flex items-center gap-1">
                            <button onClick={() => onEdit(topper)} className="p-1.5 text-gray-300 hover:text-blue-500 transition-colors">
                                <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => onDelete(topper._id || topper.id)} className="p-1.5 text-gray-300 hover:text-red-500 transition-colors">
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                </div>
                {topper.message && (
                    <p className="text-gray-500 text-xs mt-1 truncate">"{topper.message}"</p>
                )}
            </div>
        </div>
    </div>
);

// Topper Modal Component
const TopperModal = ({ formData, setFormData, editingTopper, imageFile, imagePreview, setImagePreview, setImageFile, onSubmit, onClose }) => {
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                            <Trophy className="w-4 h-4 text-emerald-600" />
                        </div>
                        <h2 className="text-lg font-bold text-gray-800">{editingTopper ? 'Edit Achiever' : 'Add New Achiever'}</h2>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
                        <X className="w-4 h-4" />
                    </button>
                </div>
                
                <form onSubmit={onSubmit} className="p-6 space-y-4">
                    {/* Image Preview / Upload */}
                    <div className="flex flex-col items-center gap-4 p-4 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50 hover:bg-white transition-all">
                        {imagePreview ? (
                            <div className="relative w-32 h-32 rounded-xl overflow-hidden shadow-md">
                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                <button 
                                    type="button"
                                    onClick={() => { setImagePreview(null); setImageFile(null); }}
                                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ) : (
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                                <ImageIcon className="w-8 h-8" />
                            </div>
                        )}
                        <div className="text-center">
                            <label className="cursor-pointer">
                                <span className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all shadow-sm">
                                    <Upload className="w-4 h-4" />
                                    {imagePreview ? 'Change Photo' : 'Upload photo'}
                                </span>
                                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                            </label>
                            <p className="text-[10px] text-gray-400 mt-2">JPG, PNG or WEBP. Max 5MB.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name *</label>
                            <input 
                                type="text" 
                                placeholder="Student name"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-500 focus:bg-white transition-all"
                                required 
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Course/Program *</label>
                            <input 
                                type="text" 
                                placeholder="e.g., IIT-JEE, NEET"
                                value={formData.course}
                                onChange={(e) => setFormData({...formData, course: e.target.value})}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-500 focus:bg-white transition-all"
                                required 
                            />
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Rank/Score *</label>
                            <input 
                                type="text" 
                                placeholder="e.g., AIR 15, 99.8%"
                                value={formData.rank}
                                onChange={(e) => setFormData({...formData, rank: e.target.value})}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-500 focus:bg-white transition-all"
                                required 
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Batch Year</label>
                            <input 
                                type="text" 
                                placeholder="2024"
                                value={formData.year}
                                onChange={(e) => setFormData({...formData, year: e.target.value})}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-500 focus:bg-white transition-all"
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Testimonial (Optional)</label>
                        <textarea 
                            placeholder="Inspirational message from the student..."
                            value={formData.message}
                            onChange={(e) => setFormData({...formData, message: e.target.value})}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-500 focus:bg-white transition-all resize-none h-20"
                        />
                    </div>

                    {!imageFile && (
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Or Image URL</label>
                            <input 
                                type="text" 
                                placeholder="https://example.com/photo.jpg"
                                value={formData.image}
                                onChange={(e) => setFormData({...formData, image: e.target.value})}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-500 focus:bg-white transition-all"
                            />
                        </div>
                    )}
                    
                    <div className="flex items-center gap-2 pt-2">
                        <input
                            type="checkbox"
                            id="isFeatured"
                            checked={formData.isFeatured}
                            onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})}
                            className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                        />
                        <label htmlFor="isFeatured" className="text-sm text-gray-700">
                            Feature this achiever (highlighted section)
                        </label>
                    </div>
                    
                    <button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-3 rounded-xl transition-all mt-4 shadow-lg shadow-emerald-200"
                    >
                        {editingTopper ? 'Save Changes' : 'Add to Hall of Fame'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Toppers;