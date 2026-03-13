import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../utils/auth';

const WebAdminLogin = () => {
    const [email, setEmail] = useState('admin@caresync.ai');
    const [password, setPassword] = useState('superadmin');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        loginUser('admin', email);
        navigate('/admin-dashboard');
    };

    return (
        <div className="auth-container glass-card" style={{ maxWidth: '450px', margin: '4rem auto', textAlign: 'center' }}>
            <h2><i className="fas fa-user-shield"></i> System Admin Portal</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Manage cities, hospitals, and system settings.</p>
            
            <form onSubmit={handleLogin}>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <input type="email" placeholder="Admin Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="form-group" style={{ marginBottom: '2rem' }}>
                    <input type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Login</button>
            </form>
        </div>
    );
};

export default WebAdminLogin;
