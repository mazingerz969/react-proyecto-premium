import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Typography,
  Box,
  Chip,
  Tooltip,
  Collapse
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Add as CounterIcon,
  Assignment as TasksIcon,
  Celebration as FunIcon,
  Info as InfoIcon,
  Settings as SettingsIcon,
  ChevronLeft,
  ChevronRight,
  ExpandLess,
  ExpandMore
} from '@mui/icons-material';
import {
  FaRocket, FaCalculator, FaTasks, FaGamepad, 
  FaInfoCircle, FaCog, FaChartBar, FaUser,
  FaStar, FaHeart, FaMagic, FaGift
} from 'react-icons/fa';
import {
  IoSparkles, IoStatsChart, IoColorPalette,
  IoNotifications, IoTime, IoTrendingUp
} from 'react-icons/io5';
import {
  BsLightning, BsStars, BsHeart, BsGear,
  BsGraphUp, BsCollection, BsPersonCircle
} from 'react-icons/bs';
import './Sidebar.css';

const Sidebar = ({ 
  open, 
  onClose, 
  darkMode,
  variant = 'permanent',
  onNavigate
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState({
    features: true,
    analytics: false,
    settings: false
  });

  const drawerWidth = 280;
  const collapsedWidth = 72;

  // Elementos del menú principal
  const mainMenuItems = [
    {
      text: 'Dashboard',
      reactIcon: FaRocket,
      path: '/',
      color: '#667eea',
      description: 'Vista general'
    },
    {
      text: 'Perfil',
      reactIcon: FaUser,
      path: '/profile',
      color: '#ff6b6b',
      description: 'Gestión de perfil',
      badge: '👤'
    },
    {
      text: 'Analytics',
      reactIcon: FaChartBar,
      path: '/analytics',
      color: '#4ecdc4',
      description: 'Métricas y datos',
      badge: '📊'
    },
    {
      text: 'Proyectos',
      reactIcon: FaTasks,
      path: '/projects',
      color: '#45b7d1',
      description: 'Gestión de proyectos'
    },
    {
      text: 'Equipo',
      reactIcon: FaHeart,
      path: '/team',
      color: '#f39c12',
      description: 'Gestión de equipo'
    },
    {
      text: 'Configuración',
      reactIcon: FaCog,
      path: '/settings',
      color: '#9b59b6',
      description: 'Configuración'
    },
    {
      text: 'APIs Reales',
      reactIcon: IoStatsChart,
      path: '/dashboard-api',
      color: '#667eea',
      description: 'Dashboard con datos reales',
      badge: '🌐'
    }
  ];

  // Secciones expandibles (removidas temporalmente)
  const expandableSections = [];

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleNavigation = (path, text) => {
    // Navegar usando React Router
    navigate(path);
    
    // Llamar callback si existe
    if (onNavigate) {
      onNavigate(path, text);
    }
    
    // Cerrar sidebar en móvil
    if (variant === 'temporary') {
      onClose();
    }
  };

  // Variantes de animación
  const sidebarVariants = {
    open: {
      width: drawerWidth,
      transition: { duration: 0.3, ease: "easeInOut" }
    },
    closed: {
      width: collapsedWidth,
      transition: { duration: 0.3, ease: "easeInOut" }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3,
        ease: "easeOut"
      }
    })
  };

  const iconHoverVariants = {
    hover: {
      scale: 1.2,
      rotate: 360,
      transition: { duration: 0.5 }
    }
  };

  const renderMenuItem = (item, index) => {
    const ReactIcon = item.reactIcon;
    const isActive = location.pathname === item.path;

    return (
      <motion.div
        key={item.path}
        custom={index}
        initial="hidden"
        animate="visible"
        variants={itemVariants}
        whileHover={{ scale: 1.02, x: 5 }}
        transition={{ duration: 0.2 }}
      >
        <Tooltip 
          title={!open ? `${item.text} - ${item.description}` : ''} 
          placement="right"
          arrow
        >
          <ListItem disablePadding className="sidebar-menu-item">
            <ListItemButton
              onClick={() => handleNavigation(item.path, item.text)}
              className="sidebar-button"
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
                borderRadius: '12px',
                margin: '4px 8px',
                border: isActive ? `2px solid ${item.color}` : '2px solid transparent',
                background: isActive 
                  ? `linear-gradient(45deg, ${item.color}20, ${item.color}30)`
                  : 'transparent',
                '&:hover': {
                  background: `linear-gradient(45deg, ${item.color}15, ${item.color}25)`,
                  transform: 'translateX(4px)',
                  border: `2px solid ${item.color}40`
                }
              }}
            >
              <motion.div
                variants={iconHoverVariants}
                whileHover="hover"
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                    color: item.color
                  }}
                >
                  <ReactIcon size={24} />
                </ListItemIcon>
              </motion.div>
              
              <AnimatePresence>
                {open && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ display: 'flex', alignItems: 'center', width: '100%' }}
                  >
                    <ListItemText 
                      primary={item.text}
                      secondary={item.description}
                      primaryTypographyProps={{
                        fontWeight: 500,
                        color: 'inherit'
                      }}
                      secondaryTypographyProps={{
                        fontSize: '0.75rem',
                        color: 'text.secondary'
                      }}
                    />
                    {item.badge && (
                      <Chip
                        label={item.badge}
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: '0.7rem',
                          background: `${item.color}20`,
                          color: item.color,
                          border: `1px solid ${item.color}40`
                        }}
                      />
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </ListItemButton>
          </ListItem>
        </Tooltip>
      </motion.div>
    );
  };

  const renderExpandableSection = (section) => {
    const isExpanded = expandedSections[section.key];
    const SectionIcon = section.icon;

    return (
      <motion.div
        key={section.key}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => toggleSection(section.key)}
            sx={{
              minHeight: 48,
              justifyContent: open ? 'initial' : 'center',
              px: 2.5,
              borderRadius: '12px',
              margin: '4px 8px',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 3 : 'auto',
                justifyContent: 'center',
              }}
            >
              <SectionIcon size={20} />
            </ListItemIcon>
            
            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{ display: 'flex', alignItems: 'center', width: '100%' }}
                >
                  <ListItemText 
                    primary={section.title}
                    primaryTypographyProps={{
                      fontSize: '0.9rem',
                      fontWeight: 500
                    }}
                  />
                  {isExpanded ? <ExpandLess /> : <ExpandMore />}
                </motion.div>
              )}
            </AnimatePresence>
          </ListItemButton>
        </ListItem>

        <AnimatePresence>
          {open && (
            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <List component="div" disablePadding>
                  {section.items.map((item, index) => {
                    const isActive = location.pathname === item.path;
                    const ItemIcon = item.icon;
                    
                    return (
                      <motion.div
                        key={item.path}
                        whileHover={{ scale: 1.02, x: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ListItemButton
                          sx={{
                            pl: 4,
                            minHeight: 40,
                            borderRadius: '8px',
                            margin: '2px 16px',
                            background: isActive 
                              ? `${item.color}20`
                              : 'transparent',
                            border: isActive 
                              ? `1px solid ${item.color}60`
                              : '1px solid transparent',
                            '&:hover': {
                              background: `${item.color}15`,
                              border: `1px solid ${item.color}40`
                            }
                          }}
                          onClick={() => handleNavigation(item.path, item.text)}
                        >
                          <ListItemIcon sx={{ minWidth: 35 }}>
                            <ItemIcon 
                              size={16} 
                              color={isActive ? item.color : 'currentColor'} 
                            />
                          </ListItemIcon>
                          <ListItemText 
                            primary={item.text}
                            primaryTypographyProps={{
                              fontSize: '0.85rem',
                              color: isActive ? item.color : 'inherit'
                            }}
                          />
                        </ListItemButton>
                      </motion.div>
                    );
                  })}
                </List>
              </motion.div>
            </Collapse>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  const drawerContent = (
    <motion.div
      className="sidebar-content"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header del Sidebar */}
      <Box className="sidebar-header" sx={{ p: 2, textAlign: 'center' }}>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 1 }}
              >
                <FaRocket size={40} color="#667eea" />
              </motion.div>
              <Typography variant="h6" sx={{ mt: 1, fontWeight: 600 }}>
                React Premium
              </Typography>
              <Typography variant="caption" color="text.secondary">
                v2.0.0 ✨
              </Typography>
            </motion.div>
          )}
        </AnimatePresence>
        
        {!open && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <FaRocket size={30} color="#667eea" />
          </motion.div>
        )}
      </Box>

      <Divider sx={{ background: 'rgba(255, 255, 255, 0.1)' }} />

      {/* Menú Principal */}
      <List sx={{ px: 1, py: 2 }}>
        {mainMenuItems.map((item, index) => renderMenuItem(item, index))}
      </List>

      <Divider sx={{ background: 'rgba(255, 255, 255, 0.1)', mx: 2 }} />

      {/* Secciones Expandibles */}
      <List sx={{ px: 1, py: 1 }}>
        {expandableSections.map(section => renderExpandableSection(section))}
      </List>

      {/* Footer del Sidebar */}
      <Box sx={{ mt: 'auto', p: 2 }}>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
              className="sidebar-footer"
            >
              <Box 
                sx={{ 
                  textAlign: 'center',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '12px',
                  p: 2,
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <BsStars size={20} color="#ffd700" />
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  ¡Aplicación Premium!
                </Typography>
                <Chip 
                  label="Pro ✨" 
                  size="small"
                  sx={{ 
                    mt: 1,
                    background: 'linear-gradient(45deg, #ffd700, #ff6b6b)',
                    color: 'white',
                    fontWeight: 600
                  }}
                />
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </motion.div>
  );

  return (
    <Drawer
      variant={variant}
      anchor="left"
      open={open}
      onClose={onClose}
      className={`premium-sidebar ${darkMode ? 'dark' : 'light'}`}
      sx={{
        width: open ? drawerWidth : collapsedWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: open ? drawerWidth : collapsedWidth,
          boxSizing: 'border-box',
          background: darkMode 
            ? 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)'
            : 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
          backdropFilter: 'blur(20px)',
          border: 'none',
          borderRight: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.2)'}`,
          color: 'white',
          transition: 'width 0.3s ease',
          overflowX: 'hidden'
        }
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar; 