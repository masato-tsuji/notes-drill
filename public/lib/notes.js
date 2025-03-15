'use strict'
// 音符の情報をfirebaseから取得し出題するスクリプト

const objScore = ((targetDiv) => {
  let currentNote = "";
  let currentDisp = "";

  const objInitialize = () => {

    /* 設定値取得 */
    const cnfDrillCount = 10;   // ドリルの出題数
    const cnfClef = 'treble';   // 音部記号（ト音treble G 、へ音bass F）
    const cnfDispScale = true;  // 音階表示
    const cnfWakeMode = true;   // 苦手優先

    // オプションエリア描画
    function createTgl(id, labelL, labelR) {
      const elm =  document.createElement('div');
      elm.className = 'cnf-tgl';
      elm.innerHTML =  `
          <span class="cnf_label">${labelL}</span>
          <input type="checkbox" id="${id}">
          <label for="${id}"></label>
          <span class="cnf_label">${labelR}</span>
      `;
      // elm.innerHTML =  `
      //     <input type="checkbox" id="${id}">
      //     <label for="${id}"></label>
      //     <span class="cnf_label">${label}</span>
      // `;
      return elm;
    }
    const elmOptArea = document.getElementById('opt-area');
    elmOptArea.appendChild(createTgl('opt-cref', 'ト音記号', 'ヘ音記号'));
    elmOptArea.appendChild(createTgl('opt-scale', '英語', 'ドレミ'));

  }
  // firebaseから誤答履歴取得


  // firebaseから問題オブジェクト生成


  // 出題
  const { Renderer, Stave, StaveNote, Accidental } = Vex.Flow;
  // 対象のdivを取得
  const divSvg = document.getElementById(targetDiv);
  let clefMode = "treble";  // bass/treble

  function drawSvgNote(argNote) {

    const optCref = document.getElementById('opt-cref');
    if (optCref.checked) {
      clefMode = "bass";
    } else {
      clefMode = "treble";
    }
    // 既存のSVGをクリア
    divSvg.innerHTML = "";

    // SVG用のRendererを作成
    const rendererSvg = new Renderer(divSvg, Renderer.Backends.SVG);
    rendererSvg.resize(800, 400); // キャンバスサイズ
    const contextSvg = rendererSvg.getContext();

    contextSvg.scale(3.5, 3.5);   // 楽譜の大きさの倍率

    // 五線譜を描画
    // const staveSvg = new Stave(10, 40, 200);
    const staveSvg = new Stave(50, 5, 130); // キャンバスの中の位置(Left, top, long)

    staveSvg.addClef(clefMode);
    // staveSvg.addClef("treble");
    staveSvg.setContext(contextSvg).draw();

    // 新しい音符を作成
    // const noteChoice = rndChoice(notesBass);
    const note = argNote.substr(-3);
    const noteSvg =  new StaveNote({ clef: clefMode, keys: [note], duration: "w" });

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
  }




});



