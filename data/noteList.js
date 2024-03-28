import notesData from "./notesData.js";

class NotesComponent extends HTMLElement {
  constructor() {
    super();
    this.notes = notesData;
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.renderNotes();
    this.setupFormListener();

    const link = document.createElement("link");
    link.setAttribute("rel", "stylesheet");
    link.setAttribute("href", "./css/notesComponent.css");
    this.shadowRoot.appendChild(link);
  }

  renderNotes() {
    const notesContainer = this.shadowRoot.querySelector("#notes-container");
    if (notesContainer) {
      notesContainer.remove();
    }

    const newNotesContainer = document.createElement("div");
    newNotesContainer.id = "notes-container";

    this.notes.forEach((note, index) => {
      const noteElement = this.createNoteElement(note, index);
      newNotesContainer.appendChild(noteElement);
    });

    this.shadowRoot.appendChild(newNotesContainer);
  }

  createNoteElement(note, index) {
    const noteElement = document.createElement("div");
    noteElement.classList.add("note-card");
    noteElement.innerHTML = `
      <div class="note-content">
        <h2 class="note-title">${note.title}</h2>
        <p>${note.body}</p>
        <p>Created at: ${note.createdAt}</p>
        <p>Archived: ${note.archived}</p> 
      </div>
      <div class="note-number">${index + 1}</div>
      <div class="action-buttons">
        <button class="edit-button">Edit</button>
        <button class="delete-button">Delete</button>
      </div>
      <div class="edit-form">
        <input type="text" class="edit-title" placeholder="Edit title disini yaa...">
        <textarea class="edit-body" placeholder="Edit body disini yaa..."></textarea>
        <button class="save-button">Save</button>
        <button class="cancel-button">Cancel</button>
      </div>
    `;

    const deleteButton = noteElement.querySelector(".delete-button");
    deleteButton.addEventListener("click", () => {
      this.deleteNote(index);
    });

    const editButton = noteElement.querySelector(".edit-button");
    editButton.addEventListener("click", () => {
      this.toggleEditForm(noteElement);
    });

    const saveButton = noteElement.querySelector(".save-button");
    saveButton.addEventListener("click", () => {
      this.saveEditedNote(noteElement, index);
    });

    const cancelButton = noteElement.querySelector(".cancel-button");
    cancelButton.addEventListener("click", () => {
      this.toggleEditForm(noteElement);
    });

    return noteElement;
  }

  deleteNote(index) {
    this.notes.splice(index, 1);
    this.renderNotes();
  }

  toggleEditForm(noteElement) {
    const editForm = noteElement.querySelector(".edit-form");
    editForm.style.display = editForm.style.display === "block" ? "none" : "block";

    const noteContent = noteElement.querySelector(".note-content");
    noteContent.style.display = noteContent.style.display === "none" ? "block" : "none";

    const actionButtons = noteElement.querySelector(".action-buttons");
    actionButtons.style.display = actionButtons.style.display === "none" ? "block" : "none";
  }

  saveEditedNote(noteElement, index) {
    const newTitle = noteElement.querySelector(".edit-title").value;
    const newBody = noteElement.querySelector(".edit-body").value;

    if (newTitle.trim() !== "" && newBody.trim() !== "") {
      this.notes[index].title = newTitle;
      this.notes[index].body = newBody;
      this.renderNotes();
    } else {
      alert("Title and body cannot be empty!");
    }
  }

  addNote(title, body) {
    const newNote = { title, body, createdAt: new Date().toISOString(), archived: false };
    this.notes.push(newNote);
    this.renderNotes();
  }

  setupFormListener() {
    document.addEventListener("newNoteAdded", (event) => {
      const { title, body } = event.detail;
      this.addNote(title, body);
    });
  }
}

customElements.define("notes-component", NotesComponent);
