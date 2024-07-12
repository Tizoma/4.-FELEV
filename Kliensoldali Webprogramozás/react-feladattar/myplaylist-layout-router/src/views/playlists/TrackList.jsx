import classNames from "classnames";
import { Link } from "react-router-dom";

export function TrackList({ playlist, selectedTrackId }) {
  return (
    <>
      <h3>{playlist.title}</h3>
      <div className="ui very relaxed selection list">
        {playlist.tracks.map((track) => (
          <Link to={`/playlists/${playlist.id}/${track.id}`} className={ classNames('item', {active: selectedTrackId === track.id})} key={track.id}>
            <i className="large music middle aligned icon"></i>
            <div className="content">
              <a className="header">{track.title}</a>
              <div className="description">{track.artist}</div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
