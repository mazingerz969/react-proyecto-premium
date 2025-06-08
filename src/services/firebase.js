import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, GithubAuthProvider, FacebookAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDemo_Key_Replace_With_Real",
  authDomain: "crypto-dashboard-demo.firebaseapp.com",
  projectId: "crypto-dashboard-demo",
  storageBucket: "crypto-dashboard-demo.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:demo_app_id"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar servicios
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);

// Configurar proveedores de autenticación
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();
export const facebookProvider = new FacebookAuthProvider();

// Configuraciones adicionales para los proveedores
googleProvider.addScope('profile');
googleProvider.addScope('email');

githubProvider.addScope('user:email');

export default app; 