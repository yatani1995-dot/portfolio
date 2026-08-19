// ============================================================
// main.js
// このファイルは2つの機能を持っています。
//   1. works.html の「使用技術で絞り込み」ボタン
//   2. index.html の写真スライドショー（portfolio-img/ 内の画像を巡回表示）
// ============================================================

// ------------------------------------------------------------
// 1. works.html の絞り込みボタン
// ------------------------------------------------------------
(function worksFilter() {
  const buttons = document.querySelectorAll(".filter__btn");
  const cards = document.querySelectorAll(".card");
  if (buttons.length === 0 || cards.length === 0) return; // works.html以外では何もしない

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.dataset.filter; // "all" | "html" | "java"

      // ボタンの見た目（選択状態）を切り替える
      buttons.forEach((b) => b.classList.remove("is-active"));
      button.classList.add("is-active");

      // カードの表示・非表示を切り替える
      cards.forEach((card) => {
        const matches = target === "all" || card.dataset.lang === target;
        card.classList.toggle("is-hidden", !matches);
      });
    });
  });
})();

// ------------------------------------------------------------
// 2. トップページの写真スライドショー
//    front / back がそれぞれ1枚ずつ先へ進む
//
//    初期:
//      front → photo-1
//      back  → photo-2
//
//    1回目:
//      front → photo-2
//      back  → photo-3
//
//    2回目:
//      front → photo-3
//      back  → photo-4
// ------------------------------------------------------------
(function photoSlideshow() {
  const frames = document.querySelectorAll(".photo-frame");
  if (frames.length < 2) return;

  const frameA = frames[0];
  const frameB = frames[1];
  const imgA = frameA.querySelector("img");
  const imgB = frameB.querySelector("img");

  const photos = [
    "portfolio-img/photo-1.jpeg",
    "portfolio-img/photo-2.jpeg",
    "portfolio-img/photo-3.jpeg",
    "portfolio-img/photo-4.jpeg"
  ];

  if (photos.length < 2) return;

  const intervalMs = 4000;
  let nextPhotoIndex = 2;

  frameA.classList.add("is-front");
  frameB.classList.add("is-back");
  imgA.src = photos[0];
  imgB.src = photos[1];

  Object.assign(frameA, { isFront: true, imgElement: imgA });
  Object.assign(frameB, { isFront: false, imgElement: imgB });

  setInterval(() => {
    const currentFront = frameA.isFront ? frameA : frameB;
    const currentBack = frameA.isFront ? frameB : frameA;

    // 1. 左へ飛ばすアニメーションを開始
    currentFront.classList.add("is-switching");

    currentBack.classList.remove("is-back");
    currentBack.classList.add("is-front");

    // 【変更点】アニメーションの中間（左に最も離れた300ms時点）で画像を切り替える
    setTimeout(() => {
      currentFront.imgElement.src = photos[nextPhotoIndex];
      nextPhotoIndex = (nextPhotoIndex + 1) % photos.length;
    }, 300); // 0.3秒後に画像を変更

    // 2. アニメーション全体（0.6秒）が終わったらクラスと状態の整理だけを行う
    setTimeout(() => {
      currentFront.classList.remove("is-switching");
      currentFront.classList.remove("is-front");
      currentFront.classList.add("is-back");

      currentFront.isFront = false;
      currentBack.isFront = true;

    }, 600); // 0.6秒後に位置をリセット

  }, intervalMs);
})();
