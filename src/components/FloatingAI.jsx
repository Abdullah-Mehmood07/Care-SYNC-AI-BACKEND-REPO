import React, { useState, useRef, useEffect } from 'react';

const FloatingAI = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [messages, setMessages] = useState([
        { sender: 'ai', text: 'Hi there! I am your CareSync AI Assistant. How can I help you today?' }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef(null);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        // Reset chat on close for demo purposes
        setTimeout(() => {
            setMessages([{ sender: 'ai', text: 'Hi there! I am your CareSync AI Assistant. How can I help you today?' }]);
        }, 300);
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleOptionClick = (optionText, responseText) => {
        setMessages(prev => [...prev, { sender: 'user', text: optionText }]);
        setIsTyping(true);
        
        setTimeout(() => {
            setIsTyping(false);
            setMessages(prev => [...prev, { sender: 'ai', text: responseText }]);
        }, 1200);
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        setMessages(prev => [...prev, { sender: 'user', text: inputValue }]);
        setInputValue('');
        setIsTyping(true);

        setTimeout(() => {
            setIsTyping(false);
            setMessages(prev => [...prev, { 
                sender: 'ai', 
                text: "I'm a demo AI assistant. In the future, I'll be connected to a real backend to process your request: '" + inputValue + "'." 
            }]);
        }, 1500);
    };

    return (
        <>
            {/* Floating AI Button */}
            <div className="floating-ai" onClick={openModal}>
                <i className="fas fa-robot" style={{ fontSize: '24px' }}></i>
            </div>

            {/* AI Modal Chat Interface */}
            {isModalOpen && (
                <div className="modal" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="modal-content" style={{ display: 'flex', flexDirection: 'column', height: '80vh', maxHeight: '600px', margin: '0', width: '90%', maxWidth: '400px' }}>
                        <div className="modal-header" style={{ flexShrink: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <i className="fas fa-robot" style={{ fontSize: '20px' }}></i>
                                <h3 style={{ margin: 0, color: 'white' }}>CareSync AI</h3>
                            </div>
                            <span className="close" onClick={closeModal} style={{ fontSize: '24px', lineHeight: '20px' }}>&times;</span>
                        </div>
                        
                        <div className="modal-body" style={{ flex: 1, overflowY: 'auto', padding: '15px', display: 'flex', flexDirection: 'column', gap: '15px', background: '#f8fafc' }}>
                            {messages.map((msg, idx) => (
                                <div key={idx} style={{ 
                                    alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                    background: msg.sender === 'user' ? 'var(--primary-teal)' : 'white',
                                    color: msg.sender === 'user' ? 'white' : 'var(--text-main)',
                                    padding: '10px 15px',
                                    borderRadius: msg.sender === 'user' ? '15px 15px 0 15px' : '15px 15px 15px 0',
                                    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                                    maxWidth: '85%',
                                    fontSize: '0.95rem'
                                }}>
                                    {msg.text}
                                </div>
                            ))}
                            
                            {isTyping && (
                                <div style={{ 
                                    alignSelf: 'flex-start',
                                    background: 'white',
                                    padding: '10px 15px',
                                    borderRadius: '15px 15px 15px 0',
                                    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                                    display: 'flex',
                                    gap: '4px'
                                }}>
                                    <span style={{ animation: 'fadeEffect 1s infinite', color: 'var(--primary-teal)' }}>●</span>
                                    <span style={{ animation: 'fadeEffect 1s infinite 0.2s', color: 'var(--primary-teal)' }}>●</span>
                                    <span style={{ animation: 'fadeEffect 1s infinite 0.4s', color: 'var(--primary-teal)' }}>●</span>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {messages.length === 1 && !isTyping && (
                            <div style={{ padding: '10px', background: 'white', borderTop: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <p style={{ margin: '0 0 5px 5px', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Suggested queries:</p>
                                <button className="btn btn-outline" style={{ fontSize: '0.85rem', padding: '8px', justifyContent: 'flex-start' }} 
                                    onClick={() => handleOptionClick('Symptom Checker', 'Please describe your symptoms briefly, and I will check possible causes. (Demo)')}>
                                    <i className="fas fa-stethoscope"></i> Symptom Checker
                                </button>
                                <button className="btn btn-outline" style={{ fontSize: '0.85rem', padding: '8px', justifyContent: 'flex-start' }}
                                    onClick={() => handleOptionClick('Recommend a Doctor', 'I can recommend a doctor based on your current need. Are you looking for a general physician or a specialist? (Demo)')}>
                                    <i className="fas fa-user-md"></i> Recommend a Doctor
                                </button>
                                <button className="btn btn-outline" style={{ fontSize: '0.85rem', padding: '8px', justifyContent: 'flex-start' }}
                                    onClick={() => handleOptionClick('Health Insights & Reports', 'I can summarize your recent lab reports. Which report would you like me to analyze? (Demo)')}>
                                    <i className="fas fa-flask"></i> Health Insights & Reports
                                </button>
                            </div>
                        )}

                        <form onSubmit={handleSendMessage} style={{ display: 'flex', padding: '10px', background: 'white', borderTop: '1px solid #e2e8f0', gap: '10px' }}>
                            <input 
                                type="text" 
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Type a message..."
                                style={{ flex: 1, padding: '10px', borderRadius: '20px', border: '1px solid #cbd5e1', outline: 'none' }}
                            />
                            <button type="submit" className="btn btn-primary" style={{ borderRadius: '50%', width: '40px', height: '40px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <i className="fas fa-paper-plane"></i>
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default FloatingAI;
