import { useState } from "react";
import { auth, db } from "../firebase/config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";

export default function Registro() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    telefono: "",
    direccion: "",
    dui: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      
      await setDoc(doc(db, "clientes", user.uid), {
        nombres: formData.nombres,
        apellidos: formData.apellidos,
        telefono: formData.telefono,
        direccion: formData.direccion,
        dui: formData.dui,
        email: formData.email,
        role: "cliente" 
      });

      
      navigate("/"); 
    } catch (err) {
      console.error(err);
      setError("Error al registrar: " + err.message);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Crear Cuenta</h2>
        {error && <p style={{color: 'red', marginBottom: '1rem'}}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <div style={styles.grid}>
            <input name="nombres" placeholder="Nombres" required onChange={handleChange} style={styles.input} />
            <input name="apellidos" placeholder="Apellidos" required onChange={handleChange} style={styles.input} />
          </div>

          <input name="telefono" placeholder="Teléfono" required onChange={handleChange} style={styles.input} />
          <input name="direccion" placeholder="Dirección Completa" required onChange={handleChange} style={styles.input} />
          <input name="dui" placeholder="DUI (00000000-0)" required onChange={handleChange} style={styles.input} />
          <input name="email" type="email" placeholder="Correo Electrónico" required onChange={handleChange} style={styles.input} />
          <input name="password" type="password" placeholder="Contraseña" required onChange={handleChange} style={styles.input} />

          <button type="submit" style={styles.button}>Registrarse</button>
        </form>

        <p style={{marginTop: '1rem', fontSize: '0.9rem'}}>
          ¿Ya tienes cuenta? <Link to="/login" style={{color: 'var(--color-accent)'}}>Inicia Sesión</Link>
        </p>
      </div>
    </div>
  );
}


const styles = {
  container: {
    minHeight: "80vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem"
  },
  card: {
    backgroundColor: "var(--color-surface)",
    padding: "2rem",
    borderRadius: "12px",
    boxShadow: "0 4px 10px var(--color-shadow)",
    width: "100%",
    maxWidth: "500px",
    textAlign: "center"
  },
  title: {
    color: "var(--color-primary)",
    marginBottom: "1.5rem",
    fontSize: "2rem"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1rem"
  },
  input: {
    width: "100%",
    padding: "0.8rem",
    marginBottom: "1rem",
    borderRadius: "8px",
    border: "1px solid var(--color-border)",
    boxSizing: "border-box"
  },
  button: {
    width: "100%",
    backgroundColor: "var(--color-accent)",
    color: "var(--color-text-invert)",
    border: "none",
    padding: "0.8rem",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "1rem"
  }
};