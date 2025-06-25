import React from 'react';

const FormInput = ({ label, placeholder, error, ...props }) => {
  return (
    <div className="form-input">
      <label>{label}</label>
      <input className={error ? 'error' : ''} placeholder={placeholder} {...props} />
      {error && <p className="error-text">{error}</p>}
    </div>
  );
};

export default FormInput;