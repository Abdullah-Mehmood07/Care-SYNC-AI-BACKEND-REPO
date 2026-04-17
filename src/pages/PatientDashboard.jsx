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
    
    // Chat states
    const [selectedDoctorId, setSelectedDoctorId] = useState('');
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    // Booking Form State
    const [bookingData, setBookingData] = useState({
        hospitalId: '', doctorId: '', department: 'General Medicine', date: '', timeSlot: '10:00 AM - 10:30 AM'
    });

    useEffect(() => {
        if (!userInfo.token || userInfo.role !== 'Patient') {
            navigate('/login');
            return;
        }

        const fetchInitialData = async () => {
            try {
                const hospRes = await fetch('http://localhost:5000/api/hospitals', { headers: { 'Authorization': `Bearer ${userInfo.token}` } });
                const hospData = await hospRes.json();
                setHospitals(Array.isArray(hospData)? hospData : []);

                const apptRes = await fetch('http://localhost:5000/api/appointments/my-appointments', { headers: { 'Authorization': `Bearer ${userInfo.token}` } });
                const apptData = await apptRes.json();
                setMyAppointments(Array.isArray(apptData) ? apptData : []);

                const globalDocRes = await fetch('http://localhost:5000/api/doctors/all', { headers: { 'Authorization': `Bearer ${userInfo.token}` } });
                const globalDocData = await globalDocRes.json();
                setDoctorsGlobal(Array.isArray(globalDocData) ? globalDocData : []);

            } catch (err) { console.error("Failed to load patient static data", err); }
        };
        fetchInitialData();
    }, [navigate, userInfo]);

    // Chat thread loader (polling)
    useEffect(() => {
        if (activeTab === 'chats' && selectedDoctorId) {
            const fetchMessages = async () => {
                try {
                    const res = await fetch(`http://localhost:5000/api/chats/${userInfo._id}/${selectedDoctorId}`, {
                        headers: { 'Authorization': `Bearer ${userInfo.token}` }
                    });
                    const data = await res.json();
                    if (Array.isArray(data)) setMessages(data);
                } catch (error) {}
            };
            fetchMessages();
            const interval = setInterval(fetchMessages, 3000); // Polling every 3s
            return () => clearInterval(interval);
        }
    }, [activeTab, selectedDoctorId, userInfo]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedDoctorId) return;
        try {
            const res = await fetch('http://localhost:5000/api/chats', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${userInfo.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    patientId: userInfo._id,
                    doctorId: selectedDoctorId,
                    text: newMessage
                })
            });
            if (res.ok) {
                setNewMessage('');
                const newMsg = await res.json();
                setMessages([...messages, newMsg]);
            } else {
                alert('Session expired or identifier missing. Please logout and log back in to refresh your connection.');
            }
        } catch (error) { 
            console.error("Message send failed", error); 
            alert('Failed to connect to chat server. Please check your network or try logging out and back in.');
        }
    };

    const handleHospitalSelect = async (e) => {
        const selectedHospitalId = e.target.value;
        setBookingData({ ...bookingData, hospitalId: selectedHospitalId, doctorId: '' });

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
                setBookingData(prev => ({ ...prev, doctorId: docData[0]._id })); 
            }
        } catch (error) { console.error('Failed to fetch doctors', error); }
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
                const apptRes = await fetch('http://localhost:5000/api/appointments/my-appointments', { headers: { 'Authorization': `Bearer ${userInfo.token}` } });
                const apptData = await apptRes.json();
                setMyAppointments(Array.isArray(apptData) ? apptData : []);
                setActiveTab('dashboard');
            } else {
                const err = await res.json();
                alert(`Booking Failed: ${err.message}`);
            }
        } catch (error) { alert('Failed to connect to server.'); }
    };

    return (
        <div style={{ paddingBottom: '4rem' }}>
            <div style={{ background: 'var(--white)', padding: '1rem', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="hospital-name-display" style={{ fontWeight: 600, color: 'var(--primary-teal)' }}>CareSync Network</span>
                <div style={{ fontSize: '0.9rem' }}>
                    <i className="fas fa-user-circle"></i> {userInfo.email.split('@')[0]} <span style={{color: 'var(--text-muted)'}}>| GHID: {userInfo.ghid || 'N/A'}</span>
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
                        <i className="fas fa-user-md" style={{ marginRight: '10px' }}></i> Doctor Network
                    </div>
                    <div className={`sidebar-item ${activeTab === 'chats' ? 'active' : ''}`} onClick={() => setActiveTab('chats')} style={{ padding: '1rem 2rem', cursor: 'pointer', transition: 'all 0.3s', fontWeight: 500 }}>
                        <i className="fas fa-comments" style={{ marginRight: '10px' }}></i> Consult Doctor
                    </div>
                    <div className={`sidebar-item ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')} style={{ padding: '1rem 2rem', cursor: 'pointer', transition: 'all 0.3s', fontWeight: 500 }}>
                        <i className="fas fa-history" style={{ marginRight: '10px' }}></i> Medical History
                    </div>
                    <div className={`sidebar-item ${activeTab === 'reports' ? 'active' : ''}`} onClick={() => setActiveTab('reports')} style={{ padding: '1rem 2rem', cursor: 'pointer', transition: 'all 0.3s', fontWeight: 500 }}>
                        <i className="fas fa-file-medical" style={{ marginRight: '10px' }}></i> Lab Reports
                    </div>
                </aside>

                {/* Main Content */}
                <main className="main-panel" style={{ flex: 1, padding: '2rem' }}>
                    {activeTab === 'dashboard' && (
                        <section className="panel-section active">
                            <h2>Overview</h2>
                            <div className="services-grid" style={{ margin: '2rem 0', gridTemplateColumns: 'repeat(3, 1fr)' }}>
                                <div className="stat-card" style={{ background: 'white', padding: '1.5rem', borderRadius: 'var(--radius-md)', boxShadow: '0 4px 6px -1px var(--shadow-light)', textAlign: 'center' }}>
                                    <div className="stat-value" style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary-teal)' }}>
                                        {myAppointments.filter(a => a.status === 'Pending' || a.status === 'Confirmed').length < 10 ? `0${myAppointments.filter(a => a.status === 'Pending' || a.status === 'Confirmed').length}` : myAppointments.filter(a => a.status === 'Pending' || a.status === 'Confirmed').length}
                                    </div>
                                    <p>Active Appointments</p>
                                </div>
                                <div className="stat-card" style={{ background: 'white', padding: '1.5rem', borderRadius: 'var(--radius-md)', boxShadow: '0 4px 6px -1px var(--shadow-light)', textAlign: 'center' }}>
                                    <div className="stat-value" style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary-teal)' }}>00</div>
                                    <p>Lab Reports Ready</p>
                                </div>
                                <div className="stat-card" style={{ background: 'white', padding: '1.5rem', borderRadius: 'var(--radius-md)', boxShadow: '0 4px 6px -1px var(--shadow-light)', textAlign: 'center' }}>
                                    <div className="stat-value text-muted" style={{ fontSize: '2rem', fontWeight: 700 }}>--</div>
                                    <p>Queue Position</p>
                                </div>
                            </div>

                            <h3>Your Appointments</h3>
                            <div className="glass-card" style={{ padding: '1rem', marginTop: '1rem' }}>
                                {myAppointments.length === 0 ? <p>You have no appointments yet.</p> : (
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
                            <h2>All Doctors Network Status</h2>
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
                                        {doc.dutyStatus === 'On Duty' ? (
                                            <span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 600, background: '#DCFCE7', color: '#166534' }}>On Duty</span>
                                        ) : doc.dutyStatus === 'In Consultation' ? (
                                            <span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 600, background: '#FEF08A', color: '#854D0E' }}>In Consultation</span>
                                        ) : (
                                            <span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 600, background: '#F1F5F9', color: '#64748B' }}>Off Duty</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {activeTab === 'chats' && (
                        <section className="panel-section active">
                            <h2>Consult Doctor</h2>
                            <div className="glass-card">
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Select Doctor to Message</label>
                                <select 
                                    value={selectedDoctorId} 
                                    onChange={(e) => setSelectedDoctorId(e.target.value)} 
                                    style={{ width: '100%', padding: '10px', marginBottom: '1rem' }}
                                >
                                    <option value="">-- Choose a Doctor --</option>
                                    {doctorsGlobal.map(d => (
                                        <option key={d._id} value={d._id}>{d.name} ({d.specialty} @ {d.hospital?.name})</option>
                                    ))}
                                </select>

                                {selectedDoctorId && (
                                    <div style={{ border: '1px solid #eee', borderRadius: '8px', overflow: 'hidden' }}>
                                        <div style={{ background: 'var(--primary-bg)', padding: '1rem', borderBottom: '1px solid #eee' }}>
                                            <strong>Chat Stream</strong>
                                        </div>
                                        <div style={{ height: '300px', overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '10px', background: 'white' }}>
                                            {messages.length === 0 && <p style={{ textAlign: 'center', color: '#888' }}>Send a message to start the consultation.</p>}
                                            {messages.map((m, i) => {
                                                const isMyMsg = m.senderRole === 'Patient';
                                                return (
                                                    <div key={i} style={{ 
                                                        alignSelf: isMyMsg ? 'flex-end' : 'flex-start',
                                                        background: isMyMsg ? 'var(--primary-teal)' : '#f0f0f0',
                                                        color: isMyMsg ? 'white' : 'black',
                                                        padding: '10px 15px', borderRadius: '15px', maxWidth: '70%'
                                                    }}>
                                                        {m.text}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                        <form onSubmit={handleSendMessage} style={{ display: 'flex', borderTop: '1px solid #eee', padding: '1rem', background: 'white' }}>
                                            <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type a message..." style={{ flex: 1, padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
                                            <button type="submit" className="btn btn-primary" style={{ marginLeft: '10px' }}>Send</button>
                                        </form>
                                    </div>
                                )}
                            </div>
                        </section>
                    )}

                    {activeTab === 'history' && (
                        <section className="panel-section active">
                            <h2>Medical History</h2>
                            <div className="glass-card">
                                <p>No previous history records found in this hospital.</p>
                            </div>
                        </section>
                    )}

                    {activeTab === 'reports' && (
                        <section className="panel-section active">
                            <h2>Lab Reports</h2>
                            <div className="glass-card">
                                <p>No lab reports available yet.</p>
                            </div>
                        </section>
                    )}
                </main>
            </div>
        </div>
    );
};

export default PatientDashboard;
