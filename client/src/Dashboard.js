// import React, { useState, useEffect, useCallback } from "react";
// import { Container, Form, Row, Col, Card, ListGroup, Navbar, Button } from "react-bootstrap";
// import SpotifyWebApi from "spotify-web-api-node";
// import useAuth from "./useAuth";
// import axios from "axios";
// import './Dashboard.scss';

// const spotifyApi = new SpotifyWebApi({
//   clientId: "69b8e423003a4b428541484e7370d768",
// });

// const Dashboard = ({ code }) => {
//   const accessToken = useAuth(code);
//   const [search, setSearch] = useState("");
//   const [searchResults, setSearchResults] = useState([]);
//   const [artistDetails, setArtistDetails] = useState({});
//   const [recentlySearchedArtists, setRecentlySearchedArtists] = useState([]);
//   const [userArtists, setUserArtists] = useState([]);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     if (!accessToken) return;
//     spotifyApi.setAccessToken(accessToken);
//   }, [accessToken]);

//   const searchArtists = useCallback(async () => {
//     try {
//       const response = await spotifyApi.searchArtists(search);
//       setSearchResults(response.body.artists.items.slice(0, 7)); // Limit to 7 results
//     } catch (error) {
//       console.error("Error searching artists:", error);
//     }
//   }, [search]);

//   useEffect(() => {
//     if (search) {
//       searchArtists();
//     } else {
//       setSearchResults([]);
//     }
//   }, [search, searchArtists]);

//   const selectArtist = async (artist) => {
//     setSearch(artist.name);
//     setSearchResults([]);
//     setError(""); // Clear any previous error message

//     try {
//       const albumsResponse = await spotifyApi.getArtistAlbums(artist.id);
//       const albums = albumsResponse.body.items;

//       let totalDuration = 0;
//       let totalAlbums = albums.length;
//       let totalSongs = 0;

//       for (const album of albums) {
//         const tracksResponse = await spotifyApi.getAlbumTracks(album.id);
//         const tracks = tracksResponse.body.items;
//         totalSongs += tracks.length;

//         tracks.forEach(track => {
//           totalDuration += track.duration_ms;
//         });
//       }

//       const totalHours = Math.floor(totalDuration / 3600000);
//       const totalMinutes = Math.floor((totalDuration % 3600000) / 60000);

//       setArtistDetails({
//         artistName: artist.name,
//         artistImage: artist.images[0]?.url,
//         totalDuration: `${totalHours}h ${totalMinutes}m`,
//         totalAlbums,
//         totalSongs,
//       });

//       saveSearchedArtist(artist.name, artist.images[0]?.url);
//     } catch (error) {
//       console.error("Error fetching artist's albums or tracks:", error);
//     }
//   };

//   const saveSearchedArtist = async (artistName, artistImage) => {
//     try {
//       await axios.post("http://localhost:3007/save-searched-artist", {
//         artistName,
//         artistImage,
//       });
//       fetchRecentlySearchedArtists();
//     } catch (error) {
//       console.error("Error saving searched artist:", error);
//     }
//   };

//   const fetchRecentlySearchedArtists = async () => {
//     try {
//       const response = await axios.get("http://localhost:3007/recently-searched-artists");
//       setRecentlySearchedArtists(response.data);
//     } catch (error) {
//       console.error("Error fetching recently searched artists:", error);
//     }
//   };

//   const addArtistToDashboard = async () => {
//     try {
//       const response = await axios.post("http://localhost:3007/add-artist-to-dashboard", {
//         userId: 1, // Replace with actual userId if needed
//         artistName: artistDetails.artistName,
//         artistImage: artistDetails.artistImage,
//         totalDuration: artistDetails.totalDuration,
//         progress: 0, // Initialize progress
//         totalAlbums: artistDetails.totalAlbums,
//         totalSongs: artistDetails.totalSongs,
//       });

//       if (response.data.error) {
//         setError("Artist already in dashboard");
//       } else {
//         fetchUserArtists();
//       }
//     } catch (error) {
//       console.error("Error adding artist to dashboard:", error);
//     }
//   };

//   const fetchUserArtists = async () => {
//     try {
//       const response = await axios.get("http://localhost:3007/user-artists");
//       setUserArtists(response.data);
//     } catch (error) {
//       console.error("Error fetching user artists:", error);
//     }
//   };

//   useEffect(() => {
//     fetchRecentlySearchedArtists();
//     fetchUserArtists();
//   }, []);

//   return (
//     <Container className="dashboard-container d-flex flex-column py-4">
//       <Navbar bg="dark" variant="dark" className="mb-4">
//         <Container>
//           <Navbar.Brand href="#" className="navbar-brand">
//             HowLongToListen
//           </Navbar.Brand>
//         </Container>
//       </Navbar>

//       <Form>
//         <Form.Control
//           type="search"
//           placeholder="Search Artists"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           id="artist-search"
//           name="artistSearch"
//           className="search-input mb-3"
//         />
//       </Form>

