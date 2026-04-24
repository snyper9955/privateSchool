import React, { useState, useEffect } from 'react';
import { useApi } from '../context/ApiContext';
import { 
  CreditCard, 
  Search, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Filter,
  MoreVertical,
  User,
  CheckCircle2,
  XCircle,
  Clock,
  IndianRupee,
  Plus
} from 'lucide-react';
import toast from 'react-hot-toast';

const Payments = () => {
    const api = useApi();
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchPayments();
    }, [api]);

    const fetchPayments = async () => {
        try {
            const { data } = await api.get('/api/payments');
            setPayments(data.data || []);
        } catch (error) {
            toast.error('Failed to fetch payments');
        } finally {
            setLoading(false);
        }
    };

    const getStatusStyles = (status) => {
        switch(status) {
            case 'success': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'failed': return 'bg-rose-50 text-rose-600 border-rose-100';
            default: return 'bg-amber-50 text-amber-600 border-amber-100';
        }
    };

    const totalRevenue = payments
        .filter(p => p.status === 'success')
        .reduce((acc, p) => acc + p.amount, 0);

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Payments & Revenue</h1>
                    <p className="text-slate-500 font-medium mt-1">Track fee collections and transaction records</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-emerald-500 text-white px-6 py-3.5 rounded-2xl font-bold shadow-lg shadow-emerald-100 flex items-center gap-2">
                        <IndianRupee className="w-5 h-5" />
                        <span>Total: ₹{(totalRevenue || 0).toLocaleString()}</span>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-4">
                        <CreditCard className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Transactions</p>
                    <p className="text-3xl font-extrabold text-slate-900 mt-1">{payments.length}</p>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-4">
                        <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Success Rate</p>
                    <p className="text-3xl font-extrabold text-slate-900 mt-1">
                        {payments.length > 0 ? Math.round((payments.filter(p => p.status === 'success').length / payments.length) * 100) : 0}%
                    </p>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-4">
                        <Clock className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Pending Tasks</p>
                    <p className="text-3xl font-extrabold text-slate-900 mt-1">
                        {payments.filter(p => p.status === 'pending').length}
                    </p>
                </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-white rounded-4xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Search by student or transaction ID..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-emerald-500 transition-all text-slate-800 font-medium"
                        />
                    </div>
                    <button className="inline-flex items-center gap-2 px-6 py-3 bg-slate-50 text-slate-600 rounded-2xl font-bold border border-slate-100 hover:bg-slate-100 transition-all">
                        <Filter className="w-5 h-5" />
                        <span>Filter</span>
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Student</th>
                                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Amount</th>
                                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Method</th>
                                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Date</th>
                                <th className="px-8 py-5"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {payments.length > 0 ? payments.map((payment) => (
                                <tr key={payment._id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center">
                                                <User className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 text-sm whitespace-nowrap">{payment.student?.name || 'Walk-in Student'}</p>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">ID: {payment.transactionId || 'CASH_TXN'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="font-black text-slate-900">₹{(payment.amount || 0).toLocaleString()}</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="text-xs font-bold text-slate-600 uppercase bg-slate-100 px-2 py-1 rounded">
                                            {payment.method || 'OTHER'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyles(payment.status)}`}>
                                            {payment.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="text-xs font-bold text-slate-500">
                                            {new Date(payment.createdAt).toLocaleDateString()}
                                        </p>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <button className="p-2 text-slate-300 hover:text-slate-600 rounded-lg">
                                            <MoreVertical className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6" className="px-8 py-20 text-center text-slate-400">
                                        <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-10" />
                                        <p className="italic font-medium">No payment history available</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Payments;
