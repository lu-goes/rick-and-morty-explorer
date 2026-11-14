const API_BASE = "https://rickandmortyapi.com/api";
const characterGrid = document.getElementById("character-grid");
const searchInput = document.getElementById("search-input");
const statusFilter = document.getElementById("status-filter");
const resetButton = document.getElementById("reset-button");
const prevButton = document.getElementById("prev-button");
const nextButton = document.getElementById("next-button");
const resultsMessage = document.getElementById("results-message");
const pageIndicator = document.getElementById("page-indicator");
const paginationLabel = document.getElementById("pagination-label");

let currentPage = 1;
let totalPages = 1;
let searchTimer = null;

function translateStatus(status) {
  const translations = { alive: "Vivo", dead: "Morto", unknown: "Desconhecido" };
  return translations[status.toLowerCase()] || status;
}

function createCharacterCard(character) {
  // Cada card é criado dinamicamente a partir de um objeto recebido da API.
  const card = document.createElement("article");
  card.classList.add("character-card");

  const imageWrap = document.createElement("div");
  imageWrap.classList.add("card-image-wrap");

  const image = document.createElement("img");
  image.classList.add("card-image");
  image.src = character.image;
  image.alt = `Imagem de ${character.name}`;
  image.loading = "lazy";

  const id = document.createElement("span");
  id.classList.add("card-id");
  id.textContent = `#${String(character.id).padStart(3, "0")}`;

  imageWrap.appendChild(image);
  imageWrap.appendChild(id);

  const content = document.createElement("div");
  content.classList.add("card-content");

  const name = document.createElement("h3");
  name.classList.add("card-name");
  name.textContent = character.name;

  const statusLine = document.createElement("p");
  statusLine.classList.add("card-meta");
  const statusDot = document.createElement("span");
  statusDot.classList.add("status-dot-card", character.status.toLowerCase());
  const statusText = document.createElement("span");
  statusText.textContent = `${translateStatus(character.status)} · ${character.species}`;
  statusLine.appendChild(statusDot);
  statusLine.appendChild(statusText);

  const gender = document.createElement("p");
  gender.classList.add("card-meta");
  gender.textContent = `Gênero: ${character.gender === "unknown" ? "Desconhecido" : character.gender}`;

  const origin = document.createElement("div");
  origin.classList.add("card-origin");
  origin.textContent = `ORIGEM: ${character.origin.name}`;

  content.appendChild(name);
  content.appendChild(statusLine);
  content.appendChild(gender);
  content.appendChild(origin);

  card.appendChild(imageWrap);
  card.appendChild(content);
  return card;
}

function showMessage(message, className = "empty-state") {
  characterGrid.replaceChildren();
  const messageElement = document.createElement("div");
  messageElement.classList.add(className);
  messageElement.textContent = message;
  characterGrid.appendChild(messageElement);
}

async function loadCharacters(page = 1) {
  currentPage = page;
  characterGrid.replaceChildren();
  showMessage("Estabelecendo conexão interdimensional...", "loading-state");
  const loader = document.createElement("div");
  loader.classList.add("loader");
  characterGrid.querySelector(".loading-state").prepend(loader);

  const params = new URLSearchParams({ page: String(page) });
  const name = searchInput.value.trim();
  const status = statusFilter.value;
  if (name) params.set("name", name);
  if (status) params.set("status", status);

  try {
    // Fetch realiza a requisição HTTP à API; a resposta é convertida para JSON.
    const response = await fetch(`${API_BASE}/character/?${params.toString()}`);

    if (!response.ok) {
      if (response.status === 404) {
        showMessage("Nenhum personagem encontrado. Tente outro nome ou filtro.");
        resultsMessage.textContent = "0 personagens encontrados";
        updatePagination(null);
        return;
      }
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const data = await response.json();
    characterGrid.replaceChildren();

    data.results.forEach((character) => {
      const card = createCharacterCard(character);
      characterGrid.appendChild(card);
    });

    totalPages = data.info.pages;
    resultsMessage.textContent = `${data.info.count} personagens encontrados`;
    pageIndicator.textContent = `${data.results.length} exibidos nesta página`;
    updatePagination(data.info);
  } catch (error) {
    console.error("Falha ao consultar a API:", error);
    showMessage("Não foi possível carregar os personagens. Verifique sua conexão e tente novamente.", "error-state");
    resultsMessage.textContent = "Falha na conexão";
    updatePagination(null);
  }
}

function updatePagination(info) {
  prevButton.disabled = !info || !info.prev;
  nextButton.disabled = !info || !info.next;
  paginationLabel.textContent = info ? `Página ${currentPage} de ${totalPages}` : "Sem páginas";
}

async function loadStatistics() {
  try {
    const [charactersResponse, locationsResponse, episodesResponse] = await Promise.all([
      fetch(`${API_BASE}/character`),
      fetch(`${API_BASE}/location`),
      fetch(`${API_BASE}/episode`)
    ]);
    if (!charactersResponse.ok || !locationsResponse.ok || !episodesResponse.ok) {
      throw new Error("Não foi possível carregar as estatísticas.");
    }
    const [characters, locations, episodes] = await Promise.all([
      charactersResponse.json(), locationsResponse.json(), episodesResponse.json()
    ]);
    document.getElementById("stat-characters").textContent = characters.info.count.toLocaleString("pt-BR");
    document.getElementById("stat-locations").textContent = locations.info.count.toLocaleString("pt-BR");
    document.getElementById("stat-episodes").textContent = episodes.info.count.toLocaleString("pt-BR");
  } catch (error) {
    console.error("Falha ao carregar estatísticas:", error);
    document.getElementById("stat-characters").textContent = "—";
    document.getElementById("stat-locations").textContent = "—";
    document.getElementById("stat-episodes").textContent = "—";
  }
}

searchInput.addEventListener("input", () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => loadCharacters(1), 450);
});
statusFilter.addEventListener("change", () => loadCharacters(1));
resetButton.addEventListener("click", () => {
  searchInput.value = "";
  statusFilter.value = "";
  loadCharacters(1);
});
prevButton.addEventListener("click", () => {
  if (currentPage > 1) loadCharacters(currentPage - 1);
});
nextButton.addEventListener("click", () => {
  if (currentPage < totalPages) loadCharacters(currentPage + 1);
});

// Inicialização: carrega estatísticas e primeira página de personagens.
loadStatistics();
loadCharacters();
