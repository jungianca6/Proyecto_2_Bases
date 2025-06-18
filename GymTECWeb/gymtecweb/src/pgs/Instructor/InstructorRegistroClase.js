import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./InstructorPg.module.css";

function InstructorRegistroClase() {
    const [formData, setFormData] = useState({
        class_type: "Indoor Cycling",
        is_group: false,
        capacity: 1,
        date: "",
        start_time: "",
        end_time: ""
    });

    const [instructorId, setInstructorId] = useState("");

    useEffect(() => {
        const cuenta = JSON.parse(localStorage.getItem("cuenta_actual"));
        if (cuenta && cuenta.id_number) {
            setInstructorId(cuenta.id_number);
        }
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const val = type === "checkbox" ? checked : value;
        setFormData((prev) => ({ ...prev, [name]: val }));
    };

    const handleSubmit = async () => {
        const dataToSend = {
            instructor_id: instructorId,
            ...formData
        };

        try {
            const res = await axios.post("http://localhost:8000/registro_clase", dataToSend);
            if (res.data.status) {
                alert("Clase registrada exitosamente.");
                setFormData({
                    class_type: "Indoor Cycling",
                    is_group: false,
                    capacity: 1,
                    date: "",
                    start_time: "",
                    end_time: ""
                });
            } else {
                alert("No se pudo registrar la clase.");
            }
        } catch (err) {
            console.error(err);
            alert("Error al registrar la clase.");
        }
    };

    return (
        <div className={styles.container}>
            <nav className={styles.navbar}>
                <div className={styles.logo}>GymTEC - Registro de Clase</div>
            </nav>

            <main className={styles.main}>
                <h1 className={styles.welcome}>Registro de Clase</h1>

                <form className={styles.form}>
                    <label className={styles.label}>Tipo de clase</label>
                    <select
                        name="class_type"
                        value={formData.class_type}
                        onChange={handleChange}
                        className={styles.input}
                    >
                        <option>Indoor Cycling</option>
                        <option>Pilates</option>
                        <option>Yoga</option>
                        <option>Zumba</option>
                        <option>Natación</option>
                    </select>

                    <label className={styles.label}>
                        <input
                            type="checkbox"
                            name="is_group"
                            checked={formData.is_group}
                            onChange={handleChange}
                            style={{ marginRight: "0.5rem" }}
                        />
                        ¿Es grupal?
                    </label>

                    <label className={styles.label}>Capacidad</label>
                    <input
                        type="number"
                        name="capacity"
                        value={formData.capacity}
                        onChange={handleChange}
                        className={styles.input}
                        min={1}
                    />

                    <label className={styles.label}>Fecha</label>
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className={styles.input}
                    />

                    <label className={styles.label}>Hora de inicio</label>
                    <input
                        type="time"
                        name="start_time"
                        value={formData.start_time}
                        onChange={handleChange}
                        className={styles.input}
                    />

                    <label className={styles.label}>Hora de finalización</label>
                    <input
                        type="time"
                        name="end_time"
                        value={formData.end_time}
                        onChange={handleChange}
                        className={styles.input}
                    />

                    <div className={styles.buttonRow}>
                        <button type="button" className={styles.button} onClick={handleSubmit}>
                            Registrar clase
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}

export default InstructorRegistroClase;
