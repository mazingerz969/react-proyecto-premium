import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  Avatar,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  Chip,
  Divider,
  LinearProgress,
  IconButton,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Edit,
  PhotoCamera,
  Save,
  Cancel,
  LocationOn,
  Work,
  Email,
  Phone,
  GitHub,
  LinkedIn,
  Twitter
} from '@mui/icons-material';
import { FaTrophy, FaStar, FaCode, FaRocket } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Profile = () => {
  const [editMode, setEditMode] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: 'Juan Developer',
    email: 'juan@developer.com',
    phone: '+34 123 456 789',
    location: 'Madrid, España',
    company: 'Tech Solutions Inc.',
    bio: 'Desarrollador Full Stack apasionado por crear experiencias digitales increíbles. Especializado en React, Node.js y tecnologías modernas.',
    skills: ['React', 'JavaScript', 'Node.js', 'Python', 'MongoDB', 'AWS'],
    notifications: true,
    darkMode: false,
    publicProfile: true
  });

  const [stats] = useState({
    projectsCompleted: 24,
    codeCommits: 1247,
    experienceYears: 5.2,
    skillLevel: 87
  });

  const handleSave = () => {
    setEditMode(false);
    toast.success('¡Perfil actualizado correctamente! 🎉', {
      icon: '✅',
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });
  };

  const handleCancel = () => {
    setEditMode(false);
    toast.error('Cambios cancelados', { icon: '❌' });
  };

  const handleInputChange = (field, value) => {
    setUserInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addSkill = (skill) => {
    if (skill && !userInfo.skills.includes(skill)) {
      setUserInfo(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
      toast.success(`Skill "${skill}" añadida! 🚀`, { icon: '💡' });
    }
  };

  const removeSkill = (skillToRemove) => {
    setUserInfo(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
    toast.success(`Skill "${skillToRemove}" eliminada`, { icon: '🗑️' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{ padding: '2rem', minHeight: '100vh' }}
    >
      <Grid container spacing={3}>
        {/* Tarjeta Principal de Perfil */}
        <Grid item xs={12} md={4}>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card sx={{ 
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white'
            }}>
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
                  <Avatar
                    sx={{ 
                      width: 120, 
                      height: 120, 
                      mx: 'auto',
                      background: 'linear-gradient(45deg, #667eea, #764ba2)'
                    }}
                  >
                    {userInfo.name.split(' ').map(n => n[0]).join('')}
                  </Avatar>
                  {editMode && (
                    <IconButton
                      sx={{ 
                        position: 'absolute', 
                        bottom: 0, 
                        right: 0,
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        color: 'white'
                      }}
                    >
                      <PhotoCamera />
                    </IconButton>
                  )}
                </Box>

                {editMode ? (
                  <TextField
                    fullWidth
                    value={userInfo.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    sx={{ mb: 2, '& .MuiOutlinedInput-root': { color: 'white' } }}
                  />
                ) : (
                  <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold' }}>
                    {userInfo.name}
                  </Typography>
                )}

                <Typography variant="body2" sx={{ mb: 2, opacity: 0.8 }}>
                  <Work sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                  {userInfo.company}
                </Typography>

                <Typography variant="body2" sx={{ mb: 3, opacity: 0.8 }}>
                  <LocationOn sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                  {userInfo.location}
                </Typography>

                {!editMode && (
                  <Button
                    variant="contained"
                    startIcon={<Edit />}
                    onClick={() => setEditMode(true)}
                    sx={{ 
                      background: 'linear-gradient(45deg, #667eea, #764ba2)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #5a6fd8, #6a4190)'
                      }
                    }}
                  >
                    Editar Perfil
                  </Button>
                )}

                {editMode && (
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                    <Button
                      variant="contained"
                      startIcon={<Save />}
                      onClick={handleSave}
                      sx={{ background: 'linear-gradient(45deg, #00b894, #00a085)' }}
                    >
                      Guardar
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Cancel />}
                      onClick={handleCancel}
                      sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)' }}
                    >
                      Cancelar
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Información y Estadísticas */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={3}>
            {/* Estadísticas */}
            <Grid item xs={12}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card sx={{ 
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  mb: 3
                }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                      <FaTrophy style={{ marginRight: 8, color: '#ffd700' }} />
                      Estadísticas
                    </Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={6} md={3}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#667eea' }}>
                            {stats.projectsCompleted}
                          </Typography>
                          <Typography variant="body2">Proyectos</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#764ba2' }}>
                            {stats.codeCommits}
                          </Typography>
                          <Typography variant="body2">Commits</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#00b894' }}>
                            {stats.experienceYears}
                          </Typography>
                          <Typography variant="body2">Años Exp.</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#fd79a8' }}>
                            {stats.skillLevel}%
                          </Typography>
                          <Typography variant="body2">Skill Level</Typography>
                          <LinearProgress 
                            variant="determinate" 
                            value={stats.skillLevel} 
                            sx={{ mt: 1, backgroundColor: 'rgba(255,255,255,0.2)' }}
                          />
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            {/* Información Personal */}
            <Grid item xs={12}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card sx={{ 
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: 'white'
                }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      Información Personal
                    </Typography>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Email"
                          value={userInfo.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          disabled={!editMode}
                          InputProps={{
                            startAdornment: <Email sx={{ mr: 1, color: 'rgba(255,255,255,0.7)' }} />
                          }}
                          sx={{ 
                            '& .MuiOutlinedInput-root': { color: 'white' },
                            '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Teléfono"
                          value={userInfo.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          disabled={!editMode}
                          InputProps={{
                            startAdornment: <Phone sx={{ mr: 1, color: 'rgba(255,255,255,0.7)' }} />
                          }}
                          sx={{ 
                            '& .MuiOutlinedInput-root': { color: 'white' },
                            '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          multiline
                          rows={3}
                          label="Biografía"
                          value={userInfo.bio}
                          onChange={(e) => handleInputChange('bio', e.target.value)}
                          disabled={!editMode}
                          sx={{ 
                            '& .MuiOutlinedInput-root': { color: 'white' },
                            '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' }
                          }}
                        />
                      </Grid>
                    </Grid>

                    <Divider sx={{ my: 3, backgroundColor: 'rgba(255,255,255,0.2)' }} />

                    {/* Skills */}
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      <FaCode style={{ marginRight: 8, color: '#667eea' }} />
                      Habilidades
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                      {userInfo.skills.map((skill, index) => (
                        <Chip
                          key={index}
                          label={skill}
                          onDelete={editMode ? () => removeSkill(skill) : undefined}
                          sx={{
                            background: 'linear-gradient(45deg, #667eea, #764ba2)',
                            color: 'white',
                            '& .MuiChip-deleteIcon': { color: 'rgba(255,255,255,0.7)' }
                          }}
                        />
                      ))}
                    </Box>

                    {editMode && (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {['TypeScript', 'Vue.js', 'Docker', 'GraphQL', 'Firebase'].map((skill) => (
                          <Chip
                            key={skill}
                            label={`+ ${skill}`}
                            onClick={() => addSkill(skill)}
                            sx={{
                              backgroundColor: 'rgba(255,255,255,0.1)',
                              color: 'white',
                              cursor: 'pointer',
                              '&:hover': {
                                backgroundColor: 'rgba(255,255,255,0.2)'
                              }
                            }}
                          />
                        ))}
                      </Box>
                    )}

                    <Divider sx={{ my: 3, backgroundColor: 'rgba(255,255,255,0.2)' }} />

                    {/* Configuraciones */}
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      Configuración
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={userInfo.notifications}
                            onChange={(e) => handleInputChange('notifications', e.target.checked)}
                            color="primary"
                          />
                        }
                        label="Recibir notificaciones"
                        sx={{ color: 'white' }}
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={userInfo.publicProfile}
                            onChange={(e) => handleInputChange('publicProfile', e.target.checked)}
                            color="primary"
                          />
                        }
                        label="Perfil público"
                        sx={{ color: 'white' }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </motion.div>
  );
};

export default Profile; 