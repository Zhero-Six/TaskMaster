import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Login from '../pages/Login';
import { AuthContext } from '../context/AuthContext';

const mock = new MockAdapter(axios);

describe('Login Component', () => {
  it('shows validation errors on empty form', () => {
    render(
      <AuthContext.Provider value={{ login: jest.fn(), user: null, token: null }}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    fireEvent.click(screen.getByText('Login'));
    expect(screen.getByText('Email is required')).toBeInTheDocument();
    expect(screen.getByText('Password is required')).toBeInTheDocument();
  });

  it('submits form with valid data', async () => {
    const loginMock = jest.fn().mockResolvedValue(true);
    render(
      <AuthContext.Provider value={{ login: loginMock, user: null, token: null }}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    fireEvent.change(screen.getByPlaceholderText('Enter email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Enter password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByText('Login'));

    expect(loginMock).toHaveBeenCalledWith('test@example.com', 'password123');
  });
});