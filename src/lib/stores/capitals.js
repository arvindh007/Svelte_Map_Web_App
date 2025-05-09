import { writable } from 'svelte/store';

// Create a store for tracking whether to show capitals
export const showCapitals = writable(false); // Default state is false (not showing capitals)