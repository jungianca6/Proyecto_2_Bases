import React, { useState } from "react";
import axios from "axios";
import styles from "./AdminPg.module.css";

function AdminCreacionClases() {
    const [formData, setFormData] = useState({
        tipoClase: "",
        instructor: "",
        grupal: "",  // Se convertirá a booleano
        capacidad: "",
        fecha: "",
        horaInicio: "",
        horaFinalizacion: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        const data = {
            class_type: formData.tipoClase,
            instructor: formData.instructor,
            is_group_class: formData.grupal.toLowerCase() === "true", // convierte a booleano
            capacity: parseInt(formData.capacidad),
            date: formData.fecha,
            start_time: formData.horaInicio,
            end_time: formData.horaFinalizacion
        };

        axios.post("http://TU_BACKEND/clases/crear", data)
            .then(() => {
                alert("Clase creada correctamente.");
            })
            .catch((err) => {
                console.error("Error al crear clase:", err);
                alert("Error al crear clase.");
            });
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
                            <input type="text" id="tipoClase" name="tipoClase" value={formData.tipoClase} onChange={handleChange} />

                            <label htmlFor="instructor" className={styles.label}>Instructor</label>
                            <input type="text" id="instructor" name="instructor" value={formData.instructor} onChange={handleChange} />

                            <label htmlFor="grupal" className={styles.label}>Grupal (true/false)</label>
                            <input type="text" id="grupal" name="grupal" value={formData.grupal} onChange={handleChange} />

                            <label htmlFor="capacidad" className={styles.label}>Capacidad</label>
                            <input type="number" id="capacidad" name="capacidad" value={formData.capacidad} onChange={handleChange} />
                        </div>

                        {/* Columna derecha */}
                        <div>
                            <label htmlFor="fecha" className={styles.label}>Fecha de clase</label>
                            <input type="date" id="fecha" name="fecha" value={formData.fecha} onChange={handleChange} />

                            <label htmlFor="horaInicio" className={styles.label}>Hora de inicio (HH:mm:ss)</label>
                            <input type="text" id="horaInicio" name="horaInicio" value={formData.horaInicio} onChange={handleChange} />

                            <label htmlFor="horaFinalizacion" className={styles.label}>Hora de finalización (HH:mm:ss)</label>
                            <input type="text" id="horaFinalizacion" name="horaFinalizacion" value={formData.horaFinalizacion} onChange={handleChange} />
                        </div>
                    </div>

                    <div className={styles.buttonRow} style={{ marginTop: "2rem" }}>
                        <button type="button" onClick={handleSubmit}>Agregar clase</button>
                    </div>
                </form>
            </main>
        </div>
    );
}

export default AdminCreacionClases;
