(function () {
  var BASE = "https://cdn.jsdelivr.net/gh/Ion-o-koji/khmer-Vocabulary-Assets@main/";

  function loadReal(version) {
    var v = version ? ("?v=" + encodeURIComponent(version)) : "";

    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = BASE + "styles/khmerVocabularyStyles.css" + v;
    document.head.appendChild(link);

    var script = document.createElement("script");
    script.src = BASE + "scripts/khmerVocabularyScripts.js" + v;
    script.async = false; // keep it running in-order, before DOMContentLoaded fires
    document.body.appendChild(script);
  }

  fetch(BASE + "version.json", { cache: "no-store" })
    .then(function (r) { return r.json(); })
    .then(function (manifest) { loadReal(manifest && manifest.version); })
    .catch(function () { loadReal(null); }); // if the check fails, still load the app
})();
