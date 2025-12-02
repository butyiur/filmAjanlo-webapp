import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";

import MovieList from "./pages/MovieList.jsx";
import MovieForm from "./pages/MovieForm.jsx";
import CategoryList from "./pages/CategoryList.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import NotFound from "./pages/NotFound.jsx";
import MyMovies from "./pages/MyMovies.jsx";
import UserMovieForm from "./pages/UserMovieForm.jsx";

export default function App() {
    return (
        <>
            <Navbar />

            <Routes>
                {/* Publikus oldalak */}
                <Route path="/" element={<MovieList />} />
                <Route path="/categories" element={<CategoryList />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Saját lista (User) */}
                <Route
                    path="/my-movies"
                    element={
                        <ProtectedRoute>
                            <MyMovies />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/my-movies/new"
                    element={
                        <ProtectedRoute>
                            <UserMovieForm />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/my-movies/:id/edit"
                    element={
                        <ProtectedRoute>
                            <UserMovieForm />
                        </ProtectedRoute>
                    }
                />

                {/* Admin film-létrehozás és módosítás */}
                <Route
                    path="/movies/new"
                    element={
                        <ProtectedRoute adminOnly>
                            <MovieForm />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/movies/:id/edit"
                    element={
                        <ProtectedRoute adminOnly>
                            <MovieForm />
                        </ProtectedRoute>
                    }
                />

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    );
}