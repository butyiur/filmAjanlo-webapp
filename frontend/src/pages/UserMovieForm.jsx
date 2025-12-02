import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/client";
import {
    Container, Paper, Stack, TextField, FormControl,
    InputLabel, Select, MenuItem, Button, Typography
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";

export default function UserMovieForm() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
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

    const change = (k, v) => {
        setForm(prev => {
            const updated = { ...prev, [k]: v };
            localStorage.setItem("userMovieDraft", JSON.stringify(updated));
            return updated;
        });
    };

    // --- Kategóriák betöltése ---
    useEffect(() => {
        api.get("/categories").then(r => setCategories(r.data));
    }, []);

    // --- Film betöltése / draft visszaállítás ---
    useEffect(() => {
        let isMounted = true; // biztonsági flag, hogy ne fusson setState unmounted komponensen
        const savedDraft = localStorage.getItem("userMovieDraft");

        const loadData = async () => {
            try {
                if (id) {
                    const { data } = await api.get(`/user/movies/${id}`);
                    if (isMounted) {
                        setForm({
                            title: data.title ?? "",
                            director: data.director ?? "",
                            releaseYear: data.releaseYear ?? 2020,
                            genre: data.genre ?? "",
                            rating: data.rating ?? 7.0,
                            description: data.description ?? "",
                            posterUrl: data.posterUrl ?? "",
                            categoryId: data.category?.id ?? ""
                        });
                    }
                } else if (savedDraft) {
                    if (isMounted) setForm(JSON.parse(savedDraft));
                }
            } catch (err) {
                console.error("❌ Hiba a film betöltésekor:", err);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        loadData();
        return () => {
            isMounted = false; // cleanup, React ajánlás
        };
    }, [id]);

    // --- Mentés ---
    const submit = async (e) => {
        e.preventDefault();
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
            if (id) await api.put(`/user/movies/${id}`, payload);
            else await api.post("/user/movies", payload);

            localStorage.removeItem("userMovieDraft");
            navigate("/my-movies");
        } catch (err) {
            console.error("❌ Mentés sikertelen:", err);
        }
    };

    if (loading) return <Typography sx={{ p: 4 }}>Betöltés...</Typography>;

    return (
        <Container maxWidth="sm" sx={{ py: 3 }}>
            <Paper sx={{ p: 3 }}>
                <Typography variant="h5" sx={{ mb: 2 }}>
                    {id ? "Saját film szerkesztése" : "Új saját film hozzáadása"}
                </Typography>

                <form onSubmit={submit}>
                    <Stack spacing={2}>
                        <TextField label="Cím" value={form.title} onChange={(e) => change("title", e.target.value)} required />
                        <TextField label="Rendező" value={form.director} onChange={(e) => change("director", e.target.value)} />
                        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                            <TextField
                                label="Megjelenés éve"
                                type="number"
                                value={form.releaseYear}
                                onChange={(e) => change("releaseYear", e.target.value)}
                                sx={{ flex: 1 }}
                            />
                            <TextField
                                label="Műfaj"
                                value={form.genre}
                                onChange={(e) => change("genre", e.target.value)}
                                sx={{ flex: 1 }}
                            />
                        </Stack>

                        <TextField
                            label="Értékelés (1–10)"
                            type="number"
                            inputProps={{ step: "0.1", min: 0, max: 10 }}
                            value={form.rating}
                            onChange={(e) => change("rating", e.target.value)}
                        />

                        <TextField
                            label="Leírás"
                            multiline
                            minRows={3}
                            value={form.description}
                            onChange={(e) => change("description", e.target.value)}
                        />

                        <TextField
                            label="Plakát URL"
                            type="url"
                            value={form.posterUrl}
                            onChange={(e) => change("posterUrl", e.target.value)}
                            helperText="Illeszthetsz be külső képlinket (pl. TMDB/IMDb/Imgur)"
                        />

                        {form.posterUrl && (
                            <img
                                src={form.posterUrl}
                                alt="Előnézet"
                                style={{
                                    width: "100%",
                                    maxHeight: 260,
                                    objectFit: "cover",
                                    borderRadius: 8
                                }}
                                onError={(e) => (e.currentTarget.style.display = "none")}
                            />
                        )}

                        <FormControl>
                            <InputLabel>Kategória</InputLabel>
                            <Select
                                label="Kategória"
                                value={form.categoryId}
                                onChange={(e) => change("categoryId", e.target.value)}
                            >
                                <MenuItem value="">-- nincs --</MenuItem>
                                {categories.map((c) => (
                                    <MenuItem key={c.id} value={c.id}>
                                        {c.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Stack direction="row" justifyContent="space-between">
                            <Button
                                variant="outlined"
                                startIcon={<CancelIcon />}
                                onClick={() => navigate("/my-movies")}
                            >
                                Mégse
                            </Button>

                            <Button type="submit" variant="contained" startIcon={<SaveIcon />}>
                                Mentés
                            </Button>
                        </Stack>
                    </Stack>
                </form>
            </Paper>
        </Container>
    );
}