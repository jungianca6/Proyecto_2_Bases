import React from "react";
import { Link } from "react-router-dom";
import styles from "./InstructorPg.module.css"; 

function InstructorPg() {
    const opciones = [
        { nombre: "Búsqueda de clientes", ruta: "/instructor/busqueda-clientes" },
        { nombre: "Asignarse a cliente", ruta: "/instructor/asignar-cliente" },
        { nombre: "Creación de plan de trabajo", ruta: "/instructor/crear-plan" },
    ];

    return (
        <div className={styles.container}>
            <nav className={styles.navbar}>
                <div className={styles.logo}>GymTEC - Instructor</div>
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
                <h1 className={styles.welcome}>Bienvenido, Instructor</h1>
                <p className={styles.description}>Seleccione una opción del menú.</p>
            </main>
        </div>
    );
}

export default InstructorPg;
