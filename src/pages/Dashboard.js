import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaRocket, FaHeart, FaPlus, FaMinus, FaRedo, FaTrash, 
  FaStar, FaCheck, FaFire, FaGift, FaMagic, FaCalculator, FaClock, FaQrcode, FaCloud, FaQuoteLeft, FaChartLine, FaSync, FaBitcoin, FaNewspaper
} from 'react-icons/fa';
import { 
  IoSparkles, IoThunderstorm, IoColorPalette, 
  IoHappy, IoSad, IoHome, IoStatsChart, IoRefresh, IoSettings, IoTrendingUp, IoTrendingDown
} from 'react-icons/io5';
import { 
  BsLightning, BsHeart, BsStars, BsEmojiSunglasses,
  BsEmojiLaughing, BsEmojiWink 
} from 'react-icons/bs';
import { Button, Chip, Badge, Fab, IconButton, Box, Grid, Card, CardContent, Typography, LinearProgress, TextField } from '@mui/material';
import { Favorite, Add, Remove, Refresh, Delete, Star } from '@mui/icons-material';
import toast from 'react-hot-toast';
import Confetti from 'react-confetti';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../App.css';

// Importar servicios
import apiService from '../services/apiService';
import storageService from '../services/storageService';

function Dashboard() {
  const [contador, setContador] = useState(0);
  const [nombre, setNombre] = useState('');
  const [tareas, setTareas] = useState([
    'Aprender React 🚀',
    'Dominar las animaciones ✨',
    'Crear apps increíbles 🎯'
  ]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [mood, setMood] = useState('happy');

  // Nuevas funcionalidades para el Dashboard
  const [showCalculator, setShowCalculator] = useState(false);
  const [calculatorResult, setCalculatorResult] = useState('0');
  const [calculatorInput, setCalculatorInput] = useState('');
  
  const [qrText, setQrText] = useState('https://react-proyecto-premium.vercel.app');
  const [showQRGenerator, setShowQRGenerator] = useState(false);
  
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60); // 25 minutos
  const [pomodoroActive, setPomodoroActive] = useState(false);
  const [pomodoroType, setPomodoroType] = useState('work'); // work, break
  
  const [weather, setWeather] = useState({
    city: 'Madrid',
    temperature: 22,
    condition: 'Soleado',
    humidity: 65,
    wind: 12
  });

  const [quotes] = useState([
    "El código es poesía escrita en lógica. 💻",
    "Los errores son las escaleras hacia el éxito. 🚀",
    "Cada línea de código es un paso hacia la innovación. ✨",
    "La persistencia convierte lo imposible en inevitable. 💪",
    "Hoy es un gran día para crear algo increíble. 🎯"
  ]);
  const [currentQuote, setCurrentQuote] = useState(0);

  // Estados de carga y actualización
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(300000); // 5 minutos

  // Estados de datos
  const [weatherData, setWeatherData] = useState(null);
  const [cryptoData, setCryptoData] = useState([]);
  const [newsData, setNewsData] = useState([]);
  const [quoteData, setQuoteData] = useState(null);
  const [userPreferences, setUserPreferences] = useState(null);

  // Estados de estadísticas del sistema
  const [systemStats, setSystemStats] = useState({
    performance: 95,
    memory: 68,
    storage: 45,
    network: 88
  });

  // Inicializar AOS para animaciones de scroll
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease-out-cubic',
    });
  }, []);

  // Función para celebrar con confetti
  const celebrar = () => {
    setShowConfetti(true);
    toast.success('¡Felicidades! 🎉', {
      icon: '🎊',
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });
    setTimeout(() => setShowConfetti(false), 3000);
  };

  // Funciones del contador con notificaciones
  const incrementar = () => {
    setContador(contador + 1);
    if (contador + 1 === 10) {
      celebrar();
      toast('¡Llegaste a 10! 🔥', { icon: '🎯' });
    } else {
      toast.success(`Contador: ${contador + 1}`, { icon: '⬆️' });
    }
  };

  const decrementar = () => {
    setContador(contador - 1);
    if (contador - 1 < 0) {
      toast.error('¡No puedes ir más abajo! 😅', { icon: '⚠️' });
    } else {
      toast.success(`Contador: ${contador - 1}`, { icon: '⬇️' });
    }
  };

  const resetear = () => {
    setContador(0);
    toast('¡Contador reseteado! 🔄', { 
      icon: '🔄',
      style: { background: '#4f46e5', color: 'white' }
    });
  };

  // Funciones de tareas con notificaciones
  const agregarTarea = () => {
    if (nombre.trim()) {
      setTareas([...tareas, nombre]);
      setNombre('');
      toast.success('¡Tarea agregada! ✅', { icon: '📝' });
      
      if (tareas.length + 1 === 5) {
        celebrar();
        toast('¡5 tareas completadas! 🏆', { icon: '🎖️' });
      }
    } else {
      toast.error('Escribe algo primero 😊', { icon: '📝' });
    }
  };

  const eliminarTarea = (index) => {
    const tarea = tareas[index];
    const nuevasTareas = tareas.filter((_, i) => i !== index);
    setTareas(nuevasTareas);
    toast.success(`"${tarea}" eliminada`, { icon: '🗑️' });
  };

  // Cambiar estado de ánimo
  const cambiarMood = (newMood) => {
    setMood(newMood);
    const moods = {
      happy: { emoji: '😄', text: '¡Modo feliz activado!' },
      sad: { emoji: '😢', text: 'Modo melancólico...' },
      excited: { emoji: '🤩', text: '¡Súper emocionado!' },
      cool: { emoji: '😎', text: 'Modo genial activado' }
    };
    toast(moods[newMood].text, { icon: moods[newMood].emoji });
  };

  // Timer del Pomodoro
  useEffect(() => {
    let interval = null;
    if (pomodoroActive && pomodoroTime > 0) {
      interval = setInterval(() => {
        setPomodoroTime(time => time - 1);
      }, 1000);
    } else if (pomodoroTime === 0) {
      setPomodoroActive(false);
      if (pomodoroType === 'work') {
        toast.success('¡Tiempo de descanso! 🎉', { icon: '☕' });
        setPomodoroType('break');
        setPomodoroTime(5 * 60); // 5 minutos de descanso
      } else {
        toast.success('¡Volver al trabajo! 💪', { icon: '🚀' });
        setPomodoroType('work');
        setPomodoroTime(25 * 60); // 25 minutos de trabajo
      }
      celebrar();
    }
    return () => clearInterval(interval);
  }, [pomodoroActive, pomodoroTime, pomodoroType]);

  // Cambiar frase motivacional cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote(prev => (prev + 1) % quotes.length);
    }, 30000);
    return () => clearInterval(interval);
  }, [quotes.length]);

  // Funciones de la calculadora
  const handleCalculatorInput = (value) => {
    try {
      if (value === '=') {
        try {
          const result = eval(calculatorInput);
          setCalculatorResult(result.toString());
          setCalculatorInput(result.toString());
          toast.success(`Resultado: ${result}`, { icon: '🧮' });
        } catch (error) {
          setCalculatorResult('Error');
          setCalculatorInput('');
          toast.error('Error en el cálculo', { icon: '❌' });
        }
      } else if (value === 'C') {
        setCalculatorResult('0');
        setCalculatorInput('');
      } else if (value === '⌫') {
        setCalculatorInput(prev => prev.slice(0, -1) || '0');
        setCalculatorResult(calculatorInput.slice(0, -1) || '0');
      } else {
        const newInput = calculatorInput === '0' ? value : calculatorInput + value;
        setCalculatorInput(newInput);
        setCalculatorResult(newInput);
      }
    } catch (error) {
      toast.error('Error en la calculadora', { icon: '❌' });
    }
  };

  const startPomodoro = () => {
    setPomodoroActive(!pomodoroActive);
    toast.success(pomodoroActive ? 'Pomodoro pausado' : `Pomodoro iniciado - ${pomodoroType === 'work' ? 'Trabajo' : 'Descanso'}`, {
      icon: pomodoroActive ? '⏸️' : '⏱️'
    });
  };

  const resetPomodoro = () => {
    setPomodoroActive(false);
    setPomodoroTime(25 * 60);
    setPomodoroType('work');
    toast.success('Pomodoro reiniciado', { icon: '🔄' });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const generateQR = () => {
    if (qrText.trim()) {
      toast.success('Código QR generado! 📱', { icon: '✅' });
    } else {
      toast.error('Ingresa un texto o URL', { icon: '❌' });
    }
  };

  // Componente QR Generator simple
  const QRDisplay = ({ text }) => (
    <Box sx={{
      width: 150,
      height: 150,
      background: 'white',
      borderRadius: 2,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto',
      border: '2px solid rgba(255,255,255,0.2)'
    }}>
      <Typography sx={{ color: 'black', fontSize: '0.7rem', textAlign: 'center', p: 1 }}>
        QR: {text ? text.substring(0, 20) : 'texto'}...
      </Typography>
    </Box>
  );

  // Componente Calculadora
  const Calculator = () => (
    <Box sx={{
      background: 'rgba(255,255,255,0.1)',
      borderRadius: 2,
      p: 2,
      backdropFilter: 'blur(10px)'
    }}>
      <Box sx={{
        background: 'rgba(0,0,0,0.3)',
        borderRadius: 1,
        p: 2,
        mb: 2,
        textAlign: 'right'
      }}>
        <Typography variant="h4" sx={{ color: 'white', fontFamily: 'monospace' }}>
          {calculatorResult}
        </Typography>
      </Box>
      
      {[
        ['C', '⌫', '/', '*'],
        ['7', '8', '9', '-'],
        ['4', '5', '6', '+'],
        ['1', '2', '3', '='],
        ['0', '.', '(', ')']
      ].map((row, rowIndex) => (
        <Box key={rowIndex} sx={{ display: 'flex', gap: 1, mb: 1 }}>
          {row.map((btn) => (
            <Button
              key={btn}
              onClick={(e) => {
                e.preventDefault();
                handleCalculatorInput(btn);
              }}
              sx={{
                flex: btn === '0' ? 2 : 1,
                minHeight: 45,
                background: btn === '=' ? 'linear-gradient(45deg, #00b894, #00a085)' : 
                           ['C', '⌫'].includes(btn) ? 'linear-gradient(45deg, #e17055, #d63031)' :
                           ['+', '-', '*', '/'].includes(btn) ? 'linear-gradient(45deg, #667eea, #764ba2)' :
                           'rgba(255,255,255,0.1)',
                color: 'white',
                fontWeight: 'bold',
                '&:hover': {
                  background: btn === '=' ? 'linear-gradient(45deg, #00a085, #009075)' : 
                             ['C', '⌫'].includes(btn) ? 'linear-gradient(45deg, #d63031, #c92a2a)' :
                             ['+', '-', '*', '/'].includes(btn) ? 'linear-gradient(45deg, #5a6fd8, #6a4190)' :
                             'rgba(255,255,255,0.2)'
                }
              }}
            >
              {btn}
            </Button>
          ))}
        </Box>
      ))}
    </Box>
  );

  // Variants para animaciones
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  const buttonVariants = {
    hover: { 
      scale: 1.05, 
      rotate: [0, -1, 1, -1, 0],
      transition: { duration: 0.3 }
    },
    tap: { scale: 0.95 }
  };

  // Cargar preferencias al iniciar
  useEffect(() => {
    const preferences = storageService.getUserPreferences();
    setUserPreferences(preferences);
    setAutoRefresh(preferences.autoRefresh);
    setRefreshInterval(preferences.refreshInterval);
    
    // Cargar datos en cache si existen
    loadCachedData();
    
    // Cargar datos frescos
    loadAllData();
  }, []);

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      loadAllData();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval]);

  // Pomodoro timer
  useEffect(() => {
    if (!pomodoroActive || pomodoroTime <= 0) return;

    const timer = setInterval(() => {
      setPomodoroTime(prev => {
        if (prev <= 1) {
          setPomodoroActive(false);
          toast.success('¡Pomodoro completado! 🍅');
          return 25 * 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [pomodoroActive, pomodoroTime]);

  // Rotación de frases
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote(prev => (prev + 1) % 4);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

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
      const preferences = userPreferences || storageService.getUserPreferences();
      
      // Cargar todos los datos en paralelo
      const [weather, crypto, news, quote] = await Promise.all([
        apiService.getWeatherData(preferences.location),
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
        quotes: quote,
        stats: systemStats
      });

      // Analytics
      storageService.saveAnalytics({
        action: 'dashboard_refresh',
        source: 'api_load'
      });

      toast.success('Datos actualizados correctamente 🚀');
    } catch (error) {
      console.error('Error cargando datos:', error);
      toast.error('Error actualizando algunos datos');
    } finally {
      setLoading(false);
    }
  }, [loading, userPreferences, systemStats]);

  return (
    <motion.div 
      className="App-dashboard"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      style={{ color: 'white', padding: 0 }}
    >
      {/* Confetti para celebraciones */}
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
        />
      )}

      {/* Selector de estado de ánimo */}
      <motion.div 
        className="mood-selector-dashboard"
        data-aos="fade-up"
        data-aos-delay="200"
        style={{ 
          marginBottom: '2rem',
          textAlign: 'center',
          background: 'rgba(255, 255, 255, 0.1)',
          padding: '1.5rem',
          borderRadius: '20px',
          backdropFilter: 'blur(10px)'
        }}
      >
        <p style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: 500 }}>
          Estado de ánimo actual:
        </p>
        <div className="mood-buttons" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {[
            { key: 'happy', icon: BsEmojiLaughing, color: '#ffd700' },
            { key: 'sad', icon: IoSad, color: '#6c5ce7' },
            { key: 'excited', icon: BsEmojiSunglasses, color: '#fd79a8' },
            { key: 'cool', icon: BsEmojiWink, color: '#00cec9' }
          ].map(({ key, icon: Icon, color }) => (
            <motion.button
              key={key}
              className={`mood-btn ${mood === key ? 'active' : ''}`}
              onClick={() => cambiarMood(key)}
              whileHover={{ scale: 1.2, rotate: 10 }}
              whileTap={{ scale: 0.9 }}
              style={{ 
                backgroundColor: mood === key ? color : 'transparent',
                padding: '0.75rem',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '50%',
                background: mood === key ? color : 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '60px',
                height: '60px'
              }}
            >
              <Icon size={24} />
            </motion.button>
          ))}
        </div>
      </motion.div>

      <main className="App-main" style={{ gap: '2rem' }}>
        {/* Sección Contador Mejorada */}
        <motion.section 
          className="contador-section"
          data-aos="fade-right"
          variants={itemVariants}
        >
          <h2>
            <BsLightning style={{ marginRight: '10px', color: '#ffd700' }} />
            Contador Súper Dinámico
          </h2>
          
          <motion.div className="contador">
            <Badge badgeContent={contador > 0 ? "🔥" : "💤"} color="secondary">
              <motion.p
                key={contador}
                initial={{ scale: 0.5, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                Contador actual: 
                <motion.span 
                  className="numero"
                  animate={{ 
                    color: contador > 5 ? '#ff6b6b' : contador < 0 ? '#74b9ff' : '#ffd700',
                    scale: contador === 10 ? [1, 1.2, 1] : 1
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {contador}
                </motion.span>
              </motion.p>
            </Badge>
            
            <div className="botones-avanzados">
              {/* Botones Material-UI con animaciones */}
              <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={incrementar}
                  className="btn-incrementar"
                  sx={{ 
                    background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                    borderRadius: '25px',
                    padding: '12px 24px'
                  }}
                >
                  <FaPlus style={{ marginRight: '8px' }} />
                  Incrementar
                </Button>
              </motion.div>

              <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                <Button
                  variant="contained"
                  startIcon={<Remove />}
                  onClick={decrementar}
                  className="btn-decrementar"
                  sx={{ 
                    background: 'linear-gradient(45deg, #A8E6CF, #3D5A80)',
                    borderRadius: '25px',
                    padding: '12px 24px'
                  }}
                >
                  <FaMinus style={{ marginRight: '8px' }} />
                  Decrementar
                </Button>
              </motion.div>

              <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                <Button
                  variant="outlined"
                  startIcon={<Refresh />}
                  onClick={resetear}
                  sx={{ 
                    borderRadius: '25px',
                    padding: '12px 24px',
                    borderColor: '#ffd700',
                    color: '#ffd700'
                  }}
                >
                  <FaRedo style={{ marginRight: '8px' }} />
                  Resetear
                </Button>
              </motion.div>

              {/* Botón especial para celebrar */}
              <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                <Fab
                  color="secondary"
                  onClick={celebrar}
                  sx={{ 
                    background: 'linear-gradient(45deg, #ff9ff3, #f368e0)',
                    margin: '0 10px'
                  }}
                >
                  <FaGift />
                </Fab>
              </motion.div>
            </div>
          </motion.div>
        </motion.section>

        {/* Sección Tareas Mejorada */}
        <motion.section 
          className="tareas-section"
          data-aos="fade-left"
          variants={itemVariants}
        >
          <h2>
            <FaCheck style={{ marginRight: '10px', color: '#00d2d3' }} />
            Lista de Tareas Interactiva
            <Chip 
              label={`${tareas.length} tareas`} 
              color="primary" 
              size="small"
              sx={{ marginLeft: '10px' }}
            />
          </h2>
          
          <div className="agregar-tarea-avanzada">
            <motion.input
              type="text"
              placeholder="Escribe una nueva tarea épica..."
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && agregarTarea()}
              whileFocus={{ scale: 1.02, boxShadow: '0 0 20px rgba(116, 185, 255, 0.5)' }}
              transition={{ duration: 0.2 }}
            />
            
            <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
              <Button
                variant="contained"
                onClick={agregarTarea}
                startIcon={<FaPlus />}
                sx={{ 
                  background: 'linear-gradient(45deg, #a29bfe, #6c5ce7)',
                  borderRadius: '25px'
                }}
              >
                Agregar Épico
              </Button>
            </motion.div>
          </div>
          
          <AnimatePresence>
            <motion.ul className="lista-tareas-avanzada">
              {tareas.map((tarea, index) => (
                <motion.li
                  key={index}
                  className="tarea-item-avanzada"
                  initial={{ opacity: 0, x: -50, scale: 0.8 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 50, scale: 0.8 }}
                  whileHover={{ 
                    scale: 1.02, 
                    x: 10,
                    backgroundColor: 'rgba(255, 255, 255, 0.3)' 
                  }}
                  transition={{ duration: 0.3 }}
                  layout
                >
                  <motion.span
                    whileHover={{ color: '#ffd700' }}
                    transition={{ duration: 0.2 }}
                  >
                    <FaStar style={{ marginRight: '8px', color: '#ffd700' }} />
                    {tarea}
                  </motion.span>
                  
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <IconButton
                      onClick={() => eliminarTarea(index)}
                      sx={{ 
                        background: 'linear-gradient(45deg, #ff7675, #d63031)',
                        color: 'white',
                        '&:hover': { background: 'linear-gradient(45deg, #d63031, #a71e1e)' }
                      }}
                      size="small"
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </motion.div>
                </motion.li>
              ))}
            </motion.ul>
          </AnimatePresence>
        </motion.section>

        {/* Nueva sección: Zona de Diversión */}
        <motion.section 
          className="diversion-section"
          data-aos="zoom-in"
          variants={itemVariants}
        >
          <h2>
            <FaMagic style={{ marginRight: '10px', color: '#ff6b6b' }} />
            Zona de Diversión
            <IoSparkles style={{ marginLeft: '10px', color: '#ffd700' }} />
          </h2>
          
          <div className="diversiones">
            <motion.div 
              className="efecto-card"
              whileHover={{ 
                scale: 1.05, 
                rotateY: 10,
                boxShadow: '0 20px 40px rgba(0,0,0,0.2)' 
              }}
              transition={{ duration: 0.3 }}
            >
              <h3><FaFire /> Efectos Geniales</h3>
              <div className="efecto-botones">
                <Button 
                  onClick={() => {
                    toast.custom((t) => (
                      <div style={{
                        background: 'linear-gradient(45deg, #667eea, #764ba2)',
                        color: 'white',
                        padding: '16px',
                        borderRadius: '15px',
                        display: 'flex',
                        alignItems: 'center'
                      }}>
                        <FaHeart style={{ marginRight: '8px' }} />
                        ¡Notificación personalizada! 
                        <BsStars style={{ marginLeft: '8px' }} />
                      </div>
                    ));
                  }}
                  variant="contained"
                  sx={{ margin: '5px' }}
                >
                  Toast Personalizado
                </Button>
                
                <Button 
                  onClick={celebrar}
                  variant="contained"
                  color="secondary"
                  sx={{ margin: '5px' }}
                >
                  <FaGift style={{ marginRight: '8px' }} />
                  Celebrar
                </Button>
              </div>
            </motion.div>

            <motion.div 
              className="stats-card"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <h3><BsHeart /> Estadísticas Cool</h3>
              <div className="stats-content">
                <Chip 
                  icon={<FaRocket />} 
                  label={`Contador: ${contador}`} 
                  color="primary" 
                  variant="outlined"
                  sx={{ margin: '5px' }}
                />
                <Chip 
                  icon={<FaCheck />} 
                  label={`Tareas: ${tareas.length}`} 
                  color="success" 
                  variant="outlined"
                  sx={{ margin: '5px' }}
                />
                <Chip 
                  icon={<IoThunderstorm />} 
                  label="Estado: Épico ⚡" 
                  color="warning" 
                  variant="outlined"
                  sx={{ margin: '5px' }}
                />
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Sección de Información Actualizada */}
        <motion.section 
          className="info-section"
          data-aos="fade-up"
          variants={itemVariants}
        >
          <h2>
            <IoColorPalette style={{ marginRight: '10px', color: '#74b9ff' }} />
            Tecnologías Súper Modernas
          </h2>
          <div className="info-cards-avanzadas">
            <motion.div 
              className="tech-card"
              whileHover={{ y: -10, rotateX: 5 }}
              transition={{ duration: 0.3 }}
            >
              <h3><FaRocket /> Frontend Stack</h3>
              <ul>
                <li>⚛️ React 18 + Hooks</li>
                <li>🎭 Framer Motion</li>
                <li>🎨 Material-UI</li>
                <li>🔥 React Icons</li>
                <li>🍞 React Hot Toast</li>
              </ul>
            </motion.div>
            
            <motion.div 
              className="features-card"
              whileHover={{ y: -10, rotateX: 5 }}
              transition={{ duration: 0.3 }}
            >
              <h3><BsStars /> Características</h3>
              <ul>
                <li>✨ Animaciones fluidas</li>
                <li>🎊 Efectos de confetti</li>
                <li>📱 Diseño responsive</li>
                <li>🔔 Notificaciones toast</li>
                <li>🎯 Interacciones avanzadas</li>
              </ul>
            </motion.div>
          </div>
        </motion.section>

        {/* Nueva sección de widgets útiles */}
        <motion.div
          className="widgets-section"
          data-aos="fade-up"
          data-aos-delay="800"
          style={{
            marginTop: '3rem',
            marginBottom: '2rem'
          }}
        >
          <Typography 
            variant="h4" 
            style={{ 
              textAlign: 'center', 
              marginBottom: '2rem', 
              background: 'linear-gradient(45deg, #667eea, #764ba2)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 'bold'
            }}
          >
            🛠️ Herramientas Útiles
          </Typography>

          <Grid container spacing={3}>
            {/* Widget de Frase Motivacional */}
            <Grid item xs={12} md={6}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="glass-card" style={{ minHeight: '200px' }}>
                  <CardContent style={{ textAlign: 'center', padding: '2rem' }}>
                    <motion.div
                      key={currentQuote}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Typography variant="h6" style={{ marginBottom: '1rem', color: '#ffd700' }}>
                        💡 Frase del momento
                      </Typography>
                      <Typography variant="h6" style={{ fontStyle: 'italic', lineHeight: 1.6 }}>
                        "{quotes[currentQuote]}"
                      </Typography>
                    </motion.div>
                    
                                         <Button
                       variant="outlined"
                       onClick={() => setCurrentQuote((prev) => (prev + 1) % quotes.length)}
                       sx={{ 
                         mt: 1, 
                         borderColor: 'rgba(255,255,255,0.3)',
                         color: 'white'
                       }}
                     >
                       Nueva frase ✨
                     </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            {/* Widget del Clima */}
            <Grid item xs={12} md={6}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="glass-card" style={{ minHeight: '200px' }}>
                  <CardContent style={{ padding: '2rem' }}>
                    <Typography variant="h6" style={{ marginBottom: '1rem', textAlign: 'center' }}>
                      🌤️ Clima en {weather.city}
                    </Typography>
                    
                    <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box style={{ textAlign: 'center' }}>
                        <Typography variant="h2" style={{ fontWeight: 'bold', color: '#667eea' }}>
                          {weather.temperature}°
                        </Typography>
                        <Typography variant="body2" style={{ opacity: 0.8 }}>
                          {weather.condition}
                        </Typography>
                      </Box>
                      
                      <Box style={{ textAlign: 'right' }}>
                        <Typography variant="body2" style={{ marginBottom: '0.5rem' }}>
                          💧 Humedad: {weather.humidity}%
                        </Typography>
                        <Typography variant="body2">
                          💨 Viento: {weather.wind} km/h
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            {/* Widget Pomodoro Timer */}
            <Grid item xs={12} md={6}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="glass-card" style={{ minHeight: '250px' }}>
                  <CardContent style={{ textAlign: 'center', padding: '2rem' }}>
                    <Typography variant="h6" style={{ marginBottom: '1rem' }}>
                      ⏱️ Pomodoro Timer
                    </Typography>
                    
                    <Typography variant="body2" style={{ marginBottom: '1rem', opacity: 0.8 }}>
                      Modo: {pomodoroType === 'work' ? '💼 Trabajo' : '☕ Descanso'}
                    </Typography>
                    
                    <motion.div
                      animate={{ scale: pomodoroActive ? [1, 1.1, 1] : 1 }}
                      transition={{ duration: 1, repeat: pomodoroActive ? Infinity : 0 }}
                    >
                      <Typography 
                        variant="h2" 
                        style={{ 
                          fontFamily: 'monospace', 
                          fontWeight: 'bold',
                          color: pomodoroType === 'work' ? '#e17055' : '#00b894',
                          marginBottom: '1rem'
                        }}
                      >
                        {formatTime(pomodoroTime)}
                      </Typography>
                    </motion.div>
                    
                    <Box style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                      <Button
                        variant="contained"
                        onClick={startPomodoro}
                        style={{
                          background: pomodoroActive ? 
                            'linear-gradient(45deg, #e17055, #d63031)' : 
                            'linear-gradient(45deg, #00b894, #00a085)',
                          color: 'white'
                        }}
                      >
                        {pomodoroActive ? '⏸️ Pausar' : '▶️ Iniciar'}
                      </Button>
                      
                      <Button
                        variant="outlined"
                        onClick={resetPomodoro}
                        style={{ 
                          borderColor: 'rgba(255,255,255,0.3)',
                          color: 'white'
                        }}
                      >
                        🔄 Reset
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            {/* Widget Calculadora */}
            <Grid item xs={12} md={6}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="glass-card" style={{ minHeight: '250px' }}>
                  <CardContent style={{ padding: '1.5rem' }}>
                    <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <Typography variant="h6">
                        🧮 Calculadora
                      </Typography>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => setShowCalculator(!showCalculator)}
                        style={{ 
                          borderColor: 'rgba(255,255,255,0.3)',
                          color: 'white'
                        }}
                      >
                        {showCalculator ? 'Ocultar' : 'Mostrar'}
                      </Button>
                    </Box>
                    
                    {showCalculator ? (
                      <Calculator />
                    ) : (
                      <Box style={{ textAlign: 'center', padding: '2rem 0' }}>
                        <Typography variant="body2" style={{ opacity: 0.7, marginBottom: '1rem' }}>
                          Calculadora rápida para tus cálculos
                        </Typography>
                        <Button
                          variant="contained"
                          onClick={() => setShowCalculator(true)}
                          style={{
                            background: 'linear-gradient(45deg, #667eea, #764ba2)'
                          }}
                        >
                          Abrir Calculadora
                        </Button>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            {/* Widget Generador QR */}
            <Grid item xs={12} md={6}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="glass-card" style={{ minHeight: '300px' }}>
                  <CardContent style={{ padding: '1.5rem' }}>
                    <Typography variant="h6" style={{ marginBottom: '1rem', textAlign: 'center' }}>
                      📱 Generador QR
                    </Typography>
                    
                    <TextField
                      fullWidth
                      label="Texto o URL"
                      value={qrText}
                      onChange={(e) => setQrText(e.target.value)}
                      style={{ marginBottom: '1rem' }}
                      InputProps={{
                        style: { color: 'white' }
                      }}
                      InputLabelProps={{
                        style: { color: 'rgba(255,255,255,0.7)' }
                      }}
                    />
                    
                    <Box style={{ marginBottom: '1rem' }}>
                      <QRDisplay text={qrText} />
                    </Box>
                    
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={generateQR}
                      style={{
                        background: 'linear-gradient(45deg, #fd79a8, #e84393)'
                      }}
                    >
                      Generar QR 📲
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            {/* Widget de Estadísticas del Sistema */}
            <Grid item xs={12} md={6}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="glass-card" style={{ minHeight: '300px' }}>
                  <CardContent style={{ padding: '2rem' }}>
                    <Typography variant="h6" style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                      📊 Resumen del Sistema
                    </Typography>
                    
                    <Box style={{ marginBottom: '1rem' }}>
                      <Typography variant="body2" style={{ marginBottom: '0.5rem' }}>
                        Rendimiento General
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={87} 
                        style={{ 
                          height: 8, 
                          borderRadius: 4,
                          backgroundColor: 'rgba(255,255,255,0.1)'
                        }}
                      />
                      <Typography variant="caption" style={{ opacity: 0.7 }}>
                        87% - Excelente
                      </Typography>
                    </Box>
                    
                    <Box style={{ marginBottom: '1rem' }}>
                      <Typography variant="body2" style={{ marginBottom: '0.5rem' }}>
                        Uso de Memoria
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={64} 
                        style={{ 
                          height: 8, 
                          borderRadius: 4,
                          backgroundColor: 'rgba(255,255,255,0.1)'
                        }}
                      />
                      <Typography variant="caption" style={{ opacity: 0.7 }}>
                        64% - Normal
                      </Typography>
                    </Box>
                    
                    <Box style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
                      <Box style={{ textAlign: 'center' }}>
                        <Typography variant="h6" style={{ color: '#00b894', fontWeight: 'bold' }}>
                          {tareas.length}
                        </Typography>
                        <Typography variant="caption">Tareas</Typography>
                      </Box>
                      <Box style={{ textAlign: 'center' }}>
                        <Typography variant="h6" style={{ color: '#667eea', fontWeight: 'bold' }}>
                          {contador}
                        </Typography>
                        <Typography variant="caption">Contador</Typography>
                      </Box>
                      <Box style={{ textAlign: 'center' }}>
                        <Typography variant="h6" style={{ color: '#ffd700', fontWeight: 'bold' }}>
                          98%
                        </Typography>
                        <Typography variant="caption">Uptime</Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
        </motion.div>
      </main>
    </motion.div>
  );
}

export default Dashboard; 