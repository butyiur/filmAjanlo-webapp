import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import MovieList from "./pages/MovieList.jsx";
import MovieForm from "./pages/MovieForm.jsx";
import CategoryList from "./pages/CategoryList.jsx";
import Login from "./pages/Login.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import NotFound from "./pages/NotFound.jsx";
import MyMovies from "./pages/MyMovies";


<Route path="/my-movies" element={<MyMovies />} />

export default function App() {
    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<MovieList />} />
                <Route path="/categories" element={<CategoryList />} />
                <Route path="/login" element={<Login />} />

                {/* védett oldalak */}
                <Route
                    path="/movies/new"
                    element={
                        <ProtectedRoute>
                            <MovieForm />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/movies/:id/edit"
                    element={
                        <ProtectedRoute>
                            <MovieForm />
                        </ProtectedRoute>
                    }
                />

                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    );
}