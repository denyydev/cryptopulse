import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import HomePage from './pages/HomaPage';
import CryptocurrenciesPage from './pages/CryptocurrenciesPage';
import NewsPage from './pages/NewsPage';
import LoginPage from './pages/LoginPage';
import Header from './components/Header';
import { isAuthenticated } from './hooks/useAuth';
import NFTsPage from './pages/NFTsPage';
import CoinDetailsPage from './pages/CoinDetailsPage';
import FavoritesPage from './pages/FavoritesPage';

type ProtectedProps = { children: ReactNode };

const Protected = ({ children }: ProtectedProps) => {
  return isAuthenticated() ? <>{children}</> : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <BrowserRouter>
      {isAuthenticated() && <Header />}
       <div className="min-h-screen overflow-x-clip flex justify-center">
      <Routes>
        <Route path="/favorites" element={<Protected><FavoritesPage /></Protected>} />
        <Route path="/coin/:id" element={<Protected><CoinDetailsPage /></Protected>} />
        <Route path="/nfts" element={<Protected><NFTsPage /></Protected>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Protected><HomePage /></Protected>} />
        <Route path="/cryptos" element={<Protected><CryptocurrenciesPage /></Protected>} />
        <Route path="/news" element={<Protected><NewsPage /></Protected>} />
      </Routes>
      </div>
    </BrowserRouter>
  );
}
