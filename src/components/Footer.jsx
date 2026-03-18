import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer style={{ background: 'var(--white)', padding: '3rem 1rem', marginTop: '4rem', borderTop: '1px solid #E2E8F0' }}>
            <div className="nav-container" style={{ flexWrap: 'wrap', gap: '2rem', alignItems: 'start' }}>
                <div style={{ flex: 1, minWidth: '250px' }}>
                    <h3 className="hospital-name-display">CareSync AI</h3>
                    <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>
                        Revolutionizing healthcare management with AI-driven solutions.
                    </p>
                </div>
                <div style={{ flex: 1, minWidth: '250px' }}>
                    <h4>Contact Us</h4>
                    <ul style={{ color: 'var(--text-muted)', listStyle: 'none', padding: 0 }}>
                        <li><i className="fas fa-phone"></i> +92 123 4567890</li>
                        <li><i className="fas fa-envelope"></i> info@caresync.ai</li>
                        <li><i className="fas fa-map-marker-alt"></i> <span className="hospital-name-display">Selected Hospital</span></li>
                    </ul>
                </div>
                <div style={{ flex: 1, minWidth: '250px' }}>
                    <h4>Quick Links</h4>
                    <ul style={{ color: 'var(--text-muted)', listStyle: 'none', padding: 0 }}>
                        <li style={{ marginBottom: '0.5rem' }}><a href="/#services">Our Services</a></li>
                        <li style={{ marginBottom: '0.5rem' }}><Link to="/">About Us</Link></li>
                        <li style={{ marginBottom: '0.5rem' }}><Link to="/patient-login">Patient Portal</Link></li>
                        <li style={{ marginBottom: '0.5rem' }}><Link to="/lab-login">Lab Portal</Link></li>
                        <li style={{ marginBottom: '0.5rem' }}><Link to="/pa-login">Doctor PA Portal</Link></li>
                        <li style={{ marginBottom: '0.5rem' }}><Link to="/hospital-login">Hospital Admin Portal</Link></li>
                        <li style={{ marginBottom: '0.5rem' }}><Link to="/web-admin">Web Admin Portal</Link></li>
                    </ul>
                </div>
            </div>
            <div className="text-center" style={{ marginTop: '3rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                &copy; 2026 CareSync AI. All Rights Reserved.
            </div>
        </footer>
    );
};

export default Footer;
