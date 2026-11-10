/* abstrakt engine — minimal progressive-enhancement JS (no dependencies) */
(function () {
  "use strict";

  /* 1) Reveal-on-scroll ------------------------------------------------ */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* 2) Secondary demo thumbnails (link out, no iframe) ---------------- */
  document.querySelectorAll("[data-yt]").forEach(function (el) {
    var id = el.getAttribute("data-yt");
    el.style.backgroundImage =
      "url('https://i.ytimg.com/vi/" + id + "/hqdefault.jpg')";
  });

  /* 2b) Primary lazy embed: poster now, youtube-nocookie iframe on click */
  document.querySelectorAll(".yt-lite").forEach(function (el) {
    var id = el.getAttribute("data-id");
    if (!id) return;
    // maxres poster when available, fall back to hq on error
    var probe = new Image();
    probe.onload = function () {
      // maxres can return a 120x90 grey placeholder; treat tiny as missing
      var url = probe.naturalWidth > 120
        ? "https://i.ytimg.com/vi/" + id + "/maxresdefault.jpg"
        : "https://i.ytimg.com/vi/" + id + "/hqdefault.jpg";
      el.style.backgroundImage = "url('" + url + "')";
    };
    probe.onerror = function () {
      el.style.backgroundImage =
        "url('https://i.ytimg.com/vi/" + id + "/hqdefault.jpg')";
    };
    probe.src = "https://i.ytimg.com/vi/" + id + "/maxresdefault.jpg";

    function play() {
      var f = document.createElement("iframe");
      f.setAttribute("title", el.getAttribute("data-title") || "abstrakt engine demo");
      f.setAttribute("allow", "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share");
      f.setAttribute("allowfullscreen", "");
      f.src = "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1&rel=0&modestbranding=1";
      el.innerHTML = "";
      el.appendChild(f);
    }
    el.addEventListener("click", play);
  });

  /* 3) Graceful placeholder for not-yet-present images ----------------- */
  /*    (purely for local review before the real screenshots are copied) */
  document.querySelectorAll("img").forEach(function (img) {
    img.addEventListener("error", function () {
      if (img.dataset.failed) return;
      img.dataset.failed = "1";
      var box = document.createElement("div");
      box.className = "img-missing";
      box.textContent = "⌧ " + (img.getAttribute("src") || "image");
      if (img.parentNode) img.parentNode.replaceChild(box, img);
    });
  });
})();
