'use strict'
// ピアノを描画し鍵盤のタッチを処理するスクリプト

const objPiano = ((targetDiv) => {
  const pianoElement = document.getElementById(targetDiv);
  

  // 白盤の上の文字を描画
  const witeScaleName = (dispKeys) => {
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


  function createPianoKeys() {
    const keysEng = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const keysGny = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'H'];
    const keysIta = ['ド', 'ド#', 'レ', 'レ#', 'ミ', 'ファ', 'ファ#', 'ソ', 'ソ#', 'ラ', 'ラ#', 'シ'];
    const keysVal = ['c', '#c,_d', 'd', '#d,_e', 'e', 'f', '#f,_g', 'g', '#g,_a', 'a', '#a,_B', 'b']
    
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
          keyElement.addEventListener('mousedown', () => touchKey(key));
        } else {
          keyElement.addEventListener('mousedown', () => touchKey(key));
        }

        pianoElement.appendChild(keyElement);
        // pianoElement.appendChild(readElement);
    });

    witeScaleName(dispKeys);

  }
  
  // function touchKey(note) {
  //   // console.log(`${note} の音が鳴りました`);
  //   // サウンドを鳴らすための処理をここに追加

  //   console.log(note);

  // }
  
  createPianoKeys();

  // 鍵盤押下のイベント定義
  const touchKey = (key) => {
    const event = new CustomEvent('keyTouched', { detail: { key } });
    document.dispatchEvent(event);
  }

  return {
    changeScale: (note) => {
      console.log(note);
    }
  }
  

});


