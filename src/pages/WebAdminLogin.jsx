import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../utils/auth';

const WebAdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            const res = await fetch('http://localhost:5000/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (res.ok) {
                // Security check: Ensure they are actually a Web Admin
                if (data.role !== 'Web Admin') {
                    setError('Access Denied: You do not have Web Admin privileges.');
                    return;
                }
                
                loginUser(data); // Save real JWT and info to auth.js
                navigate('/admin-dashboard');
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError('Failed to connect to the server. Is the backend running?');
        }
    };

    return (
        <div className="auth-container glass-card" style={{ maxWidth: '450px', margin: '4rem auto', textAlign: 'center' }}>
            <h2><i className="fas fa-user-shield"></i> System Admin Portal</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Manage cities, hospitals, and system settings.</p>
            
            {error && <div style={{ color: 'red', marginBottom: '1rem', padding: '10px', background: '#ffebee', borderRadius: '5px' }}>{error}</div>}

            <form onSubmit={handleLogin}>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <input type="email" placeholder="Admin Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="form-group" style={{ marginBottom: '2rem' }}>
                    <input type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Secure Login</button>
            </form>
        </div>
    );
};

export default WebAdminLogin;
