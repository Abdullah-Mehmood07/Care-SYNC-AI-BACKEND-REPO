import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../utils/auth';

const Login = () => {
  const [mode, setMode] = useState('login'); // login or register
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [nationalId, setNationalId] = useState(''); // Required for Patient registration
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
            localStorage.setItem('caresync_user_name', data.email.split('@')[0]);
            loginUser(data);
            
            // Redirect based on role
            switch (data.role) {
                case 'Patient':
                    navigate('/patient-dashboard');
                    break;
                case 'Web Admin':
                    navigate('/admin-dashboard');
                    break;
                case 'Hospital Admin':
                    navigate('/hospital-dashboard');
                    break;
                case 'Lab Admin':
                    navigate('/lab-dashboard');
                    break;
                case 'PA Admin':
                    navigate('/pa-dashboard');
                    break;
                default:
                    navigate('/'); // Fallback
                    break;
            }
        } else {
            setError(data.message || 'Login failed');
        }
    } catch (err) {
        setError('Failed to connect to the server.');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    try {
        const res = await fetch('http://localhost:5000/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              name,
              email, 
              password, 
              role: 'Patient', 
              national_id: nationalId 
            })
        });

        const data = await res.json();

        if (res.ok) {
            localStorage.setItem('caresync_user_name', data.name || name || data.email.split('@')[0]);
            loginUser(data);
            alert(`Registration successful! Your Global Health ID is: ${data.ghid}`);
            navigate('/patient-dashboard');
        } else {
            setError(data.message || 'Registration failed');
        }
    } catch (err) {
        setError('Failed to connect to the server.');
    }
  };

  return (
    <div className="auth-container glass-card" style={{ maxWidth: '450px', margin: '4rem auto', textAlign: 'center' }}>
      <h2 id="form-title">{mode === 'login' ? 'Login Portal' : 'Patient Registration'}</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
        {mode === 'login' ? 'Access your dashboard' : 'Create a patient account to access your health records.'}
      </p>

      {error && <div style={{ color: 'red', marginBottom: '1rem', padding: '10px', background: '#ffebee', borderRadius: '5px' }}>{error}</div>}

      {mode === 'login' ? (
        <form onSubmit={handleLogin}>
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <input
              type="email"
              placeholder="Email Address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Secure Login</button>
          <p style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
            New patient?{' '}
            <span role="button" tabIndex={0} onClick={() => setMode('register')} style={{ color: 'var(--primary-teal)', fontWeight: '600', cursor: 'pointer' }}>
              Register Here
            </span>
          </p>
        </form>
      ) : (
        <form onSubmit={handleRegister}>
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <input
              type="text"
              placeholder="Full Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <input
              type="text"
              placeholder="National ID (13 Digits - No Dashes)"
              required
              pattern="\d{13}"
              title="Please enter exactly 13 numeric digits without any dashes or alphabets."
              maxLength="13"
              value={nationalId}
              onChange={(e) => setNationalId(e.target.value)}
            />
          </div>
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <input
              type="email"
              placeholder="Email Address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <input
              type="password"
              placeholder="Create Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Create Account</button>
          <p style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
            Already have an account?{' '}
            <span role="button" tabIndex={0} onClick={() => setMode('login')} style={{ color: 'var(--primary-teal)', fontWeight: '600', cursor: 'pointer' }}>
              Login Here
            </span>
          </p>
        </form>
      )}
    </div>
  );
};

export default Login;
