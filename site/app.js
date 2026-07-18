/* AVRG — "Dye Lot Conveyor" app
   Home: one auto-rotating conveyor per collection (hover a side to steer, drag on touch).
   Section titles route to per-collection static-grid pages (#collection-id).
   Clicking a deck pulls the card forward into a lightbox; ‹ › / arrows / swipe
   walk the collection while enlarged. Content comes from data.js (build_site.py). */
(function () {
  "use strict";

  const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[m]));
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canHover = matchMedia("(hover: hover)").matches;

  document.getElementById("logo").src = SITE.logo;

  const handle = (typeof CONTACT === "object" && CONTACT && CONTACT.reddit) || "u/avrg";
  const rurl = "https://www.reddit.com/user/" + encodeURIComponent(handle.replace(/^\/?u\//i, ""));
  const dm = document.getElementById("dm");
  dm.href = rurl;
  dm.textContent = "DM " + handle + " on Reddit";

  /* rotating tagline */
  const tags = (SITE.taglines && SITE.taglines.length) ? SITE.taglines : [""];
  const tick = document.getElementById("tick");
  let ti = 0;
  tick.textContent = tags[0];
  if (!reduced && tags.length > 1) setInterval(() => {
    tick.classList.add("out");
    setTimeout(() => { ti = (ti + 1) % tags.length; tick.textContent = tags[ti]; tick.classList.remove("out"); }, 450);
  }, 4400);

  /* per-collection accents recalibrated for the bone ground; falls back to data.js accents */
  const ACC = { originals: "#d8511f", "hand-shaped": "#1f6fb8", classic: "#c98a12", resale: "#6d4fa3" };
  const accOf = c => ACC[c.id] || c.accent;
  const refOf = (b, k) => b.ref || "#" + String(k + 1).padStart(2, "0");
  const titleHtml = c => {
    const words = c.title.replace(/ - /g, " ").split(" ");
    const last = words.pop();
    return esc(words.join(" ")) + (words.length ? " " : "") + '<span class="hl">' + esc(last) + '</span>';
  };
  const cardInner = (b, k) => {
    const ref = refOf(b, k);
    return '<div class="frame"><img loading="lazy" src="' + b.thumb + '" alt="' + esc(b.name || ref) + '"></div>' +
      '<div class="cap"><span class="nm">' + esc(b.name || ref) + '</span>' +
      (b.name ? '<span class="rf">' + esc(ref) + '</span>' : '') + '</div>';
  };
  const cleanDesc = s => (s || "").replace(/ Hover.*$/, "");

  /* ---- home sections ---- */
  document.getElementById("cols").innerHTML = COLLECTIONS.map((c, i) => {
    const body = c.boards.length
      ? '<div class="belt" data-col="' + i + '"></div>'
      : '<div class="restock label">Restocking — check back</div>';
    return '<section class="col" data-col="' + i + '" style="--acc:' + accOf(c) + '">' +
      '<h2 role="link" tabindex="0" title="Open collection">' + titleHtml(c) + '<span class="go">→</span></h2>' +
      '<p class="desc">' + esc(cleanDesc(c.description)) + '</p>' +
      body +
    '</section>';
  }).join("");

  /* ---- routing: home <-> collection page ---- */
  const home = document.getElementById("home");
  const colpage = document.getElementById("colpage");

  const LOOP_SVG =
    '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M3 12a9 9 0 1 0 3.4-7.06"/><polyline points="3 2.5 3 8 8.5 8"/>' +
    '</svg>';

  function renderColPage(c, i) {
    const others = COLLECTIONS
      .map((o, j) => ({ o, j }))
      .filter(x => x.j !== i)
      .map(({ o }) =>
        '<a class="colnav-btn label" style="--acc:' + accOf(o) + '" href="#' + o.id + '">' +
          esc(o.title.replace(/ - /g, " ")) +
        '</a>'
      ).join("");
    colpage.innerHTML =
      '<section class="col colpage" data-col="' + i + '" style="--acc:' + accOf(c) + '">' +
        '<a class="back label" href="#">← All collections</a>' +
        '<h2>' + titleHtml(c) + '</h2>' +
        '<p class="desc">' + esc(cleanDesc(c.description)) + '</p>' +
        (c.boards.length
          ? '<div class="shelfgrid">' +
              c.boards.map((b, k) => '<div class="scard" data-k="' + k + '" role="button" tabindex="0">' + cardInner(b, k) + '</div>').join("") +
            '</div>'
          : '<div class="restock label">Restocking — check back</div>') +
        '<div class="colnav">' +
          '<a class="colnav-home" href="#" title="Back to the main page" aria-label="Back to the main page">' + LOOP_SVG + '</a>' +
          '<div class="colnav-links">' + others + '</div>' +
        '</div>' +
      '</section>';
    colpage.querySelectorAll(".scard").forEach(s => {
      s.addEventListener("click", () => openLb(i, +s.dataset.k, s));
      s.addEventListener("keydown", e => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openLb(i, +s.dataset.k, s); }
      });
    });
  }

  function route() {
    const id = (location.hash || "").replace(/^#/, "");
    const i = COLLECTIONS.findIndex(c => c.id === id);
    if (i >= 0) {
      renderColPage(COLLECTIONS[i], i);
      home.hidden = true; colpage.hidden = false;
    } else {
      colpage.hidden = true; home.hidden = false;
    }
    window.scrollTo(0, 0);
  }
  window.addEventListener("hashchange", route);
  document.getElementById("home-link").addEventListener("click", () => { location.hash = ""; });

  document.querySelectorAll("#cols h2").forEach(h2 => {
    const go = () => { location.hash = COLLECTIONS[+h2.closest("section").dataset.col].id; };
    h2.addEventListener("click", go);
    h2.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); }
    });
  });

  /* ---- lightbox: the pull-forward ---- */
  const lb = document.getElementById("lb");
  const lbScrim = document.getElementById("lb-scrim");
  const lbCard = document.getElementById("lb-card");
  const lbBig = document.getElementById("lb-big");
  const lbThumbs = document.getElementById("lb-thumbs");
  const lbNm = document.getElementById("lb-nm");
  const lbRf = document.getElementById("lb-rf");
  const lbDesc = document.getElementById("lb-desc");
  const lbDm = document.getElementById("lb-dm");
  const lbCount = document.getElementById("lb-count");
  let cur = null;   /* { ci, k } while open */

  lbDm.href = rurl;
  lbDm.textContent = "DM " + handle;

  function populate(ci, k) {
    const c = COLLECTIONS[ci];
    const b = c.boards[k];
    const ref = refOf(b, k);
    lb.style.setProperty("--acc", accOf(c));
    lbBig.src = b.photos[0];
    lbBig.alt = b.name || ref;
    lbThumbs.innerHTML = b.photos.length > 1
      ? b.photos.map((p, j) =>
          '<img class="' + (j === 0 ? "on" : "") + '" src="' + ((b.thumbs && b.thumbs[j]) || p) + '" data-j="' + j + '" alt="angle ' + (j + 1) + '">'
        ).join("")
      : "";
    lbNm.textContent = b.name || ref;
    lbRf.textContent = b.name ? ref : "";
    const d = b.description || "";
    lbDesc.textContent = (!d || /^Replace this/m.test(d)) ? cleanDesc(c.description) : d;
    lbCount.textContent = (k + 1) + " / " + c.boards.length + " — " + c.title.replace(/ - /g, " ");
    cur = { ci, k };
  }

  /* find the on-page card matching the current deck, for the return animation */
  function sourceFrame() {
    if (!cur) return null;
    const view = colpage.hidden ? document.querySelector('#cols section[data-col="' + cur.ci + '"] .belt') : colpage;
    if (!view) return null;
    const sel = colpage.hidden ? ".card" : ".scard";
    const el = Array.from(view.querySelectorAll(sel)).find(n =>
      +n.dataset.k === cur.k && n.style.visibility !== "hidden");
    return el ? el.querySelector(".frame") : null;
  }

  function flipFrom(frameEl) {
    lbCard.style.transition = "none";
    if (frameEl) {
      const sr = frameEl.getBoundingClientRect();
      const fr = lbCard.querySelector(".frame").getBoundingClientRect();
      const s = sr.width / fr.width;
      const dx = (sr.left + sr.width / 2) - (fr.left + fr.width / 2);
      const dy = (sr.top + sr.height / 2) - (fr.top + fr.height / 2);
      const frame = lbCard.querySelector(".frame");
      lbCard.style.transformOrigin = "50% " + (frame.offsetTop + frame.offsetHeight / 2) + "px";
      lbCard.style.transform = "translate(" + dx + "px," + dy + "px) scale(" + s + ")";
    } else {
      lbCard.style.transform = "scale(.6)";
    }
    void lbCard.offsetWidth;                       /* commit start state */
    lbCard.style.transition = "";
    lbCard.style.transform = "none";
  }

  function openLb(ci, k, sourceEl) {
    populate(ci, k);
    lb.hidden = false;
    document.body.style.overflow = "hidden";
    if (!reduced) flipFrom(sourceEl ? sourceEl.querySelector(".frame") : null);
    requestAnimationFrame(() => lb.classList.add("in"));
  }

  function closeLb(instant) {
    const back = (reduced || instant) ? null : sourceFrame();
    lb.classList.remove("in");
    if (back) {
      const sr = back.getBoundingClientRect();
      const fr = lbCard.querySelector(".frame").getBoundingClientRect();
      const s = sr.width / fr.width;
      const dx = (sr.left + sr.width / 2) - (fr.left + fr.width / 2);
      const dy = (sr.top + sr.height / 2) - (fr.top + fr.height / 2);
      lbCard.style.transform = "translate(" + dx + "px," + dy + "px) scale(" + s + ")";
    }
    setTimeout(() => {
      lb.hidden = true;
      lbCard.style.transform = "none";
      document.body.style.overflow = "";
      cur = null;
    }, (reduced || instant) ? 0 : 430);
  }

  function step(dir) {
    if (!cur) return;
    const c = COLLECTIONS[cur.ci];
    const k = (cur.k + dir + c.boards.length) % c.boards.length;
    if (!reduced) {
      lbCard.style.transition = "transform .18s ease, opacity .18s ease";
      lbCard.style.opacity = "0";
      lbCard.style.transform = "translateX(" + (-dir * 30) + "px)";
      setTimeout(() => {
        populate(cur.ci, k);
        lbCard.style.transition = "none";
        lbCard.style.transform = "translateX(" + (dir * 30) + "px)";
        void lbCard.offsetWidth;
        lbCard.style.transition = "transform .22s ease, opacity .22s ease";
        lbCard.style.opacity = "1";
        lbCard.style.transform = "none";
        setTimeout(() => { lbCard.style.transition = ""; }, 240);
      }, 180);
    } else {
      populate(cur.ci, k);
    }
  }

  document.getElementById("lb-close").addEventListener("click", closeLb);
  lbScrim.addEventListener("click", closeLb);
  document.getElementById("lb-prev").addEventListener("click", () => step(-1));
  document.getElementById("lb-next").addEventListener("click", () => step(1));
  /* second click on the enlarged image routes to the collection's grid page —
     never a raw image in a new tab */
  lbBig.addEventListener("click", () => {
    if (!cur) return;
    const id = COLLECTIONS[cur.ci].id;
    if (location.hash.replace(/^#/, "") === id) { closeLb(); return; }
    closeLb(true);
    location.hash = id;
  });
  lbThumbs.addEventListener("click", e => {
    const j = e.target.dataset && e.target.dataset.j;
    if (j == null || !cur) return;
    const b = COLLECTIONS[cur.ci].boards[cur.k];
    lbBig.src = b.photos[+j];
    lbThumbs.querySelectorAll("img").forEach(t => t.classList.toggle("on", t.dataset.j === j));
  });
  document.addEventListener("keydown", e => {
    if (lb.hidden) return;
    if (e.key === "Escape") closeLb();
    else if (e.key === "ArrowLeft") step(-1);
    else if (e.key === "ArrowRight") step(1);
  });
  let swX = null;
  lb.addEventListener("touchstart", e => { swX = e.changedTouches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", e => {
    if (swX == null) return;
    const dx = e.changedTouches[0].clientX - swX;
    if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
    swX = null;
  }, { passive: true });

  /* ---- conveyor engine ---- */
  const rails = [];
  const BASE_V = -26;   /* px/s idle drift, right to left */

  document.querySelectorAll(".belt").forEach(belt => {
    const ci = +belt.dataset.col;
    const col = COLLECTIONS[ci];
    const cardW = parseFloat(getComputedStyle(belt).getPropertyValue("--cardW")) || 236;
    const spacing = cardW + 62;   /* room for the 1.14x center zoom */

    /* duplicate the lineup so the loop covers the widest screens */
    const minTotal = Math.max(innerWidth + spacing * 4, 3900);
    const reps = Math.max(2, Math.ceil(minTotal / (col.boards.length * spacing)));
    const items = [];
    for (let r = 0; r < reps; r++) col.boards.forEach((b, k) => items.push({ b, k }));

    belt.innerHTML = items.map(({ b, k }) =>
      '<div class="card" data-k="' + k + '" role="button" tabindex="-1">' + cardInner(b, k) + '</div>'
    ).join("");

    const rail = {
      belt, spacing,
      cards: Array.from(belt.children),
      total: items.length * spacing,
      offset: 0, v: BASE_V, pointerX: null,
      dragging: false, dragX: 0, moved: 0,
      active: true,
    };

    belt.addEventListener("pointermove", e => {
      const r = belt.getBoundingClientRect();
      rail.pointerX = e.clientX - r.left;
      if (rail.dragging) {
        const dx = e.clientX - rail.dragX;
        rail.dragX = e.clientX;
        rail.offset += dx;
        rail.moved += Math.abs(dx);
      }
    });
    belt.addEventListener("pointerleave", () => { rail.pointerX = null; rail.dragging = false; });
    belt.addEventListener("pointerdown", e => {
      rail.dragging = true; rail.dragX = e.clientX; rail.moved = 0;
      belt.classList.add("dragging");
    });
    addEventListener("pointerup", () => { rail.dragging = false; belt.classList.remove("dragging"); });
    belt.addEventListener("click", e => {
      if (rail.moved > 6) return;                 /* a drag isn't a pick */
      const card = e.target.closest(".card");
      if (card) openLb(ci, +card.dataset.k, card);
    });

    rails.push(rail);
  });

  /* only animate belts on screen */
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      const rail = rails.find(r => r.belt === en.target);
      if (rail) rail.active = en.isIntersecting;
    });
  }, { rootMargin: "120px" });
  rails.forEach(r => io.observe(r.belt));

  const smooth = (a, b, x) => {
    const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
    return t * t * (3 - 2 * t);
  };

  let last = performance.now();
  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;

    if (!lb.hidden) { requestAnimationFrame(frame); return; }   /* freeze belts behind the lightbox */

    rails.forEach(rail => {
      if (!rail.active) return;
      const w = rail.belt.clientWidth;
      const cx = w / 2;

      /* velocity: idle drift, or steer toward the hovered side */
      let target = BASE_V;
      if (rail.pointerX != null && !rail.dragging) {
        const dx = rail.pointerX - cx;
        if (Math.abs(dx) > rail.spacing) {
          const t = Math.min(1, (Math.abs(dx) - rail.spacing) / Math.max(120, cx - rail.spacing));
          target = -Math.sign(dx) * (60 + 340 * t);
        }
      }
      if (!reduced && !rail.dragging) rail.v += (target - rail.v) * Math.min(1, dt * 4);
      if (!rail.dragging && !reduced) rail.offset += rail.v * dt;

      rail.offset = ((rail.offset % rail.total) + rail.total) % rail.total;

      rail.cards.forEach((card, i) => {
        let x = (i * rail.spacing + rail.offset) % rail.total;
        x -= rail.spacing * 1.5;                  /* let cards run offscreen left */
        if (x < -rail.spacing * 1.6 || x > w + rail.spacing * .6) {
          card.style.visibility = "hidden";
          return;
        }
        card.style.visibility = "visible";
        const center = x + rail.spacing / 2;
        const d = Math.abs(center - cx) / rail.spacing;
        const fall = smooth(0.62, 2.6, d);        /* the center two stay clear */
        const s = 1.14 - 0.36 * fall;
        const o = 1 - 0.62 * fall;
        card.style.transform = "translate3d(" + x + "px,-50%,0) scale(" + s.toFixed(3) + ")";
        card.style.opacity = o.toFixed(3);
        card.style.zIndex = String(1000 - Math.round(d * 100));
      });
    });

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  route();
})();
