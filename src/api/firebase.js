import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FB_KEY,
  authDomain: 'lego-f1-3d70e.firebaseapp.com',
  projectId: 'lego-f1-3d70e',
  messagingSenderId: '1080335785458',
  storageBucket: 'gs://lego-f1-3d70e.firebasestorage.app',
  appId: '1:1080335785458:web:f6a04a90d4c9cb68389f6b',
};

export const app = initializeApp(firebaseConfig);
