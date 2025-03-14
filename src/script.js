'use strict'


// 設定定義


const notesBass = [
  'c/2', 'd/2', 'e/2', 'f/2', 'g/2', 'a/2', 'b/2', 'c/3', 'd/3', 'e/3', 'f/3', 'g/3', 'a/3', 'b/3',
  'c/4', 'd/4', 'e/4', '#c/2', '#d/2', '#f/2', '#g/2', '#a/2', '#c/3', '#d/3', '#f/3', '#g/3', '#a/3',
  '#c/4', '#d/4', '_d/2', '_e/2', '_g/2', '_a/2', '_b/2', '_d/3', '_e/3', '_g/3', '_a/3', '_b/3',
  '_d/4', '_e/4'
]



// 音符の情報をfirebaseから取得




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
  const divMenu = document.querySelector("#main-menu");  /*  */
  const devDrill = document.querySelector("#drill-area");  /*  */
  const btnStart = document.querySelector("#btn-start");  /*  */
  const resArea = document.getElementById("res-area");
  const btnQuestion = document.getElementById("btn-question");
  
  btnStart.addEventListener("click", (e) => {
    divMenu.style.display = "none";
    devDrill.style.display = "flex";
  });
  
  // タイトル表示
  setTimeout(() => {
    const t = typing(divTitle);
    t("Notes Drill for mina", 75);
  }, 3000);
  


  const piano = objPiano("piano");
  const score = objScore("score-area");
  
  
  // 記録表示
  
  // オプション変更
  const notes = notesBass;
  
  
  // 出題関数
  const questionNote = (notes) => rndChoice(notes);
  



  // スタートボタンで初期化と出題
  score.drawNote(questionNote(notes));

  // 仮出題ボタン
  btnQuestion.addEventListener("click", (e) => {
    const choiceNote = questionNote(notes);
    score.drawNote(choiceNote);
    resArea.innerHTML = "";
  });
  
  // ピアノ打鍵イベント
  document.addEventListener('keyTouched', (event) => {
    // console.log(`Key ${event.detail.key} touched`);

    const correctValue = score.getValue().split('/')[0];


    // 判定 押した黒鍵のコードは#とbの２つをcsvで受け取る
    const keys = event.detail.key.split(',');
    let flgCorrect = false;
    keys.forEach( key => {
      if (correctValue.includes(key)) {
        flgCorrect = true;
      }
    });

    // 結果をfirebaseに登録

    // 表示 成否と正解答
    // resArea.innerHTML = `${score.getValue()} : ${event.detail.key}`;
    if (flgCorrect) {
      resArea.innerHTML = `正解🙆‍♂️ ${correctValue}`;
      
    } else {
      resArea.innerHTML = `惜しい😝 ${correctValue}`;

    }

    // 継続判定

    // 出題
    // score.drawNote(questionNote(notes));


  });
  
  
  
  
});






// ページロード完了
window.onload = function() {

};



