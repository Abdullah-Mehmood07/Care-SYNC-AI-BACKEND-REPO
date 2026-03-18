import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../utils/auth';

const LabLogin = () => {
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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
                // Security check
                if (data.role !== 'Lab Admin') {
                    setError('Access Denied: You are not authorized as a Lab Administrator.');
                    return;
                }
                
                loginUser(data);
                navigate('/lab-dashboard');
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError('Failed to connect to the server.');
        }
    };

    return (
        <div className="auth-container glass-card" style={{ maxWidth: '450px', margin: '4rem auto', textAlign: 'center' }}>
            <h2 id="form-title">Lab Operator Portal</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                Manage test requests and upload reports.
            </p>

            {error && <div style={{ color: 'red', marginBottom: '1rem', padding: '10px', background: '#ffebee', borderRadius: '5px' }}>{error}</div>}

                <form onSubmit={handleLogin}>
                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                        <input type="email" placeholder="Email Address" required value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="form-group" style={{ marginBottom: '2rem' }}>
                        <input type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Secure Login</button>
                    <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                        Need an account? <br/>
                        <span style={{ fontWeight: 600, color: 'var(--primary-teal)' }}>Contact your Hospital Administrator.</span>
                    </p>
                </form>
        </div>
    );
};

export default LabLogin;
