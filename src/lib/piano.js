'use strict'
// ピアノを描画し鍵盤のタッチを処理するスクリプト

const objPiano = ((targetDiv) => {
  const pianoElement = document.getElementById(targetDiv);
  const keysEng = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const keysGny = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'H'];
  const keysIta = ['ド', 'ド#', 'レ', 'レ#', 'ミ', 'ファ', 'ファ#', 'ソ', 'ソ#', 'ラ', 'ラ#', 'シ'];
  const keysVal = ['c', '#c,_d', 'd', '#d,_e', 'e', 'f', '#f,_g', 'g', '#g,_a', 'a', '#a,_B', 'b']
  
  // 鍵盤に音階表示
  const witeScaleName = (dispKeys) => {
    const filteredKeys = dispKeys.filter(key => !key.includes('#'));
    document.querySelectorAll(".white-key").forEach((elm, index) => {
      elm.innerText = filteredKeys[index];
    });
  }

  // 鍵盤押下のイベント定義
  const touchKey = (key, disp) => {
    const event = new CustomEvent('keyTouched', { detail: { key, disp } });
    document.dispatchEvent(event);
  }

  function createPianoKeys() {
    const dispKeys = keysEng;
    const keys = keysVal;
    
    // タッチデバイスかを返す
    const isTouchDevice = () => {
      return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }

    const ua = navigator.userAgent;

    // 鍵盤作成
    keys.forEach((key, index) => {
      const isBlackKey = key.includes('#');
      const keyElement = document.createElement('div');
      const disp = dispKeys[index];

        if (isBlackKey) {
            keyElement.className = 'black-key';
            keyElement.style.left = `${index * 40 }px`; // 白鍵の上に黒鍵配置
        } else {
            keyElement.className = 'white-key';
        }

        // イベント登録
        // if (isTouchDevice()) {
        //   // タッチパネルのみに反応
        //   keyElement.addEventListener('touchstart', () => touchKey(key, disp));
        //   // keyElement.addEventListener('mousedown', () => touchKey(key));
        // } else {
        //   keyElement.addEventListener('mousedown', () => touchKey(key, disp));
        // }
        
        // デバイスによってイベント分ける
        if (/iPhone|iPad|iPod|Android/i.test(ua)) {
          keyElement.addEventListener('touchstart', () => touchKey(key, disp));
        } else {
          keyElement.addEventListener('mousedown', () => touchKey(key, disp));
        }
        
        pianoElement.appendChild(keyElement);
        // pianoElement.appendChild(readElement);
    });

    witeScaleName(dispKeys);

  }
  
  createPianoKeys();

  return {
    changeScale: (scoreType) => {
      if (scoreType == 'eng') witeScaleName(keysEng);
      if (scoreType == 'ita') witeScaleName(keysIta);
      console.log('changeScale');
    }
  }
  

  
});

export { objPiano };

