import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserInfo, logoutUser } from '../utils/auth';

const HospitalDashboard = () => {
    const [activeTab, setActiveTab] = useState('doctors');
    const navigate = useNavigate();
    const userInfo = getUserInfo();
    const [hospitalName, setHospitalName] = useState('Loading...');

    // Data States
    const [doctors, setDoctors] = useState([]);
    const [services, setServices] = useState([]);
    const [newDoctorData, setNewDoctorData] = useState({ name: '', specialty: '', status: 'Active', onCall: false });
    const [newServiceData, setNewServiceData] = useState({ name: '', description: '', price: 0 });
    const [newLabData, setNewLabData] = useState({ name: '', email: '', password: '' });
    const [newPaData, setNewPaData] = useState({ name: '', email: '', password: '' });

    useEffect(() => {
        if (!userInfo.token || userInfo.role !== 'Hospital Admin') {
            navigate('/hospital-login');
            return;
        }

        const fetchHospitalDetails = async () => {
            try {
                // If we don't have a hospital route by ID yet, we'll gracefully fallback or fetch all and filter
                // For a true industrial build, we'd add 'GET /api/hospitals/:id' in the backend. 
                // Using fallback here assuming standard REST architecture.
                const res = await fetch(`http://localhost:5000/api/hospitals`, {
                    headers: { 'Authorization': `Bearer ${userInfo.token}` }
                });
                const data = await res.json();
                
                // Find our specific hospital using the ID connected to this Admin
                const myHospital = Array.isArray(data) ? data.find(h => h._id === userInfo.hospitalId) : null;
                
                if (myHospital) {
                    setHospitalName({ name: myHospital.name, city: myHospital.city?.name || '' });
                    // Fetch doctors and services specifically for this hospital once we know who we are
                    fetchDoctors(userInfo.hospitalId);
                    fetchServices(userInfo.hospitalId);
                } else {
                    setHospitalName({ name: 'Unassigned Hospital Sector', city: '' });
                }
            } catch (error) {
                console.error("Failed to load hospital details");
                setHospitalName({ name: 'Error Loading Hospital', city: '' });
            }
        };

        const fetchDoctors = async (hospitalId) => {
            try {
                const res = await fetch(`http://localhost:5000/api/doctors/hospital/${hospitalId}`, {
                    headers: { 'Authorization': `Bearer ${userInfo.token}` }
                });
                const data = await res.json();
                setDoctors(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Failed to fetch doctors', error);
            }
        };

        const fetchServices = async (hospitalId) => {
            try {
                const res = await fetch(`http://localhost:5000/api/services/hospital/${hospitalId}`, {
                    headers: { 'Authorization': `Bearer ${userInfo.token}` }
                });
                const data = await res.json();
                setServices(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Failed to fetch services', error);
            }
        };

        fetchHospitalDetails();
        
    }, [navigate, userInfo]);

    const handleLogout = () => {
        logoutUser();
        navigate('/');
    };

    const handleAddDoctor = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`http://localhost:5000/api/doctors`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userInfo.token}`
                },
                body: JSON.stringify(newDoctorData)
            });

            if (res.ok) {
                setNewDoctorData({ name: '', specialty: '', status: 'Active', onCall: false });
                
                // Refresh list
                const refreshedRes = await fetch(`http://localhost:5000/api/doctors/hospital/${userInfo.hospitalId}`, {
                    headers: { 'Authorization': `Bearer ${userInfo.token}` }
                });
                const data = await refreshedRes.json();
                setDoctors(Array.isArray(data) ? data : []);
                
                alert('Doctor added successfully!');
            } else {
                const err = await res.json();
                alert(`Error: ${err.message}`);
            }
        } catch (error) {
            alert('Failed to connect to the backend server.');
        }
    };

    const handleAddService = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`http://localhost:5000/api/services`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userInfo.token}`
                },
                body: JSON.stringify(newServiceData)
            });

            if (res.ok) {
                setNewServiceData({ name: '', description: '', price: 0 });
                // Refresh list using the direct fetch approach
                const refreshedRes = await fetch(`http://localhost:5000/api/services/hospital/${userInfo.hospitalId}`, {
                    headers: { 'Authorization': `Bearer ${userInfo.token}` }
                });
                const data = await refreshedRes.json();
                setServices(Array.isArray(data) ? data : []);
                alert('Service added successfully!');
            } else {
                const err = await res.json();
                alert(`Error: ${err.message}`);
            }
        } catch (error) {
            alert('Failed to connect to the backend server.');
        }
    };

    const handleAddLabAdmin = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`http://localhost:5000/api/users`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userInfo.token}`
                },
                body: JSON.stringify({
                    name: newLabData.name,
                    email: newLabData.email,
                    password: newLabData.password,
                    role: 'Lab Admin'
                })
            });

            if (res.ok) {
                setNewLabData({ name: '', email: '', password: '' });
                alert('Lab Administrator account created successfully!');
            } else {
                const err = await res.json();
                alert(`Error: ${err.message}`);
            }
        } catch (error) {
            alert('Failed to connect to the backend server.');
        }
    };

    const handleAddPaAdmin = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`http://localhost:5000/api/users`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userInfo.token}`
                },
                body: JSON.stringify({
                    name: newPaData.name,
                    email: newPaData.email,
                    password: newPaData.password,
                    role: 'PA Admin'
                })
            });

            if (res.ok) {
                setNewPaData({ name: '', email: '', password: '' });
                alert('PA Administrator account created successfully!');
            } else {
                const err = await res.json();
                alert(`Error: ${err.message}`);
            }
        } catch (error) {
            alert('Failed to connect to the backend server.');
        }
    };

    const toggleDoctorOnCall = async (doctorId, currentStatus) => {
        try {
            const res = await fetch(`http://localhost:5000/api/doctors/${doctorId}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userInfo.token}`
                },
                body: JSON.stringify({ onCall: !currentStatus })
            });

            if (res.ok) {
                // Update local state directly for speedy UI feedback
                setDoctors(doctors.map(doc => doc._id === doctorId ? { ...doc, onCall: !currentStatus } : doc));
            }
        } catch (error) {
            alert('Failed to update doctor status.');
        }
    };

    return (
        <div style={{ paddingBottom: '4rem' }}>
            <div style={{ background: 'var(--white)', padding: '1rem', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="hospital-name-display" style={{ fontWeight: 600, color: 'var(--primary-teal)' }}>
                    {hospitalName.name} <span style={{fontSize: '0.8rem', color: '#666', fontWeight: 'normal'}}>{hospitalName.city ? `(${hospitalName.city})` : ''}</span>
                </span>
                <div style={{ fontSize: '0.9rem' }}>
                    <i className="fas fa-user-shield"></i> {userInfo.email.split('@')[0]}
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
                    <div className={`sidebar-item ${activeTab === 'lab-portal' ? 'active' : ''}`} onClick={() => setActiveTab('lab-portal')} style={{ padding: '1rem 2rem', cursor: 'pointer', transition: 'all 0.3s', fontWeight: 500 }}>
                        <i className="fas fa-microscope" style={{ marginRight: '10px' }}></i> Manage Lab Portal
                    </div>
                    <div className={`sidebar-item ${activeTab === 'pa-portal' ? 'active' : ''}`} onClick={() => setActiveTab('pa-portal')} style={{ padding: '1rem 2rem', cursor: 'pointer', transition: 'all 0.3s', fontWeight: 500 }}>
                        <i className="fas fa-user-nurse" style={{ marginRight: '10px' }}></i> Manage PA Portal
                    </div>
                </aside>

                {/* Main Content */}
                <main className="main-panel" style={{ flex: 1, padding: '2rem' }}>
                    {activeTab === 'doctors' && (
                        <section className="panel-section active">
                            <h2>Manage Doctor Profiles</h2>
                            
                            <form onSubmit={handleAddDoctor} className="glass-card" style={{ marginBottom: '2rem', display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', padding: '1rem' }}>
                                <input type="text" placeholder="Dr. Name" required value={newDoctorData.name} onChange={(e) => setNewDoctorData({...newDoctorData, name: e.target.value})} style={{ flex: 1, minWidth: '200px' }} />
                                <input type="text" placeholder="Specialty (e.g. Cardiology)" required value={newDoctorData.specialty} onChange={(e) => setNewDoctorData({...newDoctorData, specialty: e.target.value})} style={{ flex: 1, minWidth: '200px' }} />
                                <select value={newDoctorData.status} onChange={(e) => setNewDoctorData({...newDoctorData, status: e.target.value})}>
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                    <option value="On Leave">On Leave</option>
                                </select>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <input type="checkbox" checked={newDoctorData.onCall} onChange={(e) => setNewDoctorData({...newDoctorData, onCall: e.target.checked})} />
                                    On Call
                                </label>
                                <button type="submit" className="btn btn-primary">Add Doctor</button>
                            </form>

                            <div className="glass-card">
                                {doctors.length === 0 ? <p>No doctors found in this facility.</p> : (
                                    <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr style={{ borderBottom: '1px solid #eee' }}>
                                                <th style={{ padding: '10px' }}>Name</th>
                                                <th>Specialty</th>
                                                <th>Status</th>
                                                <th>On Call</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {doctors.map(doc => (
                                                <tr key={doc._id}>
                                                    <td style={{ padding: '10px' }}>{doc.name}</td>
                                                    <td>{doc.specialty}</td>
                                                    <td style={{ color: doc.status === 'Active' ? 'green' : 'gray' }}>{doc.status}</td>
                                                    <td style={{ color: doc.onCall ? 'red' : 'inherit', fontWeight: doc.onCall ? 'bold' : 'normal' }}>{doc.onCall ? 'Yes' : 'No'}</td>
                                                    <td>
                                                        <button className="btn btn-outline" style={{ padding: '2px 8px', fontSize: '0.8rem', marginRight: '5px' }}>Edit</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
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
                                <h3>Emergency Roster (Toggle On-Call)</h3>
                                <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Click below to immediately dispatch or remove a doctor from emergency duty.</p>
                                
                                {doctors.length === 0 ? <p>No doctors available to assign.</p> : (
                                    <ul style={{ listStyle: 'none', padding: 0 }}>
                                    {doctors.map(doc => (
                                        <li key={doc._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', borderBottom: '1px solid #eee' }}>
                                            <div>
                                                <strong>{doc.name}</strong> <span style={{ fontSize: '0.8rem', color: '#666' }}>({doc.specialty})</span>
                                            </div>
                                            <button 
                                                onClick={() => toggleDoctorOnCall(doc._id, doc.onCall)}
                                                className="btn" 
                                                style={{ 
                                                    background: doc.onCall ? '#DC2626' : '#E2E8F0', 
                                                    color: doc.onCall ? 'white' : 'black',
                                                    padding: '5px 15px',
                                                    fontSize: '0.9rem'
                                                }}
                                            >
                                                {doc.onCall ? 'ON CALL' : 'Set On-Call'}
                                            </button>
                                        </li>
                                    ))}
                                    </ul>
                                )}
                            </div>
                        </section>
                    )}

                    {activeTab === 'services' && (
                        <section className="panel-section active">
                            <h2>Hospital Services Management</h2>
                            <div className="glass-card" style={{ marginBottom: '2rem' }}>
                                <h4>Add New Service</h4>
                                <form onSubmit={handleAddService} style={{ display: 'flex', gap: '10px', marginTop: '1rem', flexWrap: 'wrap' }}>
                                    <input type="text" placeholder="Service Name (e.g., MRI Scan)" required value={newServiceData.name} onChange={(e) => setNewServiceData({...newServiceData, name: e.target.value})} style={{ flex: 1, minWidth: '200px' }} />
                                    <input type="text" placeholder="Short Description" value={newServiceData.description} onChange={(e) => setNewServiceData({...newServiceData, description: e.target.value})} style={{ flex: 2, minWidth: '200px' }} />
                                    <input type="number" placeholder="Price (PKR)" required value={newServiceData.price} onChange={(e) => setNewServiceData({...newServiceData, price: e.target.value})} style={{ width: '120px' }} />
                                    <button type="submit" className="btn btn-primary">Save Service</button>
                                </form>
                            </div>

                            <div className="glass-card">
                                {services.length === 0 ? <p>No services cataloged for this hospital.</p> : (
                                    <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr style={{ borderBottom: '1px solid #eee' }}>
                                                <th style={{ padding: '10px' }}>Service Name</th>
                                                <th>Description</th>
                                                <th>Price</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {services.map(srv => (
                                                <tr key={srv._id}>
                                                    <td style={{ padding: '10px', fontWeight: 'bold' }}>{srv.name}</td>
                                                    <td style={{ color: '#666' }}>{srv.description}</td>
                                                    <td>Rs. {srv.price}</td>
                                                    <td><button className="btn btn-outline" style={{ padding: '2px 8px', fontSize: '0.8rem', color: 'red', borderColor: 'red' }}>Delete</button></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </section>
                    )}

                    {activeTab === 'lab-portal' && (
                        <section className="panel-section active">
                            <h2>Manage Laboratory Access</h2>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Create secure credentials for your Laboratory Technicians to upload reports.</p>
                            
                            <div className="glass-card" style={{ maxWidth: '600px' }}>
                                <h4>Create Lab Administrator Account</h4>
                                <form onSubmit={handleAddLabAdmin} style={{ marginTop: '1rem' }}>
                                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                                        <input type="text" placeholder="Lab Tech Full Name" required value={newLabData.name} onChange={(e) => setNewLabData({...newLabData, name: e.target.value})} />
                                    </div>
                                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                                        <input type="email" placeholder="Lab Email Address" required value={newLabData.email} onChange={(e) => setNewLabData({...newLabData, email: e.target.value})} />
                                    </div>
                                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                                        <input type="password" placeholder="Set Initial Password" required value={newLabData.password} onChange={(e) => setNewLabData({...newLabData, password: e.target.value})} />
                                    </div>
                                    <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>Generate Access</button>
                                </form>
                            </div>
                        </section>
                    )}

                    {activeTab === 'pa-portal' && (
                        <section className="panel-section active">
                            <h2>Manage PA Access</h2>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Create secure credentials for Doctor's Personal Assistants.</p>
                            
                            <div className="glass-card" style={{ maxWidth: '600px' }}>
                                <h4>Create PA Administrator Account</h4>
                                <form onSubmit={handleAddPaAdmin} style={{ marginTop: '1rem' }}>
                                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                                        <input type="text" placeholder="PA Full Name" required value={newPaData.name} onChange={(e) => setNewPaData({...newPaData, name: e.target.value})} />
                                    </div>
                                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                                        <input type="email" placeholder="PA Email Address" required value={newPaData.email} onChange={(e) => setNewPaData({...newPaData, email: e.target.value})} />
                                    </div>
                                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                                        <input type="password" placeholder="Set Initial Password" required value={newPaData.password} onChange={(e) => setNewPaData({...newPaData, password: e.target.value})} />
                                    </div>
                                    <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>Generate Access</button>
                                </form>
                            </div>
                        </section>
                    )}
                </main>
            </div>
        </div>
    );
};

export default HospitalDashboard;
