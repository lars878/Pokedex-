const pokemonContainer = document.getElementById("pokemonContainer");
const loadMoreBtn = document.getElementById("loadMoreBtn");
const spinner = document.getElementById("spinner");
const overlay = document.getElementById("overlay");
const searchInput = document.getElementById("searchInput");

let allPokemon = []; 
let displayedPokemon = []; 
let offset = 0;
const limit = 20;
let currentOverlayIndex = 0;

async function fetchAndRender(entry) {
  const details = await (await fetch(entry.url)).json();
  allPokemon.push(details);
  displayedPokemon.push(details.id);
  pokemonContainer.innerHTML += renderPokemonCard(details);
}

async function loadPokemon() {
  toggleLoading(true);
  loadMoreBtn.disabled = true;

  try {
    const { results } = await (
      await fetch(
        `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
      )
    ).json();

    await new Promise((resolve) => setTimeout(resolve, 1000));

    for (const entry of results) {
      await fetchAndRender(entry);
    }
    offset += limit;
  } catch (err) {
    console.error("Fehler beim Laden:", err);
  } finally {
    toggleLoading(false);
    loadMoreBtn.disabled = false;
  }
}
/**
 * Spinner hide/show
 */
function toggleLoading(show) {
  spinner.classList.toggle("hidden", !show);
}
/**
 * open Overlay with Pokemon details
 */
function openOverlay(id) {
  const index = allPokemon.findIndex((p) => p.id === id);
  if (index === -1) return;
  currentOverlayIndex = index;

  const selected = allPokemon[index];
  overlay.innerHTML = renderPokemonOverlay(selected);
  overlay.classList.remove("hidden");
  document.body.style.overflow = "hidden"; 
}
/**
 * close Overlay
 */
function closeOverlay() {
  overlay.classList.add("hidden");
  overlay.innerHTML = "";
  document.body.style.overflow = "";
}
/**
 * navigates through the overlay
 */
function navigateOverlay(direction) {
  currentOverlayIndex += direction;

  if (currentOverlayIndex < 0) currentOverlayIndex = allPokemon.length - 1;
  if (currentOverlayIndex >= allPokemon.length) currentOverlayIndex = 0;

  const selected = allPokemon[currentOverlayIndex];
  overlay.innerHTML = renderPokemonOverlay(selected);
}
/**
 * shows all Pokemon in the overlay
 */
function renderAllDisplayedPokemon() {
  const filtered = allPokemon.filter((p) => displayedPokemon.includes(p.id));
  pokemonContainer.innerHTML = filtered
    .map((p) => renderPokemonCard(p))
    .join("");
}