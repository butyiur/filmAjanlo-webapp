import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { auth } from "../api/client";
import {
    Box,
    Typography,
    Button,
    Stack,
    TextField,
    Paper,
    List,
    ListItem,
    ListItemText,
    IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";

export default function CategoryList() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [adding, setAdding] = useState(false);
    const [newName, setNewName] = useState("");

    const navigate = useNavigate();
    const user = auth.getUser();
    const isAdmin = user?.role === "ADMIN";

    // --- kategóriák betöltése ---
    const loadCategories = async () => {
        try {
            const res = await api.get("/categories");
            // kiszűrjük az esetleges duplikáltakat (név alapján)
            const unique = Array.from(new Map(res.data.map(c => [c.name.toLowerCase(), c])).values());
            setCategories(unique);
        } catch {
            setError("❌ Hiba történt a kategóriák betöltésekor");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

    // --- új kategória mentése ---
    const handleAddCategory = async () => {
        const name = newName.trim();
        if (!name) return alert("Adj meg egy kategórianemet!");

        // Ellenőrzés: létezik-e már
        if (categories.some(c => c.name.toLowerCase() === name.toLowerCase())) {
            alert("Ez a kategória már létezik!");
            return;
        }

        try {
            await api.post("/categories", { name });
            setNewName("");
            setAdding(false);
            loadCategories();
        } catch (err) {
            console.error("❌ Hiba a kategória hozzáadásakor:", err);
            alert("Hiba történt a mentéskor!");
        }
    };

    // --- kategória törlése ---
    const handleDelete = async (id) => {
        if (!window.confirm("Biztosan törlöd ezt a kategóriát?")) return;
        try {
            await api.delete(`/categories/${id}`);
            loadCategories();
        } catch (err) {
            console.error("❌ Hiba a kategória törlésekor:", err);
            alert("A törlés nem sikerült!");
        }
    };

    // --- kattintás kategóriára (felhasználónál szűrés) ---
    const handleCategoryClick = (categoryId) => {
        if (!isAdmin) navigate(`/?categoryId=${categoryId}`);
    };

    if (loading) return <Box sx={{ p: 3 }}>Betöltés…</Box>;
    if (error) return <Box sx={{ p: 3, color: "red" }}>{error}</Box>;

    return (
        <Box sx={{ p: 3 }}>
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 2 }}
            >
                <Typography variant="h5">Kategóriák</Typography>
                {isAdmin && !adding && (
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setAdding(true)}
                    >
                        Új kategória
                    </Button>
                )}
            </Stack>

            {isAdmin && adding && (
                <Paper sx={{ p: 2, mb: 3 }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <TextField
                            label="Kategória neve"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            size="small"
                        />
                        <Button
                            variant="contained"
                            startIcon={<SaveIcon />}
                            onClick={handleAddCategory}
                        >
                            Mentés
                        </Button>
                        <Button
                            variant="outlined"
                            color="error"
                            startIcon={<CancelIcon />}
                            onClick={() => {
                                setAdding(false);
                                setNewName("");
                            }}
                        >
                            Mégse
                        </Button>
                    </Stack>
                </Paper>
            )}

            <Paper>
                <List>
                    {categories.map((cat) => (
                        <ListItem
                            key={cat.id}
                            secondaryAction={
                                isAdmin && (
                                    <IconButton
                                        edge="end"
                                        color="error"
                                        onClick={() => handleDelete(cat.id)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                )
                            }
                        >
                            <ListItemText
                                primary={cat.name}
                                onClick={() => handleCategoryClick(cat.id)}
                                primaryTypographyProps={{
                                    fontWeight: !isAdmin ? "500" : "400",
                                    sx: {
                                        cursor: !isAdmin ? "pointer" : "default",
                                    },
                                }}
                            />
                        </ListItem>
                    ))}
                </List>
            </Paper>
        </Box>
    );
}