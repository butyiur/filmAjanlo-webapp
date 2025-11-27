import { useEffect, useState } from "react";
import api from "../api/client";

export default function CategoryList() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        api.get("/categories")
            .then(r => setCategories(r.data))
            .catch(() => setError("Hiba történt a kategóriák betöltésekor"))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div style={{ padding: 20 }}>Betöltés…</div>;
    if (error) return <div style={{ padding: 20, color: "red" }}>{error}</div>;

    return (
        <div style={{ padding: 20 }}>
            <h2>Kategóriák</h2>
            <ul>
                {categories.map(c => (<li key={c.id}>{c.name}</li>))}
            </ul>
        </div>
    );
}