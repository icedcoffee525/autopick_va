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
        let role = document.getElementById(`role${i}`)?.value;
        if (!role) {
          // ロール未選択の場合はランダムで割り当て
          const roleKeys = Object.keys(roles);
          role = getRandomFromArray(roleKeys);
        }
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
  let selectedRoles = JSON.parse(localStorage.getItem("selectedRoles"));
  const roleMode = localStorage.getItem("roleMode");
  const constraintCount = parseInt(localStorage.getItem("constraintCount"));
  const container = document.getElementById("resultContainer");
  container.innerHTML = "";

  const allAgents = Object.values(roles).flat();
  const allConstraints = [
    ...constraints.UR.map(c => ({ rarity: "UR", text: c })),
    ...constraints.SR.map(c => ({ rarity: "SR", text: c })),
    ...constraints.R.map(c => ({ rarity: "R", text: c })),
    ...constraints.N.map(c => ({ rarity: "N", text: c }))
  ];

  const selectedPlayers = [...playerNames];
  const constraintAssignments = [];

  for (let i = 0; i < constraintCount; i++) {
    if (selectedPlayers.length === 0) break;
    const player = getRandomFromArray(selectedPlayers);
    const selected = getRandomFromArray(allConstraints);
    constraintAssignments.push({ player, rarity: selected.rarity, text: selected.text });
    selectedPlayers.splice(selectedPlayers.indexOf(player), 1);
  }

  // --- ここからキャラ重複防止 ---
  let availableAgents = [...allAgents];
  let availableRolesAgents = {};
  for (const role in roles) {
    availableRolesAgents[role] = [...roles[role]];
  }
  // --- ここまで ---

  // --- 基本構成のロール割り当てをランダム化 ---
  let shuffledRoles = [];
  if (roleMode === "default") {
    const roleKeys = Object.keys(roles);
    shuffledRoles = shuffleArray(roleKeys).slice(0, playerNames.length);
    // 5人未満なら余ったロールをランダムで追加
    while (shuffledRoles.length < playerNames.length) {
      shuffledRoles.push(getRandomFromArray(roleKeys));
    }
  }
  // --- ここまで ---

  // --- カスタム時、未選択ロールは毎回ランダムにする ---
  if (roleMode === "custom") {
    const roleKeys = Object.keys(roles);
    selectedRoles = selectedRoles.map(role => {
      // 空欄、null、"ロールを選択" の場合はランダム
      if (!role || role === "" || role === "ロールを選択") {
        return getRandomFromArray(roleKeys);
      }
      return role;
    });
  }
  // --- ここまで ---

  playerNames.forEach((name, index) => {
    let agent;
    if (roleMode === "default") {
      const role = shuffledRoles[index];
      if (availableRolesAgents[role].length === 0) {
        agent = getRandomFromArray(availableAgents);
      } else {
        agent = getRandomFromArray(availableRolesAgents[role]);
        availableRolesAgents[role] = availableRolesAgents[role].filter(a => a !== agent);
        availableAgents = availableAgents.filter(a => a !== agent);
      }
    } else if (roleMode === "random") {
      agent = getRandomFromArray(availableAgents);
      availableAgents = availableAgents.filter(a => a !== agent);
    } else if (roleMode === "custom") {
      const role = selectedRoles[index];
      if (!role) {
        agent = null;
      } else if (availableRolesAgents[role] && availableRolesAgents[role].length > 0) {
        agent = getRandomFromArray(availableRolesAgents[role]);
        availableRolesAgents[role] = availableRolesAgents[role].filter(a => a !== agent);
        availableAgents = availableAgents.filter(a => a !== agent);
      } else {
        agent = null;
      }
    }

    const constraint = constraintAssignments.find(c => c.player === name);

    const card = document.createElement("div");
    card.className = "player-card";

    const agentFileName = agent ? agent.replace("/", "") : "noagent";
    card.innerHTML = `
        <img src="images/${agentFileName}.png" alt="${agent ? agent : "未割り当て"}の画像">
        <div><strong>${name}</strong></div>
        <div>${agent ? agent : "未割り当て"}</div>
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

// 配列シャッフル関数
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
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
