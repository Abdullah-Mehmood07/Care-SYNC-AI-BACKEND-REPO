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
                            <Link to="/"><i className="fas fa-home"></i> Welcome Screen</Link>
                            <Link to="/patient-login"><i className="fas fa-user-injured"></i> Patient Portal</Link>
                            <Link to="/pa-login"><i className="fas fa-user-nurse"></i> PA Portal</Link>
                            <Link to="/lab-login"><i className="fas fa-flask"></i> Lab Portal</Link>
                            <Link to="/hospital-login"><i className="fas fa-hospital"></i> Hospital Admin</Link>
                            <Link to="/web-admin"><i className="fas fa-globe"></i> Web Admin</Link>
                            <hr style={{ margin: '5px 0', border: '0', borderTop: '1px solid #eee' }} />
                            <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }}>
                                <i className="fas fa-sign-out-alt"></i> Logout / Reset
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
