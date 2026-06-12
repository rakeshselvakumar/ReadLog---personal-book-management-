
// DATA & STATE

let books         = JSON.parse(localStorage.getItem('books'))    || [];
let readingGoal   = parseInt(localStorage.getItem('readingGoal')) || 20;
let currentFilter = 'all';
let editingId     = null; // tracks which book is being edited (null = adding new)

function saveBooks() {
  localStorage.setItem('books', JSON.stringify(books));
}

// DARK MODE

// Load saved theme on startup
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);

function toggleDarkMode() {
  const current = document.documentElement.getAttribute('data-theme');
  const next    = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
}

// READING GOAL

function updateGoal() {
  // Count books with status "read" added this year
  const thisYear   = new Date().getFullYear();
  const readThisYear = books.filter(b =>
    b.status === 'read' &&
    new Date(b.dateAdded).getFullYear() === thisYear
  ).length;

  const percent = readingGoal > 0
    ? Math.min(Math.round((readThisYear / readingGoal) * 100), 100)
    : 0;

  document.getElementById('goalBar').style.width     = percent + '%';
  document.getElementById('goalText').textContent    = `${readThisYear} of ${readingGoal} books read this year`;
  document.getElementById('goalPercent').textContent = percent + '%';
}

function editGoal() {
  const input = prompt('Set your reading goal for this year:', readingGoal);
  if (input !== null && !isNaN(parseInt(input))) {
    readingGoal = parseInt(input);
    localStorage.setItem('readingGoal', readingGoal);
    updateGoal();
  }
}

// MODAL OPEN / CLOSE

function openModal(id = null) {
  editingId = id;

  if (id !== null) {
    // EDIT MODE — fill form with existing book data
    const book = books.find(b => b.id === id);
    document.getElementById('modalTitle').textContent  = 'Edit Book';
    document.getElementById('bookTitle').value         = book.title;
    document.getElementById('bookAuthor').value        = book.author;
    document.getElementById('bookGenre').value         = book.genre;
    document.getElementById('bookStatus').value        = book.status;
    document.getElementById('currentPage').value       = book.currentPage || '';
    document.getElementById('totalPages').value        = book.totalPages  || '';
    document.getElementById('bookRating').value        = book.rating      || 5;
    document.getElementById('bookNotes').value         = book.notes       || '';
    document.getElementById('bookCover').value         = book.cover       || '';

    if (book.cover) {
      document.getElementById('coverPreview').src          = book.cover;
      document.getElementById('coverPreview').style.display = 'block';
    } else {
      document.getElementById('coverPreview').style.display = 'none';
    }

  } else {
    // ADD MODE — clear the form
    document.getElementById('modalTitle').textContent = 'Add New Book';
    clearForm();
  }

  document.getElementById('modalOverlay').classList.add('open');
  showHideFields();
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  editingId = null;
  clearForm();
}

function clearForm() {
  document.getElementById('bookTitle').value   = '';
  document.getElementById('bookAuthor').value  = '';
  document.getElementById('bookGenre').value   = '';
  document.getElementById('bookStatus').value  = 'reading';
  document.getElementById('currentPage').value = '';
  document.getElementById('totalPages').value  = '';
  document.getElementById('bookRating').value  = '5';
  document.getElementById('bookNotes').value   = '';
  document.getElementById('bookCover').value   = '';
  document.getElementById('coverPreview').style.display = 'none';
  document.getElementById('coverStatus').textContent    = '';
  showHideFields();
}

// SHOW/HIDE FORM FIELDS

function showHideFields() {
  const status = document.getElementById('bookStatus').value;
  document.getElementById('progressSection').style.display =
    status === 'reading' ? 'flex' : 'none';
  document.getElementById('ratingSection').style.display =
    (status === 'read' || status === 'favourite') ? 'flex' : 'none';
}

document.getElementById('bookStatus').addEventListener('change', showHideFields);

// FETCH BOOK COVER FROM API

