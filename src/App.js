import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import ThemeProvider from './theme/ThemeProvider';
import ThemeSelector from './components/ThemeSelector';
import './App.css';

// Importar páginas desarrolladas
import Profile from './pages/Profile';
import Analytics from './pages/Analytics';
import Projects from './pages/Projects';
import Team from './pages/Team';
import Settings from './pages/Settings';
import DashboardAPI from './pages/DashboardAPI';
import CryptoDashboard from './pages/CryptoDashboard';
import CryptoPortfolio from './pages/CryptoPortfolio';
import CryptoNews from './pages/CryptoNews';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Layout>
          <Routes>
            {/* Ruta principal - Dashboard */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* Nueva ruta para Crypto Dashboard */}
            <Route path="/crypto" element={<CryptoDashboard />} />
            
            {/* Nueva ruta para Portfolio Crypto */}
            <Route path="/portfolio" element={<CryptoPortfolio />} />
            
            {/* Nueva ruta para Noticias Crypto */}
            <Route path="/news" element={<CryptoNews />} />
            
            {/* Rutas adicionales */}
            <Route path="/profile" element={<Profile />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/team" element={<Team />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/dashboard-api" element={<DashboardAPI />} />
            
            {/* Ruta por defecto - redirige al dashboard */}
            <Route path="*" element={<Dashboard />} />
          </Routes>
          
          {/* Selector de temas flotante */}
          <ThemeSelector />
          
          {/* Toaster para notificaciones */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'rgba(0,0,0,0.8)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '10px',
                backdropFilter: 'blur(10px)'
              }
            }}
          />
        </Layout>
      </Router>
    </ThemeProvider>
  </AuthProvider>
  );
}

export default App; 