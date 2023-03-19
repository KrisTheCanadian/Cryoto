import {fireEvent, render, screen} from '@testing-library/react';
import {QueryClient, QueryClientProvider} from 'react-query';
import {MockAppProviders} from '@shared/testing/mocks';
import {act} from 'react-dom/test-utils';

import EditAddressDialog from './EditAddressDialog';

const queryClient = new QueryClient();

describe('EditAddressDialog', () => {
  const shippingAddress = {
    streetNumber: '123',
    apartment: '456',
    street: 'Test St.',
    city: 'Test City',
    province: 'Test Province',
    country: 'Test Country',
    postalCode: '12345',
    additionalInfo: 'Test Info',
    isDefault: true,
    id: 1,
  };

  it('should render the dialog', async () => {
    const setEditAddressOpen = jest.fn();
    render(
      <MockAppProviders>
        <QueryClientProvider client={queryClient}>
          <EditAddressDialog
            shippingAddress={shippingAddress}
            setShippingAddress={jest.fn()}
            editAddressOpen
            setEditAddressOpen={setEditAddressOpen}
          />
        </QueryClientProvider>
      </MockAppProviders>,
    );

    expect(
      screen.getByRole('heading', {name: /shipping address/i}),
    ).toBeInTheDocument();

    expect(screen.getByRole('textbox', {name: 'streetNumber'})).toHaveValue(
      '123',
    );
    expect(screen.getByRole('textbox', {name: 'apartment'})).toHaveValue('456');
    expect(screen.getByRole('textbox', {name: 'street'})).toHaveValue(
      'Test St.',
    );
    expect(screen.getByRole('textbox', {name: 'city'})).toHaveValue(
      'Test City',
    );
    expect(screen.getByRole('textbox', {name: 'province'})).toHaveValue(
      'Test Province',
    );
    expect(screen.getByRole('textbox', {name: 'country'})).toHaveValue(
      'Test Country',
    );
    expect(screen.getByRole('textbox', {name: 'postalCode'})).toHaveValue(
      '12345',
    );
    expect(screen.getByRole('textbox', {name: 'additionalInfo'})).toHaveValue(
      'Test Info',
    );

    const saveButton = screen.getByRole('button', {name: 'Save'});
    expect(saveButton).toBeDisabled();
  });

  it('should update the address and save when Save button is clicked', async () => {
    const setShippingAddress = jest.fn();
    const setEditAddressOpen = jest.fn();

    render(
      <MockAppProviders>
        <QueryClientProvider client={queryClient}>
          <EditAddressDialog
            shippingAddress={shippingAddress}
            setShippingAddress={setShippingAddress}
            editAddressOpen
            setEditAddressOpen={setEditAddressOpen}
          />
        </QueryClientProvider>
      </MockAppProviders>,
    );

    const streetNumberInput = screen.getByRole('textbox', {
      name: 'streetNumber',
    });

    act(() => {
      fireEvent.change(streetNumberInput, {target: {value: '456'}});
    });
    expect(streetNumberInput).toHaveValue('456');

    const saveButton = screen.getByRole('button', {name: 'Save'});
    expect(saveButton).toBeEnabled();
    act(() => {
      saveButton.click();
    });

    expect(setShippingAddress).toHaveBeenCalled();
  });
});
