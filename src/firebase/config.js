import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyAUOcpBsnye4uucc10vzr78pymXNMX7KGQ",
  authDomain: "cuponera-esen.firebaseapp.com",
  projectId: "cuponera-esen",
  storageBucket: "cuponera-esen.firebasestorage.app",
  messagingSenderId: "991616908282",
  appId: "1:991616908282:web:66a2f32b729463a864c243",
  measurementId: "G-FTFTSPMWBS"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

