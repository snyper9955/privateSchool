import React, { useState, useEffect } from "react";
import { useApi } from "../context/ApiContext";
import {
  BookOpen,
  Award,
  ArrowRight,
  Bell,
  Star,
  Users,
  Clock,
  GraduationCap,
  BarChart3,
  Sparkles,
  MessageCircle,
  Mail,
  MapPin,
  Phone,
  Play,
  ChevronRight,
  Calendar,
  TrendingUp,
  ChevronLeft,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Pause,
  Play as PlayIcon,
  Camera,
  ChevronDown,
  HelpCircle as HelpCircleIcon
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const api = useApi();
  const [notices, setNotices] = useState([]);
  const [toppers, setToppers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingNotices, setLoadingNotices] = useState(true);
  const [loadingToppers, setLoadingToppers] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http")) return imagePath;
    const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
    return `${baseUrl.replace(/\/$/, "")}${imagePath}`;
  };

  // Featured courses for carousel (use first 5 active courses)
  const featuredCourses = courses.filter((c) => !c.isFinished).slice(0, 5);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await api.get("/api/notices");
        setNotices(res.data.data);
      } catch (err) {
        console.error("Error fetching notices:", err);
      } finally {
        setLoadingNotices(false);
      }
    };

    const fetchToppers = async () => {
      try {
        const res = await api.get("/api/toppers");
        const sortedToppers = (res.data.data || []).sort((a, b) => {
          const scoreA = parseFloat(a.rank?.match(/(\d+(\.\d+)?)/)?.[0]) || 0;
          const scoreB = parseFloat(b.rank?.match(/(\d+(\.\d+)?)/)?.[0]) || 0;
          return scoreB - scoreA;
        });
        setToppers(sortedToppers);
      } catch (err) {
        console.error("Error fetching toppers:", err);
      } finally {
        setLoadingToppers(false);
      }
    };

    const fetchCourses = async () => {
      try {
        const res = await api.get("/api/courses");
        setCourses(res.data.data);
      } catch (err) {
        console.error("Error fetching courses:", err);
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchNotices();
    fetchToppers();
    fetchCourses();
  }, [api]);

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying || featuredCourses.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredCourses.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, featuredCourses.length]);

  const nextSlide = () => {
    if (featuredCourses.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % featuredCourses.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 3000);
  };

  const prevSlide = () => {
    if (featuredCourses.length === 0) return;
    setCurrentSlide(
      (prev) => (prev - 1 + featuredCourses.length) % featuredCourses.length,
    );
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 3000);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 3000);
  };

  // Features data
  const features = [
    {
      icon: BookOpen,
      title: "Expert Faculty",
      description:
        "Learn from industry professionals with years of teaching experience",
      gradient: "from-emerald-500 to-teal-600",
      bgGradient: "from-emerald-50/50 to-teal-50/50",
      color: "green-100",
      borderColor: "green-600",
    },
  
    {
      icon: Users,
      title: "Small Batches",
      description: "Personalized attention with limited students per batch",
      gradient: "from-purple-500 to-fuchsia-600",
      bgGradient: "from-purple-50/50 to-fuchsia-50/50",
      color: "purple-100",
      borderColor: "purple-100",
    },
    {
      icon: Award,
      title: "Proven Results",
      description: "Consistent track record of academic excellence",
      gradient: "from-amber-400 to-orange-500",
      bgGradient: "from-amber-50/50 to-orange-50/50",
      color: "amber-100",
      borderColor: "amber-600",
    },
    {
      icon: BarChart3,
      title: "Regular Tests",
      description: "Weekly assessments to track your progress",
      gradient: "from-rose-500 to-pink-600",
      bgGradient: "from-rose-50/50 to-pink-50/50",
      color: "red-200",
      borderColor: "red-600",
    },
    {
      icon: MessageCircle,
      title: "24/7 Support",
      description: "Doubt clearing sessions anytime you need",
      gradient: "from-cyan-500 to-blue-600",
      bgGradient: "from-cyan-50/50 to-blue-50/50",
      color: "blue-100",
      borderColor: "blue-600",
    },
  ];
  
  const homeFaqs = [
    {
      question: "Aap kis exam ke liye coaching dete hain?",
      answer: "CBSE Class VI to XII ke sabhi subjects ke liye coaching provides karte hain."
    },
    {
      question: "Class 10th result?",
      answer: "district topper"
    },
    {
      question: "Demo class available hai kya?",
      answer: "Haan, hum naye students ke liye 3 din ki bilkul FREE demo classes pradan karte hain."
    },
    {
      question: "Online + offline dono hai kya?",
      answer: "offline only + online (upcoming)"
    }
  ];

  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const Skeleton = ({ className }) => (
    <div className={`animate-pulse bg-slate-200 rounded-lg ${className}`}></div>
  );

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800 mt-20">
    {notices.length > 0 && (
  <section className="w-full bg-slate-50 border-b border-blue-100 overflow-hidden py-1">
    <div className="w-full px-3 sm:px-6 lg:px-8 flex items-center gap-3">
      {/* Static Label Badge */}
   

      {/* Horizontal Sliding Marquee */}
      <div className="marquee-container flex-1 w-full relative overflow-hidden bg-transparent">
        <div className="marquee-track absolute inset-0 flex items-center">
          <div className="marquee-content inline-flex items-center gap-4">
            {/* Double the notices for seamless loop */}
            {[...notices, ...notices, ...notices, ...notices, ...notices, ...notices].map((notice, idx) => (
              <Link
                to="/notices"
                key={`${notice._id}-${idx}`}
                className="inline-flex items-center justify-center gap-3 bg-green-200 border text-green-950 border-green-600 text-center rounded-full px-2 py-1 pr-5 shadow-sm hover:shadow-md hover:border-green-600 transition-all cursor-pointer group shrink-0"
              >
                {/* Category Badge */}
            

                {/* Notice Content */}
                <h4 className="text-sm text-center font-semibold text-green-950 group-hover:text-green-900 transition-colors whitespace-nowrap">
                  {notice.content}
                </h4>

                {/* Date */}
                {notice.createdAt && (
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="w-1 h-1 rounded-full bg-gray-300 mx-1"></span>
                    <span className="text-[10px] font-medium text-gray-700">
                      {new Date(notice.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  </section>
)}

{/* Styles for horizontal sliding animation */}
<style jsx>{`
  .marquee-container {
    height: 48px;
    position: relative;
  }

  .marquee-track {
    width: 100%;
    overflow: hidden;
  }

  .marquee-content {
    display: inline-flex;
    gap: 1.5rem;
    padding-left: 2rem;
    animation: slideHorizontal 40s linear infinite;
    will-change: transform;
  }

  .marquee-container:hover .marquee-content {
    animation-play-state: paused;
  }

  @keyframes slideHorizontal {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-33.33%);
    }
  }

  @media (max-width: 640px) {
    .marquee-container {
      height: 44px;
    }
    
    .marquee-content {
      gap: 1rem;
    }
  }
`}</style>
 {toppers.length > 0 && (
  <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 sm:mt-12 mb-12 sm:mb-20 overflow-hidden">
    {/* Header Section */}
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-6 sm:mb-10">
      <div className="space-y-2 sm:space-y-3">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-heading font-black text-gray-900 tracking-tight leading-tight sm:leading-none">
          Mourya Accadmy <span className="text-transparent bg-clip-text bg-emerald-600 ">Toppers</span>
        </h2>
      </div>
     
    </div>

    <div className="relative group/scroll">
      <div className="topper-scroll-container flex gap-3 sm:gap-4 md:gap-5 overflow-x-auto pb-3 sm:pb-4 md:pb-6 snap-x snap-mandatory no-scrollbar scroll-smooth">
        {toppers.map((topper, idx) => (
          <div 
            key={topper._id} 
            className="flex-none w-[110px] sm:w-[125px] md:w-[140px] lg:w-[150px] aspect-[3/4.5] rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden relative group snap-start shadow-md sm:shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
          >
            {/* Optimized Background Image */}``
            {topper.image ? (
              <div className="absolute inset-0 w-full h-full rounded-xl sm:rounded-2xl md:rounded-3xl">
                <img 
                  src={getImageUrl(topper.image)} 
                  alt={topper.name} 
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-1000 ease-out"
                  loading="lazy"
                  sizes="(max-width: 640px) 110px, (max-width: 768px) 125px, (max-width: 1024px) 140px, 150px"
                />
              </div>
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-amber-800 to-orange-800 flex items-center justify-center">
                <span className="text-4xl sm:text-5xl md:text-6xl font-black text-white/15 uppercase select-none">{topper.name.charAt(0)}</span>
              </div>
            )}

            
            {/* Subtle Border */}
          </div>
        ))}
       
      </div>
      
    </div>

    <style dangerouslySetInnerHTML={{__html: `
      .no-scrollbar::-webkit-scrollbar { display: none; }
      .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      
      @keyframes bounce-subtle {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-3px); }
      }
      .animate-bounce-subtle { animation: bounce-subtle 3s ease-in-out infinite; }
      
      .topper-scroll-container {
        /* Fog effect removed */
      }
      
      /* Line clamp utility */
      .line-clamp-2 {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      
      /* Better touch scrolling for mobile */
      @media (max-width: 640px) {
        .topper-scroll-container {
          -webkit-overflow-scrolling: touch;
        }
      }
      
      /* Responsive sizing - More compact */
      @media (max-width: 640px) {
        .topper-scroll-container > div {
          width: 110px;
        }
      }
      
      @media (min-width: 641px) and (max-width: 768px) {
        .topper-scroll-container > div {
          width: 125px;
        }
      }
      
      @media (min-width: 769px) and (max-width: 1024px) {
        .topper-scroll-container > div {
          width: 140px;
        }
      }
      
      @media (min-width: 1025px) {
        .topper-scroll-container > div {
          width: 150px;
        }
      }
    `}} />
  </section>
)}


      {/* Hero Intro Section */}
      <section className="relative max-w-7xl mx-auto w-full bg-white overflow-hidden">
        <div className="absolute   top-0 right-0 w-96 h-96 bg-emerald-100/20 rounded-full blur-3xl -mr-48 -mt-48" />

        <div className="relative z-10 mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            {/* LEFT SIDE - TEXT */}
            <div className="text-center md:text-left">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* <button
                  onClick={() => navigate("/courses")}
                  className="bg-neutral-900 text-white px-8 py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md"
                >
                  Explore Courses <ArrowRight className="w-4 h-4" />
                </button> */}

               
                 <Link
                  to="/toppers"
                  className="bg-neutral-900 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-neutral-800 transition-colors shadow-sm"
                >
                  View All Topers
                </Link>
                 <Link
                  to="tel:+918809193796"
                  className="bg-emerald-600 text-white px-8 py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all shadow-sm hover:shadow-md"
                >
                  <Phone className="w-4 h-4" /> call us
                </Link>

               
              </div>
           

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-900 leading-tight mt-2">
                Mourya Academy {" "}
                <span className="text-emerald-600 relative inline-block">
                  Best
                  <svg
                    className="absolute -bottom-2 left-0 w-full h-2 text-emerald-600/30"
                    viewBox="0 0 100 8"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0 4 Q 25 0, 50 4 T 100 4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>{" "}
                Coaching Institute in Darbhanga
              </h1>

              <p className="text-[14px] text-center sm:text-xl text-green-950 max-w-xl mt-4  leading-relaxed font-semibold bg-green-100 rounded-full px-1 py-1 border border-green-600 ">
                <span className="text-green-950 ">📍</span>
              Located near Shivdhara Chowk, Darbhanga,Bihar
              </p>
              <h2 className='text-center text-pink-950 mt-4 text-md sm:text-2xl font-semibold bg-pink-200 rounded-full px-1 py-1 border border-pink-600 '> All courses available for CBSE VI to XII</h2>
            
            </div>

            {/* RIGHT SIDE - IMAGE */}
            <div className="flex flex-col justify-center items-center md:justify-end "> {/*y-flip*/}
              {/* <img
                className="w-72 md:w-96 lg:w-[420px] drop-shadow-xl rounded-md"
                src="/sir.jpeg"
                alt="Teacher"
              /> */}
              <h1 className="text-center text-neutral-950 mt-4 text-md sm:text-2xl font-bold "> Mr. Shambhu Kumar Singh</h1>
              <p className="text-center text-green-950  text-sm sm:text-xl font-semibold bg-green-200 rounded-lg px-2 py-1 border border-green-600 "> Teaching Since 2017</p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
    
    {/* Card */}
    {[
      {
        icon: <Users className="w-5 h-5" />,
        number: "1000+",
        label: "Students",
        bgColor: "bg-emerald-100",
        textColor: "text-emerald-600",
        glowColor: "bg-emerald-200",
        color:"emerald-100",
        border:"emerald-400"
      },
      {
        icon: <BookOpen className="w-5 h-5" />,
        number: "10+",
        label: "Courses",
        bgColor: "bg-blue-100",
        textColor: "text-blue-600",
        glowColor: "bg-blue-200",
        color:"blue-100",
        border:"blue-400"
      },
      {
        icon: <Award className="w-5 h-5" />,
        number: "Top",
        label: "Success Rate",
        bgColor: "bg-amber-100",
        textColor: "text-amber-600",
        glowColor: "bg-amber-200",
        color:"amber-100",
        border:"amber-300"
      },
      {
        icon: <Star className="w-5 h-5" />,
        number: "4.9",
        label: "Rating",
        bgColor: "bg-purple-100",
        textColor: "text-purple-600",
        glowColor: "bg-purple-200",
        color:"purple-100",
        border:"purple-400"
      }
    ].map((item, i) => (
      <div
        key={i}
        className={`group relative bg-${item.color} backdrop-blur-xl  rounded-2xl p-4 sm:p-6 text-center shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 overflow-hidden`}
      >
        {/* Glow Effect */}
        <div className={`absolute -top-10 -right-10 w-24 h-24 ${item.glowColor} opacity-20 rounded-full blur-2xl group-hover:scale-150 transition-all duration-700`} />

        {/* Icon */}
        <div
          className={`w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 flex items-center justify-center rounded-xl ${item.bgColor} ${item.textColor} transition-all duration-500 group-hover:scale-110`}
        >
          {item.icon}
        </div>

        {/* Number */}
        <p className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight transition-transform duration-300">
          {item.number}
        </p>

        {/* Label */}
        <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1 font-medium uppercase tracking-wider">
          {item.label}
        </p>
      </div>
    ))}
  </div>
</div>

      {/* Information Hub - Notices, Courses, Toppers */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 rounded-full shadow-sm border border-green-600 mb-4">
              <Bell className="w-3.5 h-3.5 text-green-950" />
              <span className="text-[10px] sm:text-xs font-bold text-green-950 uppercase tracking-wide">
                Stay Informed
              </span>
            </div>
          
            <p className="mt-3 text-gray-800 max-w-2xl mx-auto  text-xl font-semibold">
              Latest announcements, programs, and
              achievements
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {/* Column 1: Notices */}
           <div className="relative rounded-3xl border border-gray-200 bg-white/70 backdrop-blur-xl shadow-xl overflow-hidden flex flex-col h-[480px]">

  {/* Header */}
  <div className="p-6 pb-5 border-b border-gray-100 bg-gradient-to-r from-emerald-50/60 to-transparent">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 bg-emerald-100 border border-emerald-600 text-emerald-600 rounded-2xl flex items-center justify-center shadow-sm">
          <Bell className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 text-xl tracking-tight">
            Notices 
          </h3>
          <p className="text-xs text-gray-800 font-semibold uppercase tracking-widest">
            Latest Updates
          </p>
        </div>
      </div>
      <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></div>
    </div>
  </div>

  {/* Body */}
  <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4 scrollbar-thin scrollbar-thumb-gray-200">

    {loadingNotices ? (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-5 rounded-2xl border border-gray-100 bg-white">
            <Skeleton className="h-3 w-20 mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-3 w-3/4" />
          </div>
        ))}
      </div>
    ) : notices.length > 0 ? (
      notices.map((notice) => (
        <div
          key={notice._id}
          className="group p-5 rounded-2xl bg-green-200 border border-green-600 hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer"
        >
        

          <h4 className="font-bold text-green-950 line-clamp-2  transition-colors">
            {notice.title}
          </h4>

          <p className="text-md text-gray-950 line-clamp-2 mt-1">
            {notice.content}
          </p>
          <div className="flex items-center justify-end">
        <span className="text-xs text-gray-900">
              {new Date(notice.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
              })}
            </span>
            </div>
        </div>
        
      ))
    ) : (
      <div className="h-full flex flex-col items-center justify-center text-gray-400">
        <Bell className="w-14 h-14 mb-3 opacity-20" />
        <p className="text-sm font-medium">No notices yet</p>
      </div>
    )}

  </div>

  {/* Footer CTA */}
  <div className="p-5 pt-0">
    <Link
      to="/notices"
      className="block w-full py-3 rounded-2xl text-sm font-semibold text-center 
                 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white
                 hover:shadow-lg hover:from-emerald-600 hover:to-emerald-700 
                 transition-all duration-300"
    >
      View All Notices
    </Link>
  </div>
</div>

            {/* Column 2: Courses */}
            {/* <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-[480px] transition-shadow hover:shadow-md">
              <div className="p-6 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">Courses</h3>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">
                      Our Programs
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 pt-4">
                {loadingCourses ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex gap-4 p-3 items-center">
                        <Skeleton className="w-16 h-16 shrink-0 rounded-xl" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-3 w-1/2" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {courses
                      .filter((c) => !c.isFinished)
                      .slice(0, 4)
                      .map((course) => (
                        <Link
                          to={`/course/${course._id}`}
                          key={course._id}
                          className="group flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                        >
                          <div className="w-16 h-16 rounded-xl bg-linear-to-br from-emerald-50 to-blue-50 flex items-center justify-center overflow-hidden shrink-0">
                            {course.image ? (
                              <img
                                src={course.image}
                                alt={course.title}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                              />
                            ) : (
                              <BookOpen className="w-6 h-6 text-emerald-500 transition-transform duration-300 group-hover:scale-110" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-800 truncate">
                              {course.title || "New Course"}
                            </h4>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-sm font-bold text-emerald-600">
                                ₹{course.fee?.toLocaleString()}
                              </span>
                              <span className="text-xs text-gray-400">
                                {course.duration}
                              </span>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-emerald-500 transition-colors" />
                        </Link>
                      ))}
                  </div>
                )}
              </div>

              <div className="p-4 pt-0">
                <Link
                  to="/courses"
                  className="block w-full py-3 bg-gray-50 hover:bg-blue-50 text-blue-600 rounded-xl text-sm font-semibold text-center transition-colors"
                >
                  Browse All Courses
                </Link>
              </div>
            </div> */}

            {/* Column 3: Toppers */}
            <div className="bg-linear-to-br from-gray-900 to-gray-800 rounded-2xl shadow-xl overflow-hidden flex flex-col h-[480px] text-white">
              <div className="p-6 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-linear-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">
                      Top Achievers
                    </h3>
                    <p className="text-xs text-amber-300/70 uppercase tracking-wide">
                      Academic Excellence
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 pt-4 space-y-3 scrollbar-thin scrollbar-thumb-white/10">
                {loadingToppers ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className="flex items-center gap-4 p-3 rounded-xl bg-white/5"
                      >
                        <Skeleton className="w-12 h-12 shrink-0 bg-white/10" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-3/4 bg-white/10" />
                          <Skeleton className="h-3 w-1/2 bg-white/10" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : toppers.length > 0 ? (
                  toppers.slice(0, 5).map((topper, index) => (
                    <div
                      key={topper._id}
                      className="flex items-center gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all"
                    >
                      <div className="relative">
                        <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center font-bold text-lg text-white overflow-hidden">
                          {topper.image ? (
                            <img
                              src={getImageUrl(topper.image)}
                              alt={topper.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            topper.name.charAt(0)
                          )}
                        </div>
                       
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-white truncate">
                          {topper.name}
                        </h4>
                        <p className="text-xs text-amber-300/70 truncate">
                          {topper.course}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span className="text-sm font-bold text-amber-400">
                          {topper.rank}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-white/40">
                    <Award className="w-12 h-12 mb-2 opacity-30" />
                    <p className="text-sm font-medium">No toppers yet</p>
                  </div>
                )}
              </div>

              <div className="p-4 pt-0">
                <Link
                  to="/toppers"
                  className="block w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-semibold text-center transition-colors"
                >
                  View Hall of Fame
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Gallery Showcase */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-10">
            <div className="flex flex-col items-center justify-center">
              <div className="inline-flex  items-center gap-2 px-3 py-1.5 bg-emerald-100 rounded-full mb-4 border border-emerald-600 shadow-sm">
                <Camera className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-semibold text-emerald-950 uppercase tracking-wide">
                  Campus Life
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">
                Explore Our{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 tracking-tight">
                  Gallery
                </span>
              </h2>
            </div>
        
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <div className="col-span-2 lg:row-span-2 rounded-3xl overflow-hidden relative group h-64 md:h-96 lg:h-full shadow-sm hover:shadow-xl transition-shadow duration-500 bg-slate-100">
              <img
                src="./g2.webp"
                alt="Campus Life"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 md:p-8">
               
                
              </div>
            </div>
            <div className="rounded-3xl overflow-hidden relative group h-32 md:h-44 lg:h-[220px] shadow-sm hover:shadow-xl transition-shadow duration-500 bg-slate-100">
              <img
                src="./g1.webp"
                alt="Classroom"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              
            </div>
          
          
           
               <Link
              to="/gallery"
              className="group hidden md:flex items-center gap-2 px-6 py-3 justify-center bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-all shadow-md hover:shadow-lg active:scale-95"
            >
              <span>View Full Gallery</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
           

         
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-linear-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-200 border border-green-600 rounded-full mb-4">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-semibold text-green-950 uppercase tracking-wide">
                Why Choose Us
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              What Makes Us{" "}
              <span className="bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Different
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive learning ecosystem designed for student success
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 bg">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group relative p-6 rounded-2xl bg-${feature.color}  shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
              >
                <div
                  className={`absolute inset-0 bg-linear-to-r ${feature.bgGradient} opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300`}
                />
                <div className="relative z-10">
                  <div
                    className={`w-14 h-14 bg-linear-to-r ${feature.gradient} rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}
                  >
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-200 border border-green-600 rounded-full mb-4">
              <HelpCircleIcon className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-semibold text-green-950 uppercase tracking-wide">
                FAQ
              </span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Common <span className="bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Questions</span>
            </h2>
          </div>

          <div className="space-y-4 mb-10">
            {homeFaqs.map((faq, index) => (
              <div 
                key={index} 
                className={`border border-slate-200 rounded-2xl overflow-hidden transition-all duration-300 ${openFaqIndex === index ? 'shadow-lg shadow-emerald-500/5 ring-1 ring-emerald-500/20' : 'hover:border-emerald-200'}`}
              >
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-slate-50/50 transition-colors"
                >
                  <span className="text-lg font-semibold text-slate-800 pr-8">{faq.question}</span>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${openFaqIndex === index ? 'bg-emerald-100 text-emerald-600 rotate-180' : 'bg-slate-100 text-slate-400'}`}>
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </button>
                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaqIndex === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <div className="p-5 pt-0 text-slate-600 leading-relaxed font-bold bg-green-200">
                    <div className="h-px w-full bg-slate-100 mb-4" />
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/faq"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-all shadow-md hover:shadow-lg active:scale-95"
            >
              More FAQ <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="contact py-16 px-4 sm:px-6 lg:px-8 ">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Ready to Change Your Future?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of successful students who have achieved their
            academic goals with our platform. Start your journey today.
          </p>
           <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
                to="tel:+919876543210"
                className="bg-emerald-600 flex items-center justify-center gap-2 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-emerald-700 transition-colors shadow-sm"
              >
                <Phone className="w-4 h-4" />
                Call Now to admission
              </Link>
              <Link
                to="https://wa.me/919876543210"
                className="text-neutral-100 flex items-center justify-center gap-2  bg-neutral-900 px-8 py-3.5 rounded-xl font-semibold  border border-neutral-200 transition-colors shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                Text Us for Admission
              </Link>
           </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
        
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;