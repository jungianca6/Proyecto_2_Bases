import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./AdminPg.module.css";

function AdminAsociacionTratamiento(){
    const [formData, setFormData] = useState({
        nombreSucursal: "",
        identificador: ""
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
                <div className={styles.logo}>GymTEC - Asociación de tratamientos</div>
            </nav>

            <main className={styles.main}>
                <h1 className={styles.welcome}>Asociación de Tratamientos de Spa</h1>
                <form className={styles.form}>
                    <label htmlFor="identificador" className={styles.label}>Identificador de tratamiento</label>
                    <input
                        type="text"
                        id="identificador"
                        name="identificador"
                        value={formData.identificador}
                        onChange={handleChange}
                    />

                    <label htmlFor="nombreSucursal" className={styles.label}>Nombre de sucursal</label>
                    <input
                        type="text"
                        id="nombreSucursal"
                        name="nombreSucursal"
                        value={formData.nombreSucursal}
                        onChange={handleChange}
                    />

                    <div className={styles.buttonRow}>
                        <button type="button" onClick={() => handleSubmit("Agregar")}>Agregar</button>
                        <button type="button" onClick={() => handleSubmit("Ver tratamientos")}>
                            Ver tratamientos</button>
                    </div>
                </form>
            </main>
        </div>
    );
}

export default AdminAsociacionTratamiento;