import React, { useState, useEffect } from 'react';
import { hackathonAPI } from '../../services/api';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { Search, Loader2, Activity, CheckCircle, Download, RefreshCw, Trash2, Plus, Trophy } from 'lucide-react';
import '../../styles/HackathonMonitoringPage.css';

const HackathonMonitoringPage = () => {
    const [activeTab, setActiveTab] = useState('logs');
    const [activities, setActivities] = useState([]);
    const [liveChallenges, setLiveChallenges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [newHack, setNewHack] = useState({
        title: '', type: 'Web Development', link: '', prize: '',
        deadline_date: '', badge: '', students_count: '0'
    });

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (activeTab === 'logs') fetchActivities();
            else fetchLiveChallenges();
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [searchTerm, activeTab]);

    const fetchActivities = async () => {
        try {
            setLoading(true);
            const res = await hackathonAPI.getApplied({ search: searchTerm });
            if (res.data.success) {
                setActivities(res.data.data);
            }
        } catch (error) {
            toast.error('Failed to load activity logs');
        } finally {
            setLoading(false);
        }
    };

    const fetchLiveChallenges = async () => {
        try {
            setLoading(true);
            const res = await hackathonAPI.getAll({ search: searchTerm });
            if (res.data.success) {
                setLiveChallenges(res.data.data);
            }
        } catch (error) {
            toast.error('Failed to load active challenges');
        } finally {
            setLoading(false);
        }
    };

    const handleAddHackathon = async (e) => {
        e.preventDefault();
        try {
            const res = await hackathonAPI.create(newHack);
            if (res.data.success) {
                toast.success('Hackathon published to live registry');
                setShowAddModal(false);
                setNewHack({ title: '', type: 'Web Development', link: '', prize: '', deadline_date: '', badge: '', students_count: '0' });
                fetchLiveChallenges();
            }
        } catch (error) {
            toast.error('Publication protocol failed');
        }
    };

    const handleDeleteHackathon = async (id) => {
        if (!window.confirm('PROTOCOL: Delete this challenge from live registry?')) return;
        try {
            await hackathonAPI.delete(id);
            toast.success('Challenge removed');
            fetchLiveChallenges();
        } catch (error) {
            toast.error('Deletion protocol failed');
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
                log.student_name,
                log.enrollment_no,
                log.department,
                log.hackathon_title,
                'Applied Successfully',
                format(new Date(log.created_at), 'dd MMM yyyy'),
                format(new Date(log.created_at), 'hh:mm:ss a'),
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
        if (!window.confirm('SECURITY ALERT: Delete this scholarship application log?')) return;
        try {
            await hackathonAPI.deleteActivity(id);
            toast.success('Activity log purged');
            fetchActivities();
        } catch (error) {
            toast.error('Purge protocol failed');
        }
    };

    const getLocalTime = (utcStr) => {
        if (!utcStr) return new Date();
        const dateStr = utcStr.includes('Z') || utcStr.includes('+') ? utcStr : `${utcStr.replace(' ', 'T')}Z`;
        return new Date(dateStr);
    };

    return (
        <div className="hm-page">
            <header className="hm-header">
                <div className="hm-header-text">
                    <h1>
                        <Activity size={22} />
                        Hackathon Control Hub
                    </h1>
                    <p>Manage live competitions and monitor student application throughput.</p>
                </div>

                <div className="hm-header-actions">
                    <div className="hm-tabs" style={{ display: 'flex', gap: '0.5rem', background: 'var(--slate-100)', padding: '0.3rem', borderRadius: '10px' }}>
                        <button
                            className={`btn btn-sm ${activeTab === 'logs' ? 'btn-primary' : 'btn-ghost'}`}
                            onClick={() => setActiveTab('logs')}
                            style={{ borderRadius: '8px' }}
                        >
                            Registry Logs
                        </button>
                        <button
                            className={`btn btn-sm ${activeTab === 'active' ? 'btn-primary' : 'btn-ghost'}`}
                            onClick={() => setActiveTab('active')}
                            style={{ borderRadius: '8px' }}
                        >
                            Active Challenges
                        </button>
                    </div>
                    {activeTab === 'logs' ? (
                        <button className="btn btn-primary" onClick={handleExport} style={{ fontWeight: 700 }}>
                            <Download size={16} /> Export CSV
                        </button>
                    ) : (
                        <button className="btn btn-primary" onClick={() => setShowAddModal(true)} style={{ fontWeight: 700 }}>
                            <Plus size={16} /> Add Challenge
                        </button>
                    )}
                </div>
            </header>

            <div className="hm-card">
                <div className="hm-toolbar">
                    <div className="hm-search-wrap">
                        <Search className="hm-search-icon" size={16} />
                        <input
                            type="text"
                            placeholder={activeTab === 'logs' ? "Filter registry..." : "Search challenges..."}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="hm-table-wrap">
                    {loading ? (
                        <div className="hm-state-center"><Loader2 className="hm-spin" size={36} /><p>Retrieving data...</p></div>
                    ) : activeTab === 'logs' ? (
                        activities.length === 0 ? (
                            <div className="hm-state-center"><Activity size={52} /><h3>No logs found</h3></div>
                        ) : (
                            <table className="hm-table">
                                <thead>
                                    <tr>
                                        <th>Student Details</th>
                                        <th>Hackathon</th>
                                        <th>Resolution</th>
                                        <th>Timestamp</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {activities.map((log, idx) => (
                                        <tr key={log.id}>
                                            <td>
                                                <div className="hm-student-name">{log.student_name}</div>
                                                <div className="hm-student-meta">{log.enrollment_no} • {log.department}</div>
                                            </td>
                                            <td><div className="hm-hackathon-title">{log.hackathon_title}</div></td>
                                            <td>
                                                <span className="hm-action-badge success">
                                                    <CheckCircle size={12} /> Applied
                                                </span>
                                            </td>
                                            <td>
                                                <div className="hm-date">{format(getLocalTime(log.created_at), 'dd MMM yyyy')}</div>
                                                <div className="hm-time">{format(getLocalTime(log.created_at), 'hh:mm a')}</div>
                                            </td>
                                            <td>
                                                <button className="btn btn-ghost btn-xs" onClick={() => handleLogDelete(log.id)} style={{ color: 'var(--error-600)' }}>
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )
                    ) : (
                        liveChallenges.length === 0 ? (
                            <div className="hm-state-center"><Trophy size={52} /><h3>No active challenges published</h3></div>
                        ) : (
                            <table className="hm-table">
                                <thead>
                                    <tr>
                                        <th>Challenge Title</th>
                                        <th>Category</th>
                                        <th>Deadline</th>
                                        <th>Prize Pool</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {liveChallenges.map((h) => (
                                        <tr key={h.id}>
                                            <td>
                                                <div className="hm-hackathon-title">{h.title}</div>
                                                <a href={h.link} target="_blank" rel="noreferrer" style={{ fontSize: '0.7rem', color: 'var(--brand-600)' }}>{h.link}</a>
                                            </td>
                                            <td><span className="badge badge-primary">{h.type}</span></td>
                                            <td>{h.deadline_date || 'N/A'}</td>
                                            <td>{h.prize || 'N/A'}</td>
                                            <td>
                                                <button className="btn btn-ghost btn-xs" onClick={() => handleDeleteHackathon(h.id)} style={{ color: 'var(--error-600)' }}>
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )
                    )}
                </div>
            </div>

            {/* Add Modal */}
            {showAddModal && (
                <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h2>Publish New Challenge</h2>

                        <form onSubmit={handleAddHackathon} className="modal-form">
                            <div className="form-group">
                                <label className="form-label">Challenge Title</label>
                                <input
                                    className="form-input"
                                    required
                                    value={newHack.title}
                                    onChange={e => setNewHack({ ...newHack, title: e.target.value })}
                                    placeholder="e.g. Smart India Hackathon 2026"
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Category</label>
                                    <select
                                        className="form-input"
                                        value={newHack.type}
                                        onChange={e => setNewHack({ ...newHack, type: e.target.value })}
                                    >
                                        <option>Web Development</option>
                                        <option>AI / ML</option>
                                        <option>Cybersecurity</option>
                                        <option>Mobile App Dev</option>
                                        <option>Web3 & Blockchain</option>
                                        <option>Govt of India</option>
                                        <option>Social Impact</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Badge / Tag</label>
                                    <input
                                        className="form-input"
                                        value={newHack.badge}
                                        onChange={e => setNewHack({ ...newHack, badge: e.target.value })}
                                        placeholder="e.g. Innovation"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Prize Pool Description</label>
                                <input
                                    className="form-input"
                                    value={newHack.prize}
                                    onChange={e => setNewHack({ ...newHack, prize: e.target.value })}
                                    placeholder="e.g. ₹1,00,000"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Registration Link (URL)</label>
                                <input
                                    className="form-input"
                                    type="url"
                                    required
                                    value={newHack.link}
                                    onChange={e => setNewHack({ ...newHack, link: e.target.value })}
                                    placeholder="https://official-portal.com"
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Deadline / Month</label>
                                    <input
                                        className="form-input"
                                        value={newHack.deadline_date}
                                        onChange={e => setNewHack({ ...newHack, deadline_date: e.target.value })}
                                        placeholder="Aug 2026"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Est. Participants</label>
                                    <input
                                        className="form-input"
                                        value={newHack.students_count}
                                        onChange={e => setNewHack({ ...newHack, students_count: e.target.value })}
                                        placeholder="10k+"
                                    />
                                </div>
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn btn-ghost" onClick={() => setShowAddModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>
                                    Publish Challenge
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HackathonMonitoringPage;
