import {render, screen} from '@testing-library/react';

import App from './App';

describe('App', () => {
  it('should have Cryoto text in document', () => {
    render(<App />);
    expect(1 + 1).toBe(2);
    expect(screen.getByText('Cryoto')).toBeInTheDocument();
  });
});
