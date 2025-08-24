'use strict'

import { getRanking, saveAcc, saveScore, showRanking } from './lib/db.js';
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

let isGameRunning = false;

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

// モーダルオブジェクトテンプレート
const ModalManager = {
  modal: null,
  content: null,
  init(modalId) { 
    this.modal = document.getElementById(modalId);
    this.content = this.modal.querySelector('.modal-content');
  },
  show(html, onSave, onCancel) {
    this.content.innerHTML = html;
    this.modal.style.display = "block";
    // 保存・キャンセルボタンのイベント
    const saveBtn = this.content.querySelector('.modal-save');
    const cancelBtn = this.content.querySelector('.modal-cancel');
    const closeBtn = this.content.querySelector('.modal-close');
    if (saveBtn) saveBtn.onclick = () => { onSave && onSave(); this.hide(); };
    if (cancelBtn) cancelBtn.onclick = () => { onCancel && onCancel(); this.hide(); };
    if (closeBtn) closeBtn.onclick = () => { this.hide(); };
  },
  hide() {
    this.modal.style.display = "none";
  }
};

// 設定管理オブジェクト
const OptionStorage = {
  keys: {
    cref: "opt-cref",
    scale: "opt-scale"
  },
  save() {
    localStorage.setItem(this.keys.cref, document.getElementById("opt-cref").checked);
    localStorage.setItem(this.keys.scale, document.getElementById("opt-scale").checked);
  },
  load() {
    const cref = localStorage.getItem(this.keys.cref) === "true";
    const scale = localStorage.getItem(this.keys.scale) === "true";
    const optCref = document.getElementById("opt-cref");
    const optScale = document.getElementById("opt-scale");
    if (optCref) optCref.checked = cref;
    if (optScale) optScale.checked = scale;
  },
  setFromModal() {
    document.getElementById("opt-cref").checked = document.getElementById("modal-opt-cref").checked;
    document.getElementById("opt-scale").checked = document.getElementById("modal-opt-scale").checked;
    this.save();
  },
  setModalFromOption() {
    document.getElementById("modal-opt-cref").checked = document.getElementById("opt-cref")?.checked ?? false;
    document.getElementById("modal-opt-scale").checked = document.getElementById("opt-scale")?.checked ?? false;
  }
};

const makeRecordTable = async () => {
  // return; // とりあえず無効化
  const ranking = await getRanking(10);
  ModalManager.init("ranking-modal");

  const getRankNo = (index) => {
    if (index == 0) return "🥇";
    if (index == 1) return "🥈";
    if (index == 2) return "🥉";
    return index + 1;
  }
  
  //<table class="tbl-rankinng" border="1" cellspacing="0" cellpadding="8">
  const makeHtml = () => {
    let elms = `
    <h1>🏆 Ranking 🏆</h1>
    <table class="tbl-rankinng" border="1" cellspacing="0" cellpadding="8">
    <tr>
    <th>Rank</th>
    <th>Name</th>
    <th>Time</th>
    <th>Accur</th>
    </tr>
    `;
    // console.log(ranking);
    ranking.forEach((data, index) => {
      elms += `
        <tr>
          <td class="rank">${getRankNo(index)}</td>
          <td>${data.name}</td>
          <td>${data.clear_time}</td>
          <td>${data.accuracy}</td>
        </tr>
      `;
    });

    elms += `
    </table>
    <br>
    <button class="modal-close">閉じる</button>
    `;
    return elms;
  }

  ModalManager.show(
    makeHtml(),
    () => {
      console.log("Ranking closed");
    }
  );

}





