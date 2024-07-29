
// require('dotenv').config();
// const express = require("express");
// const cors = require("cors");
// const { Pool } = require("pg");
// const SpotifyWebApi = require("spotify-web-api-node");

// const app = express();
// const port = process.env.PORT || 3007;

// // Use environment variable for the PostgreSQL connection
// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: {
//     rejectUnauthorized: false
//   }
// });

// // Middleware
// app.use(cors({
//   origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
// }));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// const spotifyApi = new SpotifyWebApi({
//   clientId: process.env.CLIENT_ID,
//   clientSecret: process.env.CLIENT_SECRET,
//   redirectUri: process.env.REDIRECT_URI,
// });

// // Login route
// app.post('/login', async (req, res) => {
//   const code = req.body.code;
//   try {
//     const data = await spotifyApi.authorizationCodeGrant(code);
//     res.json({
//       accessToken: data.body.access_token,
//       refreshToken: data.body.refresh_token,
//       expiresIn: data.body.expires_in,
//     });
//   } catch (err) {
//     console.error('Error in /login:', err);
//     res.sendStatus(400);
//   }
// });

// // Save searched artist to PostgreSQL
// app.post("/save-searched-artist", async (req, res) => {
//   const { artistName, artistImage } = req.body;
//   try {
//     const queryText = "INSERT INTO searched_artists(artist_name, artist_image) VALUES($1, $2) RETURNING *";
//     const result = await pool.query(queryText, [artistName, artistImage]);
//     console.log("Inserted artist:", result.rows[0]);
//     res.sendStatus(200);
//   } catch (error) {
//     console.error("Error saving searched artist:", error);
//     res.sendStatus(500);
//   }
// });

// // Fetch recently searched artists from PostgreSQL
// app.get("/recently-searched-artists", async (req, res) => {
//   try {
//     const { rows } = await pool.query("SELECT * FROM searched_artists ORDER BY id DESC LIMIT 5");
//     res.json(rows);
//   } catch (error) {
//     console.error("Error fetching recently searched artists:", error);
//     res.sendStatus(500);
//   }
// });

// // Save user artists to PostgreSQL
// app.post("/add-artist-to-dashboard", async (req, res) => {
//   const { userId, artistName, artistImage, totalDuration, progress, totalAlbums, totalSongs } = req.body;

//   try {
//     const queryText = `
//       INSERT INTO user_artist_data (user_id, artist_name, artist_image, total_duration, progress, total_albums, total_songs) 
//       VALUES ($1, $2, $3, $4, $5, $6, $7)
//       ON CONFLICT (user_id, artist_name) 
//       DO UPDATE SET artist_image = EXCLUDED.artist_image, total_duration = EXCLUDED.total_duration, progress = EXCLUDED.progress, total_albums = EXCLUDED.total_albums, total_songs = EXCLUDED.total_songs
//       RETURNING *`;
//     const result = await pool.query(queryText, [userId, artistName, artistImage, totalDuration, progress, totalAlbums, totalSongs]);
//     res.json(result.rows[0]);
//   } catch (error) {
//     console.error("Error adding artist to dashboard:", error);
//     res.sendStatus(500);
//   }
// });

// // Fetch user artists from PostgreSQL
// app.get("/user-artists", async (req, res) => {
//   try {
//     const { rows } = await pool.query("SELECT * FROM user_artist_data ORDER BY id DESC");
//     res.json(rows);
//   } catch (error) {
//     console.error("Error fetching user artists:", error);
//     res.sendStatus(500);
//   }
// });

// // Start server
// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });

















// // require('dotenv').config();
// // const express = require('express');
// // const cors = require('cors');
// // const { Pool } = require('pg');
// // const SpotifyWebApi = require('spotify-web-api-node');

// // const app = express();
// // const port = process.env.PORT || 3007; // Use the port from environment variables or default to 3007

// // // Middlewares
// // app.use(cors());
// // app.use(express.json());

// // // PostgreSQL client configuration
// // const pool = new Pool({
// //   user: "postgres",
// //   host: "localhost",
// //   database: "spotify_project",
// //   password: "Monkeybusiness",
// //   port: 5432,
// // });

// // // Example route
// // app.get('/', (req, res) => {
// //   res.send('Hello World!');
// // });

// // // Start the server
// // app.listen(port, () => {
// //   console.log(`Server is running on http://localhost:${port}`);
// // });













// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const { Pool } = require('pg');
// const SpotifyWebApi = require('spotify-web-api-node');

// const app = express();
// const port = process.env.PORT || 3000; // Use the port from environment variables or default to 3007

// // Middlewares
// app.use(cors());
// app.use(express.json());

// // PostgreSQL client configuration
// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: {
//     rejectUnauthorized: false // This is needed for Heroku's PostgreSQL connection
//   }
// });

// // Example route
// app.get('/', (req, res) => {
//   res.send('Hello World!');
// });

// // Start the server
// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });


// // Middleware
// app.use(cors({
//   origin: 'http://localhost:3000',
// }));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// const spotifyApi = new SpotifyWebApi({
//   clientId: process.env.CLIENT_ID,
//   clientSecret: process.env.CLIENT_SECRET,
//   redirectUri: process.env.REDIRECT_URI,
// });

