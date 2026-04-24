import React, { useState, useEffect } from "react";
import { useApi } from "../../context/ApiContext";
import { useSocket } from "../../context/SocketContext";
import {
  BookOpen,
  CreditCard,
  Clock,
  CheckCircle2,
  Calendar,
  ChevronRight,
  GraduationCap,
  TrendingUp,
  AlertCircle,
  FileText,
  ClipboardList,
  Zap,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const api = useApi();
  const [studentData, setStudentData] = useState(null);
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const socket = useSocket();
  const fetchDashboard = async () => {
    try {
      const { data } = await api.get("/api/students/me/dashboard");
      setStudentData(data.data);

      // Also fetch all available courses to show new opportunities
      const { data: coursesData } = await api.get("/api/courses");
      setAllCourses(coursesData.data || []);
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [api]);

  // Listen for manual enrollment updates
  useEffect(() => {
    if (socket) {
      socket.on("paymentSuccess", (data) => {
        console.log("Real-time enrollment update received:", data);
        fetchDashboard(); // Refetch to show new courses
      });
      return () => socket.off("paymentSuccess");
    }
  }, [socket]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <div className="w-10 h-10 border-3 border-gray-200 border-t-emerald-600 rounded-full animate-spin"></div>
        <p className="text-sm text-gray-500 font-medium">
          Loading dashboard...
        </p>
      </div>
    );
  }

  // Helper to ensure URL has protocol
  const formatUrl = (url) => {
    if (!url) return "#";
    if (!/^https?:\/\//i.test(url)) {
      return `https://${url}`;
    }
    return url;
  };

  // Helper to get 3 most recent resources from nested modules
  const getRecentResources = (modules) => {
    if (!modules || modules.length === 0) return [];
    const resources = [];
    // Flatten and collect lessons that have notes or assignments
    modules.forEach((m) => {
      m.lessons?.forEach((l) => {
        if (l.notesUrl || l.assignmentUrl) {
          resources.push({
            title: l.title,
            notes: l.notesUrl,
            assignment: l.assignmentUrl,
          });
        }
      });
    });
    return resources.slice(-3).reverse(); // Last 3, newest first
  };

  const enrolledCourses = studentData?.courses
    ? [...studentData.courses]
        .filter((c) => c !== null)
        .sort((a, b) => {
          // Sort by updatedAt or admissionDate, newest first
          const dateA = new Date(a.updatedAt || studentData.admissionDate || 0);
          const dateB = new Date(b.updatedAt || studentData.admissionDate || 0);
          return dateB - dateA;
        })
    : [];

  const activeCourses = enrolledCourses.filter((c) => !c.isFinished); // Using isFinished from Course model
  const completedCount = enrolledCourses.filter((c) => c.isFinished).length;

  // Filter courses that the student is NOT enrolled in yet
  const unenrolledCourses = allCourses
    .filter((course) => !enrolledCourses.some((ec) => ec._id === course._id))
    .filter((course) => !course.isFinished) // Don't show finished courses in explore
    .slice(0, 3); // Just show top 3 new ones

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-linear-to-r from-emerald-600 to-emerald-700 rounded-2xl p-6 sm:p-8 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
              Welcome back, {user?.name?.split(" ")[0] || "Student"}!
            </h1>
            <p className="text-emerald-100 text-sm">
              You have {activeCourses.length} active{" "}
              {activeCourses.length === 1 ? "course" : "courses"} in progress.
            </p>
          </div>
          <Link
            to="/courses"
            className="bg-white/20 backdrop-blur-sm px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-white/30 transition-colors inline-flex items-center gap-2 w-fit"
          >
            Browse Courses
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-11 h-11 bg-emerald-50 rounded-xl flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">
              Enrolled Courses
            </p>
            <p className="text-2xl font-bold text-gray-800">
              {enrolledCourses.length}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">
              In Progress
            </p>
            <p className="text-2xl font-bold text-gray-800">
              {activeCourses.length}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-11 h-11 bg-amber-50 rounded-xl flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">
              Completed
            </p>
            <p className="text-2xl font-bold text-gray-800">{completedCount}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center ${
              studentData?.paidCourses?.length === enrolledCourses.length
                ? "bg-emerald-50"
                : "bg-amber-50"
            }`}
          >
            <CreditCard
              className={`w-5 h-5 ${
                studentData?.paidCourses?.length === enrolledCourses.length
                  ? "text-emerald-600"
                  : "text-amber-600"
              }`}
            />
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">
              Payment Status
            </p>
            <p
              className={`text-lg font-bold capitalize ${
                studentData?.paidCourses?.length === enrolledCourses.length
                  ? "text-emerald-600"
                  : "text-amber-600"
              }`}
            >
              {studentData?.paidCourses?.length || 0} / {enrolledCourses.length} Paid
            </p>
          </div>
        </div>
      </div>

      {/* Active Courses Section */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-gray-800">
            My Enrolled Courses
          </h2>
        </div>

        {enrolledCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {enrolledCourses.map((course) => (
              <div
                key={course._id}
                className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden group"
              >
                {/* Course Image */}
                <div className="aspect-video bg-linear-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                  {course.image ? (
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="w-8 h-8 text-gray-300" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <span
                      className={`text-white text-[10px] px-2.5 py-1 rounded-lg font-black uppercase shadow-sm ${
                        studentData?.paidCourses?.some((pc) => (pc._id || pc) === course._id)
                          ? (course.isFinished ? "bg-slate-500" : "bg-emerald-500")
                          : "bg-red-500"
                      }`}
                    >
                      {studentData?.paidCourses?.some((pc) => (pc._id || pc) === course._id) 
                        ? (course.isFinished ? "Completed" : "Active") 
                        : "Pending"}
                    </span>
                  </div>
                  {course.modules?.length > 0 && (
                    <div className="absolute bottom-3 left-3">
                      <span className="bg-white/90 backdrop-blur-sm text-emerald-700 text-[10px] px-2 py-1 rounded-lg font-black uppercase shadow-sm">
                        Content Ready
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-5 flex flex-col items-center text-center">
                  <h3 className="font-bold text-gray-900 group-hover:text-emerald-600 transition-colors line-clamp-1 mb-3">
                    {course.title}
                  </h3>

                  {/* Progress Bar - Simplified */}
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-5">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${course.progress || 0}%` }}
                    ></div>
                  </div>

                  <Link
                    to={`/student/course/${course._id}/learn`}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
                  >
                    Continue Learning
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center shadow-sm">
            <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-emerald-200">
              <BookOpen className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2 tracking-tight">
              Your bookshelf is empty
            </h3>
            <p className="text-slate-500 max-w-sm mx-auto mb-8 font-medium">
              Enroll in a course to start your learning journey with our premium
              coaching programs.
            </p>
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl active:scale-95"
            >
              Explore Courses
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        )}
      </div>

      {/* Explore New Programs - Added for better visibility of new courses like Data Science */}
      

      

      {/* Recent Activity / Notices */}
      {studentData?.recentActivities?.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-5 sm:p-6">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-emerald-500" />
            Recent Activity
          </h3>
          <div className="space-y-3">
            {studentData.recentActivities.slice(0, 3).map((activity, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0"
              >
                <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600">{activity.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{activity.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Member Since Info */}
      <div className="text-center pt-4">
        <p className="text-xs text-gray-400 flex items-center justify-center gap-2">
          <GraduationCap className="w-3.5 h-3.5" />
          Member since{" "}
          {studentData?.admissionDate
            ? new Date(studentData.admissionDate).toLocaleDateString("en-IN", {
                month: "long",
                year: "numeric",
              })
            : "2024"}
        </p>
      </div>
    </div>
  );
};

export default StudentDashboard;
