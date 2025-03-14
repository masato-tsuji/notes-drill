'use strict'
// 音符の情報をfirebaseから取得し出題するスクリプト


const objScore = ((targetDiv) => {
  let currentNote = "";
  const objInitialize = () => {

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
  const divSvg = document.getElementById(targetDiv);

 
  function drawSvgNote(argNote) {
    
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
    // const noteChoice = rndChoice(notesBass);
    const note = argNote.substr(-3);
    const noteSvg = new StaveNote({ clef: clef, keys: [note], duration: "w" });
    // const noteSvg = new StaveNote({ clef: "bass", keys: ["e/4"], duration: "w" });

    // シャープ追加（必要なら）
    if (argNote.includes("#")) {
      noteSvg.addAccidental(0, new Accidental("#"));
    }
    if (argNote.includes("_")) {
      noteSvg.addAccidental(0, new Accidental("b"));
    }

    // 音符を描画
    Vex.Flow.Formatter.FormatAndDraw(contextSvg, staveSvg, [noteSvg]);
    
  }

  objInitialize();

  return {
    initialize: () => objInitialize(),
    drawNote: (note) => {
      drawSvgNote(note);
      currentNote = note;
    },
    getValue: () => currentNote
  };




});



