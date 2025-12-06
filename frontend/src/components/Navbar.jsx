import { useNavigate, Link as RouterLink, useLocation } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import { auth } from "../api/client";

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const user = auth.getUser();
    const loggedIn = !!user;
    const isAdmin = user?.role === "ADMIN";

    const logout = () => {
        auth.logout();
        navigate("/login");
    };

    const linkClass = (path) =>
        "nav-link" + (location.pathname === path ? " active" : "");

    return (
        <AppBar position="sticky" elevation={0} className="neo-navbar">
            <Toolbar className="nav-toolbar">

                <Typography variant="h6" className="nav-title">
                    CineMatrix
                </Typography>

                <Stack direction="row" spacing={3} className="nav-links">
                    <Link component={RouterLink} to="/" className={linkClass("/")}>
                        Movies
                    </Link>

                    <Link component={RouterLink} to="/categories" className={linkClass("/categories")}>
                        Categories
                    </Link>

                    {loggedIn && !isAdmin && (
                        <Link component={RouterLink} to="/my-movies" className={linkClass("/my-movies")}>
                            My List
                        </Link>
                    )}

                    {isAdmin && (
                        <Link component={RouterLink} to="/admin/users" className={linkClass("/admin/users")}>
                            Users
                        </Link>
                    )}
                </Stack>

                {loggedIn ? (
                    <button className="nav-btn logout" onClick={logout}>
                        Logout ({user.username})
                    </button>
                ) : (
                    <button className="nav-btn" onClick={() => navigate("/login")}>
                        Login
                    </button>
                )}

            </Toolbar>
        </AppBar>
    );
}