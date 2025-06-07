import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Button,
  Chip,
  LinearProgress,
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
  Menu,
  Avatar,
  Badge
} from '@mui/material';
import {
  Add,
  MoreVert,
  Edit,
  Delete,
  Star,
  StarBorder,
  Search,
  Close,
  CheckCircle,
  Schedule,
  Warning,
  Assignment
} from '@mui/icons-material';
import {
  FaUsers,
  FaCalendarAlt
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const Projects = () => {
  const [projects, setProjects] = useState([
    {
      id: 1,
      title: 'E-commerce Platform',
      description: 'Plataforma de comercio electrónico completa con React y Node.js',
      status: 'en-progreso',
      priority: 'alta',
      progress: 75,
      team: ['JG', 'ML', 'CR'],
      technologies: ['React', 'Node.js', 'MongoDB'],
      startDate: '2024-01-15',
      endDate: '2024-03-20',
      favorite: true,
      budget: 25000,
      client: 'TechCorp'
    },
    {
      id: 2,
      title: 'Mobile App UI/UX',
      description: 'Diseño y desarrollo de aplicación móvil para fitness',
      status: 'completado',
      priority: 'media',
      progress: 100,
      team: ['AM', 'LR'],
      technologies: ['React Native', 'Firebase', 'Redux'],
      startDate: '2023-11-01',
      endDate: '2024-01-10',
      favorite: false,
      budget: 18000,
      client: 'FitLife'
    },
    {
      id: 3,
      title: 'Dashboard Analytics',
      description: 'Panel de control con métricas y analytics en tiempo real',
      status: 'planificado',
      priority: 'alta',
      progress: 15,
      team: ['ER', 'JG'],
      technologies: ['Vue.js', 'D3.js', 'PostgreSQL'],
      startDate: '2024-02-01',
      endDate: '2024-04-15',
      favorite: true,
      budget: 32000,
      client: 'DataSys'
    }
  ]);

  const [filteredProjects, setFilteredProjects] = useState(projects);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [openDialog, setOpenDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    status: 'planificado',
    priority: 'media',
    technologies: '',
    startDate: '',
    endDate: '',
    budget: '',
    client: ''
  });

  const statusConfig = {
    'planificado': { color: '#74b9ff', icon: Schedule, bgColor: 'rgba(116, 185, 255, 0.1)' },
    'en-progreso': { color: '#fdcb6e', icon: Assignment, bgColor: 'rgba(253, 203, 110, 0.1)' },
    'en-revision': { color: '#e17055', icon: Warning, bgColor: 'rgba(225, 112, 85, 0.1)' },
    'completado': { color: '#00b894', icon: CheckCircle, bgColor: 'rgba(0, 184, 148, 0.1)' }
  };

  const priorityConfig = {
    'baja': { color: '#74b9ff', label: 'Baja' },
    'media': { color: '#fdcb6e', label: 'Media' },
    'alta': { color: '#e17055', label: 'Alta' }
  };

  React.useEffect(() => {
    let filtered = projects;

    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.client.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'todos') {
      filtered = filtered.filter(project => project.status === statusFilter);
    }

    setFilteredProjects(filtered);
  }, [projects, searchTerm, statusFilter]);

  const handleCreateProject = () => {
    const project = {
      ...newProject,
      id: Date.now(),
      progress: 0,
      team: ['JG'],
      favorite: false,
      technologies: newProject.technologies.split(',').map(tech => tech.trim()),
      budget: parseInt(newProject.budget)
    };

    setProjects([...projects, project]);
    setOpenDialog(false);
    setNewProject({
      title: '',
      description: '',
      status: 'planificado',
      priority: 'media',
      technologies: '',
      startDate: '',
      endDate: '',
      budget: '',
      client: ''
    });

    toast.success('¡Proyecto creado exitosamente! 🚀', { icon: '✅' });
  };

  const toggleFavorite = (projectId) => {
    setProjects(projects.map(project =>
      project.id === projectId
        ? { ...project, favorite: !project.favorite }
        : project
    ));

    const project = projects.find(p => p.id === projectId);
    toast.success(
      `Proyecto ${project.favorite ? 'removido de' : 'añadido a'} favoritos`,
      { icon: project.favorite ? '💔' : '⭐' }
    );
  };

  const deleteProject = (projectId) => {
    setProjects(projects.filter(project => project.id !== projectId));
    toast.success('Proyecto eliminado', { icon: '🗑️' });
    setAnchorEl(null);
  };

  const ProjectCard = ({ project }) => {
    const StatusIcon = statusConfig[project.status].icon;
    
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <Card sx={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          color: 'white',
          height: '100%',
          position: 'relative',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 10px 25px rgba(0,0,0,0.3)'
          },
          transition: 'all 0.3s ease'
        }}>
          <Box sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            zIndex: 2
          }}>
            <Chip
              label={priorityConfig[project.priority].label}
              size="small"
              sx={{
                backgroundColor: priorityConfig[project.priority].color,
                color: 'white',
                fontWeight: 'bold',
                fontSize: '0.7rem'
              }}
            />
          </Box>

          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ flex: 1, mr: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {project.title}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8, mb: 2, lineHeight: 1.5 }}>
                  {project.description}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                <IconButton
                  onClick={() => toggleFavorite(project.id)}
                  sx={{ color: project.favorite ? '#ffd700' : 'rgba(255,255,255,0.5)' }}
                >
                  {project.favorite ? <Star /> : <StarBorder />}
                </IconButton>
                
                <IconButton
                  onClick={(e) => {
                    setAnchorEl(e.currentTarget);
                    setSelectedProject(project);
                  }}
                  sx={{ color: 'white' }}
                >
                  <MoreVert />
                </IconButton>
              </Box>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{
                  backgroundColor: statusConfig[project.status].bgColor,
                  borderRadius: '8px',
                  padding: '4px 8px',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <StatusIcon sx={{ fontSize: 16, mr: 1, color: statusConfig[project.status].color }} />
                  <Typography variant="caption" sx={{ color: statusConfig[project.status].color, fontWeight: 'bold' }}>
                    {project.status.replace('-', ' ').toUpperCase()}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ ml: 'auto', fontWeight: 'bold' }}>
                  {project.progress}%
                </Typography>
              </Box>
              
              <LinearProgress
                variant="determinate"
                value={project.progress}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: statusConfig[project.status].color,
                    borderRadius: 3
                  }
                }}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="caption" sx={{ opacity: 0.7, mb: 1, display: 'block' }}>
                Tecnologías:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {project.technologies.slice(0, 3).map((tech, index) => (
                  <Chip
                    key={index}
                    label={tech}
                    size="small"
                    sx={{
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      color: 'white',
                      fontSize: '0.7rem'
                    }}
                  />
                ))}
                {project.technologies.length > 3 && (
                  <Chip
                    label={`+${project.technologies.length - 3}`}
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

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <FaCalendarAlt style={{ fontSize: 14, marginRight: 6, opacity: 0.7 }} />
                <Typography variant="caption" sx={{ opacity: 0.7 }}>
                  {new Date(project.endDate).toLocaleDateString()}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="caption" sx={{ opacity: 0.7, mr: 1 }}>
                  Cliente:
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                  {project.client}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <FaUsers style={{ fontSize: 14, marginRight: 6, opacity: 0.7 }} />
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  {project.team.map((member, index) => (
                    <Avatar
                      key={index}
                      sx={{
                        width: 24,
                        height: 24,
                        fontSize: '0.7rem',
                        background: 'linear-gradient(45deg, #667eea, #764ba2)'
                      }}
                    >
                      {member}
                    </Avatar>
                  ))}
                </Box>
              </Box>
              
              <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#00b894' }}>
                €{project.budget?.toLocaleString()}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      style={{ padding: '2rem', minHeight: '100vh' }}
    >
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}>
              🚀 Gestión de Proyectos
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              Organiza y gestiona todos tus proyectos
            </Typography>
          </Box>
          
          <Badge badgeContent={filteredProjects.length} color="primary">
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
              Nuevo Proyecto
            </Button>
          </Badge>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField
            placeholder="Buscar proyectos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            sx={{
              minWidth: 250,
              '& .MuiOutlinedInput-root': {
                color: 'white',
                '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' }
              }
            }}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1, color: 'rgba(255,255,255,0.7)' }} />
            }}
          />
          
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>Estado</InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              sx={{
                color: 'white',
                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' }
              }}
            >
              <MenuItem value="todos">Todos</MenuItem>
              <MenuItem value="planificado">Planificado</MenuItem>
              <MenuItem value="en-progreso">En Progreso</MenuItem>
              <MenuItem value="en-revision">En Revisión</MenuItem>
              <MenuItem value="completado">Completado</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      <AnimatePresence>
        <Grid container spacing={3}>
          {filteredProjects.map((project) => (
            <Grid item xs={12} md={6} lg={4} key={project.id}>
              <ProjectCard project={project} />
            </Grid>
          ))}
        </Grid>
      </AnimatePresence>

      {filteredProjects.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.7)', mb: 2 }}>
            No se encontraron proyectos
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
            Intenta ajustar los filtros o crea un nuevo proyecto
          </Typography>
        </Box>
      )}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={() => setAnchorEl(null)}>
          <Edit sx={{ mr: 1 }} /> Editar
        </MenuItem>
        <MenuItem onClick={() => deleteProject(selectedProject?.id)}>
          <Delete sx={{ mr: 1 }} /> Eliminar
        </MenuItem>
      </Menu>

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
            <Typography variant="h6">🚀 Crear Nuevo Proyecto</Typography>
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
                label="Título del Proyecto"
                value={newProject.title}
                onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                sx={{
                  '& .MuiOutlinedInput-root': { color: 'white' },
                  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' }
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Cliente"
                value={newProject.client}
                onChange={(e) => setNewProject({ ...newProject, client: e.target.value })}
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
                label="Descripción"
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                sx={{
                  '& .MuiOutlinedInput-root': { color: 'white' },
                  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' }
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>Estado</InputLabel>
                <Select
                  value={newProject.status}
                  onChange={(e) => setNewProject({ ...newProject, status: e.target.value })}
                  sx={{ color: 'white' }}
                >
                  <MenuItem value="planificado">Planificado</MenuItem>
                  <MenuItem value="en-progreso">En Progreso</MenuItem>
                  <MenuItem value="en-revision">En Revisión</MenuItem>
                  <MenuItem value="completado">Completado</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>Prioridad</InputLabel>
                <Select
                  value={newProject.priority}
                  onChange={(e) => setNewProject({ ...newProject, priority: e.target.value })}
                  sx={{ color: 'white' }}
                >
                  <MenuItem value="baja">Baja</MenuItem>
                  <MenuItem value="media">Media</MenuItem>
                  <MenuItem value="alta">Alta</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Presupuesto (€)"
                type="number"
                value={newProject.budget}
                onChange={(e) => setNewProject({ ...newProject, budget: e.target.value })}
                sx={{
                  '& .MuiOutlinedInput-root': { color: 'white' },
                  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tecnologías (separadas por comas)"
                value={newProject.technologies}
                onChange={(e) => setNewProject({ ...newProject, technologies: e.target.value })}
                placeholder="React, Node.js, MongoDB..."
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
            onClick={handleCreateProject}
            variant="contained"
            sx={{
              background: 'linear-gradient(45deg, #667eea, #764ba2)',
              '&:hover': {
                background: 'linear-gradient(45deg, #5a6fd8, #6a4190)'
              }
            }}
          >
            Crear Proyecto
          </Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  );
};

export default Projects; 