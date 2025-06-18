import React, { useState } from "react";
import styles from "./AdminPg.module.css";
import axios from "axios";

function AdminProducto() {
    const [consultaData, setConsultaData] = useState(null);
    const [formData, setFormData] = useState({
        nombre: "",
        codigoBarras: "",
        descripcion: "",
        costo: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (accion) => {
        let data = {};

        if (accion === "insertar" || accion === "editar") {
            data = {
                product_name: formData.nombre,
                barcode: formData.codigoBarras,
                description: formData.descripcion,
                cost: parseFloat(formData.costo)
            };
        } else if (accion === "eliminar" || accion === "consultar") {
            data = { barcode: formData.codigoBarras };
        }

        let url = "";
        switch (accion) {
            case "insertar":
                url = "http://TU_BACKEND/productos/insertar";
                break;
            case "editar":
                url = "http://TU_BACKEND/productos/editar";
                break;
            case "eliminar":
                url = "http://TU_BACKEND/productos/eliminar";
                break;
            case "consultar":
                url = "http://TU_BACKEND/productos/consultar";
                break;
            default:
                return;
        }

        axios.post(url, data)
            .then((res) => {
                if (accion === "consultar") {
                    if (res.data.status && res.data.data) {
                        setConsultaData(res.data.data);
                    } else {
                        setConsultaData(null);
                        alert("Producto no encontrado");
                    }
                } else {
                    alert(`Producto ${accion} correctamente`);
                }
            })
            .catch((err) => {
                console.error(`Error al ${accion}:`, err);
                alert(`Error al ${accion} producto`);
            });
    };

    return (
        <div className={styles.container}>
            <nav className={styles.navbar}>
                <div className={styles.logo}>GymTEC - Productos</div>
            </nav>

            <main className={styles.main}>
                <h1 className={styles.welcome}>Gestión de Productos</h1>
                <form className={styles.form}>
                    <label htmlFor="nombre" className={styles.label}>Nombre del producto</label>
                    <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        style={{ marginBottom: "1rem" }}
                    />

                    <label htmlFor="codigoBarras" className={styles.label}>Código del producto</label>
                    <input
                        type="text"
                        id="codigoBarras"
                        name="codigoBarras"
                        value={formData.codigoBarras}
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

                    <label htmlFor="costo" className={styles.label}>Costo</label>
                    <input
                        type="number"
                        id="costo"
                        name="costo"
                        value={formData.costo}
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
                    Para eliminar o consultar solo se necesita el código del producto.
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
                        <p><strong>Nombre:</strong> {consultaData.product_name}</p>
                        <p><strong>Código de barras:</strong> {consultaData.barcode}</p>
                        <p><strong>Descripción:</strong> {consultaData.description}</p>
                        <p><strong>Costo:</strong> ₡{consultaData.cost.toLocaleString()}</p>
                    </div>
                )}
            </main>
        </div>
    );
}

export default AdminProducto;
