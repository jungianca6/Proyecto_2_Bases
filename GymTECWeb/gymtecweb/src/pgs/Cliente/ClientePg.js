import React from "react";
import { Link } from "react-router-dom";
import styles from "./ClientePg.module.css";

function ClientePg() {
    const opciones = [
        { nombre: "Ver mi plan de trabajo", ruta: "/cliente/plantrabajo" }, ,
        { nombre: "Unirse a una clase", ruta: "/cliente/unionclase" }
    ];

    return (
        <div className={styles.container}>
            <nav className={styles.navbar}>
                <div className={styles.logo}>GymTEC - Cliente</div>
                <ul className={styles.navList}>
                    {opciones.map((opcion, index) => (
                        <li key={index} className={styles.navItem}>
                            <Link to={opcion.ruta} className={styles.navLink}>
                                {opcion.nombre}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            <main className={styles.main}>
                <h1 className={styles.welcome}>Bienvenido, Cliente</h1>
                <p className={styles.description}>Seleccione una opción del menú.</p>
            </main>
        </div>
    );
}

export default ClientePg;