//       {searchResults.length > 0 && (
//         <ListGroup className="search-results mb-3">
//           {searchResults.map((artist) => (
//             <ListGroup.Item
//               key={artist.id}
//               onClick={() => selectArtist(artist)}
//               className="search-result-item"
//             >
//               {artist.name}
//             </ListGroup.Item>
//           ))}
//         </ListGroup>
//       )}

//       {artistDetails.artistName && (
//         <Row className="my-2">
//           <Col md={8}>
//             <Card className="artist-details-card mb-4">
//               <Card.Body>
//                 <Card.Title>{artistDetails.artistName}</Card.Title>
//                 {artistDetails.artistImage && (
//                   <Card.Img 
//                     src={artistDetails.artistImage} 
//                     alt={artistDetails.artistName} 
//                     className="artist-image mb-3"
//                   />
//                 )}
//                 <Card.Text>
//                   Total Duration: {artistDetails.totalDuration}
//                 </Card.Text>
//                 <Button onClick={addArtistToDashboard}>Add to Dashboard</Button>
//                 {error && <div className="error-message">{error}</div>}
//               </Card.Body>
//             </Card>
//           </Col>

//           <Col md={4}>
//             <Card className="recently-searched-card mb-4">
//               <Card.Header>Recently Searched Artists</Card.Header>
//               <ListGroup variant="flush">
//                 {recentlySearchedArtists.map((artist) => (
//                   <ListGroup.Item key={artist.id} className="recent-artist-item d-flex align-items-center">
//                     <img 
//                       src={artist.artist_image} 
//                       alt={artist.artist_name} 
//                       className="artist-thumbnail" 
//                     />
//                     <span>{artist.artist_name}</span>
//                   </ListGroup.Item>
//                 ))}
//               </ListGroup>
//             </Card>
//           </Col>
//         </Row>
//       )}

//       <Row>
//         <Col>
//           <Card className="user-dashboard-card mb-4">
//             <Card.Header>User Dashboard</Card.Header>
//             <ListGroup variant="flush">
//               {userArtists.map((artist) => (
//                 <ListGroup.Item key={artist.id} className="user-artist-item d-flex align-items-center">
//                   <img 
//                     src={artist.artist_image} 
//                     alt={artist.artist_name} 
//                     className="user-artist-image" 
//                   />
//                   <div>
//                     <div className="user-artist-name">{artist.artist_name}</div>
//                     <div className="user-artist-duration">Total Duration: {artist.total_duration}</div>
//                   </div>
//                 </ListGroup.Item>
//               ))}
//             </ListGroup>
//           </Card>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default Dashboard;


















import React, { useState, useEffect, useCallback } from "react";
import { Container, Form, Row, Col, Card, ListGroup, Navbar, Button } from "react-bootstrap";
import SpotifyWebApi from "spotify-web-api-node";
import useAuth from "./useAuth";
import axios from "axios";
import './Dashboard.scss';

const spotifyApi = new SpotifyWebApi({
  clientId: "69b8e423003a4b428541484e7370d768",
});

