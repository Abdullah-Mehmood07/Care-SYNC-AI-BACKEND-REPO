import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserInfo, logoutUser } from '../utils/auth';

const PADashboard = () => {
    const [activeTab, setActiveTab] = useState('schedule');
    const navigate = useNavigate();
    const userInfo = getUserInfo();
    const [hospitalName, setHospitalName] = useState('Loading...');
    const [appointments, setAppointments] = useState([]);
    
    // Doctor Details State
    const [schedule, setSchedule] = useState({ Mon: true, Tue: true, Wed: true, Thu: true, Fri: true, Sat: false, Sun: false });
    const [dutyStatus, setDutyStatus] = useState('Off Duty');
    
    // Chat States
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        if (!userInfo.token || userInfo.role !== 'PA Admin') {
            navigate('/login');
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

        if (userInfo.doctorId) {
            const fetchDoctorDetails = async () => {
                try {
                    const res = await fetch(`http://localhost:5000/api/doctors/${userInfo.doctorId}`, {
                        headers: { 'Authorization': `Bearer ${userInfo.token}` }
                    });
                    const data = await res.json();
                    if (data && !data.message) {
                        if (data.weeklySchedule && typeof data.weeklySchedule === 'object' && Object.keys(data.weeklySchedule).length > 0) {
                            setSchedule(data.weeklySchedule);
                        }
                        if (data.dutyStatus) setDutyStatus(data.dutyStatus);
                    }
                } catch (error) { 
                    console.error("Failed to fetch doctor details"); 
                }
            };
            fetchDoctorDetails();
        }
    }, [navigate, userInfo]);

    useEffect(() => {
        if (activeTab === 'appointments' && userInfo.doctorId) {
            const fetchAppointments = async () => {
                try {
                    const res = await fetch(`http://localhost:5000/api/appointments/hospital`, {
                        headers: { 'Authorization': `Bearer ${userInfo.token}` }
                    });
                    const data = await res.json();
                    if (Array.isArray(data)) {
                        setAppointments(data);
                    }
                } catch (error) {
                    console.error("Failed to load appointments");
                }
            };
            fetchAppointments();
        } else if (activeTab === 'chats' && userInfo.doctorId) {
            const fetchPatients = async () => {
                try {
                    const res = await fetch(`http://localhost:5000/api/chats/doctor/${userInfo.doctorId}/patients`, {
                        headers: { 'Authorization': `Bearer ${userInfo.token}` }
                    });
                    const data = await res.json();
                    if (Array.isArray(data)) setPatients(data);
                } catch (error) {}
            };
            fetchPatients();
        }
    }, [activeTab, userInfo.token, userInfo.doctorId]);

    // Chat thread loader (polling)
    useEffect(() => {
        if (selectedPatient && userInfo.doctorId) {
            const fetchMessages = async () => {
                try {
                    const res = await fetch(`http://localhost:5000/api/chats/${selectedPatient._id}/${userInfo.doctorId}`, {
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
    }, [selectedPatient, userInfo.token, userInfo.doctorId]);

    const handleUpdateSchedule = async () => {
        if (!userInfo.doctorId) return alert("No doctor assigned to this PA. Please logout and log back in if this is an error.");
        try {
            const res = await fetch(`http://localhost:5000/api/doctors/${userInfo.doctorId}`, {
                method: 'PUT',
                headers: { 
                    'Authorization': `Bearer ${userInfo.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ weeklySchedule: schedule, dutyStatus: dutyStatus })
            });

            if (res.ok) alert(`Schedule updated successfully.`);
            else {
                const err = await res.json();
                alert(`Failed to update schedule: ${err.message}. If this persists, logout and log back in.`);
            }
        } catch (error) { 
            alert("Error occurred updating schedule. Please check your connection or log back in."); 
        }
    };

    const updateAppointmentStatus = async (id, status) => {
        try {
            const res = await fetch(`http://localhost:5000/api/appointments/${id}/status`, {
                method: 'PUT',
                headers: { 
                    'Authorization': `Bearer ${userInfo.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status })
            });

            if (res.ok) {
                setAppointments(appointments.map(app => 
                    app._id === id ? { ...app, status } : app
                ));
                alert(`Appointment ${status} successfully.`);
            } else {
                alert(`Failed to update appointment.`);
            }
        } catch (error) {
           console.error("Failed to update status", error);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedPatient) return;
        try {
            const res = await fetch('http://localhost:5000/api/chats', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${userInfo.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    patientId: selectedPatient._id,
                    doctorId: userInfo.doctorId,
                    text: newMessage
                })
            });
            if (res.ok) {
                setNewMessage('');
                // Fetch gets triggered by interval soon but let's push instantly
                const newMsg = await res.json();
                setMessages([...messages, newMsg]);
            }
        } catch (error) { console.error("Message send failed", error); }
    };

    const handleLogout = () => {
        logoutUser();
        navigate('/');
    };

    const toggleDay = (day) => {
        setSchedule({ ...schedule, [day]: !schedule[day] });
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
                    <div className={`sidebar-item ${activeTab === 'chats' ? 'active' : ''}`} onClick={() => setActiveTab('chats')} style={{ padding: '1rem 2rem', cursor: 'pointer', transition: 'all 0.3s', fontWeight: 500 }}>
                        <i className="fas fa-comments" style={{ marginRight: '10px' }}></i> Patient Chats
                    </div>
                </aside>

                {/* Main Content */}
                <main className="main-panel" style={{ flex: 1, padding: '2rem' }}>
                    {activeTab === 'schedule' && (
                        <section className="panel-section active">
                            <h2>Set Assigned Doctor Schedule</h2>
                            {!userInfo.doctorId ? (
                                <p style={{ color: 'red' }}>No doctor is assigned to your PA profile. Contact Hospital Admin.</p>
                            ) : (
                                <div className="glass-card">
                                    <label>Navigate Availability (Click to Toggle)</label>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px', marginTop: '1rem' }}>
                                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                                            <div key={day} onClick={() => toggleDay(day)} style={{ 
                                                background: schedule[day] ? 'var(--primary-teal)' : 'white', 
                                                color: schedule[day] ? 'white' : 'black', 
                                                padding: '10px', border: '1px solid #eee', textAlign: 'center', borderRadius: '8px', cursor: 'pointer' 
                                            }}>
                                                {day}
                                            </div>
                                        ))}
                                    </div>
                                    <div style={{ marginTop: '1rem' }}>
                                        <label>Duty Status</label>
                                        <select value={dutyStatus} onChange={(e) => setDutyStatus(e.target.value)} style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}>
                                            <option value="On Duty">On Duty</option>
                                            <option value="Off Duty">Off Duty</option>
                                            <option value="In Consultation">In Consultation</option>
                                        </select>
                                    </div>
                                    <button onClick={handleUpdateSchedule} className="btn btn-primary" style={{ marginTop: '1rem' }}>Update Schedule</button>
                                </div>
                            )}
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
                                        {appointments.length > 0 ? (
                                            appointments.map((appt) => (
                                                <tr key={appt._id} style={{ borderBottom: '1px solid #eee' }}>
                                                    <td style={{ padding: '10px' }}>{appt.patientId?.name || appt.patientId?.email || 'Unknown Patient'}</td>
                                                    <td>{appt.doctorId?.name || 'Unknown Doctor'}</td>
                                                    <td>
                                                        {appt.date ? new Date(appt.date).toLocaleDateString() : ''} {appt.timeSlot} <br/>
                                                        <small style={{ color: appt.status === 'Pending' ? '#F59E0B' : (appt.status === 'Confirmed' ? '#10B981' : '#EF4444') }}>Status: {appt.status}</small>
                                                    </td>
                                                    <td>
                                                        {appt.status === 'Pending' && (
                                                            <>
                                                                <button onClick={() => updateAppointmentStatus(appt._id, 'Confirmed')} className="btn btn-primary" style={{ padding: '5px 10px', fontSize: '0.8rem', marginRight: '5px' }}>Approve</button>
                                                                <button onClick={() => updateAppointmentStatus(appt._id, 'Cancelled')} className="btn btn-outline" style={{ padding: '5px 10px', fontSize: '0.8rem' }}>Decline</button>
                                                            </>
                                                        )}
                                                        {appt.status !== 'Pending' && (
                                                            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{appt.status}</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" style={{ padding: '10px', textAlign: 'center' }}>No appointments found.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    )}

                    {activeTab === 'chats' && (
                        <section className="panel-section active">
                            <h2>Patient Queries</h2>
                            <div style={{ display: 'flex', gap: '1rem', minHeight: '400px' }}>
                                <div className="glass-card" style={{ width: '250px', overflowY: 'auto', padding: '1rem 0' }}>
                                    <h4 style={{ paddingLeft: '1rem', marginBottom: '1rem' }}>Active Patients</h4>
                                    {patients.length === 0 && <p style={{ paddingLeft: '1rem', color: '#666' }}>No active chats.</p>}
                                    {patients.map(p => (
                                        <div key={p._id} onClick={() => setSelectedPatient(p)} style={{ 
                                            padding: '10px 1rem', cursor: 'pointer', borderBottom: '1px solid #eee',
                                            background: selectedPatient?._id === p._id ? 'var(--primary-bg)' : 'transparent',
                                            borderLeft: selectedPatient?._id === p._id ? '4px solid var(--primary-teal)' : '4px solid transparent'
                                        }}>
                                            <strong>{p.name}</strong>
                                        </div>
                                    ))}
                                </div>
                                <div className="glass-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 0 }}>
                                    {selectedPatient ? (
                                        <>
                                            <div style={{ padding: '1rem', borderBottom: '1px solid #eee', background: 'var(--primary-bg)' }}>
                                                <strong>Chat with {selectedPatient.name}</strong>
                                            </div>
                                            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                {messages.length === 0 && <p style={{ textAlign: 'center', color: '#888' }}>No messages yet.</p>}
                                                {messages.map((m, i) => {
                                                    const isMyMsg = m.senderRole === 'Doctor' || m.senderRole === 'PA Admin';
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
                                            <form onSubmit={handleSendMessage} style={{ display: 'flex', borderTop: '1px solid #eee', padding: '1rem' }}>
                                                <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type a professional response..." style={{ flex: 1, padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
                                                <button type="submit" className="btn btn-primary" style={{ marginLeft: '10px' }}>Send</button>
                                            </form>
                                        </>
                                    ) : (
                                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
                                            Select a patient to view query.
                                        </div>
                                    )}
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
