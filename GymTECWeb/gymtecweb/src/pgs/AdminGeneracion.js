import React, { useState } from "react";
import styles from "./AdminPg.module.css";

function AdminGeneracion() {
    const [formData, setFormData] = useState({
        nombreSucursal: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        console.log("Acción: generar");
        console.log(formData);
        // Aquí va el fetch al backend para generar la planilla
    };

    return (
        <div className={styles.container}>
            <nav className={styles.navbar}>
                <div className={styles.logo}>GymTEC - Generación de Planilla</div>
            </nav>

            <main className={styles.main}>
                <h1 className={styles.welcome}>Generación de Planilla</h1>
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

                    <div className={styles.buttonRow}>
                        <button type="button" onClick={handleSubmit}>Generar</button>
                    </div>
                </form>
            </main>
        </div>
    );
}

export default AdminGeneracion;
