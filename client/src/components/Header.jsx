import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  BookOpen,
  Menu,
  X,
  LogIn,
  ArrowRight,
  User,
  LayoutDashboard,
  GraduationCap,
  Megaphone,
  Trophy,
  Home,
  ChevronRight,
  Image,
  LogOut,
  Bell,
  MessageSquare,
  Users,
  Award,
  CreditCard,
  Globe,
  HelpCircle
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const publicLinks = [
    { name: "Home", path: "/", icon: Home },
    // { name: "Courses", path: "/courses", icon: GraduationCap },
    { name: "Gallery", path: "/gallery", icon: Image },
    { name: "Toppers", path: "/toppers", icon: Trophy },
    { name: "Notices", path: "/notices", icon: Megaphone },
    { name: "FAQ", path: "/faq", icon: HelpCircle },
  ];

  const studentLinks = [
    { name: "Home", path: "/", icon: Home },
    { name: "Gallery", path: "/gallery", icon: Image },
    // { name: "Dashboard", path: "/student/dashboard", icon: LayoutDashboard },
    { name: "Toppers", path: "/toppers", icon: Trophy },
    // { name: "Courses", path: "/courses", icon: BookOpen },
    { name: "Notices", path: "/notices", icon: Bell },
     { name: "My Profile", path: "/student/profile", icon: User },
     { name: "FAQ", path: "/faq", icon: HelpCircle },
  ];

  const adminLinks = [
    { name: "Home", path: "/", icon: Home },
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { name: "Students", path: "/admin/students", icon: Users },
    { name: "Courses", path: "/admin/courses", icon: BookOpen },
    { name: "Notices", path: "/admin/notices", icon: Bell },
    { name: "Toppers", path: "/admin/toppers", icon: Award },
    { name: "Inquiries", path: "/admin/inquiries", icon: MessageSquare },
    { name: "Payments", path: "/admin/payments", icon: CreditCard },
    // { name: "Profile", path: "/admin/profile", icon: User },
  ];

  const navLinks = user 
    ? (user.role === 'admin' ? adminLinks : studentLinks)
    : publicLinks;

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500  ${
          scrolled
            ? "bg-white/98 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] border-b border-slate-200/50"
            : "bg-white/90 backdrop-blur-md border-b border-slate-100"
        }`}
      >
        <div className=" mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link
              to="/"
              className="group relative flex items-center gap-2.5 lg:gap-3"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-linear-to-r from-green-600 to-green-800 rounded-xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
                <div className="relative w-9 h-9 lg:w-11 lg:h-11 bg-linear-to-br from-green-600 via-green-600 to-green-700 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20 group-hover:scale-105 transition-all duration-500 group-hover:shadow-xl group-hover:shadow-green-500/30">
                <img src="https://imgs.search.brave.com/Y2zfxDJsPu--f1N5_N3uA0cyumAyIhL42s6Zulc_d2c/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZmF2cG5nLmNvbS8x/My84LzIxL3N0LXhh/dmllci1zLWNvbGxl/Z2lhdGUtc2Nob29s/LXN0LXhhdmllci1z/LXVuaXZlcnNpdHkt/a29sa2F0YS1zdC14/YXZpZXItcy1jb2xs/ZWdlLWtvbGthdGEt/c3QteGF2aWVyLXMt/Y29sbGVnZS1tdW1i/YWktcHJlc2lkZW5j/eS11bml2ZXJzaXR5/LWtvbGthdGEtcG5n/LWZhdnBuZy0zMnNV/M2VrM2dQaU13amFh/Y1FSWkRyaDE4X3Qu/anBn" alt="Logo" className="w-full h-full object-cover rounded-xl" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-lg lg:text-xl font-bold bg-linear-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent tracking-tight">
                  Mumbai Public School
                </span>
                <span className="text-[10px] lg:text-xs text-slate-700 tracking-wider hidden sm:block">
                  Darbhanga
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2 bg-slate-50/50 rounded-full p-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative px-4 lg:px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    isActive(link.path)
                      ? "text-white"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {isActive(link.path) && (
                    <span className="absolute inset-0 bg-linear-to-r from-slate-800 to-slate-700 rounded-full shadow-md animate-fade-in" />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <link.icon className="w-4 h-4" />
                    {link.name}
                  </span>
                </Link>
              ))}
            </nav>

            {/* Desktop Auth Actions */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-2">
                  <div className="h-9 w-px bg-slate-200 mx-2" />
                
                    <Link to={ user.role === 'admin' ? "/admin" : "/student/profile"} className="group flex items-center gap-3  p-1 rounded-full transition-colors pr-4 border border-transparent ">
                      <div className="w-9 h-9 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shrink-0 shadow-sm overflow-hidden">
                        {user.image ? (
                          <img src={user.image} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-5 h-5" />
                        )}
                      </div>
                    </Link>
                  
                    <button 
                      onClick={handleLogout}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                      title="Sign Out"
                    >
                      <LogOut className="w-5 h-5" />
                    </button>
                 
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="group flex items-center gap-2 text-slate-700 font-medium text-sm px-5 py-2.5 rounded-xl hover:bg-slate-100 transition-all duration-200 active:scale-95"
                  >
                    <LogIn className="w-4 h-4 text-emerald-500 transition-transform group-hover:scale-110" />
                    <span>Sign In</span>
                  </Link>
                  <Link
                    to="/signup"
                    className="group flex items-center gap-2 bg-linear-to-r from-emerald-600 to-teal-600 text-white px-5 py-2.5 rounded-xl font-medium text-sm hover:from-emerald-500 hover:to-teal-500 transition-all duration-300 shadow-lg shadow-emerald-200 hover:shadow-xl active:scale-95"
                  >
                    <User className="w-4 h-4" />
                    <span>Get Started</span>
                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100 transition-all duration-200 active:scale-95"
              aria-label="Toggle menu"
            >
              <div
                className={`absolute inset-0 rounded-xl bg-slate-100 transition-opacity duration-200 ${isMenuOpen ? "opacity-100" : "opacity-0"}`}
              />
              {isMenuOpen ? (
                <X className="w-5 h-5 relative z-10 animate-in zoom-in-50 duration-200" />
              ) : (
                <Menu className="w-5 h-5 relative z-10 animate-in fade-in duration-200" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-500 z-500 ${
          isMenuOpen ? "visible" : "invisible"
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-linear-to-b from-slate-900/60 to-slate-900/40 backdrop-blur-md transition-opacity duration-500 ${
            isMenuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsMenuOpen(false)}
        />

        {/* Drawer */}
        <div
          className={`absolute top-0 right-0 bottom-0 w-[320px] max-w-[85vw] bg-white shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] flex flex-col ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Drawer Header */}
          <div className="flex items-center justify-between p-5 border-b border-emerald-50 bg-gradient-to-r from-emerald-50/50 to-white">
            <div className="flex items-center gap-3">
             <Link to="/">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center shadow-md shadow-emerald-500/20">
              <img src="/logo.jpeg" alt="Logo" className="w-full h-full object-cover rounded-xl" />
              </div>
             </Link>
              <div>
                <span className="text-base font-bold text-slate-800 block tracking-tight leading-tight">
                  Mourya Accadmy
                </span>
                <span className="text-[12px] text-slate-700 tracking-wider font-semibold">
                  Darbhanga
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2 -mr-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-200"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
              
            </button>
          </div>

          {/* Drawer Navigation */}
          <nav className="flex flex-col p-5 gap-2 overflow-y-auto">
            {navLinks.map((link, index) => (
              <Link
                key={link.name}
                to={link.path}
                className={`group relative px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 overflow-hidden ${
                  isActive(link.path)
                    ? "bg-neutral-900 text-white shadow-md shadow-emerald-500/20"
                    : "text-neutral-900 hover:text-emerald-700 font-semibold"
                }`}
                style={{
                  transitionDelay: `${index * 50}ms`,
                }}
              >
                <span className="relative z-10 flex items-center gap-3">
                  <link.icon
                    className={`w-4 h-4 transition-all duration-300 ${isActive(link.path) ? "text-white" : "text-slate-900 group-hover:text-emerald-600"}`}
                  />
                  {link.name}
                  {isActive(link.path) && (
                    <ChevronRight className="w-3.5 h-3.5 ml-auto text-white" />
                  )}
                </span>
                {!isActive(link.path) && (
                  <span className="absolute inset-0  opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                )}
              </Link>
            ))}

          </nav>

          {/* Drawer Divider */}
          <div className="px-6">
            <div className="h-px bg-linear-to-r from-transparent via-slate-200 to-transparent" />
          </div>

          {/* Drawer Auth Actions */}
          <div className="px-5 pb-5 space-y-3 mt-2">
            {user ? (
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 text-red-600 text-sm font-medium py-3 rounded-xl border border-red-100 bg-red-50 hover:bg-red-100 transition-all duration-200 active:scale-95"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 text-slate-700 text-sm font-medium py-3 rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 active:scale-95"
                >
                  <LogIn className="w-4 h-4 text-emerald-500" />
                  <span>Sign In</span>
                </Link>
             
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
