(function () {
  "use strict";

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Sticky header state ---------- */
  var header = document.getElementById("siteHeader");

  function onHeaderScroll() {
    var scrolled = window.scrollY > 40;
    header.classList.toggle("is-scrolled", scrolled);
  }
  window.addEventListener("scroll", onHeaderScroll, { passive: true });
  onHeaderScroll();

  /* ---------- Full-screen menu ---------- */
  var navToggle = document.getElementById("navToggle");
  var mobileMenu = document.getElementById("mobileMenu");
  var mobileMenuClose = document.getElementById("mobileMenuClose");

  function closeMenu() {
    mobileMenu.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  }

  if (navToggle && mobileMenu) {
    navToggle.addEventListener("click", function () {
      var isOpen = mobileMenu.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });
    if (mobileMenuClose) mobileMenuClose.addEventListener("click", closeMenu);
    mobileMenu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeMenu);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && mobileMenu.classList.contains("is-open")) closeMenu();
    });
  }

  /* ---------- Scroll reveal ---------- */
  var revealTargets = document.querySelectorAll("[data-reveal], [data-reveal-group]");
  if ("IntersectionObserver" in window && revealTargets.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealTargets.forEach(function (el) { io.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Hero blob parallax (subtle, scroll-linked) ---------- */
  var parallaxEls = document.querySelectorAll("[data-parallax]");
  if (!reducedMotion && parallaxEls.length) {
    var ticking = false;
    function updateParallax() {
      var y = window.scrollY;
      parallaxEls.forEach(function (el) {
        var factor = parseFloat(el.getAttribute("data-parallax")) || 0.1;
        el.style.transform = "translate3d(0, " + Math.round(y * factor) + "px, 0)";
      });
      ticking = false;
    }
    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          window.requestAnimationFrame(updateParallax);
          ticking = true;
        }
      },
      { passive: true }
    );
  }

  /* ---------- Promise: scroll-progress word highlight ---------- */
  var promiseQuote = document.getElementById("promiseQuote");

  if (promiseQuote && !reducedMotion) {
    var words = Array.prototype.slice.call(promiseQuote.querySelectorAll(".word"));
    var pTicking = false;

    function updatePromise() {
      var rect = promiseQuote.getBoundingClientRect();
      var vh = window.innerHeight;
      var quoteCenter = rect.top + rect.height / 2;
      // Reveal starts as the quote's center approaches from the lower part of the
      // screen, and completes exactly when it reaches the vertical middle of the viewport.
      var startY = vh * 0.85;
      var endY = vh * 0.5;
      var progress = (startY - quoteCenter) / (startY - endY);
      var reveal = Math.min(1, Math.max(0, progress));
      var litCount = Math.round(reveal * words.length);
      words.forEach(function (w, i) {
        w.classList.toggle("lit", i < litCount);
      });
      pTicking = false;
    }

    window.addEventListener(
      "scroll",
      function () {
        if (!pTicking) {
          window.requestAnimationFrame(updatePromise);
          pTicking = true;
        }
      },
      { passive: true }
    );
    updatePromise();
  } else if (promiseQuote) {
    promiseQuote.classList.add("static-lit");
  }

  /* ---------- Senses: sequential unlock discovery game ---------- */
  var sensesGame = document.getElementById("sensesGame");

  if (sensesGame) {
    var senseButtons = Array.prototype.slice.call(sensesGame.querySelectorAll(".sense-btn"));
    var sensePanels = Array.prototype.slice.call(sensesGame.querySelectorAll(".sense-panel"));
    var sensesProgressCount = document.getElementById("sensesProgressCount");
    var sensesProgressBar = document.getElementById("sensesProgressBar");
    var sensesComplete = document.getElementById("sensesComplete");
    var visited = {};
    var maxUnlocked = 0;

    sensesGame.classList.add("is-enhanced");

    function updateLocks() {
      senseButtons.forEach(function (btn) {
        var idx = parseInt(btn.getAttribute("data-index"), 10);
        var locked = idx > maxUnlocked;
        btn.classList.toggle("is-locked", locked);
        btn.setAttribute("aria-disabled", locked ? "true" : "false");
      });
    }

    function selectSense(index, isBump) {
      senseButtons.forEach(function (btn) {
        var match = btn.getAttribute("data-index") === String(index);
        btn.classList.toggle("is-active", match);
        btn.setAttribute("aria-selected", match ? "true" : "false");
        if (match && isBump) {
          btn.classList.remove("is-bump");
          void btn.offsetWidth;
          btn.classList.add("is-bump");
        }
      });
      sensePanels.forEach(function (panel) {
        panel.classList.toggle("is-active", panel.getAttribute("data-index") === String(index));
      });
    }

    function markVisited(index, btn) {
      index = parseInt(index, 10);
      if (visited[index]) return;
      visited[index] = true;
      btn.classList.add("is-visited");
      var count = Object.keys(visited).length;
      sensesProgressCount.textContent = String(count);
      sensesProgressBar.style.width = (count / senseButtons.length) * 100 + "%";
      if (index === maxUnlocked && maxUnlocked < senseButtons.length - 1) {
        maxUnlocked++;
        updateLocks();
      }
      if (count === senseButtons.length) {
        sensesComplete.classList.add("is-shown");
      }
    }

    senseButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (btn.classList.contains("is-locked")) return;
        var index = btn.getAttribute("data-index");
        selectSense(index, true);
        markVisited(index, btn);
        if (!reducedMotion) {
          btn.classList.remove("is-rippling");
          void btn.offsetWidth;
          btn.classList.add("is-rippling");
        }
      });
    });

    updateLocks();
    selectSense("0", false);
    markVisited("0", senseButtons[0]);
  }

  /* ---------- Engagements: click-to-flip cards ---------- */
  var flipCards = document.querySelectorAll("[data-flip]");
  flipCards.forEach(function (card) {
    card.addEventListener("click", function () {
      card.classList.toggle("is-flipped");
    });
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");
    card.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        card.classList.toggle("is-flipped");
      }
    });
  });

  /* ---------- Projets: seamless draggable mosaic ---------- */
  var mosaicViewport = document.getElementById("mosaicViewport");

  if (mosaicViewport) {
    var mosaicTrack = document.getElementById("mosaicTrack");
    var mosaicHint = document.getElementById("mosaicHint");
    var mosaicImages = [
      { src: "assets/img/evenement-table-fleurs-legumes.jpg", caption: "Table dressée, fleurs et légumes de saison" },
      { src: "assets/img/evenement-buffet-bruschetta.jpg", caption: "Buffet bruschetta et charcuterie" },
      { src: "assets/img/evenement-cave-barolo.jpg", caption: "Cave à Barolo" },
      { src: "assets/img/evenement-tablee-diner-bougies.jpg", caption: "Tablée aux chandelles" },
      { src: "assets/img/evenement-rangee-spritz.jpg", caption: "L'heure du spritz" },
      { src: "assets/img/evenement-vespas-vintage.jpg", caption: "Vespas vintage" },
      { src: "assets/img/evenement-fiat500-blanche.jpg", caption: "Fiat 500 blanche" },
      { src: "assets/img/evenement-fiat-jolly-jaune.jpg", caption: "Fiat Jolly jaune" },
      { src: "assets/img/evenement-canapes-tartelettes.jpg", caption: "Canapés et tartelettes" },
      { src: "assets/img/evenement-bar-a-burrata.jpg", caption: "Bar à burrata" },
      { src: "assets/img/evenement-sanpellegrino-verres.jpg", caption: "Verres et Sanpellegrino" },
      { src: "assets/img/evenement-planche-charcuterie.jpg", caption: "Planche de charcuterie" },
      { src: "assets/img/evenement-plateau-agrumes.jpg", caption: "Plateau d'agrumes" },
      { src: "assets/img/evenement-ceramiques-citrons.jpg", caption: "Céramiques et citrons" },
      { src: "assets/img/evenement-tomates-bougeoir.jpg", caption: "Tomates et bougeoir laiton" },
      { src: "assets/img/evenement-fiat500-creme-mur-pierre.jpg", caption: "Fiat 500 crème" },
      { src: "assets/img/evenement-bruschetta-burrata-jardin.jpg", caption: "Bruschetta burrata au jardin" }
    ];

    var TILE = window.innerWidth < 640 ? 150 : 240;
    var EXTRA = 3; // extra rows/cols beyond the exact viewport fit, so there is always room to drag
    var grid = { cols: 0, rows: 0, w: 0, h: 0 };
    var posX = 0, posY = 0;

    function buildMosaicGrid() {
      var vw = mosaicViewport.clientWidth || window.innerWidth;
      var vh = mosaicViewport.clientHeight || 480;
      grid.cols = Math.ceil(vw / TILE) + EXTRA;
      grid.rows = Math.ceil(vh / TILE) + EXTRA;
      grid.w = grid.cols * TILE;
      grid.h = grid.rows * TILE;

      mosaicTrack.style.gridTemplateColumns = "repeat(" + grid.cols + ", " + TILE + "px)";
      mosaicTrack.style.gridAutoRows = TILE + "px";
      mosaicTrack.innerHTML = "";

      var total = grid.cols * grid.rows;
      var frag = document.createDocumentFragment();
      for (var i = 0; i < total; i++) {
        var pic = mosaicImages[i % mosaicImages.length];
        var fig = document.createElement("figure");
        fig.className = "mosaic-tile";
        var img = document.createElement("img");
        img.src = pic.src;
        img.alt = pic.caption;
        img.loading = "lazy";
        img.draggable = false;
        var cap = document.createElement("figcaption");
        cap.textContent = pic.caption;
        fig.appendChild(img);
        fig.appendChild(cap);
        frag.appendChild(fig);
      }
      mosaicTrack.appendChild(frag);
    }

    function clampMosaic() {
      var vw = mosaicViewport.clientWidth;
      var vh = mosaicViewport.clientHeight;
      var minX = Math.min(0, vw - grid.w);
      var minY = Math.min(0, vh - grid.h);
      posX = Math.max(minX, Math.min(0, posX));
      posY = Math.max(minY, Math.min(0, posY));
    }

    function applyMosaic() {
      mosaicTrack.style.transform = "translate3d(" + posX + "px, " + posY + "px, 0)";
    }

    function centerMosaic() {
      posX = -(grid.w - mosaicViewport.clientWidth) / 2;
      posY = -(grid.h - mosaicViewport.clientHeight) / 2;
      clampMosaic();
      applyMosaic();
    }

    buildMosaicGrid();
    centerMosaic();

    var hideHint = function () {
      if (mosaicHint) mosaicHint.classList.add("is-hidden");
    };

    var dragging = false, dragStartX = 0, dragStartY = 0, dragOriginX = 0, dragOriginY = 0;

    mosaicViewport.addEventListener("pointerdown", function (e) {
      dragging = true;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      dragOriginX = posX;
      dragOriginY = posY;
      mosaicViewport.classList.add("is-dragging");
      try { mosaicViewport.setPointerCapture(e.pointerId); } catch (err) {}
    });
    mosaicViewport.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      posX = dragOriginX + (e.clientX - dragStartX);
      posY = dragOriginY + (e.clientY - dragStartY);
      clampMosaic();
      applyMosaic();
      hideHint();
    });
    function endMosaicDrag() {
      dragging = false;
      mosaicViewport.classList.remove("is-dragging");
    }
    mosaicViewport.addEventListener("pointerup", endMosaicDrag);
    mosaicViewport.addEventListener("pointerleave", endMosaicDrag);
    mosaicViewport.addEventListener("pointercancel", endMosaicDrag);

    mosaicViewport.addEventListener("wheel", function (e) {
      e.preventDefault();
      posX -= e.deltaX;
      posY -= e.deltaY;
      clampMosaic();
      applyMosaic();
      hideHint();
    }, { passive: false });

    mosaicViewport.addEventListener("keydown", function (e) {
      var step = TILE * 0.6;
      var moved = true;
      if (e.key === "ArrowLeft") posX += step;
      else if (e.key === "ArrowRight") posX -= step;
      else if (e.key === "ArrowUp") posY += step;
      else if (e.key === "ArrowDown") posY -= step;
      else moved = false;
      if (moved) {
        e.preventDefault();
        clampMosaic();
        applyMosaic();
        hideHint();
      }
    });

    var mosaicResizeTimer = null;
    window.addEventListener("resize", function () {
      clearTimeout(mosaicResizeTimer);
      mosaicResizeTimer = setTimeout(function () {
        TILE = window.innerWidth < 640 ? 150 : 240;
        buildMosaicGrid();
        clampMosaic();
        applyMosaic();
      }, 200);
    });
  }

  /* ---------- Hero stat count-up ---------- */
  var countEl = document.querySelector("[data-count]");
  if (countEl && "IntersectionObserver" in window) {
    var countObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var target = parseInt(countEl.getAttribute("data-count"), 10) || 0;
          if (reducedMotion) {
            countEl.textContent = String(target);
          } else {
            var start = null;
            var duration = 900;
            function step(ts) {
              if (!start) start = ts;
              var p = Math.min(1, (ts - start) / duration);
              countEl.textContent = String(Math.round(p * target));
              if (p < 1) window.requestAnimationFrame(step);
            }
            window.requestAnimationFrame(step);
          }
          countObserver.unobserve(countEl);
        });
      },
      { threshold: 0.6 }
    );
    countObserver.observe(countEl);
  }

  /* ---------- Contact form: prefill service type from ?service= URL param ---------- */
  var serviceSelect = document.getElementById("serviceType");
  if (serviceSelect) {
    var params = new URLSearchParams(window.location.search);
    var wanted = params.get("service");
    if (wanted) {
      var match = Array.prototype.find.call(serviceSelect.options, function (opt) {
        return opt.value === wanted;
      });
      if (match) serviceSelect.value = wanted;
    }
  }

  /* ---------- Lead form: validation + mailto submission ---------- */
  var form = document.getElementById("leadForm");
  var successBox = document.getElementById("formSuccess");
  var LEAD_EMAIL = "Estellelorusso@eurhekaconseil.com";

  function setFieldError(field, hasError) {
    field.closest(".field").classList.toggle("has-error", hasError);
  }

  function validate(data) {
    var valid = true;
    var required = ["fullName", "company", "email", "message"];
    required.forEach(function (name) {
      var field = form.elements[name];
      var empty = !data[name] || !data[name].trim();
      setFieldError(field, empty);
      if (empty) valid = false;
    });

    var emailField = form.elements.email;
    var emailValue = data.email || "";
    var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue);
    if (!emailOk) {
      setFieldError(emailField, true);
      valid = false;
    }

    return valid;
  }

  function buildMailto(data) {
    var subject = "Demande de devis Simposio — " + (data.company || data.fullName);
    var lines = [
      "Nom : " + data.fullName,
      "Entreprise : " + data.company,
      "Email : " + data.email,
      "Téléphone : " + (data.phone || "—"),
      "Type d'événement : " + (data.serviceType || "—"),
      "Nombre d'invités estimé : " + (data.guests || "—"),
      "Date envisagée : " + (data.eventDate || "—"),
      "",
      "Message :",
      data.message
    ];
    var body = lines.join("\n");
    return (
      "mailto:" + encodeURIComponent(LEAD_EMAIL) +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(body)
    );
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var formData = new FormData(form);
      var data = {};
      formData.forEach(function (value, key) { data[key] = value; });

      if (!validate(data)) {
        var firstError = form.querySelector(".has-error input, .has-error select, .has-error textarea");
        if (firstError) firstError.focus();
        return;
      }

      window.location.href = buildMailto(data);

      if (successBox) {
        successBox.classList.add("is-visible");
      }
    });

    form.querySelectorAll("input, select, textarea").forEach(function (el) {
      el.addEventListener("input", function () { setFieldError(el, false); });
    });
  }
})();
