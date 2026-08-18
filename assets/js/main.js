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
  const frontImg = document.getElementById("slideshow-img");
  const backImg = document.getElementById("slideshow-img-back");

  if (!frontImg || !backImg) return;

  // portfolio-img/ に写真を追加したら、ここにファイル名を追記してください。
  const photos = [
    "portfolio-img/photo-1.jpeg",
    "portfolio-img/photo-2.jpeg",
    "portfolio-img/photo-3.jpeg",
    "portfolio-img/photo-4.jpeg"
  ];

  if (photos.length < 2) return;

  const intervalMs = 3000; // 3秒ごとに切り替え
  const fadeMs = 600;      // フェード時間

  // 現在表示している画像の番号
  let frontIndex = 0;
  let backIndex = 1;

  // ----------------------------------------------------------
  // 画像を読み込む
  // ----------------------------------------------------------
  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const image = new Image();

      image.onload = () => resolve(src);
      image.onerror = () => reject(src);

      image.src = src;
    });
  }

  // ----------------------------------------------------------
  // すべての画像を事前読み込み
  // ----------------------------------------------------------
  async function preloadImages() {
    try {
      await Promise.all(
        photos.map((src) => loadImage(src))
      );

      startSlideshow();

    } catch (error) {
      console.error("画像の読み込みに失敗しました:", error);
    }
  }

  // ----------------------------------------------------------
  // スライドショー開始
  // ----------------------------------------------------------
  function startSlideshow() {

    // 初期状態
    frontImg.src = photos[frontIndex];
    backImg.src = photos[backIndex];

    frontImg.style.opacity = "1";
    backImg.style.opacity = "1";

    frontImg.style.transition = `opacity ${fadeMs}ms ease`;
    backImg.style.transition = `opacity ${fadeMs}ms ease`;

    setInterval(() => {

      // 次に表示する画像
      const nextFrontIndex =
        (frontIndex + 1) % photos.length;

      const nextBackIndex =
        (backIndex + 1) % photos.length;

      // --------------------------------------------------------
      // 次の画像をあらかじめ読み込んでから切り替える
      // --------------------------------------------------------
      const nextFrontSrc = photos[nextFrontIndex];
      const nextBackSrc = photos[nextBackIndex];

      Promise.all([
        loadImage(nextFrontSrc),
        loadImage(nextBackSrc)
      ]).then(() => {

        // 一度透明にする
        frontImg.style.opacity = "0";
        backImg.style.opacity = "0";

        setTimeout(() => {

          // 画像を次の画像へ変更
          frontImg.src = nextFrontSrc;
          backImg.src = nextBackSrc;

          // 再び表示
          frontImg.style.opacity = "1";
          backImg.style.opacity = "1";

        }, fadeMs);

        // 現在位置を更新
        frontIndex = nextFrontIndex;
        backIndex = nextBackIndex;

      });

    }, intervalMs);
  }

  // 最初の画像を確実に読み込んでから開始
  preloadImages();

})();
