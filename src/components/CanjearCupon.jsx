import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { canjearCuponPorCodigo } from "../services/cuponCanjeService";

export default function CanjearCupon() {
  const { user, profile } = useAuth();
  const [codigo, setCodigo] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResultado(null);
    setLoading(true);
    try {
      const r = await canjearCuponPorCodigo(codigo, {
        uid: user?.uid,
        empresaId: profile?.empresaId,
        nombreEmpresa: profile?.nombreEmpresa,
      });
      setResultado(r);
      setCodigo("");
    } catch (err) {
      setError(err.message || "Error al canjear.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1a13] py-12 px-4 text-white">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-extrabold mb-2">Canjear cupón</h1>
        <p className="text-gray-400 text-sm mb-8">
          Ingresa el código que muestra el cliente. Solo se pueden canjear cupones
          de{" "}
          <span className="text-[#ACCC7B] font-semibold">
            {profile?.nombreEmpresa || "tu empresa"}
          </span>
          .
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 p-6 rounded-2xl border border-gray-600 bg-[#1a241b]"
        >
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Código del cupón
            </label>
            <input
              type="text"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-[#0f1a13] border border-gray-600 text-white font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-[#668A4C]"
              placeholder="Ej. EMPRESA1234567"
              autoComplete="off"
              required
            />
          </div>

          {error && (
            <div className="text-sm text-red-300 bg-red-900/30 border border-red-800 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          {resultado && (
            <div className="text-sm text-green-200 bg-green-900/30 border border-green-800 rounded-lg px-3 py-2">
              Cupón <strong>{resultado.codigo}</strong> canjeado:{" "}
              {resultado.titulo}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-[#668A4C] hover:bg-[#557240] disabled:opacity-50 font-bold"
          >
            {loading ? "Verificando…" : "Confirmar canje"}
          </button>
        </form>
      </div>
    </div>
  );
}
