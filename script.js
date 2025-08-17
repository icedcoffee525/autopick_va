// 🎯 ロール定義
const roles = {
  デュエリスト: ["ジェット", "レイズ", "フェニックス", "ヨル", "レイナ", "ネオン", "アイソ"],
  イニシエーター: ["ソーヴァ", "スカイ", "KAY/O", "フェイド", "ゲッコー", "ブリーチ"],
  コントローラー: ["オーメン", "ブリムストーン", "ヴァイパー", "アストラ", "ハーバー"],
  センチネル: ["セージ", "キルジョイ", "サイファー", "チェンバー", "デッドロック"]
};

// 🎲 縛りプレイ定義（ここに内容を追加してください）
const constraints = {
  UR: ["移動時はジャンプ！常にジャンプ！"],
  SR: ["10秒に1回必ず発砲しないといけない",
      "1キル後、真下にスタンプ縛り",
        "フラグが1つ下の味方がショットガン縛り",
            "シェリフ縛り",
                "ワンショット・ワンキル！",
                  "倒されるたびに敵に暴言チャット"],
  R:  ["アーマーを一切買わない(アイソはシールド禁止）",
        "準備フェーズ中に残弾をワンマガジンに調整"],
  N:  ["ADSのみ",
       "オーディン縛り",
        "ショットガン縛り",
           "スナイパー専",
             "ハンドガン縛り",
              "ヘビーアーマー禁止",
               "マーシャルオンリー",
                "ライトアーマー縛り",
                 "ヴァンダル・ファントム禁止",
                  "全ラウンドスキルフルバイ",
                   "毎ラウンドショーティー買う",
                    "走り撃ち縛り"]
};



