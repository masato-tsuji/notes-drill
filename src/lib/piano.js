'use strict'
// ピアノを描画し鍵盤のタッチを処理するスクリプト

const objPiano = () => {
  const pianoElement = document.getElementById('piano');
  
  function createPianoKeys() {
      const keys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
      keys.forEach((key, index) => {
          const isBlackKey = key.includes('#');
          const keyElement = document.createElement('div');
  
          if (isBlackKey) {
              keyElement.className = 'black-key';
              keyElement.style.left = `${index * 40 }px`; // 白鍵の上に配置
          } else {
              keyElement.className = 'white-key';
          }
  
          keyElement.addEventListener('mousedown', () => playSound(key));
          keyElement.addEventListener('touchstart', () => playSound(key));
  
          pianoElement.appendChild(keyElement);
      });
  }
  
  function playSound(note) {
      console.log(`${note} の音が鳴りました`);
      // サウンドを鳴らすための処理をここに追加
  }
  
  return createPianoKeys();

}


