//dont need


import React from 'react';
import { Card, ListGroup } from 'react-bootstrap';

const RecentlySearchedArtists = ({ recentlySearchedArtists }) => (
  <Card className="mb-4">
    <Card.Header>Recently Searched Artists</Card.Header>
    <ListGroup variant="flush">
      {recentlySearchedArtists.map((artist) => (
        <ListGroup.Item key={artist.id}>
          <div className="d-flex align-items-center">
            <img
              src={artist.artist_image}
              alt={artist.artist_name}
              style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '10px' }}
            />
            <div>{artist.artist_name}</div>
          </div>
        </ListGroup.Item>
      ))}
    </ListGroup>
  </Card>
);

export default RecentlySearchedArtists;
