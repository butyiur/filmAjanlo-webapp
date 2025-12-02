import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/client";
import {
    Container, Paper, Stack, TextField, FormControl, InputLabel, Select, MenuItem,
    Button, Typography
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";

export default function MovieForm() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState({
        title: "",
        director: "",
        releaseYear: 2020,
        genre: "",
        rating: 7.0,
        description: "",
        posterUrl: "",
        categoryId: ""
    });
    const [error, setError] = useState("");

    useEffect(() => {
        // IMPORTANT: NINCS /api
        api.get("/categories").then(r => setCategories(r.data));

        if (id) {
            // IMPORTANT: NINCS /api
            api.get(`/movies/${id}`).then(r => {
                const m = r.data;
                setForm({
                    title: m.title ?? "",
                    director: m.director ?? "",
                    releaseYear: m.releaseYear ?? 2020,
                    genre: m.genre ?? "",
                    rating: m.rating ?? 7.0,
                    description: m.description ?? "",
                    posterUrl: m.posterUrl ?? "",
                    categoryId: m.category?.id ?? ""
                });
            });
        }
    }, [id]);

    const change = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

    const submit = async (e) => {
        e.preventDefault();
        setError("");

        // Alap URL validáció (ha meg van adva, http/https-sel kezdődjön)
        if (form.posterUrl && !/^https?:\/\//i.test(form.posterUrl)) {
            setError("A plakát URL-nek http:// vagy https:// kezdetűnek kell lennie.");
            return;
        }

        const payload = {
            title: form.title,
            director: form.director,
            releaseYear: Number(form.releaseYear),
            genre: form.genre,
            rating: Number(form.rating),
            description: form.description,
            posterUrl: form.posterUrl,
            category: form.categoryId ? { id: Number(form.categoryId) } : null
        };

        try {
            if (id) {
                // IMPORTANT: NINCS /api
                await api.put(`/movies/${id}`, payload);
            } else {
                // IMPORTANT: NINCS /api
                await api.post("/movies", payload);
            }
            navigate("/");
        } catch (err) {
            console.error(err);
            setError("Mentés sikertelen. Ellenőrizd a mezőket.");
        }
    };

    return (
        <Container maxWidth="sm" sx={{ py: 3 }}>
            <Paper sx={{ p: 3 }}>
                <Typography variant="h5" sx={{ mb: 2 }}>
                    {id ? "Film szerkesztése" : "Új film"}
                </Typography>

                {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}

                <form onSubmit={submit}>
                    <Stack spacing={2}>
                        <TextField
                            label="Cím"
                            value={form.title}
                            onChange={e => change("title", e.target.value)}
                            required
                        />

                        <TextField
                            label="Rendező"
                            value={form.director}
                            onChange={e => change("director", e.target.value)}
                        />

                        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                            <TextField
                                label="Megjelenés éve"
                                type="number"
                                value={form.releaseYear}
                                onChange={e => change("releaseYear", e.target.value)}
                                sx={{ flex: 1 }}
                            />
                            <TextField
                                label="Műfaj"
                                value={form.genre}
                                onChange={e => change("genre", e.target.value)}
                                sx={{ flex: 1 }}
                            />
                        </Stack>

                        <TextField
                            label="Értékelés (1–10)"
                            type="number"
                            inputProps={{ step: "0.1", min: 0, max: 10 }}
                            value={form.rating}
                            onChange={e => change("rating", e.target.value)}
                        />

                        <TextField
                            label="Leírás"
                            multiline
                            minRows={3}
                            value={form.description}
                            onChange={e => change("description", e.target.value)}
                        />

                        {/* Képlink mező + élő előnézet */}
                        <TextField
                            label="Plakát URL (http/https)"
                            type="url"
                            value={form.posterUrl}
                            onChange={e => change("posterUrl", e.target.value)}
                            helperText="Illeszthetsz be külső képlinket (pl. TMDB/IMDb/Imgur/Cloudinary)."
                        />

                        {form.posterUrl && (
                            <img
                                src={form.posterUrl}
                                alt="Előnézet"
                                onError={(e) => { e.currentTarget.style.display = "none"; }}
                                style={{ width: "100%", maxHeight: 260, objectFit: "cover", borderRadius: 8 }}
                            />
                        )}

                        <FormControl>
                            <InputLabel>Kategória</InputLabel>
                            <Select
                                label="Kategória"
                                value={form.categoryId}
                                onChange={e => change("categoryId", e.target.value)}
                            >
                                <MenuItem value="">-- kategória nélkül --</MenuItem>
                                {categories.map(c => (
                                    <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Stack direction="row" spacing={2} justifyContent="flex-end">
                            <Button
                                type="button"
                                variant="outlined"
                                startIcon={<CancelIcon />}
                                onClick={() => navigate("/")}
                            >
                                Mégse
                            </Button>
                            <Button type="submit" variant="contained" startIcon={<SaveIcon />}>
                                {id ? "Mentés" : "Hozzáadás"}
                            </Button>
                        </Stack>
                    </Stack>
                </form>
            </Paper>
        </Container>
    );
}