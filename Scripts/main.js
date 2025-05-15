/**
 * Pokémon nach Name filtern (mindestens 3 Buchstaben)
 */
// Event‑Binding
searchInput.addEventListener("input", handleSearch);

// Handler ausgelagert
function handleSearch() {
  const q = searchInput.value.trim().toLowerCase();
  const hint = document.getElementById("searchHint");
  const noRes = document.getElementById("noResults");

  if (q.length < 3) return showHint(hint, noRes);

  hideElement(hint);
  const results = allPokemon.filter(p => p.name.includes(q));
  renderResults(results);
  toggleNoResults(results.length === 0, noRes);
}

// Helfer
function showHint(hint, noRes) {
  hint.style.visibility = "visible";
  noRes.classList.add("hidden");
  renderAllDisplayedPokemon();
}

function renderResults(list) {
  pokemonContainer.innerHTML = list.map(renderPokemonCard).join("");
}

function toggleNoResults(empty, noRes) {
  noRes.classList[empty ? "remove" : "add"]("hidden");
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
