const express = require('express');
const app = express();
const PORT = 8000;

// Middleware to parse JSON bodies
app.use(express.json());

// In-memory "database" for books
let books = [
  { id: 1, title: 'The Alchemist', author: 'Paulo Coelho', genre: 'Fiction', year: 1988 },
  { id: 2, title: 'Clean Code', author: 'Robert C. Martin', genre: 'Technology', year: 2008 },
  { id: 3, title: 'Atomic Habits', author: 'James Clear', genre: 'Self-Help', year: 2018 },
];

let nextId = 4;

// ─────────────────────────────────────────────
//  GET /books  → Retrieve all books
// ─────────────────────────────────────────────
app.get('/books', (req, res) => {
  res.status(200).json({
    success: true,
    count: books.length,
    data: books,
  });
});

// ─────────────────────────────────────────────
//  GET /books/:id  → Retrieve a single book by ID
// ─────────────────────────────────────────────
app.get('/books/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const book = books.find((b) => b.id === id);

  if (!book) {
    return res.status(404).json({ success: false, message: `Book with id ${id} not found.` });
  }

  res.status(200).json({ success: true, data: book });
});

// ─────────────────────────────────────────────
//  POST /books  → Add a new book
// ─────────────────────────────────────────────
app.post('/books', (req, res) => {
  const { title, author, genre, year } = req.body;

  if (!title || !author) {
    return res
      .status(400)
      .json({ success: false, message: 'Title and author are required fields.' });
  }

  const newBook = {
    id: nextId++,
    title,
    author,
    genre: genre || 'Unknown',
    year: year || null,
  };

  books.push(newBook);

  res.status(201).json({
    success: true,
    message: 'Book added successfully.',
    data: newBook,
  });
});

// ─────────────────────────────────────────────
//  PUT /books/:id  → Update an existing book
// ─────────────────────────────────────────────
app.put('/books/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = books.findIndex((b) => b.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: `Book with id ${id} not found.` });
  }

  const { title, author, genre, year } = req.body;

  books[index] = {
    ...books[index],
    title: title ?? books[index].title,
    author: author ?? books[index].author,
    genre: genre ?? books[index].genre,
    year: year ?? books[index].year,
  };

  res.status(200).json({
    success: true,
    message: 'Book updated successfully.',
    data: books[index],
  });
});

// ─────────────────────────────────────────────
//  DELETE /books/:id  → Delete a book
// ─────────────────────────────────────────────
app.delete('/books/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = books.findIndex((b) => b.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: `Book with id ${id} not found.` });
  }

  const deleted = books.splice(index, 1)[0];

  res.status(200).json({
    success: true,
    message: 'Book deleted successfully.',
    data: deleted,
  });
});

// ─────────────────────────────────────────────
//  Start server
// ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`📚 Books REST API running at http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('  GET    /books');
  console.log('  GET    /books/:id');
  console.log('  POST   /books');
  console.log('  PUT    /books/:id');
  console.log('  DELETE /books/:id');
});
