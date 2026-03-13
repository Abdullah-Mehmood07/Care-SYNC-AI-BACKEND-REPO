import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserInfo, logoutUser } from '../utils/auth';

const PatientDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const navigate = useNavigate();
    const userInfo = getUserInfo();
    const hospital = localStorage.getItem('caresync_hospital') || 'Shifa International Hospital';

    // Simple auth check
    useEffect(() => {
        if (!localStorage.getItem('caresync_user_token')) {
            navigate('/patient-login');
        }
    }, [navigate]);

    const handleLogout = () => {
        logoutUser();
        navigate('/');
    };

    const handleBooking = (e) => {
        e.preventDefault();
        alert('Appointment Request Sent! You can view it in your dashboard.');
        setActiveTab('dashboard');
    };

    return (
        <div style={{ paddingBottom: '4rem' }}>
            <div style={{ background: 'var(--white)', padding: '1rem', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="hospital-name-display" style={{ fontWeight: 600, color: 'var(--primary-teal)' }}>{hospital}</span>
                <div style={{ fontSize: '0.9rem' }}>
                    <i className="fas fa-user"></i> {userInfo.name} ({userInfo.id})
                    <button onClick={handleLogout} className="btn btn-outline" style={{ marginLeft: '1rem', padding: '0.3rem 0.8rem' }}>Logout</button>
                </div>
            </div>

            <div className="dashboard-container" style={{ display: 'flex', minHeight: 'calc(100vh - 140px)' }}>
                {/* Sidebar */}
                <aside className="sidebar" style={{ width: '250px', background: 'var(--white)', borderRight: '1px solid #CCFBF1', padding: '2rem 0', display: 'flex', flexDirection: 'column' }}>
                    <div className={`sidebar-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')} style={{ padding: '1rem 2rem', cursor: 'pointer', transition: 'all 0.3s', fontWeight: 500 }}>
                        <i className="fas fa-th-large" style={{ marginRight: '10px' }}></i> Dashboard
                    </div>
                    <div className={`sidebar-item ${activeTab === 'booking' ? 'active' : ''}`} onClick={() => setActiveTab('booking')} style={{ padding: '1rem 2rem', cursor: 'pointer', transition: 'all 0.3s', fontWeight: 500 }}>
                        <i className="fas fa-calendar-plus" style={{ marginRight: '10px' }}></i> Book Appointment
                    </div>
                    <div className={`sidebar-item ${activeTab === 'schedule' ? 'active' : ''}`} onClick={() => setActiveTab('schedule')} style={{ padding: '1rem 2rem', cursor: 'pointer', transition: 'all 0.3s', fontWeight: 500 }}>
                        <i className="fas fa-user-md" style={{ marginRight: '10px' }}></i> Doctor Schedule
                    </div>
                    <div className={`sidebar-item ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')} style={{ padding: '1rem 2rem', cursor: 'pointer', transition: 'all 0.3s', fontWeight: 500 }}>
                        <i className="fas fa-history" style={{ marginRight: '10px' }}></i> Medical History
                    </div>
                    <div className={`sidebar-item ${activeTab === 'reports' ? 'active' : ''}`} onClick={() => setActiveTab('reports')} style={{ padding: '1rem 2rem', cursor: 'pointer', transition: 'all 0.3s', fontWeight: 500 }}>
                        <i className="fas fa-file-medical" style={{ marginRight: '10px' }}></i> Lab Reports
                    </div>
                    <div className={`sidebar-item ${activeTab === 'emergency' ? 'active' : ''}`} onClick={() => setActiveTab('emergency')} style={{ padding: '1rem 2rem', cursor: 'pointer', transition: 'all 0.3s', fontWeight: 500 }}>
                        <i className="fas fa-ambulance" style={{ marginRight: '10px' }}></i> Emergency
                    </div>
                </aside>

                {/* Main Content */}
                <main className="main-panel" style={{ flex: 1, padding: '2rem' }}>
                    {activeTab === 'dashboard' && (
                        <section className="panel-section active">
                            <h2>Overview</h2>
                            <div className="services-grid" style={{ margin: '2rem 0', gridTemplateColumns: 'repeat(3, 1fr)' }}>
                                <div className="stat-card" style={{ background: 'white', padding: '1.5rem', borderRadius: 'var(--radius-md)', boxShadow: '0 4px 6px -1px var(--shadow-light)', textAlign: 'center' }}>
                                    <div className="stat-value" style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary-teal)' }}>02</div>
                                    <p>Upcoming Appointments</p>
                                </div>
                                <div className="stat-card" style={{ background: 'white', padding: '1.5rem', borderRadius: 'var(--radius-md)', boxShadow: '0 4px 6px -1px var(--shadow-light)', textAlign: 'center' }}>
                                    <div className="stat-value" style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary-teal)' }}>05</div>
                                    <p>Lab Reports Ready</p>
                                </div>
                                <div className="stat-card" style={{ background: 'white', padding: '1.5rem', borderRadius: 'var(--radius-md)', boxShadow: '0 4px 6px -1px var(--shadow-light)', textAlign: 'center' }}>
                                    <div className="stat-value text-muted" style={{ fontSize: '2rem', fontWeight: 700 }}>--</div>
                                    <p>Queue Position</p>
                                </div>
                            </div>

                            <h3>Upcoming Appointments</h3>
                            <div className="glass-card" style={{ padding: '1rem', marginTop: '1rem' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ textAlign: 'left', borderBottom: '1px solid #eee' }}>
                                            <th style={{ padding: '10px' }}>Doctor</th>
                                            <th>Specialty</th>
                                            <th>Date & Time</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td style={{ padding: '10px' }}>Dr. Fatima Bibi</td>
                                            <td>Cardiology</td>
                                            <td>Dec 25, 10:00 AM</td>
                                            <td><span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 600, background: '#DCFCE7', color: '#166534' }}>Confirmed</span></td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '10px' }}>Dr. Omar Farooq</td>
                                            <td>General Physician</td>
                                            <td>Dec 28, 02:00 PM</td>
                                            <td><span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 600, background: '#FEF2F2', color: '#991B1B' }}>Pending</span></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    )}

                    {activeTab === 'booking' && (
                        <section className="panel-section active">
                            <h2>Book Appointment</h2>
                            <div className="glass-card" style={{ maxWidth: '600px' }}>
                                <form onSubmit={handleBooking}>
                                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                                        <label>Select Department</label>
                                        <select required style={{ marginBottom: '1rem' }}>
                                            <option>General Medicine</option>
                                            <option>Cardiology</option>
                                            <option>Dermatology</option>
                                            <option>Pediatrics</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Select Doctor</label>
                                        <select required style={{ marginBottom: '1rem' }}>
                                            <option>Dr. Omar Farooq</option>
                                            <option>Dr. Fatima Bibi</option>
                                            <option>Dr. Usman Gondal</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Date</label>
                                        <input type="date" required style={{ marginBottom: '1rem' }} />
                                    </div>
                                    <div className="form-group">
                                        <label>Time Slot</label>
                                        <select required style={{ marginBottom: '1rem' }}>
                                            <option>10:00 AM - 10:30 AM</option>
                                            <option>10:30 AM - 11:00 AM</option>
                                            <option>11:00 AM - 11:30 AM</option>
                                        </select>
                                    </div>
                                    <button type="submit" className="btn btn-primary">Confirm Booking</button>
                                </form>
                            </div>
                        </section>
                    )}

                    {activeTab === 'schedule' && (
                        <section className="panel-section active">
                            <h2>Real-Time Doctor Availability</h2>
                            <div style={{ marginTop: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'white', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid #E2E8F0', marginBottom: '1rem' }}>
                                    <div style={{ width: '50px', height: '50px', background: '#eee', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <i className="fas fa-user-md"></i>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h4>Dr. Fatima Bibi</h4>
                                        <p className="text-muted">Cardiologist - Room 302</p>
                                    </div>
                                    <span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 600, background: '#DCFCE7', color: '#166534' }}>On Duty</span>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'white', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid #E2E8F0', marginBottom: '1rem' }}>
                                    <div style={{ width: '50px', height: '50px', background: '#eee', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <i className="fas fa-user-md"></i>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h4>Dr. Usman Gondal</h4>
                                        <p className="text-muted">Neurologist - Room 205</p>
                                    </div>
                                    <span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 600, background: '#FEF2F2', color: '#991B1B' }}>In Surgery</span>
                                </div>
                            </div>
                        </section>
                    )}

                    {activeTab === 'history' && (
                        <section className="panel-section active">
                            <h2>Medical History</h2>
                            <div className="glass-card">
                                <p>No previous history records found in this hospital.</p>
                            </div>
                            <h3 style={{ marginTop: '2rem' }}>Prescription Reader (AI)</h3>
                            <div className="glass-card" style={{ marginTop: '1rem', textAlign: 'center', borderStyle: 'dashed' }}>
                                <i className="fas fa-upload" style={{ fontSize: '2rem', color: 'var(--text-muted)' }}></i>
                                <p>Upload Prescription Image for Clarification</p>
                                <button className="btn btn-outline" style={{ marginTop: '1rem' }}>Select File</button>
                            </div>
                        </section>
                    )}

                    {activeTab === 'reports' && (
                        <section className="panel-section active">
                            <h2>Lab Reports</h2>
                            <div className="glass-card">
                                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', padding: '10px 0' }}>
                                    <span>Blood Test (CBC)</span>
                                    <span className="text-muted">24 Dec 2024</span>
                                    <a href="#" style={{ color: 'var(--primary-teal)' }}>Download</a>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
                                    <span>X-Ray Chest</span>
                                    <span className="text-muted">20 Dec 2024</span>
                                    <a href="#" style={{ color: 'var(--primary-teal)' }}>Download</a>
                                </div>
                            </div>
                        </section>
                    )}

                    {activeTab === 'emergency' && (
                        <section className="panel-section active">
                            <h2 style={{ color: '#DC2626' }}>Emergency Response Panel</h2>
                            <div className="glass-card" style={{ borderLeft: '5px solid #DC2626' }}>
                                <h3><i className="fas fa-phone-alt"></i> Emergency Extensions</h3>
                                <ul style={{ marginTop: '1rem', fontSize: '1.1rem', listStyle: 'none', padding: 0 }}>
                                    <li><strong>Trauma Center:</strong> Ext 101</li>
                                    <li><strong>Cardiac Emergency:</strong> Ext 102</li>
                                    <li><strong>Ambulance:</strong> +92 300 1234567</li>
                                </ul>
                            </div>
                            <h3 style={{ marginTop: '2rem' }}>Doctors Immediately Available</h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'white', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid #FECACA', marginBottom: '1rem' }}>
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ color: '#991B1B' }}>Dr. Emergency Spec</h4>
                                    <p>Trauma Surgeon</p>
                                </div>
                                <button className="btn" style={{ background: '#DC2626', color: 'white' }}>Call Now</button>
                            </div>
                        </section>
                    )}
                </main>
            </div>
        </div>
    );
};

export default PatientDashboard;
