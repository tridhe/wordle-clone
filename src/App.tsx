import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Game from './pages/Game';
import Practice from './pages/Practice';
import CustomGame from './pages/CustomGame'; 
import CustomPuzzles from './pages/CustomPuzzles.tsx';
import CustomPlay from './pages/CustomMode';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/play" element={<Game />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/custom/play" element={<CustomPlay />} />
          <Route path="/custom" element={<CustomPuzzles />} />
          <Route path="/custom/:puzzleId" element={<CustomGame />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
