import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../utils/auth';

const HospitalLogin = () => {
    const [email, setEmail] = useState('admin@hospital.com');
    const [password, setPassword] = useState('admin123');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        loginUser('hospital', email);
        navigate('/hospital-dashboard');
    };

    return (
        <div className="auth-container glass-card" style={{ maxWidth: '450px', margin: '4rem auto', textAlign: 'center' }}>
            <h2><i className="fas fa-hospital"></i> Hospital Admin Portal</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Manage doctors, services, and hospital settings.</p>

            <form onSubmit={handleLogin}>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <input type="email" placeholder="Email Address" required value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="form-group" style={{ marginBottom: '2rem' }}>
                    <input type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Secure Login</button>
                <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    Don't have an account? <br />
                    <span style={{ fontWeight: 500, color: 'var(--primary-teal)' }}>Please contact System Administrator.</span>
                </p>
            </form>
        </div>
    );
};

export default HospitalLogin;
