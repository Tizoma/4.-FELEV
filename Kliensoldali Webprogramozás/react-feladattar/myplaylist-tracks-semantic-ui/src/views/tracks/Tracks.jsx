// import { exampleTracks } from "../../domain/track";
import { TrackForm } from "./TrackForm";
import { Track } from "./Track";
import { useState } from "react";
// import { TracksContext } from "../App";
import { exampleTracks } from "../../domain/track";

export function Tracks() {
  // const tracks = exampleTracks;
  // const tracks = useContext(TracksContext);
  const [tracks, setTracks] = useState(exampleTracks);

  const [trackToEdit, setTrackToEdit] = useState(null);

  const handleEdit = (track) => {
    setTrackToEdit(track);
    handleOpen();
  }

  const handleNew = () => {
    setTrackToEdit(null);
    handleOpen();
  }

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = (track) => {
    if(track.id) {
      setTracks(tracks.map(t => t.id === track.id ? track : t));
    } else {
      const id = Math.max(...tracks.map((track) => track.id)) + 1;
      setTracks([...tracks, { ...track, id }]);
    }
  }

  return (
    <>
      <div className="ui container">
        <button href="#" className="ui right floated green button" id="newModal" onClick={handleNew}>
          <i className="plus icon"></i>
          New track
        </button>
        <h1>Tracks</h1>
        <table className="ui celled striped table">
          <thead>
            <tr>
              <th>Artist</th>
              <th>Title</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tracks.map((track) => (
              <Track key={track.id} track={track} onEdit={handleEdit} />
            ))}
          </tbody>
        </table>
      </div>

      <TrackForm open={open} onClose={handleClose} onSubmit={handleSubmit} track={trackToEdit} />
    </>
  );
}
