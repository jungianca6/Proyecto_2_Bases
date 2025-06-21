import React, { useState } from "react";
import styles from "./AdminPg.module.css";
import axios from "axios";

function AdminTienda() {
    const [consultaData, setConsultaData] = useState(null);
    const [formData, setFormData] = useState({

    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (accion) => {
        let data = {};

        if (accion === "insertar" || accion === "editar") {
            data = {

            };
        } else if (accion === "eliminar" || accion === "consultar") {
            data = {

            };
        }

        let url = "";
        switch (accion) {
            case "insertar":
                url = "";
                break;
            case "editar":
                url = "";
                break;
            case "eliminar":
                url = "";
                break;
            case "consultar":
                url = "";
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
                        console.log("Datos recibidos del backend:", res.data);
                    } else {
                        setConsultaData(null);
                        alert("");
                    }
                } else {
                    alert(`Equipo ${accion} correctamente`);
                }
            })
            .catch((err) => {
                console.error(`Error al ${accion}:`, err);
                alert(`Error al ${accion} equipo`);
            });
    };

    return (
        <div className={styles.container}>
            <nav className={styles.navbar}>
                <div className={styles.logo}>GymTEC - Tiendas</div>
            </nav>

            <main className={styles.main}>
                <h1 className={styles.welcome}>Gestión de tiendas</h1>
                <form className={styles.form}>
                    <label htmlFor="tipoEquipo" className={styles.label}>Tipo de equipo</label>
                    <input
                        type="text"
                        id="tipoEquipo"
                        name="tipoEquipo"
                        value={formData.tipoEquipo}
                        onChange={handleChange}
                        style={{ marginBottom: "1rem" }}
                    />

                    <label htmlFor="marca" className={styles.label}>Marca</label>
                    <input
                        type="text"
                        id="marca"
                        name="marca"
                        value={formData.marca}
                        onChange={handleChange}
                        style={{ marginBottom: "1rem" }}
                    />

                    <label htmlFor="numeroSerie" className={styles.label}>Número de serie</label>
                    <input
                        type="text"
                        id="numeroSerie"
                        name="numeroSerie"
                        value={formData.numeroSerie}
                        onChange={handleChange}
                        style={{ marginBottom: "1rem" }}
                    />

                    <label htmlFor="costo" className={styles.label}>Costo</label>
                    <input
                        type="number"
                        id="costo"
                        name="costo"
                        value={formData.costo}
                        onChange={handleChange}
                        style={{ marginBottom: "1rem" }}
                    />

                    <label htmlFor="nombreSucursal" className={styles.label}>Nombre de sucursal</label>
                    <input
                        type="text"
                        id="nombreSucursal"
                        name="nombreSucursal"
                        value={formData.nombreSucursal}
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
                    Para eliminar o consultar solo se necesita el número de serie del equipo.
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
                        <p><strong>Tipo de equipo:</strong> {consultaData.equipment_type}</p>
                        <p><strong>Marca:</strong> {consultaData.brand}</p>
                        <p><strong>Número de serie:</strong> {consultaData.serial_number}</p>
                        <p><strong>Costo:</strong> ₡{consultaData.cost.toLocaleString()}</p>
                        <p><strong>Sucursal:</strong> {consultaData.branch_name}</p>
                    </div>
                )}
            </main>
        </div>
    );
}

export default AdminTienda;
