import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApi } from '../../context/ApiContext';
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  FileText, 
  ClipboardList, 
  CheckCircle2, 
  Circle,
  Menu,
  X,
  ExternalLink,
  BookOpen,
  CreditCard
} from 'lucide-react';
import toast from 'react-hot-toast';

const CourseContent = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const api = useApi();
    const [course, setCourse] = useState(null);
    const [studentData, setStudentData] = useState(null);
    const [activeLesson, setActiveLesson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                // Fetch student data first to check fee status
                const { data: studentRes } = await api.get('/api/students/me/dashboard');
                setStudentData(studentRes.data);

                // Fetch course content
                const { data: courseRes } = await api.get(`/api/courses/${courseId}`);
                const foundCourse = courseRes.data;
                
                if (foundCourse) {
                    setCourse(foundCourse);
                    // Set first lesson as default if available
                    if (foundCourse.modules?.length > 0 && foundCourse.modules[0].lessons?.length > 0) {
                        setActiveLesson(foundCourse.modules[0].lessons[0]);
                    }
                } else {
                    toast.error('Course not found');
                    navigate('/student/dashboard');
                }
            } catch (error) {
                console.error('Failed to load course content', error);
                toast.error('Error loading content');
            } finally {
                setLoading(false);
            }
        };
        fetchContent();
    }, [courseId, api, navigate]);

    // Helper to get YouTube embed URL
    const getEmbedUrl = useCallback((url) => {
        if (!url) return null;
        let videoId = '';
        if (url.includes('youtube.com/watch?v=')) {
            videoId = url.split('v=')[1]?.split('&')[0];
        } else if (url.includes('youtu.be/')) {
            videoId = url.split('youtu.be/')[1]?.split('?')[0];
        }
        return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }, []);

    // Helper to ensure URL has protocol
    const formatUrl = (url) => {
        if (!url) return '#';
        if (!/^https?:\/\//i.test(url)) {
            return `https://${url}`;
        }
        return url;
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-slate-50 gap-4">
                <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
                <p className="text-slate-500 font-medium animate-pulse">Preparing your learning environment...</p>
            </div>
        );
    }

    if (!course) return null;

    return (
        <div className="flex h-screen bg-white overflow-hidden font-sans">
            {/* Sidebar Toggle for Mobile */}
            <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className={`lg:hidden fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full shadow-2xl flex items-center justify-center transition-all ${
                    sidebarOpen ? 'bg-slate-900 rotate-180' : 'bg-emerald-600'
                } text-white`}
            >
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Sidebar - Course Structure */}
            <div className={`fixed inset-y-0 left-0 z-40 w-80 bg-slate-50 border-r border-slate-100 transform transition-transform duration-300 lg:relative lg:translate-x-0 ${
                sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}>
                <div className="h-full flex flex-col">
                    <div className="p-6 border-b border-slate-100 bg-white shadow-sm">
                        <button 
                            onClick={() => navigate('/student/dashboard')}
                            className="flex items-center gap-2 text-slate-400 hover:text-emerald-600 text-[10px] font-black uppercase tracking-widest mb-4 transition-all group"
                        >
                            <div className="w-6 h-6 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-emerald-50 transition-colors">
                                <ChevronLeft className="w-3.5 h-3.5" />
                            </div>
                            Dashboard
                        </button>
                        <h2 className="font-extrabold text-slate-900 leading-tight text-lg tracking-tight">{course.title}</h2>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                        {course.modules?.length > 0 ? (
                            course.modules.map((module, mIdx) => (
                                <div key={module._id || mIdx} className="mb-6">
                                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                        <div className="w-1 h-3 bg-emerald-500 rounded-full"></div>
                                        {module.title}
                                    </h3>
                                    <div className="space-y-1">
                                        {module.lessons?.map((lesson, lIdx) => (
                                            <button
                                                key={lesson._id || lIdx}
                                                onClick={() => {
                                                    setActiveLesson(lesson);
                                                    if (window.innerWidth < 1024) setSidebarOpen(false);
                                                }}
                                                className={`w-full text-left p-3 rounded-xl flex items-start gap-3 transition-all ${
                                                    activeLesson?.title === lesson.title 
                                                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100' 
                                                        : 'hover:bg-white text-slate-600'
                                                }`}
                                            >
                                                <div className="shrink-0 mt-0.5">
                                                    {activeLesson?.title === lesson.title ? (
                                                        <Play className="w-4 h-4 fill-current" />
                                                    ) : (
                                                        <Circle className="w-4 h-4 text-slate-300" />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <span className="text-sm font-bold leading-snug block truncate">{lesson.title}</span>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        {lesson.videoUrl && (
                                                            <div className={`w-4 h-4 rounded flex items-center justify-center ${activeLesson?.title === lesson.title ? 'bg-white/20' : 'bg-slate-100'}`}>
                                                                <Play className={`w-2 h-2 ${activeLesson?.title === lesson.title ? 'text-white' : 'text-slate-500'} fill-current`} />
                                                            </div>
                                                        )}
                                                        {lesson.notesUrl && (
                                                            <a 
                                                                href={formatUrl(lesson.notesUrl)} 
                                                                target="_blank" 
                                                                rel="noopener noreferrer"
                                                                onClick={(e) => e.stopPropagation()}
                                                                className={`w-4 h-4 rounded flex items-center justify-center hover:scale-110 transition-all ${activeLesson?.title === lesson.title ? 'bg-white text-emerald-600' : 'bg-blue-50 text-blue-600'}`}
                                                                title="Open Study Notes"
                                                                aria-label="Open Study Notes"
                                                            >
                                                                <FileText className="w-2.5 h-2.5" />
                                                            </a>
                                                        )}
                                                        {lesson.assignmentUrl && (
                                                            <a 
                                                                href={formatUrl(lesson.assignmentUrl)} 
                                                                target="_blank" 
                                                                rel="noopener noreferrer"
                                                                onClick={(e) => e.stopPropagation()}
                                                                className={`w-4 h-4 rounded flex items-center justify-center hover:scale-110 transition-all ${activeLesson?.title === lesson.title ? 'bg-white text-emerald-600' : 'bg-amber-50 text-amber-600'}`}
                                                                title="Open Assignment"
                                                                aria-label="Open Assignment"
                                                            >
                                                                <ClipboardList className="w-2.5 h-2.5" />
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10">
                                <p className="text-slate-400 text-sm font-medium italic">No content uploaded yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto flex flex-col min-w-0">
                {activeLesson ? (
                    <>
                        {/* Video Header / Player */}
                        <div className="bg-slate-900 aspect-video w-full relative">
                            {getEmbedUrl(activeLesson.videoUrl) ? (
                                <iframe 
                                    className="w-full h-full"
                                    src={getEmbedUrl(activeLesson.videoUrl)}
                                    title={activeLesson.title}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-white/50 gap-4">
                                    <Play className="w-16 h-16 opacity-20" />
                                    <p className="font-medium">Video not available</p>
                                </div>
                            )}
                        </div>

                        {/* Lesson Details */}
                        <div className="max-w-4xl mx-auto w-full p-6 lg:p-12 space-y-8">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-100">
                                <div>
                                    <span className="inline-block bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md mb-2">
                                        Current Lesson
                                    </span>
                                    <h1 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
                                        {activeLesson.title}
                                    </h1>
                                </div>
                                <div className="flex items-center gap-3">
                                    {/* Navigation could go here */}
                                </div>
                            </div>

                            {/* Resource Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {activeLesson.notesUrl && (
                                    <a 
                                        href={formatUrl(activeLesson.notesUrl)} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center shadow-inner">
                                                <FileText className="w-6 h-6" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-slate-900 flex items-center justify-between">
                                                    Study Notes
                                                    <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </h4>
                                                <p className="text-xs text-slate-500 font-medium mt-1">Download PDF Materials</p>
                                            </div>
                                        </div>
                                    </a>
                                )}

                                {activeLesson.assignmentUrl && (
                                    <a 
                                        href={formatUrl(activeLesson.assignmentUrl)} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:border-amber-200 hover:bg-amber-50/30 transition-all group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center shadow-inner">
                                                <ClipboardList className="w-6 h-6" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-slate-900 flex items-center justify-between">
                                                    Assignment
                                                    <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </h4>
                                                <p className="text-xs text-slate-500 font-medium mt-1">Practice Questionnaire</p>
                                            </div>
                                        </div>
                                    </a>
                                )}
                            </div>

                            {!activeLesson.notesUrl && !activeLesson.assignmentUrl && (
                                <div className="py-20 text-center bg-slate-50 rounded-4xl border-2 border-dashed border-slate-200">
                                    <p className="text-slate-400 font-bold italic tracking-tight">No additional resources for this lesson</p>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-4">
                        <BookOpen className="w-16 h-16 opacity-10" />
                        <p className="font-bold tracking-tight italic">Select a lesson to begin learning</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CourseContent;
