'use strict'

import { saveScore, showRanking } from './lib/db.js';
import { objScore } from './lib/notes.js';
import { objPiano } from './lib/piano.js';

import { db } from './lib/firebase.js';
import { collection, addDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js';



// -------------------
// タイピング表示関数（残す）
/**
 * 引数で受け取った要素に受け取った文字をタイピング風に出力
 * @param {object} element - 文字列の出力先の要素
 * @returns {object} - タイピングを開始する関数
 */
const typing = (element) => {
  const defaultMsecDelay = 30;
  let index = 0;
  let intervalId;
  let summary;
  const write = () => {
      element.innerHTML += summary[index];
      index++;
      if (index > summary.length - 1) {
          clearInterval(intervalId);
      }
  }
  const execInterval = (argSumm, argMsDelay) => {
      execInterval.reset();
      summary = argSumm;
      const msDelay = argMsDelay > 0 ? argMsDelay : defaultMsecDelay;
      intervalId = setInterval(write, msDelay);
  }
  execInterval.start = () => execInterval();
  execInterval.stop = () => clearInterval(intervalId);
  execInterval.reset = () => {
      clearInterval(intervalId);
      element.innerText = "";
      index = 0;
  }
  return execInterval;
};

// -------------------
document.addEventListener('DOMContentLoaded', () => {

  const divTitle = document.querySelector("#title");
  const divMenu = document.querySelector("#main-menu");
  const divDrill = document.querySelector("#drill-area");
  const btnStart = document.querySelector("#btn-start");
  const btnGame = document.querySelector("#btn-game");
  const resArea = document.getElementById("res-area");

  // タイトル表示（タイピング演出）
  setTimeout(() => {
    const t = typing(divTitle);
    t("Notes Drill for mina", 87);
  }, 2100);

  const piano = objPiano("piano");
  const score = objScore("score-area");
  let notes = ['c/4','d/4','e/4','f/4','g/4','a/4','b/4','c/5']; // サンプル音符

  // -------------------
  // Startボタン：従来の1問トレーニング
  btnStart.addEventListener("click", () => {
    divMenu.style.display = "none";
    divDrill.style.display = "flex";
    score.drawNote(rndChoice(notes));
  });

  // -------------------
  // Gameボタン：10問連続ゲーム
  btnGame.addEventListener("click", async () => {
    divMenu.style.display = "none";
    divDrill.style.display = "flex";

    const totalQuestions = 10;
    let correctCount = 0;
    const startTime = Date.now();

    for (let i = 0; i < totalQuestions; i++) {
      const note = rndChoice(notes);
      score.drawNote(note);
      resArea.innerText = `問題 ${i+1}/${totalQuestions}`;
      
      const answer = await waitKeyPress(); // キー入力待機
      const correctValue = score.getValue().split('/')[0];

      if (answer.includes(correctValue)) {
        correctCount++;
        resArea.style.color = "green";
        resArea.innerText = `正解！ ${correctValue}`;
      } else {
        resArea.style.color = "red";
        resArea.innerText = `惜しい ${correctValue}`;
      }

      await sleep(500);
    }

    const endTime = Date.now();
    const clearTime = ((endTime - startTime)/1000).toFixed(1); // 秒
    const accuracy = Math.round((correctCount/totalQuestions)*100);
    const totalScore = accuracy / clearTime;

    // 名前入力
    let name = localStorage.getItem('playerName');
    if (!name) {
      name = prompt("クリアしました！ 名前を入力してください");
      localStorage.setItem('playerName', name);
    }

    await saveScore(name, clearTime, accuracy, totalScore);

    // ランキング表示
    await showRanking('ranking-area', 10);
  });

  // -------------------
  // ヘルパー関数
  function rndChoice(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function waitKeyPress() {
    return new Promise(resolve => {
      const listener = (event) => {
        document.removeEventListener('keyTouched', listener);
        resolve(event.detail.key.split(','));
      };
      document.addEventListener('keyTouched', listener);
    });
  }

});
