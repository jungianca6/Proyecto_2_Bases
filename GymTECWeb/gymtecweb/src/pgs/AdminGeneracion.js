import React, { useState } from "react";
import axios from "axios";
import styles from "./AdminPg.module.css";

function AdminGeneracion() {
    const [formData, setFormData] = useState({
        nombreSucursal: "",
        tipoPago: "Mensual"
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        const data = {
            branch_name: formData.nombreSucursal,
            pay_type: formData.tipoPago
        };

        axios.post("http://TU_BACKEND_URL/planilla/generar", data)
            .then(() => {
                alert("Planilla generada exitosamente.");
            })
            .catch((err) => {
                console.error("Error al generar planilla:", err);
                alert("Hubo un error al generar la planilla.");
            });
    };

    return (
        <div className={styles.container}>
            <nav className={styles.navbar}>
                <div className={styles.logo}>GymTEC - Generación de Planilla</div>
            </nav>

            <main className={styles.main}>
                <h1 className={styles.welcome}>Generación de Planilla</h1>
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

                    <label htmlFor="tipoPago" className={styles.label}>Tipo de pago</label>
                    <select
                        id="tipoPago"
                        name="tipoPago"
                        value={formData.tipoPago}
                        onChange={handleChange}
                        style={{ marginBottom: "1rem" }}
                    >
                        <option value="Mensual">Mensual</option>
                        <option value="Por horas">Por horas</option>
                        <option value="Por clase">Por clase</option>
                    </select>

                    <div className={styles.buttonRow}>
                        <button type="button" onClick={handleSubmit}>Generar</button>
                    </div>
                </form>
            </main>
        </div>
    );
}

export default AdminGeneracion;
