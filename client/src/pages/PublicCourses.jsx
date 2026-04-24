import React, { useState, useEffect } from 'react';
import { useApi } from '../context/ApiContext';
import { BookOpen, Clock, IndianRupee, Search, ChevronRight, GraduationCap, Users, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

const PublicCourses = () => {
    const api = useApi();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const { data } = await api.get('/api/courses');
                setCourses(data.data || []);
            } catch (error) {
                console.error('Failed to fetch courses', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, [api]);

    // Get unique categories from courses
    const categories = ['all', ...new Set(courses.map(course => course.category).filter(Boolean))];

    const filteredCourses = courses.filter(course => {
        const matchesSearch = (course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.description?.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
        const isRunning = !course.isFinished;
        return matchesSearch && matchesCategory && isRunning;
    });

    return (
        <div className="min-h-screen bg-gray-50 font-sans pt-24 pb-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Page Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-full mb-4">
                        <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">
                            Start Learning Today
                        </span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight mb-4">
                        Our <span className="text-emerald-600">Courses</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-gray-500 text-lg">
                        Explore our wide range of expert-led coaching programs designed to help you achieve academic excellence.
                    </p>
                </div>

                {/* Search and Filter Section */}
                <div className="max-w-4xl mx-auto mb-12">
                    {/* Search Bar */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-4">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input 
                                type="text" 
                                placeholder="Search for courses by title or description..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all text-gray-700"
                            />
                        </div>
                    </div>

                    {/* Category Filters */}
                    {categories.length > 1 && (
                        <div className="flex flex-wrap gap-2 justify-center">
                            {categories.map(category => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                                        selectedCategory === category
                                            ? 'bg-emerald-600 text-white shadow-sm'
                                            : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                                    }`}
                                >
                                    {category === 'all' ? 'All Courses' : category}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Results Stats */}
                {!loading && filteredCourses.length > 0 && (
                    <div className="text-center mb-8">
                        <p className="text-sm text-gray-500">
                            Showing <span className="font-semibold text-gray-700">{filteredCourses.length}</span> courses
                        </p>
                    </div>
                )}

                {/* Courses Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
                                <div className="aspect-video bg-gray-100"></div>
                                <div className="p-5">
                                    <div className="h-5 bg-gray-100 rounded w-3/4 mb-3"></div>
                                    <div className="h-4 bg-gray-100 rounded w-full mb-2"></div>
                                    <div className="h-4 bg-gray-100 rounded w-5/6 mb-4"></div>
                                    <div className="flex justify-between items-center">
                                        <div className="h-6 bg-gray-100 rounded w-20"></div>
                                        <div className="h-8 bg-gray-100 rounded w-24"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredCourses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCourses.map((course) => (
                            <Link 
                                to={`/course/${course._id}`} 
                                key={course._id} 
                                className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 flex flex-col h-full"
                            >
                                {/* Course Image */}
                                <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
                                    {course.image ? (
                                        <img 
                                            src={course.image} 
                                            alt={course.title} 
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-emerald-50 to-blue-50">
                                            <BookOpen className="w-10 h-10 text-emerald-300" />
                                        </div>
                                    )}
                                    
                                    {/* Duration Badge */}
                                    {course.duration && (
                                        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-medium text-gray-700 flex items-center gap-1 shadow-sm">
                                            <Clock className="w-3 h-3" />
                                            {course.duration}
                                        </div>
                                    )}

                                    {/* Finished/Closed Badge */}
                                    {course.isFinished && (
                                        <div className="absolute top-3 right-3 bg-rose-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-rose-200 animate-pulse">
                                            Admissions Closed
                                        </div>
                                    )}
                                </div>

                                <div className="p-5 flex flex-col flex-1">
                                    {/* Category Tag */}
                                    {course.category && (
                                        <span className="inline-block text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full mb-3 self-start">
                                            {course.category}
                                        </span>
                                    )}

                                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors line-clamp-1">
                                        {course.title}
                                    </h3>
                                    
                                    <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-1">
                                        {course.description || 'Comprehensive learning program designed for maximum success and mastery of concepts.'}
                                    </p>

                                    {/* Batch Timing */}
                                    {course.batchTiming && (
                                        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
                                            <Clock className="w-3.5 h-3.5" />
                                            <span>{course.batchTiming}</span>
                                        </div>
                                    )}

                                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                                        <div className="flex items-baseline gap-1">
                                            <IndianRupee className="w-4 h-4 text-emerald-600" />
                                            <span className="text-xl font-bold text-emerald-600">
                                                {course.fee?.toLocaleString()}
                                            </span>
                                            {course.originalFee && (
                                                <span className="text-xs text-gray-400 line-through ml-1">
                                                    ₹{course.originalFee.toLocaleString()}
                                                </span>
                                            )}
                                        </div>
                                        
                                        <div className="flex items-center gap-1 text-emerald-600 font-medium text-sm group-hover:gap-2 transition-all">
                                            <span>View Details</span>
                                            <ChevronRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <BookOpen className="w-8 h-8 text-gray-300" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">No Courses Found</h3>
                        <p className="text-gray-500 max-w-md mx-auto">
                            We couldn't find any courses matching your search criteria. Try adjusting your search or browse all courses.
                        </p>
                        <button 
                            onClick={() => {
                                setSearchTerm('');
                                setSelectedCategory('all');
                            }}
                            className="mt-6 px-5 py-2 bg-emerald-50 text-emerald-600 rounded-lg text-sm font-medium hover:bg-emerald-100 transition-colors"
                        >
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PublicCourses;