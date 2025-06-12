import React, { useState } from "react";
import styles from "./AdminPg.module.css";

function AdminInventario() {
    const [formData, setFormData] = useState({
        tipoEquipo: "",
        marca: "",
        numeroSerie: "",
        costo: "",
        nombreSucursal: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (accion) => {
        console.log(`Acción: ${accion}`);
        console.log(formData);
        // Aquí va el fetch al backend según la acción
    };

    return (
        <div className={styles.container}>
            <nav className={styles.navbar}>
                <div className={styles.logo}>GymTEC - Inventario</div>
            </nav>

            <main className={styles.main}>
                <h1 className={styles.welcome}>Gestión de Inventario</h1>
                <form className={styles.form}>
                    <label htmlFor="tipoEquipo" className={styles.label}>Tipo de equipo</label>
                    <input
                        type="text"
                        id="tipoEquipo"
                        name="tipoEquipo"
                        value={formData.tipoEquipo}
                        onChange={handleChange}
                        style={{ marginBottom: "1rem" }}
                    />

                    <label htmlFor="marca" className={styles.label}>Marca</label>
                    <input
                        type="text"
                        id="marca"
                        name="marca"
                        value={formData.marca}
                        onChange={handleChange}
                        style={{ marginBottom: "1rem" }}
                    />

                    <label htmlFor="numeroSerie" className={styles.label}>Número de serie</label>
                    <input
                        type="text"
                        id="numeroSerie"
                        name="numeroSerie"
                        value={formData.numeroSerie}
                        onChange={handleChange}
                        style={{ marginBottom: "1rem" }}
                    />

                    <label htmlFor="costo" className={styles.label}>Costo</label>
                    <input
                        type="number"
                        id="costo"
                        name="costo"
                        value={formData.costo}
                        onChange={handleChange}
                        style={{ marginBottom: "1rem" }}
                    />

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
                        <button type="button" onClick={() => handleSubmit("insertar")}>Insertar</button>
                        <button type="button" onClick={() => handleSubmit("editar")}>Editar</button>
                        <button type="button" onClick={() => handleSubmit("eliminar")}>Eliminar</button>
                        <button type="button" onClick={() => handleSubmit("consultar")}>Consultar</button>
                    </div>
                </form>
            </main>
        </div>
    );
}

export default AdminInventario;
