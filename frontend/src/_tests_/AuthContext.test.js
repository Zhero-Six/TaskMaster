import { render, act } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { AuthProvider, AuthContext } from '../context/AuthContext';

const mock = new MockAdapter(axios);

describe('AuthContext', () => {
  it('fetches user profile with valid token', async () => {
    mock.onGet('http://localhost:5000/api/profile').reply(200, { user: { username: 'testuser' } });
    localStorage.setItem('token', 'fake-token');

    let authContext;
    await act(async () => {
      render(
        <AuthProvider>
          <AuthContext.Consumer>
            {value => {
              authContext = value;
              return null;
            }}
          </AuthContext.Consumer>
        </AuthProvider>
      );
    });

    expect(authContext.user).toEqual({ username: 'testuser' });
  });
});