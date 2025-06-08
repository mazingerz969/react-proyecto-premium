import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  InputBase,
  Avatar,
  Menu,
  MenuItem,
  Box,
  Switch,
  Tooltip,
  Chip,
  Button
} from '@mui/material';
import {
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  AccountCircle,
  Brightness4,
  Brightness7,
  Menu as MenuIcon,
  Settings,
  ExitToApp,
  Dashboard,
  Login
} from '@mui/icons-material';
import { 
  FaRocket, FaBell, FaSearch, FaMoon, FaSun, 
  FaUser, FaCog, FaSignOutAlt, FaSignInAlt
} from 'react-icons/fa';
import { IoSparkles, IoThunderstorm } from 'react-icons/io5';
import toast from 'react-hot-toast';
import AuthModal from '../AuthModal';
import './Header.css';

const Header = ({ 
  onToggleSidebar, 
  darkMode, 
  onToggleDarkMode,
  notifications = [],
  user = null
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(user);

  // Manejar búsqueda
  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      toast.success(`🔍 Buscando: "${searchQuery}"`, {
        icon: '🎯',
        style: {
          background: 'linear-gradient(45deg, #667eea, #764ba2)',
          color: 'white'
        }
      });
      setSearchQuery('');
    }
  };

  // Menú de usuario
  const handleUserMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorEl(null);
  };

  // Menú de notificaciones
  const handleNotificationMenu = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleCloseNotifications = () => {
    setNotificationAnchor(null);
  };

  // Acción de notificación
  const handleNotificationClick = (notification) => {
    toast(notification.message, {
      icon: notification.icon,
      style: {
        background: notification.type === 'success' ? '#10ac84' : 
                   notification.type === 'warning' ? '#f39c12' : '#ee5a52',
        color: 'white'
      }
    });
    handleCloseNotifications();
  };

  // Manejar autenticación exitosa
  const handleAuthSuccess = (userData) => {
    setCurrentUser(userData);
    toast.success(`¡Bienvenido, ${userData.name}!`, {
      duration: 4000,
      icon: '🎉'
    });
  };

  // Cerrar sesión
  const handleLogout = () => {
    setCurrentUser(null);
    handleCloseUserMenu();
    toast.success('Sesión cerrada correctamente', {
      icon: '👋'
    });
  };

  const mockNotifications = [
    { id: 1, message: '¡Contador llegó a 10!', icon: '🎉', type: 'success', time: '2 min' },
    { id: 2, message: '5 tareas completadas', icon: '✅', type: 'success', time: '5 min' },
    { id: 3, message: 'Nueva actualización disponible', icon: '🚀', type: 'info', time: '1h' },
    { id: 4, message: 'Modo festivo activado', icon: '🎊', type: 'warning', time: '3h' }
  ];

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, type: 'spring' }}
      className="header-container"
    >
      <AppBar 
        position="fixed" 
        className="premium-header"
        sx={{
          background: darkMode 
            ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.2)'}`,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }}
      >
        <Toolbar className="header-toolbar">
          {/* Botón menú sidebar */}
          <motion.div
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={onToggleSidebar}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          </motion.div>

          {/* Logo y título */}
          <motion.div
            className="header-logo"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <FaRocket style={{ marginRight: '10px', color: '#ffd700' }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 0, fontWeight: 600 }}>
              React Premium
            </Typography>
            <IoSparkles style={{ marginLeft: '8px', color: '#ff6b6b' }} />
          </motion.div>

          {/* Spacer */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Barra de búsqueda */}
          <motion.div
            className="search-container"
            whileFocus={{ scale: 1.02 }}
            initial={{ width: 200 }}
            whileHover={{ width: 250 }}
            transition={{ duration: 0.3 }}
          >
            <div className="search-wrapper">
              <SearchIcon className="search-icon" />
              <InputBase
                placeholder="Buscar todo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearch}
                className="search-input"
                sx={{
                  color: 'white',
                  '& .MuiInputBase-input::placeholder': {
                    color: 'rgba(255,255,255,0.7)',
                    opacity: 1
                  }
                }}
              />
              {searchQuery && (
                <Chip
                  label={`"${searchQuery}"`}
                  size="small"
                  onDelete={() => setSearchQuery('')}
                  className="search-chip"
                />
              )}
            </div>
          </motion.div>

          {/* Botón modo oscuro */}
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Tooltip title={darkMode ? 'Modo claro' : 'Modo oscuro'}>
              <IconButton
                color="inherit"
                onClick={onToggleDarkMode}
                className="mode-toggle"
              >
                {darkMode ? <FaSun /> : <FaMoon />}
              </IconButton>
            </Tooltip>
          </motion.div>

          {/* Notificaciones */}
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <IconButton
              color="inherit"
              onClick={handleNotificationMenu}
              className="notification-btn"
            >
              <Badge 
                badgeContent={mockNotifications.length} 
                color="error"
                sx={{
                  '& .MuiBadge-badge': {
                    background: 'linear-gradient(45deg, #ff6b6b, #ee5a52)',
                    animation: 'pulse 2s infinite'
                  }
                }}
              >
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </motion.div>

          {/* Menú de notificaciones */}
          <Menu
            anchorEl={notificationAnchor}
            open={Boolean(notificationAnchor)}
            onClose={handleCloseNotifications}
            className="notifications-menu"
            PaperProps={{
              sx: {
                background: darkMode 
                  ? 'linear-gradient(135deg, #2d3748 0%, #1a202c 100%)'
                  : 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
                backdropFilter: 'blur(20px)',
                border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                borderRadius: '15px',
                minWidth: '300px',
                maxHeight: '400px'
              }
            }}
          >
            <MenuItem disabled sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
              <FaBell style={{ marginRight: '8px' }} />
              Notificaciones
              <IoThunderstorm style={{ marginLeft: 'auto' }} />
            </MenuItem>
            {mockNotifications.map((notification) => (
              <motion.div
                key={notification.id}
                whileHover={{ scale: 1.02, x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <MenuItem 
                  onClick={() => handleNotificationClick(notification)}
                  className="notification-item"
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <span style={{ fontSize: '1.2rem', marginRight: '10px' }}>
                      {notification.icon}
                    </span>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body2">{notification.message}</Typography>
                      <Typography variant="caption" color="textSecondary">
                        {notification.time}
                      </Typography>
                    </Box>
                  </Box>
                </MenuItem>
              </motion.div>
            ))}
          </Menu>

          {/* Usuario autenticado o botón de login */}
          {currentUser ? (
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <IconButton
                size="large"
                onClick={handleUserMenu}
                color="inherit"
                className="user-avatar"
              >
                <Avatar 
                  src={currentUser.avatar}
                  sx={{ 
                    background: 'linear-gradient(45deg, #ff9ff3, #f368e0)',
                    width: 40,
                    height: 40,
                    border: '2px solid rgba(255,255,255,0.3)'
                  }}
                >
                  <FaUser />
                </Avatar>
              </IconButton>
            </motion.div>
          ) : (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="contained"
                onClick={() => setAuthModalOpen(true)}
                startIcon={<FaSignInAlt />}
                sx={{
                  background: 'linear-gradient(45deg, #ff6b6b, #ee5a52)',
                  borderRadius: '25px',
                  textTransform: 'none',
                  fontWeight: 'bold',
                  px: 3,
                  '&:hover': {
                    background: 'linear-gradient(45deg, #ee5a52, #e55347)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(238, 90, 82, 0.4)'
                  }
                }}
              >
                Iniciar Sesión
              </Button>
            </motion.div>
          )}

          {/* Menú de usuario */}
          {currentUser && (
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleCloseUserMenu}
              PaperProps={{
                sx: {
                  background: darkMode 
                    ? 'linear-gradient(135deg, #2d3748 0%, #1a202c 100%)'
                    : 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
                  backdropFilter: 'blur(20px)',
                  border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                  borderRadius: '15px',
                  minWidth: '200px'
                }
              }}
            >
              <MenuItem disabled sx={{ fontWeight: 600 }}>
                <FaUser style={{ marginRight: '8px' }} />
                {currentUser.name}
              </MenuItem>
              <MenuItem onClick={handleCloseUserMenu}>
                <Dashboard sx={{ mr: 1 }} />
                Dashboard
              </MenuItem>
              <MenuItem onClick={handleCloseUserMenu}>
                <FaCog style={{ marginRight: '8px' }} />
                Configuración
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <FaSignOutAlt style={{ marginRight: '8px' }} />
                Cerrar Sesión
              </MenuItem>
            </Menu>
          )}

          {/* Modal de autenticación */}
          <AuthModal
            open={authModalOpen}
            onClose={() => setAuthModalOpen(false)}
            onAuthSuccess={handleAuthSuccess}
          />
        </Toolbar>
      </AppBar>
    </motion.div>
  );
};

export default Header; 