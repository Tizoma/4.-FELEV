import { useState } from "react";
import { examplePlaylists } from "../../sitebuild/domain/playlist";
import { PlaylistList } from "./PlaylistList";
import { TrackDetails } from "./TrackDetails";
import { TrackList } from "./TrackList";

export function Playlists() {
  // const activePlaylist = 1;
  const [activePlaylist, setActivePlaylist] = useState();

  const playlists = examplePlaylists;
  const playlist = playlists?.find((p) => p.id === activePlaylist);

  const [activeTrack, setActiveTrack] = useState();
  const track = playlist?.tracks.find((t) => t.id === activeTrack);

  return (
    <>
      <h1>My Playlists</h1>
      <div className="ui stackable two column grid">
        <div className="ui six wide column">
          <PlaylistList activePlaylist={activePlaylist} playlists={playlists} setActivePlaylist={setActivePlaylist} />
        </div>
        <div className="ui ten wide column">
          <TrackList playlist={playlist} activeTrack={activeTrack} setActiveTrack={setActiveTrack} />
        </div>
      </div>
      <div className="ui divider"></div>
      <div className="ui segment">
        <div className="ui items">
          <TrackDetails track={track} />
        </div>
      </div>
    </>
  );
}
