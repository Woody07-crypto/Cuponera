import { useState } from "react";
import { auth, db } from "../firebase/config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const EyeSlashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
  </svg>
);

export default function Registro() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    telefono: "",
    direccion: "",
    dui: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDuiChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 9) value = value.slice(0, 9);
    if (value.length > 8) {
      value = value.slice(0, 8) + '-' + value.slice(8);
    }
    setFormData({ ...formData, dui: value });
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Por favor, ingresa un correo electrónico válido.");
      return false;
    }

    if (formData.dui.length !== 10) {
      setError("El DUI debe tener 9 dígitos (formato 00000000-0).");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return false;
    }

    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

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
      if (err.code === 'auth/email-already-in-use') {
        setError("Este correo ya está registrado.");
      } else {
        setError("Error al registrar: " + err.message);
      }
    }
  };

  const inputClass = "w-full px-4 py-2 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-highlight)] text-[var(--color-text)] bg-white";

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] py-12 px-4">
      <div className="bg-[var(--color-surface)] p-8 rounded-xl shadow-[0_4px_10px_var(--color-shadow)] w-full max-w-lg border border-[var(--color-border)]">
        
        <h2 className="text-3xl font-bold text-center text-[var(--color-primary)] mb-6">
          Crear Cuenta
        </h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              name="nombres"
              type="text"
              placeholder="Nombres"
              required
              className={inputClass}
              onChange={handleChange}
            />
            <input
              name="apellidos"
              type="text"
              placeholder="Apellidos"
              required
              className={inputClass}
              onChange={handleChange}
            />
          </div>

          <input
            name="telefono"
            type="tel"
            placeholder="Teléfono"
            required
            className={inputClass}
            onChange={handleChange}
          />
          
          <input
            name="direccion"
            type="text"
            placeholder="Dirección Completa"
            required
            className={inputClass}
            onChange={handleChange}
          />

          <input
            name="dui"
            type="text"
            placeholder="DUI (00000000-0)"
            value={formData.dui}
            required
            className={inputClass}
            onChange={handleDuiChange}
            maxLength={10}
          />

          <input
            name="email"
            type="email"
            placeholder="Correo Electrónico"
            required
            className={inputClass}
            onChange={handleChange}
          />

          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              required
              className={inputClass}
              onChange={handleChange}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-500 hover:text-[var(--color-accent)]"
            >
              {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
            </button>
          </div>

          <div className="relative">
            <input
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              placeholder="Confirmar Contraseña"
              required
              className={`${inputClass} ${formData.confirmPassword && formData.password !== formData.confirmPassword ? 'border-red-500 focus:ring-red-500' : ''}`}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-[var(--color-accent)] hover:bg-[#557540] text-[var(--color-text-invert)] font-bold rounded-lg transition-colors shadow-md"
          >
            Registrarse
          </button>
        </form>

        <div className="text-center mt-6">
          <Link to="/login" className="text-[var(--color-accent)] hover:text-[var(--color-primary)] font-medium">
            ¿Ya tienes cuenta? Inicia Sesión
          </Link>
        </div>
      </div>
    </div>
  );
}