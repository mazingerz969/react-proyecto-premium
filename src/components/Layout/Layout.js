import React, { useState } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import Header from './Header';
import Sidebar from './Sidebar';
import Breadcrumbs from './Breadcrumbs';
import { Toaster } from 'react-hot-toast';
import './Layout.css';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [currentPath, setCurrentPath] = useState('/');
  const [currentTitle, setCurrentTitle] = useState('Dashboard');
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleNavigation = (path, title) => {
    setCurrentPath(path);
    setCurrentTitle(title);
  };

  const drawerWidth = sidebarOpen ? 280 : 72;

  return (
    <Box 
      className={`premium-layout ${darkMode ? 'dark' : 'light'}`}
      sx={{ 
        display: 'flex',
        minHeight: '100vh',
        background: darkMode 
          ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
          : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      {/* Toaster para notificaciones globales */}
      <Toaster 
        position="top-right"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 3000,
          style: {
            background: darkMode 
              ? 'rgba(26, 26, 46, 0.95)' 
              : 'rgba(255, 255, 255, 0.95)',
            color: darkMode ? 'white' : '#333',
            backdropFilter: 'blur(10px)',
            borderRadius: '15px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
          },
        }}
      />

      {/* Header */}
      <Header
        onToggleSidebar={handleToggleSidebar}
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
      />

      {/* Sidebar */}
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        darkMode={darkMode}
        variant={isMobile ? 'temporary' : 'permanent'}
        onNavigate={handleNavigation}
      />

      {/* Main Content Area */}
      <Box
        component="main"
        className="main-content"
        sx={{
          flexGrow: 1,
          marginLeft: isMobile ? 0 : `${drawerWidth}px`,
          marginTop: '70px', // Height of header
          transition: 'margin-left 0.3s ease',
          minHeight: 'calc(100vh - 70px)',
          position: 'relative'
        }}
      >
        {/* Breadcrumbs */}
        <Breadcrumbs 
          currentPath={currentPath}
          currentTitle={currentTitle}
        />

        {/* Page Content */}
        <motion.div
          className="page-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            padding: '24px',
            height: 'calc(100vh - 70px - 80px)', // Minus header and breadcrumbs
            overflow: 'auto'
          }}
        >
          {children}
        </motion.div>
      </Box>
    </Box>
  );
};

export default Layout; 