// BookReview - JavaScript de baza pentru Tema 1.
// IMPORTANT: localStorage salveaza date in browser, NU intr-o baza de date reala.

const STORAGE_KEY = "bookreview_recenzii";

// Asociem codul din formular cu titlul afisat utilizatorului.
const BOOK_NAMES = {
  crima: "Crimă și pedeapsă",
  "1984": "1984",
  mandrie: "Mândrie și prejudecată",
  idiotul: "Idiotul",
  "micul-print": "Micul prinț",
  dorian: "Portretul lui Dorian Gray"
};

// Citeste din memoria locala. Daca nu exista recenzii, intoarce o lista goala.
function getReviews() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(data) ? data : [];
  } catch (error) {
    return [];
  }
}

// Transforma lista in text JSON si o salveaza in browser.
function saveReviews(reviews) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
}

// PAGINA CĂRȚI: filtrele cauta in cardurile existente in HTML.
function initCatalog() {
  const searchInput = document.getElementById("searchInput");
  const genreFilter = document.getElementById("genreFilter");
  if (!searchInput || !genreFilter) return;

  const cards = document.querySelectorAll(".book-item");
  const counter = document.getElementById("resultsCount");
  const noResults = document.getElementById("noResults");

  function filterBooks() {
    const query = searchInput.value.toLocaleLowerCase("ro-RO").trim();
    const genre = genreFilter.value;
    let visible = 0;

    cards.forEach(function (card) {
      const title = card.dataset.title.toLocaleLowerCase("ro-RO");
      const author = card.dataset.author.toLocaleLowerCase("ro-RO");
      const matchesText = title.includes(query) || author.includes(query);
      const matchesGenre = genre === "toate" || card.dataset.genre === genre;
      const show = matchesText && matchesGenre;

      card.hidden = !show;
      if (show) visible++;
    });

    counter.textContent = visible + (visible === 1 ? " carte găsită" : " cărți găsite");
    noResults.hidden = visible > 0;
  }

  searchInput.addEventListener("input", filterBooks);
  genreFilter.addEventListener("change", filterBooks);
}

// Creeaza un element HTML in siguranta, folosind textContent in loc de innerHTML.
function makeElement(tag, cssClass, value) {
  const element = document.createElement(tag);
  if (cssClass) element.className = cssClass;
  if (value !== undefined) element.textContent = value;
  return element;
}

// PAGINA RECENZII: afiseaza recenziile adaugate de student.
function initReviewList() {
  const container = document.getElementById("myReviews");
  if (!container) return;

  const empty = document.getElementById("myReviewsEmpty");
  const savedMessage = document.getElementById("savedMessage");
  const params = new URLSearchParams(window.location.search);

  if (params.has("salvat")) savedMessage.hidden = false;

  function renderReviews() {
    const reviews = getReviews();
    container.replaceChildren();
    empty.hidden = reviews.length > 0;

    reviews.forEach(function (review) {
      const column = makeElement("div", "col-md-6");
      const article = makeElement("article", "review-card h-100");
      const stars = makeElement("span", "stars", "★".repeat(review.rating) + "☆".repeat(5 - review.rating));
      stars.setAttribute("aria-label", review.rating + " din 5 stele");
      const heading = makeElement("h3", "", review.title);
      const description = makeElement("p", "", review.text);
      const bottom = makeElement("div", "review-bottom");
      const author = makeElement("span", "", review.name + " · " + (BOOK_NAMES[review.book] || "Carte necunoscută"));
      const pill = makeElement("span", "review-label", "Recenzia mea");
      bottom.append(author, pill);

      const actions = makeElement("div", "review-actions");
      const editLink = makeElement("a", "action-button", "Editează");
      editLink.href = "adauga-recenzie.html?edit=" + encodeURIComponent(review.id);
      const deleteButton = makeElement("button", "action-button danger", "Șterge");
      deleteButton.type = "button";

      deleteButton.addEventListener("click", function () {
        const confirmed = window.confirm("Sigur vrei să ștergi această recenzie?");
        if (!confirmed) return;
        const newList = getReviews().filter(function (item) { return item.id !== review.id; });
        try {
          saveReviews(newList);
          renderReviews();
        } catch (error) {
          window.alert("Recenzia nu a putut fi ștearsă în acest browser.");
        }
      });

      actions.append(editLink, deleteButton);
      article.append(stars, heading, description, bottom, actions);
      column.appendChild(article);
      container.appendChild(column);
    });
  }

  renderReviews();
}

// PAGINA FORMULAR: valideaza datele si permite adaugare / modificare.
function initReviewForm() {
  const form = document.getElementById("reviewForm");
  if (!form) return;

  const nameInput = document.getElementById("reviewName");
  const bookInput = document.getElementById("reviewBook");
  const ratingInput = document.getElementById("reviewRating");
  const titleInput = document.getElementById("reviewTitle");
  const textInput = document.getElementById("reviewText");
  const errorBox = document.getElementById("formError");
  const params = new URLSearchParams(window.location.search);
  const editId = params.get("edit");
  const chosenBook = params.get("carte");

  if (chosenBook && BOOK_NAMES[chosenBook]) bookInput.value = chosenBook;

  // Daca venim de la butonul Editeaza, incarcam datele vechi in formular.
  if (editId) {
    const current = getReviews().find(function (item) { return item.id === editId; });
    if (current) {
      nameInput.value = current.name;
      bookInput.value = current.book;
      ratingInput.value = String(current.rating);
      titleInput.value = current.title;
      textInput.value = current.text;
      document.getElementById("formPageTitle").textContent = "Editează recenzia.";
      document.getElementById("saveReviewButton").firstChild.textContent = "Actualizează recenzia ";
    } else {
      errorBox.textContent = "Recenzia pe care vrei să o editezi nu a fost găsită.";
      errorBox.hidden = false;
    }
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault(); // Opreste reincarcarea automata a paginii.

    // Validarea HTML (required / minlength) se completeaza cu verificarea JS.
    if (!form.checkValidity()) {
      errorBox.textContent = "Completează toate câmpurile și respectă lungimea minimă indicată.";
      errorBox.hidden = false;
      form.reportValidity();
      return;
    }

    const name = nameInput.value.trim();
    const book = bookInput.value;
    const rating = Number(ratingInput.value);
    const title = titleInput.value.trim();
    const text = textInput.value.trim();

    if (name.length < 2 || title.length < 5 || text.length < 20 || !BOOK_NAMES[book] || rating < 1 || rating > 5) {
      errorBox.textContent = "Verifică numele (2+), titlul (5+) și recenzia (20+ caractere).";
      errorBox.hidden = false;
      return;
    }

    const reviews = getReviews();
    const review = { id: editId || String(Date.now()), name: name, book: book, rating: rating, title: title, text: text };
    const oldIndex = reviews.findIndex(function (item) { return item.id === editId; });

    if (oldIndex >= 0) {
      reviews[oldIndex] = review; // UPDATE = modificare.
    } else {
      review.id = String(Date.now());
      reviews.unshift(review); // CREATE = adaugare.
    }

    try {
      saveReviews(reviews);
      window.location.href = "recenzii.html?salvat=1";
    } catch (error) {
      errorBox.textContent = "Nu s-a putut salva. Verifică dacă browserul permite localStorage.";
      errorBox.hidden = false;
    }
  });
}

// Fiecare functie verifica daca exista elementele paginii sale.
initCatalog();
initReviewList();
initReviewForm();
