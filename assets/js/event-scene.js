import * as THREE from "./vendor/three/build/three.module.min.js";
import { GLTFLoader } from "./vendor/three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "./vendor/three/examples/jsm/controls/OrbitControls.js";

(function () {
  "use strict";

  var stage = document.getElementById("eventStage");
  var canvas = document.getElementById("eventCanvas");
  if (!stage || !canvas || !window.WebGLRenderingContext) return;

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ==========================================================================
     Renderer / scene / camera
     ========================================================================== */
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(38, 1, 0.05, 100);

  var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  var controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.minDistance = 2.2;
  controls.maxDistance = 9;
  controls.maxPolarAngle = Math.PI * 0.52;
  controls.target.set(0, 0.9, 0);
  controls.autoRotate = !reducedMotion;
  controls.autoRotateSpeed = 1.0;

  scene.add(new THREE.HemisphereLight(0xf6ede0, 0x1c3b4a, 1.2));
  var key = new THREE.DirectionalLight(0xfff2df, 2.3);
  key.position.set(4, 6, 4);
  scene.add(key);
  var fill = new THREE.DirectionalLight(0xc1622d, 0.45);
  fill.position.set(-5, 2, -4);
  scene.add(fill);

  var world = new THREE.Group();
  scene.add(world);

  var ground = new THREE.Mesh(
    new THREE.CircleGeometry(2.4, 48),
    new THREE.MeshBasicMaterial({ map: groundShadowTexture(), transparent: true, depthWrite: false })
  );
  ground.rotation.x = -Math.PI / 2;
  world.add(ground);

  /* ==========================================================================
     Texture helpers (original art, not Brindapino assets)
     ========================================================================== */
  function stripeTexture(colorA, colorB, stripes) {
    var c = document.createElement("canvas");
    c.width = 256;
    c.height = 64;
    var ctx = c.getContext("2d");
    var stepW = c.width / stripes;
    for (var i = 0; i < stripes; i++) {
      ctx.fillStyle = i % 2 === 0 ? colorA : colorB;
      ctx.fillRect(i * stepW, 0, stepW, c.height);
    }
    var tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }
  function fringeTexture(colorA, colorB, teeth) {
    var c = document.createElement("canvas");
    c.width = 256;
    c.height = 48;
    var ctx = c.getContext("2d");
    var stepW = c.width / teeth;
    for (var i = 0; i < teeth; i++) {
      ctx.fillStyle = i % 2 === 0 ? colorA : colorB;
      ctx.beginPath();
      ctx.moveTo(i * stepW, 0);
      ctx.lineTo((i + 1) * stepW, 0);
      ctx.lineTo(i * stepW + stepW / 2, c.height);
      ctx.closePath();
      ctx.fill();
    }
    var tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = THREE.RepeatWrapping;
    return tex;
  }
  function signTexture(line1, line2) {
    var c = document.createElement("canvas");
    c.width = 512;
    c.height = 256;
    var ctx = c.getContext("2d");
    ctx.fillStyle = "#f6f1e7";
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.strokeStyle = "#1c3b4a";
    ctx.lineWidth = 6;
    ctx.strokeRect(10, 10, c.width - 20, c.height - 20);
    ctx.fillStyle = "#1c3b4a";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "72px 'Yeseva One', Georgia, serif";
    ctx.fillText(line1, c.width / 2, c.height / 2 - 18);
    ctx.font = "24px 'Glacial Indifference', Arial, sans-serif";
    ctx.fillStyle = "#c1622d";
    ctx.fillText(line2, c.width / 2, c.height / 2 + 56);
    var tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }
  function groundShadowTexture() {
    var c = document.createElement("canvas");
    c.width = c.height = 256;
    var ctx = c.getContext("2d");
    var grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    grad.addColorStop(0, "rgba(16,31,39,0.3)");
    grad.addColorStop(0.7, "rgba(16,31,39,0.1)");
    grad.addColorStop(1, "rgba(16,31,39,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, c.width, c.height);
    return new THREE.CanvasTexture(c);
  }

  /* ==========================================================================
     Vehicle stand — counter, brass dome, flowers, round fringed umbrella,
     Simposio sign. Inspired by the Brindapino cart aesthetic (round striped
     umbrella, brass accents, florals) but built from scratch and branded
     Simposio — no Brindapino logos, names or photos reused.
     ========================================================================== */
  function buildStand(fit, label, accent) {
    fit = fit || 1;
    var group = new THREE.Group();

    var counterH = 0.52 * fit;
    var poleH = 0.7 * fit;
    var counterW = 1.05 * fit;
    var counterD = 0.5 * fit;

    var counterMat = new THREE.MeshStandardMaterial({ color: 0x6f4a2c, roughness: 0.85, metalness: 0.05 });
    var trimMat = new THREE.MeshStandardMaterial({ color: accent || 0xc1622d, roughness: 0.55, metalness: 0.1 });
    var counter = new THREE.Mesh(new THREE.BoxGeometry(counterW, counterH, counterD), counterMat);
    counter.position.y = counterH / 2;
    group.add(counter);
    var trim = new THREE.Mesh(new THREE.BoxGeometry(counterW + 0.04, 0.05 * fit, counterD + 0.04), trimMat);
    trim.position.y = counterH + 0.025 * fit;
    group.add(trim);

    var brassMat = new THREE.MeshStandardMaterial({ color: 0xc9a15c, roughness: 0.25, metalness: 0.85 });

    /* brass warming domes on the counter */
    [-0.28 * fit, 0.05 * fit].forEach(function (x) {
      var dome = new THREE.Mesh(new THREE.SphereGeometry(0.09 * fit, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2), brassMat);
      dome.position.set(x, counterH + 0.055 * fit, -0.05 * fit);
      group.add(dome);
    });

    /* flower vase */
    var vaseMat = new THREE.MeshStandardMaterial({ color: 0xe0956a, roughness: 0.6 });
    var vase = new THREE.Mesh(new THREE.CylinderGeometry(0.045 * fit, 0.035 * fit, 0.14 * fit, 10), vaseMat);
    vase.position.set(0.38 * fit, counterH + 0.07 * fit, 0.08 * fit);
    group.add(vase);
    var petalColors = [0xf6f1e7, 0xc1622d, 0x9d3636];
    for (var p = 0; p < 7; p++) {
      var petal = new THREE.Mesh(
        new THREE.SphereGeometry(0.028 * fit, 6, 6),
        new THREE.MeshStandardMaterial({ color: petalColors[p % petalColors.length], roughness: 0.8 })
      );
      var ang = (p / 7) * Math.PI * 2;
      petal.position.set(
        0.38 * fit + Math.cos(ang) * 0.05 * fit,
        counterH + 0.16 * fit + Math.random() * 0.03 * fit,
        0.08 * fit + Math.sin(ang) * 0.05 * fit
      );
      group.add(petal);
    }

    /* pole + round fringed umbrella */
    var poleGeo = new THREE.CylinderGeometry(0.02 * fit, 0.02 * fit, poleH, 10);
    var pole = new THREE.Mesh(poleGeo, brassMat);
    pole.position.set(-0.1 * fit, counterH + poleH / 2, 0);
    group.add(pole);

    var canopyR = 0.85 * fit;
    var canopyTex = stripeTexture("#f6f1e7", "#9d3636", 14);
    var canopyMat = new THREE.MeshStandardMaterial({ map: canopyTex, roughness: 0.7, side: THREE.DoubleSide });
    var canopy = new THREE.Mesh(new THREE.ConeGeometry(canopyR, 0.26 * fit, 20, 1, true), canopyMat);
    canopy.position.set(-0.1 * fit, counterH + poleH - 0.03 * fit, 0);
    group.add(canopy);

    var fringeTex = fringeTexture("#f6f1e7", "#9d3636", 20);
    var fringeMat = new THREE.MeshBasicMaterial({ map: fringeTex, transparent: true, side: THREE.DoubleSide });
    var fringe = new THREE.Mesh(new THREE.CylinderGeometry(canopyR * 0.98, canopyR * 0.98, 0.1 * fit, 20, 1, true), fringeMat);
    fringe.position.set(-0.1 * fit, counterH + poleH - 0.16 * fit, 0);
    group.add(fringe);

    /* hanging Simposio sign */
    var signMat = new THREE.MeshStandardMaterial({ map: signTexture("Simposio", label || "DOLCE VITA"), roughness: 0.7 });
    var sign = new THREE.Mesh(new THREE.BoxGeometry(0.6 * fit, 0.3 * fit, 0.022 * fit), signMat);
    sign.position.set(0.15 * fit, counterH + poleH * 0.62, counterD * 0.62);
    sign.rotation.y = -0.35;
    group.add(sign);
    var chainGeo = new THREE.CylinderGeometry(0.006 * fit, 0.006 * fit, poleH * 0.2, 6);
    [-0.12 * fit, 0.42 * fit].forEach(function (x) {
      var chain = new THREE.Mesh(chainGeo, brassMat);
      chain.position.set(x, counterH + poleH * 0.76, counterD * 0.62);
      group.add(chain);
    });

    group.userData.width = counterW;
    return group;
  }

  /* ==========================================================================
     Vehicles
     ========================================================================== */
  var VEHICLES = {
    fiat: { file: "assets/models/fiat-500.glb", realLength: 3.0, label: "LA CARTOLINA", accent: 0xc1622d },
    vespa: { file: "assets/models/vespa.glb", realLength: 1.8, label: "L'APERITIVO", accent: 0x9d3636 },
    triporteur: { file: "assets/models/triporteur.glb", realLength: 1.9, label: "LA TAVOLA", accent: 0x4a1c1c }
  };

  var loader = new GLTFLoader();
  var cache = {};
  var currentKey = null;
  var currentGroup = null;

  var loadingEl = stage.querySelector(".configurator-loading");
  function setLoading(isLoading) {
    if (loadingEl) loadingEl.classList.toggle("is-visible", isLoading);
  }

  function loadVehicle(key) {
    if (key === currentKey) return;
    currentKey = key;
    setLoading(true);

    if (cache[key]) {
      showVehicle(cache[key]);
      return;
    }

    var cfg = VEHICLES[key];
    loader.load(
      cfg.file,
      function (gltf) {
        var obj = gltf.scene;
        var box = new THREE.Box3().setFromObject(obj);
        var size = box.getSize(new THREE.Vector3());
        var horizontal = Math.max(size.x, size.z) || 1;
        var scale = cfg.realLength / horizontal;
        obj.scale.setScalar(scale);

        var box2 = new THREE.Box3().setFromObject(obj);
        var center2 = box2.getCenter(new THREE.Vector3());
        obj.position.x -= center2.x;
        obj.position.z -= center2.z;
        obj.position.y -= box2.min.y;
        var finalSize = box2.getSize(new THREE.Vector3());

        var vGroup = new THREE.Group();
        vGroup.add(obj);

        var fit = Math.max(0.7, Math.min(1.5, finalSize.y / 1.15));
        var stand = buildStand(fit, cfg.label, cfg.accent);
        var sideX = finalSize.x / 2 + 0.55 * fit + 0.3;
        stand.position.set(sideX, 0, finalSize.z * 0.1);
        vGroup.add(stand);

        cache[key] = { group: vGroup, size: finalSize, standX: sideX, fit: fit };
        if (currentKey === key) showVehicle(cache[key]);
      },
      undefined,
      function () {
        setLoading(false);
        var msg = stage.querySelector(".configurator-error");
        if (msg) msg.classList.add("is-visible");
      }
    );
  }

  function showVehicle(entry) {
    if (currentGroup) world.remove(currentGroup);
    currentGroup = entry.group;
    world.add(currentGroup);
    frameCamera(entry.size, entry.standX);
    setLoading(false);
  }

  function frameCamera(size, standX) {
    var topY = Math.max(size.y, 1.4);
    var focusY = topY * 0.42;
    var focusX = standX * 0.28;
    controls.target.set(focusX, focusY, 0);

    var halfV = Math.max(topY * 0.55, 0.6);
    var halfW = size.x / 2 + standX + 0.5;
    var halfD = Math.max(size.z / 2, 0.9);
    var halfHoriz = Math.max(halfW, halfD);

    var halfFovV = THREE.MathUtils.degToRad(camera.fov / 2);
    var halfFovH = Math.atan(Math.tan(halfFovV) * camera.aspect);
    var distV = halfV / Math.tan(halfFovV);
    var distH = halfHoriz / Math.tan(halfFovH);
    var dist = Math.max(distV, distH) * 1.25;

    var dir = new THREE.Vector3(0.55, 0.32, 1).normalize();
    camera.position.copy(controls.target).addScaledVector(dir, dist);
    controls.minDistance = dist * 0.4;
    controls.maxDistance = dist * 2.4;
    controls.update();
  }

  /* ==========================================================================
     UI wiring
     ========================================================================== */
  var tabs = stage.parentElement.querySelectorAll("[data-vehicle]");
  tabs.forEach(function (btn) {
    btn.addEventListener("click", function () {
      tabs.forEach(function (b) { b.classList.toggle("is-active", b === btn); });
      loadVehicle(btn.getAttribute("data-vehicle"));
    });
  });

  /* ==========================================================================
     Resize
     ========================================================================== */
  function resize() {
    var w = stage.clientWidth;
    var h = stage.clientHeight;
    if (!w || !h) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }
  if ("ResizeObserver" in window) {
    new ResizeObserver(resize).observe(stage);
  } else {
    window.addEventListener("resize", resize);
  }
  resize();

  /* ==========================================================================
     Render loop (paused off-screen)
     ========================================================================== */
  var isVisible = false;
  var rafId = null;

  function animate() {
    if (!isVisible) return;
    rafId = requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          isVisible = entry.isIntersecting;
          if (isVisible && !rafId) animate();
          if (!isVisible && rafId) {
            cancelAnimationFrame(rafId);
            rafId = null;
          }
        });
      },
      { threshold: 0.1 }
    ).observe(stage);
  } else {
    isVisible = true;
    animate();
  }

  var start = function () { loadVehicle("fiat"); };
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(start).catch(start);
  } else {
    start();
  }
})();
