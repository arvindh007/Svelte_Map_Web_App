<script>
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  import { showCapitals } from '../../lib/stores/capitals';
  import { showStates } from '../../lib/stores/states';
  import { mapInitialized } from '../../lib/stores/mapState';
  import { derived, get } from 'svelte/store';
  import { capitals } from '../../lib/data/capitals';
  import { indiaStatesGeoJson } from '../../lib/data/indiaStates';
  import L from 'leaflet';
  import 'leaflet/dist/leaflet.css';
	import { page } from '$app/stores';

  
  let mapInstance;
  let capitalMarkers = [];
  let stateLayer;

  onMount(() => {
  if (browser) {
    const url = new URL(window.location.href);
    const capParam = url.searchParams.get('capitals') === 'true';
    const stateParam = url.searchParams.get('states') === 'true';

    showCapitals.set(capParam);
    showStates.set(stateParam);

    
    setTimeout(() => {
      initializeMap();
    }, 50); 
  }
});


  function initializeMap() {

    if (!mapInstance) {
      console.log("Initializing map");
      
      
      const mapElement = document.getElementById('map');
      if (mapElement) {
        try {
          mapInstance = L.map('map').setView([23.87, 80.57], 5);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapInstance);
          mapInitialized.set(true);
          console.log("Map initialized successfully");
          
          
          updateMap();


        } catch (error) {
          console.error("Error initializing map:", error);
        }
      } else {
        console.error("Map container not found");
      }
    } else {
      console.log("Map already initialized, updating markers");
      updateMap();
    }
  }

  onDestroy(() => {
    
    clearMarkers();
  });

  function updateMap() {
    if (!mapInstance) return;
    
    console.log("Updating map with capitals:", $showCapitals, "states:", $showStates);
    
    
    clearMarkers();
    
    
    if ($showCapitals) {
      addCapitalMarkers();
    }
    
    if ($showStates) {
      addStateLayer();
    }
  }

  function clearMarkers() {
    if (!mapInstance) return;
    
    
    capitalMarkers.forEach(marker => {
      mapInstance.removeLayer(marker);
    });
    capitalMarkers = [];
    
    
    if (stateLayer) {
      mapInstance.removeLayer(stateLayer);
      stateLayer = null;
    }
  }

  function addCapitalMarkers() {
    if (!mapInstance) return;
    
    
    capitals.forEach(capital => {
      const marker = L.marker([capital.lat, capital.lng])
        .addTo(mapInstance)
        .bindPopup(`<b>${capital.capital}</b><br>Capital of ${capital.state}`);
      capitalMarkers.push(marker);
    });
    console.log("Added", capitalMarkers.length, "capital markers");
  }

  function addStateLayer() {
    if (!mapInstance) return;
    
    
    stateLayer = L.geoJSON(indiaStatesGeoJson, {
    style: function (feature) {
    
    const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    
    return {
      color: 'black',           
      weight: 1,                
      fillColor: randomColor,   
      fillOpacity: 0.6
      };
    }
  }).addTo(mapInstance);

    console.log("Added state layer");
  }

//rects for every togle change
  $: if ($showCapitals !== undefined || $showStates !== undefined) {
    if (mapInstance) {
      updateMap();
    }
  }
</script>

<div id="map"></div>

<style>
  #map {
    height: 100vh;
    width: 100%;
  }
</style>