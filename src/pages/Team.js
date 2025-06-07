import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Avatar,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Badge,
  LinearProgress
} from '@mui/material';
import {
  Add,
  Email,
  Phone,
  Edit,
  Delete,
  VideoCall,
  Chat,
  Close,
  Work,
  CalendarToday
} from '@mui/icons-material';
import {
  FaUsers,
  FaTrophy,
  FaFire,
  FaCrown
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const Team = () => {
  const [members, setMembers] = useState([
    {
      id: 1,
      name: 'Juan García',
      email: 'juan@company.com',
      phone: '+34 123 456 789',
      role: 'Tech Lead',
      department: 'Desarrollo',
      avatar: 'JG',
      skills: ['React', 'Node.js', 'Python', 'AWS'],
      level: 'Senior',
      joinDate: '2022-01-15',
      projectsCompleted: 24,
      tasksCompleted: 187,
      rating: 4.9,
      status: 'Activo',
      location: 'Madrid, España',
      bio: 'Desarrollador Full Stack con más de 8 años de experiencia en tecnologías web modernas.',
      availability: 'Disponible'
    },
    {
      id: 2,
      name: 'María López',
      email: 'maria@company.com',
      phone: '+34 987 654 321',
      role: 'UI/UX Designer',
      department: 'Diseño',
      avatar: 'ML',
      skills: ['Figma', 'Adobe XD', 'Sketch', 'Prototyping'],
      level: 'Senior',
      joinDate: '2021-03-20',
      projectsCompleted: 18,
      tasksCompleted: 143,
      rating: 4.8,
      status: 'Activo',
      location: 'Barcelona, España',
      bio: 'Diseñadora especializada en experiencias de usuario intuitivas y diseños modernos.',
      availability: 'En reunión'
    },
    {
      id: 3,
      name: 'Carlos Ruiz',
      email: 'carlos@company.com',
      phone: '+34 555 666 777',
      role: 'Backend Developer',
      department: 'Desarrollo',
      avatar: 'CR',
      skills: ['Java', 'Spring', 'Docker', 'Kubernetes'],
      level: 'Mid',
      joinDate: '2023-06-10',
      projectsCompleted: 12,
      tasksCompleted: 89,
      rating: 4.6,
      status: 'Activo',
      location: 'Valencia, España',
      bio: 'Especialista en arquitecturas escalables y microservicios.',
      availability: 'Disponible'
    }
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    department: 'Desarrollo',
    level: 'Junior',
    skills: '',
    bio: '',
    location: ''
  });

  const departmentColors = {
    'Desarrollo': '#667eea',
    'Diseño': '#fd79a8',
    'Analytics': '#00b894',
    'Marketing': '#fdcb6e',
    'Ventas': '#e17055'
  };

  const levelColors = {
    'Junior': '#74b9ff',
    'Mid': '#fdcb6e',
    'Senior': '#00b894',
    'Lead': '#6c5ce7'
  };

  const statusColors = {
    'Activo': '#00b894',
    'Vacaciones': '#fdcb6e',
    'Baja médica': '#e17055',
    'Inactivo': '#636e72'
  };

  const availabilityColors = {
    'Disponible': '#00b894',
    'Ocupado': '#fdcb6e',
    'En reunión': '#e17055',
    'No disponible': '#636e72'
  };

  const handleAddMember = () => {
    const member = {
      ...newMember,
      id: Date.now(),
      avatar: newMember.name.split(' ').map(n => n[0]).join(''),
      skills: newMember.skills.split(',').map(skill => skill.trim()),
      joinDate: new Date().toISOString().split('T')[0],
      projectsCompleted: 0,
      tasksCompleted: 0,
      rating: 4.0,
      status: 'Activo',
      availability: 'Disponible'
    };

    setMembers([...members, member]);
    setOpenDialog(false);
    setNewMember({
      name: '',
      email: '',
      phone: '',
      role: '',
      department: 'Desarrollo',
      level: 'Junior',
      skills: '',
      bio: '',
      location: ''
    });

    toast.success('¡Miembro del equipo añadido! 👥', { icon: '✅' });
  };

  const deleteMember = (memberId) => {
    setMembers(members.filter(member => member.id !== memberId));
    toast.success('Miembro eliminado del equipo', { icon: '🗑️' });
  };

  const MemberCard = ({ member }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card sx={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        color: 'white',
        height: '100%',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 10px 25px rgba(0,0,0,0.3)'
        },
        transition: 'all 0.3s ease'
      }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Badge
              badgeContent=""
              sx={{
                '& .MuiBadge-badge': {
                  backgroundColor: availabilityColors[member.availability],
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  border: '2px solid white'
                }
              }}
            >
              <Avatar
                sx={{
                  width: 60,
                  height: 60,
                  background: `linear-gradient(45deg, ${departmentColors[member.department]}, #764ba2)`,
                  fontSize: '1.2rem',
                  fontWeight: 'bold'
                }}
              >
                {member.avatar}
              </Avatar>
            </Badge>
            
            <Box sx={{ ml: 2, flex: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                {member.name}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8, mb: 0.5 }}>
                {member.role}
              </Typography>
              <Chip
                label={member.department}
                size="small"
                sx={{
                  backgroundColor: departmentColors[member.department],
                  color: 'white',
                  fontSize: '0.7rem'
                }}
              />
            </Box>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <IconButton size="small" sx={{ color: '#00b894' }}>
                <Chat />
              </IconButton>
              <IconButton size="small" sx={{ color: '#667eea' }}>
                <VideoCall />
              </IconButton>
            </Box>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                Nivel:
              </Typography>
              <Chip
                label={member.level}
                size="small"
                sx={{
                  backgroundColor: levelColors[member.level],
                  color: 'white',
                  fontSize: '0.7rem'
                }}
              />
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                Estado:
              </Typography>
              <Chip
                label={member.status}
                size="small"
                sx={{
                  backgroundColor: statusColors[member.status],
                  color: 'white',
                  fontSize: '0.7rem'
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                Disponibilidad:
              </Typography>
              <Typography variant="caption" sx={{ 
                color: availabilityColors[member.availability],
                fontWeight: 'bold'
              }}>
                {member.availability}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
              Rendimiento
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" sx={{ color: '#667eea', fontWeight: 'bold' }}>
                  {member.projectsCompleted}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.7 }}>
                  Proyectos
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" sx={{ color: '#00b894', fontWeight: 'bold' }}>
                  {member.tasksCompleted}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.7 }}>
                  Tareas
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" sx={{ color: '#ffd700', fontWeight: 'bold' }}>
                  {member.rating}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.7 }}>
                  Rating
                </Typography>
              </Box>
            </Box>

            <LinearProgress
              variant="determinate"
              value={(member.rating / 5) * 100}
              sx={{
                height: 4,
                borderRadius: 2,
                backgroundColor: 'rgba(255,255,255,0.1)',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#ffd700',
                  borderRadius: 2
                }
              }}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" sx={{ opacity: 0.7, mb: 1, display: 'block' }}>
              Habilidades principales:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {member.skills.slice(0, 3).map((skill, index) => (
                <Chip
                  key={index}
                  label={skill}
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    fontSize: '0.7rem'
                  }}
                />
              ))}
              {member.skills.length > 3 && (
                <Chip
                  label={`+${member.skills.length - 3}`}
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    fontSize: '0.7rem'
                  }}
                />
              )}
            </Box>
          </Box>

          {/* Acciones */}
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'space-between' }}>
            <Button
              size="small"
              onClick={() => setSelectedMember(member)}
              sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}
              variant="outlined"
            >
              Ver perfil
            </Button>
            
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                <Edit />
              </IconButton>
              <IconButton 
                size="small" 
                onClick={() => deleteMember(member.id)}
                sx={{ color: '#e17055' }}
              >
                <Delete />
              </IconButton>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );

  const MemberDetailDialog = ({ member, open, onClose }) => (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          color: 'white'
        }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              sx={{
                width: 50,
                height: 50,
                background: `linear-gradient(45deg, ${departmentColors[member?.department]}, #764ba2)`,
                mr: 2
              }}
            >
              {member?.avatar}
            </Avatar>
            <Box>
              <Typography variant="h6">{member?.name}</Typography>
              <Typography variant="body2" sx={{ opacity: 0.7 }}>
                {member?.role}
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={onClose} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        {member && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ mb: 2 }}>Información de Contacto</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Email sx={{ mr: 1, opacity: 0.7 }} />
                <Typography variant="body2">{member.email}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Phone sx={{ mr: 1, opacity: 0.7 }} />
                <Typography variant="body2">{member.phone}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Work sx={{ mr: 1, opacity: 0.7 }} />
                <Typography variant="body2">{member.location}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CalendarToday sx={{ mr: 1, opacity: 0.7 }} />
                <Typography variant="body2">
                  Desde: {new Date(member.joinDate).toLocaleDateString()}
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ mb: 2 }}>Estadísticas</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 2 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: '#667eea', fontWeight: 'bold' }}>
                    {member.projectsCompleted}
                  </Typography>
                  <Typography variant="caption">Proyectos</Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: '#00b894', fontWeight: 'bold' }}>
                    {member.tasksCompleted}
                  </Typography>
                  <Typography variant="caption">Tareas</Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: '#ffd700', fontWeight: 'bold' }}>
                    {member.rating}
                  </Typography>
                  <Typography variant="caption">Rating</Typography>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2 }}>Biografía</Typography>
              <Typography variant="body2" sx={{ opacity: 0.8, lineHeight: 1.6 }}>
                {member.bio}
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2 }}>Todas las Habilidades</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {member.skills.map((skill, index) => (
                  <Chip
                    key={index}
                    label={skill}
                    sx={{
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      color: 'white'
                    }}
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
        )}
      </DialogContent>
    </Dialog>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      style={{ padding: '2rem', minHeight: '100vh' }}
    >
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}>
              👥 Gestión de Equipo
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              Administra y colabora con tu equipo de trabajo
            </Typography>
          </Box>
          
          <Badge badgeContent={members.length} color="primary">
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpenDialog(true)}
              sx={{
                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #5a6fd8, #6a4190)'
                }
              }}
            >
              Añadir Miembro
            </Button>
          </Badge>
        </Box>

        {/* Estadísticas del equipo */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{
              background: 'rgba(102, 126, 234, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(102, 126, 234, 0.3)',
              color: 'white'
            }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <FaUsers style={{ fontSize: 30, color: '#667eea', marginBottom: 8 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#667eea' }}>
                  {members.length}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Miembros Totales
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{
              background: 'rgba(0, 184, 148, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(0, 184, 148, 0.3)',
              color: 'white'
            }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <FaTrophy style={{ fontSize: 30, color: '#00b894', marginBottom: 8 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#00b894' }}>
                  {members.reduce((sum, member) => sum + member.projectsCompleted, 0)}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Proyectos Completados
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{
              background: 'rgba(253, 203, 110, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(253, 203, 110, 0.3)',
              color: 'white'
            }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <FaFire style={{ fontSize: 30, color: '#fdcb6e', marginBottom: 8 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#fdcb6e' }}>
                  {members.filter(member => member.status === 'Activo').length}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Miembros Activos
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{
              background: 'rgba(255, 215, 0, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 215, 0, 0.3)',
              color: 'white'
            }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <FaCrown style={{ fontSize: 30, color: '#ffd700', marginBottom: 8 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#ffd700' }}>
                  {(members.reduce((sum, member) => sum + member.rating, 0) / members.length).toFixed(1)}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Rating Promedio
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Grid de miembros */}
      <Grid container spacing={3}>
        {members.map((member) => (
          <Grid item xs={12} md={6} lg={4} key={member.id}>
            <MemberCard member={member} />
          </Grid>
        ))}
      </Grid>

      {/* Dialog para añadir miembro */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: 'white'
          }
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">👥 Añadir Nuevo Miembro</Typography>
            <IconButton onClick={() => setOpenDialog(false)} sx={{ color: 'white' }}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nombre completo"
                value={newMember.name}
                onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                sx={{
                  '& .MuiOutlinedInput-root': { color: 'white' },
                  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' }
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={newMember.email}
                onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
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
                value={newMember.phone}
                onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                sx={{
                  '& .MuiOutlinedInput-root': { color: 'white' },
                  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' }
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Rol/Posición"
                value={newMember.role}
                onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                sx={{
                  '& .MuiOutlinedInput-root': { color: 'white' },
                  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' }
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>Departamento</InputLabel>
                <Select
                  value={newMember.department}
                  onChange={(e) => setNewMember({ ...newMember, department: e.target.value })}
                  sx={{ color: 'white' }}
                >
                  <MenuItem value="Desarrollo">Desarrollo</MenuItem>
                  <MenuItem value="Diseño">Diseño</MenuItem>
                  <MenuItem value="Analytics">Analytics</MenuItem>
                  <MenuItem value="Marketing">Marketing</MenuItem>
                  <MenuItem value="Ventas">Ventas</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>Nivel</InputLabel>
                <Select
                  value={newMember.level}
                  onChange={(e) => setNewMember({ ...newMember, level: e.target.value })}
                  sx={{ color: 'white' }}
                >
                  <MenuItem value="Junior">Junior</MenuItem>
                  <MenuItem value="Mid">Mid</MenuItem>
                  <MenuItem value="Senior">Senior</MenuItem>
                  <MenuItem value="Lead">Lead</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Ubicación"
                value={newMember.location}
                onChange={(e) => setNewMember({ ...newMember, location: e.target.value })}
                sx={{
                  '& .MuiOutlinedInput-root': { color: 'white' },
                  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Habilidades (separadas por comas)"
                value={newMember.skills}
                onChange={(e) => setNewMember({ ...newMember, skills: e.target.value })}
                placeholder="React, JavaScript, Node.js..."
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
                label="Biografía/Descripción"
                value={newMember.bio}
                onChange={(e) => setNewMember({ ...newMember, bio: e.target.value })}
                sx={{
                  '& .MuiOutlinedInput-root': { color: 'white' },
                  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' }
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenDialog(false)} sx={{ color: 'rgba(255,255,255,0.7)' }}>
            Cancelar
          </Button>
          <Button
            onClick={handleAddMember}
            variant="contained"
            sx={{
              background: 'linear-gradient(45deg, #667eea, #764ba2)',
              '&:hover': {
                background: 'linear-gradient(45deg, #5a6fd8, #6a4190)'
              }
            }}
          >
            Añadir Miembro
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de detalle de miembro */}
      <MemberDetailDialog
        member={selectedMember}
        open={Boolean(selectedMember)}
        onClose={() => setSelectedMember(null)}
      />
    </motion.div>
  );
};

export default Team; 