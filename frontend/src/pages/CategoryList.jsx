import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { auth } from "../api/client";

export default function CategoryList() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [adding, setAdding] = useState(false);
    const [newName, setNewName] = useState("");

    const navigate = useNavigate();
    const user = auth.getUser();
    const isAdmin = user?.role === "ADMIN";

    const loadCategories = async () => {
        try {
            const res = await api.get("/categories");
            const unique = Array.from(
                new Map(res.data.map((c) => [c.name.toLowerCase(), c])).values()
            );
            setCategories(unique);
        } catch {
            setError("Hiba történt a kategóriák betöltésekor.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

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
            alert("Hiba történt a mentéskor!");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Biztosan törlöd ezt a kategóriát?")) return;

        try {
            await api.delete(`/categories/${id}`);
            loadCategories();
        } catch {
            alert("A törlés nem sikerült!");
        }
    };

    const handleCategoryClick = (categoryId) => {
        if (!isAdmin) navigate(`/?categoryId=${categoryId}`);
    };

    if (loading) return <div className="page neon-page">Betöltés…</div>;
    if (error) return <div className="page neon-page" style={{ color: "red" }}>{error}</div>;

    return (
        <div className="page neon-page">
            <h2 className="page-title">Kategóriák</h2>

            {/* ÚJ KATEGÓRIA FORM */}
            {isAdmin && adding && (
                <div className="neo-card" style={{ marginBottom: 20 }}>
                    <div className="neo-card-inner">
                        <div style={{ display: "flex", gap: 12 }}>
                            <input
                                className="neo-input"
                                placeholder="Kategória neve"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                            />

                            <button className="neo-btn save" onClick={handleAddCategory}>
                                Mentés
                            </button>

                            <button
                                className="neo-btn cancel"
                                onClick={() => {
                                    setAdding(false);
                                    setNewName("");
                                }}
                            >
                                Mégse
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* KATEGÓRIÁK LISTÁJA */}
            <div className="neo-card">
                <div className="neo-card-inner">
                    <div style={{ marginBottom: 12, display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "#aab" }}>
                            Összes kategória: <b>{categories.length}</b>
                        </span>

                        {isAdmin && (
                            <button
                                className="neo-btn save"
                                onClick={() => setAdding(true)}
                            >
                                Új kategória
                            </button>
                        )}
                    </div>

                    <ul style={{ listStyle: "none", padding: 0 }}>
                        {categories.map((cat) => (
                            <li
                                key={cat.id}
                                className="neo-list-item"
                                onClick={() => handleCategoryClick(cat.id)}
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    cursor: !isAdmin ? "pointer" : "default",
                                }}
                            >
                                <span>{cat.name}</span>

                                {isAdmin && (
                                    <button
                                        className="neo-btn delete"
                                        onClick={() => handleDelete(cat.id)}
                                    >
                                        Törlés
                                    </button>
                                )}
                            </li>
                        ))}

                        {categories.length === 0 && (
                            <li style={{ padding: 14, opacity: 0.7 }}>Nincsenek kategóriák.</li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
}