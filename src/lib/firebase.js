'use strict'

// Firebase SDK v9 Modular を使用
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";


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

export const auth = getAuth(app);
const db = getFirestore(app);


//匿名ログインを開始
signInAnonymously(auth)
  .then(() => {
    // console.log("匿名ログイン成功");
    // testFirestore();
  })
  .catch((error) => {
    console.error("firebase anonymouseログイン失敗:", error);
  });


import { collection, addDoc, serverTimestamp, query, orderBy, getDocs, limit } 
  from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

async function testFirestore() {
  try {
    console.log("== Fir estore 接続テスト開始 ==");

    // 書き込みテスト
    // const docRef = await addDoc(collection(db, "NotesDrillRecord"), {
    const docRef = await addDoc(collection(db, "testCollection"), {
      message: "Hello Firestore!",
      timestamp: new Date()
    });
    console.log("書き込み成功, doc ID:", docRef.id);

    // 読み込みテスト
    const snapshot = await getDocs(collection(db, "testCollection"));
    console.log("読み込み成功, 件数:", snapshot.size);
    snapshot.forEach(doc => {
      console.log("doc:", doc.id, doc.data());
    });

    console.log("== Firestore 接続テスト完了 ==");
  } catch (e) {
    console.error("Firestore テスト失敗:", e);
  }
}


export { db };


