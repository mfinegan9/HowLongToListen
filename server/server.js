require('dotenv').config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();
const port = 3007;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "spotify_project",
  password: "Monkeybusiness",
  port: 5432,
});

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: process.env.REDIRECT_URI,
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
  const { userId, artistName, artistImage, totalDuration, progress } = req.body;
  try {
    const queryText = `
      INSERT INTO user_artists (user_id, artist_name, artist_image, total_duration, progress) 
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (user_id, artist_name) 
      DO UPDATE SET artist_image = EXCLUDED.artist_image, total_duration = EXCLUDED.total_duration, progress = EXCLUDED.progress
      RETURNING *`;
    const result = await pool.query(queryText, [userId, artistName, artistImage, totalDuration, progress]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error adding artist to dashboard:", error);
    res.sendStatus(500);
  }
});

// Fetch user artists from PostgreSQL
app.get("/user-artists", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM user_artists ORDER BY id DESC");
    res.json(rows);
  } catch (error) {
    console.error("Error fetching user artists:", error);
    res.sendStatus(500);
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});



















// require('dotenv').config();
// const express = require("express");
// const cors = require("cors");
// const { Pool } = require("pg");
// const SpotifyWebApi = require("spotify-web-api-node");

// const app = express();
// const port = 3007;

// const pool = new Pool({
//   user: "postgres",
//   host: "localhost",
//   database: "spotify_project",
//   password: "Monkeybusiness",
//   port: 5432,
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
//   const { artistName, artistImage, totalDuration } = req.body;
//   try {
//     const queryText = "INSERT INTO user_artists (artist_name, artist_image, total_duration) VALUES ($1, $2, $3) RETURNING *";
//     const result = await pool.query(queryText, [artistName, artistImage, totalDuration]);
//     res.json(result.rows[0]);
//   } catch (error) {
//     console.error("Error adding artist to dashboard:", error);
//     res.sendStatus(500);
//   }
// });

// // Fetch user artists from PostgreSQL
// app.get("/user-artists", async (req, res) => {
//   try {
//     const { rows } = await pool.query("SELECT * FROM user_artists ORDER BY id DESC");
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








// //postgres -- works


// require('dotenv').config();
// const express = require("express");
// const cors = require("cors");
// const { Pool } = require("pg");
// const SpotifyWebApi = require("spotify-web-api-node");

// const app = express();
// const port = 3007;

// const pool = new Pool({
//   user: "postgres",
//   host: "localhost", // changed from 'db'
//   database: "spotify_project",
//   password: "Monkeybusiness",
//   port: 5432,
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

// // Start server
// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });














//login- no recently searched

// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const SpotifyWebApi = require('spotify-web-api-node');

// const app = express();
// app.use(cors());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// const spotifyApi = new SpotifyWebApi({
//   clientId: process.env.CLIENT_ID,
//   clientSecret: process.env.CLIENT_SECRET,
//   redirectUri: process.env.REDIRECT_URI,
// });

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

// app.post('/refresh', async (req, res) => {
//   const refreshToken = req.body.refreshToken;
//   spotifyApi.setRefreshToken(refreshToken);
//   try {
//     const data = await spotifyApi.refreshAccessToken();
//     res.json({
//       accessToken: data.body.access_token,
//       expiresIn: data.body.expires_in,
//     });
//   } catch (err) {
//     console.error('Error in /refresh:', err);
//     res.sendStatus(400);
//   }
// });

// app.get('/artist-discography/:artistId', async (req, res) => {
//   const artistId = req.params.artistId;
//   try {
//     const albumsResponse = await spotifyApi.getArtistAlbums(artistId);
//     let totalDiscographyTime = 0;

//     // Calculate total duration of all albums
//     for (let i = 0; i < albumsResponse.body.items.length; i++) {
//       const album = albumsResponse.body.items[i];
//       totalDiscographyTime += album.total_tracks * album.duration_ms;
//     }

//     // Convert total duration to hours
//     const totalDiscographyHours = totalDiscographyTime / (1000 * 60 * 60);

//     res.json({
//       totalDiscographyTime: totalDiscographyHours.toFixed(2), // Format to two decimal places
//     });
//   } catch (err) {
//     console.error('Error in /artist-discography:', err);
//     res.sendStatus(400);
//   }
// });

// const PORT = process.env.PORT || 3007;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });











// require("dotenv").config()
// const express = require("express")
// const cors = require("cors")
// const bodyParser = require("body-parser")
// const lyricsFinder = require("lyrics-finder")
// const SpotifyWebApi = require("spotify-web-api-node")

// const app = express()
// app.use(cors())
// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: true }))

// app.post("/refresh", (req, res) => {
//   const refreshToken = req.body.refreshToken
//   const spotifyApi = new SpotifyWebApi({
//     redirectUri: process.env.REDIRECT_URI,
//     clientId: process.env.CLIENT_ID,
//     clientSecret: process.env.CLIENT_SECRET,
//     refreshToken,
//   })

//   spotifyApi
//     .refreshAccessToken()
//     .then(data => {
//       res.json({
//         accessToken: data.body.accessToken,
//         expiresIn: data.body.expiresIn,
//       })
//     })
//     .catch(err => {
//       console.log(err)
//       res.sendStatus(400)
//     })
// })




// app.post("/login", (req, res) => {
//     const code = req.body.code
//     const spotifyApi = new SpotifyWebApi({
//       redirectUri: process.env.REDIRECT_URI,
//     clientId: process.env.CLIENT_ID,
//     clientSecret: process.env.CLIENT_SECRET,
//     })
  
//     spotifyApi
//       .authorizationCodeGrant(code)
//       .then(data => {
//         res.json({
//           accessToken: data.body.access_token,
//           refreshToken: data.body.refresh_token,
//           expiresIn: data.body.expires_in,
//         })
//       })
//       .catch(err => {
//         console.log(err)
//         res.sendStatus(400)
//       })
//   })


//   app.get("/lyrics", async (req, res) => {
//     const lyrics =
//       (await lyricsFinder(req.query.artist, req.query.track)) || "No Lyrics Found"
//     res.json({ lyrics })
//   })

//   app.listen(3007)