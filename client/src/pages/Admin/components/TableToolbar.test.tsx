import {fireEvent, render} from '@testing-library/react';
import {MockAppProviders} from '@shared/testing/mocks';

import {TableToolbar} from './TableToolbar';

jest.mock('react-query', () => {
  return {
    useQuery: jest.fn(() => {
      return {
        invalidateQueries: jest.fn(),
      };
    }),
    useMutation: jest.fn(() => {
      return {
        mutate: jest.fn(),
      };
    }),
  };
});

describe('TableToolbar', () => {
  it('renders a search input field with a search icon', () => {
    const onSearchMock = jest.fn();
    const {getByLabelText} = render(
      <MockAppProviders>
        <TableToolbar onSearch={onSearchMock} />
      </MockAppProviders>,
    );

    // check if the search input field has the expected label
    const searchField = getByLabelText('Search');
    expect(searchField).toBeInTheDocument();

    // check if the search input field has the expected input props
    expect(searchField).toHaveAttribute('id', 'outlined-basic');

    // simulate user input to trigger the onSearch function
    fireEvent.change(searchField, {target: {value: 'test search query'}});

    // check if the onSearch function is called with the expected value
    expect(onSearchMock).toHaveBeenCalledWith('test search query');
  });
});
