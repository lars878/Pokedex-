/**
 * Pokémon filterd by name
 */
searchInput.addEventListener("input", handleSearch);

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

overlay.addEventListener("click", (event) => {
  if (event.target === overlay) {
    closeOverlay();
  }
});

loadMoreBtn.addEventListener("click", loadPokemon);

loadPokemon();