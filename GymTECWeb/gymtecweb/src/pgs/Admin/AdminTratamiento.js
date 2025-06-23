import React, { useState } from "react";
import styles from "./AdminPg.module.css";
import axios from "axios";

function AdminTratamiento() {
    const [consultaData, setConsultaData] = useState(null);
    const [formData, setFormData] = useState({
        nombre: "",        // Nombre actual (para buscar)
        nuevoNombre: ""    // Nuevo nombre (para editar)
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (accion) => {
        if (accion === "editar") {
            try {
                // Paso 1: Consultar el tratamiento actual por nombre
                const consultaRes = await axios.post("https://gymtecbackend.azurewebsites.net/consult_spa_treatment", {
                    treatment_name: formData.nombre
                });

                if (!consultaRes.data.status || !consultaRes.data.data) {
                    alert("No se encontró un tratamiento con ese nombre para editar.");
                    return;
                }

                const treatment_id = consultaRes.data.data.treatment_id;

                // Paso 2: Enviar el nuevo nombre con el ID
                const editarRes = await axios.post("https://gymtecbackend.azurewebsites.net/SpaTreatment/edit_spa_treatment", {
                    treatment_name: formData.nuevoNombre,
                    treatment_id: treatment_id
                });

                if (editarRes.data.status) {
                    alert("Tratamiento editado correctamente.");
                } else {
                    alert("Error al editar el tratamiento.");
                }

            } catch (error) {
                console.error("Error al editar:", error);
                alert("Error al editar el tratamiento.");
            }

            return;
        }

        // Insertar / Eliminar / Consultar
        let url = "";
        let data = {};

        switch (accion) {
            case "insertar":
                url = "https://gymtecbackend.azurewebsites.net/SpaTreatment/insert_spa_treatment";
                data = {
                    treatment_name: formData.nombre,
                    treatment_id: 0
                };
                break;
            case "eliminar":
                url = "https://gymtecbackend.azurewebsites.net/SpaTreatment/delete_spa_treatment";
                data = {
                    treatment_name: formData.nombre
                };
                break;
            case "consultar":
                url = "https://gymtecbackend.azurewebsites.net/SpaTreatment/consult_spa_treatment";
                data = {
                    treatment_name: formData.nombre
                };
                break;
            default:
                console.error("Acción no válida");
                return;
        }

        try {
            const res = await axios.post(url, data);

            if (accion === "consultar") {
                if (res.data.status && res.data.data) {
                    setConsultaData(res.data.data);
                } else {
                    setConsultaData(null);
                    alert("Tratamiento no encontrado.");
                }
            } else {
                alert(`Tratamiento ${accion} correctamente.`);
            }

        } catch (err) {
            console.error(`Error al ${accion}:`, err);
            alert(`Error al ${accion} tratamiento.`);
        }
    };

    return (
        <div className={styles.container}>
            <nav className={styles.navbar}>
                <div className={styles.logo}>GymTEC - Tratamientos</div>
            </nav>

            <main className={styles.main}>
                <h1 className={styles.welcome}>Gestión de Tratamientos de Spa</h1>

                <form className={styles.form}>
                    <label htmlFor="nombre" className={styles.label}>Nombre actual del tratamiento</label>
                    <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        style={{ marginBottom: "1rem" }}
                    />

                    <label htmlFor="nuevoNombre" className={styles.label}>Nuevo nombre (para editar)</label>
                    <input
                        type="text"
                        id="nuevoNombre"
                        name="nuevoNombre"
                        value={formData.nuevoNombre}
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

                <p style={{ marginTop: "2rem", fontStyle: "italic", color: "white" }}>
                    Para <strong>editar</strong>, se consulta internamente por el nombre actual del tratamiento
                    y se reemplaza con el nuevo nombre ingresado.
                </p>

                {consultaData && (
                    <div style={{
                        marginTop: "2rem",
                        backgroundColor: "white",
                        padding: "1rem",
                        borderRadius: "8px",
                        color: "#333",
                        maxWidth: "500px",
                        width: "100%"
                    }}>
                        <h2>Resultado de Consulta</h2>
                        <p><strong>Nombre del Tratamiento:</strong> {consultaData.treatment_name}</p>
                    </div>
                )}
            </main>
        </div>
    );
}

export default AdminTratamiento;
