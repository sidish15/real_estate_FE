// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "real-estate-588a1.firebaseapp.com",
  projectId: "real-estate-588a1",
  storageBucket: "real-estate-588a1.appspot.com",
  messagingSenderId: "217315618158",
  appId: "1:217315618158:web:f4fa8097a460db2859e57f"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// the application that includes all the inf 
// for our Firebase config. So we need to pass it into OAuth file so that firebase recognize which application is craeting the request