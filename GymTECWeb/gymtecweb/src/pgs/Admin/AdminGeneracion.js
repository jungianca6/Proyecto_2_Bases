import React, { useState } from "react";
import axios from "axios";
import styles from "./AdminPg.module.css";

function AdminGeneracion() {
    const [formData, setFormData] = useState({
        nombreSucursal: "",
        fechaInicio: "",
        fechaFin: ""
    });

    const [empleados, setEmpleados] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const formatDate = (fecha) => {
        if (!fecha) return "";
        const date = new Date(fecha);
        return date.toISOString().split("T")[0]; // YYYY-MM-DD
    };

    const handleSubmit = () => {
        const data = {
            branch_name: formData.nombreSucursal,
            description: "",
            start_date: formatDate(formData.fechaInicio),
            end_date: formatDate(formData.fechaFin)
        };

        axios.post("https://localhost:7155/Payroll/generate_payroll", data)
            .then((res) => {
                if (res.data.status && res.data.data && res.data.data.employees) {
                    setEmpleados(res.data.data.employees);
                    alert("Planilla generada exitosamente.");
                } else {
                    alert("Planilla generada pero no se encontraron empleados.");
                    setEmpleados([]);
                }
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

                    <label htmlFor="fechaInicio" className={styles.label}>Fecha de inicio</label>
                    <input
                        type="date"
                        id="fechaInicio"
                        name="fechaInicio"
                        value={formData.fechaInicio}
                        onChange={handleChange}
                        style={{ marginBottom: "1rem" }}
                    />

                    <label htmlFor="fechaFin" className={styles.label}>Fecha de fin</label>
                    <input
                        type="date"
                        id="fechaFin"
                        name="fechaFin"
                        value={formData.fechaFin}
                        onChange={handleChange}
                        style={{ marginBottom: "1rem" }}
                    />

                    <div className={styles.buttonRow}>
                        <button type="button" onClick={handleSubmit}>Generar</button>
                    </div>
                </form>

                {empleados.length > 0 && (
                    <div className={styles.resultContainer}>
                        <h2 className={styles.resultTitle}>Empleados generados en la planilla</h2>
                        <ul className={styles.resultList}>
                            {empleados.map((emp, index) => (
                                <li key={index} className={styles.resultItem}>
                                    <strong>Nombre:</strong> {emp.full_name} <br />
                                    <strong>Tipo:</strong> {emp.type} <br />
                                    <strong>Clases/Horas:</strong> {emp.classes_or_hours} <br />
                                    <strong>Monto a pagar:</strong> ₡{emp.amount_to_pay}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </main>
        </div>
    );
}

export default AdminGeneracion;
