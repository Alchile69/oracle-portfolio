import React from 'react';

const CountrySelector: React.FC = () => {
  return (
    <div>
      <select 
        value="FRA"
        className="form-input"
      >
        <option value="FRA">🇫🇷 France - CAC 40</option>
      </select>
    </div>
  );
};

export default CountrySelector;

