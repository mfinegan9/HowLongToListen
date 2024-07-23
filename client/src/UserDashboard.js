import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, ProgressBar } from "react-bootstrap";
import axios from "axios";
import './UserDashboard.scss';

const UserDashboard = () => {
  const [userArtists, setUserArtists] = useState([]);

  const fetchUserArtists = async () => {
    try {
      const response = await axios.get("http://localhost:3007/user-artists");
      setUserArtists(response.data);
    } catch (error) {
      console.error("Error fetching user artists:", error);
    }
  };

  useEffect(() => {
    fetchUserArtists();
  }, []);

  return (
    <Container className="user-dashboard-container my-4">
      <Row>
        {userArtists.map((artist, index) => (
          <Col key={index} md={4} className="mb-4">
            <Card className="user-dashboard-card">
              <Card.Body>
                <Card.Title>{artist.artist_name}</Card.Title>
                <Card.Img
                  src={artist.artist_image}
                  alt={artist.artist_name}
                  className="user-artist-image"
                />
                <Card.Text>
                  Total Duration: {artist.total_duration}
                </Card.Text>
                {/* Progress Bar */}
                <div className="progress-bar-container">
                  <ProgressBar 
                    now={artist.progress * 100} 
                    label={`${Math.round(artist.progress * 100)}%`} 
                    variant="success" 
                  />
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default UserDashboard;
