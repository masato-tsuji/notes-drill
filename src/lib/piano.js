'use strict'
// ピアノを描画し鍵盤のタッチを処理するスクリプト

const objPiano = ((targetDiv) => {
  console.log(targetDiv);
  const pianoElement = document.getElementById(targetDiv);

  function createPianoKeys() {
    const keysEng = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const keysGny = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'H'];
    const keysIta = ['ド', 'ド#', 'レ', 'レ#', 'ミ', 'ファ', 'ファ#', 'ソ', 'ソ#', 'ラ', 'ラ#', 'シ'];
    const keysVal = ['c', '#c', 'd', '#d', 'e', 'f', '#f', 'g', '#g', 'a', '#a', 'b']

    const dispKeys = keysEng;
    const keys = keysVal;

    // タッチデバイスかを返す
    const isTouchDevice = () => {
      return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }

    // 鍵盤作成
    keys.forEach((key, index) => {
        const isBlackKey = key.includes('#');
        const keyElement = document.createElement('div');

        if (isBlackKey) {
            keyElement.className = 'black-key';
            keyElement.style.left = `${index * 40 }px`; // 白鍵の上に黒鍵配置
        } else {
            keyElement.className = 'white-key';
        }
        
        // イベント登録
        if (isTouchDevice) {
          keyElement.addEventListener('touchstart', () => touchKey(key));
        } else {
          keyElement.addEventListener('mousedown', () => touchKey(key));
        }

        pianoElement.appendChild(keyElement);
        // pianoElement.appendChild(readElement);
    });

    // 白盤の上の文字を描画
    dispKeys.forEach((key, index) => {
      const isBlackKey = key.includes('#');
      const readElement = document.createElement('div');

      if (!isBlackKey) {
          readElement.className = 'read-key';
          readElement.innerText = key;
          readElement.style.left = `${index * 58 + 37}px`; // 白鍵の上に配置
      }

      pianoElement.appendChild(readElement);

    });

  }
  
  // function touchKey(note) {
  //   // console.log(`${note} の音が鳴りました`);
  //   // サウンドを鳴らすための処理をここに追加

  //   console.log(note);

  // }
  
  createPianoKeys();
  return {
    touchKey: (note) => console.log(note)
  }
  

});


