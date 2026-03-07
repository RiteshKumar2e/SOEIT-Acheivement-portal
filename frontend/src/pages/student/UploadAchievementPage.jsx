import '../../styles/UploadAchievementPage.css';
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { achievementAPI } from '../../services/api';
import { Upload, X, File, Image, AlertCircle, CheckCircle, Award } from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIES = ['Academic', 'Sports', 'Cultural', 'Technical', 'Research', 'Internship', 'Certification', 'Competition', 'Community Service', 'Other'];
const LEVELS = ['International', 'National', 'State', 'University', 'College', 'Department'];
const POINTS_MAP = { International: 100, National: 75, State: 50, University: 30, College: 20, Department: 10 };

const UploadAchievementPage = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ title: '', category: '', description: '', level: '', date: '', institution: '', tags: '', isPublic: true });
    const [files, setFiles] = useState([]);
    const [dragging, setDragging] = useState(false);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [errors, setErrors] = useState({});

    const validate = () => {
        const e = {};
        if (!form.title.trim()) e.title = 'Institutional title is mandatory';
        if (!form.category) e.category = 'Classification required';
        if (!form.description.trim()) e.description = 'Description required';
        if (!form.level) e.level = 'Impact resolution required';
        if (!form.date) e.date = 'Registry date required';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleFileDrop = useCallback((e) => {
        e.preventDefault();
        setDragging(false);
        const dropped = Array.from(e.dataTransfer?.files || e.target.files || []);
        const valid = dropped.filter(f => f.size <= 10 * 1024 * 1024);
        const invalid = dropped.filter(f => f.size > 10 * 1024 * 1024);
        if (invalid.length) toast.error(`Security protocol: ${invalid.length} file(s) exceed 10MB limit`);
        setFiles(prev => [...prev, ...valid].slice(0, 5));
    }, []);

    const removeFile = (i) => setFiles(prev => prev.filter((_, idx) => idx !== i));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        setProgress(0);

        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => fd.append(k, v));
        files.forEach(f => fd.append('proofFiles', f));

        const interval = setInterval(() => setProgress(prev => Math.min(prev + 10, 95)), 400);

        try {
            await achievementAPI.create(fd);
            clearInterval(interval);
            setProgress(100);
            toast.success('Credential synchronized: Pending faculty verification');
            setTimeout(() => navigate('/achievements'), 800);
        } catch (err) {
            clearInterval(interval);
            setProgress(0);
            toast.error(err.response?.data?.message || 'Synchronization protocol failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto' }}>
            {/* Submission Suite Header */}
            <div className="page-header upload-header-suite" style={{ marginBottom: '3rem', textAlign: 'center' }}>
                <h2 className="heading-display">Institutional Credential Submission</h2>
                <p className="page-subtitle upload-subtitle" style={{ maxWidth: '600px', margin: '0.5rem auto 0 auto' }}>Document official milestones, certifications, and academic excellence within the institutional registry.</p>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="upload-grid-layout" style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '2rem' }}>
                    {/* Primary Documentation */}
                    <div className="documentation-section-res" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div className="card upload-form-card" style={{ padding: '2.5rem' }}>
                            <div className="card-header" style={{ marginBottom: '2rem', padding: 0 }}>
                                <h4 style={{ margin: 0, fontWeight: 800, fontSize: '1.25rem' }}>Achievement Description</h4>
                                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Specify the primary details of the institutional achievement.</p>
                            </div>

                            <div className="form-group">
                                <label className="form-label" style={{ fontWeight: 800 }}>Formal Nomenclature <span style={{ color: 'var(--error-500)' }}>*</span></label>
                                <input
                                    className={`form-control ${errors.title ? 'error' : ''}`}
                                    placeholder="e.g. Winner of Smart India Hackathon 2024"
                                    value={form.title}
                                    style={{ height: '52px' }}
                                    onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                                />
                                {errors.title && <div className="input-error" style={{ fontWeight: 700, fontSize: '0.75rem' }}><AlertCircle size={14} />{errors.title}</div>}
                            </div>

                            <div className="form-fields-grid-res" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div className="form-group">
                                    <label className="form-label" style={{ fontWeight: 800 }}>Classification <span style={{ color: 'var(--error-500)' }}>*</span></label>
                                    <select
                                        className={`form-control ${errors.category ? 'error' : ''}`}
                                        value={form.category}
                                        style={{ height: '52px' }}
                                        onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                                    >
                                        <option value="">Select Domain</option>
                                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label className="form-label" style={{ fontWeight: 800 }}>Impact Resolution <span style={{ color: 'var(--error-500)' }}>*</span></label>
                                    <select
                                        className={`form-control ${errors.level ? 'error' : ''}`}
                                        value={form.level}
                                        style={{ height: '52px' }}
                                        onChange={e => setForm(p => ({ ...p, level: e.target.value }))}
                                    >
                                        <option value="">Select Level</option>
                                        {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="form-fields-grid-res" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div className="form-group">
                                    <label className="form-label" style={{ fontWeight: 800 }}>Registry Date <span style={{ color: 'var(--error-500)' }}>*</span></label>
                                    <input
                                        type="date"
                                        className={`form-control ${errors.date ? 'error' : ''}`}
                                        style={{ height: '52px' }}
                                        value={form.date}
                                        onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                                        max={new Date().toISOString().split('T')[0]}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label" style={{ fontWeight: 800 }}>Organizing Body</label>
                                    <input
                                        className="form-control"
                                        style={{ height: '52px' }}
                                        placeholder="e.g. Microsoft, Google, IIT"
                                        value={form.institution}
                                        onChange={e => setForm(p => ({ ...p, institution: e.target.value }))}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label" style={{ fontWeight: 800 }}>Description <span style={{ color: 'var(--error-500)' }}>*</span></label>
                                <textarea
                                    className={`form-control ${errors.description ? 'error' : ''}`}
                                    rows={6}
                                    placeholder="Document your responsibilities, key milestones, and verified outcomes..."
                                    value={form.description}
                                    onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                                    style={{ resize: 'none' }}
                                />
                                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>{form.description.length} / 2000 RESOLUTION</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Evidence & Merit Summary */}
                    <div className="evidence-sidebar-res" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {/* Impact Level Merit Indicator */}
                        {form.level && (
                            <div className="card animate-slide-up" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, var(--brand-700), var(--brand-900))', color: 'white', border: 'none' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ width: 44, height: 44, background: 'rgba(255,255,255,0.15)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Award size={24} />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.75rem', fontWeight: 700, opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Merit Evaluation</div>
                                        <div style={{ fontSize: '1.1rem', fontWeight: 900 }}>{form.level} Resolution</div>
                                    </div>
                                    <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                                        <div style={{ fontSize: '1.5rem', fontWeight: 900 }}>{POINTS_MAP[form.level]}</div>
                                        <div style={{ fontSize: '0.65rem', fontWeight: 800, opacity: 0.7 }}>PTS</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="card" style={{ padding: '2rem' }}>
                            <div className="card-header" style={{ marginBottom: '1.5rem', padding: 0 }}>
                                <h4 style={{ margin: 0, fontWeight: 800, fontSize: '1.1rem' }}>Verification Evidence</h4>
                                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Sync official certificates and dossiers.</p>
                            </div>

                            <div
                                className={`file-upload-zone ${dragging ? 'drag-over' : ''}`}
                                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                                onDragLeave={() => setDragging(false)}
                                onDrop={handleFileDrop}
                                onClick={() => document.getElementById('fileInput').click()}
                                style={{ padding: '2.5rem 1.5rem', background: 'var(--slate-50)', border: '2px dashed var(--slate-200)', borderRadius: '16px', transition: 'all 0.2s ease', cursor: 'pointer' }}
                            >
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', textAlign: 'center' }}>
                                    <div style={{ width: 48, height: 48, background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)' }}>
                                        <Upload size={20} color="var(--brand-600)" />
                                    </div>
                                    <div>
                                        <p style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-primary)', margin: 0 }}>Dossier Sync Engine</p>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem', fontWeight: 600 }}>PDF, PNG, JPG (Max 10MB)</p>
                                    </div>
                                </div>
                                <input id="fileInput" type="file" multiple accept=".jpg,.jpeg,.png,.pdf,.doc,.docx" style={{ display: 'none' }} onChange={handleFileDrop} />
                            </div>

                            {files.length > 0 && (
                                <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {files.map((f, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'white', border: '1px solid var(--border-primary)', borderRadius: '12px' }}>
                                            <div style={{ width: 36, height: 36, background: 'var(--primary-50)', color: 'var(--brand-600)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                {f.type.startsWith('image') ? <Image size={18} /> : <File size={18} />}
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</div>
                                                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>{(f.size / 1024).toFixed(1)} KB RESOLUTION</div>
                                            </div>
                                            <button type="button" onClick={() => removeFile(i)} style={{ color: 'var(--error-500)', padding: '0.5rem', borderRadius: '50%', background: 'none', border: 'none', cursor: 'pointer' }}>
                                                <X size={18} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-primary)' }}>
                                <label className="flex items-center gap-3" style={{ cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        checked={form.isPublic}
                                        onChange={e => setForm(p => ({ ...p, isPublic: e.target.checked }))}
                                        style={{ width: 20, height: 20, accentColor: 'var(--brand-600)' }}
                                    />
                                    <div>
                                        <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>Publish to Global Portfolio</span>
                                        <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>External visibility for recruiters and external bodies.</p>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Submission Controls */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {loading && (
                                <div className="card" style={{ padding: '1.25rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 800, marginBottom: '0.75rem' }}>
                                        <span>SYNCHRONIZING RECORDS...</span>
                                        <span>{progress}%</span>
                                    </div>
                                    <div style={{ height: 6, background: 'var(--slate-100)', borderRadius: '3px', overflow: 'hidden' }}>
                                        <div style={{ width: `${progress}%`, height: '100%', background: 'var(--brand-600)', transition: 'width 0.4s ease' }}></div>
                                    </div>
                                </div>
                            )}
                            <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '56px', fontWeight: 900, fontSize: '1.1rem' }} disabled={loading}>
                                {loading ? 'Processing Protocol...' : 'Submit Institutional Record'}
                            </button>
                            <button type="button" className="btn btn-ghost" style={{ width: '100%', height: '48px', fontWeight: 800, border: '1px solid var(--border-primary)' }} onClick={() => navigate('/achievements')} disabled={loading}>
                                Discard Submission
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default UploadAchievementPage;
