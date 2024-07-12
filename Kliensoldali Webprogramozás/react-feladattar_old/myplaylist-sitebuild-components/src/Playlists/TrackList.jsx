import PropTypes from "prop-types";

export function TrackList(tracks) {
  return (
    <>
      <div className="ui ten wide column">
        <h3>Classics</h3>
        <div className="ui very relaxed selection list">
          {tracks.map((track) => (
            <div className="item" key={track.id}>
              <i className="large music middle aligned icon"></i>
              <div className="content">
                <a className="header">{track.title}</a>
                <div className="description">{track.artist}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

TrackList.propTypes = {
  tracks: PropTypes.array,
};
