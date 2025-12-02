import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api, { auth } from "../api/client";
import {
    Box,
    Grid,
    Card,
    CardContent,
    CardMedia,
    CardActions,
    Typography,
    TextField,
    Select,
    MenuItem,
    Button,
    Stack,
    InputLabel,
    FormControl,
    Pagination,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

export default function MovieList() {
    const navigate = useNavigate();
    const location = useLocation();

    const user = auth.getUser();
    const isAdmin = user?.role === "ADMIN";

    const [movies, setMovies] = useState([]);
    const [categories, setCategories] = useState([]);

    const [search, setSearch] = useState("");
    const [director, setDirector] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [yearFrom, setYearFrom] = useState("");
    const [yearTo, setYearTo] = useState("");

    const [page, setPage] = useState(1);
    const [pageSize] = useState(12);
    const [totalPages, setTotalPages] = useState(1);

    // --- ha az URL-ben van pl. ?categoryId=3, akkor kinyerjük ---
    const params = new URLSearchParams(location.search);
    const categoryFilterFromUrl = params.get("categoryId");

    // --- Filmek betöltése ---
    const loadMovies = async () => {
        try {
            let res;

            if (categoryFilterFromUrl) {
                // kategória alapján szűrés
                res = await api.get(`/movies/category/${categoryFilterFromUrl}`);
                setMovies(res.data);
                setTotalPages(1);
            } else {
                // normál keresés
                res = await api.get("/movies/search", {
                    params: {
                        title: search || null,
                        director: director || null,
                        categoryId: categoryId || null,
                        yearFrom: yearFrom || null,
                        yearTo: yearTo || null,
                        page: page - 1,
                        size: pageSize,
                    },
                });
                setMovies(res.data.content);
                setTotalPages(res.data.totalPages || 1);
            }
        } catch (err) {
            console.error("❌ Filmek betöltése sikertelen:", err);
        }
    };

    // --- Kategóriák betöltése ---
    const loadCategories = async () => {
        try {
            const res = await api.get("/categories");
            setCategories(res.data);
        } catch (err) {
            console.error("❌ Kategóriák betöltése sikertelen:", err);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await Promise.all([loadMovies(), loadCategories()]);
        };
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, search, director, categoryId, yearFrom, yearTo, categoryFilterFromUrl]);

    const handleDelete = async (id) => {
        if (!window.confirm("Biztosan törlöd ezt a filmet?")) return;
        try {
            await api.delete(`/movies/${id}`);
            loadMovies();
        } catch (err) {
            console.error("❌ Film törlése sikertelen:", err);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            {/* SZŰRŐK + ADMIN ÚJ FILM GOMB */}
            {!categoryFilterFromUrl && (
                <Stack
                    direction="row"
                    spacing={2}
                    sx={{ mb: 3, flexWrap: "wrap" }}
                    alignItems="center"
                >
                    <TextField label="Cím" value={search} onChange={(e) => setSearch(e.target.value)} />
                    <TextField label="Rendező" value={director} onChange={(e) => setDirector(e.target.value)} />
                    <FormControl sx={{ minWidth: 160 }}>
                        <InputLabel>Kategória</InputLabel>
                        <Select
                            value={categoryId}
                            label="Kategória"
                            onChange={(e) => setCategoryId(e.target.value)}
                        >
                            <MenuItem value="">(összes)</MenuItem>
                            {categories.map((c) => (
                                <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField label="Év tól" value={yearFrom} onChange={(e) => setYearFrom(e.target.value)} sx={{ width: 100 }} />
                    <TextField label="Év ig" value={yearTo} onChange={(e) => setYearTo(e.target.value)} sx={{ width: 100 }} />

                    {isAdmin && (
                        <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate("/movies/new")}>
                            Új film
                        </Button>
                    )}
                </Stack>
            )}

            {/* FILMEK LISTÁJA */}
            <Grid container spacing={2}>
                {movies.length === 0 && (
                    <Typography variant="body1" sx={{ p: 2 }}>
                        Nincs találat.
                    </Typography>
                )}

                {movies.map((m) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={m.id}>
                        <Card>
                            <CardMedia
                                component="img"
                                height="220"
                                image={m.posterUrl || "/react.svg"}
                                alt={m.title}
                            />
                            <CardContent>
                                <Typography variant="h6" noWrap>{m.title}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {m.director || "Ismeretlen rendező"}
                                </Typography>
                                <Typography variant="body2">
                                    {m.releaseYear} • {m.genre || "N/A"}
                                </Typography>
                                <Typography variant="body2">
                                    Értékelés: {m.rating ?? "N/A"}
                                </Typography>
                                {m.category && (
                                    <Typography
                                        variant="caption"
                                        sx={{ display: "block", mt: 0.5, color: "gray" }}
                                    >
                                        {m.category.name}
                                    </Typography>
                                )}
                            </CardContent>

                            {isAdmin && (
                                <CardActions>
                                    <Button
                                        size="small"
                                        startIcon={<EditIcon />}
                                        onClick={() => navigate(`/movies/${m.id}/edit`)}
                                    >
                                        Szerkesztés
                                    </Button>
                                    <Button
                                        size="small"
                                        color="error"
                                        startIcon={<DeleteIcon />}
                                        onClick={() => handleDelete(m.id)}
                                    >
                                        Törlés
                                    </Button>
                                </CardActions>
                            )}
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* LAPOZÁS */}
            {!categoryFilterFromUrl && (
                <Stack direction="row" justifyContent="center" sx={{ mt: 3 }}>
                    <Pagination count={totalPages} page={page} onChange={(e, v) => setPage(v)} />
                </Stack>
            )}
        </Box>
    );
}