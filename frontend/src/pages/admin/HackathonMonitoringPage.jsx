import React, { useState, useEffect } from 'react';
import { hackathonAPI } from '../../services/api';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { Search, Loader2, Activity, CheckCircle, Download, RefreshCw, Trash2 } from 'lucide-react';
import '../../styles/HackathonMonitoringPage.css';

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

    const handleExport = () => {
        if (activities.length === 0) {
            toast.error('No data to export');
            return;
        }
        const csv = [
            ['Student', 'Enrollment', 'Department', 'Hackathon', 'Action', 'Date', 'Time'],
            ...activities.map(log => [
                log.studentName,
                log.enrollmentNo,
                log.department,
                log.hackathonTitle,
                'Applied Successfully',
                format(new Date(log.createdAt), 'dd MMM yyyy'),
                format(new Date(log.createdAt), 'hh:mm:ss a'),
            ])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Hackathon_Logs_${Date.now()}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Logs exported successfully!');
    };

    const handleLogDelete = async (id) => {
        if (!window.confirm('PROTOCOL: Are you sure you wish to permanently purge this activity log?')) return;
        try {
            await hackathonAPI.deleteActivity(id);
            toast.success('Log entry purged from registry');
            fetchActivities();
        } catch (error) {
            toast.error('Deletion protocol failed');
        }
    };

    const getLocalTime = (utcStr) => {
        if (!utcStr) return new Date();
        // If it doesn't have a timezone, assume it's UTC from SQLite
        const dateStr = utcStr.includes('Z') || utcStr.includes('+') ? utcStr : `${utcStr.replace(' ', 'T')}Z`;
        return new Date(dateStr);
    };

    return (
        <div className="hm-page">

            {/* ── Header ─────────────────────────────────────── */}
            <header className="hm-header">
                <div className="hm-header-text">
                    <h1>
                        <Activity size={22} />
                        Hackathon Application Registry
                    </h1>
                    <p>Official record of students who have applied for external competitions.</p>
                </div>

                <div className="hm-header-actions">
                    <button className="btn btn-ghost" onClick={fetchActivities}
                        style={{ border: '1px solid var(--border-primary)', fontWeight: 700 }}>
                        <RefreshCw size={16} /> Sync
                    </button>
                    <button className="btn btn-primary" onClick={handleExport}
                        style={{ fontWeight: 700 }}>
                        <Download size={16} /> Export Logs
                    </button>
                </div>
            </header>

            {/* ── Table Card ─────────────────────────────────── */}
            <div className="hm-card">

                {/* Toolbar */}
                <div className="hm-toolbar">
                    <div className="hm-search-wrap">
                        <Search className="hm-search-icon" size={16} />
                        <input
                            type="text"
                            placeholder="Search by student name, enrollment, or hackathon..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                        {activities.length} record{activities.length !== 1 ? 's' : ''}
                    </span>
                </div>

                {/* Table / States */}
                <div className="hm-table-wrap">
                    {loading ? (
                        <div className="hm-state-center">
                            <Loader2 className="hm-spin" size={36} />
                            <p>Loading activity logs…</p>
                        </div>
                    ) : activities.length === 0 ? (
                        <div className="hm-state-center">
                            <Activity size={52} />
                            <h3>No interaction logs found</h3>
                            <p>Students haven't interacted with hackathons yet.</p>
                        </div>
                    ) : (
                        <table className="hm-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Student</th>
                                    <th>Hackathon</th>
                                    <th>Action</th>
                                    <th>Timestamp</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {activities.map((log, idx) => (
                                    <tr key={log.id || idx}>
                                        <td style={{ color: 'var(--text-muted)', fontWeight: 600, width: '3rem' }}>
                                            {idx + 1}
                                        </td>
                                        <td>
                                            <div className="hm-student-name">{log.studentName}</div>
                                            <div className="hm-student-meta">
                                                {log.enrollmentNo}
                                                {log.department ? ` • ${log.department}` : ''}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="hm-hackathon-title">{log.hackathonTitle}</div>
                                        </td>
                                        <td>
                                            <span className="hm-action-badge" style={{ background: 'var(--success-50)', color: 'var(--success-700)', borderColor: 'var(--success-200)' }}>
                                                <CheckCircle size={12} /> Applied Successfully
                                            </span>
                                        </td>
                                        <td>
                                            <div className="hm-date">
                                                {format(getLocalTime(log.createdAt), 'dd MMM yyyy')}
                                            </div>
                                            <div className="hm-time">
                                                {format(getLocalTime(log.createdAt), 'hh:mm:ss a')}
                                            </div>
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-ghost btn-sm"
                                                onClick={() => handleLogDelete(log.id)}
                                                style={{ color: 'var(--error-600)', padding: '0.4rem' }}
                                                title="Purge Record"
                                            >
                                                <Trash2 size={16} />
                                            </button>
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
