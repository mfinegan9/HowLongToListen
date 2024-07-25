
//dont need



import React from 'react';
import { ListGroup } from 'react-bootstrap';

const SearchResults = ({ searchResults, selectArtist }) => (
  <ListGroup className="mb-4">
    {searchResults.map((artist) => (
      <ListGroup.Item key={artist.id} onClick={() => selectArtist(artist)} style={{ cursor: 'pointer' }}>
        {artist.name}
      </ListGroup.Item>
    ))}
  </ListGroup>
);

export default SearchResults;
