'use strict'
// 音符の情報をfirebaseから取得し出題するスクリプト


const objNotes = () => {

  const initialize = () => {

    /* 設定値取得 */
    const cnfDrillCount = 10;  // ドリルの出題数
    const cnfClef = 'G';      // 音部記号（ト音treble G 、へ音bass F）
    const cnfDispScale = true;  // 音階表示
    const cnfWakeMode = true;   // 苦手優先


    // オプションのイベント設定
    document.querySelectorAll(".cnf-tgl > input").forEach( elm => {
      elm.addEventListener("change", (e) => {
          
          // 出題数
          if (elm.id === "drill-count") {
              
          }
      
          // 音部記号
          if (elm.id === "clef-mode") {
              
          }
          
          // 音階表示
          if (elm.id === "disp-scale") {
              
          }

          // 苦手優先
          if (elm.id === "wake-mode") {
              
          }
          
      });
    });

    // オプションエリア描画
    function createTgl(id, label) {
      const elm =  document.createElement('div');
      elm.className = 'cnf-tgl';
      elm.innerHTML =  `
          <input type="checkbox" id="${id}">
          <label for="${id}"></label>
          <span class="cnf_label">${label}</span>
      `;
      return elm;
    }
    const elmOptArea = document.getElementById('opt-area');
    elmOptArea.appendChild(createTgl('id1', 'test1'));
    elmOptArea.appendChild(createTgl('id2', 'test2'));

    // ステータス表示エリア描画


  }

  // オプション状態取得


  // firebaseから誤答履歴取得


  // firebaseから問題オブジェクト生成


  // 出題


  // 回答チェック


  // 結果と正解表示

  // 結果をfirebaseに登録

  
  return initialize;
}



