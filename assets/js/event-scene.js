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
  var camera = new THREE.PerspectiveCamera(42, 1, 0.05, 200);

  var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  var controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.minDistance = 2.5;
  controls.maxDistance = 22;
  controls.maxPolarAngle = Math.PI * 0.5;
  controls.autoRotate = !reducedMotion;
  controls.autoRotateSpeed = 0.35;

  scene.background = skyTexture();
  scene.fog = new THREE.Fog(0xd9a86b, 16, 34);

  scene.add(new THREE.HemisphereLight(0xffe6c2, 0x1c3b4a, 1.2));
  var sun = new THREE.DirectionalLight(0xffcf94, 2.4);
  sun.position.set(14, 7, -9);
  scene.add(sun);
  var fill = new THREE.DirectionalLight(0x9fb8c9, 0.45);
  fill.position.set(-8, 4, 8);
  scene.add(fill);

  var world = new THREE.Group();
  scene.add(world);

  /* ==========================================================================
     Ground
     ========================================================================== */
  var ground = new THREE.Mesh(
    new THREE.CircleGeometry(11, 56),
    new THREE.MeshStandardMaterial({ color: 0xe4d3b6, roughness: 0.95 })
  );
  ground.rotation.x = -Math.PI / 2;
  world.add(ground);

  [
    [0, 0, 3.2],
    [-5.5, -2, 2.6],
    [5.5, -2, 2.6],
    [0, 5.5, 2.6]
  ].forEach(function (p) {
    var blob = new THREE.Mesh(
      new THREE.CircleGeometry(p[2], 40),
      new THREE.MeshBasicMaterial({ map: groundShadowTexture(), transparent: true, depthWrite: false })
    );
    blob.rotation.x = -Math.PI / 2;
    blob.position.set(p[0], 0.01, p[1]);
    world.add(blob);
  });

  /* ==========================================================================
     Shared texture helpers (original geometry/art, not Brindapino assets)
     ========================================================================== */
  function stripeCanvas(colorA, colorB, stripes, w, h) {
    var c = document.createElement("canvas");
    c.width = w || 256;
    c.height = h || 64;
    var ctx = c.getContext("2d");
    var stepW = c.width / stripes;
    for (var i = 0; i < stripes; i++) {
      ctx.fillStyle = i % 2 === 0 ? colorA : colorB;
      ctx.fillRect(i * stepW, 0, stepW, c.height);
    }
    return c;
  }
  function stripeTexture(colorA, colorB, stripes) {
    var tex = new THREE.CanvasTexture(stripeCanvas(colorA, colorB, stripes));
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }
  function ginghamTexture(base, line, cells) {
    var c = document.createElement("canvas");
    c.width = c.height = 256;
    var ctx = c.getContext("2d");
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, c.width, c.height);
    var step = c.width / cells;
    ctx.globalAlpha = 0.55;
    ctx.fillStyle = line;
    for (var i = 0; i < cells; i++) {
      ctx.fillRect(i * step, 0, step * 0.5, c.height);
      ctx.fillRect(0, i * step, c.width, step * 0.5);
    }
    ctx.globalAlpha = 1;
    var tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2, 1);
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
    grad.addColorStop(0, "rgba(16,31,39,0.32)");
    grad.addColorStop(0.7, "rgba(16,31,39,0.12)");
    grad.addColorStop(1, "rgba(16,31,39,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, c.width, c.height);
    return new THREE.CanvasTexture(c);
  }
  function skyTexture() {
    var c = document.createElement("canvas");
    c.width = 16;
    c.height = 256;
    var ctx = c.getContext("2d");
    var grad = ctx.createLinearGradient(0, 0, 0, c.height);
    grad.addColorStop(0, "#f4d9a8");
    grad.addColorStop(0.35, "#e2a874");
    grad.addColorStop(0.7, "#8a4f4a");
    grad.addColorStop(1, "#1c3b4a");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, c.width, c.height);
    var tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  /* ==========================================================================
     Vehicle stand (counter + brass poles + striped awning + Simposio sign)
     ========================================================================== */
  function buildStand(fit, label) {
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
    var awningMat = new THREE.MeshStandardMaterial({ map: awningTex, roughness: 0.75, side: THREE.DoubleSide });
    var awning = new THREE.Mesh(new THREE.BoxGeometry(counterW * 1.28, 0.035 * fit, counterD * 1.5), awningMat);
    awning.position.y = awningY;
    awning.rotation.x = -0.05;
    group.add(awning);

    var fringeTex = fringeTexture("#f6f1e7", "#9d3636", 14);
    var fringeMat = new THREE.MeshBasicMaterial({ map: fringeTex, transparent: true, side: THREE.DoubleSide });
    var fringeFront = new THREE.Mesh(new THREE.PlaneGeometry(counterW * 1.28, 0.14 * fit), fringeMat);
    fringeFront.position.set(0, awningY - 0.05 * fit, counterD * 0.75);
    fringeFront.rotation.x = -0.05;
    group.add(fringeFront);

    var signMat = new THREE.MeshStandardMaterial({ map: signTexture("Simposio", label || "DOLCE VITA"), roughness: 0.7 });
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

    group.userData.topY = awningY;
    group.userData.poleTop = new THREE.Vector3(counterW * 0.4, awningY, -counterD * 0.38);
    return group;
  }

  /* ==========================================================================
     Dining table with gingham cloth, chairs and simple centerpieces
     ========================================================================== */
  function buildTable() {
    var group = new THREE.Group();
    var W = 3.0, D = 0.95, H = 0.74;

    var woodMat = new THREE.MeshStandardMaterial({ color: 0x8a6a45, roughness: 0.7 });
    var legGeo = new THREE.CylinderGeometry(0.035, 0.035, H, 8);
    var legOffsets = [
      [-W / 2 + 0.15, -D / 2 + 0.1],
      [W / 2 - 0.15, -D / 2 + 0.1],
      [-W / 2 + 0.15, D / 2 - 0.1],
      [W / 2 - 0.15, D / 2 - 0.1]
    ];
    legOffsets.forEach(function (o) {
      var leg = new THREE.Mesh(legGeo, woodMat);
      leg.position.set(o[0], H / 2, o[1]);
      group.add(leg);
    });

    var clothTex = ginghamTexture("#f6f1e7", "#9d3636", 16);
    var clothMat = new THREE.MeshStandardMaterial({ map: clothTex, roughness: 0.85 });
    var top = new THREE.Mesh(new THREE.BoxGeometry(W + 0.2, 0.05, D + 0.2), clothMat);
    top.position.y = H;
    group.add(top);
    var skirtFront = new THREE.Mesh(new THREE.PlaneGeometry(W + 0.2, 0.22), clothMat);
    skirtFront.position.set(0, H - 0.13, D / 2 + 0.1);
    group.add(skirtFront);
    var skirtBack = skirtFront.clone();
    skirtBack.position.z = -D / 2 - 0.1;
    skirtBack.rotation.y = Math.PI;
    group.add(skirtBack);

    /* chairs */
    var chairMat = new THREE.MeshStandardMaterial({ color: 0xb98a53, roughness: 0.8 });
    function chair() {
      var c = new THREE.Group();
      var seat = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.04, 0.4), chairMat);
      seat.position.y = 0.44;
      c.add(seat);
      var back = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.04), chairMat);
      back.position.set(0, 0.64, -0.18);
      c.add(back);
      var legG = new THREE.CylinderGeometry(0.02, 0.02, 0.44, 6);
      [[-0.16, -0.16], [0.16, -0.16], [-0.16, 0.16], [0.16, 0.16]].forEach(function (o) {
        var l = new THREE.Mesh(legG, chairMat);
        l.position.set(o[0], 0.22, o[1]);
        c.add(l);
      });
      return c;
    }
    [-0.85, 0, 0.85].forEach(function (x) {
      var c1 = chair();
      c1.position.set(x, 0, D / 2 + 0.42);
      group.add(c1);
      var c2 = chair();
      c2.position.set(x, 0, -D / 2 - 0.42);
      c2.rotation.y = Math.PI;
      group.add(c2);
    });

    /* candles + herb centerpieces */
    var candleMat = new THREE.MeshStandardMaterial({ color: 0xf6f1e7, roughness: 0.6 });
    var flameMat = new THREE.MeshBasicMaterial({ color: 0xffb35c });
    var herbMat = new THREE.MeshStandardMaterial({ color: 0x4c6b3c, roughness: 0.9 });
    [-0.9, -0.3, 0.3, 0.9].forEach(function (x, i) {
      if (i % 2 === 0) {
        var candle = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.022, 0.14, 8), candleMat);
        candle.position.set(x, H + 0.095, 0);
        group.add(candle);
        var flame = new THREE.Mesh(new THREE.SphereGeometry(0.02, 6, 6), flameMat);
        flame.position.set(x, H + 0.175, 0);
        group.add(flame);
      } else {
        var herb = new THREE.Group();
        for (var k = 0; k < 5; k++) {
          var leaf = new THREE.Mesh(new THREE.SphereGeometry(0.035, 6, 6), herbMat);
          leaf.position.set((Math.random() - 0.5) * 0.08, 0.05 + Math.random() * 0.05, (Math.random() - 0.5) * 0.08);
          herb.add(leaf);
        }
        herb.position.set(x, H + 0.02, 0);
        group.add(herb);
      }
    });

    group.userData.width = W;
    group.userData.depth = D;
    group.userData.height = H;
    return group;
  }

  /* ==========================================================================
     Central umbrella
     ========================================================================== */
  function buildUmbrella() {
    var group = new THREE.Group();
    var poleH = 2.5;
    var poleMat = new THREE.MeshStandardMaterial({ color: 0x6f4a2c, roughness: 0.75 });
    var pole = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.045, poleH, 10), poleMat);
    pole.position.y = poleH / 2;
    group.add(pole);

    var canopyTex = stripeTexture("#f6f1e7", "#9d3636", 12);
    var canopyMat = new THREE.MeshStandardMaterial({ map: canopyTex, roughness: 0.7, side: THREE.DoubleSide });
    var canopy = new THREE.Mesh(new THREE.ConeGeometry(2.3, 0.7, 16, 1, true), canopyMat);
    canopy.position.y = poleH - 0.1;
    group.add(canopy);

    var fringeTex = fringeTexture("#f6f1e7", "#9d3636", 22);
    var fringeMat = new THREE.MeshBasicMaterial({ map: fringeTex, transparent: true, side: THREE.DoubleSide });
    var fringe = new THREE.Mesh(new THREE.CylinderGeometry(2.28, 2.28, 0.26, 16, 1, true), fringeMat);
    fringe.position.y = poleH - 0.42;
    group.add(fringe);

    group.userData.topY = poleH;
    return group;
  }

  /* ==========================================================================
     String lights — sagging chain of small warm spheres between two points
     ========================================================================== */
  function buildStringLights(a, b, sag, count) {
    var group = new THREE.Group();
    var bulbGeo = new THREE.SphereGeometry(0.028, 6, 6);
    var bulbMat = new THREE.MeshBasicMaterial({ color: 0xffcf87 });
    for (var i = 0; i <= count; i++) {
      var t = i / count;
      var p = new THREE.Vector3().lerpVectors(a, b, t);
      p.y -= Math.sin(Math.PI * t) * sag;
      var bulb = new THREE.Mesh(bulbGeo, bulbMat);
      bulb.position.copy(p);
      group.add(bulb);
    }
    return group;
  }

  /* ==========================================================================
     Layout
     ========================================================================== */
  var table = buildTable();
  world.add(table);

  var umbrella = buildUmbrella();
  umbrella.position.set(0, 0, -table.userData.depth / 2 - 0.75);
  world.add(umbrella);

  var VEHICLE_LAYOUT = {
    fiat: { file: "assets/models/fiat-500.glb", realLength: 3.0, pos: [-5.4, 0, -2.1], rotY: 0.65, label: "LA CARTOLINA" },
    vespa: { file: "assets/models/vespa.glb", realLength: 1.8, pos: [5.4, 0, -2.1], rotY: -0.65, label: "L'APERITIVO" },
    triporteur: { file: "assets/models/triporteur.glb", realLength: 1.9, pos: [0, 0, 5.6], rotY: Math.PI, label: "LA TAVOLA" }
  };

  var stagePoints = {};
  var loadingCount = Object.keys(VEHICLE_LAYOUT).length;

  var loader = new GLTFLoader();
  Object.keys(VEHICLE_LAYOUT).forEach(function (key) {
    var cfg = VEHICLE_LAYOUT[key];
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
        var stand = buildStand(fit, cfg.label);
        var sideX = finalSize.x / 2 + 0.55 * fit + 0.3;
        stand.position.set(sideX, 0, finalSize.z * 0.12);
        vGroup.add(stand);

        vGroup.position.set(cfg.pos[0], cfg.pos[1], cfg.pos[2]);
        vGroup.rotation.y = cfg.rotY;
        world.add(vGroup);

        var worldPole = new THREE.Vector3(sideX, stand.userData.topY, finalSize.z * 0.12)
          .applyAxisAngle(new THREE.Vector3(0, 1, 0), cfg.rotY)
          .add(new THREE.Vector3(cfg.pos[0], cfg.pos[1], cfg.pos[2]));

        stagePoints[key] = {
          center: new THREE.Vector3(cfg.pos[0], finalSize.y * 0.4, cfg.pos[2]),
          poleTop: worldPole
        };

        loadingCount--;
        if (loadingCount === 0) {
          onAllLoaded();
        }
      },
      undefined,
      function () {
        var msg = stage.querySelector(".configurator-error");
        if (msg) msg.classList.add("is-visible");
        setLoading(false);
      }
    );
  });

  function onAllLoaded() {
    var umbrellaTop = new THREE.Vector3(0, umbrella.userData.topY, umbrella.position.z);
    ["fiat", "vespa", "triporteur"].forEach(function (key) {
      if (!stagePoints[key]) return;
      var lights = buildStringLights(umbrellaTop, stagePoints[key].poleTop, 0.9, 10);
      world.add(lights);
    });
    setLoading(false);
    goToViewpoint("overview", true);
  }

  /* ==========================================================================
     Loading / error UI
     ========================================================================== */
  var loadingEl = stage.querySelector(".configurator-loading");
  function setLoading(isLoading) {
    if (loadingEl) loadingEl.classList.toggle("is-visible", isLoading);
  }

  /* ==========================================================================
     Viewpoints
     ========================================================================== */
  var VIEWPOINTS = {
    overview: { pos: new THREE.Vector3(0, 6.8, 13.5), target: new THREE.Vector3(0, 1, 0.5) },
    cartolina: { pos: new THREE.Vector3(-10.5, 4.2, 3.6), target: new THREE.Vector3(-5.4, 1.3, -2.1) },
    aperitivo: { pos: new THREE.Vector3(10.5, 4.2, 3.6), target: new THREE.Vector3(5.4, 1.3, -2.1) },
    tavola: { pos: new THREE.Vector3(0, 2.6, 9.8), target: new THREE.Vector3(0, 1.1, 5.6) },
    table: { pos: new THREE.Vector3(0, 2, 3.6), target: new THREE.Vector3(0, 0.8, 0) }
  };

  var camAnim = null;
  function goToViewpoint(name, instant) {
    var vp = VIEWPOINTS[name];
    if (!vp) return;
    if (instant || reducedMotion) {
      camera.position.copy(vp.pos);
      controls.target.copy(vp.target);
      controls.update();
      return;
    }
    camAnim = {
      fromPos: camera.position.clone(),
      toPos: vp.pos.clone(),
      fromTarget: controls.target.clone(),
      toTarget: vp.target.clone(),
      start: performance.now(),
      duration: 1100
    };
  }

  var vpButtons = stage.parentElement.querySelectorAll("[data-viewpoint]");
  vpButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      vpButtons.forEach(function (b) { b.classList.toggle("is-active", b === btn); });
      goToViewpoint(btn.getAttribute("data-viewpoint"));
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
  camera.position.copy(VIEWPOINTS.overview.pos);
  controls.target.copy(VIEWPOINTS.overview.target);
  controls.update();

  /* ==========================================================================
     Render loop (paused off-screen)
     ========================================================================== */
  var isVisible = false;
  var rafId = null;

  function animate(now) {
    if (!isVisible) return;
    rafId = requestAnimationFrame(animate);

    if (camAnim) {
      var t = Math.min(1, (now - camAnim.start) / camAnim.duration);
      var ease = 1 - Math.pow(1 - t, 3);
      camera.position.lerpVectors(camAnim.fromPos, camAnim.toPos, ease);
      controls.target.lerpVectors(camAnim.fromTarget, camAnim.toTarget, ease);
      if (t >= 1) camAnim = null;
    }

    controls.update();
    renderer.render(scene, camera);
  }

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          isVisible = entry.isIntersecting;
          if (isVisible && !rafId) requestAnimationFrame(animate);
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
    requestAnimationFrame(animate);
  }
})();
