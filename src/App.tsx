import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomaPage';
import CryptocurrenciesPage from './pages/CryptocurrenciesPage';
import LoginPage from './pages/LoginPage';
import Header from './components/Header';
import { isAuthenticated } from './hooks/useAuth';
import { ReactElement } from 'react';


const Protected = ({ children }: { children: ReactElement }) => (
  isAuthenticated() ? children : <Navigate to="/login" replace />
);

export default function App() {
  return (
    <BrowserRouter>
      {isAuthenticated() && <Header />}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Protected><HomePage /></Protected>} />
        <Route path="/cryptos" element={<Protected><CryptocurrenciesPage /></Protected>} />
      </Routes>
    </BrowserRouter>
  );
}
