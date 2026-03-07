import '../../styles/EventsPage.css';
import { useState, useEffect } from 'react';
import { eventAPI } from '../../services/api';
import { Calendar, MapPin, Link as LinkIcon, Plus, Trash2, User, Filter, Search, Edit, XCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const CATEGORIES = ['All', 'Technical', 'Cultural', 'Sports', 'Workshop', 'Seminar', 'Other'];

const EventsPage = () => {
    const { user } = useAuth();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [showAddModal, setShowAddModal] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Technical',
        date: '',
        venue: '',
        registrationLink: ''
    });
    const [editingId, setEditingId] = useState(null);

    const loadEvents = async () => {
        setLoading(true);
        try {
            const { data } = await eventAPI.getAll({ category: selectedCategory });
            setEvents(data.data);
        } catch (error) {
            toast.error('Failed to synchronize event database');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadEvents();
    }, [selectedCategory]);

    const handleAddEvent = async (e) => {
        e.preventDefault();
        const actionText = editingId ? 'Updating' : 'Publishing';
        const toastId = toast.loading(`${actionText} institutional event...`);
        try {
            if (editingId) {
                await eventAPI.update(editingId, formData);
                toast.success('Event records updated successfully', { id: toastId });
            } else {
                await eventAPI.create(formData);
                toast.success('Institutional event published successfully', { id: toastId });
            }
            setShowAddModal(false);
            setEditingId(null);
            setFormData({ title: '', description: '', category: 'Technical', date: '', venue: '', registrationLink: '' });
            loadEvents();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Event synchronization failed', { id: toastId });
        }
    };

    const handleEditClick = (event) => {
        setEditingId(event._id);
        setFormData({
            title: event.title,
            description: event.description,
            category: event.category,
            date: event.date.split('T')[0],
            venue: event.venue,
            registrationLink: event.registrationLink || ''
        });
        setShowAddModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('PROTOCOL: Are you sure you wish to remove this institutional event from the registry?')) return;
        try {
            await eventAPI.delete(id);
            toast.success('Event records purged from database');
            loadEvents();
        } catch (error) {
            toast.error('Deletion protocol failed');
        }
    };

    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        return {
            month: d.toLocaleString('default', { month: 'short' }).toUpperCase(),
            day: String(d.getDate()).padStart(2, '0'),
            full: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
        };
    };

    const isStaff = user?.role === 'admin' || user?.role === 'faculty';

    return (
        <div className="animate-fade-in">
            {/* Page Header Suite */}
            <div className="page-header" style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h2 className="heading-display">Institutional Event Hub</h2>
                    <p className="page-subtitle">Centralized tracking of academic workshops, technical symposiums, and cultural fests.</p>
                </div>
                {isStaff && (
                    <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
                        <Plus size={18} />
                        <span>Publish New Event</span>
                    </button>
                )}
            </div>

            {/* Categorization Controls */}
            <div className="card" style={{ padding: '1.25rem', marginBottom: '2rem', display: 'flex', gap: '0.75rem', overflowX: 'auto', border: '1px solid var(--border-primary)' }}>
                {/* Desktop Version: Button Group */}
                <div className="category-btn-group desktop-only" style={{ display: 'flex', gap: '0.75rem' }}>
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`btn btn-sm ${selectedCategory === cat ? 'btn-primary' : 'btn-ghost'}`}
                            style={{ padding: '0.6rem 1.5rem', fontSize: '0.85rem', fontWeight: 700, whiteSpace: 'nowrap' }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Mobile Version: Dropdown */}
                <div className="category-select-mobile mobile-only" style={{ width: '100%' }}>
                    <select
                        className="form-control"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        style={{
                            fontWeight: 700,
                            borderRadius: '12px',
                            border: '2px solid var(--border-primary)',
                            padding: '0.8rem',
                            width: '100%',
                            appearance: 'none',
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'right 1rem center',
                            backgroundSize: '1.2em'
                        }}
                    >
                        {CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat} Events</option>
                        ))}
                    </select>
                </div>
            </div>

            {loading ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                    {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: 420, borderRadius: '16px' }} />)}
                </div>
            ) : events.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '5rem 2rem' }}>
                    <div style={{ width: 80, height: 80, background: 'var(--primary-50)', color: 'var(--brand-700)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
                        <Calendar size={40} />
                    </div>
                    <h3 style={{ fontWeight: 800, marginBottom: '0.5rem' }}>No Active Events Found</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '400px', margin: '0 auto' }}>The institutional registry currently contains no records matching this category resolution.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                    {events.map((event) => {
                        const dateInfo = formatDate(event.date);
                        return (
                            <div key={event._id} className="card hover-scale animate-fade-in" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <div style={{ padding: '2rem', flex: 1 }}>
                                    <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                        <div style={{ width: 60, height: 64, background: 'var(--brand-700)', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                                            <span style={{ fontSize: '0.7rem', fontWeight: 800, opacity: 0.8 }}>{dateInfo.month}</span>
                                            <span style={{ fontSize: '1.5rem', fontWeight: 900, lineHeight: 1 }}>{dateInfo.day}</span>
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <span className="badge badge-brand" style={{ fontSize: '0.65rem' }}>{event.category}</span>
                                            <h3 style={{ margin: '0.5rem 0 0', fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.3 }}>{event.title}</h3>
                                        </div>
                                    </div>

                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.75rem', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                        {event.description}
                                    </p>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                                            <div style={{ width: 32, height: 32, background: 'var(--primary-50)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-600)' }}>
                                                <MapPin size={16} />
                                            </div>
                                            {event.venue}
                                        </div>
                                        {event.registrationLink && (
                                            <a href={event.registrationLink} target="_blank" rel="noopener noreferrer"
                                                className="btn btn-ghost btn-sm"
                                                style={{ width: 'fit-content', padding: '0.5rem 0.75rem', marginLeft: '-0.5rem', color: 'var(--brand-700)' }}>
                                                <LinkIcon size={16} />
                                                <span>Registration Link</span>
                                            </a>
                                        )}
                                    </div>
                                </div>

                                <div style={{ padding: '1.25rem 2rem', borderTop: '1px solid var(--border-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--slate-50)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <div className="avatar avatar-xs" style={{ background: 'var(--primary-100)', color: 'var(--brand-700)', fontWeight: 800, fontSize: '0.65rem' }}>
                                            {event.createdBy?.name?.charAt(0)}
                                        </div>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>{event.createdBy?.name}</span>
                                    </div>
                                    {isStaff && (user?.role === 'admin' || event.createdBy?._id === user?._id) && (
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button onClick={() => handleEditClick(event)} className="btn btn-ghost btn-sm" style={{ padding: '0.4rem', color: 'var(--brand-600)' }} title="Modify Registry"><Edit size={16} /></button>
                                            <button onClick={() => handleDelete(event._id)} className="btn btn-ghost btn-sm" style={{ padding: '0.4rem', color: 'var(--error-600)' }} title="Purge Record"><Trash2 size={16} /></button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Event Management Suite Modal */}
            {showAddModal && (
                <div className="modal-overlay animate-fade-in" style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
                    <div className="card animate-slide-up" style={{ width: '100%', maxWidth: '600px', padding: 0, overflow: 'hidden' }}>
                        <div className="card-header" style={{ padding: '1.5rem 2rem', background: 'var(--brand-700)', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>{editingId ? 'Modify Institutional Event' : 'Publish New Activity'}</h3>
                                <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.8 }}>Formal event documentation suite.</p>
                            </div>
                            <button onClick={() => { setShowAddModal(false); setEditingId(null); }} className="btn btn-ghost" style={{ padding: '0.25rem', color: 'white' }}><XCircle size={24} /></button>
                        </div>
                        <div className="card-body" style={{ padding: '2rem' }}>
                            <form onSubmit={handleAddEvent} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div className="form-group">
                                    <label className="form-label" style={{ fontWeight: 800 }}>Event Nomenclature</label>
                                    <input className="form-control" required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="Identify the core subject..." />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" style={{ fontWeight: 800 }}>Category Resolution</label>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                                        {CATEGORIES.slice(1).map(c => (
                                            <button key={c} type="button" onClick={() => setFormData({ ...formData, category: c })}
                                                className={`btn btn-sm ${formData.category === c ? 'btn-primary' : 'btn-ghost'}`}
                                                style={{ border: formData.category !== c ? '1px solid var(--border-primary)' : 'none', fontSize: '0.7rem' }}>
                                                {c}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                    <div className="form-group">
                                        <label className="form-label" style={{ fontWeight: 800 }}>Date Protocol</label>
                                        <input type="date" className="form-control" required value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label" style={{ fontWeight: 800 }}>Venue Location</label>
                                        <input className="form-control" required value={formData.venue} onChange={e => setFormData({ ...formData, venue: e.target.value })} placeholder="e.g. Audit Hall 01" />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label" style={{ fontWeight: 800 }}>External Registration Protocol (Optional)</label>
                                    <input type="url" className="form-control" value={formData.registrationLink} onChange={e => setFormData({ ...formData, registrationLink: e.target.value })} placeholder="https://external-link.com" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" style={{ fontWeight: 800 }}>Description</label>
                                    <textarea className="form-control" required rows="4" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Document the event objectives, agenda, and outcomes..." style={{ resize: 'none' }} />
                                </div>
                                <button type="submit" className="btn btn-primary" style={{ padding: '1.25rem', fontWeight: 900 }}>
                                    {editingId ? 'Modify Event Registry' : 'Publish Activity & Email Notification'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventsPage;
