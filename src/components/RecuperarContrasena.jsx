import { useState } from "react";
import { Link } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase/config";

function mensajeAuth(code) {
  switch (code) {
    case "auth/invalid-email":
      return "El correo no es válido.";
    case "auth/user-not-found":
      return "No hay cuenta con ese correo.";
    default:
      return "No se pudo enviar el correo. Intentá de nuevo.";
  }
}

export default function RecuperarContrasena() {
  const [email, setEmail] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email.trim(), {
        url: `${window.location.origin}/login`,
        handleCodeInApp: false,
      });
      setEnviado(true);
    } catch (err) {
      setError(mensajeAuth(err?.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-bg min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-14">
      <div className="w-full max-w-md glass rounded-3xl border border-white/[0.08] shadow-glass p-8">
        <h1 className="text-2xl font-heading font-bold text-white mb-2">Recuperar contraseña</h1>
        <p className="text-sm text-[var(--muted)] mb-6 leading-relaxed">
          Te enviaremos un enlace para restablecer la contraseña si el correo está registrado.
        </p>
        {enviado ? (
          <p className="text-sm text-emerald-200/90 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3">
            Revisá tu bandeja de entrada (y spam) para continuar.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error ? (
              <div className="text-sm text-red-200 border border-red-500/35 bg-red-500/10 rounded-xl px-4 py-3">
                {error}
              </div>
            ) : null}
            <div>
              <label className="label" htmlFor="rec-email">
                Correo
              </label>
              <input
                id="rec-email"
                type="email"
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
              {loading ? "Enviando…" : "Enviar enlace"}
            </button>
          </form>
        )}
        <p className="mt-6 text-center text-sm">
          <Link to="/login" className="text-cyan-300/90 hover:underline">
            Volver al inicio de sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
