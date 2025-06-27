import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Home from '../pages/Home';
import { AuthContext } from '../context/AuthContext';

const mock = new MockAdapter(axios);

const mockProjects = [
  { id: 1, title: 'Test Project', description: 'Test Desc', creator: { username: 'testuser' }, status: 'active' },
];

describe('Home Component', () => {
  it('displays projects when loaded', async () => {
    mock.onGet('http://localhost:5000/api/projects').reply(200, { projects: mockProjects });

    render(
      <AuthContext.Provider value={{ user: null, token: null }}>
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    expect(screen.getByText('Manage Your Team with TaskMaster')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText('Test Project')).toBeInTheDocument();
    });
  });

  it('shows welcome message when authenticated', async () => {
    mock.onGet('http://localhost:5000/api/projects').reply(200, { projects: [] });

    render(
      <AuthContext.Provider value={{ user: { username: 'testuser' }, token: 'fake-token' }}>
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    expect(screen.getByText('Welcome, testuser!')).toBeInTheDocument();
  });
});