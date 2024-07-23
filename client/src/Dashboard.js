


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
      const albumsResponse = await spotifyApi.getArtistAlbums(artist.id);
      const albums = albumsResponse.body.items;

      let totalDuration = 0;

      for (const album of albums) {
        const tracksResponse = await spotifyApi.getAlbumTracks(album.id);
        const tracks = tracksResponse.body.items;

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
      await axios.post("http://localhost:3007/add-artist-to-dashboard", {
        artistName: artistDetails.artistName,
        artistImage: artistDetails.artistImage,
        totalDuration: artistDetails.totalDuration,
      });
      fetchUserArtists();
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
        <Container>
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
          {searchResults.map((artist) => (
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
              <Card.Body>
                <Card.Title>{artistDetails.artistName}</Card.Title>
                {artistDetails.artistImage && (
                  <Card.Img 
                    src={artistDetails.artistImage} 
                    alt={artistDetails.artistName} 
                    className="artist-image mb-3"
                  />
                )}
                <Card.Text>
                  Total Duration: {artistDetails.totalDuration}
                </Card.Text>
                <Button onClick={addArtistToDashboard}>Add to Dashboard</Button>
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
            <Card.Header>User Dashboard</Card.Header>
            <ListGroup variant="flush">
              {userArtists.map((artist) => (
                <ListGroup.Item key={artist.id} className="user-artist-item d-flex align-items-center">
                  <img 
                    src={artist.artist_image} 
                    alt={artist.artist_name} 
                    className="user-artist-image" 
                  />
                  <div>
                    <div>{artist.artist_name}</div>
                    <div>Total Duration: {artist.total_duration}</div>
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













//old UI- green background

// import React, { useState, useEffect, useCallback } from "react";
// import { Container, Form, Row, Col, Card, ListGroup, Navbar, Button } from "react-bootstrap";
// import SpotifyWebApi from "spotify-web-api-node";
// import useAuth from "./useAuth";
// import axios from "axios";

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

//   useEffect(() => {
//     if (!accessToken) return;
//     spotifyApi.setAccessToken(accessToken);
//   }, [accessToken]);

//   const searchArtists = useCallback(async () => {
//     try {
//       const response = await spotifyApi.searchArtists(search);
//       setSearchResults(response.body.artists.items);
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

//     try {
//       const albumsResponse = await spotifyApi.getArtistAlbums(artist.id);
//       const albums = albumsResponse.body.items;

//       let totalDuration = 0;

//       for (const album of albums) {
//         const tracksResponse = await spotifyApi.getAlbumTracks(album.id);
//         const tracks = tracksResponse.body.items;

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
//       await axios.post("http://localhost:3007/add-artist-to-dashboard", {
//         artistName: artistDetails.artistName,
//         artistImage: artistDetails.artistImage,
//         totalDuration: artistDetails.totalDuration,
//       });
//       fetchUserArtists();
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
//     <Container className="d-flex flex-column py-4" style={{ height: "100vh", backgroundColor: "#4CAF50" }}>
//       <Navbar bg="dark" variant="dark" className="mb-4">
//         <Container>
//           <Navbar.Brand href="#" style={{ fontSize: "24px", fontWeight: "bold", textAlign: "center", width: "100%" }}>
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
//           className="mb-3"
//         />
//       </Form>

//       {searchResults.length > 0 && (
//         <ListGroup className="mb-3">
//           {searchResults.map((artist) => (
//             <ListGroup.Item
//               key={artist.id}
//               onClick={() => selectArtist(artist)}
//               style={{ cursor: "pointer", backgroundColor: "#343a40", color: "white" }}
//             >
//               {artist.name}
//             </ListGroup.Item>
//           ))}
//         </ListGroup>
//       )}
      
//       {artistDetails.artistName && (
//         <Row className="my-2">
//           <Col md={8}>
//             <Card className="mb-4">
//               <Card.Body>
//                 <Card.Title>{artistDetails.artistName}</Card.Title>
//                 {artistDetails.artistImage && (
//                   <Card.Img 
//                     src={artistDetails.artistImage} 
//                     alt={artistDetails.artistName} 
//                     className="mb-3" 
//                     style={{ width: "100%", height: "auto", maxWidth: "300px", objectFit: "contain" }}
//                   />
//                 )}
//                 <Card.Text>
//                   Total Duration: {artistDetails.totalDuration}
//                 </Card.Text>
//                 <Button onClick={addArtistToDashboard}>Add to Dashboard</Button>
//               </Card.Body>
//             </Card>
//           </Col>
          
//           <Col md={4}>
//             <Card className="mb-4">
//               <Card.Header>Recently Searched Artists</Card.Header>
//               <ListGroup variant="flush">
//                 {recentlySearchedArtists.map((artist) => (
//                   <ListGroup.Item key={artist.id} className="d-flex align-items-center">
//                     <img 
//                       src={artist.artist_image} 
//                       alt={artist.artist_name} 
//                       style={{ width: "50px", height: "50px", objectFit: "cover", marginRight: "10px" }} 
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
//           <Card className="mb-4">
//             <Card.Header>User Dashboard</Card.Header>
//             <ListGroup variant="flush">
//               {userArtists.map((artist) => (
//                 <ListGroup.Item key={artist.id} className="d-flex align-items-center">
//                   <img 
//                     src={artist.artist_image} 
//                     alt={artist.artist_name} 
//                     style={{ width: "50px", height: "50px", objectFit: "cover", marginRight: "10px" }} 
//                   />
//                   <div>
//                     <div>{artist.artist_name}</div>
//                     <div>Total Duration: {artist.total_duration}</div>
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












//TIME THAT WORKS!!!!!


// import React, { useState, useEffect, useCallback } from "react";
// import { Container, Form, Row, Col, Card, ListGroup } from "react-bootstrap";
// import SpotifyWebApi from "spotify-web-api-node";
// import useAuth from "./useAuth";
// import axios from "axios";

// const spotifyApi = new SpotifyWebApi({
//   clientId: "69b8e423003a4b428541484e7370d768",
// });

// const Dashboard = ({ code }) => {
//   const accessToken = useAuth(code);
//   const [search, setSearch] = useState("");
//   const [searchResults, setSearchResults] = useState([]);
//   const [artistDetails, setArtistDetails] = useState({});
//   const [recentlySearchedArtists, setRecentlySearchedArtists] = useState([]);

//   useEffect(() => {
//     if (!accessToken) return;
//     spotifyApi.setAccessToken(accessToken);
//   }, [accessToken]);

//   const searchArtists = useCallback(async () => {
//     try {
//       const response = await spotifyApi.searchArtists(search);
//       setSearchResults(response.body.artists.items);
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

//     try {
//       const albumsResponse = await spotifyApi.getArtistAlbums(artist.id);
//       const albums = albumsResponse.body.items;

//       let totalDuration = 0;

//       // Fetch tracks from each album and sum their durations
//       for (const album of albums) {
//         const tracksResponse = await spotifyApi.getAlbumTracks(album.id);
//         const tracks = tracksResponse.body.items;

//         tracks.forEach(track => {
//           totalDuration += track.duration_ms;
//         });
//       }

//       // Convert duration to hours and minutes
//       const totalHours = Math.floor(totalDuration / 3600000);
//       const totalMinutes = Math.floor((totalDuration % 3600000) / 60000);
      
//       setArtistDetails({
//         artistName: artist.name,
//         artistImage: artist.images[0]?.url,
//         totalDuration: `${totalHours}h ${totalMinutes}m`, // Display format
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

//   useEffect(() => {
//     fetchRecentlySearchedArtists();
//   }, []);

//   return (
//     <Container className="d-flex flex-column py-4" style={{ height: "100vh", backgroundColor: "#4CAF50" }}>
//       <Form>
//         <Form.Control
//           type="search"
//           placeholder="Search Artists"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           id="artist-search"
//           name="artistSearch"
//           className="mb-3"
//         />
//       </Form>
//       {searchResults.length > 0 && (
//         <ListGroup className="mb-3">
//           {searchResults.map((artist) => (
//             <ListGroup.Item
//               key={artist.id}
//               onClick={() => selectArtist(artist)}
//               style={{ cursor: "pointer" }}
//             >
//               {artist.name}
//             </ListGroup.Item>
//           ))}
//         </ListGroup>
//       )}
//       <Row className="my-2">
//         <Col md={8}>
//           <Card className="text-center text-white bg-dark mb-4">
//             <Card.Body>
//               {artistDetails.artistName && (
//                 <>
//                   <img
//                     src={artistDetails.artistImage}
//                     alt={artistDetails.artistName}
//                     className="rounded-circle mb-3"
//                     style={{ width: "150px", height: "150px" }}
//                   />
//                   <h5>{artistDetails.artistName}</h5>
//                   {artistDetails.totalDuration && (
//                     <p>Total Duration of Discography: {artistDetails.totalDuration}</p>
//                   )}
//                 </>
//               )}
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={4}>
//           <Card className="bg-dark text-white">
//             <Card.Body>
//               <h4>Recently Searched Artists:</h4>
//               <ul className="list-unstyled">
//                 {recentlySearchedArtists.map((artist, index) => (
//                   <li key={index} className="d-flex align-items-center mb-2">
//                     <img
//                       src={artist.artist_image}
//                       alt={artist.artist_name}
//                       className="rounded-circle me-2"
//                       style={{ width: "50px", height: "50px" }}
//                     />
//                     <span>{artist.artist_name}</span>
//                   </li>
//                 ))}
//               </ul>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default Dashboard;




























// //new ui

// import React, { useState, useEffect } from "react";
// import { Container, Form, Row, Col, Card, ListGroup } from "react-bootstrap";
// import SpotifyWebApi from "spotify-web-api-node";
// import useAuth from "./useAuth";
// import axios from "axios";

// const spotifyApi = new SpotifyWebApi({
//   clientId: "69b8e423003a4b428541484e7370d768",
// });

// const Dashboard = ({ code }) => {
//   const accessToken = useAuth(code);
//   const [search, setSearch] = useState("");
//   const [searchResults, setSearchResults] = useState([]);
//   const [artistDetails, setArtistDetails] = useState({});
//   const [recentlySearchedArtists, setRecentlySearchedArtists] = useState([]);

//   useEffect(() => {
//     if (!accessToken) return;
//     spotifyApi.setAccessToken(accessToken);
//   }, [accessToken]);

//   useEffect(() => {
//     if (search) {
//       searchArtists();
//     } else {
//       setSearchResults([]);
//     }
//   }, [search]);

//   const searchArtists = async () => {
//     try {
//       const response = await spotifyApi.searchArtists(search);
//       setSearchResults(response.body.artists.items);
//     } catch (error) {
//       console.error("Error searching artists:", error);
//     }
//   };

//   const selectArtist = async (artist) => {
//     setSearch(artist.name);
//     setSearchResults([]);

//     // Fetch artist details
//     const artistId = artist.id;
//     const artistAlbumsResponse = await spotifyApi.getArtistAlbums(artistId);
//     let totalDurationMs = 0;

//     artistAlbumsResponse.body.items.forEach((album) => {
//       totalDurationMs += album.total_tracks * album.duration_ms;
//     });
    
//     const totalDurationHours = totalDurationMs / (1000 * 60 * 60);

//     setArtistDetails({
//       artistName: artist.name,
//       artistImage: artist.images[0]?.url,
//       totalDiscographyTime: totalDurationHours.toFixed(2),
//     });

//     saveSearchedArtist(artist.name, artist.images[0]?.url);
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

//   useEffect(() => {
//     fetchRecentlySearchedArtists();
//   }, []);

//   return (
//     <Container className="d-flex flex-column py-4" style={{ height: "100vh", backgroundColor: "#121212" }}>
//       <Form>
//         <Form.Control
//           type="search"
//           placeholder="Search Artists"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="mb-3"
//         />
//       </Form>
//       {searchResults.length > 0 && (
//         <ListGroup className="mb-3">
//           {searchResults.map((artist) => (
//             <ListGroup.Item
//               key={artist.id}
//               onClick={() => selectArtist(artist)}
//               style={{ cursor: "pointer" }}
//             >
//               {artist.name}
//             </ListGroup.Item>
//           ))}
//         </ListGroup>
//       )}
//       <Row className="my-2">
//         <Col md={8}>
//           <Card className="text-center text-white bg-dark mb-4">
//             <Card.Body>
//               {artistDetails.artistName && (
//                 <>
//                   <img
//                     src={artistDetails.artistImage}
//                     alt={artistDetails.artistName}
//                     className="rounded-circle mb-3"
//                     style={{ width: "150px", height: "150px" }}
//                   />
//                   <h5>{artistDetails.artistName}</h5>
//                   <p>Total Discography Time: {artistDetails.totalDiscographyTime} hours</p>
//                 </>
//               )}
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={4}>
//           <Card className="bg-dark text-white">
//             <Card.Body>
//               <h4>Recently Searched Artists:</h4>
//               <ul className="list-unstyled">
//                 {recentlySearchedArtists.map((artist, index) => (
//                   <li key={index} className="d-flex align-items-center mb-2">
//                     <img
//                       src={artist.artist_image}
//                       alt={artist.artist_name}
//                       className="rounded-circle me-2"
//                       style={{ width: "50px", height: "50px" }}
//                     />
//                     <span>{artist.artist_name}</span>
//                   </li>
//                 ))}
//               </ul>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default Dashboard;






















// //postgres


// import React, { useState, useEffect } from "react";
// import { Container, Form, Row, Col } from "react-bootstrap";
// import SpotifyWebApi from "spotify-web-api-node";
// import useAuth from "./useAuth";
// import axios from "axios";

// const spotifyApi = new SpotifyWebApi({
//   clientId: "69b8e423003a4b428541484e7370d768", 
// });

// const Dashboard = ({ code }) => {
//   const accessToken = useAuth(code);
//   const [search, setSearch] = useState("");
//   const [searchResults, setSearchResults] = useState([]);
//   const [artistDetails, setArtistDetails] = useState({
//     artistName: "",
//     artistImage: "",
//     totalDiscographyTime: "Loading...", // Placeholder text while loading
//   });
//   const [recentlySearchedArtists, setRecentlySearchedArtists] = useState([]);

//   useEffect(() => {
//     if (!accessToken) return;
//     spotifyApi.setAccessToken(accessToken);
//   }, [accessToken]);

//   const searchArtists = async () => {
//     try {
//       const response = await spotifyApi.searchArtists(search);
//       const artist = response.body.artists.items[0]; // Assuming we only take the first artist in search
//       const artistId = artist.id;

//       // Fetch artist details
//       const artistAlbumsResponse = await spotifyApi.getArtistAlbums(artistId);
//       let totalDurationMs = 0;
//       artistAlbumsResponse.body.items.forEach((album) => {
//         totalDurationMs += album.total_tracks * album.duration_ms;
//       });
//       const totalDurationHours = totalDurationMs / (1000 * 60 * 60); // Convert milliseconds to hours

//       if (!isNaN(totalDurationHours)) {
//         setArtistDetails({
//           artistName: artist.name,
//           artistImage: artist.images[0]?.url,
//           totalDiscographyTime: totalDurationHours.toFixed(2), // Format to two decimal places
//         });
//       } else {
//         setArtistDetails({
//           artistName: artist.name,
//           artistImage: artist.images[0]?.url,
//           totalDiscographyTime: "Not available", // Handle case where total duration is NaN
//         });
//       }

//       // Save searched artist to PostgreSQL
//       saveSearchedArtist(artist.name, artist.images[0]?.url);

//     } catch (error) {
//       console.error("Error searching artists:", error);
//       setArtistDetails({
//         artistName: "Artist not found",
//         artistImage: "",
//         totalDiscographyTime: "Not available", // Handle error state
//       });
//     }
//   };

//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (!search) return;
//     searchArtists();
//   };

//   const saveSearchedArtist = async (artistName, artistImage) => {
//     try {
//       await axios.post("http://localhost:3007/save-searched-artist", {
//         artistName,
//         artistImage,
//       });

//       // Fetch recently searched artists
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

//   useEffect(() => {
//     // Fetch initial recently searched artists
//     fetchRecentlySearchedArtists();
//   }, []);

//   return (
//     <Container className="d-flex flex-column py-2" style={{ height: "100vh" }}>
//       <Form onSubmit={handleSearch}>
//         <Form.Control
//           type="search"
//           placeholder="Search Artists"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />
//       </Form>
//       <Row className="my-2">
//         <Col md={8}>
//           <div className="flex-grow-1" style={{ overflowY: "auto" }}>
//             {artistDetails.artistName && (
//               <div style={{ marginBottom: "20px" }}>
//                 <img
//                   src={artistDetails.artistImage}
//                   alt={artistDetails.artistName}
//                   style={{ maxWidth: "200px", maxHeight: "200px", borderRadius: "50%" }}
//                 />
//                 <p>{artistDetails.artistName}</p>
//                 <p>Total Discography Time: {artistDetails.totalDiscographyTime} hours</p>
//               </div>
//             )}
//           </div>
//         </Col>
//         <Col md={4}>
//           <div>
//             <h4>Recently Searched Artists:</h4>
//             <ul>
//               {recentlySearchedArtists.map((artist, index) => (
//                 <li key={index}>
//                   <img
//                     src={artist.artist_image}
//                     alt={artist.artist_name}
//                     style={{ width: "50px", height: "50px", borderRadius: "50%" }}
//                   />
//                   <span>{artist.artist_name}</span>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default Dashboard;


















//discography time

// import React, { useState, useEffect } from "react";
// import { Container, Form } from "react-bootstrap";
// import SpotifyWebApi from "spotify-web-api-node";
// import useAuth from "./useAuth";

// const spotifyApi = new SpotifyWebApi({
//   clientId: "YOUR_CLIENT_ID",
// });

// const Dashboard = ({ code }) => {
//   const accessToken = useAuth(code);
//   const [search, setSearch] = useState("");
//   const [searchResults, setSearchResults] = useState([]);
//   const [artistDetails, setArtistDetails] = useState({
//     artistName: "",
//     artistImage: "",
//     totalDiscographyTime: "Loading...", // Placeholder text while loading
//   });

//   useEffect(() => {
//     if (!accessToken) return;
//     spotifyApi.setAccessToken(accessToken);
//   }, [accessToken]);

//   const searchArtists = async () => {
//     try {
//       const response = await spotifyApi.searchArtists(search);
//       const artist = response.body.artists.items[0]; // Assuming we only take the first artist in search
//       const artistId = artist.id;

//       // Fetch artist details
//       const artistAlbumsResponse = await spotifyApi.getArtistAlbums(artistId);
//       let totalDurationMs = 0;
//       artistAlbumsResponse.body.items.forEach((album) => {
//         totalDurationMs += album.total_tracks * album.duration_ms;
//       });
//       const totalDurationHours = totalDurationMs / (1000 * 60 * 60); // Convert milliseconds to hours

//       if (!isNaN(totalDurationHours)) {
//         setArtistDetails({
//           artistName: artist.name,
//           artistImage: artist.images[0]?.url,
//           totalDiscographyTime: totalDurationHours.toFixed(2), // Format to two decimal places
//         });
//       } else {
//         setArtistDetails({
//           artistName: artist.name,
//           artistImage: artist.images[0]?.url,
//           totalDiscographyTime: "Not available", // Handle case where total duration is NaN
//         });
//       }

//     } catch (error) {
//       console.error("Error searching artists:", error);
//       setArtistDetails({
//         artistName: "Artist not found",
//         artistImage: "",
//         totalDiscographyTime: "Not available", // Handle error state
//       });
//     }
//   };

//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (!search) return;
//     searchArtists();
//   };

//   return (
//     <Container className="d-flex flex-column py-2" style={{ height: "100vh" }}>
//       <Form onSubmit={handleSearch}>
//         <Form.Control
//           type="search"
//           placeholder="Search Artists"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />
//       </Form>
//       <div className="flex-grow-1 my-2" style={{ overflowY: "auto" }}>
//         {artistDetails.artistName && (
//           <div style={{ marginBottom: "20px" }}>
//             <img
//               src={artistDetails.artistImage}
//               alt={artistDetails.artistName}
//               style={{ maxWidth: "200px", maxHeight: "200px", borderRadius: "50%" }}
//             />
//             <p>{artistDetails.artistName}</p>
//             <p>Total Discography Time: {artistDetails.totalDiscographyTime} hours</p>
//           </div>
//         )}
//       </div>
//     </Container>
//   );
// };

// export default Dashboard;














// // gets song duration

// import React, { useState, useEffect } from "react";
// import { Container, Form, Card, Button } from "react-bootstrap";
// import SpotifyWebApi from "spotify-web-api-node";
// import useAuth from "./useAuth";

// const spotifyApi = new SpotifyWebApi({
//     clientId: "69b8e423003a4b428541484e7370d768",
// });

// const Dashboard = ({ code }) => {
//     const accessToken = useAuth(code);
//     const [search, setSearch] = useState('');
//     const [searchResults, setSearchResults] = useState([]);

//     useEffect(() => {
//         if (!accessToken) return;
//         spotifyApi.setAccessToken(accessToken);
//     }, [accessToken]);

//     const searchTracks = async () => {
//         try {
//             const response = await spotifyApi.searchTracks(search);
//             const tracks = response.body.tracks.items.map(track => ({
//                 id: track.id,
//                 name: track.name,
//                 artist: track.artists.map(artist => artist.name).join(", "),
//                 duration_ms: track.duration_ms,
//             }));
//             setSearchResults(tracks);
//         } catch (error) {
//             console.error("Error searching tracks:", error);
//         }
//     };

//     const msToTime = (duration) => {
//         const seconds = Math.floor((duration / 1000) % 60);
//         const minutes = Math.floor((duration / (1000 * 60)) % 60);
//         return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
//     };

//     return (
//         <Container className="py-4">
//             <Form onSubmit={(e) => { e.preventDefault(); searchTracks(); }}>
//                 <Form.Control
//                     type="search"
//                     placeholder="Search Songs"
//                     value={search}
//                     onChange={e => setSearch(e.target.value)}
//                 />
//                 <Button variant="primary" type="submit">Search</Button>
//             </Form>
//             <div className="d-flex flex-wrap justify-content-center mt-4">
//                 {searchResults.map(track => (
//                     <Card key={track.id} style={{ width: '18rem', margin: '0.5rem' }}>
//                         <Card.Body>
//                             <Card.Title>{track.name}</Card.Title>
//                             <Card.Text>Artist: {track.artist}</Card.Text>
//                             <Card.Text>Duration: {msToTime(track.duration_ms)}</Card.Text>
//                         </Card.Body>
//                     </Card>
//                 ))}
//             </div>
//         </Container>
//     );
// };

// export default Dashboard;



















// // for playing songs


// import { useState, useEffect } from "react"
// import useAuth from "./useAuth"
// import Player from "./Player"
// import TrackSearchResult from "./TrackSearchResult"
// import { Container, Form } from "react-bootstrap"
// import SpotifyWebApi from "spotify-web-api-node"
// import axios from "axios"

// const spotifyApi = new SpotifyWebApi({
//     clientId: "69b8e423003a4b428541484e7370d768",
//   })

// export default function Dashboard({ code }) {
//     const accessToken = useAuth(code)
//     const [search, setSearch] = useState('')
//     const [searchResults, setSearchResults] = useState([])
//     const [playingTrack, setPlayingTrack] = useState()
//     const [lyrics, setLyrics] = useState("")

//     function chooseTrack(track) {
//         setPlayingTrack(track)
//         setSearch("")
//         setLyrics("")
//       }

//       useEffect(() => {
//         if (!playingTrack) return
    
//         axios
//           .get("http://localhost:3007/lyrics", {
//             params: {
//               track: playingTrack.title,
//               artist: playingTrack.artist,
//             },
//           })
//           .then(res => {
//             setLyrics(res.data.lyrics)
//           })
//       }, [playingTrack])

//     useEffect(() => {
//         if (!accessToken) return
//         spotifyApi.setAccessToken(accessToken)
//       }, [accessToken])


//       useEffect(() => {
//         if (!search) return setSearchResults([])
//         if (!accessToken) return
    
//         let cancel = false
//         spotifyApi.searchTracks(search).then(res => {
//           if (cancel) return
//           setSearchResults(
//             res.body.tracks.items.map(track => {
//               const smallestAlbumImage = track.album.images.reduce(
//                 (smallest, image) => {
//                   if (image.height < smallest.height) return image
//                   return smallest
//                 },
//                 track.album.images[0]
//               )
    
//               return {
//                 artist: track.artists[0].name,
//                 title: track.name,
//                 uri: track.uri,
//                 albumUrl: smallestAlbumImage.url,
//               }
//             })
//           )
//         })
    
//         return () => (cancel = true)
//       }, [search, accessToken])



//       return (
//         <Container className="d-flex flex-column py-2" style={{ height: "100vh" }}>
//           <Form.Control
//             type="search"
//             placeholder="Search Songs/Artists"
//             value={search}
//             onChange={e => setSearch(e.target.value)}
//           />
//           <div className="flex-grow-1 my-2" style={{ overflowY: "auto" }}>
//             {searchResults.map(track => (
//               <TrackSearchResult
//                 track={track}
//                 key={track.uri}
//                 chooseTrack={chooseTrack}
//               />
//             ))}
//             {searchResults.length === 0 && (
//               <div className="text-center" style={{ whiteSpace: "pre" }}>
//                 {lyrics}
//               </div>
//             )}
//           </div>
//           <div>
//             <Player accessToken={accessToken} trackUri={playingTrack?.uri} />
//           </div>
//         </Container>
//       )
// }



