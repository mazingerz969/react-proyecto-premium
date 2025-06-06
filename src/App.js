import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import './App.css';

// Crear tema personalizado
const theme = createTheme({
  palette: {
    primary: {
      main: '#667eea',
    },
    secondary: {
      main: '#764ba2',
    },
    background: {
      default: 'transparent',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 12,
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backdropFilter: 'blur(10px)',
          background: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        },
      },
    },
  },
});

// Componentes de página placeholder para las rutas adicionales
const ProfilePage = () => (
  <div style={{ color: 'white', textAlign: 'center', padding: '2rem' }}>
    <h1>👤 Mi Perfil</h1>
    <p>Página de perfil premium en construcción...</p>
  </div>
);

const AnalyticsPage = () => (
  <div style={{ color: 'white', textAlign: 'center', padding: '2rem' }}>
    <h1>📊 Analytics</h1>
    <p>Dashboard de analytics premium en construcción...</p>
  </div>
);

const ProjectsPage = () => (
  <div style={{ color: 'white', textAlign: 'center', padding: '2rem' }}>
    <h1>🚀 Proyectos</h1>
    <p>Gestión de proyectos premium en construcción...</p>
  </div>
);

const TeamPage = () => (
  <div style={{ color: 'white', textAlign: 'center', padding: '2rem' }}>
    <h1>👥 Equipo</h1>
    <p>Gestión de equipo premium en construcción...</p>
  </div>
);

const SettingsPage = () => (
  <div style={{ color: 'white', textAlign: 'center', padding: '2rem' }}>
    <h1>⚙️ Configuración</h1>
    <p>Panel de configuración premium en construcción...</p>
  </div>
);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            {/* Ruta principal - Dashboard */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* Rutas adicionales */}
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/team" element={<TeamPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            
            {/* Ruta por defecto - redirige al dashboard */}
            <Route path="*" element={<Dashboard />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App; 