'use strict'
// 音符の情報をfirebaseから取得


// const notes = objNotes();

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
}

// 配列の中からランダムに一つ要素を返す
const rndChoice = array => {
  return array[Math.floor(Math.random() * array.length)];
}



document.addEventListener('DOMContentLoaded', () => {

  const divTitle = document.querySelector("#title");  /* title */
  const divMenu = document.querySelector("#main-menu");  /* Startボタン */
  const devDrill = document.querySelector("#drill-area");  /* Startボタン */
  const btnStart = document.querySelector("#btn-start");  /* Startボタン */
  
  btnStart.addEventListener("click", (e) => {
    divMenu.style.display = "none";
    devDrill.style.display = "flex";
  });
  
  // タイトル表示
  setTimeout(() => {
    const t = typing(divTitle);
    t("Notes Drill for mina", 75);
  }, 3000);
  
  const piano = objPiano('piano');
  const notes = objNotes();
  
  // オプション変更
  
  
  
  // ピアノ打鍵イベント
  document.addEventListener('keyTouched', (event) => {
    console.log(`Key ${event.detail.key} touched`);
  });
  
  
  
  
});






// ページロード完了
window.onload = function() {

};



