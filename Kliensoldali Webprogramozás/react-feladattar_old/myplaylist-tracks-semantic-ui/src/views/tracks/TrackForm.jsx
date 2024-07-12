import { useState } from "react";
import { Modal } from "semantic-ui-react";

/* eslint-disable react/prop-types */
const Field = ({ label, placeholder, name, value, onChange }) => {
  return (
    <div className="field">
      <label>{label}</label>
      <input name={name} type="text" placeholder={placeholder} value={value} onChange={onChange} />
    </div>
  );
};

const defaultState = {
  artist: "",
  title: "",
  length: "",
  thumbnailURL: "",
  spotifyURL: "",
  chordsURL: "",
  lyricsURL: "",
};

export function TrackForm({ open, onClose, onSubmit }) {
  const [formState, setFormState] = useState(defaultState);

  const resetForm = state => setFormState(defaultState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formState);
    resetForm();
    onClose();
  };

  return (
    <Modal as="form" className="ui modal" closeIcon open={open} onClose={onClose} onSubmit={handleSubmit}>
      <div className="header">Add new Track</div>
      <div className="image content">
        <div className="description">
          <div className="ui form">
            <div className="three fields">
              <Field
                label="Author"
                placeholder="John Williams"
                name="artist"
                value={formState.artist}
                onChange={handleChange}
              />
              <Field
                label="Track name"
                placeholder="Imperial March"
                name="title"
                value={formState.title}
                onChange={handleChange}
              />
              <Field label="Length" placeholder="3:44" name="length" value={formState.length} onChange={handleChange} />
            </div>
            <div className="three fields">
              <Field
                label="Spotify URL"
                placeholder="https://"
                name="spotifyURL"
                value={formState.spotifyURL}
                onChange={handleChange}
              />
              <Field
                label="Lyrics URL"
                placeholder="https://"
                name="lyricsURL"
                value={formState.lyricsURL}
                onChange={handleChange}
              />
              <Field
                label="Guitar tab URL"
                placeholder="https://"
                name="chordsURL"
                value={formState.chordsURL}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="actions">
        <div className="ui black deny button" onClick={onClose}>
          Cancel
        </div>
        <button className="ui positive right labeled icon button">
          Add
          <i className="plus icon"></i>
        </button>
      </div>
    </Modal>
  );
}
