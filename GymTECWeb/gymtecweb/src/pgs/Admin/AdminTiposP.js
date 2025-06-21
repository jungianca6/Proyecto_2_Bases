import React, { useState } from "react";
import styles from "./AdminPg.module.css";
import axios from "axios";

function AdminTiposP() {
    const [formData, setFormData] = useState({
        descripcion: "",
        nombrePuesto: "",   
        pagoMensual: "",
        pagoHora: "",
        pagoClase: ""
    });

    const [consultaData, setConsultaData] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (accion) => {
        let data = {};

        if (accion === "insertar" || accion === "editar") {
            data = {
                description: formData.descripcion,
                puesto: formData.nombrePuesto, 
                monthly_payment: parseFloat(formData.pagoMensual),
                hourly_payment: parseFloat(formData.pagoHora),
                group_class_payment: parseFloat(formData.pagoClase)
            };
        } else if (accion === "eliminar" || accion === "consultar") {
            data = {
                puesto: formData.nombrePuesto 
            };
        }

        let url = "";
        switch (accion) {
            case "insertar":
                url = "https://localhost:7155/Payroll/manage_payroll_type";
                break;
            case "editar":
                url = "https://localhost:7155/Payroll/manage_payroll_type";
                break;
            case "eliminar":
                url = "https://localhost:7155/Payroll/delete_payroll_type";
                break;
            case "consultar":
                url = "https://localhost:7155/Payroll/get_payroll_type";
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
                        alert("Tipo de planilla no encontrado.");
                    }
                } else {
                    alert(`Tipo de planilla ${accion} correctamente.`);
                }
            })
            .catch((err) => {
                console.error(`Error al ${accion}:`, err);
                alert(`Error al ${accion} tipo de planilla.`);
            });
    };

    return (
        <div className={styles.container}>
            <nav className={styles.navbar}>
                <div className={styles.logo}>GymTEC - Tipos de Planilla</div>
            </nav>

            <main className={styles.main}>
                <h1 className={styles.welcome}>Gestión de Tipos de Planilla</h1>
                <form className={styles.form}>
                    <label htmlFor="descripcion" className={styles.label}>Descripción</label>
                    <input
                        type="text"
                        id="descripcion"
                        name="descripcion"
                        value={formData.descripcion}
                        onChange={handleChange}
                    />

                    <label htmlFor="nombrePuesto" className={styles.label}>Nombre de Puesto</label>
                    <input
                        type="text"
                        id="nombrePuesto"
                        name="nombrePuesto"
                        value={formData.nombrePuesto}
                        onChange={handleChange}
                    />

                    <label htmlFor="pagoMensual" className={styles.label}>Pago mensual</label>
                    <input
                        type="number"
                        id="pagoMensual"
                        name="pagoMensual"
                        value={formData.pagoMensual}
                        onChange={handleChange}
                    />

                    <label htmlFor="pagoHora" className={styles.label}>Pago por hora</label>
                    <input
                        type="number"
                        id="pagoHora"
                        name="pagoHora"
                        value={formData.pagoHora}
                        onChange={handleChange}
                    />

                    <label htmlFor="pagoClase" className={styles.label}>Pago por clase</label>
                    <input
                        type="number"
                        id="pagoClase"
                        name="pagoClase"
                        value={formData.pagoClase}
                        onChange={handleChange}
                    />

                    <div className={styles.buttonRow}>
                        <button type="button" onClick={() => handleSubmit("insertar")}>Insertar</button>
                        <button type="button" onClick={() => handleSubmit("editar")}>Editar</button>
                        <button type="button" onClick={() => handleSubmit("eliminar")}>Eliminar</button>
                        <button type="button" onClick={() => handleSubmit("consultar")}>Consultar</button>
                    </div>
                </form>

                <p style={{ marginTop: "2rem", fontStyle: "italic", color: "white" }}>
                    Para eliminar o consultar solo se necesita ingresar el nombre del puesto.
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
                        <p><strong>Nombre del Puesto:</strong> {consultaData.job_name}</p>
                        <p><strong>Descripción:</strong> {consultaData.description}</p>
                    </div>
                )}
            </main>
        </div>
    );
}

export default AdminTiposP;
