import { db } from "./firebase.js";
import { collection, addDoc, getDocs, query, orderBy, limit } 
  from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

// スコア保存
export async function saveScore(player, score) {
  await addDoc(collection(db, "scores"), {
    player: player,
    score: score,
    createdAt: new Date()
  });
}

// ランキング取得（上位10件）
export async function getRanking() {
  const q = query(collection(db, "scores"), orderBy("score", "desc"), limit(10));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data());
}
