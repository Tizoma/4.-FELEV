import classNames from "classnames";

export function TrackList({ playlist, activeTrack, setActiveTrack }) {
  return (!playlist ? null :
    <>
      <h3>{playlist.title}</h3>
      <div className="ui very relaxed selection list">
        {playlist.tracks.map((track) => (
          <div className={ classNames('item', {active: activeTrack === track.id})} key={track.id} onClick={() => setActiveTrack(track.id)}>
            <i className="large music middle aligned icon"></i>
            <div className="content">
              <a className="header">{track.title}</a>
              <div className="description">{track.artist}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
