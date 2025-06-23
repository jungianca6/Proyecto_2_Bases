import React, { useState } from "react";
import styles from "./AdminPg.module.css";
import axios from "axios";

function AdminInventario() {
    const [consultaData, setConsultaData] = useState(null);
    const [formData, setFormData] = useState({
        tipoEquipo: "",
        marca: "",
        numeroSerie: "",
        costo: "",
        nombreSucursal: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (accion) => {
        let data = {};

        if (accion === "insertar" || accion === "editar") {
            data = {
                equipment_type: formData.tipoEquipo,
                brand: formData.marca,
                serial_number: formData.numeroSerie,
                cost: parseFloat(formData.costo),
                branch_name: formData.nombreSucursal
            };
        } else if (accion === "eliminar" || accion === "consultar") {
            data = {
                equipment_type: "",
                brand: "",
                serial_number: formData.numeroSerie,
                cost: 0,
                branch_name: ""
            };
        }

        let url = "";
        switch (accion) {
            case "insertar":
                url = "https://gymtecbackend.azurewebsites.net/Inventory/insert_or_edit";
                break;
            case "editar":
                url = "https://gymtecbackend.azurewebsites.net/Inventory/insert_or_edit";
                break;
            case "eliminar":
                url = "https://gymtecbackend.azurewebsites.net/Inventory/delete";
                break;
            case "consultar":
                url = "https://gymtecbackend.azurewebsites.net/Inventory/get";
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
                        alert("Equipo no encontrado");
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
                <div className={styles.logo}>GymTEC - Inventario</div>
            </nav>

            <main className={styles.main}>
                <h1 className={styles.welcome}>Gestión de Inventario</h1>
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

export default AdminInventario;
