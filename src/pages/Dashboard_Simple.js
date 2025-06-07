import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Button, 
  Typography, 
  Box, 
  Card, 
  CardContent 
} from '@mui/material';
import toast from 'react-hot-toast';

function DashboardSimple() {
  const [contador, setContador] = useState(0);

  const incrementar = () => {
    setContador(prev => prev + 1);
    toast.success(`Contador: ${contador + 1}`, { icon: '⬆️' });
  };

  const decrementar = () => {
    setContador(prev => prev - 1);
    toast.success(`Contador: ${contador - 1}`, { icon: '⬇️' });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ 
        minHeight: '100vh',
        padding: '2rem',
        background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)',
        color: 'white'
      }}
    >
      <Typography 
        variant="h3" 
        sx={{ 
          textAlign: 'center',
          background: 'linear-gradient(45deg, #667eea, #764ba2)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 'bold',
          mb: 4
        }}
      >
        🏠 Dashboard Simple
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <Card sx={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: 3,
          minWidth: 300
        }}>
          <CardContent sx={{ textAlign: 'center', p: 4 }}>
            <Typography variant="h5" sx={{ mb: 2, color: 'white' }}>
              Contador: {contador}
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="contained"
                onClick={incrementar}
                sx={{
                  background: 'linear-gradient(45deg, #00b894, #00cec9)',
                  color: 'white'
                }}
              >
                + Incrementar
              </Button>
              
              <Button
                variant="contained"
                onClick={decrementar}
                sx={{
                  background: 'linear-gradient(45deg, #e17055, #d63031)',
                  color: 'white'
                }}
              >
                - Decrementar
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>

      <Typography variant="body1" sx={{ textAlign: 'center', opacity: 0.8 }}>
        ✅ Dashboard funcionando sin errores
      </Typography>
    </motion.div>
  );
}

export default DashboardSimple; 