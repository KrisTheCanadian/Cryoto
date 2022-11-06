import getTokenBalance from './getTokenBalance';

const TokenValue = Math.floor(1000000 * Math.random());

global.fetch = jest.fn((url: URL, init: RequestInit) =>
  Promise.resolve({
    text: () => Promise.resolve(TokenValue),
  }),
) as jest.Mock;

it('Get wallet balance functionality', async () => {
  const value = await getTokenBalance('toSpend', '');
  expect(value).toEqual(TokenValue);
});
