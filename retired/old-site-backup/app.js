/* AVRG — hybrid catalog SPA (home -> collection -> lightbox) */
(function () {
  "use strict";

  const app = document.getElementById("app");

  /* ---------- helpers ---------- */
  function h(html) {
    const t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, m =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[m]));
  }
  function redditUrl(handle) {
    const n = String(handle || "").replace(/^\/?u\//i, "").replace(/^@/, "").trim();
    return n ? "https://www.reddit.com/user/" + encodeURIComponent(n) : "#";
  }
  const handle = (typeof CONTACT === "object" && CONTACT && CONTACT.reddit) || "u/avrg";
  function dmLine() {
    return 'DM <a href="' + redditUrl(handle) + '" target="_blank" rel="noopener">' +
      esc(handle) + "</a> on Reddit";
  }
  function colById(id) { return COLLECTIONS.find(c => c.id === id) || null; }

  /* ---------- routing ---------- */
  function route() {
    const id = (location.hash || "").replace(/^#/, "");
    const col = colById(id);
    window.scrollTo(0, 0);
    if (col) renderCollection(col);
    else renderHome();
  }
  window.addEventListener("hashchange", route);

  /* ---------- home ---------- */
  function renderHome() {
    const tiles = COLLECTIONS.map(c => {
      const media = c.cover
        ? '<img class="cover" loading="lazy" src="' + c.cover + '" alt="' + esc(c.title) + '">' +
          '<span class="col-card-count">' + c.boards.length + ' boards</span>'
        : '<div class="col-card-empty">Restocking</div>';
      return (
        '<a class="col-card" href="#' + c.id + '" style="--accent:' + c.accent + '">' +
          '<div class="col-card-title">' + esc(c.title) + '</div>' +
          '<div class="col-card-media">' + media + '<div class="glow"></div></div>' +
          '<div class="col-card-tagline">' + esc(c.tagline) + '</div>' +
        '</a>'
      );
    }).join("");

    app.innerHTML =
      '<header class="hero">' +
        '<div class="hero-bg" style="background-image:url(' + SITE.heroImage + ')"></div>' +
        '<div class="hero-vignette"></div><div class="hero-noise"></div><div class="hero-fade"></div>' +
        '<div class="hero-inner">' +
          '<img class="hero-logo" src="' + SITE.logo + '" alt="AVRG">' +
          '<div class="hero-tagline" id="tagline"></div>' +
        '</div>' +
      '</header>' +
      '<main class="home-wrap fade-in">' +
        '<div class="section-label">Collections</div>' +
        '<div class="col-grid">' + tiles + '</div>' +
      '</main>' +
      '<footer class="footer">' +
        '<div class="dm-line">' + dmLine() + '</div>' +
        '<div class="copy">AVRG &copy; 2026</div>' +
      '</footer>';

    startTaglines();
  }

  /* ---------- collection page ---------- */
  function renderCollection(col) {
    let body;
    if (!col.boards.length) {
      body = '<div class="empty-state">Nothing here yet — check back.</div>';
    } else if (col.layout === "stack") {
      body = '<div class="stack-list">' + col.boards.map((b, i) => stackRow(b, i)).join("") + '</div>';
    } else if (col.layout === "pairs") {
      body = '<div class="pairs-grid">' + col.boards.map((b, i) => pairCard(b, i)).join("") + '</div>';
    } else {
      body = '<div class="board-grid">' + col.boards.map((b, i) => boardTile(b, i)).join("") + '</div>';
    }

    app.innerHTML =
      '<div class="topbar">' +
        '<div class="back" id="back">&#8592; Back</div>' +
        '<a href="#"><img src="' + SITE.logo + '" alt="AVRG"></a>' +
      '</div>' +
      '<main class="col-page fade-in" style="--accent:' + col.accent + '">' +
        '<div class="col-eyebrow">' + esc(col.title) + '</div>' +
        '<div class="col-rule"></div>' +
        '<p class="col-desc">' + esc(col.description) + '</p>' +
        body +
        '<div class="dm-block">' +
          '<div class="dm-label">Interested?</div>' +
          '<div class="dm-line">' + dmLine() + '</div>' +
        '</div>' +
      '</main>' +
      '<footer class="footer"><div class="copy">AVRG &copy; 2026</div></footer>';

    document.getElementById("back").addEventListener("click", () => { location.hash = ""; });

    const sel = col.layout === "stack" ? ".photo-stack"
      : col.layout === "pairs" ? ".pair-card" : ".board";
    app.querySelectorAll(sel).forEach(node => {
      node.addEventListener("click", () => {
        openLightbox(col.boards[+node.dataset.i], col.accent);
      });
    });
  }

  function boardTile(b, i) {
    const multi = b.photos.length > 1;
    const name = b.name ? '<span>' + esc(b.name) + '</span>' : '<span></span>';
    const cnt = multi ? '<span class="board-count">' + b.photos.length + ' ▣</span>' : '';
    return (
      '<div class="board" data-i="' + i + '">' +
        '<img loading="lazy" src="' + b.thumb + '" alt="' + esc(b.name || "AVRG board") + '">' +
        '<div class="board-meta">' + name + cnt + '</div>' +
      '</div>'
    );
  }

  // Pairs layout — one outlined card showing a board's two sides side by side
  function pairCard(b, i) {
    const thumbs = (b.thumbs && b.thumbs.length) ? b.thumbs : [b.thumb];
    const imgs = thumbs.map(src =>
      '<img loading="lazy" src="' + src + '" alt="' + esc(b.name || "AVRG board") + '">'
    ).join("");
    const single = thumbs.length < 2 ? " single" : "";
    const ref = b.ref ? '<div class="pair-ref">' + esc(b.ref) + '</div>' : '';
    return (
      '<div class="pair-card' + single + '" data-i="' + i + '">' +
        '<div class="pair-imgs">' + imgs + '</div>' + ref +
      '</div>'
    );
  }

  // Stack layout — left-aligned vertical list; each board is a fan-out photo stack
  function stackRow(b, i) {
    const thumbs = (b.thumbs && b.thumbs.length) ? b.thumbs : [b.thumb];
    const layers = thumbs.map((src, k) =>
      '<img class="ps-photo" style="--i:' + k + ';z-index:' + (40 - k) + '" ' +
      'loading="lazy" src="' + src + '" alt="' + esc(b.name || "AVRG board") + '">'
    ).join("");
    const cnt = thumbs.length > 1 ? '<span class="ps-count">' + thumbs.length + ' ▣</span>' : '';
    const name = b.name ? '<div class="stack-name">' + esc(b.name) + '</div>' : '';
    const desc = b.description ? '<div class="stack-desc">' + esc(b.description) + '</div>' : '';
    return (
      '<div class="stack-row">' +
        '<div class="photo-stack" data-i="' + i + '" role="button" tabindex="0">' + layers + cnt + '</div>' +
        '<div class="stack-info">' + name + desc + '</div>' +
      '</div>'
    );
  }

  /* ---------- rotating tagline ---------- */
  let tagTimer = null, tagIdx = 0;
  function startTaglines() {
    if (tagTimer) clearInterval(tagTimer);
    const list = (SITE.taglines && SITE.taglines.length) ? SITE.taglines : [""];
    tagIdx = Math.floor(((Date.now ? safeNow() : 0)) % list.length);
    const node = document.getElementById("tagline");
    if (!node) return;
    node.textContent = list[tagIdx];
    tagTimer = setInterval(() => {
      const n = document.getElementById("tagline");
      if (!n) { clearInterval(tagTimer); tagTimer = null; return; }
      n.classList.add("out");
      setTimeout(() => {
        tagIdx = (tagIdx + 1) % list.length;
        n.textContent = list[tagIdx];
        n.classList.remove("out");
      }, 400);
    }, 3600);
  }
  function safeNow() { try { return Date.now(); } catch (e) { return 0; } }

  /* ---------- hero parallax / fade ---------- */
  window.addEventListener("scroll", () => {
    const inner = document.querySelector(".hero-inner");
    if (!inner) return;
    const y = window.scrollY || window.pageYOffset || 0;
    inner.style.transform = "translateY(" + (y * 0.25) + "px)";
    inner.style.opacity = Math.max(0, 1 - y / 320);
  }, { passive: true });

  /* ---------- lightbox ---------- */
  const lb = document.getElementById("lb");
  const lbImg = document.getElementById("lb-img");
  const lbCap = document.getElementById("lb-caption");
  const lbDesc = document.getElementById("lb-desc");
  const lbDots = document.getElementById("lb-dots");
  const lbPrev = document.getElementById("lb-prev");
  const lbNext = document.getElementById("lb-next");
  let curBoard = null, curAccent = "#e84a27", curIdx = 0, curCol = "";

  function openLightbox(board, accent, colTitle) {
    curBoard = board; curAccent = accent; curIdx = 0;
    curCol = colTitle || (colById(location.hash.replace(/^#/, "")) || {}).title || "";
    lb.style.setProperty("--accent", accent);
    show();
    lb.hidden = false;
    document.body.style.overflow = "hidden";
  }
  function close() { lb.hidden = true; document.body.style.overflow = ""; curBoard = null; }
  function show() {
    if (!curBoard) return;
    const photos = curBoard.photos;
    if (curIdx < 0) curIdx = photos.length - 1;
    if (curIdx >= photos.length) curIdx = 0;
    lbImg.src = photos[curIdx];
    lbImg.alt = curBoard.name || "AVRG board";
    const bits = [];
    if (curBoard.ref) bits.push('<span class="accent">' + esc(curBoard.ref) + '</span>');
    if (curBoard.name) bits.push(esc(curBoard.name));
    if (curCol) bits.push(curBoard.ref ? esc(curCol) : '<span class="accent">' + esc(curCol) + '</span>');
    if (photos.length > 1) bits.push((curIdx + 1) + " / " + photos.length);
    lbCap.innerHTML = bits.join("&nbsp;&nbsp;·&nbsp;&nbsp;");
    lbPrev.hidden = lbNext.hidden = photos.length < 2;
    lbDots.innerHTML = photos.length > 1
      ? photos.map((_, i) => '<i class="' + (i === curIdx ? "on" : "") + '" data-i="' + i + '"></i>').join("")
      : "";
    const d = curBoard.description || "";
    lbDesc.textContent = d;
    lbDesc.style.display = d ? "" : "none";
  }
  function step(d) { curIdx += d; show(); }

  lbPrev.addEventListener("click", e => { e.stopPropagation(); step(-1); });
  lbNext.addEventListener("click", e => { e.stopPropagation(); step(1); });
  lbDots.addEventListener("click", e => {
    const i = e.target.dataset && e.target.dataset.i;
    if (i != null) { curIdx = +i; show(); }
  });
  document.getElementById("lb-close").addEventListener("click", close);
  lb.addEventListener("click", e => {
    if (e.target === lb || e.target.id === "lb-stage") close();
  });
  document.addEventListener("keydown", e => {
    if (lb.hidden) return;
    if (e.key === "Escape") close();
    else if (e.key === "ArrowLeft") step(-1);
    else if (e.key === "ArrowRight") step(1);
  });
  let tx = null;
  lb.addEventListener("touchstart", e => { tx = e.changedTouches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", e => {
    if (tx == null || !curBoard || curBoard.photos.length < 2) { tx = null; return; }
    const dx = e.changedTouches[0].clientX - tx;
    if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
    tx = null;
  }, { passive: true });

  route();
})();
