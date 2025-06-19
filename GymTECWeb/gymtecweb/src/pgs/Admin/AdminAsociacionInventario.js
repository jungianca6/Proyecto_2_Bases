import React, { useState } from "react";
import axios from "axios";
import styles from "./AdminPg.module.css";

function AdminAsociacionInventario() {
    const [formData, setFormData] = useState({
        nombreSucursal: "",
        numeroSerie: ""
    });

    const [asociadas, setAsociadas] = useState([]);
    const [noAsociadas, setNoAsociadas] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (accion) => {
        if (accion === "Agregar") {
            const data = {
                serial_number: formData.numeroSerie,
                branch_name: formData.nombreSucursal
            };

            axios.post("https://localhost:7155/Inventory/associate_machine", data)
                .then(() => {
                    alert("Máquina asociada correctamente.");
                })
                .catch((err) => {
                    console.error("Error al asociar máquina:", err);
                    alert("Error al asociar la máquina.");
                });

        } else if (accion === "Máquinas asociadas") {
            const data = {
                branch_name: formData.nombreSucursal
            };

            axios.post("https://localhost:7155/Inventory/consult_machines_by_branch", data)
                .then((res) => {
                    if (res.data.status && res.data.data) {
                        setAsociadas(res.data.data.associated_machines || []);
                        setNoAsociadas(res.data.data.not_associated_machines || []);
                    } else {
                        alert("No se encontraron máquinas.");
                        setAsociadas([]);
                        setNoAsociadas([]);
                    }
                })
                .catch((err) => {
                    console.error("Error al consultar inventario:", err);
                    alert("Error al consultar el inventario.");
                });
        }
    };

    return (
        <div className={styles.container}>
            <nav className={styles.navbar}>
                <div className={styles.logo}>GymTEC - Asociación de inventario</div>
            </nav>

            <main className={styles.main}>
                <h1 className={styles.welcome}>Asociación de inventario de gimnasios</h1>
                <form className={styles.form}>
                    <label htmlFor="nombreSucursal" className={styles.label}>Nombre de sucursal</label>
                    <input
                        type="text"
                        id="nombreSucursal"
                        name="nombreSucursal"
                        value={formData.nombreSucursal}
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

                    <div className={styles.buttonRow}>
                        <button type="button" onClick={() => handleSubmit("Agregar")}>Agregar</button>
                        <button type="button" onClick={() => handleSubmit("Máquinas asociadas")}>Ver máquinas asociadas</button>
                    </div>
                </form>

                {(asociadas.length > 0 || noAsociadas.length > 0) && (
                    <div style={{ marginTop: "2rem", color: "white", textAlign: "left" }}>
                        <h2>Máquinas Asociadas</h2>
                        {asociadas.length > 0 ? (
                            <ul>
                                {asociadas.map((maq) => (
                                    <li key={maq.serial_number}>
                                        {maq.brand} - {maq.model} (Serie: {maq.serial_number})
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No hay máquinas asociadas.</p>
                        )}

                        <h2>Máquinas No Asociadas</h2>
                        {noAsociadas.length > 0 ? (
                            <ul>
                                {noAsociadas.map((maq) => (
                                    <li key={maq.serial_number}>
                                        {maq.brand} - {maq.model} (Serie: {maq.serial_number})
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No hay máquinas no asociadas.</p>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}

export default AdminAsociacionInventario;
