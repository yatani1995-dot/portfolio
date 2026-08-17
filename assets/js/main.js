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
// 2. トップページの写真スライドショー（front / back 連動）
// ------------------------------------------------------------
(function photoSlideshow() {
  const frontImg = document.getElementById("slideshow-img");
  const backImg = document.getElementById("slideshow-img-back");
  if (!frontImg) return; // index.html以外では何もしない

  // portfolio-img/ に写真を追加したら、ここにファイル名を追記してください。
  // frontはphotos[0]、backはphotos[1]からスタートし、以降は同じ間隔でずれて巡回します。
  const photos = [
    "portfolio-img/photo-1.jpeg",
    "portfolio-img/photo-2.jpeg",
    "portfolio-img/photo-3.jpeg",
    "portfolio-img/photo-4.jpeg",
  ];

  if (photos.length === 0) return;

  // 切り替え時にちらつかないよう、先にすべての画像を読み込んでおく
  photos.forEach((src) => {
    const preload = new Image();
    preload.src = src;
  });

  if (photos.length <= 1) return; // 写真が1枚以下なら切り替え不要

  const intervalMs = 3000;   // 何ミリ秒ごとに切り替えるか
  const fadeMs = 200;        // フェードにかける時間（CSS側のtransitionと合わせる）

  let frontIndex = 0;                    // front は photo-1 からスタート
  let backIndex = 1 % photos.length;     // back  は photo-2 からスタート

  function swap(imgEl, src) {
    if (!imgEl) return;
    imgEl.style.opacity = "0";
    setTimeout(() => {
      imgEl.src = src;
      imgEl.style.opacity = "1";
    }, fadeMs);
  }

  setInterval(() => {
    frontIndex = (frontIndex + 1) % photos.length;
    backIndex = (backIndex + 1) % photos.length;
    swap(frontImg, photos[frontIndex]);
    swap(backImg, photos[backIndex]);
  }, intervalMs);
})();
