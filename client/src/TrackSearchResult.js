import React from 'react';
import './TrackSearchResult.scss';

export default function TrackSearchResult({ track, chooseTrack }) {
  function handlePlay() {
    chooseTrack(track);
  }

  return (
    <div
      className="track-result d-flex m-2 align-items-center"
      onClick={handlePlay}
    >
      <img src={track.albumUrl} className="track-image" />
      <div className="track-details ml-3">
        <div className="track-title">{track.title}</div>
        <div className="track-artist text-muted">{track.artist}</div>
      </div>
    </div>
  );
}
