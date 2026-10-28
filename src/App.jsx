import { Routes, Route, Navigate } from "react-router";

import Movies from "./pages/Movies.jsx";
import Tv from "./pages/Tv.jsx";
import MovieDetails from "./pages/MovieDetails.jsx";
import TvDetails from "./pages/TvDetails.jsx";

import "./App.css";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to="/movies" replace />}
      />

      <Route
        path="/movies"
        element={<Movies />}
      />

      <Route
        path="/tv"
        element={<Tv />}
      />

      <Route
        path="/movie/:id"
        element={<MovieDetails />}
      />

      <Route
        path="/tv/:id"
        element={<TvDetails />}
      />
    </Routes>
  );
}

export default App;