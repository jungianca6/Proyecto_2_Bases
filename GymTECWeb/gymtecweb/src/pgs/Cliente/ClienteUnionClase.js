import React, { useState } from "react";
import styles from "./ClientePg.module.css";

function ClienteUnionClase() {
    const [formData, setFormData] = useState({
        tipoClase: "",
        fechaInicio: "",
        fechaFinal: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        console.log("Acción: copiar gimnasio");
        console.log(formData);
        // Aquí va el fetch al backend
    };

    return (
        <div className={styles.container}>
            <nav className={styles.navbar}>
                <div className={styles.logo}>GymTEC - Busqueda de clase</div>
            </nav>

            <main className={styles.main}>
                <h1 className={styles.welcome}>Buscar clases</h1>
                <form className={styles.form}>
                    <label htmlFor="tipoClase" className={styles.label}>Tipo de clase</label>
                    <input
                        type="text"
                        id="tipoClase"
                        name="tipoClase"
                        value={formData.tipoClase}
                        onChange={handleChange}
                        style={{ marginBottom: "1rem" }}
                    />

                    <label htmlFor="fechaInicio" className={styles.label}>Fecha de inicio</label>
                    <input
                        type="date"
                        id="fechaInicio"
                        name="fechaInicio"
                        value={formData.fechaInicio}
                        onChange={handleChange}
                        style={{ marginBottom: "1rem" }}
                    />

                    <label htmlFor="fechaFinal" className={styles.label}>Fecha de finalización</label>
                    <input
                        type="date"
                        id="fechaFinal"
                        name="fechaFinal"
                        value={formData.fechaFinal}
                        onChange={handleChange}
                        style={{ marginBottom: "1rem" }}
                    />

                    <div className={styles.buttonRow}>
                        <button type="button" onClick={handleSubmit}>Buscar</button>
                    </div>
                </form>
            </main>
        </div>
    );
}

export default ClienteUnionClase;
