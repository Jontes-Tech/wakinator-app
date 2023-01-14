import { writable } from "svelte/store"

export const devMode = writable((localStorage.getItem("devMode") === "true") || false);

devMode.subscribe((value) => (localStorage.devMode = value));
