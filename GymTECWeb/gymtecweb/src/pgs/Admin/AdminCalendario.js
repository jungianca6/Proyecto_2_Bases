import React, { useState } from "react";
import styles from "./AdminPg.module.css";
import axios from "axios";

function AdminCalendario() {
    const [formData, setFormData] = useState({
        nombreSucursal: "",
        fechaInicio: "",
        fechaFin: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        const formatDate = (dateStr) => {
            const date = new Date(dateStr);
            return date.toISOString().split("T")[0]; 
        };

        try {
            const response = await axios.post("https://localhost:7155/Schedule/copy_schedule", {
                branch_name: formData.nombreSucursal,
                start_week_date: formatDate(formData.fechaInicio),
                end_week_date: formatDate(formData.fechaFin)
            });

            if (response.data.status) {
                alert("Calendario copiado exitosamente.");
            } else {
                alert("Error al copiar calendario.");
            }
        } catch (error) {
            alert("Error al comunicarse con el servidor.");
            console.error(error);
        }
    };


    return (
        <div className={styles.container}>
            <nav className={styles.navbar}>
                <div className={styles.logo}>GymTEC - Calendario de Actividades</div>
            </nav>

            <main className={styles.main}>
                <h1 className={styles.welcome}>Copiar Calendario de Actividades</h1>
                <form className={styles.form}>
                    <label htmlFor="nombreSucursal" className={styles.label}>Nombre de sucursal</label>
                    <input
                        type="text"
                        id="nombreSucursal"
                        name="nombreSucursal"
                        value={formData.nombreSucursal}
                        onChange={handleChange}
                        style={{ marginBottom: "1rem" }}
                    />

                    <label htmlFor="fechaInicio" className={styles.label}>Fecha de inicio de semana a copiar</label>
                    <input
                        type="date"
                        id="fechaInicio"
                        name="fechaInicio"
                        value={formData.fechaInicio}
                        onChange={handleChange}
                        style={{ marginBottom: "1rem" }}
                    />

                    <label htmlFor="fechaFin" className={styles.label}>Fecha de final de semana a copiar</label>
                    <input
                        type="date"
                        id="fechaFin"
                        name="fechaFin"
                        value={formData.fechaFin}
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

export default AdminCalendario;
