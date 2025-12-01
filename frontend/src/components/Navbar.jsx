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
    const loggedIn = !!auth.get();

    const logout = () => {
        auth.set("");
        navigate("/");
    };

    return (
        <AppBar position="sticky" elevation={1}>
            <Toolbar sx={{ gap: 2 }}>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Filmajánló
                </Typography>

                <Stack direction="row" spacing={2}>
                    <Link
                        component={RouterLink}
                        to="/"
                        color="inherit"
                        underline="hover"
                    >
                        Filmek
                    </Link>

                    <Link
                        component={RouterLink}
                        to="/categories"
                        color="inherit"
                        underline="hover"
                    >
                        Kategóriák
                    </Link>

                    {/* Új film csak belépve */}
                    {loggedIn && (
                        <Link
                            component={RouterLink}
                            to="/movies/new"
                            color="inherit"
                            underline="hover"
                        >
                            Új film
                        </Link>
                    )}

                    {/* Saját lista csak belépve */}
                    {loggedIn && (
                        <Link
                            component={RouterLink}
                            to="/my-movies"
                            color="inherit"
                            underline="hover"
                        >
                            Saját lista
                        </Link>
                    )}
                </Stack>

                <Box sx={{ flexGrow: 0 }} />

                {loggedIn ? (
                    <Button color="inherit" onClick={logout}>
                        Kijelentkezés
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