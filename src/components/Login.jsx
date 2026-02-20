import { useState } from "react";
import { auth } from "../firebase/config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/mis-cupones"); 
    } catch (err) {
      setError("Correo o contraseña incorrectos.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Iniciar Sesión</h2>
        {error && <p style={{color: 'red', marginBottom: '1rem'}}>{error}</p>}
        
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Correo Electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />
          <button type="submit" style={styles.button}>Ingresar</button>
        </form>
        
        <p style={{marginTop: '1rem', fontSize: '0.9rem'}}>
          ¿No tienes cuenta? <Link to="/registro" style={{color: 'var(--color-accent)'}}>Regístrate aquí</Link>
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
    justifyContent: "center"
  },
  card: {
    backgroundColor: "var(--color-surface)",
    padding: "2rem",
    borderRadius: "12px",
    boxShadow: "0 4px 10px var(--color-shadow)",
    width: "400px",
    textAlign: "center"
  },
  title: {
    color: "var(--color-primary)",
    marginBottom: "1.5rem",
    fontSize: "2rem"
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
    backgroundColor: "var(--color-primary)",
    color: "var(--color-text-invert)",
    border: "none",
    padding: "0.8rem",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "1rem"
  }
};