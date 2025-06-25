import React from 'react';

const FormInput = ({ label, name, type, value, onChange, error, placeholder }) => {
  return (
    <div className="form-input">
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={error ? 'error' : ''}
      />
      {error && <p className="error-text">{error}</p>}
    </div>
  );
};

export default FormInput;