import React, { useState } from "react";
import styles from "./AdminPg.module.css";
import axios from "axios";

function AdminTienda() {
    const [consultaData, setConsultaData] = useState(null);
    const [formData, setFormData] = useState({
        nombreTienda: "",
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
                branch_name: formData.nombreSucursal,
                store_name: formData.nombreTienda,
                is_active: true // Activación automática
            };
        } else if (accion === "consultar") {
            data = {
                branch_name: formData.nombreSucursal,
            };
        } else if (accion === "eliminar") {
            data = {
                store_name: formData.nombreTienda,
            };
        }

        let url = "";
        switch (accion) {
            case "insertar":
                url = "https://gymtecbackend.azurewebsites.net/StoreProduct/insert_store";
                break;
            case "editar":
                url = "https://gymtecbackend.azurewebsites.net/StoreProduct/edit_store";
                break;
            case "consultar":
                url = "https://gymtecbackend.azurewebsites.net/StoreProduct/get/stores";
                break;
            case "eliminar":
                url = "https://gymtecbackend.azurewebsites.net/StoreProduct/delete/store";
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
                        alert("No se encontraron datos.");
                    }
                } else {
                    alert(`Tienda ${accion} correctamente`);
                }
            })
            .catch((err) => {
                console.error(`Error al ${accion}:`, err);
                alert(`Error al ${accion} tienda`);
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
                    <label htmlFor="nombreTienda" className={styles.label}>Nombre de tienda</label>
                    <input
                        type="text"
                        id="nombreTienda"
                        name="nombreTienda"
                        value={formData.nombreTienda}
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
                        <button type="button" onClick={() => handleSubmit("insertar")}>Crear</button>
                        <button type="button" onClick={() => handleSubmit("editar")}>Editar</button>
                        <button type="button" onClick={() => handleSubmit("eliminar")}>Eliminar</button>
                        <button type="button" onClick={() => handleSubmit("consultar")}>Consultar</button>
                    </div>
                </form>

                <p style={{ marginTop: "2rem", fontStyle: "italic", color: "white" }}>
                    Para eliminar una tienda, se requiere el nombre. Para consultas, se requiere el nombre de sucursal.
                </p>

                {consultaData && consultaData.length > 0 && (
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
                        {consultaData.map((tienda, index) => (
                            <div key={index} style={{ marginBottom: "1rem", borderBottom: "1px solid #ccc", paddingBottom: "1rem" }}>
                                <p><strong>Nombre de tienda:</strong> {tienda.name}</p>
                                <p><strong>Sucursal:</strong> {tienda.branch_name}</p>
                                <p><strong>Estado:</strong> {tienda.is_active ? "Activa" : "Inactiva"}</p>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

export default AdminTienda;
