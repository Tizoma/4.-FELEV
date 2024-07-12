/* eslint-disable react/prop-types */
import { useState } from "react";
import { Modal } from "semantic-ui-react";

const Field = ({ label, placeholder, name }) => {
  return (
    <div className="field">
      <label>{label}</label>
      <input name={name} type="text" placeholder={placeholder} />
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

export function TrackForm({ open, onClose }) {
  const [formState, setFromState] = useState(defaultState);
  //as-al átlehet írni hogy jsx element maskent viselkedjen
  //pl modalnal az as="form"
  return (
    <Modal as="form" className="ui modal" closeIcon open={open} onClose={() => onClose(false)}>
      <div className="header">Add new Track</div>
      <div className="image content">
        <div className="description">
          <div className="ui form">
            <div className="three fields">
              <Field label="Author" placeholder="John Williams" name="artist" />
              <Field label="Track name" placeholder="Imperial March" name="title" />
              <Field label="Length" placeholder="3:44" name="length" />
            </div>
            <div className="three fields">
              <Field label="Spotify URL" placeholder="https://" name="spotifyURL" />
              <Field label="Lyrics URL" placeholder="https://" name="lyricsURL" />
              <Field label="Guitar tab URL" placeholder="https://" name="chordsURL" />
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
