import React, { useState } from "react";
import styles from "./AdminPg.module.css";
import axios from "axios";

function AdminEquipo() {
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
                name: formData.identificador,
                description: formData.descripcion
            };
        } else if (accion === "eliminar" || accion === "consultar") {
            data = {
                name: formData.identificador,
                description: ""
            };
        }

        let url = "";
        switch (accion) {
            case "insertar":
                url = "https://gymtecbackend.azurewebsites.net/EquipmentType/insert_or_edit";
                break;
            case "editar":
                url = "https://gymtecbackend.azurewebsites.net/EquipmentType/insert_or_edit";
                break;
            case "eliminar":
                url = "https://gymtecbackend.azurewebsites.net/EquipmentType/delete";
                break;
            case "consultar":
                url = "https://gymtecbackend.azurewebsites.net/EquipmentType/get";
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
                        alert("Tipo de equipo no encontrado");
                    }
                } else {
                    alert(`Tipo de equipo ${accion} correctamente`);
                }
            })
            .catch((err) => {
                console.error(`Error al ${accion}:`, err);
                alert(`Error al ${accion} tipo de equipo`);
            });
    };

    return (
        <div className={styles.container}>
            <nav className={styles.navbar}>
                <div className={styles.logo}>GymTEC - Tipos de Equipo</div>
            </nav>

            <main className={styles.main}>
                <h1 className={styles.welcome}>Gestión de Tipos de Equipo</h1>
                <form className={styles.form}>
                    <label htmlFor="identificador" className={styles.label}>Nombre del tipo de equipo</label>
                    <input
                        type="text"
                        id="identificador"
                        name="identificador"
                        value={formData.identificador}
                        onChange={handleChange}
                        style={{ marginBottom: "1rem" }}
                    />

                    <label htmlFor="descripcion" className={styles.label}>Descripción del tipo</label>
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
                    Para eliminar o consultar solo se necesita ingresar el nombre del tipo de equipo.
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
                        <p><strong>Nombre:</strong> {consultaData.name}</p>
                        <p><strong>Descripción:</strong> {consultaData.description}</p>
                    </div>
                )}
            </main>
        </div>
    );
}

export default AdminEquipo;
