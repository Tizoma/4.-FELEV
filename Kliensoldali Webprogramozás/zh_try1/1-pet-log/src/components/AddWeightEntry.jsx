// ‼️ Ezt a komponenst nem kell módosítanod ‼️

import { useState } from 'react';

const AddWeightEntry = ({ onAddWeight }) => {
  const [weight, setWeight] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (weight) {
      onAddWeight(weight);
      setWeight('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-4 items-center">
      <input
        type="number"
        step="0.1"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
        className="border-2 border-gray-300 rounded-lg p-2"
        placeholder="Enter weight"
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg">
        Add Weight
      </button>
    </form>
  );
};

export default AddWeightEntry;
