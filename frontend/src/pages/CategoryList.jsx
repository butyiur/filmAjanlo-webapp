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
            setError("Categories list is not able to be loaded.");
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
            alert("Error while creating!");
        }
    };

    const deleteCategory = async (id) => {
        if (!window.confirm("Are you sure? (deletion)")) return;

        try {
            await api.delete(`/categories/${id}`);
            load();
        } catch {
            alert("The deletion was not successfull!");
        }
    };

    const openCategory = (id) => {
        if (!isAdmin) navigate(`/?categoryId=${id}`);
    };

    if (loading) return <div className="page-category">Loading...</div>;

    return (
        <div className="page-category">
            <h1 className="category-title">Categories</h1>

            <div className="neo-card">
                <div className="category-add-row">

                    {/* Fenti sor */}
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 20,
                        }}
                    >
                        <div className="category-count">
                            All categories: <strong>{categories.length}</strong>
                        </div>

                        {isAdmin && !adding && (
                            <button className="category-add-btn" onClick={() => setAdding(true)}>
                                + New Category
                            </button>
                        )}
                    </div>

                    {/* Új kategória mező */}
                    {adding && (
                        <div style={{ marginBottom: 20, display: "flex", gap: 12 }}>
                            <input
                                className="category-input"
                                placeholder="Category Name"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                            />
                            <button className="neo-btn save" onClick={addCategory}>
                                Save
                            </button>
                            <button
                                className="neo-btn cancel"
                                onClick={() => {
                                    setAdding(false);
                                    setNewName("");
                                }}
                            >
                                Back
                            </button>
                        </div>
                    )}

                    {/* Kategória kártyák */}
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
                                        className="category-delete-btn"
                                        style={{ marginTop: 12 }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteCategory(cat.id);
                                        }}
                                    >
                                        Delete
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