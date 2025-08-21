'use strict'

import { saveScore, showRanking } from './lib/db.js';
import { objScore } from './lib/notes.js';
import { objPiano } from './lib/piano.js';

import { db } from './lib/firebase.js';
import { collection, addDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js';

// 設定定義
const notesTreble = [
  'a/3', 'b/3', 'c/4', 'd/4', 'e/4', 'f/4', 'g/4', 'a/4', 'b/4', 'c/5', 'd/5', 'e/5', 'f/5', 'g/5',
  'a/5', 'b/5', 'c/6', '#a/3', '#c/4', '#d/4', '#f/4', '#g/4', '#a/4', '#c/5', '#d/5', '#f/5', '#g/5',
  '#a/5', '#c/6', '_a/3', '_b/3', '_d/4', '_e/4', '_g/4', '_a/4', '_b/4', '_d/5', '_e/5', '_g/5',
  '_a/5', '_b/5'
]

const notesBass = [
  'c/2', 'd/2', 'e/2', 'f/2', 'g/2', 'a/2', 'b/2', 'c/3', 'd/3', 'e/3', 'f/3', 'g/3', 'a/3', 'b/3',
  'c/4', 'd/4', 'e/4', '#c/2', '#d/2', '#f/2', '#g/2', '#a/2', '#c/3', '#d/3', '#f/3', '#g/3', '#a/3',
  '#c/4', '#d/4', '_d/2', '_e/2', '_g/2', '_a/2', '_b/2', '_d/3', '_e/3', '_g/3', '_a/3', '_b/3',
  '_d/4', '_e/4'
]

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
  const btnTop = document.getElementById("btn-top");
  const btnQues = document.getElementById("btn-question");
  const resArea = document.getElementById("res-area");
  const cntArea = document.getElementById("count-area");

  // タイトル表示（タイピング演出）
  setTimeout(() => {
    const t = typing(divTitle);
    t("Notes Drill for mina", 87);
  }, 2000);

  const piano = objPiano("piano");
  const score = objScore("score-area");
  let notes = notesTreble;

  // topに戻るボタン
  btnTop.addEventListener("click", () => {
    divMenu.style.display = "flex";
    divDrill.style.display = "none";
  });

  // 出題と判定関数
  const ask_question = async  () => {
    const note = rndChoice(notes);
    score.drawNote(note);
    resArea.innerHTML = "";
    const answer = await waitKeyPress(); // キー入力待機
    const correctValue = score.getValue().split('/')[0];

    // 表示用に記号変換
    let correctDispValue = '';
    correctDispValue = correctValue.replace("_", "♭");
    correctDispValue = correctDispValue.replace("#", "＃");
    correctDispValue = correctDispValue.toUpperCase();

    // 判定
    // if (answer.includes(correctValue)) {
    //   resArea.style.color = "green";
    //   resArea.innerText = `正解！ ${correctValue}`;
    // } else {
    //   resArea.style.color = "red";
    //   resArea.innerText = `惜しい ${correctValue}`;
    // }

    // 判定表示
    let isCorrect = false;
    if (answer.includes(correctValue)) {
      isCorrect = true;
      resArea.style.color = "rgb(23, 206, 23)";
      resArea.innerHTML = `正解${rndChoice(["🎉", "🎊", "🎈", "👍", "😊", "🙆‍♂️"])} ${correctDispValue}`;
    } else {
      resArea.style.color = "rgb(229, 241, 60)";
      resArea.innerHTML = `惜しい${rndChoice(["😱", "😣", "😵", "🙈", "👻", "😝"])} ${correctDispValue}`;
    }

    return isCorrect;

  }

  // trainingボタン：従来の1問トレーニング
  btnStart.addEventListener("click", () => {
    divMenu.style.display = "none";
    divDrill.style.display = "flex";
    // score.drawNote(rndChoice(notes));
    ask_question();
  });

  //出題ボタン
  btnQues.addEventListener("click", () => {
    ask_question();
  });

  // トグルボタンイベント
  document.querySelectorAll(".cnf-tgl > input").forEach( elm => {
    elm.addEventListener("change", (e) => {
        const isChecked = elm.checked;
        // 出題数（将来用）
        if (elm.id === "drill-count") {
            
        }
        // 音部記号
        if (elm.id === "opt-cref") {
          if (isChecked) {
            notes = notesBass;
          } else {
            notes = notesTreble;
          }
          score.drawNote(rndChoice(notes));
        }
        // 音階表示
        if (elm.id === "opt-scale") {
          if (isChecked) {
            piano.changeScale('ita');
          } else {
            piano.changeScale('eng');
          }
        }
        // 苦手優先（将来用）
        if (elm.id === "wake-mode") {
            
        }
      
    });
  });

  

  // -------------------
  // Gameボタン：10問連続ゲーム
  btnGame.addEventListener("click", async () => {
    divMenu.style.display = "none";
    divDrill.style.display = "flex";

    const totalQuestions = 10;
    let correctCount = 0;
    const startTime = Date.now();

    // ここで「スタートキーを押すまで待つ」
    btnQues.hidden = true;
    cntArea.style.height = '20pt'
    cntArea.style.fontSize = '20pt'
    cntArea.style.color = "white";
    cntArea.innerText = "鍵盤を押すとスタートします...";
    score.drawNote(false);

    await waitKeyPress();   // ← ここで最初のキー入力を待つ
    cntArea.innerText = "";

    for (let i = 0; i < totalQuestions; i++) {
      // const note = rndChoice(notes);
      // score.drawNote(note);

      cntArea.style.color = "rgb(255, 255, 255)";
      cntArea.innerText = `${i+1}/${totalQuestions}`;
  
      // const answer = await waitKeyPress(); // キー入力待機
      // const correctValue = score.getValue().split('/')[0];

      // if (answer.includes(correctValue)) {
      //   correctCount++;
      //   resArea.style.color = "green";
      //   resArea.innerText = `正解！ ${correctValue}`;
      // } else {
      //   resArea.style.color = "red";
      //   resArea.innerText = `惜しい ${correctValue}`;
      // }

      await ask_question() && correctCount++;

      await sleep(600);
    }

    const endTime = Date.now();
    const clearTime = ((endTime - startTime)/1000).toFixed(1); // 秒
    const accuracy = Math.round((correctCount/totalQuestions)*100);
    const totalScore = accuracy / clearTime;

    cntArea.style.color = "rgb(252, 215, 10)";
    cntArea.innerText = `タイム: ${clearTime}　正解率: ${accuracy}%`;

    // 名前入力
    let name = localStorage.getItem('playerName');
    // if (!name) {
    //   name = prompt("クリアしました！ 名前を入力してください");
    //   localStorage.setItem('playerName', name);
    // }

    name = prompt("クリアしました！ 名前を入力してください", name ?? '');
    if (name === null || name.trim() === "") {
      name = "わるめのねこ";
    }

    await saveScore(name, clearTime, accuracy, totalScore);

    // ランキング表示
    //await showRanking('ranking-area', 10);
  });

  // -------------------
  // ヘルパー関数
  function rndChoice(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // ピアノ打鍵イベント
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
