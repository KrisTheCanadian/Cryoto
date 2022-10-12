import {render, screen} from '@testing-library/react';

import FullWidthColumn from './FullWidthColumn';

it('should render children in column', () => {
  const testText = 'test';
  render(<FullWidthColumn>{testText}</FullWidthColumn>);

  expect(screen.getByText('test')).toBeInTheDocument();
});
