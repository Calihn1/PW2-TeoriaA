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

