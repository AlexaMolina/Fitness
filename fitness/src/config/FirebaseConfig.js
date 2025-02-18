import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAq-EqFCwlvmrErFuSxYcpL530HUpY64T8",
  authDomain: "fitness-3c76e.firebaseapp.com",
  projectId: "fitness-3c76e",
  storageBucket: "fitness-3c76e.firebasestorage.app",
  messagingSenderId: "837167005636",
  appId: "1:837167005636:web:48bae5cf23234c4b4e6e91",
  measurementId: "G-XCS9KYRX6E",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export { auth, googleProvider, facebookProvider };
