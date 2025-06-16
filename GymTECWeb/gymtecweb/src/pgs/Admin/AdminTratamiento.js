import React, { useState } from "react";
import styles from "./AdminPg.module.css";
import axios from "axios";

function AdminTratamiento() {
    const [consultaData, setConsultaData] = useState(null);
    const [formData, setFormData] = useState({
        nombre: "",
        identificador: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (accion) => {
        let data = {};
        if (accion === "insertar" || accion === "editar") {
            data = {
                treatment_name: formData.nombre,
                treatment_id: formData.identificador
            };
        } else if (accion === "eliminar" || accion === "consultar") {
            data = {
                treatment_id: formData.identificador
            };
        }

        let url = "";
        switch (accion) {
            case "insertar":
                url = "http://TU_BACKEND/tratamientos/insertar";
                break;
            case "editar":
                url = "http://TU_BACKEND/tratamientos/editar";
                break;
            case "eliminar":
                url = "http://TU_BACKEND/tratamientos/eliminar";
                break;
            case "consultar":
                url = "http://TU_BACKEND/tratamientos/consultar";
                break;
            default:
                console.error("Acción no válida");
                return;
        }

        axios.post(url, data)
            .then((res) => {
                console.log(`Acción ${accion} exitosa:`, res.data);
                if (accion === "consultar") {
                    if (res.data.status && res.data.data) {
                        setConsultaData(res.data.data);
                    } else {
                        setConsultaData(null);
                        alert("Tratamiento no encontrado");
                    }
                } else {
                    alert(`Tratamiento ${accion} correctamente`);
                }
            })
            .catch((err) => {
                console.error(`Error al ${accion}:`, err);
                alert(`Error al ${accion} tratamiento`);
            });
    };

    return (
        <div className={styles.container}>
            <nav className={styles.navbar}>
                <div className={styles.logo}>GymTEC - Tratamientos</div>
            </nav>

            <main className={styles.main}>
                <h1 className={styles.welcome}>Gestión de Tratamientos de Spa</h1>

                <form className={styles.form}>
                    <label htmlFor="nombre" className={styles.label}>Nombre del tratamiento</label>
                    <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        style={{ marginBottom: "1rem" }}
                    />

                    <label htmlFor="identificador" className={styles.label}>Identificador del tratamiento</label>
                    <input
                        type="text"
                        id="identificador"
                        name="identificador"
                        value={formData.identificador}
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
                    Para eliminar o consultar solo es necesario enviar el identificador del tratamiento.
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
                        <p><strong>Identificador:</strong> {consultaData.treatment_id}</p>
                    </div>
                )}
            </main>
        </div>
    );
}

export default AdminTratamiento;