// // Login route
// app.post('/login', async (req, res) => {
//   const code = req.body.code;
//   try {
//     const data = await spotifyApi.authorizationCodeGrant(code);
//     res.json({
//       accessToken: data.body.access_token,
//       refreshToken: data.body.refresh_token,
//       expiresIn: data.body.expires_in,
//     });
//   } catch (err) {
//     console.error('Error in /login:', err);
//     res.sendStatus(400);
//   }
// });

// // Save searched artist to PostgreSQL
// app.post("/save-searched-artist", async (req, res) => {
//   const { artistName, artistImage } = req.body;
//   try {
//     const queryText = "INSERT INTO searched_artists(artist_name, artist_image) VALUES($1, $2) RETURNING *";
//     const result = await pool.query(queryText, [artistName, artistImage]);
//     console.log("Inserted artist:", result.rows[0]);
//     res.sendStatus(200);
//   } catch (error) {
//     console.error("Error saving searched artist:", error);
//     res.sendStatus(500);
//   }
// });

// // Fetch recently searched artists from PostgreSQL
// app.get("/recently-searched-artists", async (req, res) => {
//   try {
//     const { rows } = await pool.query("SELECT * FROM searched_artists ORDER BY id DESC LIMIT 5");
//     res.json(rows);
//   } catch (error) {
//     console.error("Error fetching recently searched artists:", error);
//     res.sendStatus(500);
//   }
// });

// // Save user artists to PostgreSQL
// app.post("/add-artist-to-dashboard", async (req, res) => {
//   const { userId, artistName, artistImage, totalDuration, progress, totalAlbums, totalSongs } = req.body;

//   try {
//     const queryText = `
//       INSERT INTO user_artist_data (user_id, artist_name, artist_image, total_duration, progress, total_albums, total_songs) 
//       VALUES ($1, $2, $3, $4, $5, $6, $7)
//       ON CONFLICT (user_id, artist_name) 
//       DO UPDATE SET artist_image = EXCLUDED.artist_image, total_duration = EXCLUDED.total_duration, progress = EXCLUDED.progress, total_albums = EXCLUDED.total_albums, total_songs = EXCLUDED.total_songs
//       RETURNING *`;
//     const result = await pool.query(queryText, [userId, artistName, artistImage, totalDuration, progress, totalAlbums, totalSongs]);
//     res.json(result.rows[0]);
//   } catch (error) {
//     console.error("Error adding artist to dashboard:", error);
//     res.sendStatus(500);
//   }
// });

// // Fetch user artists from PostgreSQL
// app.get("/user-artists", async (req, res) => {
//   try {
//     const { rows } = await pool.query("SELECT * FROM user_artist_data ORDER BY id DESC");
//     res.json(rows);
//   } catch (error) {
//     console.error("Error fetching user artists:", error);
//     res.sendStatus(500);
//   }
// });

// // Start server
// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });




















require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();
const port = process.env.PORT || 3000; // Use the port from environment variables or default to 3000

// Middlewares
app.use(cors({
  origin: 'http://localhost:3000', // This can be adjusted based on your frontend
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// PostgreSQL client configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // This is needed for Heroku's PostgreSQL connection
  }
});

// Initialize Spotify API
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: process.env.REDIRECT_URI,
});

// Example route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Login route
app.post('/login', async (req, res) => {
  const code = req.body.code;
  try {
    const data = await spotifyApi.authorizationCodeGrant(code);
    res.json({
      accessToken: data.body.access_token,
      refreshToken: data.body.refresh_token,
      expiresIn: data.body.expires_in,
    });
  } catch (err) {
    console.error('Error in /login:', err);
    res.sendStatus(400);
  }
});

// Save searched artist to PostgreSQL
app.post("/save-searched-artist", async (req, res) => {
  const { artistName, artistImage } = req.body;
  try {
    const queryText = "INSERT INTO searched_artists(artist_name, artist_image) VALUES($1, $2) RETURNING *";
    const result = await pool.query(queryText, [artistName, artistImage]);
    console.log("Inserted artist:", result.rows[0]);
    res.sendStatus(200);
  } catch (error) {
    console.error("Error saving searched artist:", error);
    res.sendStatus(500);
  }
});

// Fetch recently searched artists from PostgreSQL
app.get("/recently-searched-artists", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM searched_artists ORDER BY id DESC LIMIT 5");
    res.json(rows);
  } catch (error) {
    console.error("Error fetching recently searched artists:", error);
    res.sendStatus(500);
  }
});

// Save user artists to PostgreSQL
app.post("/add-artist-to-dashboard", async (req, res) => {
  const { userId, artistName, artistImage, totalDuration, progress, totalAlbums, totalSongs } = req.body;

  try {
    const queryText = `
      INSERT INTO user_artist_data (user_id, artist_name, artist_image, total_duration, progress, total_albums, total_songs) 
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (user_id, artist_name) 
      DO UPDATE SET artist_image = EXCLUDED.artist_image, total_duration = EXCLUDED.total_duration, progress = EXCLUDED.progress, total_albums = EXCLUDED.total_albums, total_songs = EXCLUDED.total_songs
      RETURNING *`;
    const result = await pool.query(queryText, [userId, artistName, artistImage, totalDuration, progress, totalAlbums, totalSongs]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error adding artist to dashboard:", error);
    res.sendStatus(500);
  }
});

// Fetch user artists from PostgreSQL
app.get("/user-artists", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM user_artist_data ORDER BY id DESC");
    res.json(rows);
  } catch (error) {
    console.error("Error fetching user artists:", error);
    res.sendStatus(500);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
