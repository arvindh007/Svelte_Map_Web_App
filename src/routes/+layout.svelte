<script>
  import { showStates } from '../lib/stores/states';
  import { goto, pushState } from '$app/navigation';
  import { showCapitals } from '../lib/stores/capitals';
  import { userInteracted, mapInitialized } from '../lib/stores/mapState';
  import { page } from '$app/stores';
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';

  let showDropdown = false;
  let showSidebar = false;
  let isUpdatingFromUrl = false;
  
  // $: updateUrl();
  function updateUrl() {
    if (browser) {
      const params = new URLSearchParams();
      // console.log(params);
      if ($showStates) params.set('states', 'true');
      if ($showCapitals) params.set('capitals', 'true');
      const newUrl = `/map${params.toString() ? '?' + params.toString() : ''}`;
      history.replaceState(null, '', newUrl);
    }
  }

  
  $: if ($showCapitals !== undefined || $showStates !== undefined) {
    updateUrl();
  }
  
 
  function handleCapitalsToggle(event) {
    showCapitals.set(event.target.checked);
    userInteracted.set(true);

  }
  
  function handleStatesToggle(event) {
    showStates.set(event.target.checked);
    userInteracted.set(true);

  }

</script>

<div class="topbar">
  <button class="hamburger" on:click={() => (showSidebar = !showSidebar)}>
    &#9776;
  </button>
  <span class="brand">Web App for Map Visulzation</span>
</div>

<!-- Sidebar -->
<div class="sidenav" class:show={showSidebar}>
  <a href="/home">Home</a>
  <button class="dropdown-btn" on:click={() => {
    showDropdown = !showDropdown;
    goto('/map', { replaceState: true, noScroll: true, keepFocus: true });
  }}>
    Map
    <i class="fa fa-caret-down"></i>
  </button>

  {#if showDropdown}
    <div class="dropdown-container">
      <label class="switch">
        <input type="checkbox" on:change={handleCapitalsToggle} checked={$showCapitals}>
        <span class="slider round"></span>
        <span class="label">Capitals</span>
      </label>
    </div>
    <div class="dropdown-container">
      <label class="switch">
        <input type="checkbox" on:change={handleStatesToggle} checked={$showStates}>
        <span class="slider round"></span>
        <span class="label">State</span>
      </label>
    </div>
  {/if}
</div>

<!-- Page Content -->
<main class="main-content">
  <slot />
</main>

<style>
  .topbar {
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: #111;
  padding: 10px;
  color: white;
  z-index: 3;
}

.hamburger {
  font-size: 26px;
  background: none;
  color: white;
  border: none;
  cursor: pointer;
}

.brand {
  margin-left: 10px;
  font-size: 20px;
  padding-top:8px;
}

.sidenav {
  height: 100%;
  width: 200px;
  position: fixed;
  z-index: 2;
  top: 0;
  left: 0;
  background-color: #111;
  overflow-x: hidden;
  padding-top: 50px;
  transition: transform 0.3s ease;
  transform: translateX(-100%);
}

.sidenav.show {
  transform: translateX(0);
}

.sidenav a,
.dropdown-btn {
  padding: 6px 8px 6px 16px;
  font-size: 18px;
  color: #818181;
  display: block;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
}

.sidenav a:hover,
.dropdown-btn:hover {
  color: #f1f1f1;
}

.dropdown-container {
  background-color: #262626;
  padding: 8px 16px;
}

.fa-caret-down {
  float: right;
  padding-right: 8px;
}

.switch {
  position: relative;
  display: inline-block;
  width: 34px;
  height: 20px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 50px;
}

.slider:before {
  content: "";
  position: absolute;
  height: 12px;
  width: 12px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #2196F3;
}

input:checked + .slider:before {
  transform: translateX(14px);
}

.label {
  margin-left: 10px;
  color: white;
}

.main-content {
  margin-left: 0;
  padding: 90px 20px 20px; /* Increased padding-top to accommodate fixed top bar */
  transition: filter 0.3s ease;
}

.sidenav.show ~ .main-content {
  filter: brightness(0.85);
}

/* Responsive Styling */
@media screen and (max-width: 768px) {
  .topbar {
    display: flex;
  }

  .sidenav {
    transform: translateX(0);
    width: 200px;
  }

  .sidenav.show {
    transform: translateX(0);
  }

  .main-content {
    margin-left: 0;
    padding: 120px 20px 20px; /* Adjust padding-top for mobile screens */
  }
}
</style>