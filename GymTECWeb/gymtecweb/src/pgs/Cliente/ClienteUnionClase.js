import React, { useState } from "react";
import axios from "axios";
import styles from "./ClientePg.module.css";

function ClienteUnionClase() {
    const [formData, setFormData] = useState({
        tipoClase: "",
        fechaInicio: "",
        fechaFinal: ""
    });

    const [clasesEncontradas, setClasesEncontradas] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        const startDateFormatted = new Date(formData.fechaInicio).toISOString().split("T")[0];
        const endDateFormatted = new Date(formData.fechaFinal).toISOString().split("T")[0];
        const payload = {
            class_type: formData.tipoClase,
            start_date: startDateFormatted,
            end_date: endDateFormatted
        };

        try {
            const res = await axios.post("https://gymtecbackend.azurewebsites.net/ClassSearch/search_class", payload);
            console.log("Respuesta del backend:", res.data);
            if (res.data.status) {
                setClasesEncontradas(res.data.data);
            } else {
                alert("No se encontraron clases.");
                setClasesEncontradas([]);
            }
        } catch (err) {
            console.error("Error al buscar clases:", err);
            alert("Error de conexión al servidor.");
        }
    };

    const handleUnirse = async (clase) => {
        const usuarioActual = JSON.parse(localStorage.getItem("usuario_actual"));

        if (!usuarioActual || !usuarioActual.cedula) {
            alert("No se pudo obtener la cédula del usuario logeado.");
            return;
        }

        const clasePayload = {
            client_id: String(usuarioActual.cedula),
            class_date: new Date(clase.class_date).toISOString().split("T")[0],
            start_time: clase.start_time,
            end_time: clase.end_time,
            instructor: clase.instructor,
            available_spots: parseInt(clase.available_spots)
        };

        try {
            const res = await axios.post("https://gymtecbackend.azurewebsites.net/ClassRegistration/register_class", clasePayload);

            if (res.data.status) {
                alert("Te has unido a la clase exitosamente.");
            } else {
                alert("No fue posible unirse a la clase: " + (res.data.message || "Error desconocido"));
            }
        } catch (err) {
            console.error("Error al unirse a clase:", err);
            alert("Error de conexión al servidor.");
        }
    };


    return (
        <div className={styles.container}>
            <nav className={styles.navbar}>
                <div className={styles.logo}>GymTEC - Búsqueda de clase</div>
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

                    <label htmlFor="fechaInicio" className={styles.label}>Fecha inicial de búsqueda</label>
                    <input
                        type="date"
                        id="fechaInicio"
                        name="fechaInicio"
                        value={formData.fechaInicio}
                        onChange={handleChange}
                        style={{ marginBottom: "1rem" }}
                    />

                    <label htmlFor="fechaFinal" className={styles.label}>Fecha final de búsqueda</label>
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

                {clasesEncontradas.length > 0 && (
                    <div style={{ marginTop: "2rem", width: "100%" }}>
                        <h2>Clases encontradas</h2>
                        {clasesEncontradas.map((clase, index) => (
                            <div key={index} style={{
                                backgroundColor: "white",
                                padding: "1rem",
                                marginBottom: "1rem",
                                borderRadius: "8px",
                                color: "#333"
                            }}>
                                <p><strong>Fecha de clase:</strong> {clase.class_date}</p>
                                <p><strong>Hora de inicio:</strong> {clase.start_time}</p>
                                <p><strong>Hora de finalización:</strong> {clase.end_time}</p>
                                <p><strong>Instructor:</strong> {clase.instructor}</p>
                                <p><strong>Cupos disponibles:</strong> {clase.available_spots}</p>

                                {clase.available_spots > 0 ? (
                                    <button
                                        style={{
                                            padding: "0.5rem 1rem",
                                            backgroundColor: "#2e7d32",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "6px",
                                            cursor: "pointer"
                                        }}
                                        onClick={() => handleUnirse(clase)}
                                    >
                                        Unirse
                                    </button>
                                ) : (
                                    <p style={{ color: "white" }}>No hay cupos disponibles</p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

export default ClienteUnionClase;
