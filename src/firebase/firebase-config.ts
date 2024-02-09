import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string; 
}
const firebaseConfig = {
  apiKey: "AIzaSyDRvVpZbUu815Kxs_jq_mBQxjJMbdlin8M",
  authDomain: "ryan-air-bnb.firebaseapp.com",
  projectId: "ryan-air-bnb",
  storageBucket: "ryan-air-bnb.appspot.com",
  messagingSenderId: "616854248323",
  appId: "1:616854248323:web:811844e0e06a72a920f4b6"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);