// -------------------
document.addEventListener('DOMContentLoaded', () => {

  const divTitle = document.querySelector("#title");
  const divMenu = document.querySelector("#main-menu");
  const divDrill = document.querySelector("#drill-area");

  const btnStart = document.querySelector("#btn-start");
  const btnGame = document.querySelector("#btn-game");
  const btnTop = document.getElementById("btn-top");
  const btnQues = document.getElementById("btn-question");
  const btnRecord = document.getElementById("btn-record");
  const btnSetting = document.getElementById("btn-setting");

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
  OptionStorage.load();
  ModalManager.init("setting-modal");
  
  saveAcc(navigator.userAgent, window.screen.height + 'x' + window.screen.width);

  // topに戻るボタン
  btnTop.addEventListener("click", () => {
    isGameRunning = false;
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

    const scaleComp = [
      {c: "ド", d: "レ", e: "ミ", f: "ファ", g: "ソ", a: "ラ", b: "シ"}
    ];

    const optScale = document.getElementById('opt-scale');
    if (optScale.checked) {
      const solf = scaleComp[0][correctDispValue.slice(-1)]; //イタリア式の値を取得
      correctDispValue = correctDispValue.replace(correctDispValue.slice(-1), solf);
    } else {
      correctDispValue = correctDispValue.toUpperCase();
    }

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
    initDrill();
    divMenu.style.display = "none";
    divDrill.style.display = "flex";
    btnQues.hidden = false;
    cntArea.hidden = true;
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
        // localStorageに保存
        OptionStorage.save(); 
        // 表示中の音符を更新
        score.drawNote(rndChoice(notes));
      }
      // 音階表示
      if (elm.id === "opt-scale") {
        if (isChecked) {
          piano.changeScale('ita');
        } else {
          piano.changeScale('eng');
        }
        // localStorageに保存
        OptionStorage.save(); 
      }
      // 苦手優先（将来用）
      if (elm.id === "wake-mode") {
          
      }
    });
  });


  
  // -------------------
  // Gameボタン：10問連続ゲーム
  btnGame.addEventListener("click", async () => {
    isGameRunning = true;
    divMenu.style.display = "none";
    divDrill.style.display = "flex";

    initDrill();

    const totalQuestions = 10;
    let correctCount = 0;
    const startTime = Date.now();

    // ここで「どれか鍵盤を押すまで待つ」
    btnQues.hidden = true;
    cntArea.hidden = false;
    cntArea.style.height = '20pt'
    cntArea.style.fontSize = '20pt'
    cntArea.style.color = "white";
    cntArea.innerText = "鍵盤を押すとスタートします...";
    await waitKeyPress();   // ← ここで最初のキー入力を待つ
    cntArea.innerText = "";

    for (let i = 0; i < totalQuestions; i++) {
      if (!isGameRunning) break; // TOPボタンで中断
      cntArea.style.color = "rgb(255, 255, 255)";
      cntArea.innerText = `${i+1}/${totalQuestions}`;
      await ask_question() && correctCount++;
      await sleep(600);
    }

    if (!isGameRunning) return; // 中断時は結果表示しない

    const endTime = Date.now();
    const clearTime = ((endTime - startTime)/1000).toFixed(1); // 秒
    const accuracy = Math.round((correctCount/totalQuestions)*100);
    const totalScore = accuracy / clearTime;

    cntArea.style.color = "rgb(252, 215, 10)";
    cntArea.innerText = `タイム: ${clearTime}　正解率: ${accuracy}%　総合得点: ${totalScore.toFixed(2)}`;


    if (accuracy > 0) {
      //名前入力
      let name = localStorage.getItem('playerName');
      name = prompt("クリアしました！ 名前を入力してください", name ?? '');
      if (name === null || name.trim() === "") {
        name = "わるめのねこ";
      }
      localStorage.setItem('playerName', name);
  
      const userId = getOrCreateUserId();
      const optScale = document.getElementById('opt-scale');
      const scale = optScale.checked ? 'ita' : 'eng';
  
      // スコア保存
      await saveScore(userId, name, scale, clearTime, accuracy, totalScore, totalQuestions);
    }


    // ランキング表示
    // await showRanking('ranking-area', 10);
  });







  //　Recordボタン
  btnRecord.addEventListener("click", async () => {
    makeRecordTable();
    return; // とりあえず無効化
    const ranking = await getRanking(10);
    ModalManager.init("ranking-modal");

    const getRankNo = (index) => {
      if (index == 0) return "🥇";
      if (index == 1) return "🥈";
      if (index == 2) return "🥉";
      return index + 1;
    }
    
    //<table class="tbl-rankinng" border="1" cellspacing="0" cellpadding="8">
    const makeHtml = () => {
      let elms = `
      <h1>🏆 Ranking 🏆</h1>
      <table class="tbl-rankinng" border="1" cellspacing="0" cellpadding="8">
      <tr>
      <th>Rank</th>
      <th>Name</th>
      <th>Time</th>
      <th>Accur</th>
      </tr>
      `;
      // console.log(ranking);
      ranking.forEach((data, index) => {
        elms += `
          <tr>
            <td>${getRankNo(index)}</td>
            <td>${data.name}</td>
            <td>${data.clear_time}</td>
            <td>${data.accuracy}</td>
          </tr>
        `;
      });

      elms += `
      </table>
      <br>
      <button class="modal-close">閉じる</button>
      `;
      return elms;
    }

    ModalManager.show(
      makeHtml(),
      () => {
        console.log("Ranking closed");
      }
    );

  });

  //　Settingボタン
  btnSetting.addEventListener("click", () => {
    return; // とりあえず無効化
    ModalManager.show(
      `<h2>設定</h2>
      <label><input type="checkbox" id="modal-opt-cref"> バス記号で出題</label>
      <label><input type="checkbox" id="modal-opt-scale"> 音階をイタリア式で表示</label>
      <button class="modal-save">保存</button>
      <button class="modal-cancel">キャンセル</button>`,
      () => {
        document.getElementById("opt-cref").checked = document.getElementById("modal-opt-cref").checked;
        document.getElementById("opt-scale").checked = document.getElementById("modal-opt-scale").checked;
        OptionStorage.save();
      }
    );
    OptionStorage.load();
  });


  // -------------------
  // ヘルパー関数
  function initDrill() {
    score.drawNote(false);
    const optScale = document.getElementById('opt-scale');
    const scale = optScale.checked ? 'ita' : 'eng';
    piano.changeScale(scale);
    cntArea.innerText = "";
    resArea.innerHTML = "";
  }

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

  // user-idをlocalStorageで管理する関数
  function getOrCreateUserId() {
    const key = 'user-id';
    let userId = localStorage.getItem(key);
    if (!userId) {
      userId = Math.random().toString(36).slice(-8);
      localStorage.setItem(key, userId);
    }
    return userId;
  }

});
