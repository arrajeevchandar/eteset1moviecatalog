const express = require("express");
const { Pool } = require("pg");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Supabase/Postgres connection
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: 5432,
  ssl: { rejectUnauthorized: false } // required for Supabase
});

// Routes
app.get("/movies", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM movies ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/movies", async (req, res) => {
  const { title, director, genre, release_year, rating } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO movies (title, director, genre, release_year, rating) VALUES ($1,$2,$3,$4,$5) RETURNING id",
      [title, director, genre, release_year, rating]
    );
    res.json({ message: "Movie added!", id: result.rows[0].id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/movies/:id", async (req, res) => {
  const { id } = req.params;
  const { title, director, genre, release_year, rating } = req.body;
  try {
    await pool.query(
      "UPDATE movies SET title=$1, director=$2, genre=$3, release_year=$4, rating=$5 WHERE id=$6",
      [title, director, genre, release_year, rating, id]
    );
    res.json({ message: "Movie updated!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/movies/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM movies WHERE id=$1", [id]);
    res.json({ message: "Movie deleted!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Local only
if (process.env.NODE_ENV !== "production") {
  app.listen(5000, () => console.log("Server running on port 5000"));
}

module.exports = app; // required for Vercel
