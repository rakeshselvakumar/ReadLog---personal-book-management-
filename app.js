
// DATA STORAGE
// This loads saved books from browser memory.
// If nothing is saved yet, start with an empty array []
let books = JSON.parse(localStorage.getItem('books')) || [];

// Tracks which filter tab is active. Default = "all"
let currentFilter = 'all';

// SAVE TO BROWSER MEMORY

// Every time books change, we save them so they don't disappear when you refresh the page
function saveBooks() {
  localStorage.setItem('books', JSON.stringify(books));
}

// OPEN & CLOSE THE POPUP

function openModal() {
  // Add class "open" to show the modal overlay
  document.getElementById('modalOverlay').classList.add('open');
  showHideFields(); // Check which fields to show
}

function closeModal() {
  // Remove class "open" to hide the modal
  document.getElementById('modalOverlay').classList.remove('open');
  clearForm(); // Clear all input fields
}

// Clear all form inputs after saving or cancelling
function clearForm() {
  document.getElementById('bookTitle').value = '';
  document.getElementById('bookAuthor').value = '';
  document.getElementById('bookGenre').value = '';
  document.getElementById('bookStatus').value = 'reading';
  document.getElementById('currentPage').value = '';
  document.getElementById('totalPages').value = '';
  document.getElementById('bookRating').value = '5';
  showHideFields();
}

// SHOW/HIDE FORM FIELDS

// Progress fields only make sense for "reading"
// Rating only makes sense for "read" or "favourite"
function showHideFields() {
  const status = document.getElementById('bookStatus').value;

  const progressSection = document.getElementById('progressSection');
  const ratingSection = document.getElementById('ratingSection');

  // Show progress bar inputs only for "reading"
  progressSection.style.display = status === 'reading' ? 'flex' : 'none';

  // Show rating only for "read" or "favourite"
  ratingSection.style.display =
    (status === 'read' || status === 'favourite') ? 'flex' : 'none';
}

// Listen for status dropdown changes
document.getElementById('bookStatus').addEventListener('change', showHideFields);

// ADDING A NEW BOOK
// ==============================

function addBook() {
  // Get values from the form
  const title  = document.getElementById('bookTitle').value.trim();
  const author = document.getElementById('bookAuthor').value.trim();
  const genre  = document.getElementById('bookGenre').value.trim();
  const status = document.getElementById('bookStatus').value;

  // Title is required — show alert if empty
  if (!title) {
    alert('Please enter the book title!');
    return; 
  }

  // Build a book object with all the details
  const book = {
    id: Date.now(), 
    title,
    author,
    genre,
    status,
    rating: parseInt(document.getElementById('bookRating').value),
    currentPage: parseInt(document.getElementById('currentPage').value) || 0,
    totalPages:  parseInt(document.getElementById('totalPages').value)  || 0,
  };

  // Add the new book to  books array
  books.push(book);

  // Save to browser memory
  saveBooks();

  // Close the popup
  closeModal();

  // Re-render the book list on screen
  renderBooks();
}

// DELETE A BOOK

function deleteBook(id) {
  // Confirm before deleting
  if (!confirm('Delete this book?')) return;

  // Filter out the book with matching id
  // (keep all books EXCEPT the one with this id)
  books = books.filter(book => book.id !== id);

  saveBooks();
  renderBooks();
}

// FILTER TABS

function filterBooks(filter) {
  currentFilter = filter;

  // Remove "active" class from all tabs
  document.querySelectorAll('.tab').forEach(tab => {
    tab.classList.remove('active');
  });

  // Add "active" class to the clicked tab
  event.target.classList.add('active');

  // Re-render books with new filter
  renderBooks();
}

// SEARCH

// Listen for typing in the search box
document.getElementById('searchInput').addEventListener('input', renderBooks);

// DISPLAY ALL BOOKS

