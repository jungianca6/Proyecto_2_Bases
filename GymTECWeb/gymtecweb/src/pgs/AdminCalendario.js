import React, { useState } from "react";
import styles from "./AdminPg.module.css";

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

    const handleSubmit = () => {
        console.log("Acción: copiar calendario");
        console.log(formData);
        // Aquí va el fetch al backend
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
