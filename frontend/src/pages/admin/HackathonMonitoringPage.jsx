import React, { useState, useEffect } from 'react';
import { hackathonAPI } from '../../services/api';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { Search, Loader2, Activity, Link as LinkIcon, Download, RefreshCw } from 'lucide-react';

const HackathonMonitoringPage = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchActivities();
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    const fetchActivities = async () => {
        try {
            setLoading(true);
            const res = await hackathonAPI.getAllActivities({ search: searchTerm });
            if (res.data.success) {
                setActivities(res.data.data);
            }
        } catch (error) {
            toast.error('Failed to load activity logs');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <Activity className="text-brand-600" />
                        Live Hackathon Tracking
                    </h1>
                    <p className="text-gray-500 mt-1">Monitor real-time student interactions with live competitions.</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={fetchActivities} className="btn btn-secondary border border-gray-200 shadow-sm flex items-center gap-2">
                        <RefreshCw size={16} /> Sync
                    </button>
                    <button className="btn btn-primary bg-brand-600 border-none flex items-center gap-2">
                        <Download size={16} /> Export Logs
                    </button>
                </div>
            </header>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-96">
                        <input
                            type="text"
                            placeholder="Search by student name, enrollment, or hackathon..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-brand-500 focus:border-brand-500 block w-full pl-10 p-2.5"
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                            <Search size={18} />
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="flex justify-center items-center py-20 text-brand-600">
                            <Loader2 className="animate-spin" size={32} />
                        </div>
                    ) : activities.length === 0 ? (
                        <div className="py-20 text-center text-gray-500 flex flex-col items-center">
                            <Activity size={48} className="text-gray-300 mb-4" />
                            <p className="text-lg font-medium">No interaction logs found</p>
                            <p className="text-sm">Students haven't interacted with hackathons yet.</p>
                        </div>
                    ) : (
                        <table className="w-full text-sm text-left text-gray-600">
                            <thead className="text-xs text-brand-900 uppercase bg-brand-50/50">
                                <tr>
                                    <th className="px-6 py-4 font-bold">Student</th>
                                    <th className="px-6 py-4 font-bold">Hackathon Intention</th>
                                    <th className="px-6 py-4 font-bold">Action</th>
                                    <th className="px-6 py-4 font-bold">Timestamp</th>
                                </tr>
                            </thead>
                            <tbody>
                                {activities.map((log) => (
                                    <tr key={log.id} className="bg-white border-b hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-900">{log.studentName}</div>
                                            <div className="text-xs text-gray-500">{log.enrollmentNo} • {log.department}</div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-800">
                                            {log.hackathonTitle}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 px-2.5 py-1 rounded-full text-xs font-bold border border-green-200">
                                                <LinkIcon size={12} /> Clicked & Redirected
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-gray-900 font-medium">
                                                {format(new Date(log.createdAt), 'dd MMM yyyy')}
                                            </div>
                                            <div className="text-xs text-gray-500 font-medium">
                                                {format(new Date(log.createdAt), 'hh:mm:ss a')}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HackathonMonitoringPage;
