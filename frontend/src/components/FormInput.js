import React from 'react';

const FormInput = ({ label, name, type, value, onChange, error, placeholder }) => (
  <div style={{ marginBottom: '16px' }}>
    <label style={{ display: 'block', fontSize: '14px', color: 'var(--gray-900)', marginBottom: '4px' }}>{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{ width: '100%', padding: '8px', borderRadius: '4px', border: `1px solid ${error ? 'var(--red-500)' : 'var(--gray-300)'}` }}
    />
    {error && <p style={{ color: 'var(--red-500)', fontSize: '12px', marginTop: '4px' }}>{error}</p>}
  </div>
);

export default FormInput;