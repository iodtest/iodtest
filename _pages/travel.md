---
layout: travel
permalink: /travel/
title: "Travel"
excerpt: "An interactive globe of the places we have visited."
author_profile: false
---

<link rel="stylesheet" href="{{ '/assets/css/travel.css' | relative_url }}">

<section class="travel-experience">
  <div class="travel-hero">
    <h1>Travel Map</h1>
    <p>
      A rotating globe for the places we have been. Highlighted countries pulse on the earth;
      click one to zoom in and let the photos flow.
    </p>
  </div>

  <div class="travel-stage">
    <div class="travel-globe-shell" aria-label="Interactive travel globe">
      <div id="travel-globe"></div>
      <div class="travel-loading" data-travel-loading>Loading globe...</div>
    </div>

    <aside class="travel-panel" aria-live="polite">
      <div class="travel-panel__header">
        <p class="travel-panel__eyebrow">Current stop</p>
        <h2 data-travel-country>Travel</h2>
      </div>

      <div class="travel-panel__body">
        <div class="travel-meta">
          <div>
            <span>Places</span>
            <strong data-travel-city></strong>
          </div>
          <div>
            <span>Time</span>
            <strong data-travel-year></strong>
          </div>
        </div>

        <p class="travel-description" data-travel-description></p>
        <div class="travel-photo-viewer" data-travel-photo-viewer></div>
        <div class="travel-stop-list" data-travel-stop-list></div>
      </div>
    </aside>
  </div>
</section>

<script>
  window.TRAVEL_BASE_PATH = "{{ site.baseurl }}";
</script>
<script src="https://unpkg.com/globe.gl"></script>
<script src="{{ '/assets/js/travel-globe.js' | relative_url }}"></script>
