import { useEffect, useState } from "react";
import api, { auth } from "../api/client";

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");

    const currentUser = auth.getUser();

    const load = async () => {
        const res = await api.get("/admin/users");
        setUsers(res.data);
    };

    useEffect(() => {
        const fetchData = async () => {
            await load();
        };
        fetchData();
    }, []);

    const filtered = users.filter((u) =>
        u.username.toLowerCase().includes(search.toLowerCase())
    );

    const deleteUser = async (id) => {
        if (currentUser && currentUser.id === id) {
            alert("Nem törölheted saját magad!");
            return;
        }
        if (!window.confirm("Biztosan törlöd ezt a felhasználót?")) return;

        await api.delete(`/admin/users/${id}`);
        await load();
    };

    return (
        <div className="page neon-page admin-users-page">
            <h2 className="page-title">Felhasználók</h2>

            <div className="neo-card">
                <div className="neo-card-inner">

                    {/* FELSŐ SOR */}
                    <div className="top-row">
                        <div>
                            <div style={{ fontSize: 13, color: "#9ca3af" }}>
                                Összes felhasználó:{" "}
                                <strong>{users.length}</strong>
                            </div>
                        </div>

                        <input
                            className="neo-input search-input"
                            placeholder="Keresés felhasználónévre..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    {/* TÁBLÁZAT */}
                    <div className="neo-table-wrapper">
                        <table className="neo-table">
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Felhasználónév</th>
                                <th>Szerepkör</th>
                                <th>Létrehozva</th>
                                <th>Utolsó belépés</th>
                                <th>Műveletek</th>
                            </tr>
                            </thead>

                            <tbody>
                            {filtered.map((u) => {
                                const isCurrentAdmin =
                                    currentUser && currentUser.id === u.id;

                                return (
                                    <tr
                                        key={u.id}
                                        className={
                                            isCurrentAdmin
                                                ? "is-current-admin"
                                                : ""
                                        }
                                    >
                                        <td>{u.id}</td>
                                        <td>{u.username}</td>
                                        <td>
                                            {u.role === "ADMIN" ? (
                                                <span className="badge badge--admin">
                                                        ADMIN
                                                    </span>
                                            ) : (
                                                <span className="badge badge--user">
                                                        USER
                                                    </span>
                                            )}
                                        </td>
                                        <td>
                                            {u.createdAt
                                                ? u.createdAt
                                                    .replace("T", " ")
                                                    .slice(0, 19)
                                                : "-"}
                                        </td>
                                        <td>
                                            {u.lastLogin
                                                ? u.lastLogin
                                                    .replace("T", " ")
                                                    .slice(0, 19)
                                                : (
                                                    <span className="tag-muted">
                                                            még nem lépett be
                                                        </span>
                                                )}
                                        </td>
                                        <td>
                                            {!isCurrentAdmin && (
                                                <button
                                                    className="neo-btn delete"
                                                    onClick={() =>
                                                        deleteUser(u.id)
                                                    }
                                                >
                                                    Törlés
                                                </button>
                                            )}

                                            {isCurrentAdmin && (
                                                <button
                                                    className="neo-btn cancel"
                                                    disabled
                                                >
                                                    Saját fiók
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}

                            {filtered.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={6}
                                        style={{
                                            textAlign: "center",
                                            padding: 18,
                                        }}
                                    >
                                        Nincs találat.
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}