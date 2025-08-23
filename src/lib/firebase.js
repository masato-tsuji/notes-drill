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
const db = getFirestore(app);

export const auth = getAuth(app);

//匿名ログインを開始
signInAnonymously(auth)
  .then(() => {
    console.log("匿名ログイン成功");
  })
  .catch((error) => {
    console.error("匿名ログイン失敗:", error);
  });


// ---------------------------------------------------------------------------------------
// 接続テスト関数
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

async function testFirebaseConnection() {
  try {
    const testRef = doc(db, "test", "testdoc");
    const testSnap = await getDoc(testRef);
    if (testSnap.exists()) {
      console.log("Firebase接続成功: ", testSnap.data());
    } else {
      console.log("Firebase接続成功（ドキュメントなし）");
    }
  } catch (e) {
    console.error("Firebase接続失敗: ", e);
  }
}

// ページロード時にテスト実行
// testFirebaseConnection();
// ---------------------------------------------------------------------------------------


export { db };


