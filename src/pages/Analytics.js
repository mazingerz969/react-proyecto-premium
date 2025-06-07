import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  LinearProgress,
  Chip,
  Button,
  ButtonGroup,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Visibility,
  People,
  ShoppingCart,
  AttachMoney,
  Schedule,
  Star,
  ArrowUpward,
  ArrowDownward
} from '@mui/icons-material';
import { 
  FaChartLine, 
  FaUsers, 
  FaEye, 
  FaDollarSign, 
  FaArrowUp, 
  FaArrowDown,
  FaFire,
  FaGlobe,
  FaMobile,
  FaDesktop
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('week');
  const [metrics, setMetrics] = useState({
    visitors: { value: 24751, change: 12.5, trend: 'up' },
    pageViews: { value: 89234, change: -3.2, trend: 'down' },
    users: { value: 12847, change: 8.7, trend: 'up' },
    revenue: { value: 45678, change: 15.3, trend: 'up' },
    bounceRate: { value: 34.2, change: -5.1, trend: 'up' },
    avgSession: { value: 4.35, change: 2.8, trend: 'up' }
  });

  const [chartData] = useState({
    labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    visitors: [1240, 1890, 2340, 1950, 2680, 2100, 1780],
    revenue: [3200, 4800, 5200, 4100, 6300, 5500, 4700]
  });

  const [topPages] = useState([
    { path: '/dashboard', views: 12547, time: '4:23' },
    { path: '/profile', views: 8934, time: '3:45' },
    { path: '/analytics', views: 6721, time: '5:12' },
    { path: '/projects', views: 4582, time: '2:56' },
    { path: '/settings', views: 3194, time: '3:08' }
  ]);

  const [recentActivity] = useState([
    { user: 'María García', action: 'Completó proyecto', time: '2 min', avatar: 'MG' },
    { user: 'Carlos López', action: 'Nuevo registro', time: '5 min', avatar: 'CL' },
    { user: 'Ana Martín', action: 'Actualización perfil', time: '8 min', avatar: 'AM' },
    { user: 'Luis Rodríguez', action: 'Compartió contenido', time: '12 min', avatar: 'LR' },
    { user: 'Elena Ruiz', action: 'Inició sesión', time: '15 min', avatar: 'ER' }
  ]);

  const [deviceStats] = useState([
    { device: 'Desktop', percentage: 54.3, icon: FaDesktop, color: '#667eea' },
    { device: 'Mobile', percentage: 38.7, icon: FaMobile, color: '#764ba2' },
    { device: 'Tablet', percentage: 7.0, icon: FaGlobe, color: '#fd79a8' }
  ]);

  useEffect(() => {
    // Simular actualización de datos en tiempo real
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        visitors: {
          ...prev.visitors,
          value: prev.visitors.value + Math.floor(Math.random() * 10)
        }
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
    toast.success(`Vista cambiada a: ${range === 'week' ? 'Semana' : range === 'month' ? 'Mes' : 'Año'}`, {
      icon: '📊'
    });
  };

  const MetricCard = ({ title, value, change, trend, icon: Icon, suffix = '' }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card sx={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        color: 'white',
        height: '100%',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="body2" sx={{ opacity: 0.8, textTransform: 'uppercase', fontSize: '0.75rem' }}>
              {title}
            </Typography>
            <Icon style={{ fontSize: 20, opacity: 0.7, color: trend === 'up' ? '#00b894' : '#e17055' }} />
          </Box>
          
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
            {typeof value === 'number' ? value.toLocaleString() : value}{suffix}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {trend === 'up' ? (
              <FaArrowUp style={{ color: '#00b894', marginRight: 4, fontSize: 12 }} />
            ) : (
              <FaArrowDown style={{ color: '#e17055', marginRight: 4, fontSize: 12 }} />
            )}
            <Typography variant="body2" sx={{ color: trend === 'up' ? '#00b894' : '#e17055' }}>
              {Math.abs(change)}%
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.7, ml: 1 }}>
              vs semana anterior
            </Typography>
          </Box>
        </CardContent>
        
        {/* Indicador de tendencia en el fondo */}
        <Box sx={{
          position: 'absolute',
          right: -10,
          top: -10,
          width: 60,
          height: 60,
          background: trend === 'up' ? 'rgba(0, 184, 148, 0.1)' : 'rgba(225, 112, 85, 0.1)',
          borderRadius: '50%',
          opacity: 0.5
        }} />
      </Card>
    </motion.div>
  );

  const SimpleChart = ({ data, color, height = 80 }) => (
    <Box sx={{ position: 'relative', height, mb: 2 }}>
      <svg width="100%" height={height} style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.8" />
            <stop offset="100%" stopColor={color} stopOpacity="0.1" />
          </linearGradient>
        </defs>
        
        {/* Línea del gráfico */}
        <path
          d={`M 0,${height - (data[0] / Math.max(...data)) * height} ${data.map((value, index) => 
            `L ${(index * 100) / (data.length - 1)},${height - (value / Math.max(...data)) * height}`
          ).join(' ')}`}
          fill="none"
          stroke={color}
          strokeWidth="2"
          style={{ filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.3))' }}
        />
        
        {/* Área bajo la línea */}
        <path
          d={`M 0,${height} L 0,${height - (data[0] / Math.max(...data)) * height} ${data.map((value, index) => 
            `L ${(index * 100) / (data.length - 1)},${height - (value / Math.max(...data)) * height}`
          ).join(' ')} L 100,${height} Z`}
          fill={`url(#gradient-${color})`}
        />
        
        {/* Puntos en los datos */}
        {data.map((value, index) => (
          <circle
            key={index}
            cx={(index * 100) / (data.length - 1)}
            cy={height - (value / Math.max(...data)) * height}
            r="3"
            fill={color}
            style={{ filter: 'drop-shadow(0 0 3px rgba(255,255,255,0.5))' }}
          />
        ))}
      </svg>
    </Box>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      style={{ padding: '2rem', minHeight: '100vh' }}
    >
      {/* Header con filtros de tiempo */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}>
            📊 Analytics Dashboard
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            Métricas y estadísticas en tiempo real
          </Typography>
        </Box>
        
        <ButtonGroup variant="outlined" sx={{ '& .MuiButton-root': { color: 'white', borderColor: 'rgba(255,255,255,0.3)' } }}>
          {['week', 'month', 'year'].map((range) => (
            <Button
              key={range}
              onClick={() => handleTimeRangeChange(range)}
              variant={timeRange === range ? 'contained' : 'outlined'}
              sx={{
                ...(timeRange === range && {
                  background: 'linear-gradient(45deg, #667eea, #764ba2)',
                })
              }}
            >
              {range === 'week' ? 'Semana' : range === 'month' ? 'Mes' : 'Año'}
            </Button>
          ))}
        </ButtonGroup>
      </Box>

      {/* Métricas principales */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} lg={2}>
          <MetricCard
            title="Visitantes"
            value={metrics.visitors.value}
            change={metrics.visitors.change}
            trend={metrics.visitors.trend}
            icon={FaUsers}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={2}>
          <MetricCard
            title="Páginas vistas"
            value={metrics.pageViews.value}
            change={metrics.pageViews.change}
            trend={metrics.pageViews.trend}
            icon={FaEye}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={2}>
          <MetricCard
            title="Usuarios"
            value={metrics.users.value}
            change={metrics.users.change}
            trend={metrics.users.trend}
            icon={People}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={2}>
          <MetricCard
            title="Ingresos"
            value={metrics.revenue.value}
            change={metrics.revenue.change}
            trend={metrics.revenue.trend}
            icon={FaDollarSign}
            suffix="€"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={2}>
          <MetricCard
            title="Rebote"
            value={metrics.bounceRate.value}
            change={metrics.bounceRate.change}
            trend={metrics.bounceRate.trend}
            icon={TrendingDown}
            suffix="%"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={2}>
          <MetricCard
            title="Sesión Avg"
            value={metrics.avgSession.value}
            change={metrics.avgSession.change}
            trend={metrics.avgSession.trend}
            icon={Schedule}
            suffix="min"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Gráfico de visitantes */}
        <Grid item xs={12} lg={8}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card sx={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white'
            }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                  <FaChartLine style={{ marginRight: 8, color: '#667eea' }} />
                  Tráfico de Visitantes
                </Typography>
                <SimpleChart data={chartData.visitors} color="#667eea" height={120} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                  {chartData.labels.map((label, index) => (
                    <Typography key={label} variant="caption" sx={{ opacity: 0.7 }}>
                      {label}
                    </Typography>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Dispositivos */}
        <Grid item xs={12} lg={4}>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card sx={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white'
            }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  Dispositivos
                </Typography>
                {deviceStats.map((device, index) => (
                  <Box key={device.device} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <device.icon style={{ marginRight: 8, color: device.color }} />
                        <Typography variant="body2">{device.device}</Typography>
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {device.percentage}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={device.percentage}
                      sx={{
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: device.color
                        }
                      }}
                    />
                  </Box>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Páginas más visitadas */}
        <Grid item xs={12} lg={6}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card sx={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white'
            }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  <FaFire style={{ marginRight: 8, color: '#fd79a8' }} />
                  Páginas Populares
                </Typography>
                <List>
                  {topPages.map((page, index) => (
                    <ListItem key={page.path} sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 35 }}>
                        <Chip
                          label={index + 1}
                          size="small"
                          sx={{
                            backgroundColor: index < 3 ? '#ffd700' : 'rgba(255,255,255,0.1)',
                            color: index < 3 ? '#000' : '#fff',
                            fontWeight: 'bold',
                            width: 24,
                            height: 24
                          }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={page.path}
                        secondary={
                          <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                              {page.views.toLocaleString()} vistas
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                              {page.time} avg
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Actividad reciente */}
        <Grid item xs={12} lg={6}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card sx={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white'
            }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  ⚡ Actividad Reciente
                </Typography>
                <List>
                  {recentActivity.map((activity, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemIcon>
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            fontSize: '0.75rem',
                            background: 'linear-gradient(45deg, #667eea, #764ba2)'
                          }}
                        >
                          {activity.avatar}
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="body2">
                            <strong>{activity.user}</strong> {activity.action}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                            hace {activity.time}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>
    </motion.div>
  );
};

export default Analytics; 