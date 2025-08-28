'use strict';

import { db } from './firebase.js';
import { collection, addDoc, serverTimestamp, query, orderBy, getDocs, limit } 
  from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";


export async function saveAcc(userId, userAgent, scrnSize) {
  try {
    await addDoc(collection(db, "NotesDrillAcc"), {
      user_id: userId,
      userAgent: userAgent,
      scrnSize: scrnSize,
      timestamp: serverTimestamp()
    });
  } catch (e) {
    console.error("error:", e);
  }
}


/**
 * スコアをFirestoreに保存
 * @param {string} userId - ユーザーID
 * @param {string} name - プレイヤー名
 * @param {string} scale - 音符表記スケール
 * @param {number} clearTime - クリア時間（秒）
 * @param {number} accuracy - 正解率（%）
 * @param {number} totalScore - 総合得点
 */
export async function saveScore(userId, name, scale, clearTime, accuracy, totalScore, totalQuestions) {
  try {
    await addDoc(collection(db, "NotesDrillRecord"), {
      user_id: userId,
      name: name,
      scale: scale,
      clear_time: clearTime,
      accuracy: accuracy,
      total_score: totalScore,
      totalQuestions: totalQuestions,
      timestamp: serverTimestamp()
    });
    // console.log("スコアを保存しました:", name);
  } catch (e) {
    console.error("スコア保存エラー:", e);
  }
}

/**
 * Firestoreからランキング取得
 * 総合得点(total_score)降順、同点はtimestamp昇順
 * @param {number} topN - 上位何件取得するか（デフォルト10件）
 * @returns {Array} ランキング配列
 */
export async function getRanking(topN = 10) {
  try {
    const q = query(
      collection(db, "NotesDrillRecord"),
      orderBy("total_score", "desc"),
      orderBy("timestamp", "asc"),
      limit(topN)
    );
    const snapshot = await getDocs(q);
    const ranking = [];
    snapshot.forEach(doc => {
      ranking.push(doc.data());
    });
    return ranking;
  } catch (e) {
    console.error("ランキング取得エラー:", e);
    return [];
  }
}

/**
 * ランキングを指定のdivに表示
 * @param {string} divId - 表示先のdiv ID
 * @param {number} topN - 上位何件表示するか
 */
export async function showRanking(divId = 'ranking-area', topN = 10) {
  const ranking = await getRanking(topN);
  const rankingArea = document.getElementById(divId);
  if (!rankingArea) return;

  let html = `Rankinng
    <table border="1" cellspacing="0" cellpadding="2">
      <tr>
        <th>Rank</th>
        <th>Name</th>
        <th>time</th>
        <th>accur</th>
      </tr>
  `;

  ranking.forEach((data, index) => {
    html += `
      <tr>
        <td>${index + 1}</td>
        <td>${data.name}</td>
        <td>${data.clear_time}</td>
        <td>${data.accuracy}</td>
      </tr>
    `;
  });

  html += "</table>";
  rankingArea.innerHTML = html;
}

/* =========================================================
   🔧 Firestore 接続テスト関数（必要なときだけ使う）
   ========================================================= */
// async function testFirestore() {
//   try {
//     console.log("== Fir estore 接続テスト開始 ==");

//     // 書き込みテスト
//     const docRef = await addDoc(collection(db, "test"), {
//       message: "Hello Firestore!",
//       timestamp: new Date()
//     });
//     console.log("書き込み成功, doc ID:", docRef.id);

//     // 読み込みテスト
//     const snapshot = await getDocs(collection(db, "test"));
//     console.log("読み込み成功, 件数:", snapshot.size);
//     snapshot.forEach(doc => {
//       console.log("doc:", doc.id, doc.data());
//     });

//     console.log("== Firestore 接続テスト完了 ==");
//   } catch (e) {
//     console.error("Firestore テスト失敗:", e);
//   }
// }
