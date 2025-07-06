
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
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [split, setSplit] = useState('');
  const [goal, setGoal] = useState('');
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((u) => {
      if (u) {
        setUser(u);
        const userRef = db.collection('users').doc(u.uid);
        userRef.get().then(doc => {
          if (doc.exists) {
            const data = doc.data();
            setName(data.name || '');
            setSplit(data.split || '');
            setGoal(data.goal || '');
          }
        });
      } else {
        setUser(null);
      }
    });
  }, []);

  const handleSignup = (e) => {
    e.preventDefault();
    setError('');
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((cred) => {
        cred.user.updateProfile({ displayName: name });
        return db.collection('users').doc(cred.user.uid).set({
          name: name,
          split: '',
          goal: '',
          photos: []
        });
      })
      .catch(err => setError(err.message));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    firebase.auth().signInWithEmailAndPassword(email, password)
      .catch(err => setError(err.message));
  };

  const handleLogout = () => {
    firebase.auth().signOut();
  };

  if (user) {
    return (
      <div className="container">
        <div className="frosted-glass">
          <h1>Happy to have you back, {name || user.displayName || user.email} 👋</h1>
          <h2>{split ? `You're doing: ${split} Split` : 'No split set yet.'}</h2>
          <h3>{goal ? `Weekly Goal: ${goal}` : 'No weekly goal set yet.'}</h3>
          <div>
            <h3>Progress Photos</h3>
            {photos.length === 0 && <p>No photos yet.</p>}
          </div>
          <button onClick={handleLogout}>Log Out</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="frosted-glass">
        <h1>{isLogin ? "Log In" : "Create Account"}</h1>
        <form onSubmit={isLogin ? handleLogin : handleSignup}>
          {!isLogin && (
            <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
          )}
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit">{isLogin ? "Log In" : "Sign Up"}</button>
        </form>
        {error && <p className="error">{error}</p>}
        <p className="toggle" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Don’t have an account? Create one" : "Already have an account? Log in"}
        </p>
      </div>
    </div>
  );
}

export default App;
