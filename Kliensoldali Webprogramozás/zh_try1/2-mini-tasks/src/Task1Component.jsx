import { useState } from 'react';

export default function Task1Component() {
  const [text, setText] = useState('');
  
  function handleChange(e) {
    setText(e.target.value);
  }

  return (
    <>
      <Input label="First input" text={text} handler={handleChange}/>
      <Input label="Second input" text={text} handler={handleChange} />
    </>
  );
}


function Input({ label,text,handler }) {

  return (
    <label>
      {label}
      {' '}
      <input
        value={text}
        onChange={handler}
      />
    </label>
  );
}
