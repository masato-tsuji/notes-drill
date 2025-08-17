
import { playGame } from "./game.js";
import { saveScore, getRanking } from "./db.js";

let currentScore = 0;

document.getElementById("playBtn").addEventListener("click", () => {
  currentScore = playGame();
  document.getElementById("scoreArea").textContent = `スコア: ${currentScore}`;
});

document.getElementById("saveBtn").addEventListener("click", async () => {
  const name = document.getElementById("playerName").value || "名無し";
  await saveScore(name, currentScore);
  alert("スコア保存しました！");
  showRanking();
});

async function showRanking() {
  const ranking = await getRanking();
  const list = document.getElementById("ranking");
  list.innerHTML = "";
  ranking.forEach((r, i) => {
    const li = document.createElement("li");
    li.textContent = `${i + 1}位: ${r.player} - ${r.score}`;
    list.appendChild(li);
  });
}

// ページロード時にランキング表示
showRanking();
