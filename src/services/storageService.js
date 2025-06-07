// 💾 Servicio de persistencia de datos
class StorageService {
  constructor() {
    this.dbName = 'ReactPremiumDB';
    this.dbVersion = 1;
    this.db = null;
    this.initDB();
  }

  // 🔄 Inicializar IndexedDB
  async initDB() {
    try {
      const request = indexedDB.open(this.dbName, this.dbVersion);
      
      request.onerror = () => {
        console.warn('IndexedDB no disponible, usando localStorage');
      };

      request.onupgradeneeded = (event) => {
        this.db = event.target.result;
        
        // Crear stores si no existen
        if (!this.db.objectStoreNames.contains('userPreferences')) {
          this.db.createObjectStore('userPreferences', { keyPath: 'id' });
        }
        
        if (!this.db.objectStoreNames.contains('dashboardData')) {
          this.db.createObjectStore('dashboardData', { keyPath: 'id' });
        }
        
        if (!this.db.objectStoreNames.contains('projectsData')) {
          this.db.createObjectStore('projectsData', { keyPath: 'id' });
        }
        
        if (!this.db.objectStoreNames.contains('teamData')) {
          this.db.createObjectStore('teamData', { keyPath: 'id' });
        }
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        console.log('💾 IndexedDB inicializado correctamente');
      };
    } catch (error) {
      console.warn('Error inicializando IndexedDB:', error);
    }
  }

  // 📝 Métodos para localStorage (datos simples)
  
  // Guardar preferencias de usuario
  saveUserPreferences(preferences) {
    try {
      const data = {
        theme: preferences.theme || 'light',
        language: preferences.language || 'es',
        location: preferences.location || 'Madrid',
        notifications: preferences.notifications !== false,
        autoRefresh: preferences.autoRefresh !== false,
        currency: preferences.currency || 'EUR',
        refreshInterval: preferences.refreshInterval || 300000, // 5 minutos
        dashboardWidgets: preferences.dashboardWidgets || {
          weather: true,
          crypto: true,
          news: true,
          quotes: true,
          calculator: true,
          pomodoro: true,
          qr: true,
          stats: true
        },
        savedAt: new Date().toISOString()
      };

      localStorage.setItem('userPreferences', JSON.stringify(data));
      
      // También guardar en IndexedDB si está disponible
      this.saveToIndexedDB('userPreferences', { id: 'main', ...data });
      
      return true;
    } catch (error) {
      console.error('Error guardando preferencias:', error);
      return false;
    }
  }

  // Cargar preferencias de usuario
  getUserPreferences() {
    try {
      const data = localStorage.getItem('userPreferences');
      if (data) {
        return JSON.parse(data);
      }
      
      // Devolver preferencias por defecto
      return this.getDefaultPreferences();
    } catch (error) {
      console.error('Error cargando preferencias:', error);
      return this.getDefaultPreferences();
    }
  }

  // Preferencias por defecto
  getDefaultPreferences() {
    return {
      theme: 'light',
      language: 'es',
      location: 'Madrid',
      notifications: true,
      autoRefresh: true,
      currency: 'EUR',
      refreshInterval: 300000,
      dashboardWidgets: {
        weather: true,
        crypto: true,
        news: true,
        quotes: true,
        calculator: true,
        pomodoro: true,
        qr: true,
        stats: true
      }
    };
  }

  // 🗂️ Métodos para IndexedDB (datos complejos)
  
  async saveToIndexedDB(storeName, data) {
    if (!this.db) return false;

    try {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      await store.put(data);
      return true;
    } catch (error) {
      console.error(`Error guardando en ${storeName}:`, error);
      return false;
    }
  }

