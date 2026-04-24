import React, { useState, useEffect } from "react";
import { useApi } from "../context/ApiContext";
import {
  BookOpen,
  Plus,
  Clock,
  IndianRupee,
  Edit3,
  Trash2,
  MoreVertical,
  Layers,
  Search,
  ArrowRight,
  CheckCircle2,
  Zap,
  X,
  Play,
  FileText,
  ClipboardList,
  PlusCircle,
  Menu,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Courses = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const api = useApi();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const isAdmin = user?.role === "admin";

  const [isEditMode, setIsEditMode] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [activeTab, setActiveTab] = useState("details");
  const [expandedModules, setExpandedModules] = useState({});

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
    fee: "",
    batchTiming: "",
    image: "",
    isFinished: false,
    modules: [],
  });

  useEffect(() => {
    fetchCourses();
  }, [api]);

  const fetchCourses = async () => {
    try {
      const { data } = await api.get("/api/courses");
      setCourses(data.data);
      if (!isAdmin) {
        try {
          const { data: dashData } = await api.get("/api/students/me/dashboard");
          setEnrolledCourses(dashData.data?.courses?.map((c) => c._id) || []);
        } catch (err) {
          console.log("Not a student or profile not found");
        }
      }
    } catch (error) {
      toast.error("Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.modules?.length > 0) {
      for (const module of formData.modules) {
        if (!module.title.trim()) {
          toast.error("All modules must have a title");
          return;
        }
        for (const lesson of module.lessons) {
          if (!lesson.title.trim()) {
            toast.error(`Lesson in "${module.title}" is missing a title`);
            return;
          }
        }
      }
    }

    try {
      if (isEditMode) {
        await api.put(`/api/courses/${editingCourseId}`, formData);
        toast.success("Course updated successfully");
      } else {
        await api.post("/api/courses/create", formData);
        toast.success("Course created successfully");
      }
      handleCloseModal();
      fetchCourses();
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} course`);
    }
  };

  const handleEditClick = (course) => {
    setEditingCourseId(course._id);
    setFormData({
      title: course.title || "",
      description: course.description || "",
      duration: course.duration || "",
      fee: course.fee || "",
      batchTiming: course.batchTiming || "",
      image: course.image || "",
      isFinished: course.isFinished || false,
      modules: course.modules || [],
    });
    setIsEditMode(true);
    setIsAddModalOpen(true);
    setActiveTab("details");
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setIsEditMode(false);
    setEditingCourseId(null);
    setFormData({
      title: "",
      description: "",
      duration: "",
      fee: "",
      batchTiming: "",
      image: "",
      isFinished: false,
      modules: [],
    });
    setActiveTab("details");
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        toast.error("Image too large (max 1MB)");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await api.delete(`/api/courses/${id}`);
      toast.success("Course deleted");
      fetchCourses();
    } catch (error) {
      toast.error("Failed to delete course");
    }
  };

  const addModule = () => {
    setFormData(prev => ({
      ...prev,
      modules: [...prev.modules, { title: "", lessons: [] }]
    }));
    // Auto-expand new module
    setExpandedModules({ ...expandedModules, [prev.modules.length]: true });
  };

  const removeModule = (mIdx) => {
    setFormData(prev => ({
      ...prev,
      modules: prev.modules.filter((_, i) => i !== mIdx)
    }));
  };

  const addLesson = (mIdx) => {
    const newModules = [...formData.modules];
    const newModule = { ...newModules[mIdx] };
    newModule.lessons = [...newModule.lessons, { title: "", videoUrl: "", notesUrl: "", assignmentUrl: "" }];
    newModules[mIdx] = newModule;
    setFormData({ ...formData, modules: newModules });
  };

  const removeLesson = (mIdx, lIdx) => {
    const newModules = [...formData.modules];
    const newModule = { ...newModules[mIdx] };
    newModule.lessons = newModule.lessons.filter((_, i) => i !== lIdx);
    newModules[mIdx] = newModule;
    setFormData({ ...formData, modules: newModules });
  };

  const updateModuleTitle = (mIdx, title) => {
    const newModules = [...formData.modules];
    newModules[mIdx] = { ...newModules[mIdx], title };
    setFormData({ ...formData, modules: newModules });
  };

  const updateLessonField = (mIdx, lIdx, field, value) => {
    const newModules = [...formData.modules];
    const newModule = { ...newModules[mIdx] };
    const newLessons = [...newModule.lessons];
    newLessons[lIdx] = { ...newLessons[lIdx], [field]: value };
    newModule.lessons = newLessons;
    newModules[mIdx] = newModule;
    setFormData({ ...formData, modules: newModules });
  };

  const toggleModule = (index) => {
    setExpandedModules(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-white pb-20 lg:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 lg:py-8 space-y-5 sm:space-y-6 lg:space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight">Course Catalog</h1>
            <p className="text-slate-500 text-sm sm:text-base mt-1">
              {isAdmin ? "Manage your coaching programs" : "Explore premium coaching programs"}
            </p>
          </div>
          {isAdmin && (
            <button 
              onClick={() => { setIsEditMode(false); setIsAddModalOpen(true); }} 
              className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 sm:px-6 py-3 rounded-xl sm:rounded-2xl font-bold shadow-lg shadow-emerald-200 transition-all active:scale-95 text-sm sm:text-base"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" /> 
              <span>Create Course</span>
            </button>
          )}
        </div>

        {/* Search and Stats Row */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 sm:w-5 sm:h-5" />
            <input 
              type="text" 
              placeholder="Search courses..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              className="w-full pl-10 sm:pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl sm:rounded-2xl outline-none focus:border-emerald-500 transition-all text-slate-800 text-sm sm:text-base" 
            />
          </div>
          <div className="bg-emerald-600 p-3 sm:p-4 rounded-xl sm:rounded-2xl text-white flex items-center justify-between sm:justify-start gap-4 sm:gap-6 shadow-lg shadow-emerald-100">
            <div className="border-r border-emerald-400/50 pr-3 sm:pr-5">
              <p className="text-[10px] sm:text-xs font-bold text-emerald-100 uppercase tracking-wider">Active Programs</p>
              <p className="text-xl sm:text-2xl font-black">{courses.filter(c => !c.isFinished).length}</p>
            </div>
            <Layers className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-200 opacity-70" />
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {filteredCourses.map((course) => (
            <div key={course._id} className={`bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all group overflow-hidden ${course.isFinished ? 'opacity-80 bg-slate-50' : ''}`}>
              <div className="relative p-4 sm:p-5 lg:p-6">
                {course.isFinished && (
                  <div className="absolute top-0 right-0 bg-slate-900 px-3 sm:px-4 py-1 rounded-bl-xl sm:rounded-bl-2xl text-[8px] font-black uppercase tracking-wider text-white">
                    Finished
                  </div>
                )}
                
                {/* Course Header */}
                <div className="flex gap-3 sm:gap-4 mb-4 sm:mb-5">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-emerald-600 text-white rounded-xl sm:rounded-2xl flex items-center justify-center font-black text-xl sm:text-2xl shrink-0 shadow-lg overflow-hidden">
                    {course.image ? (
                      <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                    ) : (
                      course.title?.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-bold text-sm sm:text-base truncate ${course.isFinished ? 'text-slate-500' : 'text-slate-900'}`}>
                      {course.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5">{course.duration}</p>
                    <p className={`font-bold text-sm sm:text-base mt-1 ${course.isFinished ? 'text-slate-400' : 'text-emerald-600'}`}>
                      ₹{course.fee?.toLocaleString()}
                    </p>
                  </div>
                  {isAdmin && (
                    <div className="flex gap-1">
                      <button 
                        onClick={() => handleEditClick(course)} 
                        className="p-1.5 sm:p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                      >
                        <Edit3 className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                      <button 
                        onClick={() => handleDeleteCourse(course._id)} 
                        className="p-1.5 sm:p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>
                  )}
                </div>
                
                {/* Description */}
                <p className="text-slate-500 text-xs sm:text-sm line-clamp-2 mb-4">
                  {course.description || "No description provided"}
                </p>
                
                {/* Enroll Button */}
                {!isAdmin && (
                  <button
                    onClick={() => !enrolledCourses.includes(course._id) && !course.isFinished && navigate(`/course/${course._id}`)}
                    disabled={enrolledCourses.includes(course._id) || course.isFinished}
                    className={`w-full py-3 sm:py-3.5 rounded-xl sm:rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95 ${
                      enrolledCourses.includes(course._id) 
                        ? "bg-emerald-500 text-white" 
                        : course.isFinished 
                          ? "bg-slate-200 text-slate-500 cursor-not-allowed" 
                          : "bg-slate-900 text-white hover:bg-slate-800"
                    }`}
                  >
                    {enrolledCourses.includes(course._id) ? (
                      "✓ Enrolled"
                    ) : course.isFinished ? (
                      "Closed"
                    ) : (
                      <>Enroll <Zap className="w-3 h-3 sm:w-4 sm:h-4" /></>
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-12 sm:py-16">
            <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-medium">No courses found</p>
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm("")} 
                className="mt-3 text-emerald-600 text-sm font-semibold underline"
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={handleCloseModal}></div>
          <div className="relative bg-white w-full max-w-lg rounded-2xl sm:rounded-3xl shadow-2xl max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="sticky top-0 bg-white rounded-t-2xl sm:rounded-t-3xl border-b border-slate-100 px-5 sm:px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  {isEditMode ? "Edit Course" : "Create Course"}
                </h2>
                <button 
                  onClick={handleCloseModal} 
                  className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Tabs */}
              {isEditMode && (
                <div className="flex gap-2 mt-4 bg-slate-100 p-1 rounded-xl">
                  <button 
                    onClick={() => setActiveTab("details")} 
                    className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
                      activeTab === "details" 
                        ? "bg-white text-emerald-600 shadow-sm" 
                        : "text-slate-500"
                    }`}
                  >
                    Details
                  </button>
                  <button 
                    onClick={() => setActiveTab("content")} 
                    className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
                      activeTab === "content" 
                        ? "bg-white text-emerald-600 shadow-sm" 
                        : "text-slate-500"
                    }`}
                  >
                    Content
                  </button>
                </div>
              )}
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
              <form onSubmit={handleSubmit} className="space-y-5">
                {activeTab === "details" ? (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-bold text-slate-700 block mb-2">Course Title *</label>
                      <input 
                        type="text" 
                        value={formData.title} 
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:bg-white focus:border-emerald-500 transition-all text-sm"
                        required 
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-bold text-slate-700 block mb-2">Description</label>
                      <textarea 
                        value={formData.description} 
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:bg-white focus:border-emerald-500 transition-all text-sm h-24 resize-none"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm font-bold text-slate-700 block mb-2">Fee (₹) *</label>
                        <input 
                          type="number" 
                          value={formData.fee} 
                          onChange={(e) => setFormData({ ...formData, fee: e.target.value })} 
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none text-sm"
                          required 
                        />
                      </div>
                      <div>
                        <label className="text-sm font-bold text-slate-700 block mb-2">Duration *</label>
                        <input 
                          type="text" 
                          value={formData.duration} 
                          onChange={(e) => setFormData({ ...formData, duration: e.target.value })} 
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none text-sm"
                          required 
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-bold text-slate-700 block mb-2">Batch Timings *</label>
                      <input 
                        type="text" 
                        value={formData.batchTiming} 
                        onChange={(e) => setFormData({ ...formData, batchTiming: e.target.value })} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none text-sm"
                        required 
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-bold text-slate-700 block mb-2">Image URL</label>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          value={formData.image} 
                          onChange={(e) => setFormData({ ...formData, image: e.target.value })} 
                          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none text-sm"
                          placeholder="Image URL"
                        />
                        <label className="bg-slate-100 px-4 py-3 rounded-xl text-sm font-medium cursor-pointer">
                          Upload
                          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                        </label>
                      </div>
                    </div>
                    
                    {isEditMode && (
                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                        <span className="text-sm font-bold text-slate-700">Mark as Finished</span>
                        <button 
                          type="button" 
                          onClick={() => setFormData({ ...formData, isFinished: !formData.isFinished })} 
                          className={`w-11 h-6 rounded-full transition-colors relative ${
                            formData.isFinished ? 'bg-amber-500' : 'bg-slate-300'
                          }`}
                        >
                          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                            formData.isFinished ? 'right-1' : 'left-1'
                          }`}></div>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-slate-800">Course Modules</h3>
                      <button 
                        type="button" 
                        onClick={addModule} 
                        className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg"
                      >
                        + Add Module
                      </button>
                    </div>
                    
                    {formData.modules.map((module, mIdx) => (
                      <div key={mIdx} className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
                        <div className="flex items-center gap-2 p-3 bg-white border-b border-slate-100">
                          <button
                            type="button"
                            onClick={() => toggleModule(mIdx)}
                            className="p-1 hover:bg-slate-100 rounded"
                          >
                            {expandedModules[mIdx] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                          <input 
                            type="text" 
                            placeholder="Module Title *" 
                            value={module.title} 
                            onChange={(e) => updateModuleTitle(mIdx, e.target.value)} 
                            className="flex-1 bg-transparent border-none outline-none text-sm font-bold placeholder:text-slate-300"
                            required
                          />
                          <button 
                            type="button" 
                            onClick={() => removeModule(mIdx)} 
                            className="p-1 text-slate-400 hover:text-rose-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        
                        {expandedModules[mIdx] && (
                          <div className="p-3 space-y-3">
                            {module.lessons.map((lesson, lIdx) => (
                              <div key={lIdx} className="bg-white p-3 rounded-lg border border-slate-200 space-y-2">
                                <div className="flex gap-2">
                                  <input 
                                    type="text" 
                                    placeholder="Lesson Title *" 
                                    value={lesson.title} 
                                    onChange={(e) => updateLessonField(mIdx, lIdx, "title", e.target.value)} 
                                    className="flex-1 text-sm font-medium outline-none border-b border-slate-200 focus:border-emerald-500 pb-1"
                                    required
                                  />
                                  <button 
                                    type="button" 
                                    onClick={() => removeLesson(mIdx, lIdx)} 
                                    className="text-slate-400 hover:text-rose-500"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                                <input 
                                  type="text" 
                                  placeholder="Video URL" 
                                  value={lesson.videoUrl} 
                                  onChange={(e) => updateLessonField(mIdx, lIdx, "videoUrl", e.target.value)} 
                                  className="w-full bg-slate-50 px-3 py-2 rounded-lg text-xs outline-none focus:border-emerald-500 border border-slate-200"
                                />
                                <div className="grid grid-cols-2 gap-2">
                                  <input 
                                    type="text" 
                                    placeholder="Notes URL" 
                                    value={lesson.notesUrl} 
                                    onChange={(e) => updateLessonField(mIdx, lIdx, "notesUrl", e.target.value)} 
                                    className="bg-slate-50 px-3 py-2 rounded-lg text-xs outline-none focus:border-emerald-500 border border-slate-200"
                                  />
                                  <input 
                                    type="text" 
                                    placeholder="Assignment URL" 
                                    value={lesson.assignmentUrl} 
                                    onChange={(e) => updateLessonField(mIdx, lIdx, "assignmentUrl", e.target.value)} 
                                    className="bg-slate-50 px-3 py-2 rounded-lg text-xs outline-none focus:border-emerald-500 border border-slate-200"
                                  />
                                </div>
                              </div>
                            ))}
                            <button 
                              type="button" 
                              onClick={() => addLesson(mIdx)} 
                              className="w-full py-2 border border-dashed border-slate-300 rounded-lg text-xs font-medium text-slate-500 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                            >
                              + Add Lesson
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {formData.modules.length === 0 && (
                      <div className="text-center py-8">
                        <p className="text-slate-400 text-sm">No modules added yet</p>
                        <button type="button" onClick={addModule} className="mt-3 text-emerald-600 text-sm font-semibold">
                          + Add First Module
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </form>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t border-slate-100 p-5 sm:p-6 rounded-b-2xl sm:rounded-b-3xl">
              <button 
                onClick={handleSubmit} 
                className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 hover:bg-slate-800 active:scale-95"
              >
                <span>{isEditMode ? "Update Course" : "Create Course"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Courses;