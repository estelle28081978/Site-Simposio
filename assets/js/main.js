(function () {
  "use strict";

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Scrollbar width compensation ---------- */
  /* Sur un navigateur à scrollbar "classique" (réservant de la place —
     ex. Safari/Chrome sur Mac avec une souris branchée, ou Windows par
     défaut), le contenu centré via `margin-inline:auto` se centre par
     rapport à `clientWidth` (qui EXCLUT la scrollbar), donc légèrement
     décalé par rapport à la fenêtre RÉELLE que l'œil perçoit — repéré par
     la cliente via capture d'écran Safari (écart visible entre la 1ʳᵉ
     donnée du bandeau chiffres clés et le bord gauche vs. la 4ᵉ donnée et
     la scrollbar à droite). Invisible dans cet environnement de
     développement (Chromium headless utilise des scrollbars overlay, sans
     réservation d'espace). Corrigé de façon ciblée (pas via
     `scrollbar-gutter` sur `html`, qui introduirait une marge crème
     permanente sur TOUTES les sections plein-bleed du site — bien plus
     large que ce qui a été demandé) : la largeur réelle de la scrollbar
     est mesurée et exposée en variable CSS `--scrollbar-w`, utilisée
     uniquement par `.stats-band-grid` (cf. `style.css`) pour se recaler
     par rapport à la fenêtre réelle sans toucher au reste du site. */
  function updateScrollbarWidth() {
    var w = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.setProperty("--scrollbar-w", w + "px");
  }
  updateScrollbarWidth();
  window.addEventListener("resize", updateScrollbarWidth);

  /* ---------- Fondus de fond localisés au scroll (2026-09-02) ---------- */
  /* Remplace ENTIÈREMENT le mécanisme précédent (un calque de fond unique
     `#pageBgLayer`, partagé par toute une page voire plusieurs pages —
     historique complet des nombreuses itérations dans CLAUDE.md) : la
     cliente a demandé de retirer l'effet partout SAUF sur 3 sections
     précises — "Nos prestations / Quatre mondes, une même Dolce Vita"
     (`.teaser`, accueil), la citation de la fondatrice (`.founder`, À
     propos) et "Questions fréquentes" (`.contact-faq`, Contact) — avec un
     déclencheur explicite : la couleur définitive doit être atteinte au
     moment où le HAUT de la section atteint le MILIEU de l'écran (pas un
     simple passage de frontière entre deux sections comme avant).
     **Précision de la cliente (même jour)** : la 1ʳᵉ version de cette
     consigne demandait le bas de la section, corrigée en haut de section
     juste après — si `rect.bottom` réapparaît dans `update()` ci-dessous
     à la place de `rect.top`, c'est ce 1er réglage, à ne pas réintroduire
     sans qu'on le redemande. Plus de calque fixe partagé ni de repères
     inter-sections nécessaires pour ça : chaque section porte directement
     sa PROPRE couleur de fond, recalculée à chaque frame de scroll à
     partir de sa seule position — trois petits fondus indépendants plutôt
     qu'un système de fond de page unique. `#pageBgLayer` (le `<div>`,
     dans les 5 pages) et `body.home`/`body.page-X` (les classes de
     scoping du mécanisme précédent) sont retirés du HTML, désormais
     inutiles.
     `initScrollFade(el, fromRgb, toRgb)` : `progress` vaut 0 quand le haut
     de `el` touche le bas du viewport (la section commence tout juste à
     apparaître) et 1 quand son haut atteint le milieu du viewport (consigne
     explicite de la cliente) — au-delà, la couleur reste figée à `toRgb`
     (`Math.max(0, Math.min(1, …))` la borne des deux côtés, donc revenir
     en arrière au scroll refait aussi refondre vers `fromRgb`, cohérent
     avec tous les autres effets scroll-liés bidirectionnels du site).
     Recalcule `getBoundingClientRect()` à chaque frame (pas de cache),
     même précaution que l'ancien mécanisme. `data-tone` est posé
     directement sur l'ÉLÉMENT LUI-MÊME (pas sur `body` comme avant,
     inutile désormais vu que chaque fondu est autonome) et lu par les
     règles `.teaser[data-tone]`/`.founder[data-tone]`/
     `.contact-faq[data-tone]` dans `style.css` pour l'adaptation du texte
     (mêmes classes `.bg-adaptive-*` que le mécanisme précédent, juste
     rescopées à la section plutôt qu'à `body`). */
  /* Fraction de la hauteur du viewport (depuis le haut) où le haut de la
     section doit se trouver pour que la couleur définitive soit atteinte.
     Passée de 0.5 (milieu de l'écran) à 0.75 (trois quarts de l'écran) le
     même jour, à l'essai ("j'aimerais que tu essayes") — la couleur
     définitive est donc désormais atteinte plus tôt dans le scroll (le
     haut de section n'a plus qu'un quart de la hauteur du viewport à
     parcourir, contre la moitié avant, pour que `progress` passe de 0 à
     1). Si `0.5` réapparaît ici, c'est le réglage précédent, à ne pas
     réintroduire sans qu'on le redemande. */
  var SCROLL_FADE_TRIGGER_FRACTION = 0.75;

  function initScrollFade(el, fromRgb, toRgb) {
    if (!el) return;

    function update() {
      var rect = el.getBoundingClientRect();
      var vh = window.innerHeight;
      var triggerY = vh * SCROLL_FADE_TRIGGER_FRACTION;
      var progress = (vh - rect.top) / (vh - triggerY);
      /* Filet de sécurité pour une section proche du bas de la page (ex.
         `.contact-faq`, suivie d'un footer plus court que le reste de la
         distance de scroll qu'il faudrait pour que son propre haut
         atteigne géométriquement ce repère) : sans ce filet, `progress`
         pourrait rester bloqué sous 1 même une fois arrivé tout en bas de
         la page — la couleur définitive ne serait alors jamais atteinte
         (même défaut déjà rencontré et corrigé une 1ʳᵉ fois avec le
         déclencheur basé sur `rect.bottom`, cf. historique juste
         au-dessus — conservé par précaution). Dès que la page ne peut
         plus défiler (`scrollY` à son maximum), on force `progress` à 1. */
      var maxScrollY = document.documentElement.scrollHeight - window.innerHeight;
      if (window.scrollY >= maxScrollY - 1) progress = 1;
      progress = Math.max(0, Math.min(1, progress));
      var r = Math.round(fromRgb[0] + (toRgb[0] - fromRgb[0]) * progress);
      var g = Math.round(fromRgb[1] + (toRgb[1] - fromRgb[1]) * progress);
      var b = Math.round(fromRgb[2] + (toRgb[2] - fromRgb[2]) * progress);
      el.style.backgroundColor = "rgb(" + r + "," + g + "," + b + ")";
      var luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      el.dataset.tone = luminance < 0.6 ? "dark" : "light";
    }

    var ticking = false;
    function request() {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          update();
          ticking = false;
        });
        ticking = true;
      }
    }
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    document.fonts && document.fonts.ready && document.fonts.ready.then(request);
    update();
  }

  /* Couleurs reprises telles quelles de la palette de marque fixe (aucune
     valeur inventée) : bleu Méditerranéen `--navy` (28,59,74) et blanc
     calcaire `--bg`/`--cream` (246,241,231) pour "Quatre mondes..." (demande
     explicite : "l'effet fasse la couleur bleue à blanc") ; bleu
     Méditerranéen le plus sombre `--navy-900` (16,31,39, la teinte
     RÉELLEMENT visible derrière la photo de l'équipe juste au-dessus dans
     la page) vers `--bg` pour la citation de la fondatrice ; crème-dim
     `--bg-dim` (236,227,209, la teinte de `.contact-devis` juste au-dessus)
     vers `--navy-900` pour les questions fréquentes. */
  initScrollFade(document.querySelector(".teaser"), [28, 59, 74], [246, 241, 231]);
  initScrollFade(document.querySelector(".founder"), [16, 31, 39], [246, 241, 231]);
  initScrollFade(document.querySelector(".contact-faq"), [236, 227, 209], [16, 31, 39]);

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

    // A big zigzag/snake — each segment sweeps almost the full width of the
    // frame before reversing direction, while y is strictly increasing
    // point to point (never doubles back vertically), which is what
    // guarantees the drawn curve can never cross itself. Reference: a
    // hand-sketched zigzag the client provided, reproduced here as 7 wide
    // alternating swings rather than the many small bumps used before. The
    // desktop viewBox (1900x850, ~2.24 aspect) matches the real wide
    // frame's aspect ratio — with "preserveAspectRatio: meet", a viewBox
    // narrower than the frame just gets letterboxed and the path ends up
    // squeezed into a centered column rather than stretching edge to edge.
    var journeyLayouts = {
      desktop: {
        viewBox: "0 0 1900 850",
        points: [
          [1410, 79], [1672, 217], [602, 315], [1497, 483],
          [201, 611], [1298, 750], [1058, 794]
        ],
        markerIndexes: [0, 2, 3, 4, 6]
      },
      mobile: {
        viewBox: "0 0 540 1500",
        points: [
          [350, 60], [510, 220], [110, 400], [480, 620],
          [60, 850], [460, 1100], [250, 1450]
        ],
        markerIndexes: [0, 2, 3, 4, 6]
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
        } else {
          journeyCard.classList.remove("is-visible");
        }
      }

      // Counted independently from the card's dwell window (same fraction
      // check as the dots below): a fast scroll — scrollbar dragged straight
      // to the bottom, Page Down mashed repeatedly — can jump clean over a
      // narrow dwell window without ever triggering activeIndex for it, which
      // left the "X/5 sens découverts" counter stuck below 5 even once the
      // path was fully drawn and every dot lit. Tying it to progress instead
      // keeps it consistent with the dots in every case.
      var reachedCount = 0;
      for (var j = 0; j < n; j++) {
        if (progress >= journeyWaypointFractions[j] - 0.01) reachedCount = j + 1;
      }
      if (reachedCount > journeyMaxReached) {
        journeyMaxReached = reachedCount;
        journeyCount.textContent = String(journeyMaxReached);
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

  /* ---------- Engagements: flip-cards with click-to-flip + scroll parallax/scale ---------- */
  var engagementCards = Array.prototype.slice.call(document.querySelectorAll(".engagement-card"));

  if (engagementCards.length) {
    // Click-to-flip: state lives on aria-expanded (both the CSS trigger and
    // the accessible state), no separate class needed.
    engagementCards.forEach(function (card) {
      var btn = card.querySelector(".engagement-card-flip");
      if (!btn) return;
      btn.addEventListener("click", function () {
        var expanded = btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute("aria-expanded", String(!expanded));
      });
    });

    // Scroll-driven scale + parallax. Deliberately never touches
    // .engagement-card-inner (the flip element) — scale lives on the <li>,
    // the image/text parallax offsets live on two other inner elements, so
    // none of this ever fights the CSS rotateY() transition on click.
    var engagementReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var engagementCardParts = engagementCards.map(function (card) {
      return {
        card: card,
        img: card.querySelector(".engagement-card-front-img"),
        content: card.querySelector(".engagement-card-front-content"),
      };
    });

    function updateEngagementCards() {
      var vh = window.innerHeight;
      engagementCardParts.forEach(function (parts) {
        var rect = parts.card.getBoundingClientRect();
        if (rect.bottom < -200 || rect.top > vh + 200) return; // skip offscreen cards
        var center = rect.top + rect.height / 2;
        var delta = center - vh / 2; // negative above viewport center, positive below
        var progress = Math.max(0, 1 - Math.abs(delta) / (vh * 0.7));
        var scale = 0.94 + 0.06 * progress;
        parts.card.style.transform = "scale(" + scale.toFixed(3) + ")";
        if (parts.img) {
          parts.img.style.transform = "translateY(" + (delta * -0.08).toFixed(1) + "px)";
        }
        if (parts.content) {
          parts.content.style.transform = "translateY(" + (delta * -0.035).toFixed(1) + "px)";
        }
      });
    }

    if (engagementReducedMotion) {
      // Still a scroll-linked 1:1 effect (not autoplay), so it would normally
      // stay active under reduced motion per site convention — but here it's
      // purely decorative scale/parallax with no informational role, so it's
      // skipped outright for a calmer static grid instead.
    } else {
      var engagementTicking = false;
      window.addEventListener(
        "scroll",
        function () {
          if (!engagementTicking) {
            window.requestAnimationFrame(function () {
              updateEngagementCards();
              engagementTicking = false;
            });
            engagementTicking = true;
          }
        },
        { passive: true }
      );
      window.addEventListener("resize", updateEngagementCards);
      updateEngagementCards();
    }
  }

  /* ---------- Engagements: équipe — stage photo + sélecteur de cercles (2026-08-19) ----------
     Un cercle-avatar cliqué bascule .is-active sur trois groupes en
     parallèle (avatars, photos, panneaux de texte), tous les trois
     repérés par le même data-talent-target — un seul clic suffit à
     resynchroniser la photo de fond et le texte affiché. */
  var talentStage = document.querySelector(".talent-stage");
  if (talentStage) {
    var talentAvatars = Array.prototype.slice.call(talentStage.querySelectorAll(".talent-stage-avatar"));
    var talentPhotos = Array.prototype.slice.call(talentStage.querySelectorAll(".talent-stage-photo"));
    var talentPanels = Array.prototype.slice.call(talentStage.querySelectorAll(".talent-stage-panel"));

    talentAvatars.forEach(function (avatar) {
      avatar.addEventListener("click", function () {
        var target = avatar.getAttribute("data-talent-target");
        talentAvatars.forEach(function (a) {
          var active = a === avatar;
          a.classList.toggle("is-active", active);
          a.setAttribute("aria-selected", String(active));
        });
        talentPhotos.forEach(function (p) {
          p.classList.toggle("is-active", p.getAttribute("data-talent-target") === target);
        });
        talentPanels.forEach(function (p) {
          p.classList.toggle("is-active", p.getAttribute("data-talent-target") === target);
        });
      });
    });
  }

  /* ---------- Prestations: panneaux "En savoir plus" par formule (2026-08-19) ----------
     Chaque `[data-more-toggle]` ouvre/ferme son propre `[data-more-panel]`
     (relié par `aria-controls`/`id`) — indépendant d'une formule à l'autre,
     donc pas de fermeture croisée nécessaire entre les 4 panneaux. Fermeture
     par re-clic sur le déclencheur, par le bouton dédié `[data-more-close]`,
     ou par Échap (clavier) une fois un panneau ouvert. */
  var moreToggles = Array.prototype.slice.call(document.querySelectorAll("[data-more-toggle]"));
  if (moreToggles.length) {
    moreToggles.forEach(function (toggle) {
      var panel = document.getElementById(toggle.getAttribute("aria-controls"));
      if (!panel) return;
      var closeBtn = panel.querySelector("[data-more-close]");

      function closePanel() {
        panel.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
      function openPanel() {
        panel.classList.add("is-open");
        toggle.setAttribute("aria-expanded", "true");
      }

      toggle.addEventListener("click", function () {
        if (panel.classList.contains("is-open")) {
          closePanel();
        } else {
          openPanel();
        }
      });
      if (closeBtn) closeBtn.addEventListener("click", closePanel);
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && panel.classList.contains("is-open")) closePanel();
      });
    });
  }

  /* ---------- Engagements: valeurs — album filmique horizontal (2026-08-17) ----------
     Remplace l'ancien carrousel de texte façon "paroles" (voir CLAUDE.md pour
     l'historique complet des 13 itérations précédentes) par un mécanisme
     différent : un long wrapper épinglé (même principe que .senses-journey :
     position:sticky + progress = scroll traversé ÷ distance totale), mais au
     lieu de faire défiler du texte verticalement, le scroll fait glisser
     HORIZONTALEMENT une bande de 6 scènes plein cadre (`.values-reel-track`,
     large de 600% pour 6 enfants de 100%/6 chacun) — comme un album/pellicule
     qu'on fait défiler photo par photo. `translateX` est appliqué directement
     en JS à chaque frame de scroll, jamais via une transition CSS : c'est un
     mapping 1:1 avec la position de scroll, pas une animation autoplay, donc
     ça reste cohérent même sous `prefers-reduced-motion` sans traitement
     spécial (même logique que le tracé SVG des 5 sens).
     activeIndex = arrondi de `progress × (n-1)` (pas `× n` comme l'ancien
     carrousel) car il y a n-1 intervalles entre n scènes disposées bord à
     bord — avec `× n` le dernier index ne serait quasiment jamais atteint
     pile à progress=1. */
  var valuesSection = document.getElementById("valuesSection");
  var valuesReelTrack = document.getElementById("valuesReelTrack");
  var valuesReelViewport = document.querySelector(".values-reel-viewport");
  var valuesReelScenes = document.querySelectorAll(".values-reel-scene");
  var valuesReelHint = document.getElementById("valuesReelHint");
  var valuesReelTimeline = document.getElementById("valuesReelTimeline");
  var valuesReelFill = document.getElementById("valuesReelFill");
  var valuesReelMarkers = document.querySelectorAll(".values-reel-marker");
  var valuesReelThreadFill = document.getElementById("valuesReelThreadFill");
  var valuesReelThreadMarker = document.getElementById("valuesReelThreadMarker");
  if (valuesSection && valuesReelTrack && valuesReelViewport && valuesReelScenes.length) {
    var vn = valuesReelScenes.length;
    // Pixel-based, not %: a `%` in translateX() resolves against the
    // element's OWN box (the track is 600% wide), not the viewport — using
    // "-progress×(n-1)×100%" moved the track by up to 6× too far, pushing
    // every scene past the visible area (confirmed via a bounding-rect
    // dump: at progress≈0.2 every scene's rect sat off past x=-1600, none
    // near x=0). Measuring the viewport's real pixel width sidesteps that
    // percentage-of-self gotcha entirely.
    var valuesReelSceneWidth = valuesReelViewport.getBoundingClientRect().width;
    window.addEventListener("resize", function () {
      valuesReelSceneWidth = valuesReelViewport.getBoundingClientRect().width;
    });

    function setValuesReelIndex(activeIndex) {
      valuesReelScenes.forEach(function (scene, i) {
        scene.classList.toggle("is-active", i === activeIndex);
      });
      valuesReelMarkers.forEach(function (marker, i) {
        marker.classList.toggle("is-active", i === activeIndex);
        marker.classList.toggle("is-reached", i <= activeIndex);
      });
    }

    function scrollToProgress(p, smooth) {
      var rect = valuesSection.getBoundingClientRect();
      var total = rect.height - window.innerHeight;
      var targetY = window.scrollY + rect.top + p * total;
      window.scrollTo({ top: targetY, behavior: smooth && !reducedMotion ? "smooth" : "auto" });
    }

    function updateValuesReel() {
      var rect = valuesSection.getBoundingClientRect();
      var total = rect.height - window.innerHeight;
      var scrolled = -rect.top;
      var progress = total > 0 ? Math.min(1, Math.max(0, scrolled / total)) : 0;
      var activeIndex = Math.min(vn - 1, Math.round(progress * (vn - 1)));
      valuesReelTrack.style.transform = "translateX(-" + progress * (vn - 1) * valuesReelSceneWidth + "px)";
      setValuesReelIndex(activeIndex);
      if (valuesReelFill) valuesReelFill.style.width = progress * 100 + "%";
      // Thread fill/marker track the exact same continuous progress as the
      // timeline below — one shared value driving both, so they always
      // read as the same journey rather than two independently-synced bars.
      if (valuesReelThreadFill) valuesReelThreadFill.style.width = progress * 100 + "%";
      if (valuesReelThreadMarker) valuesReelThreadMarker.style.left = progress * 100 + "%";
      if (valuesReelHint) valuesReelHint.classList.toggle("is-visible", progress < 0.03);
      vTicking = false;
    }

    // translateX is a direct 1:1 mapping of scroll position, not an autoplay
    // animation, so it stays active under prefers-reduced-motion too (same
    // reasoning as the 5-senses SVG path) — only the decorative Ken Burns
    // zoom and hint bounce are disabled for that preference, in CSS.
    var vTicking = false;
    window.addEventListener(
      "scroll",
      function () {
        if (!vTicking) {
          window.requestAnimationFrame(updateValuesReel);
          vTicking = true;
        }
      },
      { passive: true }
    );
    updateValuesReel();

    // Markers double as a jump-to-value control: a discrete, smooth-scrolled
    // hop straight to the point in the pinned wrapper where that scene
    // becomes active.
    valuesReelMarkers.forEach(function (marker, i) {
      marker.addEventListener("click", function () {
        scrollToProgress(i / (vn - 1), true);
      });
    });

    // Dragging anywhere else along the timeline ("tourner" through the
    // values) scrubs continuously: the fill/photo track the pointer 1:1,
    // unsmoothed, so there's no lag chasing a fast drag. setPointerCapture
    // keeps move events coming even if the pointer strays outside the
    // (fairly small) timeline bar mid-drag.
    if (valuesReelTimeline) {
      var timelineDragging = false;
      function timelineProgressFromEvent(e) {
        var rect = valuesReelTimeline.getBoundingClientRect();
        return Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
      }
      valuesReelTimeline.addEventListener("pointerdown", function (e) {
        if (e.target.closest(".values-reel-marker")) return;
        timelineDragging = true;
        valuesReelTimeline.setPointerCapture(e.pointerId);
        scrollToProgress(timelineProgressFromEvent(e), false);
      });
      valuesReelTimeline.addEventListener("pointermove", function (e) {
        if (!timelineDragging) return;
        scrollToProgress(timelineProgressFromEvent(e), false);
      });
      valuesReelTimeline.addEventListener("pointerup", function () {
        timelineDragging = false;
      });
      valuesReelTimeline.addEventListener("pointercancel", function () {
        timelineDragging = false;
      });
    }
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

  /* ---------- Projets: jump-to-top / jump-to-bottom buttons ---------- */
  var scrollTopBtn = document.getElementById("scrollTopBtn");
  var scrollBottomBtn = document.getElementById("scrollBottomBtn");
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
    });
  }
  if (scrollBottomBtn) {
    scrollBottomBtn.addEventListener("click", function () {
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: reducedMotion ? "auto" : "smooth" });
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

  // Fondatrice : la section est redevenue une simple citation typographique
  // (voir .founder-minimal dans engagements.html/style.css) — plus de vidéo
  // à piloter ici. L'ancien bloc de lecture/autoplay (vidéo + bouton de
  // secours) a été retiré ; les fichiers vidéo restent dans
  // assets/video/ pour une réactivation future si demandée.
})();