function getRandomFromArray(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function goToResultPage() {
  const roleMode = document.getElementById("roleMode").value;
  const constraintCount = parseInt(document.getElementById("constraintCount").value);

  const playerNames = [];
  const selectedRoles = [];

  for (let i = 0; i < 5; i++) {
    const name = document.getElementById(`player${i}`).value.trim();
    if (name !== "") {
      playerNames.push(name);
      if (roleMode === "custom") {
        const role = document.getElementById(`role${i}`)?.value || "デュエリスト";
        selectedRoles.push(role);
      } else {
        selectedRoles.push(null);
      }
    }
  }

  if (playerNames.length === 0) {
    alert("最低1人以上のプレイヤー名を入力してください！");
    return;
  }

  localStorage.setItem("playerNames", JSON.stringify(playerNames));
  localStorage.setItem("selectedRoles", JSON.stringify(selectedRoles));
  localStorage.setItem("roleMode", roleMode);
  localStorage.setItem("constraintCount", constraintCount);
  window.location.href = "result.html";
}



function reroll() {
  displayResults(); // 再描画
}

function goBack() {
  window.location.href = "index.html";
}

function displayResults() {
  const playerNames = JSON.parse(localStorage.getItem("playerNames"));
  const selectedRoles = JSON.parse(localStorage.getItem("selectedRoles"));
  const roleMode = localStorage.getItem("roleMode");
  const constraintCount = parseInt(localStorage.getItem("constraintCount"));
  const container = document.getElementById("resultContainer");
  container.innerHTML = "";

  const allAgents = Object.values(roles).flat();
  let availableAgents = [...allAgents]; // 被りを防ぐためコピー

  const allConstraints = [
    ...constraints.UR.map(c => ({ rarity: "UR", text: c })),
    ...constraints.SR.map(c => ({ rarity: "SR", text: c })),
    ...constraints.R.map(c => ({ rarity: "R", text: c })),
    ...constraints.N.map(c => ({ rarity: "N", text: c }))
  ];

  const selectedPlayers = [...playerNames];
  const constraintAssignments = [];

  // --- 縛りの割り当て ---
  for (let i = 0; i < constraintCount; i++) {
    if (selectedPlayers.length === 0) break;
    const player = getRandomFromArray(selectedPlayers);
    const selected = getRandomFromArray(allConstraints);
    constraintAssignments.push({ player, rarity: selected.rarity, text: selected.text });
    selectedPlayers.splice(selectedPlayers.indexOf(player), 1);
  }

  // --- エージェント割り当て ---
  let roleOrder = [];
  if (roleMode === "default") {
    // 各ロールから1人ずつ + ランダムで1人
    roleOrder = ["デュエリスト", "イニシエーター", "スモーク", "センチネル"];
    if (playerNames.length > 4) {
      roleOrder.push("random");
    }
  }

  playerNames.forEach((name, index) => {
    let agent;

    if (roleMode === "default") {
      const role = roleOrder[index] || "random";
      if (role === "random") {
        agent = getRandomFromArray(availableAgents);
      } else {
        agent = getRandomFromArray(roles[role]);
      }
    } else if (roleMode === "random") {
      agent = getRandomFromArray(availableAgents);
    } else if (roleMode === "custom") {
      let role = selectedRoles[index];
      if (!role || role === "") {
        // 未選択ならランダム
        role = getRandomFromArray(Object.keys(roles));
      }
      agent = getRandomFromArray(roles[role]);
    }

    // --- 被り防止 ---
    availableAgents.splice(availableAgents.indexOf(agent), 1);

    const constraint = constraintAssignments.find(c => c.player === name);

    const card = document.createElement("div");
    card.className = "player-card";

    const agentFileName = getSafeFileName(agent);

    card.innerHTML = `
      <img src="images/${agentFileName}.png" alt="${agent}の画像">
      <div><strong>${name}</strong></div>
      <div>${agent}</div>
      <hr>
      ${constraint ? `
        <div class="rarity ${constraint.rarity}">${constraint.rarity}</div>
        <div class="constraint-text ${constraint.rarity}">${constraint.text}</div>
      ` : `
        <div class="constraint-text NONE">縛りなし</div>
      `}
    `;

    container.appendChild(card);
  });
}



function generatePlayerInputs() {
  const count = parseInt(document.getElementById("playerCount").value);
  const roleMode = document.getElementById("roleMode").value;
  const container = document.getElementById("playerInputs");
  container.innerHTML = "";

  for (let i = 0; i < count; i++) {
    container.innerHTML += `
      <div class="player-config">
        <input type="text" placeholder="プレイヤー${i+1}" id="player${i}" class="player-name">
        ${roleMode === "custom" ? `
          <select id="role${i}" class="role-select">
            <option value="デュエリスト">デュエリスト</option>
            <option value="イニシエーター">イニシエーター</option>
            <option value="コントローラー">コントローラー</option>
            <option value="センチネル">センチネル</option>
          </select>
        ` : ""}
      </div>
    `;
  }
}
const roleModeElement = document.getElementById("roleMode");
if (roleModeElement) {
  roleModeElement.addEventListener("change", function () {
    const mode = this.value;
    const roleContainer = document.getElementById("role-selects");
    roleContainer.innerHTML = ""; // 一旦クリア

    if (mode === "custom") {
      for (let i = 0; i < 5; i++) {
        const name = document.getElementById(`player${i}`).value.trim();
        if (name !== "") {
          const wrapper = document.createElement("div");
          wrapper.className = "role-wrapper";

          const label = document.createElement("div");
          label.className = "role-label";
          label.textContent = `プレイヤー${i + 1}: ${name}`;

          const select = document.createElement("select");
          select.id = `role${i}`;
          select.innerHTML = `
            <option value="">ロールを選択</option>
            <option value="デュエリスト">デュエリスト</option>
            <option value="イニシエーター">イニシエーター</option>
            <option value="コントローラー">コントローラー</option>
            <option value="センチネル">センチネル</option>
          `;

          wrapper.appendChild(label);
          wrapper.appendChild(select);
          roleContainer.appendChild(wrapper);
        }
      }
    }
  });
}



// 結果ページでのみ実行
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("resultContainer")) {
    displayResults();
  }
});
