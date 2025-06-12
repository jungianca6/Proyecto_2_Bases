import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./AdminPg.module.css";

function AdminAsociacionInventario() {

    const [formData, setFormData] = useState({
        nombreSucursal: "",
        numeroSerie: ""
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
                <div className={styles.logo}>GymTEC - Asociación de inventario</div>
            </nav>

            <main className={styles.main}>
                <h1 className={styles.welcome}>Asociación de inventario de gimnasios</h1>
                <form className={styles.form}>
                    <label htmlFor="nombreSucursal" className={styles.label}>Nombre de sucursal</label>
                    <input
                        type="text"
                        id="nombreSucursal"
                        name="nombreSucursal"
                        value={formData.nombreSucursal}
                        onChange={handleChange}
                    />

                    <label htmlFor="numeroSerie" className={styles.label}>Número de serie</label>
                    <input
                        type="text"
                        id="numeroSerie"
                        name="numeroSerie"
                        value={formData.numeroSerie}
                        onChange={handleChange}
                    />

                    <div className={styles.buttonRow}>
                        <button type="button" onClick={() => handleSubmit("Agregar")}>Agregar</button>
                        <button type="button" onClick={() => handleSubmit("Máquinas asociadas")}>
                            Ver máquinas asociadas</button>
                    </div>
                </form>
            </main>
        </div>
    );
}
export default AdminAsociacionInventario;