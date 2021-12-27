import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

test('dummy test', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  const loadButton = screen.getByText('Load');
  expect(loadButton).toBeInTheDocument();
});
