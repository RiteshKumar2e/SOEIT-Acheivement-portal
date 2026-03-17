import '../../styles/ContactPage.css';
import { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const ContactPage = () => {
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        await new Promise(r => setTimeout(r, 1500));
        setSubmitted(true);
        setLoading(false);
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
            <div style={{ position: 'fixed', top: '1.5rem', left: '1.5rem', zIndex: 100 }}>
                <Link to="/" className="btn btn-secondary" style={{ fontWeight: 700, borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', backdropFilter: 'blur(10px)', border: '1px solid var(--border-primary)', padding: '0.6rem 1.25rem' }}>
                    <ArrowLeft size={16} /> Back to Home
                </Link>
            </div>
            <section style={{ paddingTop: '100px', paddingBottom: '5rem' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <h1>Get in <span className="text-gradient">Touch</span></h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '500px', margin: '1rem auto 0', lineHeight: 1.8 }}>
                            Have questions about the portal? Reach out to our support team.
                        </p>
                    </div>

                    <div className="contact-grid">
                        {/* Contact Info */}
                        <div>
                            <h3 style={{ marginBottom: '1.5rem' }}>Contact Information</h3>
                            {[
                                { icon: Mail, label: 'Email', value: 'soeit@arkajainuniversity.ac.in', color: '#3b82f6' },
                                { icon: Phone, label: 'Phone', value: '1800-1200-200', color: '#8b5cf6' },
                                { icon: MapPin, label: 'Address', value: 'Arka Jain University, Gamharia, Jamshedpur, Jharkhand 832108', color: '#10b981' },
                            ].map(({ icon: Icon, label, value, color }) => (
                                <div key={label} className="card card-body" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                                    <div style={{ width: 44, height: 44, background: color + '20', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <Icon size={20} color={color} />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, marginBottom: '0.25rem' }}>{label}</div>
                                        <div style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>{value}</div>
                                    </div>
                                </div>
                            ))}

                            <div className="card card-body" style={{ marginTop: '1.5rem', background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(99,102,241,0.08))' }}>
                                <h4 style={{ marginBottom: '0.5rem' }}>Support Hours</h4>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7 }}>Monday – Friday: 9:00 AM – 5:00 PM<br />Saturday: 10:00 AM – 2:00 PM<br />Sunday: Closed</p>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="card card-body">
                            {submitted ? (
                                <div style={{ textAlign: 'center', padding: '2rem' }}>
                                    <div style={{ width: 64, height: 64, background: 'rgba(34,197,94,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                                        <CheckCircle size={32} color="var(--success-500)" />
                                    </div>
                                    <h3 style={{ marginBottom: '0.75rem', color: 'var(--success-500)' }}>Message Sent!</h3>
                                    <p style={{ color: 'var(--text-secondary)' }}>Thank you for reaching out. We'll get back to you within 24 hours.</p>
                                    <button className="btn btn-primary" style={{ marginTop: '1.5rem' }} onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}>
                                        Send Another
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit}>
                                    <h3 style={{ marginBottom: '1.5rem' }}>Send a Message</h3>
                                    <div className="contact-form-row">
                                        <div className="form-group">
                                            <label className="form-label required">Your Name</label>
                                            <input className="form-control" placeholder="John Doe" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label required">Email Address</label>
                                            <input type="email" className="form-control" placeholder="john@example.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label required">Subject</label>
                                        <input className="form-control" placeholder="How can we help?" value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} required />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label required">Message</label>
                                        <textarea className="form-control" rows={5} placeholder="Describe your query in detail..." value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} required />
                                    </div>
                                    <button type="submit" className="btn btn-primary w-full" disabled={loading} style={{ marginTop: '0.5rem' }}>
                                        {loading ? <><div className="spinner spinner-sm" style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff' }} /> Sending...</> : <><Send size={16} /> Send Message</>}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ContactPage;
