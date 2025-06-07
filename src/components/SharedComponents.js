import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  CircularProgress,
  Backdrop,
  IconButton,
  Fab,
  Chip,
  Avatar,
  Tooltip
} from '@mui/material';
import {
  Close,
  Star,
  Favorite,
  Share,
  BookmarkBorder,
  Bookmark,
  Notifications,
  NotificationsOff
} from '@mui/icons-material';
import {
  FaHeart,
  FaRocket,
  FaStar,
  FaFire,
  FaGem,
  FaLightbulb,
  FaThumbsUp
} from 'react-icons/fa';

// 🎨 **Tarjeta Premium Animada**
export const PremiumCard = ({ 
  children, 
  hover = true, 
  glow = false, 
  gradient = 'blue',
  elevation = 'medium',
  onClick,
  ...props 
}) => {
  const gradients = {
    blue: 'linear-gradient(45deg, #667eea, #764ba2)',
    purple: 'linear-gradient(45deg, #a8edea, #fed6e3)',
    orange: 'linear-gradient(45deg, #fd79a8, #fdcb6e)',
    green: 'linear-gradient(45deg, #00b894, #00cec9)',
    red: 'linear-gradient(45deg, #e17055, #f39c12)',
    gold: 'linear-gradient(45deg, #f1c40f, #f39c12)'
  };

  const elevations = {
    low: '0 2px 8px rgba(0,0,0,0.1)',
    medium: '0 8px 25px rgba(0,0,0,0.15)',
    high: '0 15px 35px rgba(0,0,0,0.2)',
    extreme: '0 25px 50px rgba(0,0,0,0.3)'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hover ? { 
        y: -10, 
        boxShadow: elevations.extreme,
        scale: 1.02 
      } : {}}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      onClick={onClick || undefined}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <Card
        sx={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: 3,
          overflow: 'hidden',
          position: 'relative',
          boxShadow: elevations[elevation],
          ...(glow && {
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: gradients[gradient],
              opacity: 0.1,
              zIndex: 0
            }
          })
        }}
        {...props}
      >
        {children}
      </Card>
    </motion.div>
  );
};

// ⚡ **Botón Premium con Efectos**
export const PremiumButton = ({ 
  children, 
  variant = 'gradient',
  color = 'blue',
  size = 'medium',
  loading = false,
  icon,
  onClick,
  ...props 
}) => {
  const [clicked, setClicked] = useState(false);

  const gradients = {
    blue: 'linear-gradient(45deg, #667eea, #764ba2)',
    purple: 'linear-gradient(45deg, #a8edea, #fed6e3)',
    orange: 'linear-gradient(45deg, #fd79a8, #fdcb6e)',
    green: 'linear-gradient(45deg, #00b894, #00cec9)',
    red: 'linear-gradient(45deg, #e17055, #f39c12)'
  };

  const sizes = {
    small: { padding: '8px 16px', fontSize: '0.875rem' },
    medium: { padding: '12px 24px', fontSize: '1rem' },
    large: { padding: '16px 32px', fontSize: '1.125rem' }
  };

  const handleClick = (e) => {
    setClicked(true);
    setTimeout(() => setClicked(false), 200);
    if (onClick) onClick(e);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <Button
        onClick={handleClick}
        disabled={loading}
        sx={{
          background: variant === 'gradient' ? gradients[color] : 'transparent',
          border: variant === 'outlined' ? '2px solid' : 'none',
          borderColor: variant === 'outlined' ? gradients[color] : 'transparent',
          color: 'white',
          fontWeight: 'bold',
          borderRadius: 2,
          textTransform: 'none',
          position: 'relative',
          overflow: 'hidden',
          ...sizes[size],
          '&:hover': {
            background: variant === 'gradient' ? gradients[color] : 'rgba(255,255,255,0.1)',
            filter: 'brightness(1.1)',
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: clicked ? '300px' : '0px',
            height: clicked ? '300px' : '0px',
            background: 'rgba(255,255,255,0.3)',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            transition: 'all 0.5s ease',
            zIndex: 0
          }
        }}
        {...props}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, position: 'relative', zIndex: 1 }}>
          {loading ? (
            <CircularProgress size={20} sx={{ color: 'white' }} />
          ) : (
            icon && <Box sx={{ display: 'flex' }}>{icon}</Box>
          )}
          {children}
        </Box>
      </Button>
    </motion.div>
  );
};

