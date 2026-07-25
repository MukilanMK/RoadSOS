import React, { useState, useEffect } from 'react';

const AccountTab = ({ onClose, onLogout, radius, setRadius }) => {
  const [userData, setUserData] = useState(null);
  const [newEmail, setNewEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      // Use import.meta.env.VITE_API_URL or fallback to localhost for deployment prep
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch user data');
      const data = await res.json();
      setUserData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addEmail = async (e) => {
    e.preventDefault();
    if (!newEmail) return;
    
    try {
      const token = localStorage.getItem('token');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/auth/distress-emails`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ email: newEmail })
      });
      const data = await res.json();
      if (res.ok) {
        setUserData({...userData, distress_emails: data.distress_emails});
        setNewEmail('');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to add email");
    }
  };

  const removeEmail = async (emailToRemove) => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/auth/distress-emails`, {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ email: emailToRemove })
      });
      const data = await res.json();
      if (res.ok) {
        setUserData({...userData, distress_emails: data.distress_emails});
      }
    } catch (err) {
      setError("Failed to remove email");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content account-modal">
        <button className="close-btn" onClick={onClose}>&times;</button>
        
        <h2>My Account</h2>
        {error && <div className="error-message">{error}</div>}
        
        {loading ? <p>Loading...</p> : (
          userData && (
            <div className="account-details">
              <div className="user-info-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
                <p><strong>Name:</strong><br/>{userData.name}</p>
                <p><strong>Email:</strong><br/>{userData.email}</p>
                <p><strong>Phone:</strong><br/>{userData.phone}</p>
                <p><strong>DOB:</strong><br/>{userData.dob || 'N/A'}</p>
                <p><strong>Age:</strong><br/>{userData.age || 'N/A'}</p>
                <p><strong>Gender:</strong><br/>{userData.gender || 'N/A'}</p>
              </div>

              <div className="settings-section" style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1rem' }}>
                <h3>Search Settings</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <label htmlFor="radiusSlider">Search Radius: <strong>{radius} km</strong></label>
                  <input 
                    id="radiusSlider" 
                    type="range" 
                    min="5" 
                    max="100" 
                    step="5" 
                    value={radius} 
                    onChange={(e) => setRadius(Number(e.target.value))} 
                    style={{ width: '100%' }}
                  />
                </div>
              </div>
              
              <div className="distress-section">
                <h3>Distress Contacts (Emails)</h3>
                <ul className="distress-list">
                  {userData.distress_emails.map(email => (
                    <li key={email}>
                      {email}
                      <button onClick={() => removeEmail(email)} className="remove-btn">&times;</button>
                    </li>
                  ))}
                </ul>
                <form onSubmit={addEmail} className="add-email-form">
                  <input 
                    type="email" 
                    placeholder="Add emergency email" 
                    value={newEmail} 
                    onChange={e => setNewEmail(e.target.value)} 
                    required 
                  />
                  <button type="submit" className="btn btn-primary btn-small">Add</button>
                </form>
              </div>

              <button className="btn btn-logout" onClick={() => {
                localStorage.removeItem('token');
                onLogout();
              }}>Logout</button>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default AccountTab;
