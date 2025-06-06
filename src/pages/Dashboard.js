import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaRocket, FaHeart, FaPlus, FaMinus, FaRedo, FaTrash, 
  FaStar, FaCheck, FaFire, FaGift, FaMagic 
} from 'react-icons/fa';
import { 
  IoSparkles, IoThunderstorm, IoColorPalette, 
  IoHappy, IoSad, IoHome 
} from 'react-icons/io5';
import { 
  BsLightning, BsHeart, BsStars, BsEmojiSunglasses,
  BsEmojiLaughing, BsEmojiWink 
} from 'react-icons/bs';
import { Button, Chip, Badge, Fab, IconButton } from '@mui/material';
import { Favorite, Add, Remove, Refresh, Delete, Star } from '@mui/icons-material';
import toast from 'react-hot-toast';
import Confetti from 'react-confetti';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../App.css';

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
                  onClick={() => toast.custom((t) => (
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
                  ))}
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
      </main>
    </motion.div>
  );
}

export default Dashboard; 