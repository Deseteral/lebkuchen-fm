import * as React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { AdminPanel } from './admin/components/AdminPanel';
import { FmPlayer } from './fm-player/components/FmPlayer';
import { SoundBoard } from './sound-board/components/SoundBoard';
import { SplashScreen } from './splash-screen/components/SplashScreen';
import { XSoundUploadForm } from './xsound-upload-form/components/XSoundUploadForm';
import { checkLoginStateAndRedirect } from './services/user-account-service';
import { LoginForm } from './login/components/LoginForm';
import './styles.css';

function App() {
  React.useEffect(() => {
    checkLoginStateAndRedirect();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/add-sound" element={<XSoundUploadForm />} />
        <Route path="/player" element={<FmPlayer />} />
        <Route path="/soundboard" element={<SoundBoard />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/login" element={<LoginForm />} />
      </Routes>
    </Router>
  );
}

const root = createRoot(document.getElementById('app')!);
root.render(<App />);
