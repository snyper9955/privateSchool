import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApi } from '../context/ApiContext';
import { 
  Clock, 
  BookOpen, 
  CheckCircle2, 
  ChevronRight,
  ShieldCheck,
  Zap,
  Star,
  Users,
  Calendar,
  Award,
  Target,
  Info,
  ShoppingCart,
  Play,
  FileText,
  ClipboardList
} from 'lucide-react';
import toast from 'react-hot-toast';

const CourseDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const api = useApi();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [showMobileEnrollBar, setShowMobileEnrollBar] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Fetch single course details
                const { data } = await api.get(`/api/courses/${id}`);
                const found = data.data;
                if (found) {
                    setCourse(found);
                } else {
                    toast.error('Course not found');
                    navigate('/courses');
                    return;
                }

                // 2. Check if student is enrolled (from dashboard data)
                try {
                    const { data: dashData } = await api.get('/api/students/me/dashboard');
                    const enrolledIds = dashData.data?.courses?.map(c => c._id) || [];
                    if (enrolledIds.includes(id)) {
                        setIsEnrolled(true);
                    }
                } catch (err) {
                    // Not a student or profile not found yet, which is fine
                    console.log('Not enrolled or student profile not exists');
                }

            } catch (error) {
                console.error('Failed to fetch course detail', error);
                toast.error('Failed to load course details');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, api, navigate]);

    // Handle scroll for mobile enroll bar
    useEffect(() => {
        const handleScroll = () => {
            if (window.innerWidth < 1024) {
                const scrollPosition = window.scrollY;
                setShowMobileEnrollBar(scrollPosition > 300);
            }
        };
        
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleEnrollClick = () => {
        if (!isEnrolled && !course?.isFinished) {
            navigate(`/checkout/${course._id}`);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-3 border-gray-200 border-t-emerald-600 rounded-full animate-spin"></div>
                    <p className="text-sm text-gray-500 font-medium">Loading course details...</p>
                </div>
            </div>
        );
    }

    if (!course) return null;

    // Learning outcomes list
    const learningOutcomes = [
        "Comprehensive core concepts and fundamentals",
        "Hands-on practical projects and assignments",
        "Industry standard best practices and tools",
        "Exam preparation strategies and mock tests",
        "Personalized feedback and doubt clearing",
        "Lifetime access to course materials"
    ];

    const isButtonDisabled = isEnrolled || (course.isFinished && !isEnrolled);
    const buttonText = isEnrolled 
        ? 'Already Enrolled' 
        : course.isFinished 
        ? 'Admissions Closed'
        : 'Enroll Now';
    const buttonIcon = isEnrolled 
        ? <CheckCircle2 className="w-4 h-4" />
        : course.isFinished 
        ? <Clock className="w-4 h-4" />
        : <Zap className="w-4 h-4" />;

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-800 pt-24 pb-16">
            {/* Fixed Top Enroll Button - Desktop */}
            {!isButtonDisabled && (
                <div className="hidden lg:block fixed top-24 right-8 z-40">
                    <button
                        onClick={handleEnrollClick}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 shadow-lg transition-all hover:scale-105"
                    >
                        <ShoppingCart className="w-4 h-4" />
                        Enroll Now - ₹{course.fee?.toLocaleString()}
                    </button>
                </div>
            )}

            {/* Mobile Sticky Bottom Bar */}
            <div className={`lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 transition-transform duration-300 ${
                showMobileEnrollBar ? 'translate-y-0' : 'translate-y-full'
            }`}>
                <div className="px-4 py-3 flex items-center justify-between gap-3">
                    <div className="flex-1">
                        <p className="text-xs text-gray-500">Course Fee</p>
                        <p className="text-xl font-bold text-gray-900">₹{course.fee?.toLocaleString()}</p>
                        {course.originalFee && (
                            <p className="text-xs text-emerald-600">
                                Save ₹{(course.originalFee - course.fee).toLocaleString()}
                            </p>
                        )}
                    </div>
                    <button
                        onClick={handleEnrollClick}
                        disabled={isButtonDisabled}
                        className={`flex-1 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                            isEnrolled 
                                ? 'bg-emerald-50 text-emerald-600 cursor-default border border-emerald-100' 
                                : course.isFinished
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                        }`}
                    >
                        {buttonIcon}
                        {buttonText}
                    </button>
                </div>
            </div>

            {/* Breadcrumb */}
            <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Link to="/" className="hover:text-emerald-600 transition-colors">Home</Link>
                    <ChevronRight className="w-3.5 h-3.5" />
                    <Link to="/courses" className="hover:text-emerald-600 transition-colors">Courses</Link>
                    <ChevronRight className="w-3.5 h-3.5" />
                    <span className="text-gray-800 font-medium truncate">{course.title}</span>
                </div>
            </div>

            {/* Mobile Top Enroll Button Card (Visible before scroll) */}
            <div className="lg:hidden px-4 sm:px-6 mb-4">
                {!showMobileEnrollBar && !isButtonDisabled && (
                    <div className="bg-linear-to-r from-emerald-50 to-emerald-100 rounded-xl p-4 border border-emerald-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-emerald-700 font-medium">Limited Time Offer</p>
                                <p className="text-2xl font-bold text-emerald-900">₹{course.fee?.toLocaleString()}</p>
                                {course.originalFee && (
                                    <p className="text-xs text-emerald-600">
                                        <span className="line-through text-gray-500">₹{course.originalFee.toLocaleString()}</span>
                                        <span className="ml-1">Save ₹{(course.originalFee - course.fee).toLocaleString()}</span>
                                    </p>
                                )}
                            </div>
                            <button
                                onClick={handleEnrollClick}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 shadow-md"
                            >
                                <Zap className="w-4 h-4" />
                                Enroll Now
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content - Left Column */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Course Header Card */}
                        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                            {/* Course Image */}
                            <div className="relative aspect-video w-full overflow-hidden bg-linear-to-br from-emerald-500 to-emerald-700">
                                {course.image ? (
                                    <img 
                                        src={course.image} 
                                        alt={course.title} 
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <BookOpen className="w-16 h-16 text-white/20" />
                                    </div>
                                )}
                                {/* Category Badge */}
                                {course.category && (
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-emerald-700">
                                            {course.category}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="p-6 sm:p-8">
                                {/* Certification Badge */}
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-full mb-5">
                                    <Award className="w-3.5 h-3.5 text-emerald-600" />
                                    <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">
                                        Professional Certification
                                    </span>
                                </div>

                                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight mb-4">
                                    {course.title}
                                </h1>

                                {course.isFinished && (
                                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 flex items-start gap-3">
                                        <Info className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                                        <div>
                                            <p className="text-sm font-bold text-amber-900">Batch Completed</p>
                                            <p className="text-xs text-amber-700 mt-0.5">This course has finished and is no longer accepting new students. Existing students can still access all materials.</p>
                                        </div>
                                    </div>
                                )}
                                
                                <p className="text-gray-600 text-base leading-relaxed mb-6">
                                    {course.description || "Master the skills needed for a successful career with our comprehensive curriculum and expert mentorship."}
                                </p>

                                {/* Course Stats Grid */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-5 border-t border-b border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center">
                                            <Clock className="w-4 h-4 text-emerald-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase tracking-wide">Duration</p>
                                            <p className="font-semibold text-gray-800 text-sm">{course.duration || '3 Months'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center">
                                            <BookOpen className="w-4 h-4 text-emerald-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase tracking-wide">Modules</p>
                                            <p className="font-semibold text-gray-800 text-sm">{course.modules?.length || 0} Sections</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center">
                                            <Users className="w-4 h-4 text-emerald-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase tracking-wide">Students</p>
                                            <p className="font-semibold text-gray-800 text-sm">500+</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center">
                                            <ShieldCheck className="w-4 h-4 text-emerald-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase tracking-wide">Certificate</p>
                                            <p className="font-semibold text-gray-800 text-sm">Recognized</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* What You'll Learn Section */}
                        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                                    <Target className="w-5 h-5 text-emerald-600" />
                                </div>
                                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">What You'll Learn</h2>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {learningOutcomes.map((item, i) => (
                                    <div key={i} className="flex items-start gap-2.5">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                        <span className="text-gray-600 text-sm">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Batch Timing Card */}
                        {course.batchTiming && (
                            <div className="bg-linear-to-r from-gray-900 to-gray-800 rounded-2xl p-6 sm:p-8 text-white">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                                            <Calendar className="w-5 h-5 text-emerald-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold">Flexible Batch Timings</h3>
                                            <p className="text-gray-300 text-sm mt-0.5">
                                                Available: <span className="text-emerald-400 font-medium">{course.batchTiming}</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="bg-white/10 rounded-xl px-5 py-3 text-center">
                                        <p className="text-xs text-gray-300 uppercase tracking-wide">Limited Seats</p>
                                        <p className="text-2xl font-bold">8 left</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Course Syllabus Section */}
                        {course.modules?.length > 0 && (
                            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                                        <BookOpen className="w-5 h-5 text-emerald-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Program Syllabus</h2>
                                        <p className="text-gray-500 text-sm mt-1">Detailed breakdown of the learning path</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    {course.modules.map((module, mIdx) => (
                                        <div key={mIdx} className="bg-slate-50/50 rounded-2xl border border-slate-100 overflow-hidden">
                                            <div className="p-4 bg-white border-b border-slate-100 flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <span className="w-6 h-6 bg-emerald-100 text-emerald-700 text-[10px] font-black rounded-lg flex items-center justify-center">
                                                        {mIdx + 1}
                                                    </span>
                                                    <h4 className="font-bold text-slate-800 text-sm">{module.title}</h4>
                                                </div>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase">{module.lessons?.length || 0} Lessons</span>
                                            </div>
                                            <div className="p-2 space-y-1">
                                                {module.lessons?.map((lesson, lIdx) => (
                                                    <div key={lIdx} className="flex items-center gap-3 p-3 bg-white/50 rounded-xl">
                                                        <div className="w-1.5 h-1.5 bg-slate-300 rounded-full shrink-0"></div>
                                                        <span className="text-xs font-medium text-slate-600 truncate">{lesson.title}</span>
                                                        <div className="ml-auto flex items-center gap-1.5 shrink-0">
                                                            {lesson.videoUrl && <div className="w-5 h-5 bg-emerald-50 rounded flex items-center justify-center border border-emerald-100" title="Video Lecture"><Play className="w-2.5 h-2.5 text-emerald-600 fill-current" /></div>}
                                                            {lesson.notesUrl && (
                                                                <a 
                                                                    href={lesson.notesUrl.startsWith('http') ? lesson.notesUrl : `https://${lesson.notesUrl}`} 
                                                                    target="_blank" 
                                                                    rel="noopener noreferrer"
                                                                    className="w-5 h-5 bg-blue-50 rounded flex items-center justify-center border border-blue-100 hover:scale-110 transition-all" 
                                                                    title="Open Study Notes"
                                                                >
                                                                    <FileText className="w-2.5 h-2.5 text-blue-600" />
                                                                </a>
                                                            )}
                                                            {lesson.assignmentUrl && (
                                                                <a 
                                                                    href={lesson.assignmentUrl.startsWith('http') ? lesson.assignmentUrl : `https://${lesson.assignmentUrl}`} 
                                                                    target="_blank" 
                                                                    rel="noopener noreferrer"
                                                                    className="w-5 h-5 bg-amber-50 rounded flex items-center justify-center border border-amber-100 hover:scale-110 transition-all" 
                                                                    title="Open Assignment"
                                                                >
                                                                    <ClipboardList className="w-2.5 h-2.5 text-amber-600" />
                                                                </a>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Additional Info */}
                        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                                    <Info className="w-5 h-5 text-blue-600" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900">Course Includes</h2>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                                    <span className="text-gray-600 text-sm">Live Interactive Sessions</span>
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                                    <span className="text-gray-600 text-sm">Recorded Lecture Access</span>
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                                    <span className="text-gray-600 text-sm">Study Materials & Notes</span>
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                                    <span className="text-gray-600 text-sm">Doubt Clearing Support</span>
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                                    <span className="text-gray-600 text-sm">Weekly Mock Tests</span>
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                                    <span className="text-gray-600 text-sm">Completion Certificate</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - Right Column (Sticky) */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-28">
                            {/* Enrollment Card */}
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                                <div className="p-6 border-b border-gray-100 bg-linear-to-r from-gray-50 to-white">
                                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Total Investment</p>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-3xl font-bold text-gray-900">₹{course.fee?.toLocaleString()}</span>
                                        {course.originalFee && (
                                            <span className="text-sm text-gray-400 line-through ml-2">
                                                ₹{course.originalFee.toLocaleString()}
                                            </span>
                                        )}
                                    </div>
                                    {course.originalFee && (
                                        <p className="text-xs text-emerald-600 font-medium mt-1">
                                            Save ₹{(course.originalFee - course.fee).toLocaleString()}
                                        </p>
                                    )}
                                </div>

                                <div className="p-6 space-y-4">
                                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                        <span className="text-sm text-gray-600">Access Duration</span>
                                        <span className="text-sm font-semibold text-gray-800">Lifetime</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                        <span className="text-sm text-gray-600">Difficulty Level</span>
                                        <span className="text-sm font-semibold text-gray-800">Beginner to Advanced</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2">
                                        <span className="text-sm text-gray-600">Language</span>
                                        <span className="text-sm font-semibold text-gray-800">English / Hindi</span>
                                    </div>
                                </div>

                                <div className="p-6 pt-0">
                                    <button 
                                        onClick={handleEnrollClick}
                                        disabled={isButtonDisabled}
                                        className={`w-full py-3.5 rounded-xl font-semibold text-base flex items-center justify-center gap-2 transition-all ${
                                            isEnrolled 
                                                ? 'bg-emerald-50 text-emerald-600 cursor-default border border-emerald-100' 
                                                : course.isFinished
                                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                                        }`}
                                    >
                                        {buttonIcon}
                                        {buttonText}
                                    </button>
                                    <p className="text-center text-xs text-gray-400 mt-4">
                                        Secure payment via Razorpay
                                    </p>
                                </div>
                            </div>

                            {/* Quick Info Card */}
                            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mt-6">
                                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                                    Why This Course?
                                </h3>
                                <ul className="space-y-2.5">
                                    <li className="flex items-start gap-2 text-sm text-gray-600">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                                        <span>Expert faculty with 10+ years experience</span>
                                    </li>
                                    <li className="flex items-start gap-2 text-sm text-gray-600">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                                        <span>Industry-recognized certification</span>
                                    </li>
                                    <li className="flex items-start gap-2 text-sm text-gray-600">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                                        <span>Placement assistance program</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDetail;