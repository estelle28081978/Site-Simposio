import * as THREE from "./vendor/three/build/three.module.min.js";
import { GLTFLoader } from "./vendor/three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "./vendor/three/examples/jsm/controls/OrbitControls.js";

(function () {
  "use strict";

  var stage = document.getElementById("configuratorStage");
  var canvas = document.getElementById("configuratorCanvas");
  if (!stage || !canvas || !window.WebGLRenderingContext) return;

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var VEHICLES = {
    fiat: { label: "Fiat 500", file: "assets/models/fiat-500.glb" },
    vespa: { label: "Vespa", file: "assets/models/vespa.glb" },
    triporteur: { label: "Triporteur", file: "assets/models/triporteur.glb" }
  };

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(38, 1, 0.05, 100);
  camera.position.set(3.4, 1.9, 4.2);

  var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  var controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.minDistance = 2.4;
  controls.maxDistance = 9;
  controls.maxPolarAngle = Math.PI * 0.52;
  controls.target.set(0, 0.7, 0);
  controls.autoRotate = !reducedMotion;
  controls.autoRotateSpeed = 1.1;
  controls.update();

  scene.add(new THREE.HemisphereLight(0xf6ede0, 0x1c3b4a, 1.15));
  var key = new THREE.DirectionalLight(0xfff2df, 2.2);
  key.position.set(4, 6, 3);
  scene.add(key);
  var fill = new THREE.DirectionalLight(0xc1622d, 0.5);
  fill.position.set(-5, 2, -4);
  scene.add(fill);

  var groundTex = makeGroundShadowTexture();
  var ground = new THREE.Mesh(
    new THREE.CircleGeometry(2.6, 48),
    new THREE.MeshBasicMaterial({ map: groundTex, transparent: true, depthWrite: false })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = 0;
  scene.add(ground);

  var vehicleRoot = new THREE.Group();
  scene.add(vehicleRoot);

  var loader = new GLTFLoader();
  var cache = {};
  var currentKey = null;
  var currentModel = null;
  var standGroup = null;
  var standOn = false;
  var standScaleTarget = 0;
  var standScaleCurrent = 0;
  var lastSize = null;
  var lastStandX = 0;
  var lastFit = 1;

  var loadingEl = stage.querySelector(".configurator-loading");

  function setLoading(isLoading) {
    if (loadingEl) loadingEl.classList.toggle("is-visible", isLoading);
  }

  function frameModel(obj) {
    var box = new THREE.Box3().setFromObject(obj);
    var size = box.getSize(new THREE.Vector3());
    var maxDim = Math.max(size.x, size.y, size.z) || 1;
    var scale = 2.6 / maxDim;
    obj.scale.setScalar(scale);
    var box2 = new THREE.Box3().setFromObject(obj);
    var center = box2.getCenter(new THREE.Vector3());
    obj.position.x -= center.x;
    obj.position.z -= center.z;
    obj.position.y -= box2.min.y;
    return box2.getSize(new THREE.Vector3());
  }

  function loadVehicle(key) {
    if (key === currentKey) return;
    currentKey = key;
    setLoading(true);

    if (cache[key]) {
      showVehicle(cache[key]);
      return;
    }

    loader.load(
      VEHICLES[key].file,
      function (gltf) {
        var obj = gltf.scene;
        obj.traverse(function (n) {
          if (n.isMesh) {
            n.castShadow = false;
            n.receiveShadow = false;
          }
        });
        var size = frameModel(obj);
        cache[key] = { obj: obj, size: size };
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
    if (currentModel) vehicleRoot.remove(currentModel);
    if (standGroup) {
      vehicleRoot.remove(standGroup);
      standGroup = null;
    }
    currentModel = entry.obj;
    vehicleRoot.add(currentModel);

    var fit = Math.max(0.7, Math.min(1.5, entry.size.y / 1.15));
    standGroup = buildStand(fit);
    var sideX = entry.size.x / 2 + 0.55 * fit + 0.35;
    standGroup.position.set(sideX, 0, entry.size.z * 0.12);
    standGroup.scale.setScalar(0.0001);
    vehicleRoot.add(standGroup);
    standScaleCurrent = 0.0001;
    standScaleTarget = standOn ? 1 : 0.0001;

    lastSize = entry.size;
    lastStandX = sideX;
    lastFit = fit;
    frameCamera(entry.size, sideX, fit);
    setLoading(false);
  }

  function frameCamera(size, standX, fit) {
    var standTopY = fit * 1.32;
    var topY = standOn ? Math.max(size.y, standTopY) : size.y;
    var focusY = topY / 2;
    var focusX = standOn ? standX * 0.32 : 0;
    var newTarget = new THREE.Vector3(focusX, focusY, 0);

    var halfV = Math.max(topY / 2, 0.5);
    var halfW = standOn ? size.x / 2 + standX + fit * 0.55 : size.x / 2;
    var halfD = size.z / 2;
    var halfHoriz = Math.max(halfW, halfD, 0.6);

    var halfFovV = THREE.MathUtils.degToRad(camera.fov / 2);
    var halfFovH = Math.atan(Math.tan(halfFovV) * camera.aspect);
    var distV = halfV / Math.tan(halfFovV);
    var distH = halfHoriz / Math.tan(halfFovH);
    var dist = Math.max(distV, distH) * 1.2;

    var dir = camera.position.clone().sub(controls.target);
    if (dir.lengthSq() < 0.0001) dir.set(0.8, 0.5, 1);
    dir.normalize();
    controls.target.copy(newTarget);
    camera.position.copy(newTarget).addScaledVector(dir, dist);
    controls.minDistance = dist * 0.45;
    controls.maxDistance = dist * 2.2;
    controls.update();
  }

  /* ---------- Procedural stand module (original geometry, not a Brindapino asset) ---------- */
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

  function signTexture() {
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
    var fontReady = document.fonts && document.fonts.check && document.fonts.check("40px 'Yeseva One'");
    ctx.font = (fontReady ? "" : "") + "76px 'Yeseva One', Georgia, serif";
    ctx.fillText("Simposio", c.width / 2, c.height / 2 - 18);
    ctx.font = "26px 'Glacial Indifference', Arial, sans-serif";
    ctx.fillStyle = "#c1622d";
    ctx.fillText("DOLCE VITA", c.width / 2, c.height / 2 + 56);
    var tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  function buildStand(fit) {
    fit = fit || 1;
    var group = new THREE.Group();

    var counterH = 0.5 * fit;
    var poleH = 0.72 * fit;
    var counterW = 1.0 * fit;
    var counterD = 0.48 * fit;

    var counterMat = new THREE.MeshStandardMaterial({ color: 0x6f4a2c, roughness: 0.85, metalness: 0.05 });
    var trimMat = new THREE.MeshStandardMaterial({ color: 0xc1622d, roughness: 0.55, metalness: 0.1 });
    var counter = new THREE.Mesh(new THREE.BoxGeometry(counterW, counterH, counterD), counterMat);
    counter.position.y = counterH / 2;
    group.add(counter);
    var trim = new THREE.Mesh(new THREE.BoxGeometry(counterW + 0.04, 0.05 * fit, counterD + 0.04), trimMat);
    trim.position.y = counterH + 0.025 * fit;
    group.add(trim);

    var brassMat = new THREE.MeshStandardMaterial({ color: 0xb98a4e, roughness: 0.3, metalness: 0.75 });
    var poleGeo = new THREE.CylinderGeometry(0.016 * fit, 0.016 * fit, poleH, 10);
    var poleOffsets = [
      [-counterW * 0.4, -counterD * 0.38],
      [counterW * 0.4, -counterD * 0.38],
      [-counterW * 0.4, counterD * 0.38],
      [counterW * 0.4, counterD * 0.38]
    ];
    poleOffsets.forEach(function (o) {
      var pole = new THREE.Mesh(poleGeo, brassMat);
      pole.position.set(o[0], counterH + poleH / 2, o[1]);
      group.add(pole);
    });

    var awningY = counterH + poleH + 0.02 * fit;
    var awningTex = stripeTexture("#f6f1e7", "#9d3636", 10);
    awningTex.repeat.set(1, 1);
    var awningMat = new THREE.MeshStandardMaterial({ map: awningTex, roughness: 0.75, side: THREE.DoubleSide });
    var awning = new THREE.Mesh(new THREE.BoxGeometry(counterW * 1.28, 0.035 * fit, counterD * 1.5), awningMat);
    awning.position.y = awningY;
    awning.rotation.x = -0.05;
    group.add(awning);

    var fringeTex = fringeTexture("#f6f1e7", "#9d3636", 14);
    fringeTex.repeat.set(1, 1);
    var fringeMat = new THREE.MeshBasicMaterial({ map: fringeTex, transparent: true, side: THREE.DoubleSide });
    var fringeFront = new THREE.Mesh(new THREE.PlaneGeometry(counterW * 1.28, 0.14 * fit), fringeMat);
    fringeFront.position.set(0, awningY - 0.05 * fit, counterD * 0.75);
    fringeFront.rotation.x = -0.05;
    group.add(fringeFront);

    var signMat = new THREE.MeshStandardMaterial({ map: signTexture(), roughness: 0.7 });
    var sign = new THREE.Mesh(new THREE.BoxGeometry(0.62 * fit, 0.31 * fit, 0.025 * fit), signMat);
    sign.position.set(0, counterH + poleH * 0.72, counterD * 0.8);
    sign.rotation.x = -0.1;
    group.add(sign);
    var chainGeo = new THREE.CylinderGeometry(0.007 * fit, 0.007 * fit, poleH * 0.22, 6);
    [-0.26 * fit, 0.26 * fit].forEach(function (x) {
      var chain = new THREE.Mesh(chainGeo, brassMat);
      chain.position.set(x, counterH + poleH * 0.9, counterD * 0.8);
      group.add(chain);
    });

    return group;
  }

  /* ---------- UI wiring ---------- */
  var tabs = stage.parentElement.querySelectorAll("[data-vehicle]");
  tabs.forEach(function (btn) {
    btn.addEventListener("click", function () {
      tabs.forEach(function (b) { b.classList.toggle("is-active", b === btn); });
      loadVehicle(btn.getAttribute("data-vehicle"));
    });
  });

  var standToggle = stage.parentElement.querySelector("[data-stand-toggle]");
  if (standToggle) {
    standToggle.addEventListener("click", function () {
      standOn = !standOn;
      standToggle.classList.toggle("is-on", standOn);
      standToggle.setAttribute("aria-pressed", String(standOn));
      standScaleTarget = standOn ? 1 : 0.0001;
      if (lastSize) frameCamera(lastSize, lastStandX, lastFit);
    });
  }

  /* ---------- Resize ---------- */
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

  /* ---------- Render loop (paused when off-screen) ---------- */
  var isVisible = false;
  var rafId = null;

  function animate() {
    if (!isVisible) return;
    rafId = requestAnimationFrame(animate);
    controls.update();
    if (standGroup) {
      standScaleCurrent += (standScaleTarget - standScaleCurrent) * 0.18;
      standGroup.scale.setScalar(Math.max(standScaleCurrent, 0.0001));
    }
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

  function makeGroundShadowTexture() {
    var c = document.createElement("canvas");
    c.width = c.height = 256;
    var ctx = c.getContext("2d");
    var grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    grad.addColorStop(0, "rgba(16,31,39,0.38)");
    grad.addColorStop(0.7, "rgba(16,31,39,0.16)");
    grad.addColorStop(1, "rgba(16,31,39,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, c.width, c.height);
    return new THREE.CanvasTexture(c);
  }

  /* Load the first vehicle once fonts are ready so the sign text renders correctly */
  var start = function () { loadVehicle("fiat"); };
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(start).catch(start);
  } else {
    start();
  }
})();
