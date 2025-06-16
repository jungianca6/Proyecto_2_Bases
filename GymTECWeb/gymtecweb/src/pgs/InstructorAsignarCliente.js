import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./InstructorPg.module.css";

function InstructorAsignarCliente() {
    const [instructorCedula, setInstructorCedula] = useState("");
    const [clienteCedula, setClienteCedula] = useState("");

    useEffect(() => {
        const cuenta = JSON.parse(localStorage.getItem("cuenta_actual"));
        if (cuenta && cuenta.id_number) {
            setInstructorCedula(cuenta.id_number);
        }
    }, []);

    const handleSubmit = async () => {
        if (!clienteCedula.trim()) {
            alert("Por favor, ingresa la cédula del cliente.");
            return;
        }

        try {
            const res = await axios.post("http://localhost:8000/asignar_instructor", {
                instructor_id: instructorCedula,
                client_id: clienteCedula
            });

            if (res.data.status) {
                alert("Instructor asignado correctamente al cliente.");
                setClienteCedula("");
            } else {
                alert("No se pudo asignar el instructor.");
            }
        } catch (err) {
            console.error(err);
            alert("Error al comunicar con el servidor.");
        }
    };

    return (
        <div className={styles.container}>
            <nav className={styles.navbar}>
                <div className={styles.logo}>GymTEC - Asignar Cliente</div>
            </nav>

            <main className={styles.main}>
                <h1 className={styles.welcome}>Asignarse a un Cliente</h1>

                <div className={styles.form}>

                    <label htmlFor="clienteCedula" className={styles.label}>Cédula del cliente</label>
                    <input
                        type="number"
                        id="clienteCedula"
                        name="clienteCedula"
                        value={clienteCedula}
                        onChange={(e) => setClienteCedula(e.target.value)}
                        className={styles.input}
                        style={{ marginBottom: "1rem" }}
                    />

                    <div className={styles.buttonRow}>
                        <button type="button" className={styles.button} onClick={handleSubmit}>
                            Asignar
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default InstructorAsignarCliente;
