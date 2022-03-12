import * as React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import SoundBoard from './SoundBoard';
import SplashScreen from './SplashScreen';
import XSoundUploadForm from './XSoundUploadForm';

function EntryScreen() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/add-sound" element={<XSoundUploadForm />} />
        <Route path="/player" element={<App />} />
        <Route path="/soundboard" element={<SoundBoard />} />
      </Routes>
    </Router>
  );
}
export default EntryScreen;
