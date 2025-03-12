'use strict'
// 音符の情報をfirebaseから取得し出題するスクリプト


const objPiano = () => {

  const initialize = () => {
    //オプションエリア描画
    function createCheckbox(id, label) {
      return `
          <div class="cnf_tgl">
              <input type="checkbox" id="${id}">
              <label for="${id}"></label>
              <span class="class_name">${label}</span>
          </div>
      `;
    }
    const keyElement = document.createElement('div');

  }

  //オプション状態取得


  //firebaseから誤答履歴取得


  //firebaseから問題オブジェクト生成


  //出題


  //回答チェック


  //結果と正解表示

  //結果をfirebaseに登録


  return initialize;
}



