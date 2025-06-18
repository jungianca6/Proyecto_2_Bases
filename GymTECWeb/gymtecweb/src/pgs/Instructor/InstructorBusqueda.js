import React, { useState } from "react";
import axios from "axios";
import styles from "./InstructorPg.module.css"; 

function InstructorBusqueda() {
    const [clientes, setClientes] = useState([]);
    const [loaded, setLoaded] = useState(false);

    const handleBuscar = async () => {
        try {
            const res = await axios.get("http://localhost:8000/clientes_sin_instructor");

            if (res.data.status && Array.isArray(res.data.data)) {
                setClientes(res.data.data);
                setLoaded(true);
            } else {
                alert("No se encontraron clientes.");
                setClientes([]);
                setLoaded(false);
            }
        } catch (err) {
            console.error(err);
            alert("Error al consultar los clientes.");
        }
    };

    return (
        <div className={styles.container}>
            <nav className={styles.navbar}>
                <div className={styles.logo}>GymTEC - Búsqueda de Clientes</div>
            </nav>

            <main className={styles.main}>
                <h1 className={styles.welcome}>Clientes sin instructor asignado</h1>

                <div className={styles.form}>
                    <div className={styles.buttonRow}>
                        <button type="button" className={styles.button} onClick={handleBuscar}>Buscar</button>
                    </div>
                </div>

                {loaded && (
                    <div className={styles.planContainer}>
                        {clientes.length === 0 ? (
                            <p className={styles.emptyMessage}>No hay clientes disponibles.</p>
                        ) : (
                            clientes.map((cliente, idx) => (
                                <div key={idx} className={styles.exerciseCard}>
                                    <p><strong>Nombre:</strong> {cliente.first_name}</p>
                                    <p><strong>Apellidos:</strong> {cliente.last_name_1} {cliente.last_name_2}</p>
                                    <p><strong>Cédula:</strong> {cliente.id_number}</p>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}

export default InstructorBusqueda;
