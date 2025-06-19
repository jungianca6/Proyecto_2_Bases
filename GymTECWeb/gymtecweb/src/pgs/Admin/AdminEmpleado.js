import React, { useState } from "react";
import styles from "./AdminPg.module.css";
import axios from "axios";

function AdminEmpleado() {
  const [consultaData, setConsultaData] = useState(null);
  const [formData, setFormData] = useState({
    cedula: "",
    nombre: "",
    provincia: "",
    canton: "",
    distrito: "",
    puesto: "",
    sucursal: "",
    planillaID: "",
    salario: "",
    correo: "",
    contrasena: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (accion) => {
    let data = {};

    if (accion === "insertar" || accion === "editar") {
      data = {
        employee_id: formData.cedula,
        full_name: formData.nombre,
        province: formData.provincia,
        canton: formData.canton,
        district: formData.distrito,
        position: formData.puesto,
        branch: formData.sucursal,
        payroll_id: formData.planillaID,
        salary: parseFloat(formData.salario),
        email: formData.correo,
        password: formData.contrasena
      };
    } else if (accion === "eliminar" || accion === "consultar") {
      data = {
        employee_id: formData.cedula,
        full_name: "",
        province: "",
        canton: "",
        district: "",
        position: "",
        branch: "",
        payroll_id: 0,
        salary: 0,
        email: "",
        password: "" };
    }

    let url = "";
    switch (accion) {
      case "insertar":
        url = "https://localhost:7155/Employee/insert";
        break;
      case "editar":
        url = "https://localhost:7155/Employee/edit_employee";
        break;
      case "eliminar":
        url = "https://localhost:7155/Employee/delete";
        break;
      case "consultar":
        url = "https://localhost:7155/Employee/get";
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
            alert("Empleado no encontrado");
          }
        } else {
          alert(`Empleado ${accion} correctamente`);
        }
      })
      .catch((err) => {
        console.error(`Error al ${accion}:`, err);
        alert(`Error al ${accion} empleado`);
      });
  };

  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        <div className={styles.logo}>GymTEC - Empleados</div>
      </nav>

      <main className={styles.main}>
        <h1 className={styles.welcome}>Gestión de Empleados</h1>

        <form className={styles.form}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            {/* Columna izquierda */}
            <div>
              <label htmlFor="cedula" className={styles.label}>Número de cédula</label>
              <input id="cedula" name="cedula" value={formData.cedula} onChange={handleChange} style={{ marginBottom: "1rem" }} />

              <label htmlFor="nombre" className={styles.label}>Nombre completo</label>
              <input id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} style={{ marginBottom: "1rem" }} />

              <label htmlFor="provincia" className={styles.label}>Provincia</label>
              <input id="provincia" name="provincia" value={formData.provincia} onChange={handleChange} style={{ marginBottom: "1rem" }} />

              <label htmlFor="canton" className={styles.label}>Cantón</label>
              <input id="canton" name="canton" value={formData.canton} onChange={handleChange} style={{ marginBottom: "1rem" }} />

              <label htmlFor="distrito" className={styles.label}>Distrito</label>
              <input id="distrito" name="distrito" value={formData.distrito} onChange={handleChange} style={{ marginBottom: "1rem" }} />
            </div>

            {/* Columna derecha */}
            <div>
              <label htmlFor="puesto" className={styles.label}>Puesto que desempeña</label>
              <input id="puesto" name="puesto" value={formData.puesto} onChange={handleChange} style={{ marginBottom: "1rem" }} />

              <label htmlFor="sucursal" className={styles.label}>Sucursal asignada</label>
              <input id="sucursal" name="sucursal" value={formData.sucursal} onChange={handleChange} style={{ marginBottom: "1rem" }} />

              <label htmlFor="planillaID" className={styles.label}>ID del Tipo de planilla</label>
              <input id="planillaID" name="planillaID" value={formData.planillaID} onChange={handleChange} style={{ marginBottom: "1rem" }} />

              <label htmlFor="salario" className={styles.label}>Salario</label>
              <input id="salario" name="salario" type="number" value={formData.salario} onChange={handleChange} style={{ marginBottom: "1rem" }} />

              <label htmlFor="correo" className={styles.label}>Correo electrónico</label>
              <input id="correo" name="correo" type="email" value={formData.correo} onChange={handleChange} style={{ marginBottom: "1rem" }} />

              <label htmlFor="contrasena" className={styles.label}>Contraseña</label>
              <input id="contrasena" name="contrasena" type="password" value={formData.contrasena} onChange={handleChange} style={{ marginBottom: "1rem" }} />
            </div>
          </div>

          <div className={styles.buttonRow} style={{ marginTop: "2rem" }}>
            <button type="button" onClick={() => handleSubmit("insertar")}>Insertar</button>
            <button type="button" onClick={() => handleSubmit("editar")}>Editar</button>
            <button type="button" onClick={() => handleSubmit("eliminar")}>Eliminar</button>
            <button type="button" onClick={() => handleSubmit("consultar")}>Consultar</button>
          </div>
        </form>

        <p style={{ marginTop: "2rem", fontStyle: "italic", color: "white" }}>
          Para eliminar o consultar solo se necesita ingresar la cédula del empleado.
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
            <p><strong>Cédula:</strong> {consultaData.employee_id}</p>
            <p><strong>Nombre:</strong> {consultaData.full_name}</p>
            <p><strong>Provincia:</strong> {consultaData.address.province}</p>
            <p><strong>Cantón:</strong> {consultaData.address.canton}</p>
            <p><strong>Distrito:</strong> {consultaData.address.district}</p>
            <p><strong>Puesto:</strong> {consultaData.position}</p>
            <p><strong>Sucursal:</strong> {consultaData.branch}</p>
            <p><strong>Tipo de planilla:</strong> {consultaData.payroll_type}</p>
            <p><strong>Salario:</strong> ₡{consultaData.salary.toLocaleString()}</p>
            <p><strong>Correo:</strong> {consultaData.email}</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminEmpleado;
