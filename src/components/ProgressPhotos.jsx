import React, { useState, useEffect } from 'react';

export default function ProgressPhotos({ user, userData, setUserData, db, storage }) {
  const [photos, setPhotos] = useState(userData.photos || []);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setPhotos(userData.photos || []);
  }, [userData.photos]);

  const uploadPhoto = async (e) => {
    if (!user) return;
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const storageRef = storage.ref();
      const photoRef = storageRef.child(`photos/${user.uid}/${Date.now()}_${file.name}`);
      await photoRef.put(file);
      const url = await photoRef.getDownloadURL();
      const updatedPhotos = [...photos, url];
      setPhotos(updatedPhotos);
      await db.collection('users').doc(user.uid).set({ photos: updatedPhotos }, { merge: true });
      setUserData(prev => ({ ...prev, photos: updatedPhotos }));
    } catch (err) {
      alert('Upload failed: ' + err.message);
    }
    setUploading(false);
  };

  const deletePhoto = async (url) => {
    if (!user) return;
    try {
      const photoRef = storage.refFromURL(url);
      await photoRef.delete();
      const updatedPhotos = photos.filter((photo) => photo !== url);
      setPhotos(updatedPhotos);
      await db.collection('users').doc(user.uid).set({ photos: updatedPhotos }, { merge: true });
      setUserData(prev => ({ ...prev, photos: updatedPhotos }));
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  return (
    <div className="page-container">
      <h1>Progress Photos</h1>
      <input type="file" accept="image/*" onChange={uploadPhoto} disabled={uploading} />
      {uploading && <p>Uploading...</p>}
      {photos.length === 0 && <p>No progress photos yet.</p>}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '1rem' }}>
        {photos.map((url, idx) => (
          <div key={idx} style={{ position: 'relative' }}>
            <img
              src={url}
              alt={`Progress ${idx + 1}`}
              style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 8 }}
            />
            <button
              onClick={() => deletePhoto(url)}
              style={{
                position: 'absolute',
                top: 2,
                right: 2,
                background: 'rgba(255,0,0,0.7)',
                border: 'none',
                borderRadius: '0 8px 0 8px',
                color: 'white',
                cursor: 'pointer',
                padding: '2px 6px',
                fontWeight: 'bold',
              }}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}