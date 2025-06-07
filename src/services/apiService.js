// 🌐 Servicio centralizado para APIs externas
class ApiService {
  constructor() {
    // APIs gratuitas (sin necesidad de API key)
    this.endpoints = {
      // 🌤️ Clima - OpenWeatherMap (requiere API key gratuita)
      weather: 'https://api.openweathermap.org/data/2.5/weather',
      
      // 📰 Noticias - NewsAPI alternativa gratuita
      news: 'https://newsdata.io/api/1/news',
      
      // 💰 Criptomonedas - CoinGecko (gratis)
      crypto: 'https://api.coingecko.com/api/v3/simple/price',
      
      // 💭 Frases motivacionales - Quotable (gratis)
      quotes: 'https://api.quotable.io/random',
      
      // 🌍 Información de IP y ubicación (gratis)
      location: 'https://ipapi.co/json',
      
      // 📊 Datos financieros simulados (JSONPlaceholder)
      financial: 'https://jsonplaceholder.typicode.com/posts'
    };

    // Cache para optimizar requests
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutos
  }

  // 🔧 Método genérico para fetch con cache
  async fetchWithCache(url, cacheKey, options = {}) {
    // Verificar cache
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Guardar en cache
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });

      return data;
    } catch (error) {
      console.error(`Error fetching ${cacheKey}:`, error);
      
      // Devolver datos simulados en caso de error
      return this.getFallbackData(cacheKey);
    }
  }

  // 🌤️ Obtener datos del clima
  async getWeatherData(city = 'Madrid') {
    try {
      // Usando una API gratuita alternativa
      const data = await this.fetchWithCache(
        `https://wttr.in/${city}?format=j1`,
        `weather_${city}`
      );

      if (data && data.current_condition && data.current_condition[0]) {
        const current = data.current_condition[0];
        return {
          location: city,
          temperature: parseInt(current.temp_C),
          description: current.weatherDesc[0].value,
          humidity: parseInt(current.humidity),
          windSpeed: parseInt(current.windspeedKmph),
          icon: this.getWeatherIcon(current.weatherCode)
        };
      }
    } catch (error) {
      console.error('Weather API error:', error);
    }

    // Fallback data
    return this.getFallbackWeather(city);
  }

  // 💰 Obtener precios de criptomonedas
  async getCryptoData() {
    try {
      const data = await this.fetchWithCache(
        `${this.endpoints.crypto}?ids=bitcoin,ethereum,binancecoin,cardano,solana&vs_currencies=usd,eur&include_24hr_change=true`,
        'crypto_prices'
      );

      return Object.entries(data).map(([id, prices]) => ({
        id,
        name: this.getCryptoName(id),
        symbol: this.getCryptoSymbol(id),
        price_usd: prices.usd,
        price_eur: prices.eur,
        change_24h: prices.usd_24h_change || 0,
        icon: this.getCryptoIcon(id)
      }));
    } catch (error) {
      console.error('Crypto API error:', error);
      return this.getFallbackCrypto();
    }
  }

  // 💭 Obtener frase motivacional
  async getMotivationalQuote() {
    try {
      const data = await this.fetchWithCache(
        `${this.endpoints.quotes}?minLength=50&maxLength=120`,
        'motivational_quote'
      );

      return {
        text: data.content,
        author: data.author,
        category: data.tags?.[0] || 'motivación'
      };
    } catch (error) {
      console.error('Quote API error:', error);
      return this.getFallbackQuote();
    }
  }

  // 📰 Obtener noticias (usando RSS to JSON como alternativa)
  async getNewsData() {
    try {
      // Usando RSS2JSON para obtener noticias de BBC
      const data = await this.fetchWithCache(
        'https://api.rss2json.com/v1/api.json?rss_url=http://feeds.bbci.co.uk/news/rss.xml&count=5',
        'news_data'
      );

      if (data && data.items) {
        return data.items.slice(0, 5).map(item => ({
          title: item.title,
          description: item.description?.replace(/<[^>]*>/g, '').substring(0, 150) + '...',
          url: item.link,
          publishedAt: new Date(item.pubDate).toLocaleDateString('es-ES'),
          source: 'BBC News'
        }));
      }
    } catch (error) {
      console.error('News API error:', error);
    }

    return this.getFallbackNews();
  }

  // 🌍 Obtener ubicación del usuario
  async getUserLocation() {
    try {
      const data = await this.fetchWithCache(
        this.endpoints.location,
        'user_location'
      );

      return {
        city: data.city,
        country: data.country_name,
        timezone: data.timezone,
        latitude: data.latitude,
        longitude: data.longitude
      };
    } catch (error) {
      console.error('Location API error:', error);
      return { city: 'Madrid', country: 'España', timezone: 'Europe/Madrid' };
    }
  }

  // 🔧 Métodos auxiliares
  getWeatherIcon(code) {
    const iconMap = {
      '113': '☀️', '116': '⛅', '119': '☁️', '122': '☁️',
      '143': '🌫️', '176': '🌦️', '179': '🌨️', '182': '🌨️',
      '185': '🌨️', '200': '⛈️', '227': '❄️', '230': '❄️',
      '248': '🌫️', '260': '🌫️', '263': '🌦️', '266': '🌦️',
      '281': '🌨️', '284': '🌨️', '293': '🌦️', '296': '🌦️',
      '299': '🌧️', '302': '🌧️', '305': '🌧️', '308': '🌧️',
      '311': '🧊', '314': '🧊', '317': '🌨️', '320': '🌨️',
      '323': '❄️', '326': '❄️', '329': '❄️', '332': '❄️',
      '335': '❄️', '338': '❄️', '350': '🧊', '353': '🌦️',
      '356': '🌧️', '359': '🌧️', '362': '🌨️', '365': '🌨️',
      '368': '❄️', '371': '❄️', '374': '🧊', '377': '🧊',
      '386': '⛈️', '389': '⛈️', '392': '🌨️', '395': '❄️'
    };
    return iconMap[code] || '🌤️';
  }

  getCryptoName(id) {
    const names = {
      bitcoin: 'Bitcoin',
      ethereum: 'Ethereum',
      binancecoin: 'BNB',
      cardano: 'Cardano',
      solana: 'Solana'
    };
    return names[id] || id;
  }

  getCryptoSymbol(id) {
    const symbols = {
      bitcoin: 'BTC',
      ethereum: 'ETH',
      binancecoin: 'BNB',
      cardano: 'ADA',
      solana: 'SOL'
    };
    return symbols[id] || id.toUpperCase();
  }

  getCryptoIcon(id) {
    const icons = {
      bitcoin: '₿',
      ethereum: 'Ξ',
      binancecoin: '🔶',
      cardano: '♠️',
      solana: '◎'
    };
    return icons[id] || '💰';
  }

  // 📋 Datos de fallback
  getFallbackData(type) {
    const fallbacks = {
      weather_Madrid: this.getFallbackWeather('Madrid'),
      crypto_prices: this.getFallbackCrypto(),
      motivational_quote: this.getFallbackQuote(),
      news_data: this.getFallbackNews()
    };

    return fallbacks[type] || null;
  }

  getFallbackWeather(city) {
    return {
      location: city,
      temperature: 22,
      description: 'Despejado',
      humidity: 45,
      windSpeed: 12,
      icon: '☀️'
    };
  }

  getFallbackCrypto() {
    return [
      { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', price_usd: 43500, price_eur: 40200, change_24h: 2.34, icon: '₿' },
      { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', price_usd: 2650, price_eur: 2450, change_24h: 1.85, icon: 'Ξ' },
      { id: 'binancecoin', name: 'BNB', symbol: 'BNB', price_usd: 315, price_eur: 291, change_24h: -0.52, icon: '🔶' }
    ];
  }

  getFallbackQuote() {
    const quotes = [
      { text: "El éxito es la suma de pequeños esfuerzos repetidos día tras día.", author: "Robert Collier", category: "motivación" },
      { text: "La única forma de hacer un gran trabajo es amar lo que haces.", author: "Steve Jobs", category: "trabajo" },
      { text: "No esperes por el momento perfecto, toma el momento y hazlo perfecto.", author: "Zoey Sayward", category: "acción" },
      { text: "El futuro pertenece a quienes creen en la belleza de sus sueños.", author: "Eleanor Roosevelt", category: "sueños" }
    ];
    
    return quotes[Math.floor(Math.random() * quotes.length)];
  }

  getFallbackNews() {
    return [
      {
        title: "Avances en tecnología React 2024",
        description: "Las últimas actualizaciones de React continúan mejorando el rendimiento y la experiencia del desarrollador...",
        url: "#",
        publishedAt: new Date().toLocaleDateString('es-ES'),
        source: "Tech News"
      },
      {
        title: "Tendencias en desarrollo web",
        description: "Las nuevas tendencias en desarrollo web están transformando la forma en que creamos aplicaciones...",
        url: "#",
        publishedAt: new Date().toLocaleDateString('es-ES'),
        source: "Web Dev"
      }
    ];
  }

  // 🧹 Limpiar cache
  clearCache() {
    this.cache.clear();
  }

  // 📊 Obtener estadísticas de cache
  getCacheStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

// Exportar instancia singleton
export const apiService = new ApiService();
export default apiService; 