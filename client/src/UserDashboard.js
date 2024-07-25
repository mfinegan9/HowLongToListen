import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
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
                <Card.Title className="artist-name">{artist.artist_name}</Card.Title>
                <Card.Img
                  src={artist.artist_image}
                  alt={artist.artist_name}
                  className="user-artist-image"
                />
                <Card.Text className="total-duration">
                  Total Duration: {artist.total_duration}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default UserDashboard;
