import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegUser } from "react-icons/fa";
import { MdLockOutline } from "react-icons/md";
import axios from "axios";
import styles from './Login.module.css';

function Login({ setUser }) {
    const [mode, setMode] = useState("login"); // "login" o "registro"
    const [form, setForm] = useState({
        username: "", password: "",
        id_number: "", first_name: "", user_name: "",
        last_name_1: "", last_name_2: "",
        age: "", birth_date: "", weight: "",
        imc: "", address: "", email: "", regPassword: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = e => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        // Logins locales de prueba
        if (form.username === "admin" && form.password === "admin123") {
            const adminUser = { nombre: "Admin", usuario: "admin", contrasena: "admin123", rol: "Admin" };
            setUser(adminUser);
            localStorage.setItem("usuario_actual", JSON.stringify(adminUser));
            navigate("/admin");
            return;
        }

        if (form.username === "instructor" && form.password === "instructor123") {
            const instructorUser = { nombre: "Instructor", usuario: "instructor", contrasena: "instructor123", rol: "Instructor" };
            setUser(instructorUser);
            localStorage.setItem("usuario_actual", JSON.stringify(instructorUser));
            navigate("/instructor");
            return;
        }

        if (form.username === "cliente" && form.password === "cliente123") {
            const clienteUser = { nombre: "Cliente", usuario: "cliente", contrasena: "cliente123", rol: "Cliente" };
            setUser(clienteUser);
            localStorage.setItem("usuario_actual", JSON.stringify(clienteUser));
            navigate("/cliente");
            return;
        }

        try {
            const requestData = {
                user_name: form.username,  
                password: form.password
            };

            const response = await axios.post("http://localhost:8000/login_usuario", requestData);

            if (response.data.status === true) {
                const data = response.data.data;

                const usuario = {
                    nombre: data.user_name,
                    usuario: data.user_name,
                    rol: data.role,
                    cedula: data.id_number
                };

                setUser(usuario);
                localStorage.setItem("usuario_actual", JSON.stringify(usuario));
                localStorage.setItem("cuenta_actual", JSON.stringify(data));

                alert("Logeo exitoso");

                switch (data.role) {
                    case "Admin":
                        navigate("/admin");
                        break;
                    case "Cliente":
                        navigate("/cliente");
                        break;
                    case "Instructor":
                        navigate("/instructor");
                        break;
                    default:
                        alert("Rol desconocido");
                        break;
                }
            } else {
                alert("Login fallido: " + (response.data.message || "Credenciales inválidas"));
            }
        } catch (error) {
            console.error(error);
            alert("Error al conectar con el servidor");
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                id_number: form.id_number,
                first_name: form.first_name,
                user_name: form.user_name,
                last_name_1: form.last_name_1,
                last_name_2: form.last_name_2,
                age: parseInt(form.age, 10),
                birth_date: new Date(form.birth_date).toLocaleDateString("en-GB") + " 00:00",
                weight: parseFloat(form.weight),
                imc: parseFloat(form.imc),
                address: form.address,
                email: form.email,
                password: form.regPassword,
                role: "Cliente"
            };

            const res = await axios.post("http://localhost:8000/registro_cliente", payload);

            if (res.data.status) {
                alert("Registro exitoso. Ya puedes iniciar sesión.");
                setMode("login");
            } else {
                alert("Error de registro: " + (res.data.message || "Desconocido"));
            }
        } catch (err) {
            console.error(err);
            alert("Error al conectarse con el servidor.");
        }
    };

    return (
        <div className={styles.loginWrapper}>
            <div className={styles.wrapper}>
                {mode === "login" ? (
                    <form onSubmit={handleLogin}>
                        <h1 className={styles.title}>GymTEC</h1>
                        <div className={styles.inputBox}>
                            <input type="text" name="username" placeholder="Usuario"
                                value={form.username} onChange={handleChange} required />
                            <FaRegUser className={styles.icon} />
                        </div>
                        <div className={styles.inputBox}>
                            <input type={showPassword ? "text" : "password"} name="password" placeholder="Contraseña"
                                value={form.password} onChange={handleChange} required />
                            <MdLockOutline className={styles.icon} />
                        </div>
                        <div className={styles.checkboxContainer}>
                            <input type="checkbox" id="showPassword" checked={showPassword}
                                onChange={(e) => setShowPassword(e.target.checked)} className={styles.checkbox} />
                            <label htmlFor="showPassword" className={styles.checkboxLabel}>Mostrar contraseña</label>
                        </div>
                        <button type="submit" className={styles.button}>Ingresar</button>

                        {/* Selector de pestaña dentro del contenedor */}
                        <div className={styles.tabSelector}>
                            <span className={mode === "login" ? styles.active : ""}
                                onClick={() => setMode("login")}>Ingreso</span>
                            <span className={mode === "registro" ? styles.active : ""}
                                onClick={() => setMode("registro")}>Registro</span>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handleRegister}>
                        <h1 className={styles.title}>Registro Cliente</h1>
                        
                        <div className={styles.formGrid}>
                            <div className={styles.column}>
                                {[
                                    { name: "id_number", label: "Cédula", type: "text" },
                                    { name: "user_name", label: "Usuario", type: "text" },
                                    { name: "first_name", label: "Nombre", type: "text" },
                                    { name: "last_name_1", label: "Apellido 1", type: "text" },
                                    { name: "last_name_2", label: "Apellido 2", type: "text" },
                                    { name: "email", label: "Correo", type: "email" }
                                ].map(field => (
                                    <div key={field.name} className={styles.inputBox}>
                                        <input type={field.type} name={field.name} placeholder={field.label}
                                            value={form[field.name]} onChange={handleChange} required />
                                    </div>
                                ))}
                            </div>

                            <div className={styles.column}>
                                {[
                                    { name: "age", label: "Edad", type: "number" },
                                    { name: "birth_date", label: "Fecha de nacimiento", type: "date" },
                                    { name: "weight", label: "Peso (kg)", type: "number" },
                                    { name: "imc", label: "IMC", type: "number" },
                                    { name: "address", label: "Dirección", type: "text" },
                                    { name: "regPassword", label: "Contraseña", type: "password" }
                                ].map(field => (
                                    <div key={field.name} className={styles.inputBox}>
                                        <input type={field.type} name={field.name} placeholder={field.label}
                                            value={form[field.name]} onChange={handleChange} required />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className={styles.formActions}>
                            <button type="submit" className={styles.button}>Registrarse</button>
                            <div className={styles.tabSelector}>
                                <span className={mode === "login" ? styles.active : ""}
                                    onClick={() => setMode("login")}>Ingreso</span>
                                <span className={mode === "registro" ? styles.active : ""}
                                    onClick={() => setMode("registro")}>Registro</span>
                            </div>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

export default Login;
