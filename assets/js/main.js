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
  var promiseSection = document.querySelector(".promise");
  var promiseQuote = document.getElementById("promiseQuote");

  if (promiseSection && promiseQuote && !reducedMotion) {
    var words = Array.prototype.slice.call(promiseQuote.querySelectorAll(".word"));
    var pTicking = false;

    function updatePromise() {
      var rect = promiseSection.getBoundingClientRect();
      var vh = window.innerHeight;
      // progress 0 -> section top enters viewport bottom, 1 -> section bottom leaves viewport top
      var total = rect.height + vh;
      var traveled = vh - rect.top;
      var progress = Math.min(1, Math.max(0, traveled / total));
      // Map the middle 70% of the scroll range to the word reveal for a comfortable read
      var reveal = Math.min(1, Math.max(0, (progress - 0.12) / 0.6));
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

  /* ---------- Senses: sticky visual synced to active row ---------- */
  var sensesList = document.getElementById("sensesList");
  var sensesVisual = document.getElementById("sensesVisual");

  if (sensesList && sensesVisual && "IntersectionObserver" in window) {
    var rows = Array.prototype.slice.call(sensesList.querySelectorAll(".sense-row"));
    var icons = Array.prototype.slice.call(sensesVisual.querySelectorAll(".icon"));

    function setActiveSense(index) {
      rows.forEach(function (row) {
        row.classList.toggle("is-active", row.getAttribute("data-index") === String(index));
      });
      icons.forEach(function (icon) {
        var match = icon.getAttribute("data-icon") === String(index);
        icon.classList.toggle("is-active", match);
        icon.classList.toggle("is-hidden", !match);
      });
    }

    var sensesObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            setActiveSense(entry.target.getAttribute("data-index"));
          }
        });
      },
      { threshold: 0.6, rootMargin: "-20% 0px -20% 0px" }
    );
    rows.forEach(function (row) { sensesObserver.observe(row); });
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
