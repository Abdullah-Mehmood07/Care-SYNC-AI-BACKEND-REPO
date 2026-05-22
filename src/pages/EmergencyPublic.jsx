import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api';

const EmergencyPublic = () => {
    const navigate = useNavigate();
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hospitalId] = useState(localStorage.getItem('selectedHospitalId') || '');
    const [hospitalName] = useState(localStorage.getItem('selectedHospitalName') || '');

    useEffect(() => {
        if (!hospitalId) {
            setLoading(false);
            return;
        }

        const fetchEmergencyDoctors = async () => {
            try {
                const res = await fetch(`${API_URL}/doctors/public/emergency/${hospitalId}`);
                const data = await res.json();
                if (Array.isArray(data)) {
                    setDoctors(data);
                }
            } catch (error) {
                console.error("Error fetching emergency doctors:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEmergencyDoctors();
    }, [hospitalId]);

    return (
        <div className="emergency-container" style={{ maxWidth: '850px', margin: '2rem auto', padding: '1rem' }}>
            <div className="emergency-header" style={{ textAlign: 'center', marginBottom: '2rem', color: '#DC2626' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}><i className="fas fa-ambulance"></i> CareSync AI Emergency Response</h1>
                <p style={{ color: '#991B1B', fontWeight: 600, fontSize: '1.1rem', marginTop: '0.5rem' }}>
                    <i className="fas fa-shield-alt"></i> Public Access Portal — Direct Hospital Emergency Lines
                </p>
                {hospitalName && (
                    <div className="hospital-badge" style={{ display: 'inline-block', padding: '0.4rem 1.2rem', background: '#FEE2E2', border: '1px solid #FCA5A5', color: '#B91C1C', borderRadius: '20px', fontWeight: 'bold', marginTop: '0.8rem' }}>
                        <i className="fas fa-hospital"></i> Connected Facility: {hospitalName}
                    </div>
                )}
            </div>

            {!hospitalId ? (
                <div className="glass-card" style={{ borderLeft: '5px solid #F59E0B', background: '#FEF3C7', padding: '1.5rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem', textAlign: 'center' }}>
                    <i className="fas fa-exclamation-triangle" style={{ fontSize: '2.5rem', color: '#D97706', marginBottom: '0.8rem' }}></i>
                    <h3 style={{ color: '#92400E' }}>No Facility Selected</h3>
                    <p style={{ color: '#B45309', margin: '0.5rem 0 1.2rem' }}>To view specific on-duty doctor extensions and local ambulance direct lines, you must select a hospital first.</p>
                    <button className="btn btn-primary" onClick={() => navigate('/')} style={{ background: '#D97706', border: 'none' }}>
                        Go to Facility Selection
                    </button>
                </div>
            ) : (
                <>
                    {/* Hotlines */}
                    <div className="glass-card emergency-card" style={{ borderLeft: '5px solid #DC2626', background: '#FEF2F2', marginBottom: '2rem', padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
                        <h3 style={{ color: '#991B1B', fontSize: '1.4rem' }}><i className="fas fa-phone-alt"></i> Primary 24/7 Hotlines</h3>
                        <p style={{ color: '#7F1D1D', marginBottom: '1rem' }}>Instant emergency response services for {hospitalName}.</p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                            <div style={{ textAlign: 'center', padding: '1.2rem', background: 'white', borderRadius: '8px', border: '1px solid #FEE2E2', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                                <i className="fas fa-ambulance" style={{ fontSize: '2rem', color: '#DC2626', marginBottom: '0.5rem' }}></i>
                                <h4 style={{ color: '#111827' }}>Ambulance Dispatch</h4>
                                <p style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#DC2626', margin: '0.3rem 0' }}>+92 300 1234567</p>
                                <a href="tel:+923001234567" className="btn btn-sm" style={{ background: '#DC2626', color: 'white', display: 'inline-block', marginTop: '0.5rem', width: '80%' }}>Call Now</a>
                            </div>
                            <div style={{ textAlign: 'center', padding: '1.2rem', background: 'white', borderRadius: '8px', border: '1px solid #FEE2E2', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                                <i className="fas fa-heartbeat" style={{ fontSize: '2rem', color: '#DC2626', marginBottom: '0.5rem' }}></i>
                                <h4 style={{ color: '#111827' }}>Emergency ER desk</h4>
                                <p style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#DC2626', margin: '0.3rem 0' }}>Ext 102</p>
                                <a href="tel:102" className="btn btn-sm" style={{ background: '#DC2626', color: 'white', display: 'inline-block', marginTop: '0.5rem', width: '80%' }}>Call Now</a>
                            </div>
                        </div>
                    </div>

                    {/* Doctors On Duty */}
                    <div className="glass-card" style={{ borderLeft: '5px solid #2563EB', background: '#EFF6FF', padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
                        <h3 style={{ color: '#1E40AF', fontSize: '1.4rem', marginBottom: '0.5rem' }}>
                            <i className="fas fa-user-md"></i> Doctors Currently On Duty
                        </h3>
                        <p style={{ color: '#1E3A8A', marginBottom: '1.2rem' }}>Direct room and emergency extension numbers for doctors on active shift right now.</p>
                        
                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '2rem' }}>
                                <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', color: '#2563EB' }}></i>
                                <p style={{ color: '#6B7280', marginTop: '0.5rem' }}>Fetching shifts...</p>
                            </div>
                        ) : doctors.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '2rem', background: 'white', borderRadius: '8px', border: '1px solid #DBEAFE' }}>
                                <i className="fas fa-user-slash" style={{ fontSize: '2rem', color: '#9CA3AF', marginBottom: '0.5rem' }}></i>
                                <p style={{ color: '#4B5563', fontWeight: 500 }}>No on-duty doctors registered for today.</p>
                                <p style={{ color: '#9CA3AF', fontSize: '0.9rem' }}>Please contact the main dispatch desk above for ER help.</p>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                                {doctors.map(doc => (
                                    <div key={doc._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'white', borderRadius: '8px', border: '1px solid #DBEAFE', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                                        <div>
                                            <h4 style={{ margin: 0, color: '#1F2937', fontWeight: 'bold' }}>{doc.name}</h4>
                                            <p style={{ margin: '0.2rem 0', color: '#2563EB', fontSize: '0.9rem', fontWeight: 600 }}>{doc.specialty}</p>
                                            <span style={{ fontSize: '0.8rem', background: '#DEF7EC', color: '#03543F', padding: '0.1rem 0.5rem', borderRadius: '10px', fontWeight: 'bold' }}>
                                                <i className="fas fa-circle" style={{ fontSize: '0.6rem', marginRight: '0.3rem' }}></i>On Duty
                                            </span>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: '0.8rem', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Emergency Ext</div>
                                            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#DC2626', margin: '0.1rem 0 0.3rem' }}>
                                                {doc.emergencyExtension || 'None'}
                                            </div>
                                            {doc.emergencyExtension && (
                                                <a href={`tel:${doc.emergencyExtension}`} className="btn btn-sm btn-primary" style={{ background: '#2563EB', border: 'none', padding: '0.2rem 0.6rem', fontSize: '0.8rem' }}>
                                                    <i className="fas fa-phone-alt"></i> Call
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}

            <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
                <button className="btn btn-outline" onClick={() => navigate('/')} style={{ padding: '0.6rem 1.5rem', border: '1px solid #D1D5DB' }}>
                    <i className="fas fa-home"></i> Back to Homepage
                </button>
            </div>
        </div>
    );
};

export default EmergencyPublic;
