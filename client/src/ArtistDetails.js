//dont need

import React from 'react';
import { Card, Button } from 'react-bootstrap';

const ArtistDetails = ({ artistDetails, addArtistToDashboard }) => (
  <Card className="mb-4">
    <Card.Body>
      <Card.Title>{artistDetails.artistName}</Card.Title>
      {artistDetails.artistImage && (
        <Card.Img
          src={artistDetails.artistImage}
          alt={artistDetails.artistName}
          style={{ width: '200px', height: '200px', objectFit: 'cover', marginBottom: '10px' }}
        />
      )}
      <Card.Text>Total Duration: {artistDetails.totalDuration}</Card.Text>
      <Button onClick={addArtistToDashboard}>Add to Dashboard</Button>
    </Card.Body>
  </Card>
);

export default ArtistDetails;
