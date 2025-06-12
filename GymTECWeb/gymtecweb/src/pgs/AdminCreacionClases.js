import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./AdminPg.module.css";

function AdminCreacionClases(){

    const [formData, setFormData] = useState({
        tipoClase: "",
        instructor: "",
        grupal: "",
        capacidad: "",
        fecha: "",
        horaInicio: "",
        horaFinalizacion: ""
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
                <div className={styles.logo}>GymTEC - Creación de clases</div>
            </nav>

            <main className={styles.main}>
                <h1 className={styles.welcome}>Crear clase</h1>
                <form className={styles.form}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                        {/* Columna izquierda */}
                        <div>
                            <label htmlFor="tipoClase" className={styles.label}>Tipo de clase</label>
                            <input type="text" id="tipoClase" name="tipoClase" value={formData.tipoClase} onChange={handleChange} style={{ marginBottom: "1rem" }} />

                            <label htmlFor="instructor" className={styles.label}>Instructor</label>
                            <input type="text" id="instructor" name="instructor" value={formData.instructor} onChange={handleChange} style={{ marginBottom: "1rem" }} />

                            <label htmlFor="grupal" className={styles.label}>Grupal</label>
                            <input type="text" id="grupal" name="grupal" value={formData.grupal} onChange={handleChange} style={{ marginBottom: "1rem" }} />

                            <label htmlFor="Capacidad" className={styles.label}>Capacidad</label>
                            <input type="text" id="Capacidad" name="Capacidad" value={formData.capacidad} onChange={handleChange} style={{ marginBottom: "1rem" }} />

                        </div>

                        {/* Columna derecha */}
                        <div>
                            <label htmlFor="fecha" className={styles.label}>Fecha de clase</label>
                            <input type="date" id="fecha" name="fecha" value={formData.fecha} onChange={handleChange} style={{ marginBottom: "1rem" }} />

                            <label htmlFor="horaInicio" className={styles.label}>Hora de inicio</label>
                            <input type="text" id="horaInicio" name="horaInicio" value={formData.horaInicio} onChange={handleChange} style={{ marginBottom: "1rem" }} />

                            <label htmlFor="horaFinalizacion" className={styles.label}>Hora de finalización</label>
                            <input type="text" id="horaFinalizacion" name="horaFinalizacion" value={formData.horaFinalizacion} onChange={handleChange} style={{ marginBottom: "1rem" }} />
                        </div>
                    </div>

                    <div className={styles.buttonRow} style={{ marginTop: "2rem" }}>
                        <button type="button" onClick={() => handleSubmit("Agregar clase")}>Agregar clase</button>
                    </div>
                </form>

            </main>
        </div>
    );
}
export default AdminCreacionClases;