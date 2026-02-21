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
  const [form, setForm] = useState({
    nombres: "", apellidos: "", telefono: "",
    correo: "", direccion: "", dui: "", password: "", confirmar: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmar, setShowConfirmar] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleDuiChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 9) value = value.slice(0, 9);
    if (value.length > 8) value = value.slice(0, 8) + "-" + value.slice(8);
    setForm({ ...form, dui: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmar) { setError("Las contraseñas no coinciden."); return; }
    if (form.password.length < 6) { setError("La contraseña debe tener al menos 6 caracteres."); return; }
    if (form.dui.length !== 10) { setError("El DUI debe tener el formato 00000000-0."); return; }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, form.correo, form.password);
      await setDoc(doc(db, "clientes", userCredential.user.uid), {
        nombres: form.nombres, apellidos: form.apellidos,
        telefono: form.telefono, correo: form.correo,
        direccion: form.direccion, dui: form.dui, role: "cliente"
      });
      navigate("/comprar");
    } catch (err) {
      if (err.code === "auth/email-already-in-use") setError("Este correo ya está registrado.");
      else setError("Error al registrarse. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-3 bg-[#1a241b] border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#709756] focus:border-transparent transition-all text-sm";
  const labelClass = "block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5";

  return (
    <div className="flex min-h-[calc(100vh-64px)]">

      {/* ── Panel izquierdo decorativo (solo desktop) ── */}
      <div className="hidden lg:flex lg:w-2/5 bg-[#1a241b] flex-col items-center justify-center px-12 gap-8">
        <span className="text-8xl"></span>
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-white tracking-tight">
            <span className="text-[#9bbf7a]">La Cuponera</span>
          </h2>
          <p className="mt-3 text-gray-400 text-base leading-relaxed">
            Únete y accede a cientos de descuentos exclusivos
          </p>
        </div>
        <div className="flex flex-col gap-3 w-full">
          {[
            "✓ Acceso a ofertas exclusivas",
            "✓ Cupones con código único",
            "✓ Descarga tu cupón en PDF",
            "✓ Historial de compras",
          ].map((item) => (
            <div key={item} className="bg-[#3a503d] border border-[#709756]/40 rounded-xl px-4 py-3 text-sm text-gray-300">
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* ── Panel derecho — formulario ── */}
      <div className="w-full lg:w-3/5 bg-[#2c3e2e] flex items-center justify-center px-6 sm:px-12 py-12 overflow-y-auto">
        <div className="w-full max-w-xl">

          {/* Título mobile */}
          <div className="lg:hidden text-center mb-8">
            <span className="text-5xl"></span>
            <h1 className="mt-3 text-3xl font-extrabold text-white">
              <span className="text-[#9bbf7a]">La Cuponera</span>
            </h1>
          </div>

          <h2 className="text-2xl font-extrabold text-white mb-2">Crear cuenta</h2>
          <p className="text-gray-400 text-sm mb-8">Completa el formulario para registrarte</p>

          {error && (
            <div className="bg-red-900/40 border border-red-700/50 text-red-300 px-4 py-3 rounded-lg mb-6 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            {/* Nombres + Apellidos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Nombres</label>
                <input name="nombres" type="text" placeholder="Juan Carlos" onChange={handleChange} className={inputClass} required />
              </div>
              <div>
                <label className={labelClass}>Apellidos</label>
                <input name="apellidos" type="text" placeholder="Pérez Ramos" onChange={handleChange} className={inputClass} required />
              </div>
            </div>

            {/* Teléfono + DUI */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Teléfono</label>
                <input name="telefono" type="tel" placeholder="7777-8888" onChange={handleChange} className={inputClass} required />
              </div>
              <div>
                <label className={labelClass}>DUI</label>
                <input name="dui" type="text" placeholder="01234567-8" value={form.dui} onChange={handleDuiChange} maxLength={10} className={inputClass} required />
              </div>
            </div>

            {/* Correo */}
            <div>
              <label className={labelClass}>Correo electrónico</label>
              <input name="correo" type="email" placeholder="tu@correo.com" onChange={handleChange} className={inputClass} required />
            </div>

            {/* Dirección */}
            <div>
              <label className={labelClass}>Dirección</label>
              <input name="direccion" type="text" placeholder="Col. Escalón, San Salvador" onChange={handleChange} className={inputClass} required />
            </div>

            {/* Contraseña + Confirmar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Contraseña</label>
                <div className="relative">
                  <input name="password" type={showPassword ? "text" : "password"} placeholder="••••••••" onChange={handleChange} className={`${inputClass} pr-12`} required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#9bbf7a] transition-colors">
                    {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>
              <div>
                <label className={labelClass}>Confirmar contraseña</label>
                <div className="relative">
                  <input name="confirmar" type={showConfirmar ? "text" : "password"} placeholder="••••••••" onChange={handleChange} className={`${inputClass} pr-12`} required />
                  <button type="button" onClick={() => setShowConfirmar(!showConfirmar)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#9bbf7a] transition-colors">
                    {showConfirmar ? <EyeSlashIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full py-3.5 bg-[#709756] hover:bg-[#5c7d46] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors text-base"
            >
              {loading ? "Registrando..." : "Crear cuenta"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-400">
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" className="text-[#9bbf7a] font-bold hover:underline">
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}