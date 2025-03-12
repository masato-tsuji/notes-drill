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
  const notes = 
      ["C4", "D4", "E4", "F#4", "G4"]; // 音階リスト

  const notesBass = [
    'c/2', 'd/2', 'e/2', 'f/2', 'g/2', 'a/2', 'b/2', 'c/3', 'd/3', 'e/3', 'f/3', 'g/3', 'a/3', 'b/3',
    'c/4', 'd/4', 'e/4', '#c/2', '#d/2', '#f/2', '#g/2', '#a/2', '#c/3', '#d/3', '#f/3', '#g/3', '#a/3',
    '#c/4', '#d/4', 'bd/2', 'be/2', 'bg/2', 'ba/2', 'bb/2', 'bd/3', 'be/3', 'bg/3', 'ba/3', 'bb/3',
    'bd/4', 'be/4'
  ]

  function drawSvgNote() {
      // 既存のSVGをクリア
      divSvg.innerHTML = "";

      // SVG用のRendererを作成
      const rendererSvg = new Renderer(divSvg, Renderer.Backends.SVG);
      rendererSvg.resize(800, 400); // キャンバスサイズ
      const contextSvg = rendererSvg.getContext();

      contextSvg.scale(3.5, 3.5);   // 楽譜の大きさの倍率

      // 五線譜を描画
      // const staveSvg = new Stave(10, 40, 200);
      const staveSvg = new Stave(60, 5, 110); // キャンバスの中の位置(Left, top, long)
      const clef = "bass";
      staveSvg.addClef(clef);
      // staveSvg.addClef("treble");
      staveSvg.setContext(contextSvg).draw();

      // 新しい音符を作成
      const noteChoice = rndChoice(notesBass);
      const note = noteChoice.substr(-3);
      const noteSvg = new StaveNote({ clef: clef, keys: [note], duration: "w" });
      // const noteSvg = new StaveNote({ clef: "bass", keys: ["e/4"], duration: "w" });
      // noteSvg.addAccidental(0, new Accidental("#"));
      // noteSvg.addAccidental(0, new Accidental("b"));

      // シャープ追加（必要なら）
      if (note.includes("#")) {
          noteSvg.addAccidental(0, new Accidental("#"));
      }
      if (note.includes("b")) {
          noteSvg.addAccidental(0, new Accidental("b"));
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