async function fetchCover() {
  const title = document.getElementById('bookTitle').value.trim();

  if (!title) {
    alert('Please enter a book title first!');
    return;
  }

  document.getElementById('coverStatus').textContent = 'Searching...';

  try {
    // Open Library API — completely free, no key needed
    const query    = encodeURIComponent(title);
    const response = await fetch(`https://openlibrary.org/search.json?title=${query}&limit=1`);
    const data     = await response.json();

    if (data.docs && data.docs.length > 0 && data.docs[0].cover_i) {
      const coverId  = data.docs[0].cover_i;
      const coverUrl = `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`;

      document.getElementById('bookCover').value            = coverUrl;
      document.getElementById('coverPreview').src           = coverUrl;
      document.getElementById('coverPreview').style.display = 'block';
      document.getElementById('coverStatus').textContent    = '✅ Cover found!';
    } else {
      document.getElementById('coverStatus').textContent = '❌ No cover found';
    }
  } catch (err) {
    document.getElementById('coverStatus').textContent = '❌ Error fetching cover';
  }
}

// SAVE BOOK (ADD OR EDIT)

function saveBook() {
  const title  = document.getElementById('bookTitle').value.trim();
  const author = document.getElementById('bookAuthor').value.trim();
  const genre  = document.getElementById('bookGenre').value.trim();
  const status = document.getElementById('bookStatus').value;
  const notes  = document.getElementById('bookNotes').value.trim();
  const cover  = document.getElementById('bookCover').value;

  if (!title) {
    alert('Please enter the book title!');
    return;
  }

  if (editingId !== null) {
    // EDIT — find and update existing book
    const index = books.findIndex(b => b.id === editingId);
    books[index] = {
      ...books[index],  // Keep original id and dateAdded
      title, author, genre, status, notes, cover,
      rating:      parseInt(document.getElementById('bookRating').value),
      currentPage: parseInt(document.getElementById('currentPage').value) || 0,
      totalPages:  parseInt(document.getElementById('totalPages').value)  || 0,
    };
  } else {
    // ADD — create new book object
    books.push({
      id:          Date.now(),
      title, author, genre, status, notes, cover,
      rating:      parseInt(document.getElementById('bookRating').value),
      currentPage: parseInt(document.getElementById('currentPage').value) || 0,
      totalPages:  parseInt(document.getElementById('totalPages').value)  || 0,
      dateAdded:   new Date().toISOString(),  // Save today's date
    });
  }

  saveBooks();
  closeModal();
  renderBooks();
}

// DELETE BOOK

function deleteBook(id) {
  if (!confirm('Delete this book?')) return;
  books = books.filter(b => b.id !== id);
  saveBooks();
  renderBooks();
}

// FILTER & SEARCH

function filterBooks(filter, e) {
  currentFilter = filter;

  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  if (e && e.target) e.target.classList.add('active');

  // Show/hide stats page vs book list
  const isStats = filter === 'stats';
  document.getElementById('bookList').style.display    = isStats ? 'none' : 'block';
  document.getElementById('statsPage').style.display   = isStats ? 'block' : 'none';
  document.getElementById('exportRow').style.display   = isStats ? 'none' : 'flex';
  document.getElementById('goalSection').style.display = isStats ? 'none' : 'block';

  if (isStats) renderStats();
  else renderBooks();
}

document.getElementById('searchInput').addEventListener('input', renderBooks);

// RENDER BOOKS

function renderBooks() {
  const searchText = document.getElementById('searchInput').value.toLowerCase();
  const sortBy     = document.getElementById('sortSelect').value;

  // Filter
  let filtered = books.filter(book => {
    const matchesFilter = currentFilter === 'all' || book.status === currentFilter;
    const matchesSearch =
      book.title.toLowerCase().includes(searchText)  ||
      book.author.toLowerCase().includes(searchText) ||
      (book.genre && book.genre.toLowerCase().includes(searchText));
    return matchesFilter && matchesSearch;
  });

  // Sort
  if (sortBy === 'title')   filtered.sort((a,b) => a.title.localeCompare(b.title));
  if (sortBy === 'rating')  filtered.sort((a,b) => (b.rating||0) - (a.rating||0));
  if (sortBy === 'oldest')  filtered.sort((a,b) => new Date(a.dateAdded) - new Date(b.dateAdded));
  if (sortBy === 'newest')  filtered.sort((a,b) => new Date(b.dateAdded) - new Date(a.dateAdded));

  // Update stat counts
  document.getElementById('totalCount').textContent   = books.length;
  document.getElementById('readingCount').textContent = books.filter(b => b.status==='reading').length;
  document.getElementById('readCount').textContent    = books.filter(b => b.status==='read').length;
  document.getElementById('wantCount').textContent    = books.filter(b => b.status==='want').length;

  updateGoal();

  const bookList = document.getElementById('bookList');

  if (filtered.length === 0) {
    bookList.innerHTML = `
      <div class="empty-state">
        <div class="icon">📚</div>
        <p>No books here yet. Add your first book!</p>
      </div>`;
    return;
  }

  // Group by status
  const groups = {
    reading:   { label:'📖 Currently Reading', books:[] },
    read:      { label:'✅ Read',               books:[] },
    want:      { label:'📋 Want to Read',       books:[] },
    favourite: { label:'⭐ Favourites',         books:[] },
  };

  filtered.forEach(b => groups[b.status].books.push(b));

  let html = '';
  Object.values(groups).forEach(group => {
    if (!group.books.length) return;
    html += `<div class="section-title">${group.label}</div>`;
    group.books.forEach(b => { html += buildBookCard(b); });
  });

  bookList.innerHTML = html;
}

