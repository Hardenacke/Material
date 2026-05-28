let allMaterials = [];
let currentSubject = "Alle";
let currentClass = "Alle";

const app = document.getElementById("app");
const resultInfo = document.getElementById("resultInfo");
const subjectFilters = document.getElementById("subjectFilters");
const classFilters = document.getElementById("classFilters");
const searchInput = document.getElementById("searchInput");
const resetButton = document.getElementById("resetButton");

fetch("data.json")
  .then(response => {
    if (!response.ok) {
      throw new Error("data.json konnte nicht geladen werden.");
    }
    return response.json();
  })
  .then(data => {
    allMaterials = flattenMaterials(data);
    buildFilters();
    renderMaterials();
  })
  .catch(error => {
    app.innerHTML = `<div class="card"><h3>Fehler</h3><p>${error.message}</p></div>`;
    resultInfo.textContent = "Die Materialdaten konnten nicht geladen werden.";
  });

function flattenMaterials(data) {
  const output = [];

  data.faecher.forEach(fach => {
    fach.klassen.forEach(klasse => {
      klasse.themen.forEach(thema => {
        output.push({
          fach: fach.name,
          klasse: klasse.name,
          titel: thema.titel,
          beschreibung: thema.beschreibung,
          tags: thema.tags || [],
          links: thema.links || []
        });
      });
    });
  });

  return output;
}

function buildFilters() {
  const subjects = ["Alle", ...new Set(allMaterials.map(item => item.fach))];
  const classes = ["Alle", ...new Set(allMaterials.map(item => item.klasse))];

  subjectFilters.innerHTML = "<h3>Fach</h3>" + subjects.map(subject => {
    return `<button class="filter-button ${subject === currentSubject ? "active" : ""}" data-subject="${subject}">${subject}</button>`;
  }).join("");

  classFilters.innerHTML = "<h3>Klasse</h3>" + classes.map(klasse => {
    return `<button class="filter-button ${klasse === currentClass ? "active" : ""}" data-class="${klasse}">${klasse}</button>`;
  }).join("");

  document.querySelectorAll("[data-subject]").forEach(button => {
    button.addEventListener("click", () => {
      currentSubject = button.dataset.subject;
      buildFilters();
      renderMaterials();
    });
  });

  document.querySelectorAll("[data-class]").forEach(button => {
    button.addEventListener("click", () => {
      currentClass = button.dataset.class;
      buildFilters();
      renderMaterials();
    });
  });
}

function renderMaterials() {
  const query = searchInput.value.trim().toLowerCase();

  const filtered = allMaterials.filter(item => {
    const matchesSubject = currentSubject === "Alle" || item.fach === currentSubject;
    const matchesClass = currentClass === "Alle" || item.klasse === currentClass;
    const haystack = [
      item.fach,
      item.klasse,
      item.titel,
      item.beschreibung,
      ...item.tags
    ].join(" ").toLowerCase();
    const matchesSearch = query === "" || haystack.includes(query);

    return matchesSubject && matchesClass && matchesSearch;
  });

  resultInfo.textContent = `${filtered.length} Materialbereich${filtered.length === 1 ? "" : "e"} gefunden.`;

  if (filtered.length === 0) {
    app.innerHTML = `<div class="card"><h3>Keine Treffer</h3><p>Ändere die Suche oder setze die Filter zurück.</p></div>`;
    return;
  }

  app.innerHTML = filtered.map(item => createCard(item)).join("");
}

function createCard(item) {
  const badges = [item.fach, item.klasse, ...item.tags.slice(0, 3)]
    .map(tag => `<span class="badge">${tag}</span>`)
    .join("");

  const links = item.links.map(link => {
    const cssClass = link.typ.toLowerCase().includes("pdf") ? "button secondary" : "button";
    return `<a class="${cssClass}" href="${link.url}">${link.typ}: ${link.titel}</a>`;
  }).join("");

  return `
    <article class="card">
      <div class="card-top">
        <div>
          <div class="badges">${badges}</div>
          <h3>${item.titel}</h3>
        </div>
      </div>
      <p>${item.beschreibung}</p>
      <div class="links">${links}</div>
    </article>
  `;
}

searchInput.addEventListener("input", renderMaterials);

resetButton.addEventListener("click", () => {
  currentSubject = "Alle";
  currentClass = "Alle";
  searchInput.value = "";
  buildFilters();
  renderMaterials();
});