// 🌟 **Loader Premium Personalizado**
export const PremiumLoader = ({ 
  size = 'medium', 
  color = 'blue', 
  type = 'circular',
  text = 'Cargando...' 
}) => {
  const sizes = {
    small: 24,
    medium: 40,
    large: 60
  };

  const colors = {
    blue: '#667eea',
    purple: '#a8edea',
    orange: '#fd79a8',
    green: '#00b894',
    red: '#e17055'
  };

  if (type === 'dots') {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: colors[color]
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2
            }}
          />
        ))}
        {text && (
          <Typography variant="body2" sx={{ ml: 2, color: 'white' }}>
            {text}
          </Typography>
        )}
      </Box>
    );
  }

  if (type === 'pulse') {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <motion.div
          style={{
            width: sizes[size],
            height: sizes[size],
            borderRadius: '50%',
            background: `linear-gradient(45deg, ${colors[color]}, ${colors[color]}aa)`
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        {text && (
          <Typography variant="body2" sx={{ color: 'white' }}>
            {text}
          </Typography>
        )}
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <CircularProgress 
        size={sizes[size]} 
        sx={{ color: colors[color] }}
        thickness={4}
      />
      {text && (
        <Typography variant="body2" sx={{ color: 'white' }}>
          {text}
        </Typography>
      )}
    </Box>
  );
};

// 📱 **Modal Premium con Animaciones**
export const PremiumModal = ({ 
  open, 
  onClose, 
  title, 
  children, 
  maxWidth = 'md',
  showCloseButton = true 
}) => {
  return (
    <AnimatePresence>
      {open && (
        <Backdrop
          open={open}
          onClick={onClose}
          sx={{
            zIndex: 1300,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(5px)'
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '90%',
              maxWidth: maxWidth === 'sm' ? 400 : maxWidth === 'md' ? 600 : 800,
              maxHeight: '90vh',
              overflow: 'auto'
            }}
          >
            <Card
              sx={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: 3,
                color: 'white'
              }}
            >
              {(title || showCloseButton) && (
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  p: 3, 
                  borderBottom: '1px solid rgba(255,255,255,0.1)' 
                }}>
                  {title && (
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                      {title}
                    </Typography>
                  )}
                  {showCloseButton && (
                    <IconButton onClick={onClose} sx={{ color: 'white' }}>
                      <Close />
                    </IconButton>
                  )}
                </Box>
              )}
              <Box sx={{ p: 3 }}>
                {children}
              </Box>
            </Card>
          </motion.div>
        </Backdrop>
      )}
    </AnimatePresence>
  );
};

// 🎯 **Chip Premium Interactivo**
export const PremiumChip = ({ 
  label, 
  icon, 
  color = 'blue', 
  variant = 'filled',
  clickable = false,
  deletable = false,
  onDelete,
  onClick,
  size = 'medium' 
}) => {
  const [hovered, setHovered] = useState(false);

  const colors = {
    blue: '#667eea',
    purple: '#a8edea',
    orange: '#fd79a8',
    green: '#00b894',
    red: '#e17055',
    gold: '#f1c40f'
  };

  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      <Chip
        label={label}
        icon={icon}
        onDelete={deletable ? onDelete : undefined}
        onClick={clickable && onClick ? onClick : undefined}
        size={size}
        sx={{
          background: variant === 'filled' 
            ? `linear-gradient(45deg, ${colors[color]}, ${colors[color]}aa)`
            : 'transparent',
          border: variant === 'outlined' ? `2px solid ${colors[color]}` : 'none',
          color: 'white',
          fontWeight: 'bold',
          '& .MuiChip-icon': {
            color: 'white'
          },
          '& .MuiChip-deleteIcon': {
            color: 'rgba(255,255,255,0.8)',
            '&:hover': {
              color: 'white'
            }
          },
          cursor: (clickable || deletable) ? 'pointer' : 'default',
          transition: 'all 0.3s ease'
        }}
      />
    </motion.div>
  );
};

// ⭐ **Rating Interactivo Premium**
export const PremiumRating = ({ 
  value = 0, 
  max = 5, 
  onChange, 
  readOnly = false,
  size = 'medium',
  color = 'gold' 
}) => {
  const [hoverValue, setHoverValue] = useState(0);

  const sizes = {
    small: 16,
    medium: 24,
    large: 32
  };

  const colors = {
    gold: '#f1c40f',
    blue: '#667eea',
    red: '#e17055',
    green: '#00b894'
  };

  return (
    <Box sx={{ display: 'flex', gap: 0.5 }}>
      {Array.from({ length: max }, (_, i) => {
        const starValue = i + 1;
        const filled = (hoverValue || value) >= starValue;
        
        return (
          <motion.div
            key={i}
            whileHover={!readOnly ? { scale: 1.2 } : {}}
            whileTap={!readOnly ? { scale: 0.9 } : {}}
          >
            <IconButton
              size="small"
              disabled={readOnly}
              onMouseEnter={() => !readOnly && setHoverValue(starValue)}
              onMouseLeave={() => !readOnly && setHoverValue(0)}
              onClick={() => !readOnly && onChange && onChange(starValue)}
              sx={{ 
                p: 0.25,
                color: filled ? colors[color] : 'rgba(255,255,255,0.3)'
              }}
            >
              <FaStar size={sizes[size]} />
            </IconButton>
          </motion.div>
        );
      })}
    </Box>
  );
};

