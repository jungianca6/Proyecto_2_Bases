import React, { useState } from "react";
import styles from "./AdminPg.module.css";
import axios from "axios";

function AdminCG() {
    const [formData, setFormData] = useState({
        sucursalOrigen: "",
        sucursalDestino: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        const payload = {
            origin_branch_name: formData.sucursalOrigen,
            destination_branch_name: formData.sucursalDestino
        };

        axios.post("http://localhost:8000/copiar_gimnasio", payload)
            .then((res) => {
                if (res.data.status) {
                    alert("Copia realizada exitosamente.");
                    setFormData({ sucursalOrigen: "", sucursalDestino: "" });
                } else {
                    alert("Error al copiar gimnasio: " + (res.data.message || "desconocido"));
                }
            })
            .catch((err) => {
                console.error("Error al conectar con el servidor:", err);
                alert("Error al copiar gimnasio.");
            });
    };

    return (
        <div className={styles.container}>
            <nav className={styles.navbar}>
                <div className={styles.logo}>GymTEC - Copiar Gimnasio</div>
            </nav>

            <main className={styles.main}>
                <h1 className={styles.welcome}>Copiar Información de un Gimnasio</h1>
                <form className={styles.form}>
                    <label htmlFor="sucursalOrigen" className={styles.label}>Nombre de sucursal a copiar</label>
                    <input
                        type="text"
                        id="sucursalOrigen"
                        name="sucursalOrigen"
                        value={formData.sucursalOrigen}
                        onChange={handleChange}
                        style={{ marginBottom: "1rem" }}
                    />

                    <label htmlFor="sucursalDestino" className={styles.label}>Nombre de sucursal nueva (copia)</label>
                    <input
                        type="text"
                        id="sucursalDestino"
                        name="sucursalDestino"
                        value={formData.sucursalDestino}
                        onChange={handleChange}
                        style={{ marginBottom: "1rem" }}
                    />

                    <div className={styles.buttonRow}>
                        <button type="button" onClick={handleSubmit}>Copiar</button>
                    </div>
                </form>
            </main>
        </div>
    );
}

export default AdminCG;
