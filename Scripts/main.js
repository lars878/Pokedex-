const pokemonContainer = document.getElementById("pokemonContainer");
const loadMoreBtn = document.getElementById("loadMoreBtn");
const spinner = document.getElementById("spinner");
const overlay = document.getElementById("overlay");
const searchInput = document.getElementById("searchInput");

let allPokemon = [];         // Für Suche und Navigation
let displayedPokemon = [];   // ID-Tracking der angezeigten Pokémon
let offset = 0;
const limit = 20;
let currentOverlayIndex = 0;

async function loadPokemon() {
  toggleLoading(true); // Spinner EIN
  loadMoreBtn.disabled = true;

  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
    const data = await response.json();

    for (let entry of data.results) {
      const details = await fetch(entry.url).then(res => res.json());
      allPokemon.push(details);
      displayedPokemon.push(details.id);
      pokemonContainer.innerHTML += renderPokemonCard(details);
    }

    offset += limit;
  } catch (error) {
    console.error("Fehler beim Laden der Pokémon:", error);
  } finally {
    toggleLoading(false); // Spinner AUS
    loadMoreBtn.disabled = false;
  }
}

/**
 * Spinner anzeigen/verstecken
 */
function toggleLoading(show) {
  spinner.classList.toggle("hidden", !show);
}

/**
 * Overlay öffnen mit Detailinformationen
 */
function openOverlay(id) {
  const index = allPokemon.findIndex(p => p.id === id);
  if (index === -1) return;
  currentOverlayIndex = index;

  const selected = allPokemon[index];
  overlay.innerHTML = renderPokemonOverlay(selected);
  overlay.classList.remove("hidden");
  document.body.style.overflow = "hidden"; // Scrollsperre
}

/**
 * Overlay schließen
 */
function closeOverlay() {
  overlay.classList.add("hidden");
  overlay.innerHTML = "";
  document.body.style.overflow = "";
}

/**
 * Zwischen Pokémon im Overlay wechseln
 */
function navigateOverlay(direction) {
  currentOverlayIndex += direction;

  if (currentOverlayIndex < 0) currentOverlayIndex = allPokemon.length - 1;
  if (currentOverlayIndex >= allPokemon.length) currentOverlayIndex = 0;

  const selected = allPokemon[currentOverlayIndex];
  overlay.innerHTML = renderPokemonOverlay(selected);
}

/**
 * Pokémon nach Name filtern (mindestens 3 Buchstaben)
 */
searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim().toLowerCase();
  const hint = document.getElementById("searchHint");
  const noResults = document.getElementById("noResults");

  if (query.length < 3) {
    hint.style.visibility = "visible";
    noResults.classList.add("hidden");
    renderAllDisplayedPokemon();
    return;
  }

  hint.style.visibility = "hidden";

  const results = allPokemon.filter(p => p.name.includes(query));
  pokemonContainer.innerHTML = results.map(p => renderPokemonCard(p)).join('');

  if (results.length === 0) {
    noResults.classList.remove("hidden");
  } else {
    noResults.classList.add("hidden");
  }
});

/**
 * Zeigt alle bisher geladenen Pokémon wieder an
 */
function renderAllDisplayedPokemon() {
  const filtered = allPokemon.filter(p => displayedPokemon.includes(p.id));
  pokemonContainer.innerHTML = filtered.map(p => renderPokemonCard(p)).join('');
}

/**
 * Klick außerhalb des Overlays schließt es
 */
overlay.addEventListener("click", (event) => {
  if (event.target === overlay) {
    closeOverlay();
  }
});

loadMoreBtn.addEventListener("click", loadPokemon);

// Initialer Ladevorgang
loadPokemon();
