const API_URL = "http://localhost:8080/api/books";

const bookForm = document.getElementById("bookForm");
const bookList = document.getElementById("bookList");
const searchInput = document.getElementById("searchInput");
const loading = document.getElementById("loading");
const messageBox = document.getElementById("messageBox");
const searchBtn = document.getElementById("searchBtn");
const showAllBtn = document.getElementById("showAllBtn");
const pagination = document.getElementById("pagination");

let currentPage = 1;
const booksPerPage = 6;
let allBooks = [];
let currentEditId = null;

// Bücher laden
async function loadBooks() {

    loading.classList.remove("hidden");

    try {

        const response = await fetch(API_URL);

        if (!response.ok) {

            console.error("Fehler beim Laden");

            showMessage("Bücher konnten nicht geladen werden.", "error");

            return;
        }

        const books = await response.json();

        allBooks = books;
        currentPage = 1;

        renderBooks(books);

    } catch (error) {

        console.error(error);

        showMessage("Bücher konnten nicht geladen werden.", "error");

    } finally {

        loading.classList.add("hidden");
    }
}

// Bücher anzeigen
function renderBooks(books) {
    bookList.innerHTML = "";

    if (books.length === 0) {
        bookList.innerHTML = `
            <div class="empty-state">
                Keine Bücher gefunden.
            </div>
        `;

        pagination.innerHTML = "";
        return;
    }

    const start = (currentPage - 1) * booksPerPage;
    const end = start + booksPerPage;

    const paginatedBooks = books.slice(start, end);

    paginatedBooks.forEach(book => {
        const bookCard = document.createElement("div");

        bookCard.classList.add("book-card");

        bookCard.innerHTML = `
            <h3>${book.title}</h3>

            <p><strong>Autor:</strong> ${book.author}</p>

            <p><strong>ISBN:</strong> ${book.isbn}</p>

            <p><strong>Preis:</strong> ${book.price} €</p>

            <p><strong>Jahr:</strong> ${book.publishedYear}</p>

            <div class="book-actions">

                <button class="btn edit-btn"
                        onclick="editBook(${book.id})">
                    Bearbeiten
                </button>

                <button class="btn delete-btn"
                        onclick="deleteBook(${book.id})">
                    Löschen
                </button>

            </div>
        `;

        bookList.appendChild(bookCard);
    });

    renderPagination(books);
}

// Buchdaten in Formular laden
function editBook(id) {
    const book = allBooks.find(book => book.id === id);

    if (!book) {
        showMessage("Buch wurde nicht gefunden.", "error");
        return;
    }

    document.getElementById("bookId").value = book.id;
    document.getElementById("title").value = book.title;
    document.getElementById("author").value = book.author;
    document.getElementById("isbn").value = book.isbn;
    document.getElementById("price").value = book.price;
    document.getElementById("publishedYear").value = book.publishedYear;

    currentEditId = id;

    document.getElementById("formTitle").textContent = "Buch bearbeiten";
    document.getElementById("submitBtn").textContent = "Änderungen speichern";
    document.getElementById("cancelEditBtn").classList.remove("hidden");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

// Formular zurücksetzen
function resetForm() {
    bookForm.reset();
    currentEditId = null;

    document.getElementById("bookId").value = "";
    document.getElementById("formTitle").textContent = "Neues Buch hinzufügen";
    document.getElementById("submitBtn").textContent = "Speichern";
    document.getElementById("cancelEditBtn").classList.add("hidden");
}

document.getElementById("cancelEditBtn").addEventListener("click", function () {
    resetForm();
});

function renderPagination(books) {
    pagination.innerHTML = "";

    const totalPages = Math.ceil(books.length / booksPerPage);

    if (totalPages <= 1) {
        return;
    }

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement("button");

        button.textContent = String(i);

        if (i === currentPage) {
            button.classList.add("active");
        }

        button.addEventListener("click", () => {
            currentPage = i;
            renderBooks(books);
        });

        pagination.appendChild(button);
    }
}

// Neues Buch hinzufügen oder vorhandenes Buch bearbeiten
bookForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const newBook = {
        title: document.getElementById("title").value,
        author: document.getElementById("author").value,
        isbn: document.getElementById("isbn").value,
        price: parseFloat(document.getElementById("price").value),
        publishedYear: parseInt(document.getElementById("publishedYear").value)
    };

    try {
        const url = currentEditId ? `${API_URL}/${currentEditId}` : API_URL;
        const method = currentEditId ? "PUT" : "POST";

        const response = await fetch(url, {
            method: method,

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(newBook)
        });

        if (!response.ok) {
            const errorData = await response.json();

            if (errorData.message) {
                showMessage(errorData.message, "error");

            } else if (errorData.messages) {
                const firstError = Object.values(errorData.messages)[0];
                showMessage(firstError, "error");

            } else {
                showMessage("Buch konnte nicht gespeichert werden.", "error");
            }

            return;
        }

        if (currentEditId) {
            showMessage("Buch erfolgreich aktualisiert.", "success");
        } else {
            showMessage("Buch erfolgreich gespeichert.", "success");
        }

        resetForm();
        await loadBooks();

    } catch (error) {
        showMessage("Verbindung zum Backend fehlgeschlagen.", "error");
    }
});

// Buch löschen
async function deleteBook(id) {

    const confirmed = confirm(
        "Möchtest du dieses Buch wirklich löschen?"
    );

    if (!confirmed) {
        return;
    }

    try {

        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {

            console.error("Fehler beim Löschen");

            showMessage(
                "Buch konnte nicht gelöscht werden.",
                "error"
            );

            return;
        }

        showMessage(
            "Buch erfolgreich gelöscht.",
            "success"
        );

        await loadBooks();

    } catch (error) {

        console.error(error);

        showMessage(
            "Buch konnte nicht gelöscht werden.",
            "error"
        );
    }
}
// Suche
searchBtn.addEventListener("click", async function () {
    const keyword = searchInput.value.trim();

    if (keyword === "") {
        showMessage("Bitte Suchbegriff eingeben.", "error");
        return;
    }

    loading.classList.remove("hidden");

    try {
        const response = await fetch(
            `${API_URL}/suche?keyword=${encodeURIComponent(keyword)}`
        );

        if (!response.ok) {
            showMessage("Suche fehlgeschlagen.", "error");
            return;
        }

        const books = await response.json();

        allBooks = books;
        currentPage = 1;

        renderBooks(books);

    } catch (error) {
        showMessage("Verbindung zum Backend fehlgeschlagen.", "error");

    } finally {
        loading.classList.add("hidden");
    }
});


// Alle Bücher anzeigen
showAllBtn.addEventListener("click", async function () {

    searchInput.value = "";

    resetForm();

    await loadBooks();
});

// Nachrichten anzeigen
function showMessage(message, type) {
    messageBox.textContent = message;
    messageBox.className = `message ${type}`;

    setTimeout(() => {
        messageBox.className = "message hidden";
    }, 3000);
}

// Beim Start keine Bücher automatisch laden
bookList.innerHTML = `
    <div class="empty-state">
        Bitte suche ein Buch oder klicke auf „Alle Bücher anzeigen“.
    </div>
`;