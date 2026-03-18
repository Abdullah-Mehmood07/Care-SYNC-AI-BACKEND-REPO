import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserInfo, logoutUser } from '../utils/auth';

const PADashboard = () => {
    const [activeTab, setActiveTab] = useState('schedule');
    const navigate = useNavigate();
    const userInfo = getUserInfo();
    const [hospitalName, setHospitalName] = useState('Loading...');

    useEffect(() => {
        if (!userInfo.token || userInfo.role !== 'PA Admin') {
            navigate('/pa-login');
            return;
        }

        const fetchHospitalDetails = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/hospitals`, {
                    headers: { 'Authorization': `Bearer ${userInfo.token}` }
                });
                const data = await res.json();
                
                const myHospital = Array.isArray(data) ? data.find(h => h._id === userInfo.hospitalId) : null;
                
                if (myHospital) {
                    setHospitalName(myHospital.name);
                } else {
                    setHospitalName('Unassigned PA Desk');
                }
            } catch (error) {
                console.error("Failed to load hospital details");
                setHospitalName('Error Loading PA Hub');
            }
        };

        fetchHospitalDetails();
    }, [navigate, userInfo]);

    const handleLogout = () => {
        logoutUser();
        navigate('/');
    };

    return (
        <div style={{ paddingBottom: '4rem' }}>
            <div style={{ background: 'var(--white)', padding: '1rem', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="hospital-name-display" style={{ fontWeight: 600, color: 'var(--primary-teal)' }}>{hospitalName}</span>
                <div style={{ fontSize: '0.9rem' }}>
                    <i className="fas fa-user-circle"></i> {userInfo.email ? userInfo.email.split('@')[0] : 'PA Desk'}
                    <button onClick={handleLogout} className="btn btn-outline" style={{ marginLeft: '1rem', padding: '0.3rem 0.8rem' }}>Logout</button>
                </div>
            </div>

            <div className="dashboard-container" style={{ display: 'flex', minHeight: 'calc(100vh - 140px)' }}>
                {/* Sidebar */}
                <aside className="sidebar" style={{ width: '250px', background: 'var(--white)', borderRight: '1px solid #CCFBF1', padding: '2rem 0', display: 'flex', flexDirection: 'column' }}>
                    <div className={`sidebar-item ${activeTab === 'schedule' ? 'active' : ''}`} onClick={() => setActiveTab('schedule')} style={{ padding: '1rem 2rem', cursor: 'pointer', transition: 'all 0.3s', fontWeight: 500 }}>
                        <i className="fas fa-calendar-alt" style={{ marginRight: '10px' }}></i> Set Schedule
                    </div>
                    <div className={`sidebar-item ${activeTab === 'appointments' ? 'active' : ''}`} onClick={() => setActiveTab('appointments')} style={{ padding: '1rem 2rem', cursor: 'pointer', transition: 'all 0.3s', fontWeight: 500 }}>
                        <i className="fas fa-clipboard-check" style={{ marginRight: '10px' }}></i> Manage Appointments
                    </div>
                    <div className={`sidebar-item ${activeTab === 'slots' ? 'active' : ''}`} onClick={() => setActiveTab('slots')} style={{ padding: '1rem 2rem', cursor: 'pointer', transition: 'all 0.3s', fontWeight: 500 }}>
                        <i className="fas fa-clock" style={{ marginRight: '10px' }}></i> View Slots
                    </div>
                    <div className={`sidebar-item ${activeTab === 'consultation' ? 'active' : ''}`} onClick={() => setActiveTab('consultation')} style={{ padding: '1rem 2rem', cursor: 'pointer', transition: 'all 0.3s', fontWeight: 500 }}>
                        <i className="fas fa-video" style={{ marginRight: '10px' }}></i> Online Consultation
                    </div>
                    <div className={`sidebar-item ${activeTab === 'chats' ? 'active' : ''}`} onClick={() => setActiveTab('chats')} style={{ padding: '1rem 2rem', cursor: 'pointer', transition: 'all 0.3s', fontWeight: 500 }}>
                        <i className="fas fa-comments" style={{ marginRight: '10px' }}></i> Patient Chats
                    </div>
                </aside>

                {/* Main Content */}
                <main className="main-panel" style={{ flex: 1, padding: '2rem' }}>
                    {activeTab === 'schedule' && (
                        <section className="panel-section active">
                            <h2>Set Doctor Schedule</h2>
                            <div className="glass-card">
                                <div className="form-group">
                                    <label>Select Doctor</label>
                                    <select style={{ marginBottom: '1rem' }}>
                                        <option>Dr. Omar Farooq</option>
                                        <option>Dr. Fatima Bibi</option>
                                    </select>
                                </div>
                                <label>Navigate Availability (Click to Toggle)</label>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px', marginTop: '1rem' }}>
                                    <div style={{ background: 'white', padding: '10px', border: '1px solid #eee', textAlign: 'center', borderRadius: '8px', cursor: 'pointer' }}>Mon</div>
                                    <div style={{ background: 'var(--primary-teal)', color: 'white', padding: '10px', border: '1px solid #eee', textAlign: 'center', borderRadius: '8px', cursor: 'pointer' }}>Tue</div>
                                    <div style={{ background: 'var(--primary-teal)', color: 'white', padding: '10px', border: '1px solid #eee', textAlign: 'center', borderRadius: '8px', cursor: 'pointer' }}>Wed</div>
                                    <div style={{ background: 'white', padding: '10px', border: '1px solid #eee', textAlign: 'center', borderRadius: '8px', cursor: 'pointer' }}>Thu</div>
                                    <div style={{ background: 'var(--primary-teal)', color: 'white', padding: '10px', border: '1px solid #eee', textAlign: 'center', borderRadius: '8px', cursor: 'pointer' }}>Fri</div>
                                    <div style={{ background: 'white', padding: '10px', border: '1px solid #eee', textAlign: 'center', borderRadius: '8px', cursor: 'pointer' }}>Sat</div>
                                    <div style={{ background: 'white', padding: '10px', border: '1px solid #eee', textAlign: 'center', borderRadius: '8px', cursor: 'pointer' }}>Sun</div>
                                </div>
                                <div style={{ marginTop: '1rem' }}>
                                    <label>Duty Status</label>
                                    <select>
                                        <option>On Duty</option>
                                        <option>Off Duty</option>
                                        <option>In Consultation</option>
                                    </select>
                                </div>
                                <button className="btn btn-primary" style={{ marginTop: '1rem' }}>Update Schedule</button>
                            </div>
                        </section>
                    )}

                    {activeTab === 'appointments' && (
                        <section className="panel-section active">
                            <h2>Pending Appointments</h2>
                            <div className="glass-card">
                                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid #eee' }}>
                                            <th style={{ padding: '10px' }}>Patient</th>
                                            <th>Doctor</th>
                                            <th>Time</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td style={{ padding: '10px' }}>Mr. Ahmed Ali</td>
                                            <td>Dr. Fatima Bibi</td>
                                            <td>10:00 AM</td>
                                            <td>
                                                <button className="btn btn-primary" style={{ padding: '5px 10px', fontSize: '0.8rem', marginRight: '5px' }}>Approve</button>
                                                <button className="btn btn-outline" style={{ padding: '5px 10px', fontSize: '0.8rem' }}>Decline</button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    )}

                    {activeTab === 'slots' && (
                        <section className="panel-section active">
                            <h2>Available Slots View</h2>
                            <div className="glass-card">
                                <p>Visual representation of 15-minute slots for selected doctor.</p>
                                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '1rem' }}>
                                    <span style={{ padding: '5px 10px', background: '#DCFCE7', borderRadius: '4px' }}>10:00 AM</span>
                                    <span style={{ padding: '5px 10px', background: '#FECACA', borderRadius: '4px', textDecoration: 'line-through' }}>10:15 AM</span>
                                    <span style={{ padding: '5px 10px', background: '#DCFCE7', borderRadius: '4px' }}>10:30 AM</span>
                                </div>
                            </div>
                        </section>
                    )}

                    {activeTab === 'consultation' && (
                        <section className="panel-section active">
                            <h2>Online Consultation Portal</h2>
                            <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
                                <i className="fas fa-video" style={{ fontSize: '3rem', color: 'var(--primary-teal)' }}></i>
                                <h3>Start Video Session</h3>
                                <p>Connect with queued patients.</p>
                                <button className="btn btn-primary" style={{ marginTop: '1rem' }}>Launch Meeting Room</button>
                            </div>
                        </section>
                    )}

                    {activeTab === 'chats' && (
                        <section className="panel-section active">
                            <h2>Patient Queries</h2>
                            <div className="glass-card">
                                <div style={{ borderBottom: '1px solid #eee', padding: '1rem 0' }}>
                                    <strong>Patient: Mrs. Zoya Khan</strong>
                                    <p className="text-muted">"Can I take this medicine with food?"</p>
                                    <button className="btn btn-outline" style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>Reply</button>
                                </div>
                            </div>
                        </section>
                    )}

                </main>
            </div>
        </div>
    );
};

export default PADashboard;
