const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",     
  password: "root",      
  database: "movies_db"
});

db.connect(err => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("Connected to MySQL!");
});

// Routes

// GET all movies
app.get("/movies", (req, res) => {
  db.query("SELECT * FROM movies", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// POST add a new movie
app.post("/movies", (req, res) => {
  const { title, director, genre, release_year, rating } = req.body;
  db.query(
    "INSERT INTO movies (title, director, genre, release_year, rating) VALUES (?, ?, ?, ?, ?)",
    [title, director, genre, release_year, rating],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "Movie added!", id: result.insertId });
    }
  );
});

// PUT update a movie
app.put("/movies/:id", (req, res) => {
  const { id } = req.params;
  const { title, director, genre, release_year, rating } = req.body;
  db.query(
    "UPDATE movies SET title=?, director=?, genre=?, release_year=?, rating=? WHERE id=?",
    [title, director, genre, release_year, rating, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "Movie updated!" });
    }
  );
});

// DELETE a movie
app.delete("/movies/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM movies WHERE id=?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Movie deleted!" });
  });
});

// Start server
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});