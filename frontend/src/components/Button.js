import React from 'react';

const Button = ({ variant = 'primary', children, ...props }) => {
  return (
    <button className={`button ${variant}`} {...props}>
      {children}
    </button>
  );
};

export default Button;