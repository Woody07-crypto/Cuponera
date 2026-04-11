import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { canjearCuponPorCodigo } from "../services/cuponCanjeService";
import { empresaIdAString } from "../services/empresaService";

const IcLock = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
);
const IcShield = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);
const IcTicket = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M2 9a3 3 0 010 6v2a2 2 0 002 2h16a2 2 0 002-2v-2a3 3 0 010-6V7a2 2 0 00-2-2H4a2 2 0 00-2 2v2z" />
  </svg>
);
const IcCheck = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

export default function CanjearCupon() {
  const { profile } = useAuth();
  const [codigo, setCodigo] = useState("");
  const [dui, setDui] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState(null);

  const nombreEmpresa = profile?.nombreEmpresa || "tu empresa";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResultado(null);
    setLoading(true);
    try {
      const empresaId = empresaIdAString(profile?.empresaId);
      const r = await canjearCuponPorCodigo(codigo, dui, {
        empresaId: empresaId || undefined,
      });
      setResultado(r);
      setCodigo("");
      setDui("");
    } catch (err) {
      setError(err.message || "Error al canjear.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-bg min-h-screen py-10 sm:py-14 px-4 sm:px-6">
      <div className="max-w-lg mx-auto">
        <header className="mb-8 sm:mb-10 text-center sm:text-left">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl border border-white/[0.1] bg-white/[0.04] text-brand-cyan mb-4 mx-auto sm:mx-0">
            <IcTicket />
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-white tracking-tight mb-3">
            Canjear cupón
          </h1>
          <p className="text-sm sm:text-base text-[var(--muted)] leading-relaxed max-w-xl mx-auto sm:mx-0">
            Ingresa el código que muestra el cliente. Solo se aceptan cupones emitidos para{" "}
            <span className="font-semibold text-cyan-300/95">{nombreEmpresa}</span>
            <span className="text-[var(--faint)]"> — </span>
            el sistema valida empresa, DUI del presente y estado antes de registrar el canje.
          </p>
        </header>

        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.06] px-4 py-3 flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-2 mb-6">
          <div className="flex items-center gap-2 text-emerald-300/95 text-xs font-semibold uppercase tracking-wide">
            <IcLock />
            Área de canje autorizada
          </div>
          <div className="hidden sm:block h-4 w-px bg-white/10" aria-hidden />
          <div className="flex items-center gap-2 text-[var(--muted)] text-xs">
            <IcShield />
            Códigos verificados en Firestore
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 rounded-4xl bg-gradient-mesh opacity-40 pointer-events-none" aria-hidden />
          <div className="relative glass rounded-4xl border border-white/[0.08] shadow-glass overflow-hidden">
            <div className="h-1 w-full bg-gradient-brand" aria-hidden />

            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
              <div>
                <label className="label" htmlFor="codigo-cupon">
                  Código del cupón
                </label>
                <input
                  id="codigo-cupon"
                  type="text"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                  className="input-field font-mono text-base sm:text-lg tracking-[0.12em] uppercase placeholder:normal-case placeholder:tracking-normal"
                  placeholder="Ej. EMPRESA1234567"
                  autoComplete="off"
                  autoCapitalize="characters"
                  spellCheck="false"
                  inputMode="text"
                  aria-describedby="canje-cupon-hint"
                  required
                />
                <p id="canje-cupon-hint" className="mt-2 text-xs text-[var(--faint)] leading-relaxed">
                  Sin espacios al inicio o al final; puedes pegar el código tal como lo muestra el cliente.
                </p>
              </div>

              <div>
                <label className="label" htmlFor="canje-dui">
                  DUI de quien presenta el cupón
                </label>
                <input
                  id="canje-dui"
                  type="text"
                  value={dui}
                  onChange={(e) => setDui(e.target.value)}
                  className="input-field font-mono text-sm"
                  placeholder="00000000-0"
                  maxLength={12}
                  autoComplete="off"
                  required
                />
                <p className="mt-2 text-xs text-[var(--faint)] leading-relaxed">
                  Debe coincidir con el DUI del comprador registrado al emitir el cupón.
                </p>
              </div>

              {error && (
                <div
                  className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200 flex gap-2 items-start"
                  role="alert"
                >
                  <span className="shrink-0 mt-0.5" aria-hidden>
                    ⚠
                  </span>
                  <span>{error}</span>
                </div>
              )}

              {resultado && (
                <div
                  className="rounded-xl border border-emerald-500/35 bg-emerald-500/10 px-4 py-4 text-sm text-emerald-100/95 flex flex-col gap-2"
                  role="status"
                >
                  <div className="flex items-center gap-2 font-semibold text-emerald-200">
                    <span className="text-emerald-400" aria-hidden>
                      <IcCheck />
                    </span>
                    Canje registrado correctamente
                  </div>
                  <p className="text-white/90 leading-relaxed">
                    Cupón{" "}
                    <span className="font-mono font-bold tracking-wider text-cyan-200 bg-white/[0.06] px-2 py-0.5 rounded-lg border border-white/10">
                      {resultado.codigo}
                    </span>
                    {" — "}
                    <span className="font-medium">{resultado.titulo}</span>
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center py-3.5 text-base gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  "Verificando…"
                ) : (
                  <>
                    <IcLock />
                    Confirmar canje
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
