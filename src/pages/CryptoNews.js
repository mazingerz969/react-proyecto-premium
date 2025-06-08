import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Chip,
  Avatar,
  Button,
  Skeleton,
  Badge,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  FaNewspaper,
  FaExternalLinkAlt,
  FaCalendarAlt,
  FaThumbsUp,
  FaThumbsDown,
  FaEye,
  FaShare,
  FaBookmark,
  FaFire,
  FaChartLine,
  FaGlobe,
  FaSearch,
  FaFilter
} from 'react-icons/fa';
import { useTheme } from '../theme/ThemeProvider';
import toast from 'react-hot-toast';

const CryptoNews = () => {
  const { theme } = useTheme();
  const [news, setNews] = useState([]);
  const [trendingTopics, setTrendingTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sentiment, setSentiment] = useState({ positive: 0, negative: 0, neutral: 0 });

  // Categorías de noticias
  const categories = [
    { id: 'all', name: 'Todas', icon: FaGlobe, color: '#667eea' },
    { id: 'bitcoin', name: 'Bitcoin', icon: FaChartLine, color: '#f7931a' },
    { id: 'ethereum', name: 'Ethereum', icon: FaFire, color: '#627eea' },
    { id: 'defi', name: 'DeFi', icon: FaThumbsUp, color: '#00d2ff' },
    { id: 'nft', name: 'NFTs', icon: FaEye, color: '#ff6b6b' },
    { id: 'regulation', name: 'Regulación', icon: FaFilter, color: '#feca57' }
  ];

  useEffect(() => {
    fetchCryptoNews();
    fetchTrendingTopics();
  }, [selectedCategory]);

  // Fetch crypto news from multiple sources
  const fetchCryptoNews = async () => {
    try {
      setLoading(true);

      // Simulación de datos de noticias crypto (en un proyecto real usarías NewsAPI, CoinTelegraph API, etc.)
      const mockNews = [
        {
          id: 1,
          title: "Bitcoin Alcanza Nuevo ATH Después de Aprobación de ETF",
          description: "El precio de Bitcoin rompe barreras históricas tras la aprobación del primer ETF spot en Estados Unidos, generando optimismo en el mercado.",
          url: "https://cointelegraph.com/bitcoin-ath",
          source: "CoinTelegraph",
          publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
          category: "bitcoin",
          sentiment: "positive",
          image: "https://images.cointelegraph.com/bitcoin-ath.jpg",
          views: 15420,
          likes: 892,
          author: "Sarah Johnson",
          readTime: "3 min"
        },
        {
          id: 2,
          title: "Ethereum 2.0: La Actualización que Cambiará Todo",
          description: "La transición completa a Proof of Stake promete reducir el consumo energético en un 99% y aumentar la escalabilidad.",
          url: "https://decrypt.co/ethereum-2",
          source: "Decrypt",
          publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
          category: "ethereum",
          sentiment: "positive",
          image: "https://decrypt.co/eth2-update.jpg",
          views: 12150,
          likes: 675,
          author: "Michael Chen",
          readTime: "5 min"
        },
        {
          id: 3,
          title: "Regulación Crypto: SEC Emite Nuevas Directrices",
          description: "La Comisión de Valores planea implementar marcos regulatorios más claros para el ecosistema de criptomonedas.",
          url: "https://coindesk.com/sec-regulation",
          source: "CoinDesk",
          publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
          category: "regulation",
          sentiment: "neutral",
          image: "https://coindesk.com/sec-crypto.jpg",
          views: 8930,
          likes: 423,
          author: "Jennifer Liu",
          readTime: "4 min"
        },
        {
          id: 4,
          title: "DeFi Protocols Lose $50M in Flash Loan Attack",
          description: "Multiple DeFi platforms suffer coordinated attack exploiting smart contract vulnerabilities, raising security concerns.",
          url: "https://theblock.co/defi-hack",
          source: "The Block",
          publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
          category: "defi",
          sentiment: "negative",
          image: "https://theblock.co/defi-hack.jpg",
          views: 22100,
          likes: 234,
          author: "Robert Kim",
          readTime: "6 min"
        },
        {
          id: 5,
          title: "NFT Market Rebounds with Celebrity Collections",
          description: "High-profile celebrity NFT drops drive renewed interest in digital collectibles market after months of decline.",
          url: "https://nftevening.com/celebrity-nft",
          source: "NFT Evening",
          publishedAt: new Date(Date.now() - 18 * 60 * 60 * 1000),
          category: "nft",
          sentiment: "positive",
          image: "https://nftevening.com/celebrity.jpg",
          views: 9870,
          likes: 567,
          author: "Alex Rivera",
          readTime: "3 min"
        },
        {
          id: 6,
          title: "Central Bank Digital Currencies Gain Momentum Globally",
          description: "Over 90% of central banks worldwide are exploring or piloting digital versions of their national currencies.",
          url: "https://coindesk.com/cbdc-adoption",
          source: "CoinDesk",
          publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
          category: "regulation",
          sentiment: "neutral",
          image: "https://coindesk.com/cbdc.jpg",
          views: 11340,
          likes: 445,
          author: "Dr. Emily Watson",
          readTime: "7 min"
        }
      ];

      // Filtrar por categoría
      const filteredNews = selectedCategory === 'all' 
        ? mockNews 
        : mockNews.filter(item => item.category === selectedCategory);

      setNews(filteredNews);

      // Calcular análisis de sentimiento
      const sentimentAnalysis = mockNews.reduce((acc, item) => {
        acc[item.sentiment]++;
        return acc;
      }, { positive: 0, negative: 0, neutral: 0 });

      setSentiment(sentimentAnalysis);

    } catch (error) {
      console.error('Error fetching crypto news:', error);
      toast.error('Error al cargar noticias crypto');
    } finally {
      setLoading(false);
    }
  };

  // Fetch trending topics
  const fetchTrendingTopics = async () => {
    try {
      // Simulación de trending topics
      const topics = [
        { name: "Bitcoin ETF", mentions: 15420, change: "+245%" },
        { name: "Ethereum Merge", mentions: 12890, change: "+89%" },
        { name: "DeFi Security", mentions: 8760, change: "-12%" },
        { name: "NFT Gaming", mentions: 6540, change: "+156%" },
        { name: "CBDC", mentions: 4320, change: "+67%" }
      ];

      setTrendingTopics(topics);
    } catch (error) {
      console.error('Error fetching trending topics:', error);
    }
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Hace menos de 1 hora';
    if (diffInHours === 1) return 'Hace 1 hora';
    if (diffInHours < 24) return `Hace ${diffInHours} horas`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return 'Hace 1 día';
    return `Hace ${diffInDays} días`;
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive': return '#00b894';
      case 'negative': return '#e17055';
      default: return '#fdcb6e';
    }
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive': return <FaThumbsUp />;
      case 'negative': return <FaThumbsDown />;
      default: return <FaEye />;
    }
  };

  const handleShare = (article) => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.description,
        url: article.url
      });
    } else {
      navigator.clipboard.writeText(article.url);
      toast.success('Enlace copiado al portapapeles!');
    }
  };

  const NewsCard = ({ article }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ duration: 0.3 }}
    >
      <Card sx={{
        background: theme.cardBg,
        backdropFilter: 'blur(10px)',
        border: `1px solid ${theme.glassEffect}`,
        color: theme.textColor,
        height: '100%',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Badge de sentimiento */}
        <Box sx={{ 
          position: 'absolute', 
          top: 12, 
          right: 12, 
          zIndex: 2 
        }}>
          <Tooltip title={`Sentimiento: ${article.sentiment}`}>
            <Chip
              icon={getSentimentIcon(article.sentiment)}
              label={article.sentiment.toUpperCase()}
              size="small"
              sx={{
                backgroundColor: getSentimentColor(article.sentiment),
                color: 'white',
                fontWeight: 'bold'
              }}
            />
          </Tooltip>
        </Box>

        {/* Imagen del artículo */}
        <Box sx={{ 
          height: 200, 
          background: `linear-gradient(45deg, ${theme.primary}, ${theme.secondary})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}>
          <FaNewspaper style={{ fontSize: 48, opacity: 0.3, color: 'white' }} />
          <Box sx={{
            position: 'absolute',
            bottom: 8,
            left: 8,
            backgroundColor: 'rgba(0,0,0,0.7)',
            borderRadius: '12px',
            padding: '4px 8px'
          }}>
            <Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold' }}>
              {article.source}
            </Typography>
          </Box>
        </Box>

        <CardContent sx={{ p: 2 }}>
          {/* Título */}
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 'bold', 
              mb: 1,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {article.title}
          </Typography>

          {/* Descripción */}
          <Typography 
            variant="body2" 
            sx={{ 
              opacity: 0.8, 
              mb: 2,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {article.description}
          </Typography>

          {/* Metadatos */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
            <Chip 
              label={formatTimeAgo(article.publishedAt)}
              size="small"
              icon={<FaCalendarAlt />}
              sx={{ backgroundColor: theme.glassEffect }}
            />
            <Chip 
              label={`${article.views.toLocaleString()} vistas`}
              size="small"
              icon={<FaEye />}
              sx={{ backgroundColor: theme.glassEffect }}
            />
            <Chip 
              label={article.readTime}
              size="small"
              sx={{ backgroundColor: theme.glassEffect }}
            />
          </Box>

          {/* Autor */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar 
              sx={{ 
                width: 32, 
                height: 32, 
                mr: 1,
                backgroundColor: theme.primary
              }}
            >
              {article.author.charAt(0)}
            </Avatar>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              {article.author}
            </Typography>
          </Box>

          {/* Acciones */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button
              variant="contained"
              size="small"
              startIcon={<FaExternalLinkAlt />}
              onClick={() => window.open(article.url, '_blank')}
              sx={{ borderRadius: '20px' }}
            >
              Leer más
            </Button>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton 
                size="small" 
                onClick={() => handleShare(article)}
                sx={{ color: theme.textColor }}
              >
                <FaShare />
              </IconButton>
              <IconButton 
                size="small"
                sx={{ color: theme.textColor }}
              >
                <FaBookmark />
              </IconButton>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <IconButton 
                  size="small"
                  sx={{ color: '#00b894' }}
                >
                  <FaThumbsUp />
                </IconButton>
                <Typography variant="caption">
                  {article.likes}
                </Typography>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );

  const TrendingCard = ({ topic, index }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card sx={{
        background: theme.glassEffect,
        backdropFilter: 'blur(10px)',
        border: `1px solid ${theme.primary}`,
        color: theme.textColor,
        mb: 1
      }}>
        <CardContent sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                #{index + 1} {topic.name}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                {topic.mentions.toLocaleString()} menciones
              </Typography>
            </Box>
            <Chip 
              label={topic.change}
              size="small"
              sx={{
                backgroundColor: topic.change.includes('+') ? '#00b894' : '#e17055',
                color: 'white',
                fontWeight: 'bold'
              }}
            />
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ padding: '20px', minHeight: '100vh' }}
    >
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2, color: 'white', display: 'flex', alignItems: 'center' }}>
          <FaNewspaper style={{ color: theme.primary, marginRight: 12 }} />
          Noticias Crypto
          <Chip 
            label="En Vivo"
            size="small" 
            sx={{ 
              ml: 2, 
              backgroundColor: '#e17055', 
              color: 'white',
              fontWeight: 'bold',
              animation: 'pulse 2s infinite'
            }} 
          />
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Sidebar izquierdo */}
        <Grid item xs={12} md={3}>
          {/* Categorías */}
          <Card sx={{
            background: theme.cardBg,
            backdropFilter: 'blur(10px)',
            border: `1px solid ${theme.glassEffect}`,
            color: theme.textColor,
            mb: 3
          }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <FaFilter style={{ marginRight: 8, color: theme.primary }} />
                Categorías
              </Typography>
              {categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <Button
                    key={category.id}
                    fullWidth
                    variant={selectedCategory === category.id ? "contained" : "outlined"}
                    startIcon={<IconComponent />}
                    onClick={() => setSelectedCategory(category.id)}
                    sx={{ 
                      mb: 1, 
                      justifyContent: 'flex-start',
                      borderRadius: '12px',
                      color: selectedCategory === category.id ? 'white' : theme.textColor,
                      borderColor: category.color,
                      backgroundColor: selectedCategory === category.id ? category.color : 'transparent'
                    }}
                  >
                    {category.name}
                  </Button>
                );
              })}
            </CardContent>
          </Card>

          {/* Trending Topics */}
          <Card sx={{
            background: theme.cardBg,
            backdropFilter: 'blur(10px)',
            border: `1px solid ${theme.glassEffect}`,
            color: theme.textColor
          }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <FaFire style={{ marginRight: 8, color: '#e17055' }} />
                Trending
              </Typography>
              {trendingTopics.map((topic, index) => (
                <TrendingCard key={topic.name} topic={topic} index={index} />
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Contenido principal */}
        <Grid item xs={12} md={9}>
          {/* Análisis de sentimiento */}
          <Card sx={{
            background: theme.cardBg,
            backdropFilter: 'blur(10px)',
            border: `1px solid ${theme.glassEffect}`,
            color: theme.textColor,
            mb: 3
          }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Análisis de Sentimiento del Mercado
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ color: '#00b894', fontWeight: 'bold' }}>
                      {sentiment.positive}
                    </Typography>
                    <Typography variant="body2">Positivo</Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ color: '#fdcb6e', fontWeight: 'bold' }}>
                      {sentiment.neutral}
                    </Typography>
                    <Typography variant="body2">Neutral</Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ color: '#e17055', fontWeight: 'bold' }}>
                      {sentiment.negative}
                    </Typography>
                    <Typography variant="body2">Negativo</Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Grid de noticias */}
          <Grid container spacing={3}>
            {loading ? (
              // Skeletons de carga
              Array.from({ length: 6 }).map((_, index) => (
                <Grid item xs={12} sm={6} lg={4} key={index}>
                  <Card sx={{ height: 400 }}>
                    <Skeleton variant="rectangular" height={200} />
                    <CardContent>
                      <Skeleton variant="text" height={32} />
                      <Skeleton variant="text" height={20} />
                      <Skeleton variant="text" height={20} />
                      <Box sx={{ mt: 2 }}>
                        <Skeleton variant="rounded" height={24} width={100} />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              news.map((article) => (
                <Grid item xs={12} sm={6} lg={4} key={article.id}>
                  <NewsCard article={article} />
                </Grid>
              ))
            )}
          </Grid>
        </Grid>
      </Grid>
    </motion.div>
  );
};

export default CryptoNews; 