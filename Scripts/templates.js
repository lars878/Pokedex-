function getTypeEmoji(type) {
  const emojis = {
    fire: "🔥",
    grass: "🌿",
    water: "🌊",
    electric: "⚡",
    bug: "🧬",
    normal: "⚪",
    poison: "☠️",
    ground: "🌍",
    rock: "🪨",
    ghost: "👻",
    psychic: "🧠",
    ice: "❄️",
    dragon: "🐉",
    fairy: "✨",
    fighting: "⚔️",
    flying: "🕊️",
    dark: "🌑",
    steel: "🔩",
  };
  return emojis[type] || "❓";
}
/**
 * Erstellt die HTML-Struktur für eine kleine Pokémon-Karte
 * @param {object} pokemon - Pokémon-Daten
 * @returns {string} - HTML-String für Karte
 */
function renderPokemonCard(pokemon) {
  const types = pokemon.types
    .map((t) => {
      const typeName = t.type.name;
      const emoji = getTypeEmoji(typeName);
      return `<span class="pokemon-type">${emoji} ${capitalize(
        typeName
      )}</span>`;
    })
    .join(" ");
  // Hier wird die Hintergrundfarbe basierend auf dem ersten Typ gesetzt
  // und die Typen werden in einer Zeile angezeigt
  const bgColor = getTypeColor(pokemon.types[0].type.name);

  return `
      <div class="pokemon-card" style="background-color: ${bgColor};" onclick="openOverlay(${pokemon.id})">
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" />
        <div class="pokemon-name">${pokemon.name}</div>
        ${types}
      </div>
    `;
}
/**
 * Erstellt die HTML-Struktur für die Overlay-Ansicht
 * @param {object} pokemon - Pokémon-Daten
 * @returns {string} - HTML-String für Overlay
 */
function renderPokemonOverlay(pokemon) {
  const types = pokemon.types
    .map((t) => {
      const typeName = t.type.name;
      const emoji = getTypeEmoji(typeName);
      return `${emoji} ${capitalize(typeName)}`;
    })
    .join(", ");

  const stats = pokemon.stats
    .map((stat) => {
      const name = capitalize(stat.stat.name);
      const value = stat.base_stat;
      const percentage = (Math.min(value, 100) / 160) * 100; // Normierung auf max 150

      return `
    <div class="stat-row">
      <span class="stat-label">${name}</span>
      <div class="stat-bar-bg">
        <div class="stat-bar-fill" style="width: ${percentage}%;"></div>
      </div>
      <span class="stat-value">${value}</span>
    </div>
  `;
    })
    .join("");

  let bgStyle = "";
  if (pokemon.types.length === 1) {
    const color = getTypeColor(pokemon.types[0].type.name);
    bgStyle = `background-color: ${color};`;
  } else {
    const color1 = getTypeColor(pokemon.types[0].type.name);
    const color2 = getTypeColor(pokemon.types[1].type.name);
    bgStyle = `background: linear-gradient(135deg, ${color1}, ${color2});`;
  }

  return `
  <div class="overlay-content" style="${bgStyle}">
    <span class="overlay-close" onclick="closeOverlay()">✖</span>
    <h2>${capitalize(pokemon.name)} (ID: ${pokemon.id})</h2>
    <img src="${
      pokemon.sprites.other["official-artwork"].front_default
    }" alt="${pokemon.name}" style="width:150px;">
    <p><strong>Type:</strong> ${types}</p>
    ${stats}
    <div style="margin-top:1rem;">
      <button onclick="navigateOverlay(-1)">⬅️ Prev</button>
      <button onclick="navigateOverlay(1)">Next ➡️</button>
    </div>
  </div>
`;
}
/**
 * Gibt die Farbe passend zum Typ zurück
 * @param {string} type - Pokémon-Typ (z.B. fire, grass)
 * @returns {string} - Farbcode
 */
function getTypeColor(type) {
  const colors = {
    fire: "#FDDFDF",
    grass: "#DEFDE0",
    electric: "#FCF7DE",
    water: "#DEF3FD",
    ground: "#f4e7da",
    rock: "#d5d5d4",
    fairy: "#fceaff",
    poison: "#e0d3f0",
    bug: "#f8d5a3",
    dragon: "#97b3e6",
    psychic: "#eaeda1",
    flying: "#F5F5F5",
    fighting: "#e6e0d4",
    normal: "#F5F5F5",
    dark: "#a9a9a9",
    steel: "#c0c0c0",
    ice: "#e0f5ff",
    ghost: "#d3cce3",
  };

  return colors[type] || "#F5F5F5";
}
/**
 * Kapitalisiert den ersten Buchstaben eines Strings
 * @param {string} str
 * @returns {string}
 */
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
