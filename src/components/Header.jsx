import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <header>
            <div className="nav-container">
                <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                    <i className="fas fa-heartbeat"></i> CareSync AI
                </div>

                <div className="header-right">
                    <div className="dropdown">
                        <button className="dropbtn"><i className="fas fa-bars"></i> Menu</button>
                        <div className="dropdown-content">
                            <Link to="/"><i className="fas fa-home"></i> HomePage</Link>
                            <Link to="/services"><i className="fas fa-server"></i> Platform Services</Link>
                            <Link to="/login"><i className="fas fa-sign-in-alt"></i> Login</Link>

                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
