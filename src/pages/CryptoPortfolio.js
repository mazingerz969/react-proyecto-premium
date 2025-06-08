import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  LinearProgress
} from '@mui/material';
import { FaBitcoin, FaPlus, FaTrash, FaBell, FaWallet, FaDollarSign, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { useTheme } from '../theme/ThemeProvider';
import toast from 'react-hot-toast';

const CryptoPortfolio = () => {
  const { theme } = useTheme();
  const [portfolio, setPortfolio] = useState([]);
  const [cryptoData, setCryptoData] = useState({});
  const [loading, setLoading] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [priceAlerts, setPriceAlerts] = useState([]);
  
  const [newHolding, setNewHolding] = useState({
    cryptoId: '',
    symbol: '',
    amount: '',
    buyPrice: ''
  });

  const [newAlert, setNewAlert] = useState({
    cryptoId: '',
    symbol: '',
    targetPrice: '',
    type: 'above'
  });

  const API_BASE = 'https://api.coingecko.com/api/v3';

  // Cargar datos del localStorage
  useEffect(() => {
    const savedPortfolio = JSON.parse(localStorage.getItem('cryptoPortfolio') || '[]');
    const savedAlerts = JSON.parse(localStorage.getItem('priceAlerts') || '[]');
    
    setPortfolio(savedPortfolio);
    setPriceAlerts(savedAlerts);
    
    if (savedPortfolio.length > 0) {
      fetchCryptoData(savedPortfolio);
    }
  }, []);

  // Solicitar permisos de notificación
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Cargar precios actuales
  const fetchCryptoData = async (portfolioItems = portfolio) => {
    if (portfolioItems.length === 0) return;
    
    try {
      setLoading(true);
      const cryptoIds = portfolioItems.map(item => item.cryptoId).join(',');
      const response = await axios.get(
        `${API_BASE}/simple/price?ids=${cryptoIds}&vs_currencies=usd&include_24hr_change=true`
      );
      setCryptoData(response.data);
      checkPriceAlerts(response.data);
    } catch (error) {
      console.error('Error fetching crypto data:', error);
      toast.error('Error al cargar precios actuales');
    } finally {
      setLoading(false);
    }
  };

  // Verificar alertas de precios
  const checkPriceAlerts = (currentPrices) => {
    priceAlerts.forEach(alert => {
      if (!alert.enabled) return;
      
      const currentPrice = currentPrices[alert.cryptoId]?.usd;
      if (!currentPrice) return;
      
      const shouldTrigger = alert.type === 'above' 
        ? currentPrice >= alert.targetPrice
        : currentPrice <= alert.targetPrice;
      
      if (shouldTrigger) {
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(`Alerta de Precio - ${alert.symbol.toUpperCase()}`, {
            body: `Precio actual: $${currentPrice.toFixed(2)} (Objetivo: $${alert.targetPrice})`,
            icon: '/favicon.ico'
          });
        }
        
        toast.success(
          `🚨 Alerta! ${alert.symbol.toUpperCase()} ${alert.type === 'above' ? 'subió a' : 'bajó a'} $${currentPrice.toFixed(2)}`,
          { duration: 8000 }
        );
        
        const updatedAlerts = priceAlerts.map(a => 
          a.cryptoId === alert.cryptoId && a.targetPrice === alert.targetPrice 
            ? { ...a, enabled: false }
            : a
        );
        setPriceAlerts(updatedAlerts);
        localStorage.setItem('priceAlerts', JSON.stringify(updatedAlerts));
      }
    });
  };

  // Agregar nueva inversión
  const handleAddHolding = () => {
    if (!newHolding.cryptoId || !newHolding.amount || !newHolding.buyPrice) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    const holding = {
      id: Date.now().toString(),
      ...newHolding,
      amount: parseFloat(newHolding.amount),
      buyPrice: parseFloat(newHolding.buyPrice)
    };

    const updatedPortfolio = [...portfolio, holding];
    setPortfolio(updatedPortfolio);
    localStorage.setItem('cryptoPortfolio', JSON.stringify(updatedPortfolio));
    
    setNewHolding({ cryptoId: '', symbol: '', amount: '', buyPrice: '' });
    setAddModalOpen(false);
    toast.success('💰 Inversión agregada al portfolio!');
    fetchCryptoData(updatedPortfolio);
  };

  // Eliminar inversión
  const handleDeleteHolding = (holdingId) => {
    const updatedPortfolio = portfolio.filter(h => h.id !== holdingId);
    setPortfolio(updatedPortfolio);
    localStorage.setItem('cryptoPortfolio', JSON.stringify(updatedPortfolio));
    toast.success('Inversión eliminada del portfolio');
    
    if (updatedPortfolio.length > 0) {
      fetchCryptoData(updatedPortfolio);
    }
  };

  // Agregar alerta de precio
  const handleAddAlert = () => {
    if (!newAlert.cryptoId || !newAlert.targetPrice) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    const alert = {
      id: Date.now().toString(),
      ...newAlert,
      targetPrice: parseFloat(newAlert.targetPrice),
      enabled: true
    };

    const updatedAlerts = [...priceAlerts, alert];
    setPriceAlerts(updatedAlerts);
    localStorage.setItem('priceAlerts', JSON.stringify(updatedAlerts));
    
    setNewAlert({ cryptoId: '', symbol: '', targetPrice: '', type: 'above' });
    setAlertModalOpen(false);
    toast.success('🔔 Alerta de precio configurada!');
  };

  // Calcular estadísticas
  const portfolioStats = portfolio.reduce((stats, holding) => {
    const currentPrice = cryptoData[holding.cryptoId]?.usd || 0;
    const currentValue = holding.amount * currentPrice;
    const invested = holding.amount * holding.buyPrice;
    const profit = currentValue - invested;

    return {
      totalInvested: stats.totalInvested + invested,
      totalCurrentValue: stats.totalCurrentValue + currentValue,
      totalProfit: stats.totalProfit + profit,
      holdings: stats.holdings + 1
    };
  }, { totalInvested: 0, totalCurrentValue: 0, totalProfit: 0, holdings: 0 });

  const totalProfitPercent = portfolioStats.totalInvested > 0 
    ? (portfolioStats.totalProfit / portfolioStats.totalInvested) * 100 
    : 0;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const StatCard = ({ title, value, subtitle, icon: Icon, color }) => (
    <motion.div whileHover={{ scale: 1.02 }}>
      <Card sx={{
        background: theme.cardBg,
        backdropFilter: 'blur(10px)',
        border: `1px solid ${theme.glassEffect}`,
        color: theme.textColor
      }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
                {title}
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color }}>
                {value}
              </Typography>
              {subtitle && (
                <Typography variant="caption" sx={{ opacity: 0.7 }}>
                  {subtitle}
                </Typography>
              )}
            </Box>
            <Icon style={{ fontSize: 32, color, opacity: 0.7 }} />
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
          <FaWallet style={{ color: theme.primary, marginRight: 12 }} />
          Mi Portfolio Crypto
          <Chip 
            label={`${portfolio.length} inversiones`}
            size="small" 
            sx={{ 
              ml: 2, 
              backgroundColor: theme.accentColor, 
              color: '#000',
              fontWeight: 'bold'
            }} 
          />
        </Typography>
      </Box>

      {/* Estadísticas principales */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Valor Total"
            value={formatCurrency(portfolioStats.totalCurrentValue)}
            subtitle={`Invertido: ${formatCurrency(portfolioStats.totalInvested)}`}
            icon={FaDollarSign}
            color={theme.primary}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Ganancia/Pérdida"
            value={formatCurrency(portfolioStats.totalProfit)}
            subtitle={`${totalProfitPercent >= 0 ? '+' : ''}${totalProfitPercent.toFixed(2)}%`}
            icon={portfolioStats.totalProfit >= 0 ? FaArrowUp : FaArrowDown}
            color={portfolioStats.totalProfit >= 0 ? '#00b894' : '#e17055'}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Inversiones"
            value={portfolioStats.holdings.toString()}
            subtitle="Criptomonedas diferentes"
            icon={FaBitcoin}
            color={theme.secondary}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Alertas Activas"
            value={priceAlerts.filter(a => a.enabled).length.toString()}
            subtitle="Notificaciones configuradas"
            icon={FaBell}
            color={theme.accentColor}
          />
        </Grid>
      </Grid>

      {/* Tabla de inversiones */}
      <Card sx={{
        background: theme.cardBg,
        backdropFilter: 'blur(10px)',
        border: `1px solid ${theme.glassEffect}`,
        color: theme.textColor
      }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
              <FaBitcoin style={{ marginRight: 8, color: theme.primary }} />
              Mis Inversiones
            </Typography>
            <Box>
              <Button
                variant="outlined"
                onClick={() => setAlertModalOpen(true)}
                startIcon={<FaBell />}
                sx={{ mr: 1, color: 'white', borderColor: 'white' }}
              >
                Nueva Alerta
              </Button>
              <Button
                variant="contained"
                onClick={() => setAddModalOpen(true)}
                startIcon={<FaPlus />}
              >
                Agregar Inversión
              </Button>
            </Box>
          </Box>

          {loading && <LinearProgress sx={{ mb: 2 }} />}

          {portfolio.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <FaWallet style={{ fontSize: 64, opacity: 0.3, marginBottom: 16 }} />
              <Typography variant="h6" sx={{ mb: 2 }}>
                Tu portfolio está vacío
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.7, mb: 3 }}>
                ¡Comienza agregando tu primera inversión crypto!
              </Typography>
              <Button
                variant="contained"
                onClick={() => setAddModalOpen(true)}
                startIcon={<FaPlus />}
                size="large"
              >
                Agregar Primera Inversión
              </Button>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: 'white' }}>Crypto</TableCell>
                    <TableCell align="right" sx={{ color: 'white' }}>Cantidad</TableCell>
                    <TableCell align="right" sx={{ color: 'white' }}>Precio Compra</TableCell>
                    <TableCell align="right" sx={{ color: 'white' }}>Precio Actual</TableCell>
                    <TableCell align="right" sx={{ color: 'white' }}>Valor</TableCell>
                    <TableCell align="right" sx={{ color: 'white' }}>P&L</TableCell>
                    <TableCell align="center" sx={{ color: 'white' }}>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {portfolio.map((holding) => {
                    const currentPrice = cryptoData[holding.cryptoId]?.usd || 0;
                    const currentValue = holding.amount * currentPrice;
                    const invested = holding.amount * holding.buyPrice;
                    const profit = currentValue - invested;
                    const profitPercent = invested > 0 ? (profit / invested) * 100 : 0;
                    const change24h = cryptoData[holding.cryptoId]?.usd_24h_change || 0;

                    return (
                      <TableRow key={holding.id}>
                        <TableCell sx={{ color: 'white' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                              {holding.symbol.toUpperCase()}
                            </Typography>
                            <Chip
                              label={`${change24h >= 0 ? '+' : ''}${change24h.toFixed(2)}%`}
                              size="small"
                              sx={{
                                ml: 1,
                                backgroundColor: change24h >= 0 ? 'rgba(0, 184, 148, 0.2)' : 'rgba(225, 112, 85, 0.2)',
                                color: change24h >= 0 ? '#00b894' : '#e17055'
                              }}
                            />
                          </Box>
                        </TableCell>
                        <TableCell align="right" sx={{ color: 'white' }}>{holding.amount}</TableCell>
                        <TableCell align="right" sx={{ color: 'white' }}>{formatCurrency(holding.buyPrice)}</TableCell>
                        <TableCell align="right" sx={{ color: 'white' }}>{formatCurrency(currentPrice)}</TableCell>
                        <TableCell align="right" sx={{ color: 'white' }}>{formatCurrency(currentValue)}</TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                            {profit >= 0 ? (
                              <FaArrowUp style={{ color: '#00b894', fontSize: 12, marginRight: 4 }} />
                            ) : (
                              <FaArrowDown style={{ color: '#e17055', fontSize: 12, marginRight: 4 }} />
                            )}
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                color: profit >= 0 ? '#00b894' : '#e17055',
                                fontWeight: 'bold'
                              }}
                            >
                              {formatCurrency(profit)} ({profitPercent >= 0 ? '+' : ''}{profitPercent.toFixed(2)}%)
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteHolding(holding.id)}
                            sx={{ color: '#e17055' }}
                          >
                            <FaTrash />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Modal Agregar Inversión */}
      <Dialog 
        open={addModalOpen} 
        onClose={() => setAddModalOpen(false)}
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            background: theme.cardBg,
            backdropFilter: 'blur(20px)',
            border: `1px solid ${theme.glassEffect}`,
            borderRadius: '20px',
            color: theme.textColor
          }
        }}
      >
        <DialogTitle>Agregar Inversión</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="ID de Criptomoneda (ej: bitcoin)"
                value={newHolding.cryptoId}
                onChange={(e) => setNewHolding({...newHolding, cryptoId: e.target.value})}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Símbolo (ej: BTC)"
                value={newHolding.symbol}
                onChange={(e) => setNewHolding({...newHolding, symbol: e.target.value})}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Cantidad"
                type="number"
                value={newHolding.amount}
                onChange={(e) => setNewHolding({...newHolding, amount: e.target.value})}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Precio de Compra ($)"
                type="number"
                value={newHolding.buyPrice}
                onChange={(e) => setNewHolding({...newHolding, buyPrice: e.target.value})}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddModalOpen(false)}>Cancelar</Button>
          <Button onClick={handleAddHolding} variant="contained">Agregar</Button>
        </DialogActions>
      </Dialog>

      {/* Modal Agregar Alerta */}
      <Dialog 
        open={alertModalOpen} 
        onClose={() => setAlertModalOpen(false)}
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            background: theme.cardBg,
            backdropFilter: 'blur(20px)',
            border: `1px solid ${theme.glassEffect}`,
            borderRadius: '20px',
            color: theme.textColor
          }
        }}
      >
        <DialogTitle>Configurar Alerta de Precio</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="ID de Criptomoneda (ej: bitcoin)"
                value={newAlert.cryptoId}
                onChange={(e) => setNewAlert({...newAlert, cryptoId: e.target.value})}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Símbolo (ej: BTC)"
                value={newAlert.symbol}
                onChange={(e) => setNewAlert({...newAlert, symbol: e.target.value})}
              />
            </Grid>
            <Grid item xs={8}>
              <TextField
                fullWidth
                label="Precio Objetivo ($)"
                type="number"
                value={newAlert.targetPrice}
                onChange={(e) => setNewAlert({...newAlert, targetPrice: e.target.value})}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                select
                label="Tipo"
                value={newAlert.type}
                onChange={(e) => setNewAlert({...newAlert, type: e.target.value})}
                SelectProps={{ native: true }}
              >
                <option value="above">Sube a</option>
                <option value="below">Baja a</option>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAlertModalOpen(false)}>Cancelar</Button>
          <Button onClick={handleAddAlert} variant="contained">Crear Alerta</Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  );
};

export default CryptoPortfolio; 