import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import api from "../api/client";
import {
    Box, Grid, Card, CardContent, CardMedia, CardActions,
    Typography, TextField, Select, MenuItem, Button, Stack, InputLabel, FormControl, Pagination
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

// ⬇⬇⬇ Fallback KÉP – EZ KINT LEGYEN, NEM A JSX-BEN
const FALLBACK_IMG =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(`
<svg xmlns='http://www.w3.org/2000/svg' width='800' height='450' viewBox='0 0 800 450'>
  <rect width='100%' height='100%' fill='#eeeeee'/>
  <g fill='#bbbbbb'>
    <rect x='240' y='110' width='320' height='180' rx='8'/>
    <circle cx='520' cy='140' r='20'/>
  </g>
</svg>`);

export default function MovieList() {
    const [movies, setMovies] = useState([]);
    const [categories, setCategories] = useState([]);

    // szűrők
    const [q, setQ] = useState("");
    const [director, setDirector] = useState("");
    const [cat, setCat] = useState("");
    const [yearFrom, setYearFrom] = useState("");
    const [yearTo, setYearTo] = useState("");

    // pagináció + rendezés
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(12);
    const [sort, setSort] = useState("releaseYear,desc");
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        api.get("/categories").then((res) => setCategories(res.data));
    }, []);


    const fetchMovies = () => {
        const params = { page, size, sort };
        if (q.trim()) params.title = q;
        if (director.trim()) params.director = director;
        if (cat) params.categoryId = cat;
        if (yearFrom) params.yearFrom = yearFrom;
        if (yearTo) params.yearTo = yearTo;

        api.get("/movies/search", { params })
            .then(res => {
                setMovies(res.data.content ?? res.data);
                setTotalPages(res.data.totalPages ?? 1);
            })
            .catch(() => {
                setMovies([]);
                setTotalPages(0);
            });
    };

    <Stack direction="row" alignItems="center" justifyContent="center" sx={{ mt: 3, gap: 1 }}>
        <Pagination
            count={Math.max(totalPages, 1)}
            page={page + 1}
            onChange={(_, p) => setPage(p - 1)}
            color="primary"
        />
        <Typography variant="body2" sx={{ ml: 2 }}>Elem/oldal:</Typography>
        <FormControl size="small" sx={{ minWidth: 80 }}>
            <Select
                value={size}
                onChange={(e) => { setSize(Number(e.target.value)); setPage(0); }}
            >
                {[6, 12, 24, 48].map(n => <MenuItem key={n} value={n}>{n}</MenuItem>)}
            </Select>
        </FormControl>
    </Stack>

    // debounce gépelésre
    useEffect(() => {
        const t = setTimeout(fetchMovies, 250);
        return () => clearTimeout(t);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [q, director, cat, yearFrom, yearTo, page, size, sort]);

    const remove = async (id) => {
        if (!confirm("Biztos törlöd?")) return;
        await api.delete(`/movies/${id}`);
        fetchMovies();
    };

    const clearFilters = () => {
        setQ(""); setDirector(""); setCat(""); setYearFrom(""); setYearTo("");
        setPage(0);
    };

    return (
        <Box sx={{ p: 2 }}>
            {/* Szűrősáv */}
            <Stack spacing={2} direction={{ xs: "column", md: "row" }} sx={{ mb: 2 }}>
                <TextField label="Cím keresése" value={q} onChange={(e)=>{ setQ(e.target.value); setPage(0); }} size="small" />
                <TextField label="Rendező" value={director} onChange={(e)=>{ setDirector(e.target.value); setPage(0); }} size="small" />
                <FormControl size="small" sx={{ minWidth: 180 }}>
                    <InputLabel>Kategória</InputLabel>
                    <Select label="Kategória" value={cat} onChange={(e)=>{ setCat(e.target.value); setPage(0); }}>
                        <MenuItem value="">Összes</MenuItem>
                        {categories.map(c => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
                    </Select>
                </FormControl>
                <TextField label="Év tól" type="number" value={yearFrom} onChange={(e)=>{ setYearFrom(e.target.value); setPage(0); }} size="small" sx={{ width: 120 }} />
                <TextField label="Év ig" type="number" value={yearTo} onChange={(e)=>{ setYearTo(e.target.value); setPage(0); }} size="small" sx={{ width: 120 }} />
                <FormControl size="small" sx={{ minWidth: 200 }}>
                    <InputLabel>Rendezés</InputLabel>
                    <Select label="Rendezés" value={sort} onChange={(e)=>{ setSort(e.target.value); setPage(0); }}>
                        <MenuItem value="releaseYear,desc">Év (csökkenő)</MenuItem>
                        <MenuItem value="releaseYear,asc">Év (növekvő)</MenuItem>
                        <MenuItem value="rating,desc">Értékelés (csökkenő)</MenuItem>
                        <MenuItem value="rating,asc">Értékelés (növekvő)</MenuItem>
                        <MenuItem value="title,asc">Cím (A→Z)</MenuItem>
                        <MenuItem value="title,desc">Cím (Z→A)</MenuItem>
                    </Select>
                </FormControl>
                <Button variant="outlined" onClick={clearFilters}>Szűrők törlése</Button>
                <Button variant="contained" startIcon={<AddIcon />} component={RouterLink} to="/movies/new" sx={{ ml: "auto" }}>
                    Új film
                </Button>
            </Stack>

            {/* Grid kártyák */}
            <Grid container spacing={2}>
                {movies.map((m) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={m.id}>
                        <Card elevation={2} sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                            {m.imageUrl ? (
                                <CardMedia
                                    component="img"
                                    height="220"
                                    image={m.imageUrl}
                                    alt={m.title}
                                    loading="lazy"
                                    referrerPolicy="no-referrer"
                                    onError={(e) => {
                                        e.currentTarget.onerror = null;
                                        e.currentTarget.src = FALLBACK_IMG;
                                    }}
                                />
                            ) : (
                                <CardMedia component="img" height="220" image={FALLBACK_IMG} alt="Nincs kép" />
                            )}

                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography variant="h6" gutterBottom>{m.title}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {m.releaseYear} • {m.category?.name ?? "N/A"}
                                </Typography>
                                {m.director && (
                                    <Typography variant="body2" color="text.secondary">
                                        Rendező: {m.director}
                                    </Typography>
                                )}
                                {typeof m.rating === "number" && (
                                    <Typography variant="body2" color="text.secondary">
                                        Értékelés: {m.rating}
                                    </Typography>
                                )}
                            </CardContent>

                            <CardActions>
                                <Button size="small" startIcon={<EditIcon />} component={RouterLink} to={`/movies/${m.id}/edit`}>
                                    Szerkesztés
                                </Button>
                                <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => remove(m.id)}>
                                    Törlés
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Pagináció */}
            <Stack direction="row" alignItems="center" justifyContent="center" sx={{ mt: 3 }}>
                <Pagination
                    count={Math.max(totalPages, 1)}
                    page={page + 1}
                    onChange={(_, p) => setPage(p - 1)}
                    color="primary"
                />
            </Stack>
        </Box>
    );
}