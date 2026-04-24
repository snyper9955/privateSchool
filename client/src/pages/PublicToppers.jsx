import React, { useState, useEffect } from 'react';
import { useApi } from '../context/ApiContext';
import { Award, Star, Search, GraduationCap, TrendingUp, Sparkles, User, Medal, Trophy, Crown, ChevronRight, Filter, X, Calendar, BookOpen, Users } from 'lucide-react';

const PublicToppers = () => {
    const api = useApi();
    const [toppers, setToppers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedYear, setSelectedYear] = useState('all');
    const [selectedCourse, setSelectedCourse] = useState('all');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [visibleCount, setVisibleCount] = useState(8);
    const getImageUrl = (imagePath) => {
        if (!imagePath) return null;
        if (imagePath.startsWith('http')) return imagePath;
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        return `${baseUrl.replace(/\/$/, '')}${imagePath}`;
    };

    useEffect(() => {
        const fetchToppers = async () => {
            try {
                const { data } = await api.get('/api/toppers');
                const sortedToppers = (data.data || []).sort((a, b) => {
                    const scoreA = parseFloat(a.rank?.match(/(\d+(\.\d+)?)/)?.[0]) || 0;
                    const scoreB = parseFloat(b.rank?.match(/(\d+(\.\d+)?)/)?.[0]) || 0;
                    return scoreB - scoreA;
                });
                setToppers(sortedToppers);
            } catch (error) {
                console.error('Failed to fetch toppers', error);
            } finally {
                setLoading(false);
            }
        };
        fetchToppers();
    }, [api]);

    // Get unique years and courses
    const years = ['all', ...new Set(toppers.map(topper => topper.year).filter(Boolean))];
    const courses = ['all', ...new Set(toppers.map(topper => topper.course).filter(Boolean))];

    const filteredToppers = toppers.filter(topper => {
        const matchesSearch = topper.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            topper.course?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            topper.rank?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesYear = selectedYear === 'all' || topper.year === selectedYear;
        const matchesCourse = selectedCourse === 'all' || topper.course === selectedCourse;
        return matchesSearch && matchesYear && matchesCourse;
    });

    const displayedToppers = filteredToppers.slice(0, visibleCount);
    const hasMore = visibleCount < filteredToppers.length;

    // Get rank badge configuration
    const getRankConfig = (rank) => {
        const rankNum = parseInt(rank);
        if (rankNum === 1) return {
            color: 'from-amber-500 to-amber-600',
            bg: 'bg-amber-50',
            text: 'text-amber-700',
            border: 'border-amber-200',
            icon: <Crown className="w-3 h-3" />,
            label: 'Gold Medalist'
        };
        if (rankNum === 2) return {
            color: 'from-gray-400 to-gray-500',
            bg: 'bg-gray-50',
            text: 'text-gray-700',
            border: 'border-gray-200',
            icon: <Medal className="w-3 h-3" />,
            label: 'Silver Medalist'
        };
        if (rankNum === 3) return {
            color: 'from-orange-400 to-orange-500',
            bg: 'bg-orange-50',
            text: 'text-orange-700',
            border: 'border-orange-200',
            icon: <Award className="w-3 h-3" />,
            label: 'Bronze Medalist'
        };
        return {
            color: 'from-emerald-400 to-emerald-500',
            bg: 'bg-emerald-50',
            text: 'text-emerald-700',
            border: 'border-emerald-200',
            icon: <Star className="w-3 h-3" />,
            label: 'Top Achiever'
        };
    };

    // Calculate stats
    const totalAchievers = toppers.length;
    const uniqueCourses = new Set(toppers.map(t => t.course)).size;
    const topRankers = toppers.filter(t => parseInt(t.rank) <= 3).length;

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50 font-sans pt-20 pb-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Compact Header */}
                <div className="text-center mb-6">
                   
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
                        Mourya Academy {' '}
                        <span className="bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                             Toppers
                        </span>
                    </h1>
                </div>

                {/* Compact Search and Filter */}
                <div className="mb-6">
                   
                </div>

                {/* Results Count */}
                {!loading && filteredToppers.length > 0 && (
                    <p className="text-xs text-gray-500 mb-3">
                        {filteredToppers.length} achiever{filteredToppers.length !== 1 ? 's' : ''}
                    </p>
                )}  

                {/* Compact Toppers Grid - 4 columns on desktop */}
                {loading ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="bg-white rounded-xl overflow-hidden border border-gray-100 animate-pulse">
                                <div className="p-3">
                                    <div className="w-20 h-20 bg-gray-200 rounded-lg mx-auto mb-2"></div>
                                    <div className="h-3 bg-gray-200 rounded w-16 mx-auto mb-1"></div>
                                    <div className="h-2 bg-gray-200 rounded w-12 mx-auto"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredToppers.length > 0 ? (
                    <>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                            {displayedToppers.map((topper, index) => {
                                const rankConfig = getRankConfig(topper.rank);
                                return (
                                    <div 
                                        key={topper._id} 
                                        className="group bg-white rounded-xl overflow-hidden relative aspect-[3/4.5] shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
                                    >
                                        {/* Topper Image */}
                                        {topper.image ? (
                                            <img 
                                                src={getImageUrl(topper.image)} 
                                                alt={topper.name} 
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-linear-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                                                <User className="w-12 h-12 text-emerald-600" />
                                            </div>
                                        )}

                                    

                                   
                                    </div>
                                );
                            })}
                            
                        </div>
                <h1 className="text-center mt-10 text-xl font-bold text-green-950 tracking-tight bg-green-200 border border-green-400 p-2 rounded-lg">All Toppers List coming soon ...</h1>

                        
                        {/* Load More Button - Only if needed */}
                        {hasMore && (
                            <div className="text-center mt-6">
                                <button
                                    onClick={() => setVisibleCount(prev => prev + 8)}
                                    className="px-5 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:border-emerald-300 hover:text-emerald-600 transition-all duration-200"
                                >
                                    Load More ({filteredToppers.length - visibleCount} remaining)
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    // Compact Empty State
                    <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
                        <Award className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <h3 className="text-lg font-bold text-gray-800 mb-1">No Achievers Found</h3>
                        <p className="text-xs text-gray-500 mb-3">
                            {searchTerm || selectedYear !== 'all' || selectedCourse !== 'all'
                                ? "Try adjusting your filters"
                                : "Achievers will appear here"}
                        </p>
                        {(searchTerm || selectedYear !== 'all' || selectedCourse !== 'all') && (
                            <button 
                                onClick={() => {
                                    setSearchTerm('');
                                    setSelectedYear('all');
                                    setSelectedCourse('all');
                                }}
                                className="px-4 py-1.5 bg-emerald-500 text-white rounded-lg text-xs font-medium"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PublicToppers;