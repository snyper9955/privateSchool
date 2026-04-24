import React, { useState, useEffect } from 'react';
import { useApi } from '../context/ApiContext';
import { 
  Users, 
  Search, 
  Plus, 
  MoreVertical, 
  Mail, 
  Phone, 
  Calendar,
  Filter,
  ArrowRight,
  ChevronLeft,
  BookOpen,
  User,
  ShieldCheck,
  CreditCard,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';

const Students = () => {
    const api = useApi();
    const [students, setStudents] = useState([]);
    const [courses, setCourses] = useState([]);
    const [inquiries, setInquiries] = useState([]);
    const [registeredUsers, setRegisteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [recordSearchTerm, setRecordSearchTerm] = useState(''); // Search for existing records in modal
    
    // View State
    const [view, setView] = useState('overview'); // 'overview', 'students', 'detail', 'all'
    const [selectedCourseId, setSelectedCourseId] = useState(null);
    const [selectedStudentId, setSelectedStudentId] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        course: '',
        feeStatus: 'paid'
    });

    useEffect(() => {
        fetchData();
    }, [api]);

    const fetchData = async () => {
        try {
            const [studentsRes, coursesRes, inquiriesRes, usersRes] = await Promise.all([
                api.get('/api/students'),
                api.get('/api/courses'),
                api.get('/api/inquiries'),
                api.get('/api/auth/users')
            ]);
            setStudents(studentsRes.data.data || []);
            setCourses(coursesRes.data.data || []);
            setInquiries(inquiriesRes.data.data || []);
            setRegisteredUsers(usersRes.data.data || []);
        } catch (error) {
            toast.error('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    const handleAddStudent = async (e) => {
        e.preventDefault();
        try {
            await api.post('/api/students/register', formData);
            toast.success('Student registered successfully');
            setIsAddModalOpen(false);
            setFormData({ name: '', email: '', phone: '', course: '', feeStatus: 'paid' });
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
        }
    };

    const handleUpdateFeeStatus = async (studentId, status, courseId = null) => {
        try {
            const targetCourseId = courseId || selectedCourseId;
            await api.put(`/api/students/${studentId}`, { 
                feeStatus: status,
                courseId: targetCourseId
            });
            toast.success(`Fee status updated to ${status}${targetCourseId ? ' for this course' : ''}`);
            fetchData();
        } catch (error) {
            toast.error('Failed to update fee status');
        }
    };

    // Helper: Get students for a specific course
    const getStudentsForCourse = (courseId) => {
        return students.filter(s => {
            // Check legacy singular course field
            const hasSingularMatch = (s.course?._id || s.course) === courseId;
            // Check multi-course array field (handling both IDs and populated objects)
            const hasArrayMatch = s.courses?.some(c => (c._id || c) === courseId);
            return hasSingularMatch || hasArrayMatch;
        });
    };

    const currentCourse = courses.find(c => c._id === selectedCourseId);
    const currentStudent = students.find(s => s._id === selectedStudentId);

    const filteredStudents = (view === 'all' ? students : getStudentsForCourse(selectedCourseId) || []).filter(student => 
        student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.phone?.includes(searchTerm) ||
        student.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Render Views
    const renderOverview = () => (
        <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5">
                    <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Students</p>
                        <p className="text-2xl font-black text-slate-900">{students.length}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5">
                    <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                        <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Courses</p>
                        <p className="text-2xl font-black text-slate-900">{courses.filter(c => !c.isFinished).length}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5">
                    <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Paid Admissions</p>
                        <p className="text-2xl font-black text-slate-900">{students.filter(s => s.feeStatus === 'paid').length}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5">
                    <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
                        <CreditCard className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pending Fees</p>
                        <p className="text-2xl font-black text-slate-900">{students.filter(s => s.feeStatus === 'pending').length}</p>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight italic">Enrollment by Course</h2>
                <button 
                    onClick={() => setView('all')}
                    className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:underline flex items-center gap-2"
                >
                    View All Students <ArrowRight className="w-3 h-3" />
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {courses.map(course => {
                    const studentCount = getStudentsForCourse(course._id).length;
                    return (
                        <div 
                            key={course._id}
                            onClick={() => {
                                setSelectedCourseId(course._id);
                                setView('students');
                            }}
                            className={`group bg-white p-8 rounded-4xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-1 transition-all cursor-pointer relative overflow-hidden ${course.isFinished ? 'opacity-80' : ''}`}
                        >
                            {course.isFinished && (
                                <div className="absolute top-0 right-0 bg-slate-900/5 backdrop-blur-sm px-4 py-1 rounded-bl-2xl text-[8px] font-black uppercase tracking-widest text-slate-500 border-l border-b border-slate-100">
                                    Trial/Batch Finished
                                </div>
                            )}
                            <div className="flex justify-between items-start mb-6">
                                <div className={`w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all duration-500 overflow-hidden border border-slate-50 ${course.isFinished ? 'grayscale' : ''}`}>
                                    {course.image ? (
                                        <img 
                                            src={course.image} 
                                            alt={course.title} 
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <BookOpen className={`w-7 h-7 ${course.isFinished ? 'text-slate-400' : 'text-emerald-600/30'}`} />
                                    )}
                                </div>
                                <div className="text-right">
                                    <p className={`text-4xl font-black tracking-tight ${course.isFinished ? 'text-slate-400' : 'text-slate-900 group-hover:text-emerald-600'} transition-all`}>{studentCount}</p>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total</p>
                                </div>
                            </div>
                            <h3 className={`font-black font-heading text-xl tracking-tight leading-tight mb-2 ${course.isFinished ? 'text-slate-400 line-through decoration-slate-300' : 'text-slate-900 group-hover:text-emerald-600'} transition-all`}>
                                {course.title}
                            </h3>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-6">
                                ₹{course.fee?.toLocaleString()} • {course.duration}
                            </p>
                            <div className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-widest pt-6 border-t border-slate-50">
                                <span>Manage Students</span>
                                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );

    const renderStudentList = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex items-center gap-4 mb-2">
                <button 
                    onClick={() => setView('overview')}
                    className="p-3 bg-white border border-slate-100 text-slate-400 hover:text-emerald-600 rounded-2xl transition-all shadow-sm active:scale-95"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
                        {view === 'all' ? 'All Enrolled Students' : currentCourse?.title}
                    </h2>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        {filteredStudents.length} Students {view === 'all' ? 'Total' : 'Enrolled'}
                    </p>
                </div>
            </div>

            <div className="bg-white p-4 rounded-4xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400  transition-colors" />
                    <input 
                        type="text" 
                        placeholder={view === 'all' ? "Search all students..." : `Search students in ${currentCourse?.title}...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all text-slate-800 font-medium"
                    />
                </div>
            </div>

            <div className="bg-white rounded-4xl border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50/50">
                            <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Student</th>
                            {view === 'all' && <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Course</th>}
                            <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Admission Date</th>
                            <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Fee Status</th>
                            <th className="px-8 py-5"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredStudents.length > 0 ? filteredStudents.map((student) => {
                            const studentCourse = view === 'all' 
                                ? (courses.find(c => (student.courses?.[0]?._id || student.courses?.[0] || student.course?._id || student.course) === c._id))
                                : currentCourse;

                            return (
                                <tr 
                                    key={student._id} 
                                    onClick={() => {
                                        setSelectedStudentId(student._id);
                                        setSelectedCourseId(studentCourse?._id);
                                        setView('detail');
                                    }}
                                    className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                                >
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-bold">
                                                {student.name?.charAt(0) || 'S'}
                                            </div>
                                            <div>
                                                <p className="font-extrabold text-slate-900 group-hover:text-emerald-600 transition-colors uppercase text-sm tracking-tight">{student.name}</p>
                                                <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-0.5 font-bold uppercase tracking-wider">
                                                    <span className="flex items-center gap-1"><Phone className="w-2.5 h-2.5" /> {student.phone || 'N/A'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    {view === 'all' && (
                                        <td className="px-8 py-5">
                                            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                                                {studentCourse?.title || 'No Course'}
                                            </p>
                                        </td>
                                    )}
                                    <td className="px-8 py-5">
                                        <p className="text-[10px] font-black text-slate-600 flex items-center gap-2 uppercase tracking-widest">
                                            <Calendar className="w-3.5 h-3.5 text-slate-300" />
                                            {new Date(student.admissionDate).toLocaleDateString()}
                                        </p>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border transition-colors ${
                                            student.paidCourses?.some(pc => (pc._id || pc) === studentCourse?._id) 
                                                ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                                                : 'bg-amber-50 text-amber-600 border-amber-100'
                                        }`}>
                                            {student.paidCourses?.some(pc => (pc._id || pc) === studentCourse?._id) ? 'paid' : 'pending'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="w-8 h-8 rounded-lg bg-slate-50 text-slate-300 flex items-center justify-center group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-all">
                                            <ChevronLeft className="w-4 h-4 rotate-180" />
                                        </div>
                                    </td>
                                </tr>
                            );
                        }) : (
                            <tr>
                                <td colSpan="4" className="px-8 py-20 text-center">
                                    <Users className="w-12 h-12 text-slate-100 mx-auto mb-4" />
                                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No students found for this course</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderStudentDetail = () => (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex items-center gap-4 mb-2">
                <button 
                    onClick={() => setView(selectedCourseId ? 'students' : 'overview')}
                    className="p-3 bg-white border border-slate-100 text-slate-400 hover:text-emerald-600 rounded-2xl transition-all shadow-sm active:scale-95"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Student Profile</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="bg-white rounded-4xl p-10 border border-slate-100 shadow-sm flex flex-col items-center text-center">
                    <div className="w-32 h-32 bg-emerald-50 text-emerald-600 rounded-4xl flex items-center justify-center text-5xl font-black mb-6 shadow-inner ring-8 ring-emerald-50/50">
                        {currentStudent?.name?.charAt(0)}
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">{currentStudent?.name}</h3>
                    <div className="inline-flex items-center px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-8 border border-emerald-100">
                        Active Student
                    </div>

                    <div className="w-full space-y-4 pt-8 border-t border-slate-50">
                        {currentStudent?.phone ? (
                            <a href={`tel:${currentStudent.phone}`} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl group transition-all hover:bg-white hover:shadow-lg hover:shadow-slate-100 border border-transparent hover:border-slate-100 cursor-pointer">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 group-hover:text-emerald-600 transition-colors shadow-sm">
                                    <Phone className="w-4 h-4" />
                                </div>
                                <div className="text-left">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Phone Number</p>
                                    <p className="text-sm font-bold text-slate-900">{currentStudent.phone}</p>
                                </div>
                            </a>
                        ) : (
                            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl group transition-all hover:bg-white hover:shadow-lg hover:shadow-slate-100 border border-transparent hover:border-slate-100">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 group-hover:text-emerald-600 transition-colors shadow-sm">
                                    <Phone className="w-4 h-4" />
                                </div>
                                <div className="text-left">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Phone Number</p>
                                    <p className="text-sm font-bold text-slate-900">Not Provided</p>
                                </div>
                            </div>
                        )}
                        {currentStudent?.email ? (
                            <a href={`mailto:${currentStudent.email}`} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl group transition-all hover:bg-white hover:shadow-lg hover:shadow-slate-100 border border-transparent hover:border-slate-100 cursor-pointer">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 group-hover:text-emerald-600 transition-colors shadow-sm">
                                    <Mail className="w-4 h-4" />
                                </div>
                                <div className="text-left">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Email Address</p>
                                    <p className="text-sm font-bold text-slate-900 truncate max-w-[150px]">{currentStudent.email}</p>
                                </div>
                            </a>
                        ) : (
                            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl group transition-all hover:bg-white hover:shadow-lg hover:shadow-slate-100 border border-transparent hover:border-slate-100">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 group-hover:text-emerald-600 transition-colors shadow-sm">
                                    <Mail className="w-4 h-4" />
                                </div>
                                <div className="text-left">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Email Address</p>
                                    <p className="text-sm font-bold text-slate-900 truncate max-w-[150px]">Not Provided</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Details Grid */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-4xl p-10 border border-slate-100 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl -mr-16 -mt-16"></div>
                        
                        <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-8 flex items-center gap-3">
                            <ShieldCheck className="w-5 h-5 text-emerald-600" />
                            Admission Info
                        </h4>

                        <div className="flex items-start gap-6 mb-10 p-6 bg-slate-50 rounded-4xl border border-slate-100">
                            <div className="w-20 h-20 bg-white rounded-2xl overflow-hidden shadow-sm shrink-0 border border-slate-200">
                                {currentCourse?.image ? (
                                    <img src={currentCourse.image} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-emerald-50 text-emerald-600">
                                        <BookOpen className="w-8 h-8 opacity-20" />
                                    </div>
                                )}
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Enrolled Course</p>
                                <p className="text-xl font-black text-slate-900 uppercase leading-tight">{currentCourse?.title}</p>
                                <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mt-2">{currentCourse?.duration} Course</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Enrollment Status</p>
                                <p className="text-base font-bold text-slate-900 uppercase tracking-tight">Active Student</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Admission Date</p>
                                <p className="text-base font-bold text-slate-900">{new Date(currentStudent?.admissionDate).toLocaleDateString('en-IN', { dateStyle: 'long' })}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Batch Timing</p>
                                <p className="text-base font-bold text-slate-900">{currentStudent?.batchTiming || 'Standard Batch'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fee Status</p>
                                <span className={`inline-flex items-center px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border mt-1 ${
                                    currentStudent?.paidCourses?.some(pc => (pc._id || pc) === selectedCourseId) 
                                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                                        : 'bg-amber-50 text-amber-600 border-amber-100'
                                }`}>
                                    {currentStudent?.paidCourses?.some(pc => (pc._id || pc) === selectedCourseId) ? 'paid' : 'pending'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900 rounded-4xl p-10 text-white relative overflow-hidden group">
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-600/10 rounded-full blur-[100px] -ml-32 -mb-32"></div>
                        <div className="relative z-10">
                            <h4 className="text-lg font-black uppercase tracking-tight mb-6 flex items-center gap-3">
                                <CreditCard className="w-5 h-5 text-emerald-400" />
                                Payment Summary
                            </h4>
                            <div className="flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-3xl">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Fee Amount</p>
                                    <p className="text-3xl font-black text-white">₹{currentCourse?.fee?.toLocaleString()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Final Status</p>
                                    <p className={`text-sm font-black uppercase tracking-widest ${currentStudent?.paidCourses?.some(pc => (pc._id || pc) === selectedCourseId) ? 'text-emerald-400' : 'text-amber-400'}`}>
                                        {currentStudent?.paidCourses?.some(pc => (pc._id || pc) === selectedCourseId) ? 'paid' : 'pending'}
                                    </p>
                                </div>
                            </div>
                            
                            {(!currentStudent?.paidCourses?.some(pc => (pc._id || pc) === selectedCourseId)) && (
                                <button 
                                    onClick={() => handleUpdateFeeStatus(currentStudent._id, 'paid', selectedCourseId)}
                                    className="w-full mt-6 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl shadow-emerald-600/20 active:scale-[0.98]"
                                >
                                    Confirm Payment & Mark as Paid
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-12">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-slate-100">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase leading-tight">Student Hub</h1>
                    <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] mt-1 shadow-emerald-500/20">Manage admissions & track progress</p>
                </div>
                <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="inline-flex items-center gap-3 bg-slate-900 hover:bg-emerald-600 text-white px-8 py-4 rounded-3xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-slate-200 transition-all hover:-translate-y-1 active:scale-95 group"
                >
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                    <span>New Admission</span>
                </button>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-32 text-slate-300">
                    <div className="w-12 h-12 border-4 border-slate-100 border-t-emerald-500 rounded-full animate-spin mb-4"></div>
                    <p className="text-[10px] font-black uppercase tracking-widest">Updating Student Hub...</p>
                </div>
            ) : (
                <>
                    {view === 'overview' && renderOverview()}
                    {(view === 'students' || view === 'all') && renderStudentList()}
                    {view === 'detail' && renderStudentDetail()}
                </>
            )}

            {/* Add Student Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setIsAddModalOpen(false)}></div>
                    <div className="relative bg-white w-full max-w-lg rounded-4xl p-10 shadow-2xl animate-in zoom-in-95 duration-300 border border-slate-100">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 uppercase">New Admission</h2>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Register a new student</p>
                            </div>
                            <button onClick={() => setIsAddModalOpen(false)} className="p-3 text-slate-400 hover:text-red-500 bg-slate-50 rounded-2xl transition-all"><X className="w-5 h-5" /></button>
                        </div>

                        {/* Existing Record Search */}
                        <div className="mb-8 p-6 bg-emerald-50/50 rounded-3xl border border-emerald-100/50 relative">
                            <label className="text-[10px] font-black text-emerald-700 uppercase tracking-widest ml-1 mb-2 block">Autofill from Inquiry or User</label>
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600/50" />
                                <input 
                                    type="text"
                                    placeholder="Search by name, email or phone..."
                                    value={recordSearchTerm}
                                    onChange={(e) => setRecordSearchTerm(e.target.value)}
                                    className="w-full bg-white border border-emerald-100 rounded-2xl pl-11 pr-4 py-3 outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all font-bold text-xs text-emerald-900 placeholder-emerald-300"
                                />
                            </div>
                            
                            {recordSearchTerm && (
                                <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-slate-100 rounded-3xl shadow-2xl z-50 max-h-60 overflow-y-auto p-2 space-y-1">
                                    {[
                                        ...inquiries.map(i => ({ ...i, source: 'Inquiry', type: 'inquiry' })),
                                        ...registeredUsers.filter(u => u.role === 'student').map(u => ({ ...u, source: 'Registered User', type: 'user' }))
                                    ].filter(r => 
                                        r.name?.toLowerCase().includes(recordSearchTerm.toLowerCase()) ||
                                        r.email?.toLowerCase().includes(recordSearchTerm.toLowerCase()) ||
                                        r.phone?.includes(recordSearchTerm)
                                    ).map((record, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => {
                                                setFormData({
                                                    ...formData,
                                                    name: record.name || '',
                                                    email: record.email || '',
                                                    phone: record.phone || ''
                                                });
                                                setRecordSearchTerm('');
                                                toast.success(`Autofilled from ${record.source}`);
                                            }}
                                            className="w-full text-left p-4 hover:bg-emerald-50 rounded-2xl transition-all flex items-center justify-between group"
                                        >
                                            <div>
                                                <p className="font-black text-slate-900 text-xs uppercase tracking-tight">{record.name}</p>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{record.email || record.phone}</p>
                                            </div>
                                            <span className="text-[8px] font-black uppercase tracking-widest px-2 py-1 bg-slate-100 text-slate-500 rounded-lg group-hover:bg-emerald-100 group-hover:text-emerald-700 transition-colors">
                                                {record.source}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <form onSubmit={handleAddStudent} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                                <div className="relative group">
                                    <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                                    <input 
                                        type="text" 
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-6 py-4 outline-none focus:bg-white focus:border-emerald-500 transition-all font-bold text-sm"
                                        required 
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Phone Number</label>
                                    <div className="relative group">
                                        <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                                        <input 
                                            type="tel" 
                                            placeholder="9876543210"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-6 py-4 outline-none focus:bg-white focus:border-emerald-500 transition-all font-bold text-sm"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email (Opt)</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                                        <input 
                                            type="email" 
                                            placeholder="john@email.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-6 py-4 outline-none focus:bg-white focus:border-emerald-500 transition-all font-bold text-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Assigned Course</label>
                                <div className="relative group">
                                    <BookOpen className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                                    <select 
                                        value={formData.course}
                                        onChange={(e) => setFormData({...formData, course: e.target.value})}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-6 py-4 outline-none focus:bg-white focus:border-emerald-500 transition-all font-bold text-sm appearance-none cursor-pointer"
                                        required
                                    >
                                        <option value="">Choose a course</option>
                                        {courses.filter(c => !c.isFinished).map(course => (
                                            <option key={course._id} value={course._id}>{course.title}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Fee Status</label>
                                <div className="relative group">
                                    <CreditCard className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                                    <select 
                                        value={formData.feeStatus}
                                        onChange={(e) => setFormData({...formData, feeStatus: e.target.value})}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-6 py-4 outline-none focus:bg-white focus:border-emerald-500 transition-all font-bold text-sm appearance-none cursor-pointer"
                                        required
                                    >
                                        <option value="paid">Directly Paid (Grant Access)</option>
                                        <option value="pending">Status Pending (Lock Access)</option>
                                    </select>
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                className="w-full bg-slate-900 hover:bg-emerald-600 text-white font-black py-5 rounded-4xl shadow-xl shadow-slate-200 transform active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-4 uppercase text-xs tracking-widest"
                            >
                                <span>Register Student</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Students;
