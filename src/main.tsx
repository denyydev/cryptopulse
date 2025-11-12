import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  RouterProvider,
  createBrowserRouter,
  redirect,
  Outlet,
} from 'react-router-dom';
import 'antd/dist/reset.css' 
import './styles/global.css'
import ThemeProvider from './app/ThemeProvider';
import Header from './components/Header';
import { isAuthenticated } from './hooks/useAuth';


export const AuthedLayout: React.FC = () => (
  <div className="grid h-dvh grid-rows-[auto,1fr] overflow-hidden">
    <Header />
    <main className="overflow-y-auto overscroll-contain">
      <div className="mx-auto flex w-full max-w-[1440px]">
        <React.Suspense fallback={<div className="p-6">Loading...</div>}>
          <Outlet />
        </React.Suspense>
      </div>
    </main>
  </div>
)

export const PublicLayout: React.FC = () => (
  <div className="min-h-screen overflow-x-clip">
    <React.Suspense fallback={<div className="p-6">Loading...</div>}>
      <Outlet />
    </React.Suspense>
  </div>
);


const requireAuth = () => {
  if (!isAuthenticated()) throw redirect('/login');
  return null;
};


const HomePage = React.lazy(() => import('./pages/HomaPage'));
const CryptocurrenciesPage = React.lazy(() => import('./pages/CryptocurrenciesPage'));
const NewsPage = React.lazy(() => import('./pages/NewsPage'));
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const NFTsPage = React.lazy(() => import('./pages/NFTsPage'));
const CoinDetailsPage = React.lazy(() => import('./pages/CoinDetailsPage'));
const FavoritesPage = React.lazy(() => import('./pages/FavoritesPage'));
const CalculatorPage = React.lazy(() => import('./pages/CalculatorPage'));
const InvestmentSimulatorPage = React.lazy(() => import('./pages/InvestmentSimulatorPage'));


const router = createBrowserRouter([

  {
    element: <AuthedLayout />,
    loader: requireAuth,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'cryptos', element: <CryptocurrenciesPage /> },
      { path: 'news', element: <NewsPage /> },
      { path: 'nfts', element: <NFTsPage /> },
      { path: 'favorites', element: <FavoritesPage /> },
      { path: 'coin/:id', element: <CoinDetailsPage /> },
      { path: 'calculator', element: <CalculatorPage /> },
      { path: 'simulator', element: <InvestmentSimulatorPage /> },
    ],
  },

  {
    path: '/login',
    element: <PublicLayout />,
    children: [{ index: true, element: <LoginPage /> }],
  },

  {
    path: '*',
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <div className="p-6 text-center">Page not found</div>,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
);
