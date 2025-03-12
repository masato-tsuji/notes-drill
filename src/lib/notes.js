'use strict'
// 音符の情報をfirebaseから取得し出題するスクリプト


const objNotes = () => {

  const initialize = () => {

    /* 設定値取得 */
    const cnfDrillCount = 10;  // ドリルの出題数
    const cnfClef = 'G';      // 音部記号（ト音treble G 、へ音bass F）
    const cnfDispScale = true;  // 音階表示
    const cnfWakeMode = true;   // 苦手優先


    // オプションのイベント設定 firebaseへ保存
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
  const { Renderer, Stave, StaveNote, Accidental } = Vex.Flow;
  // 対象のdivを取得
  const divSvg = document.getElementById("note-area");

  let currentNoteIndex = 0;
  const notes = ["C4", "D4", "E4", "F#4", "G4"]; // 音階リスト

  function drawSvgNote() {
      // 既存のSVGをクリア
      divSvg.innerHTML = "";

      // SVG用のRendererを作成
      const rendererSvg = new Renderer(divSvg, Renderer.Backends.SVG);
      rendererSvg.resize(800, 320); // キャンバスサイズ
      const contextSvg = rendererSvg.getContext();

      contextSvg.scale(2.5, 2.5);   // 楽譜の大きさの倍率

      // 五線譜を描画
      // const staveSvg = new Stave(10, 40, 200);
      const staveSvg = new Stave(105, 8, 100); // キャンバスの中の位置(Left, top, long)
      // staveSvg.addClef("bass");
      staveSvg.addClef("treble");
      staveSvg.setContext(contextSvg).draw();

      // 新しい音符を作成
      // const noteSvg = new StaveNote({ keys: [notes[currentNoteIndex]], duration: "w" });
      const noteSvg = new StaveNote({ keys: ["g/4"], duration: "w" });

      // シャープ追加（必要なら）
      if (notes[currentNoteIndex].includes("#")) {
          noteSvg.addAccidental(0, new Accidental("#"));
      }

      // 音符を描画
      Vex.Flow.Formatter.FormatAndDraw(contextSvg, staveSvg, [noteSvg]);

      // 次の音階へ
      currentNoteIndex = (currentNoteIndex + 1) % notes.length;
  }
  // 初回描画
  drawSvgNote();


  // 回答チェック


  // 結果と正解表示

  // 結果をfirebaseに登録

  
  return initialize;
}



