// script.js
const pianoElement = document.getElementById('piano');

function createPianoKeys() {
    const keys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    
    keys.forEach((key) => {
        const keyElement = document.createElement('div');

        if (key.includes('#')) {
            keyElement.className = 'black-key';
        } else {
            keyElement.className = 'white-key';
        }

        pianoElement.appendChild(keyElement); // 鍵盤を追加
    });
}

function playSound(note) {
    console.log(`${note} の音が鳴りました`);
    // サウンドを鳴らすための処理をここに追加
}

createPianoKeys();