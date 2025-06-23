import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./InstructorPg.module.css";

function InstructorCrearPlan() {
    const [formData, setFormData] = useState({
        client_id: "",
        day: "Lunes",
        exercise_name: "",
        sets: 1,
        repetitions: 1,
        notes: "",
        period: "Semanal" // Valor por defecto válido
    });

    const [instructorCedula, setInstructorCedula] = useState("");

    useEffect(() => {
        const cuenta = JSON.parse(localStorage.getItem("cuenta_actual"));
        if (cuenta && cuenta.id_number) {
            setInstructorCedula(cuenta.id_number); 
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
            const payload = {
                ...formData,
                sets: parseInt(formData.sets),
                repetitions: parseInt(formData.repetitions)
            };

            console.log("Datos que se enviarán al backend:", payload);

            const res = await axios.post("https://gymtecbackend.azurewebsites.net/WorkoutPlan/create_workout_plan", payload);

            if (res.data.status) {
                alert("Plan agregado exitosamente.");
                setFormData({
                    client_id: "",
                    day: "Lunes",
                    exercise_name: "",
                    sets: 1,
                    repetitions: 1,
                    notes: "",
                    period: "Semanal"
                });
            } else {
                alert("No se pudo agregar el plan.");
            }
        } catch (err) {
            console.error(err);
            alert("Error al enviar el plan al servidor.");
        }
    };

    return (
        <div className={styles.container}>
            <nav className={styles.navbar}>
                <div className={styles.logo}>GymTEC - Crear Plan</div>
            </nav>

            <main className={styles.main}>
                <h1 className={styles.welcome}>Creación de Plan de Trabajo</h1>

                <form className={styles.form}>
                    <label className={styles.label}>Cédula del cliente</label>
                    <input
                        type="text"
                        name="client_id"
                        value={formData.client_id}
                        onChange={handleChange}
                        className={styles.input}
                    />

                    <label className={styles.label}>Día</label>
                    <select
                        name="day"
                        value={formData.day}
                        onChange={handleChange}
                        className={styles.input}
                    >
                        <option>Lunes</option>
                        <option>Martes</option>
                        <option>Miércoles</option>
                        <option>Jueves</option>
                        <option>Viernes</option>
                        <option>Sábado</option>
                        <option>Domingo</option>
                    </select>

                    <label className={styles.label}>Nombre del ejercicio</label>
                    <input
                        type="text"
                        name="exercise_name"
                        value={formData.exercise_name}
                        onChange={handleChange}
                        className={styles.input}
                    />

                    <label className={styles.label}>Series</label>
                    <input
                        type="number"
                        name="sets"
                        value={formData.sets}
                        onChange={handleChange}
                        className={styles.input}
                        min={1}
                    />

                    <label className={styles.label}>Repeticiones</label>
                    <input
                        type="number"
                        name="repetitions"
                        value={formData.repetitions}
                        onChange={handleChange}
                        className={styles.input}
                        min={1}
                    />

                    <label className={styles.label}>Notas</label>
                    <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        className={styles.input}
                        rows={3}
                    />

                    <label className={styles.label}>Periodo</label>
                    <select
                        name="period"
                        value={formData.period}
                        onChange={handleChange}
                        className={styles.input}
                    >
                        <option>Semanal</option>
                        <option>Mensual</option>
                    </select>

                    <div className={styles.buttonRow}>
                        <button type="button" className={styles.button} onClick={handleSubmit}>
                            Agregar al plan
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}

export default InstructorCrearPlan;