const Dashboard = ({ code }) => {
  const accessToken = useAuth(code);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [artistDetails, setArtistDetails] = useState({});
  const [recentlySearchedArtists, setRecentlySearchedArtists] = useState([]);
  const [userArtists, setUserArtists] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken]);

  const searchArtists = useCallback(async () => {
    try {
      const response = await spotifyApi.searchArtists(search);
      setSearchResults(response.body.artists.items);
    } catch (error) {
      console.error("Error searching artists:", error);
    }
  }, [search]);

  useEffect(() => {
    if (search) {
      searchArtists();
    } else {
      setSearchResults([]);
    }
  }, [search, searchArtists]);

  const selectArtist = async (artist) => {
    setSearch(artist.name);
    setSearchResults([]);
  
    try {
      const albumsResponse = await spotifyApi.getArtistAlbums(artist.id, { limit: 50 }); // Fetch up to 50 albums (or adjust limit as needed)
      const albums = albumsResponse.body.items;
      
      console.log("Albums Response:", albumsResponse.body); // Log API response for debugging
  
      let totalDuration = 0;
      let totalSongs = 0;
  
      for (const album of albums) {
        const tracksResponse = await spotifyApi.getAlbumTracks(album.id);
        const tracks = tracksResponse.body.items;
        totalSongs += tracks.length;
  
        tracks.forEach(track => {
          totalDuration += track.duration_ms;
        });
      }
  
      const totalHours = Math.floor(totalDuration / 3600000);
      const totalMinutes = Math.floor((totalDuration % 3600000) / 60000);
  
      setArtistDetails({
        artistName: artist.name,
        artistImage: artist.images[0]?.url,
        totalDuration: `${totalHours}h ${totalMinutes}m`,
        totalSongs, // Set totalSongs instead of totalAlbums
      });
  
      saveSearchedArtist(artist.name, artist.images[0]?.url);
    } catch (error) {
      console.error("Error fetching artist's albums or tracks:", error);
    }
  };
  

  const saveSearchedArtist = async (artistName, artistImage) => {
    try {
      await axios.post("http://localhost:3007/save-searched-artist", {
        artistName,
        artistImage,
      });
      fetchRecentlySearchedArtists();
    } catch (error) {
      console.error("Error saving searched artist:", error);
    }
  };

  const fetchRecentlySearchedArtists = async () => {
    try {
      const response = await axios.get("http://localhost:3007/recently-searched-artists");
      setRecentlySearchedArtists(response.data);
    } catch (error) {
      console.error("Error fetching recently searched artists:", error);
    }
  };

  const addArtistToDashboard = async () => {
    try {
      const existingArtists = userArtists.map(artist => artist.artist_name);
      
      if (existingArtists.includes(artistDetails.artistName)) {
        setError("Artist already in dashboard");
        setTimeout(() => {
          setError("");
        }, 5000); // Clear error message after 5 seconds
        return;
      }

      const response = await axios.post("http://localhost:3007/add-artist-to-dashboard", {
        userId: 1, // Replace with actual userId if needed
        artistName: artistDetails.artistName,
        artistImage: artistDetails.artistImage,
        totalDuration: artistDetails.totalDuration,
        progress: 0, // Initialize progress
        totalAlbums: artistDetails.totalAlbums,
        totalSongs: artistDetails.totalSongs,
      });
      if (response.data.error) {
        setError("Artist already in dashboard");
        setTimeout(() => {
          setError("");
        }, 5000); // Clear error message after 5 seconds
      } else {
        setError("");
        fetchUserArtists();
      }
    } catch (error) {
      console.error("Error adding artist to dashboard:", error);
    }
  };

  const fetchUserArtists = async () => {
    try {
      const response = await axios.get("http://localhost:3007/user-artists");
      setUserArtists(response.data);
    } catch (error) {
      console.error("Error fetching user artists:", error);
    }
  };

  useEffect(() => {
    fetchRecentlySearchedArtists();
    fetchUserArtists();
  }, []);

  return (
    <Container className="dashboard-container d-flex flex-column py-4">
  <Navbar bg="dark" variant="dark" className="mb-4">
    <Container className="navbar-container">
      <Navbar.Brand href="#" className="navbar-brand">
        HowLongToListen
      </Navbar.Brand>
    </Container>
  </Navbar>

      <Form>
        <Form.Control
          type="search"
          placeholder="Search Artists"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          id="artist-search"
          name="artistSearch"
          className="search-input mb-3"
        />
      </Form>

      {searchResults.length > 0 && (
        <ListGroup className="search-results mb-3">
          {searchResults.slice(0, 7).map((artist) => (
            <ListGroup.Item
              key={artist.id}
              onClick={() => selectArtist(artist)}
              className="search-result-item"
            >
              {artist.name}
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}

      {artistDetails.artistName && (
        <Row className="my-2">
          <Col md={8}>
          <Card className="artist-details-card mb-4">
    <Card.Body className="d-flex flex-column align-items-center">
        <Card.Img 
            src={artistDetails.artistImage} 
            alt={artistDetails.artistName} 
            className="artist-image"
        />
        <div className="artist-info">
            <Card.Title>{artistDetails.artistName}</Card.Title>
            <Card.Text>
                Total Duration: {artistDetails.totalDuration}
            </Card.Text>
            <div className="additional-info">
                {`Songs: ${artistDetails.totalSongs}`}
            </div>
            <Button 
                onClick={addArtistToDashboard}
                className="add-to-dashboard-button"
            >
                Add to Dashboard
            </Button>
            {error && <div className="error-message mt-2">{error}</div>}
        </div>
    </Card.Body>
</Card>

          </Col>

          <Col md={4}>
            <Card className="recently-searched-card mb-4">
              <Card.Header>Recently Searched Artists</Card.Header>
              <ListGroup variant="flush">
                {recentlySearchedArtists.map((artist) => (
                  <ListGroup.Item key={artist.id} className="recent-artist-item d-flex align-items-center">
                    <img 
                      src={artist.artist_image} 
                      alt={artist.artist_name} 
                      className="artist-thumbnail" 
                    />
                    <span>{artist.artist_name}</span>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card>
          </Col>
        </Row>
      )}

      <Row>
        <Col>
          <Card className="user-dashboard-card mb-4">
            <Card.Header>My Artists</Card.Header>
            <ListGroup variant="flush">
              {userArtists.map((artist) => (
                <ListGroup.Item key={artist.id} className="user-artist-item d-flex align-items-center">
                  <img 
                    src={artist.artist_image} 
                    alt={artist.artist_name} 
                    className="user-artist-image" 
                  />
                  <div className="user-artist-info">
                    <div className="artist-name">{artist.artist_name}</div>
                    <div className="total-duration">{artist.total_duration}</div>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
