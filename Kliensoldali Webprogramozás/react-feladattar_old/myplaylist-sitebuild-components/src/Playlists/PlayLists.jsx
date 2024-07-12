import PropTypes from "prop-types";

export function PlayLists(activePlayList, playlists) {
  return (
    <>
      <div className="ui six wide column">
        <h3>Playlists</h3>
        <div className="ui very relaxed selection list">
          {
            //ha jsx elementbe js kodot akarok futtatni
            // {} nincs fv utan, igy automatikus return es nem kell kiirni
            playlists.map((playlist) => (
              <div className="item" key={playlist.id}>
                <i className="large compact disc middle aligned icon"></i>
                <div className="content">
                  <a className="header">{playlist.title}</a>
                  <div className="description">{playlist.tracks.length} songs</div>
                </div>
              </div>
            ))
          }

          <div className="item" id="newPlaylist">
            <i className="large green plus middle aligned icon"></i>
            <div className="content">
              <a className="header">New</a>
              <div className="description">Create a new playlist</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

PlayLists.propTypes = {
  playlists: PropTypes.array,
  activePlayList: PropTypes.number,
};