// BUILD BOOK CARD HTML

function buildBookCard(book) {
  const emojis = {
    reading:   { icon:'📖', bg:'#FAEEDA' },
    read:      { icon:'📗', bg:'#EAF3DE' },
    want:      { icon:'📋', bg:'#E6F1FB' },
    favourite: { icon:'⭐', bg:'#FEF3C7' },
  };

  const e = emojis[book.status];

  // Show real cover image if available, else emoji
  const coverHtml = book.cover
    ? `<img src="${book.cover}" class="book-cover-img" alt="cover" onerror="this.style.display='none'" />`
    : `<div class="book-emoji" style="background:${e.bg}">${e.icon}</div>`;

  const badges = {
    reading:   `<span class="badge badge-reading">Reading</span>`,
    read:      `<span class="badge badge-read">Read</span>`,
    want:      `<span class="badge badge-want">Want to Read</span>`,
    favourite: `<span class="badge badge-favourite">Favourite</span>`,
  };

  // Stars
  let starsHtml = '';
  if (book.status === 'read' || book.status === 'favourite') {
    let s = '';
    for (let i=1; i<=5; i++) s += i <= book.rating ? '★' : '☆';
    starsHtml = `<div class="stars">${s}</div>`;
  }

  // Progress bar
  let progressHtml = '';
  if (book.status === 'reading' && book.totalPages > 0) {
    const pct = Math.round((book.currentPage / book.totalPages) * 100);
    progressHtml = `
      <div class="progress-wrap">
        <div class="progress-bar-bg">
          <div class="progress-bar-fill" style="width:${pct}%"></div>
        </div>
        <div class="progress-text">
          <span>Page ${book.currentPage} of ${book.totalPages}</span>
          <span>${pct}%</span>
        </div>
      </div>`;
  }

  // Notes
  const notesHtml = book.notes
    ? `<div class="book-notes">"${book.notes}"</div>` : '';

  // Date added
  const dateHtml = book.dateAdded
    ? `<div class="book-date">Added ${timeAgo(book.dateAdded)}</div>` : '';

  return `
    <div class="book-card">
      ${coverHtml}
      <div class="book-info">
        <div class="book-title">${book.title}</div>
        <div class="book-author">${book.author || 'Unknown Author'}</div>
        <div class="book-genre">${book.genre || ''}</div>
        ${badges[book.status]}
        ${starsHtml}
        ${progressHtml}
        ${notesHtml}
        ${dateHtml}
      </div>
      <div class="card-actions">
        <button class="edit-btn"   onclick="openModal(${book.id})" title="Edit">✏️</button>
        <button class="delete-btn" onclick="deleteBook(${book.id})" title="Delete">🗑</button>
      </div>
    </div>`;
}

// TIME AGO HELPER

function timeAgo(dateStr) {
  const seconds = Math.floor((new Date() - new Date(dateStr)) / 1000);
  if (seconds < 60)     return 'just now';
  if (seconds < 3600)   return Math.floor(seconds/60) + ' min ago';
  if (seconds < 86400)  return Math.floor(seconds/3600) + ' hours ago';
  if (seconds < 604800) return Math.floor(seconds/86400) + ' days ago';
  return new Date(dateStr).toLocaleDateString();
}

// STATS PAGE

let statusChartInstance = null;
let genreChartInstance  = null;

