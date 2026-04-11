import { useState } from "react";
import { Link } from "react-router-dom";
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";
import { useAuth } from "../context/AuthContext";

function mensajeAuth(code) {
  switch (code) {
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "La contraseña actual no es correcta.";
    case "auth/weak-password":
      return "La nueva contraseña es demasiado débil (mínimo 6 caracteres).";
    case "auth/requires-recent-login":
      return "Volvé a iniciar sesión e intentá de nuevo.";
    default:
      return "No se pudo actualizar la contraseña.";
  }
}

export default function CambiarContrasena() {
  const { user } = useAuth();
  const [actual, setActual] = useState("");
  const [nueva, setNueva] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [error, setError] = useState("");
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);

  const esEmailPassword = user?.providerData?.some((p) => p.providerId === "password");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setOk(false);
    if (nueva.length < 6) {
      setError("La nueva contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (nueva !== confirmar) {
      setError("Las contraseñas nuevas no coinciden.");
      return;
    }
    if (!user?.email) {
      setError("No hay correo asociado a la sesión.");
      return;
    }
    setLoading(true);
    try {
      const cred = EmailAuthProvider.credential(user.email, actual);
      await reauthenticateWithCredential(user, cred);
      await updatePassword(user, nueva);
      setOk(true);
      setActual("");
      setNueva("");
      setConfirmar("");
    } catch (err) {
      setError(mensajeAuth(err?.code));
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  if (!esEmailPassword) {
    return (
      <div className="page-bg min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-14">
        <div className="w-full max-w-md glass rounded-3xl border border-white/[0.08] p-8 text-center">
          <p className="text-sm text-[var(--muted)]">
            Tu sesión no usa correo y contraseña de Firebase, por lo que no podés cambiar la contraseña
            desde aquí.
          </p>
          <Link to="/comprar" className="btn-primary inline-flex mt-6 justify-center">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-bg min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-14">
      <div className="w-full max-w-md glass rounded-3xl border border-white/[0.08] shadow-glass p-8">
        <h1 className="text-2xl font-heading font-bold text-white mb-2">Cambiar contraseña</h1>
        <p className="text-sm text-[var(--muted)] mb-6">
          Ingresá tu contraseña actual y la nueva. Aplica a todos los roles que usen este método de acceso.
        </p>
        {ok ? (
          <p className="text-sm text-emerald-200/90 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 mb-4">
            Contraseña actualizada correctamente.
          </p>
        ) : null}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error ? (
            <div className="text-sm text-red-200 border border-red-500/35 bg-red-500/10 rounded-xl px-4 py-3">
              {error}
            </div>
          ) : null}
          <div>
            <label className="label" htmlFor="pw-actual">
              Contraseña actual
            </label>
            <input
              id="pw-actual"
              type="password"
              className="input-field"
              value={actual}
              onChange={(e) => setActual(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          <div>
            <label className="label" htmlFor="pw-nueva">
              Nueva contraseña
            </label>
            <input
              id="pw-nueva"
              type="password"
              className="input-field"
              value={nueva}
              onChange={(e) => setNueva(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
            />
          </div>
          <div>
            <label className="label" htmlFor="pw-conf">
              Confirmar nueva
            </label>
            <input
              id="pw-conf"
              type="password"
              className="input-field"
              value={confirmar}
              onChange={(e) => setConfirmar(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
            {loading ? "Guardando…" : "Guardar contraseña"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm">
          <Link to="/comprar" className="text-cyan-300/90 hover:underline">
            Volver
          </Link>
        </p>
      </div>
    </div>
  );
}
