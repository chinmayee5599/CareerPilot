import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ResumeEngine from './pages/ResumeEngine';
import CareerMatch from './pages/CareerMatch';
import InterviewSimulator from './pages/InterviewSimulator';
import LearningRoadmap from './pages/LearningRoadmap';
import Analytics from './pages/Analytics';
import SettingsPage from './pages/Settings';
import NotificationsPage from './pages/Notifications';
import Auth from './pages/Auth';
import AIChatWidget from './components/AIChatWidget';

function App() {
  return (
    <BrowserRouter>
      <AIChatWidget />
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/resume" element={<ResumeEngine />} />
          <Route path="/career" element={<CareerMatch />} />
          <Route path="/interview" element={<InterviewSimulator />} />
          <Route path="/roadmap" element={<LearningRoadmap />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