// 🎨 **Avatar Premium con Estado**
export const PremiumAvatar = ({ 
  src, 
  alt, 
  name,
  status = 'online', // online, offline, busy, away
  size = 'medium',
  onClick,
  showTooltip = true 
}) => {
  const sizes = {
    small: 32,
    medium: 48,
    large: 64,
    xlarge: 80
  };

  const statusColors = {
    online: '#00b894',
    offline: '#636e72',
    busy: '#e17055',
    away: '#fdcb6e'
  };

  const avatarContent = (
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      style={{ position: 'relative', cursor: onClick ? 'pointer' : 'default' }}
      onClick={onClick || undefined}
    >
      <Avatar
        src={src}
        alt={alt}
        sx={{
          width: sizes[size],
          height: sizes[size],
          background: 'linear-gradient(45deg, #667eea, #764ba2)',
          fontSize: sizes[size] * 0.4,
          fontWeight: 'bold',
          border: '3px solid rgba(255,255,255,0.2)'
        }}
      >
        {!src && name && name.split(' ').map(n => n[0]).join('')}
      </Avatar>
      
      {/* Indicador de estado */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 2,
          right: 2,
          width: sizes[size] * 0.25,
          height: sizes[size] * 0.25,
          borderRadius: '50%',
          backgroundColor: statusColors[status],
          border: '2px solid white',
          zIndex: 1
        }}
      />
    </motion.div>
  );

  if (showTooltip && name) {
    return (
      <Tooltip title={`${name} - ${status}`} arrow>
        {avatarContent}
      </Tooltip>
    );
  }

  return avatarContent;
};

// 🚀 **Floating Action Button Premium**
export const PremiumFAB = ({ 
  icon, 
  color = 'blue', 
  size = 'medium',
  position = 'bottom-right',
  onClick,
  tooltip,
  pulse = false 
}) => {
  const colors = {
    blue: 'linear-gradient(45deg, #667eea, #764ba2)',
    purple: 'linear-gradient(45deg, #a8edea, #fed6e3)',
    orange: 'linear-gradient(45deg, #fd79a8, #fdcb6e)',
    green: 'linear-gradient(45deg, #00b894, #00cec9)',
    red: 'linear-gradient(45deg, #e17055, #f39c12)'
  };

  const positions = {
    'bottom-right': { bottom: 24, right: 24 },
    'bottom-left': { bottom: 24, left: 24 },
    'top-right': { top: 24, right: 24 },
    'top-left': { top: 24, left: 24 }
  };

  const fab = (
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      animate={pulse ? {
        boxShadow: [
          '0 0 20px rgba(102, 126, 234, 0.4)',
          '0 0 40px rgba(102, 126, 234, 0.8)',
          '0 0 20px rgba(102, 126, 234, 0.4)'
        ]
      } : {}}
      transition={pulse ? { duration: 2, repeat: Infinity } : { duration: 0.2 }}
      style={{
        position: 'fixed',
        zIndex: 1000,
        ...positions[position]
      }}
    >
      <Fab
        size={size}
        onClick={onClick || undefined}
        sx={{
          background: colors[color],
          color: 'white',
          '&:hover': {
            background: colors[color],
            filter: 'brightness(1.1)'
          }
        }}
      >
        {icon}
      </Fab>
    </motion.div>
  );

  if (tooltip) {
    return (
      <Tooltip title={tooltip} arrow placement="left">
        {fab}
      </Tooltip>
    );
  }

  return fab;
};

// 📊 **Progress Bar Premium**
export const PremiumProgress = ({ 
  value, 
  max = 100, 
  color = 'blue',
  animated = true,
  showValue = true,
  height = 8,
  label 
}) => {
  const colors = {
    blue: '#667eea',
    purple: '#a8edea',
    orange: '#fd79a8',
    green: '#00b894',
    red: '#e17055'
  };

  const percentage = (value / max) * 100;

  return (
    <Box sx={{ width: '100%' }}>
      {(label || showValue) && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          {label && (
            <Typography variant="body2" sx={{ color: 'white', opacity: 0.8 }}>
              {label}
            </Typography>
          )}
          {showValue && (
            <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold' }}>
              {Math.round(percentage)}%
            </Typography>
          )}
        </Box>
      )}
      
      <Box
        sx={{
          width: '100%',
          height: height,
          backgroundColor: 'rgba(255,255,255,0.1)',
          borderRadius: height / 2,
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <motion.div
          style={{
            height: '100%',
            background: `linear-gradient(90deg, ${colors[color]}, ${colors[color]}aa)`,
            borderRadius: height / 2,
            position: 'relative',
            overflow: 'hidden'
          }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: animated ? 1 : 0, ease: "easeOut" }}
        >
          {animated && (
            <motion.div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                width: '30%'
              }}
              animate={{ x: ['-100%', '350%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
        </motion.div>
      </Box>
    </Box>
  );
};

export default {
  PremiumCard,
  PremiumButton,
  PremiumLoader,
  PremiumModal,
  PremiumChip,
  PremiumRating,
  PremiumAvatar,
  PremiumFAB,
  PremiumProgress
}; 