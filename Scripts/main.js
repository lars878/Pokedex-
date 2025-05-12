
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
