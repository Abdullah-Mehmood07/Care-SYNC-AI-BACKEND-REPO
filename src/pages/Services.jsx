import React from 'react';

const Services = () => {
    return (
        <div style={{ padding: '2rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
            {/* Hero Section */}
            <section className="text-center" style={{ marginBottom: '4rem' }}>
                <h1 style={{ fontSize: '3rem', color: 'var(--text-h)', marginBottom: '1rem' }}>
                    Empowering Your Health Journey
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '800px', margin: '0 auto' }}>
                    CareSync AI is an innovative platform offering you complete control over your healthcare experience. Discover how our smart tools, wide-reaching network, and AI-driven features can seamlessly support your wellness.
                </p>
                <div style={{ width: '80px', height: '4px', background: 'var(--primary-teal)', margin: '2rem auto' }}></div>
            </section>

            {/* Core Features Grid */}
            <section className="services-grid" style={{ marginBottom: '4rem' }}>
                
                {/* Multi-Hospital Access */}
                <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ fontSize: '2.5rem', color: 'var(--primary-teal)' }}>
                        <i className="fas fa-hospital-user"></i>
                    </div>
                    <h3 style={{ fontSize: '1.5rem', margin: 0 }}>Unified Hospital Network</h3>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
                        Why limit yourself to a single facility? With our platform, you gain instantaneous access to a broad ecosystem of hospitals. Search for specialists, view facility ratings, and choose the perfect medical center that suits your exact needs, all logged under your single unified account.
                    </p>
                </div>

                {/* AI Health Assistant */}
                <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ fontSize: '2.5rem', color: 'var(--primary-teal)' }}>
                        <i className="fas fa-robot"></i>
                    </div>
                    <h3 style={{ fontSize: '1.5rem', margin: 0 }}>AI Health Assistant</h3>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
                        Experiencing mild symptoms and unsure what to do? Our 24/7 AI Health Assistant helps triage your conditions. By asking a few simple questions, it provides instant preliminary advice and intelligently recommends the right type of specialist you should consult, saving you valuable time.
                    </p>
                </div>

                {/* Secure Medical Records */}
                <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ fontSize: '2.5rem', color: 'var(--primary-teal)' }}>
                        <i className="fas fa-folder-open"></i>
                    </div>
                    <h3 style={{ fontSize: '1.5rem', margin: 0 }}>Centralized Medical Records</h3>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
                        Say goodbye to carrying around physical test results. The platform centralizes your lab reports, prescriptions, and medical history. Whenever a hospital uploads a new blood test or scan, you get an instant SMS or Email notification and can view it securely from anywhere in the world.
                    </p>
                </div>

                {/* Smart Doctor Scheduling */}
                <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ fontSize: '2.5rem', color: 'var(--primary-teal)' }}>
                        <i className="fas fa-calendar-check"></i>
                    </div>
                    <h3 style={{ fontSize: '1.5rem', margin: 0 }}>Smart Doctor Scheduling</h3>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
                        We put the control in your hands by providing real-time visibility into doctor availability matrices. Check exactly when a doctor is on duty, view live queue times, and book your appointment instantly to avoid sitting in crowded waiting rooms.
                    </p>
                </div>

                {/* Instant Emergency Response */}
                <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ fontSize: '2.5rem', color: '#DC2626' }}>
                        <i className="fas fa-ambulance"></i>
                    </div>
                    <h3 style={{ fontSize: '1.5rem', margin: 0 }}>Expedited Emergency Protocol</h3>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
                        In times of crisis, every second counts. The platform offers a specialized emergency portal that bypasses standard login requirements to instantly dispatch or search for critical care units based on your geo-location and immediately connects you to emergency hotlines.
                    </p>
                </div>

                {/* Future Proof Expansion */}
                <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ fontSize: '2.5rem', color: 'var(--primary-teal)' }}>
                        <i className="fas fa-rocket"></i>
                    </div>
                    <h3 style={{ fontSize: '1.5rem', margin: 0 }}>Continuous Care Innovation</h3>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
                        CareSync AI is an evolving platform. We ensure that you receive the absolute best user experience by continually shipping modernized features such as telemedicine integration pathways, pharmaceutical tracking, and predictive healthcare analytics.
                    </p>
                </div>

            </section>
        </div>
    );
};

export default Services;
