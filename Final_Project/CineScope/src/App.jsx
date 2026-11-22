import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { WatchlistProvider } from './context/WatchlistContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';
import Home from './pages/Home';
import Explore from './pages/Explore';
import MovieDetails from './pages/MovieDetails';
import Watchlist from './pages/Watchlist';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <ThemeProvider>
      <WatchlistProvider>
        <Router>
          <div className="app-shell">
            <Navbar />
            <div className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/movie/:id" element={<MovieDetails />} />
                <Route path="/watchlist" element={<Watchlist />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
            <Toast />
            <Footer />
          </div>
        </Router>
      </WatchlistProvider>
    </ThemeProvider>
  );
}
