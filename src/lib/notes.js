'use strict'
// 音符の情報をfirebaseから取得し出題するスクリプト

const objScore = ((targetDiv) => {
  let currentNote = "";
  let currentDisp = "";

  const objInitialize = () => {
    /* 設定値取得 */
    const cnfDrillCount = 3;   // ドリルの出題数
    const cnfClef = 'treble';   // 音部記号
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
      return elm;
    }
    const elmOptArea = document.getElementById('opt-area');
    elmOptArea.appendChild(createTgl('opt-cref', 'ト音記号', 'ヘ音記号'));
    elmOptArea.appendChild(createTgl('opt-scale', '英語', 'ドレミ'));
  }

  // VexFlow描画
  const { Renderer, Stave, StaveNote, Accidental } = Vex.Flow;
  const divSvg = document.getElementById(targetDiv);
  let clefMode = "treble";  // bass/treble

  function drawSvgNote(argNote) {
    const optCref = document.getElementById('opt-cref');
    clefMode = optCref.checked ? "bass" : "treble";

    divSvg.innerHTML = "";
    const rendererSvg = new Renderer(divSvg, Renderer.Backends.SVG);
    rendererSvg.resize(800, 400);
    const contextSvg = rendererSvg.getContext();
    contextSvg.scale(3.5, 3.5);

    const staveSvg = new Stave(50, 5, 130);
    staveSvg.addClef(clefMode);
    staveSvg.setContext(contextSvg).draw();

    const note = argNote.substr(-3);
    const noteSvg = new StaveNote({ clef: clefMode, keys: [note], duration: "w" });

    if (argNote.includes("#")) {
      noteSvg.addAccidental(0, new Accidental("#"));
    }
    if (argNote.includes("_")) {
      noteSvg.addAccidental(0, new Accidental("b"));
    }

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

export { objScore };
