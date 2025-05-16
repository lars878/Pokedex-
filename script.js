const pokemonContainer = document.getElementById("pokemonContainer");
const loadMoreBtn       = document.getElementById("loadMoreBtn");
const overlay           = document.getElementById("overlay");
const searchInput       = document.getElementById("searchInput");
let allPokemon = [], displayedPokemon = [], offset = 0, limit = 20;

const delay = ms => new Promise(res => setTimeout(res, ms));

function showFull() {
  document.getElementById("fullSpinnerOverlay").classList.remove("hidden");
  loadMoreBtn.classList.add("hidden");
}
function hideFull() {
  document.getElementById("fullSpinnerOverlay").classList.add("hidden");
  loadMoreBtn.classList.remove("hidden");
}

async function fetchAndRender(entry) {
  const details = await (await fetch(entry.url)).json();
  allPokemon.push(details);
  displayedPokemon.push(details.id);
  pokemonContainer.innerHTML += renderPokemonCard(details);
}

async function loadPokemon() {
  showFull();
  await delay(2000);
  try {
    const { results } = await (await fetch(
      `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
    )).json();
    for (const e of results) await fetchAndRender(e);
    offset += limit;
  } catch (e) {
    console.error(e);
  } finally {
    hideFull();
    loadMoreBtn.disabled = false;
  }
}

function handleSearch() {
  const q     = searchInput.value.trim().toLowerCase();
  const hint  = document.getElementById("searchHint");
  const noRes = document.getElementById("noResults");
  if (q.length < 3) {
    hint.style.visibility = "visible";
    noRes.classList.add("hidden");
    return renderAllDisplayedPokemon();
  }
  hint.style.visibility = "hidden";
  const results = allPokemon.filter(p => p.name.includes(q));
  pokemonContainer.innerHTML = results.map(renderPokemonCard).join("");
  noRes.classList.toggle("hidden", results.length > 0);
}

function openOverlay(id) {
  const i = allPokemon.findIndex(p => p.id === id);
  if (i < 0) return;
  const sel = allPokemon[i];
  overlay.innerHTML = renderPokemonOverlay(sel);
  overlay.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}
function closeOverlay() {
  overlay.classList.add("hidden");
  overlay.innerHTML = "";
  document.body.style.overflow = "";
}
function navigateOverlay(dir) {
  offset = allPokemon.length; 
  let idx = allPokemon.findIndex(p => p.id === +overlay.querySelector('h2').textContent.match(/\d+/)[0]);
  idx = (idx + dir + allPokemon.length) % allPokemon.length;
  overlay.innerHTML = renderPokemonOverlay(allPokemon[idx]);
}

function renderAllDisplayedPokemon() {
  const list = allPokemon.filter(p => displayedPokemon.includes(p.id));
  pokemonContainer.innerHTML = list.map(renderPokemonCard).join("");
}

searchInput.addEventListener("input", handleSearch);
overlay.addEventListener("click", e => {
  if (e.target === overlay) closeOverlay();
});
loadMoreBtn.addEventListener("click", loadPokemon);
