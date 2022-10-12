import {render, screen} from '@testing-library/react';

import MiddleColumn from './MainFeed';

it('Should render children', () => {
  const testText = 'test';
  render(<MiddleColumn>{testText}</MiddleColumn>);
  expect(screen.getByText('test')).toBeInTheDocument();
});
