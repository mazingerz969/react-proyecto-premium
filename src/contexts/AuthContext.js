import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { 
  auth, 
  firestore, 
  storage, 
  googleProvider, 
  githubProvider, 
  facebookProvider 
} from '../services/firebase';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);

  // Escuchar cambios en la autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        await loadUserProfile(user.uid);
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Cargar perfil del usuario desde Firestore
  const loadUserProfile = async (uid) => {
    try {
      const userDoc = await getDoc(doc(firestore, 'users', uid));
      if (userDoc.exists()) {
        setUserProfile(userDoc.data());
      } else {
        // Crear perfil básico si no existe
        const basicProfile = {
          uid,
          email: auth.currentUser?.email,
          displayName: auth.currentUser?.displayName || 'Usuario',
          photoURL: auth.currentUser?.photoURL || null,
          createdAt: new Date(),
          preferences: {
            theme: 'default',
            notifications: true,
            newsletter: false
          },
          portfolio: [],
          alerts: []
        };
        await setDoc(doc(firestore, 'users', uid), basicProfile);
        setUserProfile(basicProfile);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      toast.error('Error al cargar el perfil del usuario');
    }
  };

  // Registro con email y contraseña
  const signUpWithEmail = async (email, password, displayName) => {
    try {
      setAuthLoading(true);
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      
      // Actualizar perfil
      await updateProfile(user, { displayName });
      
      // Crear documento en Firestore
      const userProfile = {
        uid: user.uid,
        email: user.email,
        displayName: displayName,
        photoURL: null,
        createdAt: new Date(),
        preferences: {
          theme: 'default',
          notifications: true,
          newsletter: false
        },
        portfolio: [],
        alerts: []
      };
      
      await setDoc(doc(firestore, 'users', user.uid), userProfile);
      setUserProfile(userProfile);
      
      toast.success(`¡Bienvenido ${displayName}! Tu cuenta ha sido creada.`);
      return user;
    } catch (error) {
      console.error('Error in signUpWithEmail:', error);
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  // Inicio de sesión con email
  const signInWithEmail = async (email, password) => {
    try {
      setAuthLoading(true);
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      toast.success(`¡Bienvenido de vuelta ${user.displayName || 'Usuario'}!`);
      return user;
    } catch (error) {
      console.error('Error in signInWithEmail:', error);
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  // Inicio de sesión con Google
  const signInWithGoogle = async () => {
    try {
      setAuthLoading(true);
      const { user } = await signInWithPopup(auth, googleProvider);
      
      // Verificar si es la primera vez del usuario
      const userDoc = await getDoc(doc(firestore, 'users', user.uid));
      if (!userDoc.exists()) {
        const userProfile = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          createdAt: new Date(),
          preferences: {
            theme: 'default',
            notifications: true,
            newsletter: false
          },
          portfolio: [],
          alerts: []
        };
        await setDoc(doc(firestore, 'users', user.uid), userProfile);
      }
      
      toast.success(`¡Bienvenido ${user.displayName}!`);
      return user;
    } catch (error) {
      console.error('Error in signInWithGoogle:', error);
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  // Inicio de sesión con GitHub
  const signInWithGitHub = async () => {
    try {
      setAuthLoading(true);
      const { user } = await signInWithPopup(auth, githubProvider);
      
      const userDoc = await getDoc(doc(firestore, 'users', user.uid));
      if (!userDoc.exists()) {
        const userProfile = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          createdAt: new Date(),
          preferences: {
            theme: 'default',
            notifications: true,
            newsletter: false
          },
          portfolio: [],
          alerts: []
        };
        await setDoc(doc(firestore, 'users', user.uid), userProfile);
      }
      
      toast.success(`¡Bienvenido ${user.displayName}!`);
      return user;
    } catch (error) {
      console.error('Error in signInWithGitHub:', error);
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  // Cerrar sesión
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserProfile(null);
      toast.success('Sesión cerrada correctamente');
    } catch (error) {
      console.error('Error in logout:', error);
      toast.error('Error al cerrar sesión');
    }
  };

  // Restablecer contraseña
  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Correo de restablecimiento enviado');
    } catch (error) {
      console.error('Error in resetPassword:', error);
      throw error;
    }
  };

  // Actualizar perfil de usuario
  const updateUserProfile = async (profileData) => {
    try {
      if (!user) throw new Error('Usuario no autenticado');

      // Actualizar en Firebase Auth si hay cambios en displayName
      if (profileData.displayName && profileData.displayName !== user.displayName) {
        await updateProfile(user, { displayName: profileData.displayName });
      }

      // Actualizar en Firestore
      await updateDoc(doc(firestore, 'users', user.uid), {
        ...profileData,
        updatedAt: new Date()
      });

      // Actualizar estado local
      setUserProfile(prev => ({ ...prev, ...profileData }));
      toast.success('Perfil actualizado correctamente');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Error al actualizar el perfil');
      throw error;
    }
  };

  // Subir avatar
  const uploadAvatar = async (file) => {
    try {
      if (!user) throw new Error('Usuario no autenticado');

      const fileRef = ref(storage, `avatars/${user.uid}`);
      await uploadBytes(fileRef, file);
      const photoURL = await getDownloadURL(fileRef);

      // Actualizar en Firebase Auth y Firestore
      await updateProfile(user, { photoURL });
      await updateDoc(doc(firestore, 'users', user.uid), { photoURL });

      setUserProfile(prev => ({ ...prev, photoURL }));
      toast.success('Avatar actualizado correctamente');
      return photoURL;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Error al subir el avatar');
      throw error;
    }
  };

  // Cambiar contraseña
  const changePassword = async (currentPassword, newPassword) => {
    try {
      if (!user || !user.email) throw new Error('Usuario no autenticado');

      // Reautenticar usuario
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Cambiar contraseña
      await updatePassword(user, newPassword);
      toast.success('Contraseña cambiada correctamente');
    } catch (error) {
      console.error('Error changing password:', error);
      if (error.code === 'auth/wrong-password') {
        toast.error('Contraseña actual incorrecta');
      } else {
        toast.error('Error al cambiar la contraseña');
      }
      throw error;
    }
  };

  // Actualizar portfolio del usuario
  const updateUserPortfolio = async (portfolio) => {
    try {
      if (!user) throw new Error('Usuario no autenticado');
      
      await updateDoc(doc(firestore, 'users', user.uid), { portfolio });
      setUserProfile(prev => ({ ...prev, portfolio }));
    } catch (error) {
      console.error('Error updating portfolio:', error);
      throw error;
    }
  };

  // Actualizar alertas del usuario
  const updateUserAlerts = async (alerts) => {
    try {
      if (!user) throw new Error('Usuario no autenticado');
      
      await updateDoc(doc(firestore, 'users', user.uid), { alerts });
      setUserProfile(prev => ({ ...prev, alerts }));
    } catch (error) {
      console.error('Error updating alerts:', error);
      throw error;
    }
  };

  const value = {
    // Estado
    user,
    userProfile,
    loading,
    authLoading,
    
    // Métodos de autenticación
    signUpWithEmail,
    signInWithEmail,
    signInWithGoogle,
    signInWithGitHub,
    logout,
    resetPassword,
    
    // Métodos de perfil
    updateUserProfile,
    uploadAvatar,
    changePassword,
    updateUserPortfolio,
    updateUserAlerts,
    
    // Helpers
    isAuthenticated: !!user,
    isEmailVerified: user?.emailVerified || false
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 