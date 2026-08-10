(function () {
  "use strict";

  var stage = document.getElementById("configuratorStage");
  if (!stage) return;

  var loaded = false;
  function load() {
    if (loaded) return;
    loaded = true;
    import("./configurator-core.js");
  }

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            load();
            io.disconnect();
          }
        });
      },
      { rootMargin: "600px 0px" }
    );
    io.observe(stage);
  } else {
    load();
  }
})();
