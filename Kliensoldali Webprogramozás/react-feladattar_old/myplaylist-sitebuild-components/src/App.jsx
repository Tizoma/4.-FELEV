//img helyett
//class helyett classnamere replaceltük
// '-t  &apos;-sal replaceljük

import { examplePlaylists } from "../sitebuild/domain/playlist";
import { exampleTracks } from "../sitebuild/domain/track";
import { PlayLists } from "./Playlists/PlayLists";
import { TrackDetails } from "./Playlists/TrackDetails";
import { TrackList } from "./Playlists/TrackList";

function App() {
  const activePlayList = 1;
  const playlists = examplePlaylists;
  const tracks = exampleTracks;
  return (
    <>
      <div className="ui secondary menu">
        <img src="assets/logo.png" />
        <a className="item" href="index.html">
          <i className="home icon"></i> Home
        </a>
        <a className="active item" href="playlists.html">
          <i className="headphones icon"></i> My Playlists
        </a>
        <a className="item" href="tracks.html">
          <i className="music icon"></i> Tracks
        </a>
        <a className="item" href="search.html">
          <i className="search icon"></i> Search
        </a>
        <div className="ui right dropdown item">
          John Doe
          <i className="dropdown icon"></i>
          <div className="menu">
            <div className="item">
              <i className="user icon"></i> Profile
            </div>
            <div className="item">
              <i className="settings icon"></i> Settings
            </div>
            <div className="item">
              <i className="sign out icon"></i>Log out
            </div>
          </div>
        </div>
      </div>
      <div className="ui container">
        <h1>My Playlists</h1>
        <div className="ui stackable two column grid">
          <PlayLists activePlayList={activePlayList} playlists={playlists} />
          <TrackList tracks={tracks} />
          <div className="ui divider"></div>
          <TrackDetails />
        </div>
      </div>

      <div className="ui modal">
        <i className="close icon"></i>
        <div className="header">Add new Playlist</div>
        <div className="image content">
          <div className="description">
            <div className="ui form">
              <div className="field">
                <label>Name</label>
                <input required type="text" placeholder="My Playlist" />
              </div>
            </div>
          </div>
        </div>
        <div className="actions">
          <div className="ui black deny button">Cancel</div>
          <div className="ui positive right labeled icon button">
            Add
            <i className="plus icon"></i>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
