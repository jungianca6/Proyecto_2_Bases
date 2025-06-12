import React, { useState } from "react";
import styles from "./AdminPg.module.css";
import axios from "axios";


function AdminSucursal() {
    const [consultaData, setConsultaData] = useState(null);
    const [formData, setFormData] = useState({
        nombre: "",
        provincia: "",
        canton: "",
        distrito: "",
        fechaApertura: "",
        horario: "",
        administrador: "",
        capacidad: "",
        telefono1: "",
        telefono2: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (accion) => {
        const fecha = new Date(formData.fechaApertura);
        const fechaFormateada = fecha.toLocaleDateString("en-GB").replace(/\//g, "/") + " 09:00";

        let data = {};
        if (accion === "insertar" || accion === "editar") {
            data = {
                name: formData.nombre,
                province: formData.provincia,
                canton: formData.canton,
                district: formData.distrito,
                opening_date: fechaFormateada,
                attention_schedule: formData.horario,
                admin_employee: formData.administrador,
                max_capacity: parseInt(formData.capacidad),
                phone_numbers: [formData.telefono1, formData.telefono2],
                spa: false,
                store: false
            };
        } else if (accion === "eliminar" || accion === "consultar") {
            data = { name: formData.nombre };
        }

        let url = "";
        switch (accion) {
            case "insertar":
                url = "http://TU_BACKEND/sucursales/insertar";
                break;
            case "editar":
                url = "http://TU_BACKEND/sucursales/editar";
                break;
            case "eliminar":
                url = "http://TU_BACKEND/sucursales/eliminar";
                break;
            case "consultar":
                url = "http://TU_BACKEND/sucursales/consultar";
                break;
            default:
                console.error("Acción no válida");
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
                    alert("Sucursal no encontrada");
                }
            } else {
                alert(`Sucursal ${accion} correctamente`);
            }
        })
        .catch((err) => {
            console.error(`Error al ${accion}:`, err);
            alert(`Error al ${accion} sucursal`);
        });

    };


    return (
        <div className={styles.container}>
            <nav className={styles.navbar}>
                <div className={styles.logo}>GymTEC - Sucursales</div>
            </nav>

            <main className={styles.main}>
                <h1 className={styles.welcome}>Gestión de Sucursales</h1>
                <p style={{ marginBottom: "1.5rem", fontStyle: "italic", color: "white" }}>
                * Para las acciones de <strong>Eliminar</strong> y <strong>Consultar</strong>, solo es necesario ingresar el <strong>nombre de la sucursal</strong>.
                </p>
                <form className={styles.form}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                        {/* Columna izquierda */}
                        <div>
                        <label htmlFor="nombre" className={styles.label}>Nombre de la sucursal</label>
                        <input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} style={{ marginBottom: "1rem" }} />

                        <label htmlFor="provincia" className={styles.label}>Provincia</label>
                        <input type="text" id="provincia" name="provincia" value={formData.provincia} onChange={handleChange} style={{ marginBottom: "1rem" }} />

                        <label htmlFor="canton" className={styles.label}>Cantón</label>
                        <input type="text" id="canton" name="canton" value={formData.canton} onChange={handleChange} style={{ marginBottom: "1rem" }} />

                        <label htmlFor="distrito" className={styles.label}>Distrito</label>
                        <input type="text" id="distrito" name="distrito" value={formData.distrito} onChange={handleChange} style={{ marginBottom: "1rem" }} />

                        <label htmlFor="fechaApertura" className={styles.label}>Fecha de apertura</label>
                        <input type="date" id="fechaApertura" name="fechaApertura" value={formData.fechaApertura} onChange={handleChange} style={{ marginBottom: "1rem" }} />
                        </div>

                        {/* Columna derecha */}
                        <div>
                        <label htmlFor="horario" className={styles.label}>Horario de atención</label>
                        <input type="text" id="horario" name="horario" value={formData.horario} onChange={handleChange} style={{ marginBottom: "1rem" }} />

                        <label htmlFor="administrador" className={styles.label}>Empleado administrador</label>
                        <input type="text" id="administrador" name="administrador" value={formData.administrador} onChange={handleChange} style={{ marginBottom: "1rem" }} />

                        <label htmlFor="capacidad" className={styles.label}>Capacidad máxima</label>
                        <input type="number" id="capacidad" name="capacidad" value={formData.capacidad} onChange={handleChange} style={{ marginBottom: "1rem" }} />

                        <label htmlFor="telefono1" className={styles.label}>Teléfono 1</label>
                        <input type="tel" id="telefono1" name="telefono1" value={formData.telefono1} onChange={handleChange} style={{ marginBottom: "1rem" }} />

                        <label htmlFor="telefono2" className={styles.label}>Teléfono 2</label>
                        <input type="tel" id="telefono2" name="telefono2" value={formData.telefono2} onChange={handleChange} style={{ marginBottom: "1rem" }} />
                        </div>
                    </div>

                    <div className={styles.buttonRow} style={{ marginTop: "2rem" }}>
                        <button type="button" onClick={() => handleSubmit("insertar")}>Insertar</button>
                        <button type="button" onClick={() => handleSubmit("editar")}>Editar</button>
                        <button type="button" onClick={() => handleSubmit("eliminar")}>Eliminar</button>
                        <button type="button" onClick={() => handleSubmit("consultar")}>Consultar</button>
                    </div>
                    </form>
                    {consultaData && (
                        <div style={{ marginTop: "3rem", padding: "1rem", border: "1px solid #ccc", borderRadius: "8px", backgroundColor: "#f9f9f9" }}>
                            <h2>Resultado de Consulta</h2>
                            <p><strong>Nombre:</strong> {consultaData.name}</p>
                            <p><strong>Provincia:</strong> {consultaData.province}</p>
                            <p><strong>Cantón:</strong> {consultaData.canton}</p>
                            <p><strong>Distrito:</strong> {consultaData.district}</p>
                            <p><strong>Fecha de Apertura:</strong> {consultaData.opening_date}</p>
                            <p><strong>Horario:</strong> {consultaData.attention_schedule}</p>
                            <p><strong>Administrador:</strong> {consultaData.admin_employee}</p>
                            <p><strong>Capacidad Máxima:</strong> {consultaData.max_capacity}</p>
                            <p><strong>Teléfonos:</strong> {consultaData.phone_numbers.join(" / ")}</p>
                            <p><strong>Spa:</strong> {consultaData.spa ? "Activado" : "Desactivado"}</p>
                            <p><strong>Tienda:</strong> {consultaData.store ? "Activado" : "Desactivado"}</p>
                        </div>
                    )}

            </main>
        </div>
    );
}

export default AdminSucursal;
