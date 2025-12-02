import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/client";
import { Container, Paper, Stack, TextField, FormControl, InputLabel, Select, MenuItem, Button, Typography } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";

export default function UserMovieForm() {
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

    const change = (k, v) => setForm((p) => ({ ...p, [k]: v }));

    useEffect(() => {
        api.get("/categories").then(r => setCategories(r.data));
        if (id) {
            api.get(`/user/movies/${id}`).then(r => {
                const m = r.data;
                setForm({
                    title: m.title,
                    director: m.director,
                    releaseYear: m.releaseYear,
                    genre: m.genre,
                    rating: m.rating,
                    description: m.description,
                    posterUrl: m.posterUrl,
                    categoryId: m.category?.id ?? ""
                });
            });
        }
    }, [id]);

    const submit = async (e) => {
        e.preventDefault();
        const payload = {
            ...form,
            category: form.categoryId ? { id: Number(form.categoryId) } : null
        };
        try {
            if (id) await api.put(`/user/movies/${id}`, payload);
            else await api.post("/user/movies", payload);
            navigate("/my-movies");
        } catch (err) {
            console.error("❌ Mentés sikertelen:", err);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ py: 3 }}>
            <Paper sx={{ p: 3 }}>
                <Typography variant="h5" sx={{ mb: 2 }}>
                    {id ? "Film szerkesztése" : "Új saját film"}
                </Typography>
                <form onSubmit={submit}>
                    <Stack spacing={2}>
                        <TextField label="Cím" value={form.title} onChange={(e) => change("title", e.target.value)} required />
                        <TextField label="Rendező" value={form.director} onChange={(e) => change("director", e.target.value)} />
                        <TextField label="Megjelenés éve" type="number" value={form.releaseYear} onChange={(e) => change("releaseYear", e.target.value)} />
                        <TextField label="Műfaj" value={form.genre} onChange={(e) => change("genre", e.target.value)} />
                        <TextField label="Értékelés" type="number" value={form.rating} onChange={(e) => change("rating", e.target.value)} />
                        <TextField label="Leírás" multiline rows={3} value={form.description} onChange={(e) => change("description", e.target.value)} />
                        <TextField label="Plakát URL" value={form.posterUrl} onChange={(e) => change("posterUrl", e.target.value)} />
                        <FormControl>
                            <InputLabel>Kategória</InputLabel>
                            <Select value={form.categoryId} onChange={(e) => change("categoryId", e.target.value)}>
                                <MenuItem value="">-- nincs --</MenuItem>
                                {categories.map((c) => (
                                    <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Stack direction="row" justifyContent="space-between">
                            <Button variant="outlined" startIcon={<CancelIcon />} onClick={() => navigate("/my-movies")}>
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