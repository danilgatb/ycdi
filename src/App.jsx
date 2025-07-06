import React, { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

import Home from './components/Home';
import Workout from './components/Workout';
import ProgressPhotos from './components/ProgressPhotos';
import Goals from './components/Goals';
import Library from './components/Library';
import Feedback from './components/Feeback';
import Settings from './components/Settings';
import Login from './components/Login';
import Signup from './components/Signup';
import LogoutConfirm from './components/LogoutConfirm';
import Tabs from './components/Tabs';

// Your Firebase config here
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

const pagesWithTabs = [
  'home',
  'workout',
  'progressPhotos',
  'goals',
  'library',
  'feedback',
  'settings',
];

export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('login'); // login, signup, logoutConfirm, + pagesWithTabs
  const [isLogin, setIsLogin] = useState(true);

  const [userData, setUserData] = useState({
    name: '',
    split: '',
    goals: '',
    photos: [],
  });

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(async (u) => {
      if (u) {
        setUser(u);
        setPage('home');
        // Load user data from Firestore
        const doc = await db.collection('users').doc(u.uid).get();
        if (doc.exists) {
          setUserData(doc.data());
        } else {
          setUserData({ name: u.displayName || '', split: '', goals: '', photos: [] });
        }
      } else {
        setUser(null);
        setPage('login');
      }
    });
    return () => unsubscribe();
  }, []);

  const onLoginSuccess = (userData) => {
    setUserData(userData);
    setPage('home');
  };

  // Show Tabs only on these pages
  const showTabs = pagesWithTabs.includes(page) && user;

  return (
    <div className="app-container">
      {page === 'login' && (
        <Login
          onSwitch={() => { setIsLogin(false); setPage('signup'); }}
          onLogin={() => setPage('home')}
          firebaseAuth={firebase.auth()}
        />
      )}
      {page === 'signup' && (
        <Signup
          onSwitch={() => { setIsLogin(true); setPage('login'); }}
          onSignup={() => setPage('home')}
          firebaseAuth={firebase.auth()}
          db={db}
        />
      )}
      {page === 'logoutConfirm' && (
        <LogoutConfirm
          onCancel={() => setPage('home')}
          onConfirm={async () => {
            await firebase.auth().signOut();
            setUser(null);
            setPage('login');
          }}
        />
      )}

      {showTabs && (
        <>
          {page === 'home' && (
            <Home user={user} userData={userData} setUserData={setUserData} db={db} />
          )}
          {page === 'workout' && (
            <Workout user={user} userData={userData} setUserData={setUserData} db={db} />
          )}
          {page === 'progressPhotos' && (
            <ProgressPhotos user={user} userData={userData} setUserData={setUserData} db={db} storage={storage} />
          )}
          {page === 'goals' && (
            <Goals user={user} userData={userData} setUserData={setUserData} db={db} />
          )}
          {page === 'library' && <Library />}
          {page === 'feedback' && (
            <Feedback user={user} db={db} onBack={() => setPage('home')} />
          )}
          {page === 'settings' && (
            <Settings user={user} firebaseAuth={firebase.auth()} db={db} onLogout={() => setPage('login')} />
          )}
          <Tabs currentPage={page} onTabChange={setPage} />
        </>
      )}
    </div>
  );
}