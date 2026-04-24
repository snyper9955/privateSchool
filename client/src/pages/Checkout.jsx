import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApi } from '../context/ApiContext';
import { useAuth } from '../context/AuthContext';
import { 
  CreditCard, 
  ShieldCheck, 
  Info,
  BadgeCheck,
  Lock,
  Wallet,
  Zap,
  BookOpen,
  Clock,
  Award,
  ChevronRight,
  Users,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Fingerprint,
  Smartphone,
  Building
} from 'lucide-react';
import toast from 'react-hot-toast';

const Checkout = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const api = useApi();
    const { user } = useAuth();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const { data } = await api.get(`/api/courses`);
                const found = data.data?.find(c => c._id === courseId);
                if (found) {
                    setCourse(found);
                } else {
                    toast.error('Course not found');
                    navigate('/courses');
                }
            } catch (error) {
                console.error('Failed to load course', error);
                toast.error('Failed to load course details');
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [courseId, api, navigate]);

    const handlePayment = async () => {
        if (!user) {
            toast.error('Please login to enroll');
            navigate('/login', { state: { from: `/checkout/${courseId}` } });
            return;
        }

        setProcessing(true);
        try {
            // Create Order
            const { data: orderData } = await api.post('/api/payments/order', {
                amount: course.fee,
                courseId: course._id
            });

            if (!orderData.success) {
                throw new Error(orderData.message || 'Failed to create order');
            }

            // Simulate payment verification with selected method
            const { data: verifyData } = await api.post('/api/payments/verify', {
                razorpay_order_id: orderData.order.id,
                razorpay_payment_id: `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                razorpay_signature: 'test_signature',
                courseId: course._id,
                method: paymentMethod // Pass the selected payment method
            });

            if (verifyData.success) {
                setShowSuccessAnimation(true);
                toast.success('Successfully Enrolled! 🎉', {
                    duration: 4000,
                    icon: '✅'
                });
                setTimeout(() => {
                    navigate('/dashboard');
                }, 2000);
            } else {
                toast.error(verifyData.message || 'Enrollment failed. Please try again.');
            }
        } catch (error) {
            console.error('Payment failed', error);
            const errorMessage = error.response?.data?.message || error.message || 'Payment failed. Please try again.';
            toast.error(errorMessage);
        } finally {
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-gray-200 border-t-emerald-600 rounded-full animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <BookOpen className="w-6 h-6 text-emerald-600 animate-pulse" />
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 font-medium">Preparing your checkout...</p>
                </div>
            </div>
        );
    }

    if (!course) return null;

    // Success Animation Overlay
    if (showSuccessAnimation) {
        return (
            <div className="fixed inset-0 bg-linear-to-br from-emerald-500 to-emerald-700 z-50 flex items-center justify-center animate-in fade-in duration-500">
                <div className="text-center text-white px-6">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                        <CheckCircle className="w-14 h-14 text-emerald-600" />
                    </div>
                    <h2 className="text-3xl font-bold mb-2">Enrollment Successful!</h2>
                    <p className="text-emerald-100 mb-6">You're now enrolled in {course.title}</p>
                    <div className="w-12 h-12 border-3 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
                    <p className="text-sm text-emerald-100 mt-4">Redirecting to dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50">
            {/* Mobile Sticky Bottom Bar - Always visible on mobile */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-2xl z-50 animate-in slide-in-from-bottom duration-300">
                <div className="px-4 py-3">
                    <div className="flex items-center justify-between gap-3 mb-2">
                        <div>
                            <p className="text-xs text-gray-500">Total Amount</p>
                            <p className="text-2xl font-bold text-emerald-600">₹{course.fee?.toLocaleString()}</p>
                            {course.originalFee && (
                                <p className="text-xs text-gray-400 line-through">₹{course.originalFee.toLocaleString()}</p>
                            )}
                        </div>
                        <button
                            onClick={handlePayment}
                            disabled={processing}
                            className={`flex-1 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 ${
                                processing 
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                    : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-200'
                            }`}
                        >
                            {processing ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                                    Processing...
                                </>
                            ) : (
                                <><Zap className="w-4 h-4" /> Enroll Now</>
                            )}
                        </button>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Secure Payment</span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <Lock className="w-3 h-3" />
                        <span>SSL Encrypted</span>
                    </div>
                </div>
            </div>

            {/* Main Content with Bottom Padding for Mobile */}
            <div className="pb-24 lg:pb-16">
                {/* Top Navigation Bar */}
                <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <button 
                                onClick={() => navigate(-1)}
                                className="flex items-center gap-2 text-gray-500 hover:text-emerald-600 transition-colors group"
                            >
                                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                                <span className="text-sm font-medium hidden sm:inline">Back</span>
                            </button>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                                    <span className="text-xs font-medium text-gray-600 hidden sm:inline">100% Secure</span>
                                </div>
                                <div className="w-px h-4 bg-gray-200 hidden sm:block"></div>
                                <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                    <span className="text-xs text-gray-500">SSL Encrypted</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Breadcrumb */}
                <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mt-6 mb-8">
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 flex-wrap">
                        <Link to="/" className="hover:text-emerald-600 transition-colors">Home</Link>
                        <ChevronRight className="w-3 h-3" />
                        <Link to="/courses" className="hover:text-emerald-600 transition-colors">Courses</Link>
                        <ChevronRight className="w-3 h-3" />
                        <Link to={`/course/${courseId}`} className="hover:text-emerald-600 transition-colors truncate max-w-[120px] sm:max-w-[200px]">
                            {course.title}
                        </Link>
                        <ChevronRight className="w-3 h-3" />
                        <span className="text-gray-800 font-medium">Checkout</span>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-full mb-4">
                            <Wallet className="w-4 h-4 text-emerald-600" />
                            <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">Secure Checkout</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">Complete Your Enrollment</h1>
                        <p className="text-gray-500 max-w-md mx-auto">Secure your spot and start learning today</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                        {/* Left Column - Course Summary */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Course Summary Card */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                                <div className="p-5 sm:p-8">
                                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                                        <BookOpen className="w-5 h-5 text-emerald-600" />
                                        Course Summary
                                    </h2>
                                    
                                    <div className="flex gap-4 sm:gap-5 mb-6 p-4 sm:p-5 bg-linear-to-r from-emerald-50 to-emerald-100/30 rounded-xl">
                                        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-linear-to-r from-emerald-600 to-emerald-700 text-white rounded-xl flex items-center justify-center font-bold text-xl sm:text-2xl shadow-md shrink-0">
                                            {course.title?.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-gray-900 text-base sm:text-lg truncate">{course.title}</h3>
                                            <p className="text-xs sm:text-sm text-gray-500 mt-1">{course.duration || '3 Months'} • {course.category || 'Professional Course'}</p>
                                            <div className="flex flex-wrap items-center gap-2 mt-2">
                                                <span className="text-xl sm:text-2xl font-bold text-emerald-600">₹{course.fee?.toLocaleString()}</span>
                                                {course.originalFee && (
                                                    <>
                                                        <span className="text-xs sm:text-sm text-gray-400 line-through">₹{course.originalFee.toLocaleString()}</span>
                                                        <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
                                                            Save ₹{(course.originalFee - course.fee).toLocaleString()}
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="font-semibold text-gray-800 text-sm sm:text-base">What's Included:</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {[
                                                "Lifetime access to materials",
                                                "Verifiable certificate",
                                                "Community forum access",
                                                "Doubt clearing sessions",
                                                "Practice assignments",
                                                "Placement assistance"
                                            ].map((item, idx) => (
                                                <div key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm text-gray-600">
                                                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                                                    <span>{item}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Trust Indicators */}
                            <div className="bg-white rounded-2xl p-5 sm:p-8 shadow-sm border border-gray-100">
                                <h3 className="font-semibold text-gray-800 mb-5 flex items-center gap-2 text-sm sm:text-base">
                                    <Zap className="w-5 h-5 text-amber-500" />
                                    Why Choose Us?
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {[
                                        { icon: Award, label: "Industry Recognized", value: "Certificate" },
                                        { icon: Users, label: "Happy Students", value: "5000+" },
                                        { icon: Clock, label: "Flexible Schedule", value: "Self-paced" }
                                    ].map((item, idx) => (
                                        <div key={idx} className="text-center p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                                            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                                <item.icon className="w-5 h-5 text-emerald-600" />
                                            </div>
                                            <p className="text-xs text-gray-500">{item.label}</p>
                                            <p className="text-sm font-semibold text-gray-800">{item.value}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Info Note */}
                            <div className="bg-blue-50 rounded-2xl p-4 sm:p-5 border border-blue-100 flex items-start gap-3">
                                <Info className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-sm font-semibold text-blue-900">Instant Access Guaranteed</p>
                                    <p className="text-xs text-blue-700 mt-0.5">
                                        After successful payment, you'll get immediate access to the course content. 
                                        Your dashboard will be updated within seconds.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Payment Card */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-24">
                                {/* Payment Card */}
                                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                                    <div className="bg-linear-to-r from-gray-900 to-gray-800 px-5 sm:px-6 py-5">
                                        <h3 className="text-white font-bold text-lg flex items-center gap-2">
                                            <Wallet className="w-5 h-5" />
                                            Payment Details
                                        </h3>
                                    </div>

                                    <div className="p-5 sm:p-6">
                                        {/* Price Breakdown */}
                                        <div className="space-y-3 pb-5 mb-5 border-b border-gray-100">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">Course Fee</span>
                                                <span className="font-semibold text-gray-800">₹{course.fee?.toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">Taxes (GST)</span>
                                                <span className="text-emerald-600 font-medium text-xs bg-emerald-50 px-2 py-0.5 rounded">Included</span>
                                            </div>
                                            <div className="flex justify-between pt-3 mt-2 border-t border-gray-100">
                                                <span className="font-bold text-gray-900">Total Amount</span>
                                                <span className="text-xl font-bold text-emerald-600">₹{course.fee?.toLocaleString()}</span>
                                            </div>
                                        </div>

                                        {/* Payment Methods */}
                                        <div className="mb-6">
                                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Select Payment Method</p>
                                            <div className="space-y-2">
                                                {[
                                                    { id: 'card', icon: CreditCard, label: 'Credit / Debit Card', desc: 'Visa, Mastercard, RuPay' },
                                                    { id: 'upi', icon: Smartphone, label: 'UPI', desc: 'Google Pay, PhonePe, Paytm' },
                                                    { id: 'netbanking', icon: Building, label: 'Net Banking', desc: 'All major banks' }
                                                ].map((method) => (
                                                    <label 
                                                        key={method.id}
                                                        className={`flex items-start gap-3 p-3 border rounded-xl cursor-pointer transition-all ${
                                                            paymentMethod === method.id 
                                                                ? 'border-emerald-400 bg-emerald-50/50 shadow-sm' 
                                                                : 'border-gray-200 hover:border-emerald-300'
                                                        }`}
                                                    >
                                                        <input 
                                                            type="radio" 
                                                            name="paymentMethod" 
                                                            value={method.id}
                                                            checked={paymentMethod === method.id}
                                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                                            className="w-4 h-4 text-emerald-600 mt-1 shrink-0"
                                                        />
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2">
                                                                <method.icon className={`w-4 h-4 ${paymentMethod === method.id ? 'text-emerald-600' : 'text-gray-500'}`} />
                                                                <span className="text-sm font-medium text-gray-700">{method.label}</span>
                                                            </div>
                                                            <p className="text-xs text-gray-400 mt-0.5">{method.desc}</p>
                                                        </div>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Enroll Button - Desktop */}
                                        <button 
                                            onClick={handlePayment}
                                            disabled={processing}
                                            className={`hidden lg:flex w-full py-4 rounded-xl font-bold text-base items-center justify-center gap-2 transition-all ${
                                                processing 
                                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                                                    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                                            }`}
                                        >
                                            {processing ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    Processing Payment...
                                                </>
                                            ) : (
                                                <>
                                                    <Fingerprint className="w-4 h-4" />
                                                    Pay ₹{course.fee?.toLocaleString()} & Enroll
                                                </>
                                            )}
                                        </button>

                                        {/* Security Badges */}
                                        <div className="mt-6 pt-4 border-t border-gray-100">
                                            <div className="flex flex-wrap items-center justify-center gap-3">
                                                <div className="flex items-center gap-1.5">
                                                    <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
                                                    <span className="text-[10px] font-medium text-gray-400 uppercase">Secure Payment</span>
                                                </div>
                                                <div className="w-px h-3 bg-gray-200"></div>
                                                <div className="flex items-center gap-1.5">
                                                    <Lock className="w-3.5 h-3.5 text-green-600" />
                                                    <span className="text-[10px] font-medium text-gray-400 uppercase">SSL Encrypted</span>
                                                </div>
                                                <div className="w-px h-3 bg-gray-200"></div>
                                                <div className="flex items-center gap-1.5">
                                                    <BadgeCheck className="w-3.5 h-3.5 text-green-600" />
                                                    <span className="text-[10px] font-medium text-gray-400 uppercase">Instant Access</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Payment Partner */}
                                        <div className="mt-4 text-center">
                                            <p className="text-[10px] text-gray-400">Secured by</p>
                                            <div className="flex items-center justify-center gap-2 mt-1">
                                                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/1200px-PayPal.svg.png" alt="paypal" className="h-3 opacity-50" />
                                                <span className="text-xs font-semibold text-gray-500">Razorpay</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Help Card */}
                                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mt-6">
                                    <h4 className="font-semibold text-gray-800 text-sm mb-2 flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4 text-blue-500" />
                                        Need Assistance?
                                    </h4>
                                    <p className="text-xs text-gray-500 leading-relaxed">
                                        Having trouble with payment? Contact our support team at 
                                        <a href="mailto:support@example.com" className="text-emerald-600 font-medium ml-1">support@example.com</a>
                                        <br />
                                        <span className="text-[10px] text-gray-400 mt-1 block">Response within 24 hours</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;