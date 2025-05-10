import { writable } from 'svelte/store';

// Create a store to track if the state has been manually changed by user interaction
// export const userInteracted = writable(false);

// Create a store to track if the map has been initialized
export const mapInitialized = writable(false);