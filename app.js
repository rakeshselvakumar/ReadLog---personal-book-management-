let books = [];

function openModal() {
  document.getElementById("modalOverlay").style.display = "block";
}

function closeModal() {
  document.getElementById("modalOverlay").style.display = "none";
}

function addBook() {
  const title = document.getElementById("bookTitle").value;
  const status = document.getElementById("bookStatus").value;

  if (!title) return;

  books.push({ title, status });
  renderBooks();
  closeModal();
}

function renderBooks() {
  const list = document.getElementById("bookList");
  list.innerHTML = "";

  books.forEach(book => {
    list.innerHTML += `<div>${book.title} - ${book.status}</div>`;
  });

  document.getElementById("totalCount").textContent = books.length;
  document.getElementById("readingCount").textContent =
    books.filter(b => b.status === "reading").length;
  document.getElementById("readCount").textContent =
    books.filter(b => b.status === "read").length;
  document.getElementById("wantCount").textContent =
    books.filter(b => b.status === "want").length;
}

function filterBooks(type) {
  const list = document.getElementById("bookList");
  list.innerHTML = "";

  books
    .filter(b => type === "all" || b.status === type)
    .forEach(b => {
      list.innerHTML += `<div>${b.title} - ${b.status}</div>`;
    });
}