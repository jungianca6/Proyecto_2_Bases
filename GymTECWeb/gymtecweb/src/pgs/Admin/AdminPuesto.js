import React, { useState } from "react";
import styles from "./AdminPg.module.css";
import axios from "axios";

function AdminPuesto() {
    const [consultaData, setConsultaData] = useState(null);
    const [formData, setFormData] = useState({
        nombre: "",
        descripcion: "",
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
                position_name: formData.nombre,
                description: formData.descripcion,
                position_id: formData.identificador
            };
        } else if (accion === "eliminar" || accion === "consultar") {
            data = {
                position_name: formData.nombre,
                description: "",
                position_id: ""
            };
        }

        let url = "";
        switch (accion) {
            case "insertar":
                url = "https://localhost:7155/Position/insert_position";
                break;
            case "editar":
                url = "https://localhost:7155/Position/edit_position";
                break;
            case "eliminar":
                url = "https://localhost:7155/Position/delete_position";
                break;
            case "consultar":
                url = "https://localhost:7155/Position/consult_position";
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
                        alert("Puesto no encontrado");
                    }
                } else {
                    alert(`Puesto ${accion} correctamente`);
                }
            })
            .catch((err) => {
                console.error(`Error al ${accion}:`, err);
                alert(`Error al ${accion} puesto`);
            });
    };

    return (
        <div className={styles.container}>
            <nav className={styles.navbar}>
                <div className={styles.logo}>GymTEC - Puestos</div>
            </nav>

            <main className={styles.main}>
                <h1 className={styles.welcome}>Gestión de Puestos</h1>

                <form className={styles.form}>
                    <label htmlFor="nombre" className={styles.label}>Nombre del puesto</label>
                    <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        style={{ marginBottom: "1rem" }}
                    />

                    <label htmlFor="descripcion" className={styles.label}>Descripción del puesto</label>
                    <input
                        type="text"
                        id="descripcion"
                        name="descripcion"
                        value={formData.descripcion}
                        onChange={handleChange}
                        style={{ marginBottom: "1rem" }}
                    />

                    <label htmlFor="identificador" className={styles.label}>Identificador único</label>
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
                    Para eliminar o consultar solo es necesario enviar el nombre del puesto.
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
                        <p><strong>Nombre del Puesto:</strong> {consultaData.position_name}</p>
                        <p><strong>Descripción:</strong> {consultaData.description}</p>
                        <p><strong>Identificador:</strong> {consultaData.position_id}</p>
                    </div>
                )}
            </main>
        </div>
    );
}

export default AdminPuesto;
