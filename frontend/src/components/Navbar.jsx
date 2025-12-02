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
        navigate("/");
    };

    return (
        <AppBar position="sticky" elevation={1}>
            <Toolbar sx={{ gap: 2 }}>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Filmajánló
                </Typography>

                <Stack direction="row" spacing={2}>
                    {/* Filmek: mindenkinek */}
                    <Link
                        component={RouterLink}
                        to="/"
                        color="inherit"
                        underline="hover"
                    >
                        Filmek
                    </Link>

                    {/* Kategóriák: mindenkinek */}
                    <Link
                        component={RouterLink}
                        to="/categories"
                        color="inherit"
                        underline="hover"
                    >
                        Kategóriák
                    </Link>

                    {/* Saját lista: csak sima USER + ADMIN ha akarod.
                        Most a kérésed szerint: CSAK USER-nek. */}
                    {loggedIn && !isAdmin && (
                        <Link
                            component={RouterLink}
                            to="/my-movies"
                            color="inherit"
                            underline="hover"
                        >
                            Saját lista
                        </Link>
                    )}

                    {/* Regisztráció külön menüpontot NEM raktunk,
                        majd a Login oldalon lesz link. */}
                </Stack>

                <Box sx={{ flexGrow: 0 }} />

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