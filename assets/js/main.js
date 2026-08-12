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

  /* ---------- Univers: 5 senses — scroll-drawn path with waypoint cards ---------- */
  var sensesJourney = document.getElementById("sensesJourney");

  if (sensesJourney) {
    var journeySvg = sensesJourney.querySelector(".senses-journey-svg");
    var journeyPath = document.getElementById("sensesJourneyPath");
    var journeyPathBg = sensesJourney.querySelector(".senses-journey-path-bg");
    var journeyDotGroups = Array.prototype.slice.call(sensesJourney.querySelectorAll(".senses-journey-dot-group"));
    var journeyCard = document.getElementById("sensesJourneyCard");
    var journeyCardIcon = document.getElementById("sensesJourneyCardIcon");
    var journeyCardNum = document.getElementById("sensesJourneyCardNum");
    var journeyCardTitle = document.getElementById("sensesJourneyCardTitle");
    var journeyCardDesc = document.getElementById("sensesJourneyCardDesc");
    var journeyCount = document.getElementById("sensesJourneyCount");

    var journeySenses = [
      {
        title: "La vue",
        desc: "Une palette esthétique d'exception : véhicules de collection, céramiques artisanales, motifs méditerranéens et jeux de lumière.",
        icon: '<path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3.2"/>'
      },
      {
        title: "Le goût",
        desc: "Une gastronomie de saison, conçue avec des partenaires de qualité — de l'antipasti à la mixologie.",
        icon: '<path d="M6 3v7a4 4 0 008 0V3M8 3v5M10 3v5M16 3v18M16 12c2.5 0 4-1.5 4-4s-1.5-5-4-5"/>'
      },
      {
        title: "L'odorat",
        desc: "Une bulle délicate : fraîcheur des agrumes, du basilic, de l'expresso fraîchement moulu, de l'huile d'olive.",
        icon: '<path d="M17 8c0 4-3 7-7 9-2-3-4-6-4-9a5.5 5.5 0 0111 0z"/><path d="M10 17c0-4 2-7 5-9"/>'
      },
      {
        title: "L'ouïe",
        desc: "Une sélection musicale sur-mesure, des classiques italiens aux sonorités de la Dolce Vita.",
        icon: '<path d="M4 10v4M8 6v12M12 3v18M16 7v10M20 10v4"/>'
      },
      {
        title: "Le toucher",
        desc: "L'élégance du geste : initiation à la mixologie, dégustations culinaires et borne photographique.",
        icon: '<path d="M8 12V6a2 2 0 114 0v5M12 11V4a2 2 0 114 0v7M16 11V6a2 2 0 114 0v7c0 4-2 8-7 8s-6-3-7-6l-1.5-3A1.6 1.6 0 016 9.2v0a1.6 1.6 0 012 .4L9 11"/>'
      }
    ];

    function catmullRomToBezierD(pts) {
      var p = [pts[0]].concat(pts, [pts[pts.length - 1]]);
      var d = "M" + pts[0][0].toFixed(0) + "," + pts[0][1].toFixed(0) + " ";
      for (var i = 1; i < p.length - 2; i++) {
        var p0 = p[i - 1], p1 = p[i], p2 = p[i + 1], p3 = p[i + 2];
        var c1x = p1[0] + (p2[0] - p0[0]) / 6;
        var c1y = p1[1] + (p2[1] - p0[1]) / 6;
        var c2x = p2[0] - (p3[0] - p1[0]) / 6;
        var c2y = p2[1] - (p3[1] - p1[1]) / 6;
        d += "C" + c1x.toFixed(0) + "," + c1y.toFixed(0) + " " + c2x.toFixed(0) + "," + c2y.toFixed(0) + " " + p2[0].toFixed(0) + "," + p2[1].toFixed(0) + " ";
      }
      return d.trim();
    }

    // A classic decorative wave, hand-tuned with big, varied-amplitude bends
    // (never a uniform repeating sine) running corner to corner. The desktop
    // viewBox (1900x780, ~2.44 aspect) deliberately matches the real wide
    // frame's aspect ratio instead of the old, much-more-square 1650x1350 —
    // with "preserveAspectRatio: meet", a viewBox narrower than the frame
    // just gets letterboxed and the wave ends up squeezed into a centered
    // column rather than stretching edge to edge. More points than there
    // are senses (13 on desktop, 12 on mobile) so the curve reads as a
    // textured, organic line rather than a handful of big sweeping arcs;
    // 5 of them are picked out as the sense waypoints.
    var journeyLayouts = {
      desktop: {
        viewBox: "0 0 1900 780",
        points: [
          [20, 40], [176, 15], [330, 260], [485, 90], [640, 340],
          [795, 190], [950, 470], [1105, 330], [1260, 590], [1415, 420],
          [1570, 650], [1725, 540], [1880, 750]
        ],
        markerIndexes: [0, 3, 6, 9, 12]
      },
      mobile: {
        viewBox: "0 0 540 1500",
        points: [
          [30, 40], [280, 110], [470, 300], [230, 430], [60, 560],
          [280, 700], [480, 830], [260, 1000], [50, 1130], [260, 1300],
          [460, 1420], [510, 1470]
        ],
        markerIndexes: [0, 3, 6, 8, 11]
      }
    };
    Object.keys(journeyLayouts).forEach(function (key) {
      var layout = journeyLayouts[key];
      layout.markers = layout.markerIndexes.map(function (i) { return layout.points[i]; });
    });

    // Finds, for a given (x,y) waypoint, how far along the drawn path (as a
    // 0..1 fraction of its total length) that point actually sits — by sampling
    // the real curve rather than assuming the 5 waypoints are evenly spaced by
    // arc length (they aren't, once a wave offset is added). This is what lets
    // the card appear exactly when the line reaches the dot, not before.
    function fractionAtPoint(path, totalLength, target) {
      var bestFrac = 0;
      var bestDist = Infinity;
      var samples = 500;
      for (var s = 0; s <= samples; s++) {
        var len = (totalLength * s) / samples;
        var pt = path.getPointAtLength(len);
        var dx = pt.x - target[0];
        var dy = pt.y - target[1];
        var dist = dx * dx + dy * dy;
        if (dist < bestDist) {
          bestDist = dist;
          bestFrac = len / totalLength;
        }
      }
      return bestFrac;
    }

    var journeyPathLength = 0;
    var journeyIsMobileLayout = null;
    var journeyWaypointFractions = [];

    function applyJourneyLayout() {
      var isMobile = window.innerWidth < 700;
      if (isMobile === journeyIsMobileLayout) return;
      journeyIsMobileLayout = isMobile;

      var layout = isMobile ? journeyLayouts.mobile : journeyLayouts.desktop;
      var d = catmullRomToBezierD(layout.points);
      journeySvg.setAttribute("viewBox", layout.viewBox);
      journeyPath.setAttribute("d", d);
      journeyPathBg.setAttribute("d", d);
      journeyDotGroups.forEach(function (g, i) {
        var pt = layout.markers[i];
        g.querySelector("circle").setAttribute("cx", pt[0]);
        g.querySelector("circle").setAttribute("cy", pt[1]);
        g.querySelector("text").setAttribute("x", pt[0]);
        g.querySelector("text").setAttribute("y", pt[1] + 1);
      });

      journeyPathLength = journeyPath.getTotalLength();
      journeyPath.style.strokeDasharray = String(journeyPathLength);
      journeyPath.style.strokeDashoffset = String(journeyPathLength);

      journeyWaypointFractions = layout.markers.map(function (pt) {
        return fractionAtPoint(journeyPath, journeyPathLength, pt);
      });
    }

    applyJourneyLayout();

    var journeyActiveIndex = -1;
    var journeyMaxReached = 0;
    var journeyTicking = false;
    var journeyDwellSpan = 0.05;

    function setJourneyCard(index) {
      var s = journeySenses[index];
      journeyCardIcon.innerHTML = s.icon;
      journeyCardNum.textContent = "0" + (index + 1);
      journeyCardTitle.textContent = s.title;
      journeyCardDesc.textContent = s.desc;
    }

    function updateJourney() {
      var rect = sensesJourney.getBoundingClientRect();
      var total = rect.height - window.innerHeight;
      var scrolled = -rect.top;
      var progress = total > 0 ? Math.min(1, Math.max(0, scrolled / total)) : 0;

      journeyPath.style.strokeDashoffset = String(journeyPathLength * (1 - progress));

      // The card only opens once the drawn line has actually arrived at a
      // waypoint (progress >= its fraction) and stays for a short window
      // after — never while the line is still travelling toward it.
      var n = journeySenses.length;
      var activeIndex = -1;
      for (var i = 0; i < n; i++) {
        var start = journeyWaypointFractions[i];
        var isLast = i === n - 1;
        // The last waypoint sits at the very end of the drawn path (fraction 1),
        // so it simply stays open once reached — there is no "next" to leave
        // room before. A small tolerance covers the fact that real scroll
        // positions rarely land on exactly 1 due to rounding.
        var inWindow = isLast
          ? progress >= start - 0.015
          : progress >= start && progress < Math.min(start + journeyDwellSpan, journeyWaypointFractions[i + 1] - 0.01);
        if (inWindow) {
          activeIndex = i;
          break;
        }
      }

      if (activeIndex !== journeyActiveIndex) {
        journeyActiveIndex = activeIndex;
        if (activeIndex >= 0) {
          setJourneyCard(activeIndex);
          journeyCard.classList.add("is-visible");
          if (activeIndex + 1 > journeyMaxReached) {
            journeyMaxReached = activeIndex + 1;
            journeyCount.textContent = String(journeyMaxReached);
          }
        } else {
          journeyCard.classList.remove("is-visible");
        }
      }

      journeyDotGroups.forEach(function (g, i) {
        // Small tolerance so the last dot still lights up at the literal bottom of
        // the page, where sub-pixel rounding can leave progress just short of 1.
        g.classList.toggle("is-lit", progress >= journeyWaypointFractions[i] - 0.01);
        g.classList.toggle("is-active", i === activeIndex);
      });

      journeyTicking = false;
    }

    window.addEventListener(
      "scroll",
      function () {
        if (!journeyTicking) {
          window.requestAnimationFrame(updateJourney);
          journeyTicking = true;
        }
      },
      { passive: true }
    );

    var journeyResizeTimer = null;
    window.addEventListener("resize", function () {
      clearTimeout(journeyResizeTimer);
      journeyResizeTimer = setTimeout(function () {
        applyJourneyLayout();
        updateJourney();
      }, 200);
    });

    setJourneyCard(0);
    updateJourney();
  }

  /* ---------- Engagements: hover lines with a cursor-following description card ---------- */
  var engagementLines = Array.prototype.slice.call(document.querySelectorAll(".engagement-line"));
  var engagementCard = document.getElementById("engagementHoverCard");

  if (engagementLines.length && engagementCard) {
    var engagementCardNum = engagementCard.querySelector(".num");
    var engagementCardDesc = engagementCard.querySelector("p");
    var noHover = window.matchMedia("(hover: none)").matches;
    var engagementCardW = 0;
    var engagementCardH = 0;
    var engagementMoveTicking = false;
    var engagementMouseX = 0;
    var engagementMouseY = 0;

    function positionEngagementCard(x, y) {
      var px = Math.min(window.innerWidth - engagementCardW - 16, Math.max(16, x - engagementCardW / 2));
      var py = Math.min(window.innerHeight - engagementCardH - 16, Math.max(16, y - engagementCardH - 28));
      engagementCard.style.transform = "translate(" + px + "px, " + py + "px)";
    }

    function scheduleEngagementMove(x, y) {
      engagementMouseX = x;
      engagementMouseY = y;
      if (!engagementMoveTicking) {
        window.requestAnimationFrame(function () {
          positionEngagementCard(engagementMouseX, engagementMouseY);
          engagementMoveTicking = false;
        });
        engagementMoveTicking = true;
      }
    }

    function fillEngagementCard(line) {
      engagementCardNum.textContent = line.getAttribute("data-num");
      engagementCardDesc.textContent = line.getAttribute("data-desc");
      // Measured once per reveal (not on every mousemove) to avoid forced layout on each frame
      engagementCardW = engagementCard.offsetWidth || 320;
      engagementCardH = engagementCard.offsetHeight || 100;
    }

    function closeEngagementCard() {
      engagementCard.classList.remove("is-visible", "is-centered");
      engagementLines.forEach(function (l) { l.classList.remove("is-active"); });
    }

    engagementLines.forEach(function (line) {
      if (!noHover) {
        line.addEventListener("mouseenter", function (e) {
          line.classList.add("is-active");
          engagementCard.classList.add("is-visible");
          fillEngagementCard(line);
          positionEngagementCard(e.clientX, e.clientY);
        });
        line.addEventListener("mousemove", function (e) {
          scheduleEngagementMove(e.clientX, e.clientY);
        });
        line.addEventListener("mouseleave", function () {
          closeEngagementCard();
        });
      }

      line.addEventListener("click", function () {
        if (!noHover) return;
        var wasActive = line.classList.contains("is-active");
        closeEngagementCard();
        if (!wasActive) {
          fillEngagementCard(line);
          line.classList.add("is-active");
          engagementCard.classList.add("is-visible", "is-centered");
        }
      });

      line.addEventListener("focus", function () {
        fillEngagementCard(line);
        line.classList.add("is-active");
        engagementCard.classList.add("is-visible", "is-centered");
      });
      line.addEventListener("blur", function () {
        closeEngagementCard();
      });
    });
  }

  /* ---------- Projets: seamless draggable mosaic ---------- */
  var mosaicViewport = document.getElementById("mosaicViewport");

  if (mosaicViewport) {
    var mosaicTrack = document.getElementById("mosaicTrack");
    var mosaicHint = document.getElementById("mosaicHint");
    /* Ordre volontairement mélangé : on évite de mettre deux photos du même
       univers (véhicule/stand, nourriture, table/déco, boisson...) côte à
       côte pour que le défilement de la mosaïque reste varié. */
    var mosaicImagesBase = [
      { src: "assets/img/evenement-vespas-vintage.jpg", caption: "Vespas vintage" },
      { src: "assets/img/evenement-buffet-bruschetta.jpg", caption: "Buffet bruschetta et charcuterie" },
      { src: "assets/img/evenement-table-fleurs-legumes.jpg", caption: "Table dressée, fleurs et légumes de saison" },
      { src: "assets/img/evenement-fiat500-blanche.jpg", caption: "Fiat 500 blanche" },
      { src: "assets/img/evenement-rangee-spritz.jpg", caption: "L'heure du spritz" },
      { src: "assets/img/evenement-tablee-diner-bougies.jpg", caption: "Tablée aux chandelles" },
      { src: "assets/img/evenement-fiat-jolly-jaune.jpg", caption: "Fiat Jolly jaune" },
      { src: "assets/img/evenement-canapes-tartelettes.jpg", caption: "Canapés et tartelettes" },
      { src: "assets/img/evenement-lampe-rotin-citrons.jpg", caption: "Lampe en rotin et détails citron" },
      { src: "assets/img/evenement-chariot-gelato-blanc.jpg", caption: "Chariot glacier, ombrelle blanche" },
      { src: "assets/img/evenement-ceramiques-citrons.jpg", caption: "Céramiques et citrons" },
      { src: "assets/img/evenement-bar-a-burrata.jpg", caption: "Bar à burrata" },
      { src: "assets/img/evenement-fiat500-creme-mur-pierre.jpg", caption: "Fiat 500 crème" },
      { src: "assets/img/evenement-sanpellegrino-verres.jpg", caption: "Verres et Sanpellegrino" },
      { src: "assets/img/evenement-vases-oranges-fleurs.jpg", caption: "Vases d'oranges et fleurs des champs" },
      { src: "assets/img/evenement-stand-raye-guirlande.jpg", caption: "Stand rayé et guirlande lumineuse" },
      { src: "assets/img/evenement-illustration-dolce-vita.jpg", caption: "Illustration La Dolce Vita" },
      { src: "assets/img/evenement-planche-charcuterie.jpg", caption: "Planche de charcuterie" },
      { src: "assets/img/evenement-tomates-bougeoir.jpg", caption: "Tomates et bougeoir laiton" },
      { src: "assets/img/evenement-vespa-gelato-brindapino.jpg", caption: "Vespa glacier Brindapino" },
      { src: "assets/img/evenement-cave-barolo.jpg", caption: "Cave à Barolo" },
      { src: "assets/img/evenement-plateau-agrumes.jpg", caption: "Plateau d'agrumes" },
      { src: "assets/img/evenement-triporteur-gelato.jpg", caption: "Triporteur à glaces" },
      { src: "assets/img/evenement-bruschetta-burrata-jardin.jpg", caption: "Bruschetta burrata au jardin" },
      { src: "assets/img/evenement-assiette-agrume-ceramique.jpg", caption: "Marque-place céramique et kumquat" },
      { src: "assets/img/evenement-carte-degustation.jpg", caption: "Carte à déguster, en terrasse" },
      { src: "assets/img/evenement-illustration-cincin.jpg", caption: "Illustration Cin Cin" }
    ];
    /* Chaque photo apparaît exactement deux fois : on double la séquence
       telle quelle. Les deux occurrences d'une même photo se retrouvent
       ainsi à 27 tuiles d'écart (jamais côte à côte ni même proches), et
       l'alternance des univers reste valable aussi à la jointure. */
    var mosaicImages = mosaicImagesBase.concat(mosaicImagesBase);

    var TILE = window.innerWidth < 640 ? 130 : 240;
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
        TILE = window.innerWidth < 640 ? 130 : 240;
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
  var serviceRadios = document.querySelectorAll('input[name="serviceType"]');
  if (serviceRadios.length) {
    var params = new URLSearchParams(window.location.search);
    var wanted = params.get("service");
    if (wanted) {
      serviceRadios.forEach(function (radio) {
        radio.checked = radio.value === wanted;
      });
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
