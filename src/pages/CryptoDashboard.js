import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import {
  Card,
  CardContent, 
  Typography,
  Grid,
  Box,
  Chip,
  Button,
  ButtonGroup,
  CircularProgress,
  Avatar,
  TextField,
  InputAdornment,
  IconButton,
  Badge,
  Tabs,
  Tab
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Search,
  Refresh,
  Star,
  StarBorder,
  AttachMoney,
  ShowChart,
  Timeline
} from '@mui/icons-material';
import { 
  FaBitcoin, 
  FaEthereum, 
  FaChartLine,
  FaFire,
  FaRocket,
  FaGem,
  FaDollarSign,
  FaArrowUp,
  FaArrowDown,
  FaExchangeAlt
} from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import toast from 'react-hot-toast';

const CryptoDashboard = () => {
  const [cryptoData, setCryptoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState(['bitcoin', 'ethereum', 'binancecoin']);
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [marketStats, setMarketStats] = useState({
    totalMarketCap: 0,
    total24hVolume: 0,
    btcDominance: 0,
    activeCryptocurrencies: 0
  });
  const [currentTab, setCurrentTab] = useState(0);

  // API de CoinGecko (gratuita)
  const API_BASE = 'https://api.coingecko.com/api/v3';

  useEffect(() => {
    fetchCryptoData();
    fetchMarketStats();
    const interval = setInterval(() => {
      fetchCryptoData();
      fetchMarketStats();
    }, 60000); // Actualizar cada minuto

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedCrypto) {
      fetchChartData(selectedCrypto.id);
    }
  }, [selectedCrypto, selectedTimeframe]);

  const fetchCryptoData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=1h%2C24h%2C7d`
      );
      setCryptoData(response.data);
      if (!selectedCrypto && response.data.length > 0) {
        setSelectedCrypto(response.data[0]);
      }
      toast.success('💰 Datos crypto actualizados', { duration: 2000 });
    } catch (error) {
      console.error('Error fetching crypto data:', error);
      toast.error('Error al cargar datos crypto');
    } finally {
      setLoading(false);
    }
  };

  const fetchMarketStats = async () => {
    try {
      const response = await axios.get(`${API_BASE}/global`);
      const data = response.data.data;
      setMarketStats({
        totalMarketCap: data.total_market_cap.usd,
        total24hVolume: data.total_volume.usd,
        btcDominance: data.market_cap_percentage.btc,
        activeCryptocurrencies: data.active_cryptocurrencies
      });
    } catch (error) {
      console.error('Error fetching market stats:', error);
    }
  };

  const fetchChartData = async (cryptoId) => {
    try {
      const days = selectedTimeframe === '24h' ? '1' : selectedTimeframe === '7d' ? '7' : '30';
      const response = await axios.get(
        `${API_BASE}/coins/${cryptoId}/market_chart?vs_currency=usd&days=${days}`
      );
      
      const formattedData = response.data.prices.map((price, index) => ({
        time: new Date(price[0]).toLocaleDateString(),
        price: price[1],
        volume: response.data.total_volumes[index] ? response.data.total_volumes[index][1] : 0
      }));
      
      setChartData(formattedData);
    } catch (error) {
      console.error('Error fetching chart data:', error);
    }
  };

  const toggleFavorite = (cryptoId) => {
    setFavorites(prev => 
      prev.includes(cryptoId) 
        ? prev.filter(id => id !== cryptoId)
        : [...prev, cryptoId]
    );
    toast.success(
      favorites.includes(cryptoId) ? '💔 Eliminado de favoritos' : '⭐ Agregado a favoritos',
      { duration: 2000 }
    );
  };

  const filteredCryptos = cryptoData.filter(crypto =>
    crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatPrice = (price) => {
    if (price < 1) return `$${price.toFixed(6)}`;
    if (price < 100) return `$${price.toFixed(4)}`;
    return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
  };

  const formatMarketCap = (marketCap) => {
    if (marketCap >= 1e12) return `$${(marketCap / 1e12).toFixed(2)}T`;
    if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(2)}B`;
    if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(2)}M`;
    return `$${marketCap.toLocaleString()}`;
  };

  const MarketStatsCard = () => (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {[
        { 
          title: 'Market Cap Total', 
          value: formatMarketCap(marketStats.totalMarketCap),
          icon: FaDollarSign,
          color: '#667eea'
        },
        { 
          title: 'Volumen 24h', 
          value: formatMarketCap(marketStats.total24hVolume),
          icon: FaExchangeAlt,
          color: '#764ba2'
        },
        { 
          title: 'Dominancia BTC', 
          value: `${marketStats.btcDominance.toFixed(1)}%`,
          icon: FaBitcoin,
          color: '#f7931a'
        },
        { 
          title: 'Cryptos Activas', 
          value: marketStats.activeCryptocurrencies.toLocaleString(),
          icon: FaGem,
          color: '#fd79a8'
        }
      ].map((stat, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card sx={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white'
            }}>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                  <stat.icon style={{ fontSize: 20, color: stat.color, marginRight: 8 }} />
                  <Typography variant="body2" sx={{ opacity: 0.8, fontSize: '0.75rem' }}>
                    {stat.title}
                  </Typography>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: stat.color }}>
                  {stat.value}
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      ))}
    </Grid>
  );

  const CryptoCard = ({ crypto, index }) => {
    const isPositive = crypto.price_change_percentage_24h > 0;
    const isFavorite = favorites.includes(crypto.id);

    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
        whileHover={{ scale: 1.02 }}
        onClick={() => setSelectedCrypto(crypto)}
      >
        <Card sx={{
          background: selectedCrypto?.id === crypto.id 
            ? 'rgba(102, 126, 234, 0.2)' 
            : 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: selectedCrypto?.id === crypto.id 
            ? '2px solid #667eea' 
            : '1px solid rgba(255, 255, 255, 0.2)',
          color: 'white',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}>
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar
                  src={crypto.image}
                  sx={{ width: 32, height: 32, mr: 1 }}
                />
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    {crypto.symbol.toUpperCase()}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.7 }}>
                    #{crypto.market_cap_rank}
                  </Typography>
                </Box>
              </Box>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(crypto.id);
                }}
                sx={{ color: isFavorite ? '#ffd700' : 'rgba(255,255,255,0.5)' }}
              >
                {isFavorite ? <Star /> : <StarBorder />}
              </IconButton>
            </Box>

            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
              {formatPrice(crypto.current_price)}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Chip
                icon={isPositive ? <FaArrowUp /> : <FaArrowDown />}
                label={`${Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%`}
                size="small"
                sx={{
                  backgroundColor: isPositive ? 'rgba(0, 184, 148, 0.2)' : 'rgba(255, 107, 107, 0.2)',
                  color: isPositive ? '#00b894' : '#ff6b6b',
                  fontWeight: 'bold'
                }}
              />
              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                {formatMarketCap(crypto.market_cap)}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  const PriceChart = () => (
    <Card sx={{
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      color: 'white'
    }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {selectedCrypto && (
              <Avatar src={selectedCrypto.image} sx={{ width: 24, height: 24, mr: 1 }} />
            )}
            <Typography variant="h6">
              {selectedCrypto?.name} ({selectedCrypto?.symbol.toUpperCase()})
            </Typography>
          </Box>
          <ButtonGroup size="small">
            {['24h', '7d', '30d'].map((timeframe) => (
              <Button
                key={timeframe}
                variant={selectedTimeframe === timeframe ? 'contained' : 'outlined'}
                onClick={() => setSelectedTimeframe(timeframe)}
                sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}
              >
                {timeframe}
              </Button>
            ))}
          </ButtonGroup>
        </Box>
        
        <Box sx={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#667eea" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#667eea" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#fff', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#fff', fontSize: 12 }} />
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(0,0,0,0.8)', 
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '10px',
                  color: 'white'
                }}
                formatter={(value) => [formatPrice(value), 'Precio']}
              />
              <Area 
                type="monotone" 
                dataKey="price" 
                stroke="#667eea" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorPrice)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ padding: '20px', color: 'white', minHeight: '100vh' }}
    >
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2, display: 'flex', alignItems: 'center' }}>
          <FaBitcoin style={{ color: '#f7931a', marginRight: 12 }} />
          Crypto Dashboard
          <Chip 
            label="LIVE" 
            size="small" 
            sx={{ 
              ml: 2, 
              backgroundColor: '#ff4757', 
              color: 'white',
              animation: 'pulse 2s infinite'
            }} 
          />
        </Typography>
        
        <TextField
          fullWidth
          placeholder="Buscar criptomoneda..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: 'rgba(255,255,255,0.7)' }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={fetchCryptoData} sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  <Refresh />
                </IconButton>
              </InputAdornment>
            )
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              color: 'white',
              '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
              '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
              '&.Mui-focused fieldset': { borderColor: '#667eea' }
            }
          }}
        />
      </Box>

      {/* Market Stats */}
      <MarketStatsCard />

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Crypto List */}
        <Grid item xs={12} md={4}>
          <Card sx={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: 'white',
            maxHeight: '600px',
            overflow: 'auto'
          }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <FaFire style={{ color: '#ff6b6b', marginRight: 8 }} />
                Top Cryptos
                {loading && <CircularProgress size={16} sx={{ ml: 2, color: '#667eea' }} />}
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {loading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <Box key={index} sx={{ height: 80, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 2 }} />
                  ))
                ) : (
                  filteredCryptos.slice(0, 20).map((crypto, index) => (
                    <CryptoCard key={crypto.id} crypto={crypto} index={index} />
                  ))
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Chart and Details */}
        <Grid item xs={12} md={8}>
          {selectedCrypto && <PriceChart />}
        </Grid>
      </Grid>

      {/* CSS para animaciones */}
      <style>
        {`
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
          }
        `}
      </style>
    </motion.div>
  );
};

export default CryptoDashboard; 