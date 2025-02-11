import { beforeEach, describe, expect, Mock, test, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import App from './app';

const mockHotels = [
  { _id: '1', hotel_name: 'Hotel A', country: 'United States', city: 'New York' },
  { _id: '2', hotel_name: 'Hotel B', country: 'United States', city: 'Los Angeles' },
  { _id: '3', hotel_name: 'Hotel C', country: 'France', city: 'Paris' },
];

global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve(mockHotels),
  })
) as Mock;

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders search input', () => {
    render(<App />);
    const input = screen.getByPlaceholderText('Search accommodation...');
    expect(input).toBeInTheDocument();
  });

  test('updates search term on input change', () => {
    render(<App />);
    const input = screen.getByPlaceholderText('Search accommodation...');

    fireEvent.change(input, { target: { value: 'Hotel' } });

    expect(input).toHaveValue('Hotel');
  });

  test('calls fetchHotels when typing a search term', async () => {
    render(<App />);
    const input = screen.getByPlaceholderText('Search accommodation...');

    fireEvent.change(input, { target: { value: 'Hotel' } });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/hotels?search=Hotel'));
    });
  });

  test('processHotelData correctly updates hotels, countries, and cities', async () => {
    render(<App />);
    const input = screen.getByPlaceholderText('Search accommodation...');

    fireEvent.change(input, { target: { value: 'United States' } });

    await waitFor(() => {
      expect(screen.getByText('Hotel A')).toBeInTheDocument();
      expect(screen.getByText('Hotel B')).toBeInTheDocument();
      expect(screen.getByText('United States')).toBeInTheDocument();
    });
  });

  test('clears search when clearSearch is called', async () => {
    render(<App />);
    const input = screen.getByPlaceholderText('Search accommodation...');

    fireEvent.change(input, { target: { value: 'Hotel' } });
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());

    fireEvent.click(screen.getByRole('clear-button'));

    expect(input).toHaveValue('');
    expect(screen.queryByText('Hotel A')).not.toBeInTheDocument();
    expect(screen.queryByText('Hotel B')).not.toBeInTheDocument();
  });

  test('handles API fetch failure gracefully', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        status: 500,
      })
    ) as Mock;

    render(<App />);
    const input = screen.getByPlaceholderText('Search accommodation...');

    fireEvent.change(input, { target: { value: 'Hotel' } });

    await waitFor(() => {
      expect(screen.queryByText('No results found.')).toBeInTheDocument();
    });
  });
});