  async getFromIndexedDB(storeName, id) {
    if (!this.db) return null;

    try {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      
      return new Promise((resolve, reject) => {
        const request = store.get(id);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error(`Error obteniendo de ${storeName}:`, error);
      return null;
    }
  }

  async getAllFromStore(storeName) {
    if (!this.db) return [];

    try {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      
      return new Promise((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error(`Error obteniendo todos de ${storeName}:`, error);
      return [];
    }
  }

  // 📊 Guardar datos del dashboard
  async saveDashboardData(data) {
    const dashboardData = {
      id: 'current',
      weather: data.weather,
      crypto: data.crypto,
      news: data.news,
      quotes: data.quotes,
      stats: data.stats,
      lastUpdated: new Date().toISOString()
    };

    // Guardar en localStorage para acceso rápido
    localStorage.setItem('dashboardCache', JSON.stringify(dashboardData));
    
    // Guardar en IndexedDB para persistencia
    return await this.saveToIndexedDB('dashboardData', dashboardData);
  }

  // 📊 Cargar datos del dashboard
  async getDashboardData() {
    try {
      // Intentar localStorage primero
      const cached = localStorage.getItem('dashboardCache');
      if (cached) {
        const data = JSON.parse(cached);
        
        // Verificar si los datos no son muy antiguos (1 hora)
        const lastUpdated = new Date(data.lastUpdated);
        const now = new Date();
        const hoursDiff = (now - lastUpdated) / (1000 * 60 * 60);
        
        if (hoursDiff < 1) {
          return data;
        }
      }

      // Si no hay cache válido, intentar IndexedDB
      const indexedData = await this.getFromIndexedDB('dashboardData', 'current');
      return indexedData || null;
    } catch (error) {
      console.error('Error cargando datos del dashboard:', error);
      return null;
    }
  }

  // 🗃️ Gestión de proyectos
  async saveProject(project) {
    const projectData = {
      ...project,
      id: project.id || this.generateId(),
      updatedAt: new Date().toISOString()
    };

    // Guardar proyecto individual
    await this.saveToIndexedDB('projectsData', projectData);
    
    // Actualizar lista de proyectos en localStorage
    const projects = this.getProjectsList();
    const existingIndex = projects.findIndex(p => p.id === projectData.id);
    
    if (existingIndex >= 0) {
      projects[existingIndex] = projectData;
    } else {
      projects.push(projectData);
    }
    
    localStorage.setItem('projectsList', JSON.stringify(projects));
    return projectData;
  }

  getProjectsList() {
    try {
      const data = localStorage.getItem('projectsList');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error cargando lista de proyectos:', error);
      return [];
    }
  }

  async getProject(id) {
    return await this.getFromIndexedDB('projectsData', id);
  }

  async deleteProject(id) {
    if (!this.db) return false;

    try {
      // Eliminar de IndexedDB
      const transaction = this.db.transaction(['projectsData'], 'readwrite');
      const store = transaction.objectStore('projectsData');
      await store.delete(id);

      // Actualizar lista en localStorage
      const projects = this.getProjectsList();
      const filteredProjects = projects.filter(p => p.id !== id);
      localStorage.setItem('projectsList', JSON.stringify(filteredProjects));
      
      return true;
    } catch (error) {
      console.error('Error eliminando proyecto:', error);
      return false;
    }
  }

  // 👥 Gestión de equipo
  async saveTeamMember(member) {
    const memberData = {
      ...member,
      id: member.id || this.generateId(),
      updatedAt: new Date().toISOString()
    };

    await this.saveToIndexedDB('teamData', memberData);
    
    // Actualizar lista de miembros
    const team = this.getTeamList();
    const existingIndex = team.findIndex(m => m.id === memberData.id);
    
    if (existingIndex >= 0) {
      team[existingIndex] = memberData;
    } else {
      team.push(memberData);
    }
    
    localStorage.setItem('teamList', JSON.stringify(team));
    return memberData;
  }

  getTeamList() {
    try {
      const data = localStorage.getItem('teamList');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error cargando lista de equipo:', error);
      return [];
    }
  }

  // 🔧 Utilidades
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // 📈 Analytics de uso
  saveAnalytics(event) {
    try {
      const analytics = this.getAnalytics();
      analytics.events.push({
        ...event,
        timestamp: new Date().toISOString()
      });
      
      // Mantener solo los últimos 1000 eventos
      if (analytics.events.length > 1000) {
        analytics.events = analytics.events.slice(-1000);
      }
      
      localStorage.setItem('appAnalytics', JSON.stringify(analytics));
    } catch (error) {
      console.error('Error guardando analytics:', error);
    }
  }

  getAnalytics() {
    try {
      const data = localStorage.getItem('appAnalytics');
      return data ? JSON.parse(data) : { events: [], sessions: 0 };
    } catch (error) {
      console.error('Error cargando analytics:', error);
      return { events: [], sessions: 0 };
    }
  }

  // 🧹 Limpieza de datos
  clearOldData() {
    try {
      // Limpiar cache del dashboard si es muy antiguo
      const cached = localStorage.getItem('dashboardCache');
      if (cached) {
        const data = JSON.parse(cached);
        const lastUpdated = new Date(data.lastUpdated);
        const now = new Date();
        const daysDiff = (now - lastUpdated) / (1000 * 60 * 60 * 24);
        
        if (daysDiff > 7) {
          localStorage.removeItem('dashboardCache');
        }
      }

      // Limpiar eventos de analytics antiguos
      const analytics = this.getAnalytics();
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      analytics.events = analytics.events.filter(event => 
        new Date(event.timestamp) > oneWeekAgo
      );
      
      localStorage.setItem('appAnalytics', JSON.stringify(analytics));
      
      console.log('🧹 Limpieza de datos completada');
    } catch (error) {
      console.error('Error en limpieza de datos:', error);
    }
  }

  // 📊 Estadísticas de almacenamiento
  getStorageStats() {
    const stats = {
      localStorage: {
        used: 0,
        available: 5 * 1024 * 1024 // 5MB aproximado
      },
      indexedDB: {
        available: this.db !== null
      },
      items: {
        preferences: !!localStorage.getItem('userPreferences'),
        dashboard: !!localStorage.getItem('dashboardCache'),
        projects: this.getProjectsList().length,
        team: this.getTeamList().length,
        analytics: this.getAnalytics().events.length
      }
    };

    // Calcular uso de localStorage
    let totalSize = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        totalSize += localStorage[key].length + key.length;
      }
    }
    stats.localStorage.used = totalSize;

    return stats;
  }

  // 🔄 Exportar/Importar datos
  exportData() {
    const data = {
      preferences: this.getUserPreferences(),
      projects: this.getProjectsList(),
      team: this.getTeamList(),
      analytics: this.getAnalytics(),
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };

    return JSON.stringify(data, null, 2);
  }

  async importData(jsonData) {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.preferences) {
        this.saveUserPreferences(data.preferences);
      }
      
      if (data.projects) {
        for (const project of data.projects) {
          await this.saveProject(project);
        }
      }
      
      if (data.team) {
        for (const member of data.team) {
          await this.saveTeamMember(member);
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error importando datos:', error);
      return false;
    }
  }
}

// Exportar instancia singleton
export const storageService = new StorageService();
export default storageService; 