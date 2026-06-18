# 📚 ReadLog — Personal Book Management

A clean, responsive web app to track your personal reading journey. Built with pure HTML, CSS, and JavaScript — no frameworks, no backend, no setup required.

---

## 🔗 Live Demo

**[Open ReadLog](https://rakeshselvakumar.github.io/ReadLog---personal-book-management-)**

---

## 👨‍💻 Developer

**Rakesh SJ**
- GitHub: [@rakeshselvakumar](https://github.com/rakeshselvakumar)

---

## ✨ Features

- 📖 Track books across 4 shelves — Currently Reading, Read, Want to Read, Favourites
- ⭐ Rate and review books with star ratings
- 📊 Reading statistics with interactive charts (Chart.js)
- 📅 Yearly reading goal tracker with progress bar
- 📖 Reading progress bar for currently reading books (page X of Y)
- 🔍 Book cover fetch via Open Library API (free, no key needed)
- 📁 Upload custom cover images for regional/local language books
- 🔮 Book recommendations based on your genres, authors and favourites
- ❤️ Quick favourite toggle on each book card
- 🌙 Dark mode / Light mode toggle with saved preference
- 🔎 Search books by title, author or genre
- ↕️ Sort by newest, oldest, title A-Z, or rating
- 📤 Export your bookshelf as CSV or PDF
- 📅 Date read tracking for yearly goal accuracy
- 💾 Data saved in browser localStorage — no account needed
- 📱 Fully responsive — works on mobile and desktop

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| HTML5 | Page structure |
| CSS3 | Styling + dark mode + animations |
| JavaScript (Vanilla) | All logic + localStorage + API calls |
| Chart.js | Stats page charts |
| Open Library API | Free book cover fetching |
| GitHub Pages | Free hosting |

---

## 📁 Project Structure

```
ReadLog---personal-book-management-/
├── index.html       # Main bookshelf page
├── style.css        # All styles including dark mode
└── app.js           # All JavaScript logic
```

---

## 🚀 How to Use

No installation needed! Just open the live link above in any browser.

**Or run locally:**
1. Clone the repo:
```bash
git clone https://github.com/rakeshselvakumar/ReadLog---personal-book-management-.git
```
2. Open `index.html` in your browser — that's it!

---

## 📖 How It Works

```
Everything runs in your browser
        ↓
Books are saved in localStorage
(browser's built-in storage)
        ↓
Data stays on your device
No server, no database, no account needed
```

- When you add a book → saved to localStorage
- When you refresh → books loaded from localStorage
- When you export → generates CSV/PDF from your data
- When you fetch cover → calls Open Library API for real book covers

---

## 🗂️ Book Shelves

| Shelf | Description |
|---|---|
| 📖 Currently Reading | Books you're reading now with page progress |
| ✅ Read | Finished books with rating and date completed |
| 📋 Want to Read | Your reading wishlist |
| ⭐ Favourites | Books you loved most |

---

## 📊 Stats Page

- Donut chart showing books by status
- Bar chart showing books by genre
- Average star rating across all read books

---

## 🔮 Recommendations

The app analyses your reading history and suggests books based on:
- Your most read genres
- Authors you've read before
- Books similar to your highest rated ones

Recommendations are fetched live from the Open Library API.

---

## 💾 Data Storage

All data is stored in your **browser's localStorage** — this means:

✅ No account needed
✅ No internet required after first load
✅ Completely private — only you can see it
⚠️ Clearing browser data will erase books
⚠️ Data doesn't sync across devices

> For cross-device sync with login, check out the [Full Stack version](https://github.com/rakeshselvakumar/ReadLog---fullstack-)

---

## 🌐 Deployment

Hosted for free on **GitHub Pages** — zero cost, always available.

---

## 🎯 What I Learned Building This

- Structuring a multi-feature single page app with vanilla JS
- Working with browser localStorage for data persistence
- Fetching and displaying data from a public REST API
- Building responsive layouts with CSS Grid and Flexbox
- Implementing dark mode using CSS variables
- Generating and downloading files (CSV/PDF) from JavaScript
- Deploying a static site with GitHub Pages

---

## 🔗 Related Projects

- **[ReadLog Full Stack](https://github.com/rakeshselvakumar/ReadLog---fullstack-)** — Same app with Java Spring Boot backend, MySQL database, JWT login and cross-device sync

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

*Built with ❤️ by Rakesh SJ*
