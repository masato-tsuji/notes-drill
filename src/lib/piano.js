'use strict'
// ピアノを描画し鍵盤のタッチを処理するスクリプト

const objPiano = () => {
  const pianoElement = document.getElementById('piano');
  
  function createPianoKeys() {
    const keysEng = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const keysGny = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'H'];
    const keysIta = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'H'];

    const keys = keysEng;

    keys.forEach((key, index) => {
        const isBlackKey = key.includes('#');
        const keyElement = document.createElement('div');

        if (isBlackKey) {
            keyElement.className = 'black-key';
            keyElement.style.left = `${index * 40 }px`; // 白鍵の上に配置
        } else {
            keyElement.className = 'white-key';
            // readElement.className = 'read-key';
            // readElement.innerText = key;
            // readElement.style.left = `${index * 60 + 37}px`; // 白鍵の上に配置
        }

        // keyElement.addEventListener('mousedown', () => touchKey(key));
        keyElement.addEventListener('touchstart', () => touchKey(key));

        pianoElement.appendChild(keyElement);
        // pianoElement.appendChild(readElement);
    });

    // 白盤の上の文字
    keys.forEach((key, index) => {
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
  
  function touchKey(note) {
    // console.log(`${note} の音が鳴りました`);
    // サウンドを鳴らすための処理をここに追加

    console.log(note);

  }
  
  createPianoKeys();
  return objPiano;

}


