import classNames from "classnames";

export function PlaylistList({activePlaylist, playlists, setActivePlaylist}) {

  return (
    <>
      <h3>Playlists</h3>
      <div className="ui very relaxed selection list">

        {playlists.map(playlist => (
          <div className={ classNames('item', {active: activePlaylist === playlist.id})} key={ playlist.id } onClick={() => setActivePlaylist(playlist.id)}>
            <i className="large compact disc middle aligned icon"></i>
            <div className="content">
              <a className="header">{ playlist.title }</a>
              <div className="description">{ playlist.tracks.length } songs</div>
            </div>
          </div>
        ))}

        <div className="item" id="newPlaylist">
          <i className="large green plus middle aligned icon"></i>
          <div className="content">
            <a className="header">New</a>
            <div className="description">Create a new playlist</div>
          </div>
        </div>
      </div>
    </>
  );
}
