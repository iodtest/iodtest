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
      description: "Click a highlighted place to zoom the globe and start the photo flow.",
      photos: [
        { src: basePath + "/images/500x300.png", caption: "Replace with your Singapore photo" },
        { src: basePath + "/images/foo-bar-identity.jpg", caption: "Another memory" }
      ]
    }
  ];

  var elements = {
    globe: document.getElementById("travel-globe"),
    loading: document.querySelector("[data-travel-loading]"),
    country: document.querySelector("[data-travel-country]"),
    city: document.querySelector("[data-travel-city]"),
    year: document.querySelector("[data-travel-year]"),
    description: document.querySelector("[data-travel-description]"),
    viewer: document.querySelector("[data-travel-photo-viewer]"),
    list: document.querySelector("[data-travel-stop-list]")
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

  var currentStop = TRAVEL_STOPS[0];
  var photoTimer = null;
  var activePhotoIndex = 0;

  var world = Globe()(elements.globe)
    .backgroundColor("rgba(0,0,0,0)")
    .globeImageUrl("https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg")
    .bumpImageUrl("https://unpkg.com/three-globe/example/img/earth-topology.png")
    .showAtmosphere(true)
    .atmosphereColor("#d8f3ff")
    .atmosphereAltitude(0.16)
    .pointOfView({ lat: 22, lng: 95, altitude: 2.05 }, 0)
    .pointsData(TRAVEL_STOPS)
    .pointLat("lat")
    .pointLng("lng")
    .pointAltitude(function (stop) {
      return stop.id === currentStop.id ? 0.09 : 0.045;
    })
    .pointRadius(function (stop) {
      return stop.id === currentStop.id ? 0.42 : 0.28;
    })
    .pointColor(function (stop) {
      return stop.id === currentStop.id ? "#ffbf47" : "#36d399";
    })
    .pointLabel(function (stop) {
      return "<strong>" + stop.country + "</strong><br>" + stop.city;
    })
    .ringsData(TRAVEL_STOPS)
    .ringLat("lat")
    .ringLng("lng")
    .ringColor(function () {
      return function (t) {
        return "rgba(255, 191, 71, " + (1 - t) + ")";
      };
    })
    .ringMaxRadius(4)
    .ringPropagationSpeed(1.2)
    .ringRepeatPeriod(1300)
    .onPointClick(function (stop) {
      selectStop(stop);
    });

  if (world.controls) {
    world.controls().autoRotate = true;
    world.controls().autoRotateSpeed = 0.55;
    world.controls().enableDamping = true;
  }

  fetch("https://cdn.jsdelivr.net/gh/holtzy/D3-graph-gallery@master/DATA/world.geojson")
    .then(function (response) {
      return response.json();
    })
    .then(function (countries) {
      var visitedCountries = TRAVEL_STOPS.map(function (stop) {
        return stop.country;
      });

      world
        .polygonsData(countries.features)
        .polygonAltitude(function (feature) {
          return isVisited(feature, visitedCountries) ? 0.02 : 0.004;
        })
        .polygonCapColor(function (feature) {
          if (feature.properties.name === currentStop.country) {
            return "rgba(255, 191, 71, .82)";
          }
          return isVisited(feature, visitedCountries)
            ? "rgba(54, 211, 153, .55)"
            : "rgba(184, 214, 181, .34)";
        })
        .polygonSideColor(function () {
          return "rgba(6, 32, 44, .28)";
        })
        .polygonStrokeColor(function (feature) {
          return isVisited(feature, visitedCountries) ? "#fff2cc" : "rgba(255,255,255,.28)";
        })
        .polygonLabel(function (feature) {
          return feature.properties.name;
        })
        .onPolygonClick(function (feature) {
          var stop = TRAVEL_STOPS.find(function (item) {
            return item.country === feature.properties.name;
          });
          if (stop) {
            selectStop(stop);
          }
        });

      hideLoading();
    })
    .catch(function () {
      hideLoading();
    });

  buildStopList();
  selectStop(currentStop);
  window.addEventListener("resize", resizeGlobe);
  resizeGlobe();

  function isVisited(feature, visitedCountries) {
    return visitedCountries.indexOf(feature.properties.name) !== -1;
  }

  function selectStop(stop) {
    currentStop = stop;
    activePhotoIndex = 0;

    elements.country.textContent = stop.country;
    elements.city.textContent = stop.city;
    elements.year.textContent = stop.year;
    elements.description.textContent = stop.description;

    updateActiveStopButton();
    renderPhotos(stop.photos || []);

    world.pointOfView({ lat: stop.lat, lng: stop.lng, altitude: 0.75 }, 1100);
    world.pointsData(TRAVEL_STOPS);

    if (world.polygonsData && typeof world.polygonCapColor === "function") {
      world.polygonCapColor(function (feature) {
        if (feature.properties.name === currentStop.country) {
          return "rgba(255, 191, 71, .86)";
        }
        return TRAVEL_STOPS.some(function (item) {
          return item.country === feature.properties.name;
        })
          ? "rgba(54, 211, 153, .55)"
          : "rgba(184, 214, 181, .34)";
      });
    }
  }

  function buildStopList() {
    elements.list.innerHTML = "";

    TRAVEL_STOPS.forEach(function (stop) {
      var button = document.createElement("button");
      button.className = "travel-stop-button";
      button.type = "button";
      button.setAttribute("data-stop-id", stop.id);
      button.innerHTML = "<strong>" + stop.country + "</strong><span>" + stop.city + "</span>";
      button.addEventListener("click", function () {
        selectStop(stop);
      });
      elements.list.appendChild(button);
    });
  }

  function updateActiveStopButton() {
    Array.prototype.forEach.call(
      document.querySelectorAll(".travel-stop-button"),
      function (button) {
        button.classList.toggle("is-active", button.getAttribute("data-stop-id") === currentStop.id);
      }
    );
  }

  function renderPhotos(photos) {
    clearInterval(photoTimer);
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

    photoTimer = setInterval(function () {
      activePhotoIndex = (activePhotoIndex + 1) % photos.length;
      var images = elements.viewer.querySelectorAll("img");

      Array.prototype.forEach.call(images, function (image, index) {
        image.classList.toggle("is-active", index === activePhotoIndex);
      });

      caption.textContent = photos[activePhotoIndex].caption || currentStop.country;
    }, 2400);
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
