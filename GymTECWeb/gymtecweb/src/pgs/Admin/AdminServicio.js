import React, { useState } from "react";
import styles from "./AdminPg.module.css";
import axios from "axios";

function AdminServicio() {
    const [consultaData, setConsultaData] = useState(null);
    const [formData, setFormData] = useState({
        identificador: "",
        descripcion: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (accion) => {
        let data = {};

        if (accion === "insertar" || accion === "editar") {
            data = {
                service_id: formData.identificador,
                description: formData.descripcion
            };
        } else if (accion === "eliminar" || accion === "consultar") {
            data = { service_id: formData.identificador };
        }

        let url = "";
        switch (accion) {
            case "insertar":
                url = "http://TU_BACKEND/servicios/insertar";
                break;
            case "editar":
                url = "http://TU_BACKEND/servicios/editar";
                break;
            case "eliminar":
                url = "http://TU_BACKEND/servicios/eliminar";
                break;
            case "consultar":
                url = "http://TU_BACKEND/servicios/consultar";
                break;
            default:
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
                        alert("Servicio no encontrado");
                    }
                } else {
                    alert(`Servicio ${accion} correctamente`);
                }
            })
            .catch((err) => {
                console.error(`Error al ${accion}:`, err);
                alert(`Error al ${accion} servicio`);
            });
    };

    return (
        <div className={styles.container}>
            <nav className={styles.navbar}>
                <div className={styles.logo}>GymTEC - Servicios</div>
            </nav>

            <main className={styles.main}>
                <h1 className={styles.welcome}>Gestión de Servicios</h1>
                <form className={styles.form}>
                    <label htmlFor="identificador" className={styles.label}>Identificador único</label>
                    <input
                        type="text"
                        id="identificador"
                        name="identificador"
                        value={formData.identificador}
                        onChange={handleChange}
                        style={{ marginBottom: "1rem" }}
                    />

                    <label htmlFor="descripcion" className={styles.label}>Descripción</label>
                    <input
                        type="text"
                        id="descripcion"
                        name="descripcion"
                        value={formData.descripcion}
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
                    Para eliminar o consultar solo se necesita ingresar el identificador del servicio.
                </p>

                {consultaData && (
                    <div style={{
                        marginTop: "2rem",
                        backgroundColor: "white",
                        padding: "1rem",
                        borderRadius: "8px",
                        color: "#333",
                        maxWidth: "600px",
                        width: "100%"
                    }}>
                        <h2>Resultado de Consulta</h2>
                        <p><strong>Identificador:</strong> {consultaData.service_id}</p>
                        <p><strong>Descripción:</strong> {consultaData.description}</p>
                    </div>
                )}
            </main>
        </div>
    );
}

export default AdminServicio;
