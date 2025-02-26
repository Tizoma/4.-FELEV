import bonjovi from "../../sitebuild/assets/bonjovi.jpg";

export function TrackDetails() {
  return (
    <>
      <div className="ui segment">
        <div className="ui items">
          <div className="item">
            <div className="image">
              <img src={bonjovi} />
            </div>
            <div className="content">
              <a className="header">It&apos;s my life</a>
              <div className="meta">
                <span>Bon Jovi</span>
                <span>4:35</span>
              </div>
              <div className="extra">
                <a
                  href="https://open.spotify.com/track/0v1XpBHnsbkCn7iJ9Ucr1l"
                  className="ui button tiny green button"
                  target="_blank"
                  rel="noreferrer"
                >
                  <i className="spotify icon"></i>
                  Listen on Spotify
                </a>
                <a
                  href="https://tabs.ultimate-guitar.com/tab/bon-jovi/its-my-life-chords-951538"
                  className="ui button tiny teal button"
                  target="_blank"
                  rel="noreferrer"
                >
                  <i className="microphone icon"></i>
                  Show lyrics
                </a>
                <a
                  href="https://www.azlyrics.com/lyrics/bonjovi/itsmylife.html"
                  className="ui button tiny orange button"
                  target="_blank"
                  rel="noreferrer"
                >
                  <i className="guitar icon"></i>
                  Show chords
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
