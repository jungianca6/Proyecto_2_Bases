import React, { useState } from "react";
import styles from "./AdminPg.module.css";

function AdminEquipo() {
    const [formData, setFormData] = useState({
        identificador: "",
        descripcion: ""
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
                <div className={styles.logo}>GymTEC - Tipos de Equipo</div>
            </nav>

            <main className={styles.main}>
                <h1 className={styles.welcome}>Gestión de Tipos de Equipo</h1>
                <form className={styles.form}>
                    <label htmlFor="identificador" className={styles.label}>Identificador único</label>
                    <input
                        type="text"
                        id="identificador"
                        name="identificador"
                        value={formData.identificador}
                        onChange={handleChange}
                        style={{ marginBottom: "1rem" }}
                    />

                    <label htmlFor="descripcion" className={styles.label}>Descripción del tipo</label>
                    <input
                        type="text"
                        id="descripcion"
                        name="descripcion"
                        value={formData.descripcion}
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

export default AdminEquipo;
