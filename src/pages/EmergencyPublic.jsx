import React from 'react';
import { useNavigate } from 'react-router-dom';

const EmergencyPublic = () => {
    const navigate = useNavigate();

    return (
        <div className="emergency-container" style={{ maxWidth: '800px', margin: '2rem auto', padding: '1rem' }}>
            <div className="emergency-header" style={{ textAlign: 'center', marginBottom: '2rem', color: '#DC2626' }}>
                <h1><i className="fas fa-ambulance"></i> Emergency Response</h1>
                <p style={{ color: '#991B1B', fontWeight: 500 }}>Free Public Access - No Login Required</p>
            </div>

            <div className="glass-card emergency-card" style={{ borderLeft: '5px solid #DC2626', background: '#FEF2F2', marginBottom: '1.5rem', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                <h3><i className="fas fa-phone-alt"></i> 24/7 Emergency Hotlines</h3>
                <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div style={{ textAlign: 'center', padding: '1rem', background: 'white', borderRadius: '8px' }}>
                        <i className="fas fa-ambulance" style={{ fontSize: '2rem', color: '#DC2626', marginBottom: '0.5rem' }}></i>
                        <h4>Ambulance</h4>
                        <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>+92 300 1234567</p>
                        <a href="tel:+923001234567" className="btn btn-sm" style={{ background: '#DC2626', color: 'white', display: 'inline-block', marginTop: '0.5rem' }}>Call Now</a>
                    </div>
                    <div style={{ textAlign: 'center', padding: '1rem', background: 'white', borderRadius: '8px' }}>
                        <i className="fas fa-heart-broken" style={{ fontSize: '2rem', color: '#DC2626', marginBottom: '0.5rem' }}></i>
                        <h4>Cardiac Center</h4>
                        <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Ext 102</p>
                        <a href="tel:102" className="btn btn-sm" style={{ background: '#DC2626', color: 'white', display: 'inline-block', marginTop: '0.5rem' }}>Call Now</a>
                    </div>
                </div>
            </div>


            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                <button className="btn btn-outline" onClick={() => navigate('/')}>Return to Homepage</button>
            </div>
        </div>
    );
};

export default EmergencyPublic;
