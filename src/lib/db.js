'use strict';

import { db } from './firebase.js';
import { collection, addDoc, serverTimestamp, query, orderBy, getDocs, limit } 
  from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

/**
 * スコアをFirestoreに保存
 * @param {string} name - プレイヤー名
 * @param {number} clearTime - クリア時間（秒）
 * @param {number} accuracy - 正解率（%）
 * @param {number} totalScore - 総合得点
 */
export async function saveScore(name, clearTime, accuracy, totalScore) {
  try {
    await addDoc(collection(db, "NotesDrillRecord"), {
      name: name,
      clear_time: clearTime,
      accuracy: accuracy,
      total_score: totalScore,
      timestamp: serverTimestamp()
    });
    console.log("スコアを保存しました:", name);
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

  let html = `<h2>ランキング</h2>
    <table border="1" cellspacing="0" cellpadding="5">
      <tr>
        <th>順位</th>
        <th>名前</th>
        <th>クリア時間(秒)</th>
        <th>正解率(%)</th>
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
