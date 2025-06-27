import React from 'react';

const Button = ({ variant = 'primary', children, ...props }) => {
  const styles = {
    primary: { backgroundColor: 'var(--blue-600)', color: 'white', padding: '8px 16px', borderRadius: '4px', border: 'none' },
    secondary: { backgroundColor: 'var(--gray-600)', color: 'white', padding: '8px 16px', borderRadius: '4px', border: 'none' },
  };

  return (
    <button style={styles[variant]} {...props}>
      {children}
    </button>
  );
};

export default Button;