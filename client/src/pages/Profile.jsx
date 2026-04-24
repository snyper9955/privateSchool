import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApi } from '../context/ApiContext';
import { 
  User, Mail, Lock, Save, UserCircle, Shield, 
  Calendar, Edit2, X, Eye, EyeOff, Award, 
  BookOpen, Clock, TrendingUp, LogOut, 
  Smartphone, Key, CheckCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const { user, setUser, logout } = useAuth();
    const api = useApi();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (user) {
            setFormData(prev => ({ 
                ...prev, 
                name: user.name, 
                email: user.email,
                phone: user?.phone || ''
            }));
        }
    }, [user]);

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Name required';
        if (!formData.email.trim()) newErrors.email = 'Email required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email';
        
        if (formData.newPassword) {
            if (formData.newPassword.length < 6) newErrors.newPassword = 'Min 6 characters';
            if (formData.newPassword !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords mismatch';
            if (!formData.currentPassword) newErrors.currentPassword = 'Current password required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            toast.error('Please fix errors');
            return;
        }

        setLoading(true);
        try {
            const updateData = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
            };
            
            if (formData.newPassword) {
                updateData.currentPassword = formData.currentPassword;
                updateData.newPassword = formData.newPassword;
            }
            
            const { data } = await api.put('/api/auth/profile', updateData);
            
            const updatedUser = { ...user, name: data.name, email: data.email, phone: data.phone };
            localStorage.setItem('userInfo', JSON.stringify(updatedUser));
            if (setUser) setUser(updatedUser);
            
            toast.success('Profile updated');
            setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
            setIsEditing(false);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Update failed');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        if (logout) {
            logout();
            navigate('/login');
        }
    };

    const memberSince = user?.createdAt ? new Date(user.createdAt).getFullYear() : new Date().getFullYear();

    

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
                            <UserCircle className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
                            <p className="text-sm text-gray-500">Manage your account</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-emerald-700 transition"
                    >
                        <Edit2 className="w-4 h-4" />
                        Edit
                    </button>
                </div>

           

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Profile Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="bg-emerald-600 px-6 py-6 text-center">
                            <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md">
                                <span className="text-3xl font-bold text-emerald-600">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <h2 className="text-lg font-bold text-white">{user?.name}</h2>
                            <p className="text-emerald-100 text-xs mt-0.5 capitalize">{user?.role || 'Student'}</p>
                        </div>
                        <div className="p-5 space-y-3">
                            <div className="flex items-center gap-3 text-sm">
                                <Mail className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-700">{user?.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Smartphone className="w-4 h-4 text-gray-400" />
                                <span className={user?.phone ? "text-gray-700" : "text-gray-400 italic"}>
                                    {user?.phone || 'No phone added'}
                                </span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-700">Since {memberSince}</span>
                            </div>
                            <div className="pt-3 border-t border-gray-100">
                                <div className="flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-green-500" />
                                    <span className="text-xs text-gray-500">Status:</span>
                                    <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Verified</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions & Security */}
                    <div className="space-y-4">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                            <h3 className="font-semibold text-gray-800 mb-3 text-sm">Quick Actions</h3>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 text-gray-700 hover:text-red-600 transition-all text-left"
                            >
                                <LogOut className="w-4 h-4 text-red-500" />
                                <span className="text-sm font-medium">Logout</span>
                            </button>
                        </div>

                        <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100">
                            <div className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-xs font-semibold text-amber-800">Security Tip</p>
                                    <p className="text-xs text-amber-700 mt-0.5">
                                        Use a strong, unique password for better security.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            {isEditing && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsEditing(false)}></div>
                    <div className="flex min-h-full items-center justify-center p-4">
                        <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full">
                            <div className="flex items-center justify-between p-5 border-b border-gray-100">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                                        <Edit2 className="w-4 h-4 text-emerald-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">Edit Profile</h3>
                                        <p className="text-xs text-gray-500">Update your info</p>
                                    </div>
                                </div>
                                <button onClick={() => setIsEditing(false)} className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center">
                                    <X className="w-4 h-4 text-gray-500" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-5 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className={`w-full pl-9 pr-3 py-2 bg-gray-50 border rounded-lg text-gray-800 focus:bg-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none text-sm ${
                                                errors.name ? 'border-red-300' : 'border-gray-200'
                                            }`}
                                        />
                                    </div>
                                    {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className={`w-full pl-9 pr-3 py-2 bg-gray-50 border rounded-lg text-gray-800 focus:bg-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none text-sm ${
                                                errors.email ? 'border-red-300' : 'border-gray-200'
                                            }`}
                                        />
                                    </div>
                                    {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                    <div className="relative">
                                        <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:bg-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none text-sm"
                                        />
                                    </div>
                                </div>

                                {/* Password Change */}
                                <div>
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, showPasswordFields: !prev.showPasswordFields }))}
                                        className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-2"
                                    >
                                        <Key className="w-4 h-4" />
                                        Change Password
                                    </button>
                                </div>

                                {formData.showPasswordFields && (
                                    <div className="space-y-3 pt-2 border-t border-gray-100">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    value={formData.currentPassword}
                                                    onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                                                    className="w-full pl-9 pr-9 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:border-emerald-400 outline-none"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2"
                                                >
                                                    {showPassword ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
                                                </button>
                                            </div>
                                            {errors.currentPassword && <p className="text-xs text-red-500 mt-1">{errors.currentPassword}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                            <input
                                                type="password"
                                                value={formData.newPassword}
                                                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:border-emerald-400 outline-none"
                                                placeholder="Min 6 characters"
                                            />
                                            {errors.newPassword && <p className="text-xs text-red-500 mt-1">{errors.newPassword}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                                            <input
                                                type="password"
                                                value={formData.confirmPassword}
                                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:border-emerald-400 outline-none"
                                            />
                                            {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
                                        </div>
                                    </div>
                                )}

                                <div className="flex gap-3 pt-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-200 transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium text-sm flex items-center justify-center gap-2 hover:bg-emerald-700 transition disabled:opacity-50"
                                    >
                                        {loading ? (
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <>
                                                <Save className="w-4 h-4" />
                                                Save
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;