import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyBNIk7zNOOi6XyLQWT-VDZ3sIHhBuv6eJY",
  authDomain: "todo-722c1.firebaseapp.com",
  projectId: "todo-722c1",
  storageBucket: "todo-722c1.firebasestorage.app",
  messagingSenderId: "670671373668",
  appId: "1:670671373668:web:9a78c1a2f5f05807932671",
  measurementId: "G-EHT1ZSLX4G"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)