function renderStats() {
  // --- Status chart (donut) ---
  const statusCounts = {
    Reading:      books.filter(b => b.status==='reading').length,
    Read:         books.filter(b => b.status==='read').length,
    'Want to Read': books.filter(b => b.status==='want').length,
    Favourites:   books.filter(b => b.status==='favourite').length,
  };

  if (statusChartInstance) statusChartInstance.destroy();
  statusChartInstance = new Chart(
    document.getElementById('statusChart'),
    {
      type: 'doughnut',
      data: {
        labels: Object.keys(statusCounts),
        datasets: [{
          data: Object.values(statusCounts),
          backgroundColor: ['#FAEEDA','#EAF3DE','#E6F1FB','#FEF3C7'],
          borderColor:     ['#854F0B','#3B6D11','#185FA5','#92400E'],
          borderWidth: 2,
        }]
      },
      options: { plugins: { legend: { position:'bottom' } } }
    }
  );

  // --- Genre chart (bar) ---
  const genreCounts = {};
  books.forEach(b => {
    if (b.genre) {
      genreCounts[b.genre] = (genreCounts[b.genre] || 0) + 1;
    }
  });

  if (genreChartInstance) genreChartInstance.destroy();
  genreChartInstance = new Chart(
    document.getElementById('genreChart'),
    {
      type: 'bar',
      data: {
        labels: Object.keys(genreCounts),
        datasets: [{
          label: 'Books',
          data: Object.values(genreCounts),
          backgroundColor: '#185FA5',
          borderRadius: 6,
        }]
      },
      options: {
        plugins: { legend: { display:false } },
        scales: { y: { beginAtZero:true, ticks:{ stepSize:1 } } }
      }
    }
  );

  // --- Average rating ---
  const ratedBooks = books.filter(b => b.rating && (b.status==='read'||b.status==='favourite'));
  const avg = ratedBooks.length
    ? (ratedBooks.reduce((sum,b) => sum + b.rating, 0) / ratedBooks.length).toFixed(1)
    : '–';
  document.getElementById('avgRating').textContent = avg !== '–' ? '★ ' + avg : '–';
}

// EXPORT CSV

function exportCSV() {
  // Build CSV content — each book becomes one row
  const headers = ['Title','Author','Genre','Status','Rating','Pages','Notes','Date Added'];
  const rows = books.map(b => [
    `"${b.title}"`,
    `"${b.author || ''}"`,
    `"${b.genre  || ''}"`,
    b.status,
    b.rating      || '',
    b.totalPages  || '',
    `"${b.notes  || ''}"`,
    b.dateAdded ? new Date(b.dateAdded).toLocaleDateString() : '',
  ]);

  const csv     = [headers, ...rows].map(r => r.join(',')).join('\n');
  const blob    = new Blob([csv], { type:'text/csv' });
  const url     = URL.createObjectURL(blob);
  const link    = document.createElement('a');
  link.href     = url;
  link.download = 'ReadLog.csv';
  link.click();
  URL.revokeObjectURL(url);
}

// EXPORT PDF

function exportPDF() {
  // Build a printable HTML page and open it in a new tab
  let rows = books.map(b => `
    <tr>
      <td>${b.title}</td>
      <td>${b.author || '–'}</td>
      <td>${b.genre  || '–'}</td>
      <td>${b.status}</td>
      <td>${b.rating ? '★'.repeat(b.rating) : '–'}</td>
      <td>${b.notes  || '–'}</td>
    </tr>`).join('');

  const html = `
    <html><head><title>ReadLog</title>
    <style>
      body { font-family: sans-serif; padding: 30px; }
      h1   { margin-bottom: 20px; }
      table { width:100%; border-collapse:collapse; }
      th, td { border:1px solid #ddd; padding:8px 12px; text-align:left; font-size:13px; }
      th { background:#185FA5; color:white; }
      tr:nth-child(even) { background:#f9f9f9; }
    </style></head>
    <body>
      <h1>📚 ReadLog</h1>
      <p>Total books: ${books.length} | Exported on ${new Date().toLocaleDateString()}</p>
      <br/>
      <table>
        <tr><th>Title</th><th>Author</th><th>Genre</th><th>Status</th><th>Rating</th><th>Notes</th></tr>
        ${rows}
      </table>
    </body></html>`;

  const win = window.open('', '_blank');
  win.document.write(html);
  win.document.close();
  win.print();  // Opens print dialog — user can save as PDF
}
// START THE APP

renderBooks();
showHideFields();