import { useParams, useLocation, useRoutes, useOutlet } from "react-router-dom";
import { PlaylistForm } from "./PlaylistForm";
import { PlaylistList } from "./PlaylistList";
import { TrackList } from "./TrackList";
import { TrackDetails } from "./TrackDetails";

import { examplePlaylists } from "../../domain/playlist";

export const Playlists = () => {
  const { playlistID, trackID } = useParams();

  const selectedPlaylistId = parseInt(playlistID);
  const selectedTrackId = parseInt(trackID);

  const playlists = examplePlaylists;

  // Computed values
  const selectedPlaylist = playlists.find((pl) => pl.id === selectedPlaylistId);
  const selectedTrack = selectedPlaylist?.tracks.find((tr) => tr.id === selectedTrackId);

  const location = useLocation();
  console.log(location);

  return (
    <div className="ui container">
      <h1>My Playlists</h1>
      <div className="ui stackable two column grid">
        <div className="ui six wide column">
          <h3>Playlists</h3>
          <PlaylistForm />
          <PlaylistList playlists={playlists} selectedPlaylistId={selectedPlaylistId} />
        </div>
        <div className="ui ten wide column">
          {selectedPlaylist && 
            <TrackList playlist={selectedPlaylist} selectedTrackId={selectedTrackId} />
          }
        </div>
      </div>
      <div className="ui divider"></div>
      {selectedTrack && 
        <TrackDetails track={selectedTrack} />
      }
    </div>
  );
};
