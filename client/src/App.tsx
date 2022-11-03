import {Suspense} from 'react';
import {CssBaseline} from '@mui/material';
import {Routes, Route} from 'react-router-dom';
import {ThemeContextProvider} from '@shared/hooks/ThemeContextProvider';
import {RequireAuth} from '@shared/components/RequireAuth';
import {QueryClient, QueryClientProvider} from 'react-query';
import {ReactQueryDevtools} from 'react-query/devtools';

import Role from './pages/roles';
import {
  routeAuthentication,
  routeHome,
  routeMarket,
  routeOrders,
  routeProfile,
  routeSettings,
  routeStyleGuide,
  routeWallet,
} from './pages/routes';
import {StyleGuide} from './pages/StyleGuide';
import {AuthenticationPage} from './pages/Authentication';
import {MarketPlace} from './pages/MarketPlace';
import {HomePage} from './pages/HomePage';
import {Wallet} from './pages/Wallet';
import './App.css';
import {Profile} from './pages/Profile';
import {Orders} from './pages/Orders';
import {Settings} from './pages/Settings';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 5,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback="Loading...">
        <ThemeContextProvider>
          <CssBaseline />
          <Routes>
            <Route element={<RequireAuth {...[]} />}>
              <Route path={routeHome} element={<HomePage />} />
              <Route path={routeWallet} element={<Wallet />} />
              <Route path={routeMarket} element={<MarketPlace />} />
              <Route path={routeProfile} element={<Profile />} />
              <Route path={routeOrders} element={<Orders />} />
              <Route path={routeSettings} element={<Settings />} />
            </Route>
            <Route element={<RequireAuth {...[Role.Admin]} />}>
              <Route path={routeStyleGuide} element={<StyleGuide />} />
            </Route>
            <Route
              path={routeAuthentication}
              element={<AuthenticationPage />}
            />
          </Routes>
        </ThemeContextProvider>
      </Suspense>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App;
