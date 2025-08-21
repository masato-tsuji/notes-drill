'use strict'

// Firebase SDK v9 Modular を使用
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// Firebase 設定（公開可能なキーだけでOK）
const firebaseConfig = {
  apiKey: "AIzaSyDbjSdjKdbJmXfjrgo4OXwFDd8e99HtVIA",
  authDomain: "webapi-415111.firebaseapp.com",
  projectId: "webapi-415111",
  storageBucket: "webapi-415111.firebasestorage.app",
  messagingSenderId: "1001021334802",
  appId: "1:1001021334802:web:8bf9b5b24a37fc399bbfcb",
  measurementId: "G-4G5MDCBBBB"
};

// Firebase 初期化
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };


