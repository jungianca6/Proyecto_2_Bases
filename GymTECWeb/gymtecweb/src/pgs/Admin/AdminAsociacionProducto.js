import React, { useState } from "react";
import axios from "axios";
import styles from "./AdminPg.module.css";

function AdminAsociacionProducto() {
    const [formData, setFormData] = useState({
        nombreSucursal: "",
        codigoBarras: "",
        amaunt: 0
    });

    const [asociados, setAsociados] = useState([]);
    const [noAsociados, setNoAsociados] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (accion) => {
        if (accion === "Agregar") {
            const data = {
                barcode: formData.codigoBarras,
                store_name: formData.nombreSucursal,
                date: new Date().toISOString().split("T")[0], // formato YYYY-MM-DD
                amaunt: parseInt(formData.amaunt)
            };

            axios.post("https://localhost:7155/StoreProduct/associate_store_product", data)
                .then(() => {
                    alert("Producto agregado correctamente.");
                })
                .catch((err) => {
                    console.error("Error al agregar:", err);
                    alert("Error al agregar el producto.");
                });
        } else if (accion === "Productos asociados") {
            const data = {
                store_name: formData.nombreSucursal
            };

            axios.post("https://localhost:7155/StoreProduct/consult_store_products", data)
                .then((res) => {
                    if (res.data.status && res.data.data) {
                        setAsociados(res.data.data.associated_products || []);
                        setNoAsociados(res.data.data.non_associated_products || []);
                    } else {
                        alert("No se encontraron productos.");
                        setAsociados([]);
                        setNoAsociados([]);
                    }
                })
                .catch((err) => {
                    console.error("Error al consultar productos:", err);
                    alert("Error al consultar productos.");
                });
        }
    };

    return (
        <div className={styles.container}>
            <nav className={styles.navbar}>
                <div className={styles.logo}>GymTEC - Asociación de productos</div>
            </nav>

            <main className={styles.main}>
                <h1 className={styles.welcome}>Asociación de productos a tienda del gimnasio</h1>
                <form className={styles.form}>
                    <label htmlFor="nombreSucursal" className={styles.label}>Nombre de la tienda</label>
                    <input
                        type="text"
                        id="nombreSucursal"
                        name="nombreSucursal"
                        value={formData.nombreSucursal}
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

                    <label htmlFor="amaunt" className={styles.label}>Cantidad disponible</label>
                    <input
                        type="number"
                        id="amaunt"
                        name="amaunt"
                        value={formData.amaunt}
                        onChange={handleChange}
                        min={0}
                        style={{ marginBottom: "1rem" }}
                    />

                    <div className={styles.buttonRow}>
                        <button type="button" onClick={() => handleSubmit("Agregar")}>Agregar</button>
                        <button type="button" onClick={() => handleSubmit("Productos asociados")}>Ver productos asociados</button>
                    </div>
                </form>

                {(asociados.length > 0 || noAsociados.length > 0) && (
                    <div style={{ marginTop: "3rem", color: "white", textAlign: "left" }}>
                        <h2>Productos Asociados</h2>
                        {asociados.length > 0 ? (
                            <ul>
                                {asociados.map((producto) => (
                                    <li key={producto.barcode}>
                                        {producto.product_name} (Código: {producto.barcode})
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No hay productos asociados.</p>
                        )}

                        <h2>Productos No Asociados</h2>
                        {noAsociados.length > 0 ? (
                            <ul>
                                {noAsociados.map((producto) => (
                                    <li key={producto.barcode}>
                                        {producto.product_name} (Código: {producto.barcode})
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No hay productos no asociados.</p>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}

export default AdminAsociacionProducto;
