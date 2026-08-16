(function () {
  var basePath = window.TRAVEL_BASE_PATH || "";

  var TRAVEL_STOPS = [
    {
      id: "china",
      country: "China",
      city: "Harbin, Beijing, Shanghai",
      year: "2024-2026",
      lat: 35.8617,
      lng: 104.1954,
      description: "Home base and the beginning of the route.",
      photos: [
        { src: basePath + "/images/me.png", caption: "A favorite moment from China" },
        { src: basePath + "/images/profile.png", caption: "Research days, travel nights" },
        { src: basePath + "/images/bio-photo.jpg", caption: "On the road" }
      ]
    },
    {
      id: "japan",
      country: "Japan",
      city: "Tokyo",
      year: "Example stop",
      lat: 36.2048,
      lng: 138.2529,
      description: "Replace this example with the cities, dates, and stories from your trip.",
      photos: [
        { src: basePath + "/images/image-alignment-580x300.jpg", caption: "Replace with your Japan photo" },
        { src: basePath + "/images/image-alignment-300x200.jpg", caption: "A second travel photo" }
      ]
    },
    {
      id: "singapore",
      country: "Singapore",
      city: "Singapore",
      year: "Example stop",
      lat: 1.3521,
      lng: 103.8198,
      description: "Click a highlighted place or its name to open the travel story.",
      photos: [
        { src: basePath + "/images/500x300.png", caption: "Replace with your Singapore photo" },
        { src: basePath + "/images/foo-bar-identity.jpg", caption: "Another memory" }
      ]
    }
  ];

  var elements = {
    globe: document.getElementById("travel-globe"),
    loading: document.querySelector("[data-travel-loading]"),
    nav: document.querySelector("[data-travel-place-nav]"),
    strip: document.querySelector("[data-travel-photo-strip]"),
    detail: document.querySelector("[data-travel-detail]"),
    close: document.querySelector("[data-travel-close]"),
    country: document.querySelector("[data-travel-country]"),
    city: document.querySelector("[data-travel-city]"),
    year: document.querySelector("[data-travel-year]"),
    description: document.querySelector("[data-travel-description]"),
    viewer: document.querySelector("[data-travel-photo-viewer]")
  };

  if (!elements.globe) {
    return;
  }

  if (typeof Globe !== "function") {
    if (elements.loading) {
      elements.loading.textContent = "Globe library could not load.";
    }
    return;
  }

  var currentStop = null;
  var detailPhotoTimer = null;
  var activePhotoIndex = 0;

  var world = Globe()(elements.globe)
    .backgroundColor("rgba(0,0,0,0)")
    .globeImageUrl("https://unpkg.com/three-globe/example/img/earth-night.jpg")
    .bumpImageUrl("https://unpkg.com/three-globe/example/img/earth-topology.png")
    .showAtmosphere(true)
    .atmosphereColor("#a6e7ff")
    .atmosphereAltitude(0.18)
    .pointOfView({ lat: 20, lng: 95, altitude: 1.85 }, 0)
    .pointsData(TRAVEL_STOPS)
    .pointLat("lat")
    .pointLng("lng")
    .pointAltitude(0.045)
    .pointRadius(function (stop) {
      return currentStop && stop.id === currentStop.id ? 0.44 : 0.28;
    })
    .pointColor(function (stop) {
      return currentStop && stop.id === currentStop.id ? "#ffd166" : "#7dd3fc";
    })
    .pointResolution(24)
    .pointLabel(function (stop) {
      return "<strong>" + stop.country + "</strong><br>" + stop.city;
    })
    .ringsData(TRAVEL_STOPS)
    .ringLat("lat")
    .ringLng("lng")
    .ringColor(function () {
      return function (t) {
        return "rgba(255, 209, 102, " + (0.8 - t * 0.8) + ")";
      };
    })
    .ringMaxRadius(3.2)
    .ringPropagationSpeed(0.9)
    .ringRepeatPeriod(1700)
    .onPointClick(function (stop) {
      openDetail(stop);
    });

  if (world.renderer) {
    world.renderer().setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  }

  if (world.globeMaterial) {
    var globeMaterial = world.globeMaterial();
    globeMaterial.bumpScale = 5;
    globeMaterial.shininess = 0.2;
    if (globeMaterial.specular && globeMaterial.specular.set) {
      globeMaterial.specular.set("#2dd4bf");
    }
  }

  if (world.controls) {
    world.controls().autoRotate = true;
    world.controls().autoRotateSpeed = 0.38;
    world.controls().enableDamping = true;
  }

  buildPlaceNav();
  buildPhotoStrip();
  bindDetailControls();
  hideLoading();
  window.addEventListener("resize", resizeGlobe);
  resizeGlobe();

  function buildPlaceNav() {
    if (!elements.nav) {
      return;
    }

    elements.nav.innerHTML = "";
    TRAVEL_STOPS.forEach(function (stop) {
      var button = document.createElement("button");
      button.className = "travel-place-button";
      button.type = "button";
      button.setAttribute("data-stop-id", stop.id);
      button.textContent = stop.country;
      button.addEventListener("click", function () {
        openDetail(stop);
      });
      elements.nav.appendChild(button);
    });
  }

  function buildPhotoStrip() {
    if (!elements.strip) {
      return;
    }

    var photos = [];
    TRAVEL_STOPS.forEach(function (stop) {
      (stop.photos || []).forEach(function (photo) {
        photos.push({
          src: photo.src,
          caption: photo.caption || stop.country,
          country: stop.country
        });
      });
    });

    elements.strip.innerHTML = "";
    photos.concat(photos).forEach(function (photo) {
      var figure = document.createElement("figure");
      figure.className = "travel-strip-photo";
      figure.innerHTML =
        '<img src="' + photo.src + '" alt="' + photo.caption + '" loading="lazy">' +
        '<figcaption>' + photo.country + '</figcaption>';
      elements.strip.appendChild(figure);
    });
  }

  function bindDetailControls() {
    if (elements.close) {
      elements.close.addEventListener("click", closeDetail);
    }

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeDetail();
      }
    });
  }

  function openDetail(stop) {
    currentStop = stop;
    activePhotoIndex = 0;

    updateActivePlaceButton();
    world.pointsData(TRAVEL_STOPS);
    world.pointOfView({ lat: stop.lat, lng: stop.lng, altitude: 0.45 }, 1100);

    if (!elements.detail) {
      return;
    }

    elements.country.textContent = stop.country;
    elements.city.textContent = stop.city;
    elements.year.textContent = stop.year;
    elements.description.textContent = stop.description;
    renderDetailPhotos(stop.photos || []);
    elements.detail.classList.add("is-open");
    elements.detail.setAttribute("aria-hidden", "false");
  }

  function closeDetail() {
    currentStop = null;
    clearInterval(detailPhotoTimer);
    updateActivePlaceButton();
    world.pointsData(TRAVEL_STOPS);
    world.pointOfView({ lat: 20, lng: 95, altitude: 1.85 }, 900);

    if (elements.detail) {
      elements.detail.classList.remove("is-open");
      elements.detail.setAttribute("aria-hidden", "true");
    }
  }

  function updateActivePlaceButton() {
    Array.prototype.forEach.call(
      document.querySelectorAll(".travel-place-button"),
      function (button) {
        button.classList.toggle(
          "is-active",
          currentStop && button.getAttribute("data-stop-id") === currentStop.id
        );
      }
    );
  }

  function renderDetailPhotos(photos) {
    clearInterval(detailPhotoTimer);
    elements.viewer.innerHTML = "";

    if (!photos.length) {
      elements.viewer.innerHTML = '<p class="travel-empty">Add photos for this stop.</p>';
      return;
    }

    photos.forEach(function (photo, index) {
      var image = document.createElement("img");
      image.src = photo.src;
      image.alt = photo.caption || currentStop.country;
      image.loading = "lazy";
      if (index === 0) {
        image.className = "is-active";
      }
      elements.viewer.appendChild(image);
    });

    var caption = document.createElement("p");
    caption.className = "travel-photo-caption";
    caption.textContent = photos[0].caption || currentStop.country;
    elements.viewer.appendChild(caption);

    detailPhotoTimer = setInterval(function () {
      activePhotoIndex = (activePhotoIndex + 1) % photos.length;
      var images = elements.viewer.querySelectorAll("img");

      Array.prototype.forEach.call(images, function (image, index) {
        image.classList.toggle("is-active", index === activePhotoIndex);
      });

      caption.textContent = photos[activePhotoIndex].caption || currentStop.country;
    }, 2600);
  }

  function hideLoading() {
    if (elements.loading) {
      elements.loading.style.display = "none";
    }
  }

  function resizeGlobe() {
    var box = elements.globe.getBoundingClientRect();
    world.width(Math.max(320, box.width));
    world.height(Math.max(360, box.height));
  }
})();
