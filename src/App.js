import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import customTheme from './theme/CustomTheme';
import './App.css';

// Importar páginas desarrolladas
import Profile from './pages/Profile';
import Analytics from './pages/Analytics';
import Projects from './pages/Projects';
import Team from './pages/Team';
import Settings from './pages/Settings';
import DashboardAPI from './pages/DashboardAPI';

function App() {
  return (
    <ThemeProvider theme={customTheme}>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            {/* Ruta principal - Dashboard */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            
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
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App; 