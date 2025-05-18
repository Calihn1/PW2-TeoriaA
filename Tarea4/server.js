const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const db = new sqlite3.Database('imdb.db');


// Buscar por nombre de actor
app.post('/search/actor', (req, res) => {
  const actorName = req.body.actor;
  const query = `
    SELECT Movie.Title, Movie.Year, Movie.Score, Movie.Votes
    FROM Movie
    JOIN Casting ON Movie.MovieID = Casting.MovieID
    JOIN Actor ON Actor.ActorId = Casting.ActorId
    WHERE Actor.Name = ?;
  `;
  db.all(query, [actorName], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Buscar por año
app.post('/search/year', (req, res) => {
  const year = req.body.year;
  const query = `
    SELECT Title, Year, Score, Votes
    FROM Movie
    WHERE Year = ?;
  `;
  db.all(query, [year], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Buscar por actor y año combinados
app.post('/search/actor-year', (req, res) => {
  const { actor, year } = req.body;
  const query = `
    SELECT Movie.Title, Movie.Year, Movie.Score, Movie.Votes
    FROM Movie
    JOIN Casting ON Movie.MovieID = Casting.MovieID
    JOIN Actor ON Actor.ActorId = Casting.ActorId
    WHERE Actor.Name = ? AND Movie.Year = ?;
  `;
  db.all(query, [actor, year], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Buscar por múltiples películas (lista de títulos)
app.post('/search/movies', (req, res) => {
  const movies = req.body.movies; // array de títulos
  const placeholders = movies.map(() => '?').join(',');
  const query = `
    SELECT Title, Year, Score, Votes
    FROM Movie
    WHERE Title IN (${placeholders});
  `;
  db.all(query, movies, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Casting por múltiples películas (máx 5)
app.post('/search/casting', (req, res) => {
  const movies = req.body.movies; // array de títulos
  if (movies.length > 5) {
    return res.status(400).json({ error: 'Too many movies selected. Maximum is 5.' });
  }
  const placeholders = movies.map(() => '?').join(',');
  const query = `
    SELECT Movie.Title, Actor.Name
    FROM Movie
    JOIN Casting ON Movie.MovieID = Casting.MovieID
    JOIN Actor ON Actor.ActorId = Casting.ActorId
    WHERE Movie.Title IN (${placeholders})
    ORDER BY Movie.Title, Casting.Ordinal;
  `;
  db.all(query, movies, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

