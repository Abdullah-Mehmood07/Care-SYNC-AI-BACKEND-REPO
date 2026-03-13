import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [city, setCity] = useState('');
  const [hospital, setHospital] = useState('');
  const [hospitalConfirmed, setHospitalConfirmed] = useState(false);

  const images = ['/assets/slider1.png', '/assets/slider2.png', '/assets/slider3.png'];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [images.length]);

  const handleCityChange = (e) => {
    setCity(e.target.value);
    setHospital('');
  };

  const handleConfirmHospital = () => {
    if (hospital) {
      setHospitalConfirmed(true);
      localStorage.setItem('selectedHospital', hospital);
    }
  };

  return (
    <>
      {!hospitalConfirmed ? (
        <section id="welcome-section" className="hero">
          <h1>Welcome to CareSync AI</h1>
          <p>Your connected multi-hospital healthcare ecosystem. Please select your location to begin.</p>

          <div className="selection-container glass-card">
            <div className="form-group">
              <label htmlFor="city-select" style={{ display: 'block', textAlign: 'left', marginBottom: '0.5rem', fontWeight: '600' }}>Select City</label>
              <select id="city-select" value={city} onChange={handleCityChange}>
                <option value="">-- Choose City --</option>
                <option value="Rawalpindi">Rawalpindi</option>
                <option value="Islamabad">Islamabad</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="hospital-select" style={{ display: 'block', textAlign: 'left', marginBottom: '0.5rem', fontWeight: '600' }}>Select Hospital</label>
              <select id="hospital-select" value={hospital} onChange={(e) => setHospital(e.target.value)} disabled={!city}>
                <option value="">-- First Select City --</option>
                {city === 'Rawalpindi' && (
                  <>
                    <option value="Benazir Bhutto Hospital">Benazir Bhutto Hospital</option>
                    <option value="Holy Family Hospital">Holy Family Hospital</option>
                  </>
                )}
                {city === 'Islamabad' && (
                  <>
                    <option value="PIMS">PIMS</option>
                    <option value="Shifa International">Shifa International</option>
                  </>
                )}
              </select>
            </div>

            <button id="btn-confirm-hospital" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} onClick={handleConfirmHospital} disabled={!hospital}>
              Enter Hospital Portal <i className="fas fa-arrow-right"></i>
            </button>
          </div>
        </section>
      ) : (
        <>
          <section className="hospital-banner text-center" style={{ padding: '1rem 1rem' }}>
            <h2 className="hospital-name-display" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{hospital}</h2>
            <div className="slider-container">
              {images.map((src, index) => (
                <img
                  key={index}
                  src={src}
                  className={`slide ${index === currentSlide ? 'active' : ''}`}
                  alt="Hospital Slider"
                />
              ))}
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', color: 'white', fontSize: '1.5rem', textShadow: '0 2px 4px rgba(0,0,0,0.5)', zIndex: -1 }}>
                Welcome to CareSync AI
              </div>
            </div>

            <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '2rem auto' }}>
              Experience state-of-the-art healthcare services tailored to your needs.
              Book appointments, view reports, and consult with doctors instantly.
            </p>
          </section>

          {/* NOTE: Doctor on call / Public Doctors section REMOVED as requested */}

          <section id="services">
            <div className="text-center">
              <h2>Our Premium Services</h2>
              <div style={{ width: '60px', height: '4px', background: 'var(--primary-teal)', margin: '0.5rem auto' }}></div>
            </div>

            <div className="services-grid">
              <div className="glass-card service-card" onClick={() => navigate('/patient-login')} style={{ cursor: 'pointer' }}>
                <div className="service-icon"><i className="fas fa-user-md"></i></div>
                <h3>Smart Doctor Schedule</h3>
                <p>View real-time doctor availability and duty matrix.</p>
              </div>

              <div className="glass-card service-card" onClick={() => navigate('/emergency-public')} style={{ cursor: 'pointer', border: '1px solid #FECACA' }}>
                <div className="service-icon"><i className="fas fa-ambulance" style={{ color: '#DC2626' }}></i></div>
                <h3>Free Emergency Response</h3>
                <p>Instant access to emergency numbers and doctors. No login required.</p>
              </div>

              <div className="glass-card service-card" onClick={() => navigate('/patient-login')} style={{ cursor: 'pointer' }}>
                <div className="service-icon"><i className="fas fa-robot"></i></div>
                <h3>AI Health Assistant</h3>
                <p>Get smart recommendations for your symptoms.</p>
              </div>

              <div className="glass-card service-card" onClick={() => navigate('/patient-login')} style={{ cursor: 'pointer' }}>
                <div className="service-icon"><i className="fas fa-flask"></i></div>
                <h3>Smart Lab Reports</h3>
                <p>Instant SMS/Email alerts for your test results.</p>
              </div>
            </div>
          </section>

          <section className="testimonials-section">
            <div className="text-center">
              <h2>Patient Stories</h2>
              <p style={{ color: 'var(--text-muted)' }}>What our community says about us.</p>
            </div>
            <div className="testimonial-grid">
              <div className="testimonial-card">
                <p>"The AI Doctor Recommender saved me so much time. I was directed to Dr. Fatima immediately and got treated within an hour!"</p>
                <div className="testimonial-author"><i className="fas fa-user-circle"></i> Mrs. Zoya Khan</div>
              </div>
              <div className="testimonial-card">
                <p>"Booking an appointment for my father was seamless. The queue tracker let us arrive just in time."</p>
                <div className="testimonial-author"><i className="fas fa-user-circle"></i> Mr. Ali Raza</div>
              </div>
              <div className="testimonial-card">
                <p>"Clean interface and very easy to check lab reports online. Highly recommended!"</p>
                <div className="testimonial-author"><i className="fas fa-user-circle"></i> Ms. Hina Shah</div>
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
};

export default Home;
