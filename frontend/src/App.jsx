import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Shared/Navbar';
import Footer from './components/Shared/Footer';
import Home from './pages/Home';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Scan from './components/AI/Scan';
import Results from './components/AI/Results';
import SpecialistDashboard from './components/Specialist/Dashboard';
import ScanHistory from './components/Patient/ScanHistory';
import Awareness from './components/Awareness/Awareness';
import Contact from './components/Contact/Contact';
import './App.css';
import ConsultationPage from './pages/ConsultationPage';
import SpecialistConsultations from './components/Specialist/SpecialistConsultations';
import SpecialistConsultation from './components/Specialist/SpecialistConsultation'; // Add this import

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/scan" element={<Scan />} />
              <Route path="/results" element={<Results />} />
              <Route path="/scan-history" element={<ScanHistory />} />
              <Route path="/specialist/dashboard" element={<SpecialistDashboard />} />
              <Route path="/awareness" element={<Awareness />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/consultations" element={<ConsultationPage/>} />
              <Route path="/specialist/consultations" element={<SpecialistConsultations />} />
              {/* ADD THIS MISSING ROUTE */}
              <Route path="/specialist" element={<SpecialistConsultation />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;