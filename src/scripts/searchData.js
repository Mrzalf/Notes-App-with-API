import notesData from "./notesData.js";

class SearchComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.notesContainer = null;

    const linkElem = document.createElement("link");
    linkElem.setAttribute("rel", "stylesheet");
    linkElem.setAttribute("href", "./css/searchComponent.css");
    this.shadowRoot.appendChild(linkElem);
  }

  connectedCallback() {
    this.renderSearchBar();
    this.setupSearchListener();
  }

  renderSearchBar() {
    const searchBar = document.createElement("div");
    searchBar.innerHTML = `
      <form class="d-flex" role="search">
        <input class="form-control me-2" type="search" id="searchInput" placeholder="Cari Judul Catatan disini..." aria-label="Search">
      </form>
    `;

    this.shadowRoot.appendChild(searchBar);
  }

  setupSearchListener() {
    const searchInput = this.shadowRoot.getElementById("searchInput");

    searchInput.addEventListener("input", () => {
      const searchTerm = searchInput.value.toLowerCase();

      if (!this.notesContainer) {
        this.notesContainer = document.querySelector("notes-component").shadowRoot.getElementById("notes-container");
      }

      Array.from(this.notesContainer.children).forEach((noteElement) => {
        const title = noteElement.querySelector("h2").textContent.toLowerCase();
        if (title.includes(searchTerm)) {
          noteElement.style.display = "block";
        } else {
          noteElement.style.display = "none";
        }
      });
    });
  }
}

customElements.define("search-component", SearchComponent);

class NotesComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const notesContainer = this.shadowRoot.getElementById("notes-container");
    notesContainer.innerHTML = "";

    const searchTerm = this.getAttribute("search-term").toLowerCase();

    notesData.forEach((note) => {
      const noteElement = document.createElement("div");
      noteElement.innerHTML = `
        <h2>${note.title}</h2>
        <p>${note.body}</p>
      `;
      if (note.title.toLowerCase().includes(searchTerm) || note.body.toLowerCase().includes(searchTerm)) {
        noteElement.style.display = "block";
      } else {
        noteElement.style.display = "none";
      }
      notesContainer.appendChild(noteElement);
    });
  }
}

customElements.define("notes-component", NotesComponent);

const notesComponent = document.querySelector("notes-component");
notesComponent.setAttribute("search-term", "");
notesComponent.render();
