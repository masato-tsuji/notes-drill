import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "xxxxx",
  authDomain: "xxxxx.firebaseapp.com",
  projectId: "xxxxx",
  storageBucket: "xxxxx.appspot.com",
  messagingSenderId: "xxxxx",
  appId: "xxxxx"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
