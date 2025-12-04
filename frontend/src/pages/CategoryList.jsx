import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { auth } from "../api/client";

export default function CategoryList() {
    const [categories, setCategories] = useState([]);
    const [adding, setAdding] = useState(false);
    const [newName, setNewName] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const user = auth.getUser();
    const isAdmin = user?.role === "ADMIN";

    const load = async () => {
        try {
            const res = await api.get("/categories");
            setCategories(res.data);
        } catch {
            setError("Nem sikerült betölteni a kategóriákat.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const addCategory = async () => {
        if (!newName.trim()) return;

        try {
            await api.post("/categories", { name: newName });
            setNewName("");
            setAdding(false);
            load();
        } catch {
            alert("Hiba a létrehozás során!");
        }
    };

    const deleteCategory = async (id) => {
        if (!window.confirm("Biztosan törlöd ezt a kategóriát?")) return;

        try {
            await api.delete(`/categories/${id}`);
            load();
        } catch {
            alert("A törlés nem sikerült!");
        }
    };

    const openCategory = (id) => {
        if (!isAdmin) navigate(`/?categoryId=${id}`);
    };

    if (loading) return <div className="page">Betöltés...</div>;

    return (
        <div className="page">
            <h1 className="category-title">Kategóriák</h1>

            <div className="neo-card">
                <div className="neo-card-inner">

                    {/* FENTI SOR */}
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 20,
                        }}
                    >
                        <div className="category-count">
                            Összes kategória: <strong>{categories.length}</strong>
                        </div>

                        {isAdmin && !adding && (
                            <button className="btn" onClick={() => setAdding(true)}>
                                + Új kategória
                            </button>
                        )}
                    </div>

                    {/* ÚJ KATEGÓRIA MEZŐ */}
                    {adding && (
                        <div style={{ marginBottom: 20, display: "flex", gap: 12 }}>
                            <input
                                className="input input--pill"
                                placeholder="Kategória neve"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                            />
                            <button className="btn" onClick={addCategory}>
                                Mentés
                            </button>
                            <button
                                className="btn btn--danger"
                                onClick={() => {
                                    setAdding(false);
                                    setNewName("");
                                }}
                            >
                                Mégse
                            </button>
                        </div>
                    )}

                    {/* KATEGÓRIA KÁRTYÁK */}
                    <div className="category-grid">
                        {categories.map((cat) => (
                            <div
                                key={cat.id}
                                className="category-card"
                                onClick={() => openCategory(cat.id)}
                                style={{ cursor: isAdmin ? "default" : "pointer" }}
                            >
                                <div className="category-name">{cat.name}</div>

                                {isAdmin && (
                                    <button
                                        className="btn btn--danger"
                                        style={{ marginTop: 12 }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteCategory(cat.id);
                                        }}
                                    >
                                        Törlés
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
}