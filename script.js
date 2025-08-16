// 🎯 ロール定義
const roles = {
  デュエリスト: ["ジェット", "レイズ", "フェニックス", "ヨル", "レイナ", "ネオン", "アイソ"],
  イニシエーター: ["ソーヴァ", "スカイ", "KAY/O", "フェイド", "ゲッコー", "ブリーチ"],
  コントローラー: ["オーメン", "ブリムストーン", "ヴァイパー", "アストラ", "ハーバー"],
  センチネル: ["セージ", "キルジョイ", "サイファー", "チェンバー", "デッドロック"]
};

// 🎲 縛りプレイ定義（ここに内容を追加してください）
const constraints = {
  UR: ["たまに嘘言う",
     "スキルのキーをU,I,O,Pにする",
      "奇数ラウンド応援のみ",
       "偶数ラウンド応援のみ",
        "マウスの右クリ左クリ逆にする",
         "マウスを左手で、キーボードを右手で操作",
          "マウス感度最低値",
           "敵スポーンにたどり着いてから真面目にする",
            "移動時はジャンプ！常にジャンプ！",
             "設定から前進キーを外す",
              "音禁止（ゲーム音＋VCが0）",
              "自分の声は味方に聞こえるように！"],
  SR: ["10秒に1回必ず発砲しないといけない",
     "1キル後、武器をみるボタンで最後まで見る",
      "1キル後、真下にスタンプ縛り",
       "IGLを全チャ（テキスト）でする",
        "フラグが1つ下の味方がショットガン縛り",
         "お金がある限り武器を配り余った金で自分の武器を買う",
          "キーボードを上下逆にする（スペースが上になるよ）",
           "クロスヘア非表示",
            "シェリフ縛り＋撃つ前に必ず武器を見る(Yボタン)",
             "フレームレート上限を30に",
              "マウス感度3.55",
               "ラウンド開始後10秒不動",
                "ワンショット・ワンキル！(シェリフ、5発のみ。)",
                 "ワンタップしか狙ってはいけない",
                  "倒されるたびに敵に賞賛チャット",
                   "全力でトロールする。トロールの限りを尽くせ。",
                    "報告やコールで嘘つく",
                     "射撃キーをスペースキーのみに設定",
                      "感度をいつもの3倍にする",
                       "攻守で1回ずつ味方の配置を全チャで教える",
                        "止まるな！動け！試合中止まるの禁止",
                         "武器禁止スキルオンリー",
                          "毎ラウンド全力で買う。 優先度は 武器→シールド→アビリティ",
                           "準備フェーズ中に残弾をワンマガジンに調整",
                            "移動時は後ろ向きで進む",
                             "解像度1024×576のフルスクリーンモード"],
  R:  ["1キル後、空に1発撃つ",
     "1デスするたびに全体チャットで一言申す",
      "FPS上限を60に設定",
       "Wキーから手を放さない",
        "アーマーを一切買わない(アイソはシールド禁止）",
             "キルするたびにサブ武器メイン武器持ち替え",
              "クラシック以外のハンドガン禁止",
               "クラッシック右クリ縛り",
                "シェリフorガーディアン縛り",
                 "ジャンプするたびに1回転",
                  "ジャンプキー外す",
                   "スニークキー外す",
                    "マウス感度50%増",
                     "マウス感度50%減",
                      "マーシャルオンリー",
                       "ミニマップ極大",
                        "ミニマップ極小",
                         "リロードボタン使用禁止",
                          "一発撃つごとにリロードをする。",
                           "全てのラウンドで買えるだけ買う",
                            "味方1人がデスするまで発砲禁止",
                             "味方から常に離れて行動する",
                              "壁抜きでのみダメージを与えられる",
                               "射撃右クリ縛り（バッキーorクラッシックのみ使用）",
                                "常にしゃがみ",
                                 "常にカニ歩き（設定から前進と後退のキーを消す）",
                                  "攻守ファーストラウンドナイフのみ",
                                   "攻撃ラークオンリー",
                                    "毎ラウンド1回スキルで利敵",
                                     "溜まった瞬間ウルト即使用縛り",
                                      "無料アビリティのみ",
                                       "自分だけecoとbuy逆転",
                                        "設定から「試合中のUIを非表示にする」をオンに",
                                         "設定からマウス反転",
                                          "走り撃ちonly",
                                           "防衛プッシュオンリー"],
  N:  ["1キル後、ナイフを1度振る",
     "ADS禁止",
      "しゃがみキー外す",
       "オーディン縛り",
        "ショットガン縛り",
         "スキル使用禁止",
          "スキル禁止",
           "スナイパー専",
            "ナイフ縛り",
             "ハンドガン縛り",
              "ヘビーアーマー禁止",
               "マーシャルオンリー",
                "ライトアーマー縛り",
                 "ヴァンダル・ファントム禁止",
                  "全ラウンドスキルフルバイ",
                   "毎ラウンドショーティー買う",
                    "走り撃ち縛り",]
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

  playerNames.forEach((name, index) => {
    let agent;
    if (roleMode === "default") {
      const roleKeys = Object.keys(roles);
      const role = roleKeys[index % roleKeys.length];
      agent = getRandomFromArray(roles[role]);
    } else if (roleMode === "random") {
      agent = getRandomFromArray(allAgents);
    } else if (roleMode === "custom") {
      const role = selectedRoles[index];
      agent = getRandomFromArray(roles[role] || roles["デュエリスト"]); // 安全対策
    }

    const constraint = constraintAssignments.find(c => c.player === name);

    const card = document.createElement("div");
    card.className = "player-card";

    // ★表示順序変更：画像→名前→キャラ→区切り線→縛り
    const agentFileName = agent.replace("/", ""); // KAY/O → KAYO
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