function renderBooks() {
  const searchText = document.getElementById('searchInput').value.toLowerCase();

  // Filter books based on active tab and search text
  const filtered = books.filter(book => {
    const matchesFilter =
      currentFilter === 'all' || book.status === currentFilter;

    const matchesSearch =
      book.title.toLowerCase().includes(searchText) ||
      book.author.toLowerCase().includes(searchText);

    return matchesFilter && matchesSearch;
  });

  // Update stat counts
  document.getElementById('totalCount').textContent   = books.length;
  document.getElementById('readingCount').textContent = books.filter(b => b.status === 'reading').length;
  document.getElementById('readCount').textContent    = books.filter(b => b.status === 'read').length;
  document.getElementById('wantCount').textContent    = books.filter(b => b.status === 'want').length;

  const bookList = document.getElementById('bookList');

  // Show empty state if no books found
  if (filtered.length === 0) {
    bookList.innerHTML = `
      <div class="empty-state">
        <div class="icon">📚</div>
        <p>No books here yet. Add your first book!</p>
      </div>
    `;
    return;
  }

  // Group books by status for section headings
  const groups = {
    reading:   { label: '📖 Currently Reading', books: [] },
    read:      { label: '✅ Read',               books: [] },
    want:      { label: '📋 Want to Read',       books: [] },
    favourite: { label: '⭐ Favourites',         books: [] },
  };

  filtered.forEach(book => groups[book.status].books.push(book));

  // Build HTML string for all sections
  let html = '';

  Object.values(groups).forEach(group => {
    if (group.books.length === 0) return; // Skip empty groups

    html += `<div class="section-title">${group.label}</div>`;

    group.books.forEach(book => {
      html += buildBookCard(book);
    });
  });

  bookList.innerHTML = html;
}

// BUILD A SINGLE BOOK CARD

function buildBookCard(book) {
  // Pick an emoji based on status
  const emojis = {
    reading:   { icon: '📖', bg: '#FAEEDA' },
    read:      { icon: '📗', bg: '#EAF3DE' },
    want:      { icon: '📋', bg: '#E6F1FB' },
    favourite: { icon: '⭐', bg: '#FEF3C7' },
  };

  const e = emojis[book.status];

  // Badge label for each status
  const badges = {
    reading:   '<span class="badge badge-reading">Reading</span>',
    read:      '<span class="badge badge-read">Read</span>',
    want:      '<span class="badge badge-want">Want to Read</span>',
    favourite: '<span class="badge badge-favourite">Favourite</span>',
  };

  // Build star display (filled and empty stars)
  let starsHtml = '';
  if (book.status === 'read' || book.status === 'favourite') {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
      stars += i <= book.rating ? '★' : '☆';
    }
    starsHtml = `<div class="stars">${stars}</div>`;
  }

  // Build progress bar for "currently reading"
  let progressHtml = '';
  if (book.status === 'reading' && book.totalPages > 0) {
    const percent = Math.round((book.currentPage / book.totalPages) * 100);
    progressHtml = `
      <div class="progress-wrap">
        <div class="progress-bar-bg">
          <div class="progress-bar-fill" style="width:${percent}%"></div>
        </div>
        <div class="progress-text">
          <span>Page ${book.currentPage} of ${book.totalPages}</span>
          <span>${percent}%</span>
        </div>
      </div>
    `;
  }

  // Return the full card HTML
  return `
    <div class="book-card">
      <div class="book-emoji" style="background:${e.bg}">${e.icon}</div>
      <div class="book-info">
        <div class="book-title">${book.title}</div>
        <div class="book-author">${book.author || 'Unknown Author'}</div>
        <div class="book-genre">${book.genre || ''}</div>
        ${badges[book.status]}
        ${starsHtml}
        ${progressHtml}
      </div>
      <button class="delete-btn" onclick="deleteBook(${book.id})">🗑</button>
    </div>
  `;
}

// START THE APP
// Run renderBooks when the page first loads
renderBooks();
showHideFields();