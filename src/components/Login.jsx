import { useState } from "react";
import { auth } from "../firebase/config";
import { signInWithEmailAndPassword } from "firebase/auth";
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

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/mis-cupones");
    } catch (err) {
      setError("Correo o contraseña incorrectos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] ">

      {/* ── Panel izquierdo decorativo (solo desktop) ── */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#1a241b] flex-col items-center justify-center px-16 gap-8">
        <span className="text-8xl"></span>
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-white tracking-tight">
            <span className="text-[#9bbf7a]">La Cuponera</span>
          </h2>
          <p className="mt-3 text-gray-400 text-lg leading-relaxed">
            Los mejores descuentos de El Salvador en un solo lugar
          </p>
        </div>
        {/* Tarjetas decorativas */}
        <div className="flex flex-col gap-3 w-full max-w-xs">
          {["🍕 50% en pizza familiar", "💇 Corte + tinte $22", "🎬 2 entradas por $7"].map((item) => (
            <div key={item} className="bg-[#3a503d] border border-[#709756]/40 rounded-xl px-4 py-3 text-sm text-gray-300 flex items-center gap-2">
              <span className="text-[#709756]">✓</span> {item}
            </div>
          ))}
        </div>
      </div>

      {/* ── Panel derecho — formulario ── */}
      <div className="w-full lg:w-1/2 bg-[#2c3e2e] flex items-center justify-center px-6 sm:px-12 py-12">
        <div className="w-full max-w-md">

          {/* Título — visible solo en mobile */}
          <div className="lg:hidden text-center mb-8">
            <span className="text-5xl"></span>
            <h1 className="mt-3 text-3xl font-extrabold text-white">
              <span className="text-[#9bbf7a]">La Cuponera</span>
            </h1>
          </div>

          <h2 className="text-2xl font-extrabold text-white mb-2">Bienvenido de vuelta</h2>
          <p className="text-gray-400 text-sm mb-8">Ingresa tus credenciales para continuar</p>

          {error && (
            <div className="bg-red-900/40 border border-red-700/50 text-red-300 px-4 py-3 rounded-lg mb-6 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                Correo electrónico
              </label>
              <input
                type="email"
                placeholder="tu@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-[#1a241b] border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#709756] focus:border-transparent transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-[#1a241b] border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#709756] focus:border-transparent transition-all pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#9bbf7a] transition-colors"
                >
                  {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full py-3.5 bg-[#709756] hover:bg-[#5c7d46] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors text-base"
            >
              {loading ? "Ingresando..." : "Ingresar"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-400">
            ¿No tienes cuenta?{" "}
            <Link to="/registro" className="text-[#9bbf7a] font-bold hover:underline">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}