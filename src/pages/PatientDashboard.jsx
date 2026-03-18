import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserInfo, logoutUser } from '../utils/auth';

const PatientDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const navigate = useNavigate();
    const userInfo = getUserInfo();
    
    // Data states
    const [hospitals, setHospitals] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [doctorsGlobal, setDoctorsGlobal] = useState([]);
    const [myAppointments, setMyAppointments] = useState([]);
    
    // Booking Form State
    const [bookingData, setBookingData] = useState({
        hospitalId: '',
        doctorId: '',
        department: 'General Medicine',
        date: '',
        timeSlot: '10:00 AM - 10:30 AM'
    });

    // Simple auth check
    useEffect(() => {
        if (!userInfo.token || userInfo.role !== 'Patient') {
            navigate('/patient-login');
            return;
        }

        // Fetch Required Data for Patient
        const fetchInitialData = async () => {
            try {
                // 1. Fetch all hospitals for the booking dropdown
                const hospRes = await fetch('http://localhost:5000/api/hospitals', {
                    headers: { 'Authorization': `Bearer ${userInfo.token}` }
                });
                const hospData = await hospRes.json();
                setHospitals(Array.isArray(hospData)? hospData : []);

                // 2. Fetch User's Upcoming Appointments
                const apptRes = await fetch('http://localhost:5000/api/appointments/my-appointments', {
                    headers: { 'Authorization': `Bearer ${userInfo.token}` }
                });
                const apptData = await apptRes.json();
                setMyAppointments(Array.isArray(apptData) ? apptData : []);

                // 3. Fetch global doctor schedule for viewing
                const globalDocRes = await fetch('http://localhost:5000/api/doctors/all', {
                    headers: { 'Authorization': `Bearer ${userInfo.token}` }
                });
                const globalDocData = await globalDocRes.json();
                setDoctorsGlobal(Array.isArray(globalDocData) ? globalDocData : []);

            } catch (err) {
                console.error("Failed to load patient static data", err);
            }
        };

        fetchInitialData();
    }, [navigate, userInfo]);

    // When a patient selects a hospital in the booking form, we must fetch THAT hospital's doctors
    const handleHospitalSelect = async (e) => {
        const selectedHospitalId = e.target.value;
        setBookingData({ ...bookingData, hospitalId: selectedHospitalId, doctorId: '' }); // Reset doctor

        if (!selectedHospitalId) {
            setDoctors([]);
            return;
        }

        try {
            const docRes = await fetch(`http://localhost:5000/api/doctors/hospital/${selectedHospitalId}`, {
                headers: { 'Authorization': `Bearer ${userInfo.token}` }
            });
            const docData = await docRes.json();
            setDoctors(Array.isArray(docData) ? docData : []);
            if (docData.length > 0) {
                setBookingData(prev => ({ ...prev, doctorId: docData[0]._id })); // Auto select first doc
            }
        } catch (error) {
            console.error('Failed to fetch doctors', error);
        }
    };

    const handleLogout = () => {
        logoutUser();
        navigate('/');
    };

    const handleBooking = async (e) => {
        e.preventDefault();
        
        if (!bookingData.hospitalId || !bookingData.doctorId || !bookingData.date) {
            return alert("Please fill out all booking fields.");
        }

        try {
            const res = await fetch('http://localhost:5000/api/appointments', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userInfo.token}`
                },
                body: JSON.stringify({
                    doctorId: bookingData.doctorId,
                    hospitalId: bookingData.hospitalId,
                    date: bookingData.date,
                    timeSlot: bookingData.timeSlot
                })
            });

            if (res.ok) {
                alert('Appointment Request Sent Successfully!');
                // Refresh appointments
                const apptRes = await fetch('http://localhost:5000/api/appointments/my-appointments', {
                    headers: { 'Authorization': `Bearer ${userInfo.token}` }
                });
                const apptData = await apptRes.json();
                setMyAppointments(Array.isArray(apptData) ? apptData : []);
                
                setActiveTab('dashboard');
            } else {
                const err = await res.json();
                alert(`Booking Failed: ${err.message}`);
            }
        } catch (error) {
            alert('Failed to connect to server.');
        }
    };

    return (
        <div style={{ paddingBottom: '4rem' }}>
            <div style={{ background: 'var(--white)', padding: '1rem', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="hospital-name-display" style={{ fontWeight: 600, color: 'var(--primary-teal)' }}>CareSync Network</span>
                <div style={{ fontSize: '0.9rem' }}>
                    <i className="fas fa-user-circle"></i> {userInfo.email.split('@')[0]} <span style={{color: 'var(--text-muted)'}}>| GHID: {userInfo.id}</span>
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
                                {myAppointments.length === 0 ? <p>You have no upcoming appointments.</p> : (
                                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                        <thead>
                                            <tr style={{ borderBottom: '1px solid #eee' }}>
                                                <th style={{ padding: '10px' }}>Doctor</th>
                                                <th>Hospital</th>
                                                <th>Date</th>
                                                <th>Time</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {myAppointments.map(appt => (
                                                <tr key={appt._id}>
                                                    <td style={{ padding: '10px', fontWeight: 'bold' }}>{appt.doctorId?.name || 'Unknown'}</td>
                                                    <td>{appt.hospitalId?.name || 'Unknown Facility'}</td>
                                                    <td>{new Date(appt.date).toLocaleDateString()}</td>
                                                    <td>{appt.timeSlot}</td>
                                                    <td>
                                                        <span style={{ 
                                                            padding: '4px 8px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 600, 
                                                            background: appt.status === 'Confirmed' ? '#DCFCE7' : '#FEF2F2', 
                                                            color: appt.status === 'Confirmed' ? '#166534' : '#991B1B' 
                                                        }}>
                                                            {appt.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </section>
                    )}

                    {activeTab === 'booking' && (
                        <section className="panel-section active">
                            <h2>Book Appointment</h2>
                            <div className="glass-card" style={{ maxWidth: '600px' }}>
                                <form onSubmit={handleBooking}>
                                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                                        <label>Select Hospital Network</label>
                                        <select required value={bookingData.hospitalId} onChange={handleHospitalSelect} style={{ marginBottom: '1rem', width: '100%', padding: '8px' }}>
                                            <option value="">-- Choose Facility --</option>
                                            {hospitals.map(h => (
                                                <option key={h._id} value={h._id}>{h.name} ({h.city?.name || 'Local'})</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                                        <label>Select Department Option</label>
                                        <select required value={bookingData.department} onChange={(e) => setBookingData({...bookingData, department: e.target.value})} style={{ marginBottom: '1rem', width: '100%', padding: '8px' }}>
                                            <option>General Medicine</option>
                                            <option>Cardiology</option>
                                            <option>Dermatology</option>
                                            <option>Pediatrics</option>
                                        </select>
                                    </div>
                                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                                        <label>Select Available Doctor</label>
                                        <select required disabled={!bookingData.hospitalId || doctors.length === 0} value={bookingData.doctorId} onChange={(e) => setBookingData({...bookingData, doctorId: e.target.value})} style={{ marginBottom: '1rem', width: '100%', padding: '8px' }}>
                                            {doctors.length === 0 ? <option value="">No doctors available</option> : null}
                                            {doctors.map(d => (
                                                <option key={d._id} value={d._id}>{d.name} ({d.specialty})</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <div className="form-group" style={{ flex: 1 }}>
                                            <label>Date</label>
                                            <input type="date" required value={bookingData.date} onChange={(e) => setBookingData({...bookingData, date: e.target.value})} style={{ marginBottom: '1rem', width: '100%', padding: '8px' }} />
                                        </div>
                                        <div className="form-group" style={{ flex: 1 }}>
                                            <label>Time Slot</label>
                                            <select required value={bookingData.timeSlot} onChange={(e) => setBookingData({...bookingData, timeSlot: e.target.value})} style={{ marginBottom: '1rem', width: '100%', padding: '8px' }}>
                                                <option>10:00 AM - 10:30 AM</option>
                                                <option>10:30 AM - 11:00 AM</option>
                                                <option>11:00 AM - 11:30 AM</option>
                                                <option>02:00 PM - 02:30 PM</option>
                                                <option>04:00 PM - 04:30 PM</option>
                                            </select>
                                        </div>
                                    </div>
                                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Confirm Booking via GHID</button>
                                </form>
                            </div>
                        </section>
                    )}

                    {activeTab === 'schedule' && (
                        <section className="panel-section active">
                            <h2>All Doctors Network Availability</h2>
                            <div style={{ marginTop: '1rem' }}>
                                {doctorsGlobal.length === 0 ? <p>No doctors currently listed in the network.</p> : null}
                                {doctorsGlobal.map(doc => (
                                    <div key={doc._id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'white', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid #E2E8F0', marginBottom: '1rem' }}>
                                        <div style={{ width: '50px', height: '50px', background: '#eee', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <i className="fas fa-user-md"></i>
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <h4>{doc.name}</h4>
                                            <p className="text-muted">{doc.specialty} - {doc.hospital?.name || 'Unassigned Facility'}</p>
                                        </div>
                                        {doc.onCall ? (
                                            <span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 600, background: '#FEF2F2', color: '#991B1B' }}>Emergency / In Surgery</span>
                                        ) : (
                                            <span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 600, background: '#DCFCE7', color: '#166534' }}>Available</span>
                                        )}
                                    </div>
                                ))}
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
