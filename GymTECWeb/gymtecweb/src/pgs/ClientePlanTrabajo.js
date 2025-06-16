import React, { useState } from "react";
import styles from "./ClientePg.module.css";

function ClientePlanTrabajo() {
    const [formData, setFormData] = useState({
        numeroCedula: "",
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
                <div className={styles.logo}>GymTEC - Plan de Trabajo</div>
            </nav>

            <main className={styles.main}>
                <h1 className={styles.welcome}>Visualización de mi plan de trabajo</h1>
                <form className={styles.form}>
                    <label htmlFor="numeroCedula" className={styles.label}>Número de cédula</label>
                    <input
                        type="text"
                        id="numeroCedula"
                        name="numeroCedula"
                        value={formData.numeroCedula}
                        onChange={handleChange}
                        style={{ marginBottom: "1rem" }}
                    />

                    <div className={styles.buttonRow}>
                        <button type="button" onClick={handleSubmit}>Ver plan</button>
                    </div>
                </form>
            </main>
        </div>
    );
}

export default ClientePlanTrabajo;
