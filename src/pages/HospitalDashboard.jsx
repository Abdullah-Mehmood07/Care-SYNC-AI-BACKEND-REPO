import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserInfo, logoutUser } from '../utils/auth';

const HospitalDashboard = () => {
    const [activeTab, setActiveTab] = useState('doctors');
    const navigate = useNavigate();
    const userInfo = getUserInfo();
    const hospital = localStorage.getItem('caresync_hospital') || 'Shifa International Hospital';

    useEffect(() => {
        if (!localStorage.getItem('caresync_user_token') || localStorage.getItem('caresync_user_role') !== 'hospital') {
            navigate('/hospital-login');
        }
    }, [navigate]);

    const handleLogout = () => {
        logoutUser();
        navigate('/');
    };

    return (
        <div style={{ paddingBottom: '4rem' }}>
            <div style={{ background: 'var(--white)', padding: '1rem', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="hospital-name-display" style={{ fontWeight: 600, color: 'var(--primary-teal)' }}>{hospital}</span>
                <div style={{ fontSize: '0.9rem' }}>
                    <i className="fas fa-user-shield"></i> {userInfo.name}
                    <button onClick={handleLogout} className="btn btn-outline" style={{ marginLeft: '1rem', padding: '0.3rem 0.8rem' }}>Logout</button>
                </div>
            </div>

            <div className="dashboard-container" style={{ display: 'flex', minHeight: 'calc(100vh - 140px)' }}>
                {/* Sidebar */}
                <aside className="sidebar" style={{ width: '250px', background: 'var(--white)', borderRight: '1px solid #CCFBF1', padding: '2rem 0', display: 'flex', flexDirection: 'column' }}>
                    <div className={`sidebar-item ${activeTab === 'doctors' ? 'active' : ''}`} onClick={() => setActiveTab('doctors')} style={{ padding: '1rem 2rem', cursor: 'pointer', transition: 'all 0.3s', fontWeight: 500 }}>
                        <i className="fas fa-user-md" style={{ marginRight: '10px' }}></i> Manage Doctors
                    </div>
                    <div className={`sidebar-item ${activeTab === 'patients' ? 'active' : ''}`} onClick={() => setActiveTab('patients')} style={{ padding: '1rem 2rem', cursor: 'pointer', transition: 'all 0.3s', fontWeight: 500 }}>
                        <i className="fas fa-user-injured" style={{ marginRight: '10px' }}></i> Register Patient
                    </div>
                    <div className={`sidebar-item ${activeTab === 'emergency' ? 'active' : ''}`} onClick={() => setActiveTab('emergency')} style={{ padding: '1rem 2rem', cursor: 'pointer', transition: 'all 0.3s', fontWeight: 500 }}>
                        <i className="fas fa-ambulance" style={{ marginRight: '10px' }}></i> Emergency Settings
                    </div>
                    <div className={`sidebar-item ${activeTab === 'services' ? 'active' : ''}`} onClick={() => setActiveTab('services')} style={{ padding: '1rem 2rem', cursor: 'pointer', transition: 'all 0.3s', fontWeight: 500 }}>
                        <i className="fas fa-concierge-bell" style={{ marginRight: '10px' }}></i> Hospital Services
                    </div>
                </aside>

                {/* Main Content */}
                <main className="main-panel" style={{ flex: 1, padding: '2rem' }}>
                    {activeTab === 'doctors' && (
                        <section className="panel-section active">
                            <h2>Manage Doctor Profiles</h2>
                            <button className="btn btn-primary" style={{ marginBottom: '1rem' }}><i className="fas fa-plus"></i> Add New Doctor</button>
                            <div className="glass-card">
                                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid #eee' }}>
                                            <th style={{ padding: '10px' }}>Name</th>
                                            <th>Specialty</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td style={{ padding: '10px' }}>Dr. Fatima Bibi</td>
                                            <td>Cardiology</td>
                                            <td>Active</td>
                                            <td><button className="btn btn-outline" style={{ padding: '2px 8px', fontSize: '0.8rem' }}>Edit</button></td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '10px' }}>Dr. Omar Farooq</td>
                                            <td>General</td>
                                            <td>Active</td>
                                            <td><button className="btn btn-outline" style={{ padding: '2px 8px', fontSize: '0.8rem' }}>Edit</button></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    )}

                    {activeTab === 'patients' && (
                        <section className="panel-section active">
                            <h2>Register New Patient</h2>
                            <div className="glass-card" style={{ maxWidth: '600px' }}>
                                <form onSubmit={(e) => { e.preventDefault(); alert('Patient Registered'); }}>
                                    <div className="form-group" style={{ marginBottom: '1rem' }}><input type="text" placeholder="Full Name" /></div>
                                    <div className="form-group" style={{ marginBottom: '1rem' }}><input type="text" placeholder="CNIC / ID" /></div>
                                    <div className="form-group" style={{ marginBottom: '1rem' }}><input type="tel" placeholder="Contact Number" /></div>
                                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                                        <select>
                                            <option>Male</option>
                                            <option>Female</option>
                                        </select>
                                    </div>
                                    <button type="submit" className="btn btn-primary">Create Patient Record</button>
                                </form>
                            </div>
                        </section>
                    )}

                    {activeTab === 'emergency' && (
                        <section className="panel-section active">
                            <h2>Manage Emergency Response</h2>
                            <div className="glass-card">
                                <h3>On-Call Emergency Doctors</h3>
                                <div style={{ margin: '1rem 0' }}>
                                    <label>Select Doctor for Emergency Duty</label>
                                    <select style={{ marginBottom: '1rem', display: 'block', width: '100%', maxWidth: '400px' }}>
                                        <option>Dr. Usman Gondal</option>
                                    </select>
                                </div>
                                <button className="btn btn-primary">Update Emergency Roster</button>
                            </div>
                        </section>
                    )}

                    {activeTab === 'services' && (
                        <section className="panel-section active">
                            <h2>Hospital Services Management</h2>
                            <div className="glass-card">
                                <p>Manage list of available services (Labs, Wards, etc).</p>
                                <ul style={{ listStyle: 'none', padding: 0 }}>
                                    <li style={{ padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>MRI Scan <button className="btn btn-outline" style={{ float: 'right', padding: '2px 8px' }}>Edit</button></li>
                                    <li style={{ padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>CT Scan <button className="btn btn-outline" style={{ float: 'right', padding: '2px 8px' }}>Edit</button></li>
                                </ul>
                            </div>
                        </section>
                    )}
                </main>
            </div>
        </div>
    );
};

export default HospitalDashboard;
