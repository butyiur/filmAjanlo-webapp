import { useNavigate, Link as RouterLink } from "react-router-dom";
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
    const user = auth.getUser();
    const loggedIn = !!user;
    const isAdmin = user?.role === "ADMIN";

    const logout = () => {
        auth.logout();
        navigate("/login");
    };

    return (
        <AppBar position="sticky" elevation={1}>
            <Toolbar sx={{ gap: 2 }}>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Filmajánló
                </Typography>

                <Stack direction="row" spacing={3}>
                    <Link component={RouterLink} to="/" color="inherit">Filmek</Link>
                    <Link component={RouterLink} to="/categories" color="inherit">Kategóriák</Link>

                    {loggedIn && !isAdmin && (
                        <Link component={RouterLink} to="/my-movies" color="inherit">
                            Saját lista
                        </Link>
                    )}

                    {isAdmin && (
                        <Link component={RouterLink} to="/admin/users" color="inherit">
                            Felhasználók
                        </Link>
                    )}
                </Stack>

                {loggedIn ? (
                    <Button color="inherit" onClick={logout}>
                        Kijelentkezés ({user.username})
                    </Button>
                ) : (
                    <Button color="inherit" component={RouterLink} to="/login">
                        Bejelentkezés
                    </Button>
                )}
            </Toolbar>
        </AppBar>
    );
}