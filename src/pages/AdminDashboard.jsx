import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserInfo, logoutUser } from '../utils/auth';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('cities');
    const navigate = useNavigate();
    const userInfo = getUserInfo();

    useEffect(() => {
        if (!localStorage.getItem('caresync_user_token') || localStorage.getItem('caresync_user_role') !== 'admin') {
            navigate('/web-admin');
        }
    }, [navigate]);

    const handleLogout = () => {
        logoutUser();
        navigate('/');
    };

    return (
        <div style={{ paddingBottom: '4rem' }}>
            <div style={{ background: 'var(--white)', padding: '1rem', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="hospital-name-display" style={{ fontWeight: 600, color: 'var(--primary-teal)' }}>System Administration</span>
                <div style={{ fontSize: '0.9rem' }}>
                    <i className="fas fa-user-shield"></i> {userInfo.name}
                    <button onClick={handleLogout} className="btn btn-outline" style={{ marginLeft: '1rem', padding: '0.3rem 0.8rem' }}>Logout</button>
                </div>
            </div>

            <div className="dashboard-container" style={{ display: 'flex', minHeight: 'calc(100vh - 140px)' }}>
                {/* Sidebar */}
                <aside className="sidebar" style={{ width: '250px', background: 'var(--white)', borderRight: '1px solid #CCFBF1', padding: '2rem 0', display: 'flex', flexDirection: 'column' }}>
                    <div className={`sidebar-item ${activeTab === 'cities' ? 'active' : ''}`} onClick={() => setActiveTab('cities')} style={{ padding: '1rem 2rem', cursor: 'pointer', transition: 'all 0.3s', fontWeight: 500 }}>
                        <i className="fas fa-city" style={{ marginRight: '10px' }}></i> Manage Cities
                    </div>
                    <div className={`sidebar-item ${activeTab === 'hospitals' ? 'active' : ''}`} onClick={() => setActiveTab('hospitals')} style={{ padding: '1rem 2rem', cursor: 'pointer', transition: 'all 0.3s', fontWeight: 500 }}>
                        <i className="fas fa-hospital-symbol" style={{ marginRight: '10px' }}></i> Manage Hospitals
                    </div>
                    <div className={`sidebar-item ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')} style={{ padding: '1rem 2rem', cursor: 'pointer', transition: 'all 0.3s', fontWeight: 500 }}>
                        <i className="fas fa-users-cog" style={{ marginRight: '10px' }}></i> System Users
                    </div>
                </aside>

                {/* Main Content */}
                <main className="main-panel" style={{ flex: 1, padding: '2rem' }}>
                    {activeTab === 'cities' && (
                        <section className="panel-section active">
                            <h2>Manage Cities</h2>
                            <div className="glass-card">
                                <ul style={{ listStyle: 'none', padding: 0 }}>
                                    <li style={{ padding: '10px', borderBottom: '1px solid #eee' }}>Rawalpindi <button className="btn btn-outline" style={{ float: 'right', fontSize: '0.7rem', padding: '2px 8px' }}>Edit</button></li>
                                    <li style={{ padding: '10px', borderBottom: '1px solid #eee' }}>Islamabad <button className="btn btn-outline" style={{ float: 'right', fontSize: '0.7rem', padding: '2px 8px' }}>Edit</button></li>
                                </ul>
                                <button className="btn btn-primary" style={{ marginTop: '1rem' }}>Add New City</button>
                            </div>
                        </section>
                    )}

                    {activeTab === 'hospitals' && (
                        <section className="panel-section active">
                            <h2>Manage Hospitals</h2>
                            <button className="btn btn-primary" style={{ marginBottom: '1rem' }}>Add New Hospital</button>
                            <div className="glass-card">
                                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid #eee' }}>
                                            <th style={{ padding: '10px' }}>Hospital Name</th>
                                            <th>City</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td style={{ padding: '10px' }}>Shifa International</td>
                                            <td>Islamabad</td>
                                            <td style={{ color: 'green' }}>Active</td>
                                            <td><button className="btn btn-outline" style={{ fontSize: '0.7rem' }}>Manage</button></td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '10px' }}>Benazir Bhutto Hospital</td>
                                            <td>Rawalpindi</td>
                                            <td style={{ color: 'green' }}>Active</td>
                                            <td><button className="btn btn-outline" style={{ fontSize: '0.7rem' }}>Manage</button></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    )}

                    {activeTab === 'users' && (
                        <section className="panel-section active">
                            <h2>Manage System Users</h2>
                            <div className="glass-card">
                                <p>Create Admin accounts for hospital managers.</p>
                                <form style={{ marginTop: '1rem' }} onSubmit={(e) => { e.preventDefault(); alert('User Created!'); }}>
                                    <div className="form-group"><input type="email" placeholder="User Email" required /></div>
                                    <div className="form-group" style={{ marginTop: '2px' }}>
                                        <select>
                                            <option>Hospital Admin</option>
                                            <option>Web Admin</option>
                                        </select>
                                    </div>
                                    <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>Create User</button>
                                </form>
                            </div>
                        </section>
                    )}
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
