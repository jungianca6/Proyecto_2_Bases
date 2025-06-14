import React, { useState } from "react";
import axios from "axios";
import styles from "./AdminPg.module.css";

function AdminAsociacionTratamiento() {
    const [formData, setFormData] = useState({
        nombreSucursal: "",
        identificador: ""
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
                treatment_id: parseInt(formData.identificador),
                branch_name: formData.nombreSucursal
            };

            axios.post("http://TU_BACKEND/asociacion_tratamiento/agregar", data)
                .then(res => {
                    alert("Tratamiento agregado correctamente");
                })
                .catch(err => {
                    console.error("Error al agregar:", err);
                    alert("Error al agregar tratamiento");
                });

        } else if (accion === "Ver tratamientos") {
            const data = { branch_name: formData.nombreSucursal };

            axios.post("http://TU_BACKEND/asociacion_tratamiento/consultar", data)
                .then(res => {
                    if (res.data.status && res.data.data) {
                        setAsociados(res.data.data.associated || []);
                        setNoAsociados(res.data.data.not_associated || []);
                    } else {
                        alert("No se encontraron tratamientos.");
                        setAsociados([]);
                        setNoAsociados([]);
                    }
                })
                .catch(err => {
                    console.error("Error al consultar:", err);
                    alert("Error al consultar tratamientos");
                });
        }
    };

    return (
        <div className={styles.container}>
            <nav className={styles.navbar}>
                <div className={styles.logo}>GymTEC - Asociación de tratamientos</div>
            </nav>

            <main className={styles.main}>
                <h1 className={styles.welcome}>Asociación de Tratamientos de Spa</h1>
                <form className={styles.form}>
                    <label htmlFor="identificador" className={styles.label}>Identificador de tratamiento</label>
                    <input
                        type="number"
                        id="identificador"
                        name="identificador"
                        value={formData.identificador}
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
                        <button type="button" onClick={() => handleSubmit("Agregar")}>Agregar</button>
                        <button type="button" onClick={() => handleSubmit("Ver tratamientos")}>Ver tratamientos</button>
                    </div>
                </form>

                {(asociados.length > 0 || noAsociados.length > 0) && (
                    <div style={{ marginTop: "3rem", textAlign: "left", color: "white" }}>
                        <h2>Tratamientos Asociados</h2>
                        {asociados.length > 0 ? (
                            <ul>
                                {asociados.map(t => (
                                    <li key={t.treatment_id}>
                                        {t.treatment_name} (ID: {t.treatment_id})
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No hay tratamientos asociados.</p>
                        )}

                        <h2>Tratamientos No Asociados</h2>
                        {noAsociados.length > 0 ? (
                            <ul>
                                {noAsociados.map(t => (
                                    <li key={t.treatment_id}>
                                        {t.treatment_name} (ID: {t.treatment_id})
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No hay tratamientos no asociados.</p>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}

export default AdminAsociacionTratamiento;
