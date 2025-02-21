//Elementos
const notesContainer = document.querySelector("#notes-container");
const noteInput = document.querySelector("#note-content");
const addNoteBtn = document.querySelector("#add-note");
const searchInput = document.querySelector("#search-input");
const exportBtn = document.querySelector("#export-notes");

//funções
function showNote()  {
    cleanNotes();

    getNotes().forEach((note) => {
        const noteElement = createNote(note.id, note.content, note.fixed);

        notesContainer.appendChild(noteElement);
    })
}

function cleanNotes () {
    notesContainer.replaceChildren([])
}

function addNote() {
    const notes = getNotes();

    const noteObject = {
        id: generatedId(),
        content: noteInput.value,
        fixed: false,
    }

    const noteElement = createNote(noteObject.id, noteObject.content);
    notesContainer.appendChild(noteElement);

    notes.push(noteObject);

    saveNotes(notes);

    noteInput.value = "";
}

//funções da local storage
function saveNotes(notes) {
    localStorage.setItem("notes", JSON.stringify(notes));
}

function getNotes(){
    const notes = JSON.parse(localStorage.getItem("notes") || "[]")

    const orderedNotes = notes.sort((a, b) => a.fixed > b.fixed ? -1: 1);

    return notes;
}
/*-----------------------*/

function createNote(id, content, fixed) {

    const element = document.createElement("div")
    element.classList.add("note")

    const textarea = document.createElement("textarea")
    textarea.value = content

    textarea.placeholder = "Adicione algum texto..."
    element.appendChild(textarea)

    const pinIcon = document.createElement("i")
    pinIcon.classList.add(...["fa-solid"], ["fa-thumbtack"])

    element.appendChild(pinIcon);

    const deleteIcon = document.createElement("i")
    deleteIcon.classList.add(...["fa-solid"], ["fa-xmark"])

    element.appendChild(deleteIcon);

    const duplicateIcon = document.createElement("i")
    duplicateIcon.classList.add(...["fa-solid"], ["fa-file-circle-plus"])

    element.appendChild(duplicateIcon);

    if(fixed) {
        element.classList.add("fixed");
    };

    //Eventos do elemento
    element.querySelector("textarea").addEventListener("keyup", (e) => {
        const noteContent = e.target.value;

        updateNotes(id, noteContent);
    })

    element.querySelector(".fa-thumbtack").addEventListener("click", () => {
        toggleFixNote(id);
    })

    element.querySelector(".fa-xmark").addEventListener("click", () => {
        deleteNote(id, element);
    })

    element.querySelector(".fa-file-circle-plus").addEventListener("click", () => {
        copyNote(id, element)
    })

    return element;
}

function updateNotes(id, newContent){
    const notes = getNotes();

    const targetNote = notes.filter((note) => note.id === id)[0];

    targetNote.content = newContent;

    saveNotes(notes);

}

function deleteNote(id, element) {
    const notes = getNotes().filter((note) => note.id !== id)

    saveNotes(notes)

    notesContainer.removeChild(element);
}

function copyNote(id) {
    const notes = getNotes();

    const targetNote = notes.filter((note) => note.id === id)[0]

    const noteObject = {
        id: generatedId(),
        content: targetNote.content,
        fixed: false,
    }

    const noteElement = createNote(noteObject.id, noteObject.content, noteObject.fixed);

    notesContainer.appendChild(noteElement);

    notes.push(noteObject);

    saveNotes(notes);
}

function toggleFixNote (id) {
    const note = getNotes()

    const targetNote = note.filter((note) => note.id === id)[0]

    targetNote.fixed = ! targetNote.fixed;

    saveNotes(note);
    showNote();
}

function generatedId () {
    return Math.floor(Math.random() * 5000);
}

function searchNotes (search) {
    const searchResults = getNotes().filter((notes) => {
        return notes.content.includes(search);
    })

    if( search !== ""){
        cleanNotes()

        searchResults.forEach((note) => {
            const noteElement = createNote(note.id, note.content)
            notesContainer.appendChild(noteElement)
        });

        return;
    }

    cleanNotes();
    showNote();
}

function exportDate (){
    const notes = getNotes()

    // separa o dado por , quebra linha \n

    const csvString = [
        ["ID", "Conteúdo", "Fixado?"],
        ...notes.map((note) => [note.id, note.content, note.fixed])
    ].map((e) => e.join(",")).join("\n");

    const element = document.createElement("a");

    element.href = "data:text/csv;charset=utf-8," + encodeURI(csvString);

    element.target = "_blank";

    element.download = "notes.csv";

    element.click();
}

//eventos
addNoteBtn.addEventListener("click", () => addNote());

searchInput.addEventListener("keyup", (e) => {
    const search = e.target.value;
    searchNotes(search);
})

noteInput.addEventListener("keydown", (e) => {
    if(e.key === "Enter") {
        addNote();
    }
} )

exportBtn.addEventListener("click", () => {
    exportDate();
})
//inicialização
showNote();