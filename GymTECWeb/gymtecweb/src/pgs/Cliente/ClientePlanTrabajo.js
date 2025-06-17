import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./ClientePg.module.css";

function ClientePlanTrabajo() {
    const [cedula, setCedula] = useState("");
    const [plan, setPlan] = useState({});
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const cuenta = JSON.parse(localStorage.getItem("cuenta_actual"));
        if (cuenta && cuenta.id_number) {
            setCedula(cuenta.id_number);
        }
    }, []);

    const handleSubmit = async () => {
        try {
            const res = await axios.post("http://localhost:8000/ver_plan_trabajo", {
                client_id: cedula
            });

            if (res.data.status && res.data.data && res.data.data.workout_plan) {
                const agrupado = agruparPorDia(res.data.data.workout_plan);
                setPlan(agrupado);
                setLoaded(true);
            } else {
                alert("No se encontró plan de trabajo.");
            }
        } catch (err) {
            console.error(err);
            alert("Error al consultar el plan de trabajo.");
        }
    };

    const agruparPorDia = (lista) => {
        const resultado = {};
        lista.forEach(ej => {
            if (!resultado[ej.day]) resultado[ej.day] = [];
            resultado[ej.day].push(ej);
        });
        return resultado;
    };

    return (
        <div className={styles.container}>
            <nav className={styles.navbar}>
                <div className={styles.logo}>GymTEC - Plan de Trabajo</div>
            </nav>

            <main className={styles.main}>
                <h1 className={styles.welcome}>Visualización de mi plan de trabajo</h1>
                <div className={styles.form}>
                    <div className={styles.buttonRow}>
                        <button type="button" onClick={handleSubmit}>Ver plan</button>
                    </div>
                </div>

                {loaded && (
                    <div className={styles.planContainer}>
                        {Object.keys(plan).map(dia => (
                            <div key={dia} className={styles.daySection}>
                                <h2>{dia}</h2>
                                {plan[dia].map((ej, idx) => (
                                    <div key={idx} className={styles.exerciseCard}>
                                        <p><strong>Ejercicio:</strong> {ej.exercise_name}</p>
                                        <p><strong>Series:</strong> {ej.sets}</p>
                                        <p><strong>Repeticiones:</strong> {ej.repetitions}</p>
                                        <p><strong>Notas:</strong> {ej.notes}</p>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

export default ClientePlanTrabajo;
