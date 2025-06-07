import React from 'react';
import { motion } from 'framer-motion';
import { 
  Breadcrumbs as MuiBreadcrumbs, 
  Typography, 
  Chip,
  Box 
} from '@mui/material';
import { NavigateNext } from '@mui/icons-material';
import { 
  FaHome, FaCalculator, FaTasks, FaGamepad, 
  FaInfoCircle, FaChartBar, FaCog 
} from 'react-icons/fa';
import { IoSparkles } from 'react-icons/io5';
import './Breadcrumbs.css';

const Breadcrumbs = ({ currentPath, currentTitle }) => {
  // Mapeo de rutas a iconos y colores
  const pathConfig = {
    '/': { icon: FaHome, color: '#667eea', name: 'Dashboard' },
    '/contador': { icon: FaCalculator, color: '#ff6b6b', name: 'Contador' },
    '/tareas': { icon: FaTasks, color: '#4ecdc4', name: 'Tareas' },
    '/diversion': { icon: FaGamepad, color: '#45b7d1', name: 'Diversión' },
    '/info': { icon: FaInfoCircle, color: '#f39c12', name: 'Información' },
    '/stats': { icon: FaChartBar, color: '#e74c3c', name: 'Estadísticas' },
    '/settings': { icon: FaCog, color: '#95a5a6', name: 'Configuración' }
  };

  // Generar breadcrumbs basado en la ruta actual
  const generateBreadcrumbs = () => {
    const segments = currentPath.split('/').filter(segment => segment !== '');
    const breadcrumbs = [{ path: '/', name: 'Dashboard' }];

    let currentFullPath = '';
    segments.forEach(segment => {
      currentFullPath += `/${segment}`;
      const config = pathConfig[currentFullPath];
      if (config) {
        breadcrumbs.push({
          path: currentFullPath,
          name: config.name
        });
      }
    });

    return breadcrumbs;
  };

  const breadcrumbItems = generateBreadcrumbs();
  const currentConfig = pathConfig[currentPath] || pathConfig['/'];
  const CurrentIcon = currentConfig.icon;

  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.div
      className="breadcrumbs-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Box 
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 24px',
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '0 0 20px 20px'
        }}
      >
        {/* Breadcrumbs Navigation */}
        <motion.div
          variants={itemVariants}
          className="breadcrumbs-nav"
        >
          <MuiBreadcrumbs
            separator={<NavigateNext fontSize="small" sx={{ color: 'rgba(255,255,255,0.6)' }} />}
            aria-label="breadcrumb"
            sx={{
              '& .MuiBreadcrumbs-separator': {
                margin: '0 8px'
              }
            }}
          >
            {breadcrumbItems.map((item, index) => {
              const isLast = index === breadcrumbItems.length - 1;
              const config = pathConfig[item.path] || pathConfig['/'];
              const ItemIcon = config.icon;

              return (
                <motion.div
                  key={item.path}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  {isLast ? (
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        background: `linear-gradient(45deg, ${config.color}20, ${config.color}40)`,
                        padding: '6px 12px',
                        borderRadius: '20px',
                        border: `1px solid ${config.color}60`
                      }}
                    >
                      <ItemIcon 
                        size={16} 
                        color={config.color} 
                        style={{ marginRight: '6px' }} 
                      />
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: config.color,
                          fontWeight: 600,
                          fontSize: '0.9rem'
                        }}
                      >
                        {item.name}
                      </Typography>
                    </Box>
                  ) : (
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        cursor: 'pointer',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          background: 'rgba(255, 255, 255, 0.1)'
                        }
                      }}
                    >
                      <ItemIcon 
                        size={14} 
                        color="rgba(255,255,255,0.7)" 
                        style={{ marginRight: '4px' }} 
                      />
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: 'rgba(255,255,255,0.7)',
                          fontSize: '0.85rem',
                          '&:hover': {
                            color: 'white'
                          }
                        }}
                      >
                        {item.name}
                      </Typography>
                    </Box>
                  )}
                </motion.div>
              );
            })}
          </MuiBreadcrumbs>
        </motion.div>

        {/* Current Page Info */}
        <motion.div
          variants={itemVariants}
          className="page-info"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Page Title */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <CurrentIcon 
                  size={24} 
                  color={currentConfig.color} 
                  style={{ marginRight: '8px' }} 
                />
              </motion.div>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '1.1rem'
                }}
              >
                {currentTitle || currentConfig.name}
              </Typography>
            </Box>

            {/* Status Chips */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
                style={{ pointerEvents: 'none' }}
              >
                <Chip
                  icon={<IoSparkles size={14} />}
                  label="Activo"
                  size="small"
                  sx={{
                    background: 'linear-gradient(45deg, #10ac84, #1dd1a1)',
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.2)',
                    fontWeight: 500,
                    '& .MuiChip-icon': {
                      color: 'white'
                    },
                    cursor: 'default'
                  }}
                />
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
                style={{ pointerEvents: 'none' }}
              >
                <Chip
                  label="Premium"
                  size="small"
                  sx={{
                    background: 'linear-gradient(45deg, #ffd700, #ff6b6b)',
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.2)',
                    fontWeight: 600,
                    fontSize: '0.7rem',
                    cursor: 'default'
                  }}
                />
              </motion.div>
            </Box>
          </Box>
        </motion.div>
      </Box>
    </motion.div>
  );
};

export default Breadcrumbs; 