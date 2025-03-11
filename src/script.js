'use strict'
// 音符の情報をfirebaseから取得


document.addEventListener('DOMContentLoaded', () => {

  const divMenu = document.querySelector("#main-menu");  /* Startボタン */
  const divPiano = document.querySelector("#piano-keys");  /* Startボタン */
  const devDrill = document.querySelector("#drill-area");  /* Startボタン */
  const btnStart = document.querySelector("#btn-start");  /* Startボタン */

  btnStart.addEventListener("click", (e) => {
    divMenu.style.display = "none";
    devDrill.style.display = "flex";
  });


});


// ページロード完了
window.onload = function() {
  objPiano();
};



