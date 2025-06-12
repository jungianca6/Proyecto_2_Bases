import React, { useState } from "react";
import styles from "./AdminPg.module.css";

function AdminTratamiento() {
    const [formData, setFormData] = useState({
        nombre: "",
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
                <div className={styles.logo}>GymTEC - Tratamientos</div>
            </nav>

            <main className={styles.main}>
                <h1 className={styles.welcome}>Gestión de Tratamientos de Spa</h1>
                <form className={styles.form}>
                    <label htmlFor="nombre" className={styles.label}>Nombre del tratamiento</label>
                    <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                    />

                    <label htmlFor="identificador" className={styles.label}>Identificador del tratamiento</label>
                    <input
                        type="text"
                        id="identificador"
                        name="identificador"
                        value={formData.identificador}
                        onChange={handleChange}
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

export default AdminTratamiento;
