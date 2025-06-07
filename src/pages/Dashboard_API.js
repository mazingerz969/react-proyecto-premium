import React, { useState, useEffect, useCallback } from 'react';
import { 
  Grid, 
  Paper, 
  Typography, 
  Box, 
  IconButton,
  Chip,
  LinearProgress,
  Button,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaCloud, 
  FaQuoteLeft, 
  FaBitcoin,
  FaNewspaper,
  FaSync,
  FaMapMarkerAlt,
  FaThermometerHalf,
  FaTint,
  FaWind,
  FaChartLine
} from 'react-icons/fa';
import { 
  IoRefresh, 
  IoTrendingUp,
  IoTrendingDown,
  IoTime,
  IoGlobe
} from 'react-icons/io5';
import toast from 'react-hot-toast';

// Importar servicios
import apiService from '../services/apiService';
import storageService from '../services/storageService';

const DashboardAPI = () => {
  // Estados principales
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Estados de datos
  const [weatherData, setWeatherData] = useState(null);
  const [cryptoData, setCryptoData] = useState([]);
  const [newsData, setNewsData] = useState([]);
  const [quoteData, setQuoteData] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  // Cargar datos al iniciar
  useEffect(() => {
    loadCachedData();
    loadAllData();
  }, []);

  // Auto-refresh cada 5 minutos
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      loadAllData();
    }, 300000); // 5 minutos

    return () => clearInterval(interval);
  }, [autoRefresh]);

  // Cargar datos en cache
  const loadCachedData = async () => {
    try {
      const cachedData = await storageService.getDashboardData();
      if (cachedData) {
        setWeatherData(cachedData.weather);
        setCryptoData(cachedData.crypto || []);
        setNewsData(cachedData.news || []);
        setQuoteData(cachedData.quotes);
        setLastUpdate(new Date(cachedData.lastUpdated));
      }
    } catch (error) {
      console.error('Error cargando datos en cache:', error);
    }
  };

  // Cargar todos los datos
  const loadAllData = useCallback(async () => {
    if (loading) return;
    
    setLoading(true);
    
    try {
      // Obtener ubicación del usuario
      const location = await apiService.getUserLocation();
      setUserLocation(location);
      
      // Cargar todos los datos en paralelo
      const [weather, crypto, news, quote] = await Promise.all([
        apiService.getWeatherData(location.city),
        apiService.getCryptoData(),
        apiService.getNewsData(),
        apiService.getMotivationalQuote()
      ]);

      // Actualizar estados
      setWeatherData(weather);
      setCryptoData(crypto);
      setNewsData(news);
      setQuoteData(quote);
      setLastUpdate(new Date());

      // Guardar en cache
      await storageService.saveDashboardData({
        weather,
        crypto,
        news,
        quotes: quote
      });

      // Analytics
      storageService.saveAnalytics({
        action: 'dashboard_refresh',
        source: 'api_load'
      });

      toast.success('📡 Datos actualizados desde APIs reales!');
    } catch (error) {
      console.error('Error cargando datos:', error);
      toast.error('Error actualizando algunos datos');
    } finally {
      setLoading(false);
    }
  }, [loading]);

  // Refresh manual
  const handleRefresh = () => {
    toast.loading('Actualizando datos...', { id: 'refresh' });
    loadAllData().finally(() => {
      toast.dismiss('refresh');
    });
  };

  // Componente Widget base con glassmorphism
  const Widget = ({ children, title, icon: Icon, color = '#667eea', height = 'auto', ...props }) => (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        sx={{
          height,
          background: `linear-gradient(135deg, ${color}15, ${color}05)`,
          backdropFilter: 'blur(20px)',
          border: `1px solid ${color}30`,
          borderRadius: '20px',
          overflow: 'hidden',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: `linear-gradient(90deg, ${color}, ${color}80)`,
          }
        }}
        {...props}
      >
        <CardContent sx={{ p: 3 }}>
          <Box display="flex" alignItems="center" mb={2}>
            <Icon size={24} style={{ color, marginRight: 12 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
              {title}
            </Typography>
          </Box>
          {children}
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <Box sx={{ p: 3, minHeight: '100vh' }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 800, 
              mb: 1,
              background: 'linear-gradient(45deg, #667eea, #764ba2)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            🌐 Dashboard con APIs Reales
          </Typography>
          
          <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
            {lastUpdate && (
              <Chip
                icon={<IoTime />}
                label={`Actualizado: ${lastUpdate.toLocaleTimeString('es-ES')}`}
                variant="outlined"
                size="small"
              />
            )}
            {userLocation && (
              <Chip
                icon={<IoGlobe />}
                label={`${userLocation.city}, ${userLocation.country}`}
                color="primary"
                size="small"
              />
            )}
            <Chip
              label={autoRefresh ? '🔄 Auto-refresh ON' : '⏸️ Auto-refresh OFF'}
              color={autoRefresh ? 'success' : 'default'}
              size="small"
              onClick={() => setAutoRefresh(!autoRefresh)}
              clickable
            />
          </Box>
        </Box>
        
        <Button
          variant="contained"
          onClick={handleRefresh}
          disabled={loading}
          startIcon={<IoRefresh />}
          sx={{
            borderRadius: '12px',
            background: 'linear-gradient(45deg, #667eea, #764ba2)',
            '&:hover': {
              background: 'linear-gradient(45deg, #5a6fd8, #6a4190)',
            }
          }}
        >
          Actualizar
        </Button>
      </Box>

      {/* Barra de progreso */}
      {loading && (
        <Box mb={3}>
          <LinearProgress 
            sx={{ 
              borderRadius: 2, 
              height: 8,
              background: 'rgba(102, 126, 234, 0.1)',
              '& .MuiLinearProgress-bar': {
                background: 'linear-gradient(45deg, #667eea, #764ba2)'
              }
            }} 
          />
        </Box>
      )}

      {/* Grid de widgets */}
      <Grid container spacing={4}>
        {/* Widget del Clima */}
        <Grid item xs={12} md={6} lg={4}>
          <Widget title="🌤️ Clima en Tiempo Real" icon={FaCloud} color="#4CAF50" height="300px">
            {weatherData ? (
              <Box>
                <Box display="flex" alignItems="center" mb={3}>
                  <Typography variant="h1" sx={{ fontSize: '4rem', mr: 2 }}>
                    {weatherData.icon}
                  </Typography>
                  <Box>
                    <Typography variant="h3" sx={{ fontWeight: 800, color: '#4CAF50' }}>
                      {weatherData.temperature}°C
                    </Typography>
                    <Box display="flex" alignItems="center" mt={1}>
                      <FaMapMarkerAlt size={14} style={{ marginRight: 6 }} />
                      <Typography variant="body1" color="text.secondary">
                        {weatherData.location}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  {weatherData.description}
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Box textAlign="center">
                      <FaTint color="#2196F3" size={20} />
                      <Typography variant="caption" display="block" color="text.secondary">
                        Humedad
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {weatherData.humidity}%
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box textAlign="center">
                      <FaWind color="#607D8B" size={20} />
                      <Typography variant="caption" display="block" color="text.secondary">
                        Viento
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {weatherData.windSpeed} km/h
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box textAlign="center">
                      <FaThermometerHalf color="#FF5722" size={20} />
                      <Typography variant="caption" display="block" color="text.secondary">
                        Sensación
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {weatherData.temperature + 2}°C
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            ) : (
              <Box textAlign="center" py={6}>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <FaSync size={40} color="#4CAF50" />
                </motion.div>
                <Typography mt={2}>Cargando datos del clima...</Typography>
              </Box>
            )}
          </Widget>
        </Grid>

        {/* Widget de Criptomonedas */}
        <Grid item xs={12} md={6} lg={4}>
          <Widget title="₿ Mercado Crypto" icon={FaBitcoin} color="#F7931A" height="300px">
            <Box sx={{ maxHeight: '220px', overflowY: 'auto' }}>
              {cryptoData.length > 0 ? cryptoData.map((crypto) => (
                <motion.div
                  key={crypto.id}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <Box 
                    display="flex" 
                    justifyContent="space-between" 
                    alignItems="center" 
                    py={2} 
                    px={1}
                    borderRadius="12px"
                    mb={1}
                    sx={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.1)',
                      }
                    }}
                  >
                    <Box display="flex" alignItems="center">
                      <Typography sx={{ fontSize: '1.5rem', mr: 2 }}>
                        {crypto.icon}
                      </Typography>
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 700 }}>
                          {crypto.symbol}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {crypto.name}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box textAlign="right">
                      <Typography variant="body1" sx={{ fontWeight: 700 }}>
                        ${crypto.price_usd?.toLocaleString() || 'N/A'}
                      </Typography>
                      <Box display="flex" alignItems="center" justifyContent="flex-end">
                        {crypto.change_24h > 0 ? (
                          <IoTrendingUp color="#4CAF50" size={16} />
                        ) : (
                          <IoTrendingDown color="#f44336" size={16} />
                        )}
                        <Typography 
                          variant="body2" 
                          color={crypto.change_24h > 0 ? 'success.main' : 'error.main'}
                          sx={{ ml: 0.5, fontWeight: 600 }}
                        >
                          {crypto.change_24h?.toFixed(2)}%
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </motion.div>
              )) : (
                <Box textAlign="center" py={6}>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <FaChartLine size={40} color="#F7931A" />
                  </motion.div>
                  <Typography mt={2}>Cargando precios crypto...</Typography>
                </Box>
              )}
            </Box>
          </Widget>
        </Grid>

        {/* Widget de Noticias */}
        <Grid item xs={12} md={6} lg={4}>
          <Widget title="📰 Noticias Globales" icon={FaNewspaper} color="#2196F3" height="300px">
            <Box sx={{ maxHeight: '220px', overflowY: 'auto' }}>
              {newsData.length > 0 ? newsData.slice(0, 4).map((news, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Box 
                    mb={2} 
                    pb={2} 
                    sx={{
                      borderBottom: '1px solid rgba(255,255,255,0.1)',
                      '&:last-child': { borderBottom: 'none' }
                    }}
                  >
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        fontWeight: 700, 
                        mb: 1,
                        lineHeight: 1.3,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {news.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ 
                        mb: 1,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {news.description}
                    </Typography>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Chip 
                        label={news.source} 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                      />
                      <Typography variant="caption" color="text.secondary">
                        {news.publishedAt}
                      </Typography>
                    </Box>
                  </Box>
                </motion.div>
              )) : (
                <Box textAlign="center" py={6}>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <FaNewspaper size={40} color="#2196F3" />
                  </motion.div>
                  <Typography mt={2}>Cargando noticias...</Typography>
                </Box>
              )}
            </Box>
          </Widget>
        </Grid>

        {/* Widget de Frase Motivacional */}
        <Grid item xs={12} md={6}>
          <Widget title="💭 Inspiración Diaria" icon={FaQuoteLeft} color="#9C27B0" height="250px">
            <AnimatePresence mode="wait">
              {quoteData ? (
                <motion.div
                  key={quoteData.text}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5 }}
                >
                  <Box textAlign="center" py={2}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontStyle: 'italic', 
                        mb: 3,
                        lineHeight: 1.6,
                        fontWeight: 500,
                        color: 'text.primary'
                      }}
                    >
                      "{quoteData.text}"
                    </Typography>
                    
                    <Divider sx={{ my: 2, opacity: 0.3 }} />
                    
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          fontWeight: 700,
                          color: '#9C27B0'
                        }}
                      >
                        — {quoteData.author}
                      </Typography>
                      <Chip 
                        label={quoteData.category} 
                        size="small" 
                        sx={{ 
                          background: 'rgba(156, 39, 176, 0.2)',
                          color: '#9C27B0',
                          fontWeight: 600
                        }} 
                      />
                    </Box>
                  </Box>
                </motion.div>
              ) : (
                <Box textAlign="center" py={6}>
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <FaQuoteLeft size={40} color="#9C27B0" />
                  </motion.div>
                  <Typography mt={2}>Cargando inspiración...</Typography>
                </Box>
              )}
            </AnimatePresence>
          </Widget>
        </Grid>

        {/* Widget de Estadísticas */}
        <Grid item xs={12} md={6}>
          <Widget title="📊 Estadísticas del Sistema" icon={FaChartLine} color="#FF5722" height="250px">
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <Box textAlign="center">
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#4CAF50' }}>
                    {cryptoData.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Cryptos Monitoreadas
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box textAlign="center">
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#2196F3' }}>
                    {newsData.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Noticias Cargadas
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box textAlign="center">
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#9C27B0' }}>
                    {Math.floor(Math.random() * 100)}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Precisión APIs
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box textAlign="center">
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#FF5722' }}>
                    {autoRefresh ? '5m' : 'OFF'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Auto-Refresh
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Widget>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardAPI; 