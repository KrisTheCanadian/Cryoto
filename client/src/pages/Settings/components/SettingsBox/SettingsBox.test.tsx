import {ThemeContextProvider} from '@shared/hooks/ThemeContextProvider';
import {render, screen} from '@testing-library/react';
import {act} from 'react-dom/test-utils';
import {I18nextProvider} from 'react-i18next';
import {MemoryRouter} from 'react-router-dom';
import {QueryClient, QueryClientProvider} from 'react-query';

import SettingsBox, {SettingsElementInputType} from './SettingsBox';

import i18n from '@/i18n/i18n';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 5,
    },
  },
});

it('Should render TextField type in SettingsBox', async () => {
  const data = {
    title: 'title',
    elements: [
      {
        name: 'name',
        data: {value: ['value1']},
        inputType: SettingsElementInputType.TextField,
        callback: undefined,
      },
    ],
  };

  await act(async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <QueryClientProvider client={queryClient}>
          <I18nextProvider i18n={i18n}>
            <ThemeContextProvider>
              <SettingsBox title={data.title} elements={data.elements} />
            </ThemeContextProvider>
          </I18nextProvider>
        </QueryClientProvider>
      </MemoryRouter>,
    );
  });

  expect(screen.getByText(data.title)).toBeInTheDocument();
  expect(screen.getByText(data.elements[0].name)).toBeInTheDocument();
  expect(screen.getByText(data.elements[0].data.value[0])).toBeInTheDocument();
});

it('Should render TextArea type with multiline value in SettingsBox', async () => {
  const data = {
    title: 'title',
    elements: [
      {
        name: 'name',
        data: {value: ['value1\nvalue2']},
        inputType: SettingsElementInputType.TextArea,
        callback: undefined,
      },
    ],
  };

  await act(async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <QueryClientProvider client={queryClient}>
          <I18nextProvider i18n={i18n}>
            <ThemeContextProvider>
              <SettingsBox title={data.title} elements={data.elements} />
            </ThemeContextProvider>
          </I18nextProvider>
        </QueryClientProvider>
      </MemoryRouter>,
    );
  });

  expect(screen.getByText(data.title)).toBeInTheDocument();
  expect(screen.getByText(data.elements[0].name)).toBeInTheDocument();
  const value = data.elements[0].data.value[0].split('\n');
  value.forEach((val) => expect(screen.getByText(val)).toBeInTheDocument());
});

it('Should render AddressFields type with multiline value in SettingsBox', async () => {
  const data = {
    title: 'title',
    elements: [
      {
        name: 'name',
        data: {
          unit: 'unit',
          streetNumber: 'street number',
          street: 'street',
          city: 'city',
          province: 'province',
          country: 'country',
          postalCode: 'postalCode',
          additionalInfo: 'additional info',
        },
        inputType: SettingsElementInputType.AddressFields,
        callback: undefined,
      },
    ],
  };

  await act(async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <QueryClientProvider client={queryClient}>
          <I18nextProvider i18n={i18n}>
            <ThemeContextProvider>
              <SettingsBox title={data.title} elements={data.elements} />
            </ThemeContextProvider>
          </I18nextProvider>
        </QueryClientProvider>
      </MemoryRouter>,
    );
  });

  expect(screen.getByText(data.title)).toBeInTheDocument();
  expect(screen.getByText(data.elements[0].name)).toBeInTheDocument();
  Object.values(data.elements[0].data).forEach((value) =>
    expect(screen.queryByText(value, {exact: false})).toBeInTheDocument(),
  );
});

it('Should render LanguageSelect type in SettingsBox', async () => {
  const data = {
    title: 'title',
    elements: [
      {
        name: 'name',
        data: {value: ['en']},
        inputType: SettingsElementInputType.LanguageSelect,
        callback: undefined,
      },
    ],
  };

  await act(async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <QueryClientProvider client={queryClient}>
          <I18nextProvider i18n={i18n}>
            <ThemeContextProvider>
              <SettingsBox title={data.title} elements={data.elements} />
            </ThemeContextProvider>
          </I18nextProvider>
        </QueryClientProvider>
      </MemoryRouter>,
    );
  });

  expect(screen.getByText(data.title)).toBeInTheDocument();
  expect(screen.getByText(data.elements[0].name)).toBeInTheDocument();
  expect(screen.getByText('English')).toBeInTheDocument();
});

it('Should render SwitchButton type in SettingsBox', async () => {
  const data = {
    title: 'title',
    elements: [
      {
        name: 'name',
        data: {value: ['value1']},
        inputType: SettingsElementInputType.SwitchButton,
        callback: undefined,
      },
    ],
  };

  await act(async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <QueryClientProvider client={queryClient}>
          <I18nextProvider i18n={i18n}>
            <ThemeContextProvider>
              <SettingsBox title={data.title} elements={data.elements} />
            </ThemeContextProvider>
          </I18nextProvider>
        </QueryClientProvider>
      </MemoryRouter>,
    );
  });

  expect(screen.getByText(data.title)).toBeInTheDocument();
  expect(screen.getByText(data.elements[0].name)).toBeInTheDocument();
});
