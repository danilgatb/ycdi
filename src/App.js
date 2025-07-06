import React, { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import './App.css';

const firebaseConfig = {
  apiKey: "AIzaSyBnDuRn5UuXkqTvIqL0eKSaqe7U6DIiqZk",
  authDomain: "ycdi-fae5f.firebaseapp.com",
  projectId: "ycdi-fae5f",
  storageBucket: "ycdi-fae5f.appspot.com",
  messagingSenderId: "1018262683569",
  appId: "1:1018262683569:web:f1d17114fedb62418e4790"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();
const storage = firebase.storage();

function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('login'); // 'login', 'home', 'feedback', 'logoutConfirm'
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [split, setSplit] = useState('');
  const [goal, setGoal] = useState('');
  const [photos, setPhotos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [savingGoal, setSavingGoal] = useState(false);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((u) => {
      if (u) {
        setUser(u);
        setPage('home');
        loadUserData(u.uid);
      } else {
        setUser(null);
        setPage('login');
      }
    });
    return () => unsubscribe();
  }, []);

  const loadUserData = async (uid) => {
    const userRef = db.collection('users').doc(uid);
    const doc = await userRef.get();
    if (doc.exists) {
      const data = doc.data();
      setName(data.name || '');
      setSplit(data.split || '');
      setGoal(data.goal || '');
      if(data.photos && Array.isArray(data.photos)) {
        setPhotos(data.photos);
      } else {
        setPhotos([]);
      }
    } else {
      setName('');
      setSplit('');
      setGoal('');
      setPhotos([]);
    }
  };

  // Signup handler
  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    try {
      const cred = await firebase.auth().createUserWithEmailAndPassword(email, password);
      await cred.user.updateProfile({ displayName: name });
      await db.collection('users').doc(cred.user.uid).set({
        name: name,
        split: '',
        goal: '',
        photos: []
      });
      setUser(cred.user);
      setPage('home');
    } catch (err) {
      setError(err.message);
    }
  };

  // Login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
      // onAuthStateChanged will load user data and setPage('home')
    } catch (err) {
      setError(err.message);
    }
  };

  // Logout handler
  const handleLogout = async () => {
    await firebase.auth().signOut();
    setPage('login');
    setUser(null);
    setEmail('');
    setPassword('');
    setName('');
    setSplit('');
    setGoal('');
    setPhotos([]);
  };

  // Save split or goal to Firestore
  const saveGoals = async () => {
    if(!user) return;
    setSavingGoal(true);
    try {
      await db.collection('users').doc(user.uid).set({
        name,
        split,
        goal,
        photos
      }, { merge: true });
      alert('Goals saved!');
    } catch (err) {
      alert('Failed to save: ' + err.message);
    }
    setSavingGoal(false);
  };

  // Upload photo handler
  const handlePhotoUpload = async (e) => {
    if(!user) return;
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const storageRef = storage.ref();
    const photoRef = storageRef.child(`photos/${user.uid}/${Date.now()}_${file.name}`);
    try {
      await photoRef.put(file);
      const url = await photoRef.getDownloadURL();
      const newPhotos = [...photos, url];
      setPhotos(newPhotos);
      await db.collection('users').doc(user.uid).set({ photos: newPhotos }, { merge: true });
    } catch (err) {
      alert('Upload failed: ' + err.message);
    }
    setUploading(false);
  };

  // Delete photo
  const handlePhotoDelete = async (url) => {
    if(!user) return;
    try {
      // Delete from storage
      const photoRef = storage.refFromURL(url);
      await photoRef.delete();
      // Remove from photos array and update Firestore
      const newPhotos = photos.filter(p => p !== url);
      setPhotos(newPhotos);
      await db.collection('users').doc(user.uid).set({ photos: newPhotos }, { merge: true });
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  // Submit feedback
  const submitFeedback = async (e) => {
    e.preventDefault();
    if(!user) {
      alert('You must be logged in to send feedback');
      return;
    }
    if(!feedback.trim()) {
      alert('Please enter feedback');
      return;
    }
    try {
      await db.collection('feedback').add({
        userId: user.uid,
        feedback,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      alert('Thank you for your feedback!');
      setFeedback('');
      setPage('home');
    } catch(err) {
      alert('Failed to send feedback: ' + err.message);
    }
  };

  // Navigation handlers
  const goToFeedback = () => setPage('feedback');
  const goToLogoutConfirm = () => setPage('logoutConfirm');
  const goToHome = () => setPage('home');

  // Render
  if (!user) {
    return (
      <div className="container">
        <div className="frosted-glass">
          <h1>{isLogin ? "Log In" : "Create Account"}</h1>
          <form onSubmit={isLogin ? handleLogin : handleSignup}>
            {!isLogin && (
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            )}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">{isLogin ? "Log In" : "Sign Up"}</button>
          </form>
          {error && <p className="error">{error}</p>}
          <p
            className="toggle"
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
          >
            {isLogin ? "Don’t have an account? Create one" : "Already have an account? Log in"}
          </p>
        </div>
      </div>
    );
  }

  if(page === 'logoutConfirm') {
    return (
      <div className="container">
        <div className="frosted-glass">
          <h1>Log Out</h1>
          <p>Are you sure you want to log out?</p>
          <button onClick={handleLogout}>Yes, Log Out</button>
          <button onClick={goToHome} style={{marginTop: '0.5rem'}}>Cancel</button>
        </div>
      </div>
    );
  }

  if(page === 'feedback') {
    return (
      <div className="container">
        <div className="frosted-glass">
          <h1>Send Feedback</h1>
          <form onSubmit={submitFeedback}>
            <textarea
              placeholder="How would you improve this app?"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={5}
              style={{ width: '100%', marginBottom: '1rem', padding: '0.5rem', fontSize: '1rem' }}
            />
            <button type="submit">Send</button>
            <button type="button" onClick={goToHome} style={{marginTop: '0.5rem'}}>Back to Home</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="frosted-glass">
        <h1>Happy to have you back, {name || user.displayName || user.email} 👋</h1>
        <div style={{ marginBottom: '1rem' }}>
          <label>
            Workout Split:
            <input
              type="text"
              value={split}
              onChange={(e) => setSplit(e.target.value)}
              placeholder="e.g. 3-Day Push/Pull/Legs"
              style={{ marginLeft: '0.5rem', padding: '0.3rem', width: '60%' }}
            />
          </label>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>
            Weekly Goal:
            <input
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g. Workout 4x per week"
              style={{ marginLeft: '0.5rem', padding: '0.3rem', width: '60%' }}
            />
          </label>
        </div>
        <button onClick={saveGoals} disabled={savingGoal} style={{ marginBottom: '1rem' }}>
          {savingGoal ? 'Saving...' : 'Save Goals'}
        </button>

        <h3>Progress Photos</h3>
        {photos.length === 0 && <p>No photos yet.</p>}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {photos.map((url, idx) => (
            <div key={idx} style={{ position: 'relative' }}>
              <img
                src={url}
                alt={`Progress ${idx + 1}`}
                style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8 }}
              />
              <button
                onClick={() => handlePhotoDelete(url)}
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  background: 'rgba(255,0,0,0.7)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0 8px 0 8px',
                  cursor: 'pointer',
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <div style={{ marginTop: '1rem' }}>
          <input
            type="file"
            onChange={handlePhotoUpload}
            disabled={uploading}
            accept="image/*"
          />
          {uploading && <p>Uploading...</p>}
        </div>

        <button onClick={goToFeedback} style={{ marginTop: '1.5rem' }}>
          Send Feedback
        </button>
        <button onClick={goToLogoutConfirm} style={{ marginTop: '1rem', background: '#ccc' }}>
          Log Out
        </button>
      </div>
    </div>
  );
}

export default App;