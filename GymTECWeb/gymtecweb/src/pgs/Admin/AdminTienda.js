import React, { useState } from "react";
import styles from "./AdminPg.module.css";
import axios from "axios";

function AdminTienda() {
    const [consultaData, setConsultaData] = useState(null);
    const [formData, setFormData] = useState({
        nombreTienda: "",
        nombreSucursal: "",
        is_active: false
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const val = type === "checkbox" ? checked : value;
        setFormData((prev) => ({ ...prev, [name]: val }));
    };

    const handleSubmit = (accion) => {
        let data = {};

        if (accion === "insertar" || accion === "editar") {
            data = {
                branch_name: formData.nombreSucursal,
                store_name: formData.nombreTienda,
                is_active: formData.is_active,
            };
        } else if (accion === "consultar") {
            data = {
                branch_name: formData.nombreSucursal,
            };
        }else if (accion === "eliminar") {
            data = {
                store_name: formData.nombreTienda,
            };
        }

        let url = "";
        switch (accion) {
            case "insertar":
                url = "https://localhost:7155/StoreProduct/insert_store";
                break;
            case "editar":
                url = "https://localhost:7155/StoreProduct/edit_store";
                break;
            case "consultar":
                url = "https://localhost:7155/StoreProduct/get/stores";
                break;
            case "eliminar":
                url = "https://localhost:7155/StoreProduct/delete/store";
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

                    <label className={styles.label}>
                        <input
                            type="checkbox"
                            name="is_active"
                            checked={formData.is_active}
                            onChange={handleChange}
                            style={{ marginRight: "0.5rem" }}
                        />
                        ¿Está activa?
                    </label>

                    <div className={styles.buttonRow}>
                        <button type="button" onClick={() => handleSubmit("crear")}>Crear</button>
                        <button type="button" onClick={() => handleSubmit("editar")}>Editar</button>
                        <button type="button" onClick={() => handleSubmit("eliminar")}>Eliminar</button>
                        <button type="button" onClick={() => handleSubmit("consultar")}>Consultar</button>
                    </div>
                </form>

                <p style={{ marginTop: "2rem", fontStyle: "italic", color: "white" }}>
                    Para eliminar una tienda, se requiere el nombre. Para consultas, se requiere el nombre de sucursal
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
                        <p><strong>ID de tienda:</strong> {consultaData.store_id}</p>
                        <p><strong>Nombre de tienda:</strong> {consultaData.store_name}</p>
                        <p><strong>Sucursal:</strong> {consultaData.branch_name}</p>
                        <p><strong>Estado:</strong> {consultaData.is_active ? "Activa" : "Inactiva"}</p>
                    </div>
                )}
            </main>
        </div>
    );
}

export default AdminTienda;
