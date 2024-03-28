class AddNoteForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.maxNotes = this.getAttribute("max-notes") || 10;
    this.notes = [];

    const linkElem = document.createElement("link");
    linkElem.setAttribute("rel", "stylesheet");
    linkElem.setAttribute("href", "./css/addNoteForm.css");
    this.shadowRoot.appendChild(linkElem);
  }

  connectedCallback() {
    this.renderForm();
    this.setupFormSubmission();
  }

  renderForm() {
    const modal = document.createElement("div");
    modal.innerHTML = `
        <div id="myModal" class="modal">
        <div class="modal-content">
          <div class="modal-title">SILAHKAN ISI DENGAN DATA YANG BENAR & VALID</div>
          <span class="close">&times;</span>
          <form id="noteForm">
            <div class="form-group">
              <label for="title">Judul:</label>
              <input type="text" id="title" name="title" placeholder="Masukkan judul catatan" required minlength="0" maxlength="50">
            </div>
            <div class="form-group">
              <label for="body">Isi:</label>
              <textarea id="body" name="body" placeholder="Masukkan isi catatan" rows="4" required minlength="0" maxlength="500"></textarea>
            </div>
            <button type="submit" class="add-note-button">Simpan Catatan</button>
            <div id="error-message"></div>
          </form>
        </div>
      </div>
      
      `;

    this.shadowRoot.appendChild(modal);

    const openModalButton = document.createElement("button");
    openModalButton.textContent = "+ Tambahkan Catatan";
    openModalButton.classList.add("add-note-button");
    openModalButton.addEventListener("click", () => {
      const modal = this.shadowRoot.querySelector(".modal");
      modal.style.display = "block";
    });
    this.shadowRoot.appendChild(openModalButton);

    const closeButton = modal.querySelector(".close");
    closeButton.addEventListener("click", () => {
      const modal = this.shadowRoot.querySelector(".modal");
      modal.style.display = "none";
    });

    window.addEventListener("click", (event) => {
      const modal = this.shadowRoot.querySelector(".modal");
      if (event.target == modal) {
        modal.style.display = "none";
      }
    });

    const form = modal.querySelector("#noteForm");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const errorMessage = modal.querySelector("#error-message");
      if (form.checkValidity()) {
        const formData = new FormData(form);
        const title = formData.get("title");
        const body = formData.get("body");
        this.notes.push({ title, body });
        const eventToAddNote = new CustomEvent("newNoteAdded", { detail: { title, body } });
        document.dispatchEvent(eventToAddNote);
        form.reset();
        errorMessage.textContent = "";

        Swal.fire({
          icon: "success",
          title: "Catatan berhasil ditambahkan!",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          customClass: {
            popup: "swal2-popup-custom",
            title: "swal2-title-custom",
          },
          showClass: {
            popup: "swal2-show-custom",
          },
          hideClass: {
            popup: "swal2-hide-custom",
          },
        });

        const modal = this.shadowRoot.querySelector(".modal");
        modal.style.display = "none";

        openModalButton.style.display = "block";
      } else {
        errorMessage.textContent = "Harap isi kedua bidang dengan benar.";
      }
    });
  }
}

customElements.define("add-note-form", AddNoteForm);
