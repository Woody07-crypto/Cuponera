import { useCompra } from "../hooks/useCompra";
import { useNavigate } from "react-router-dom";


export default function CompraForm({ oferta, formatFecha, onClose }) {
  const navigate = useNavigate();
  const { cantidad, setCantidad, comprar, codigosGenerados, loading, error, exitoso } = useCompra();

  const subtotal = (Number(oferta.precioOferta) * cantidad).toFixed(2);

  const maxCupones =
    oferta.cantidadLimite != null
      ? oferta.cantidadLimite - (oferta.cuponesVendidos || 0)
      : 10; // sin límite definido → permitimos hasta 10

  const handleSubmit = async (e) => {
    e.preventDefault();
    await comprar(oferta);
  };

  return (
    // Fondo oscuro semitransparente
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-[#2c3e2e] border border-[#709756] rounded-2xl w-full max-w-md p-8 shadow-2xl">

        {/* ── Vista de éxito ── */}
        {exitoso ? (
          <div className="text-center flex flex-col gap-4">
            <div className="text-5xl">🎉</div>
            <h3 className="text-2xl font-extrabold text-[#9bbf7a]">¡Compra exitosa!</h3>
            <p className="text-gray-300 text-sm">
              Se {codigosGenerados.length === 1 ? "generó" : "generaron"} {codigosGenerados.length} cupón{codigosGenerados.length > 1 ? "es" : ""}:
            </p>

            {/* Códigos generados */}
            <div className="flex flex-col gap-2">
              {codigosGenerados.map((codigo) => (
                <div
                  key={codigo}
                  className="bg-[#3a503d] border border-dashed border-[#709756] rounded-lg px-4 py-3 font-mono text-xl font-bold text-[#709756] tracking-widest text-center"
                >
                  {codigo}
                </div>
              ))}
            </div>

            <p className="text-xs text-gray-400">
              Puedes descargar el PDF de tu cupón en la sección "Mis Cupones".
            </p>

            <div className="flex gap-3 mt-2">
              <button
                onClick={() => navigate("/mis-cupones")}
                className="flex-1 bg-[#709756] hover:bg-[#5c7d46] text-white font-bold py-2.5 rounded-lg transition-colors"
              >
                Ver mis cupones
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-2.5 rounded-lg transition-colors"
              >
                Seguir comprando
              </button>
            </div>
          </div>

        ) : (
          /* ── Formulario de compra ── */
          <>
            {/* Encabezado */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#9bbf7a] mb-1">
                  {oferta.nombreEmpresa}
                </p>
                <h3 className="text-xl font-bold text-white leading-snug">
                  {oferta.titulo}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white text-2xl leading-none ml-4 shrink-0"
              >
                ×
              </button>
            </div>

            {/* Info de la oferta */}
            <div className="bg-[#3a503d] rounded-xl p-4 mb-6 flex flex-col gap-1.5 text-sm text-gray-300">
              <div className="flex justify-between">
                <span>Precio por cupón:</span>
                <span className="font-bold text-[#9bbf7a]">${Number(oferta.precioOferta).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Canjear antes de:</span>
                <span className="font-semibold text-white">{formatFecha(oferta.fechaLimiteCupon)}</span>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-900/50 border border-red-500 text-red-300 text-sm px-4 py-2 rounded-lg mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">

              {/* Selector de cantidad */}
              <div>
                <label className="block text-sm text-gray-400 mb-2 font-semibold">
                  Cantidad de cupones
                </label>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setCantidad((c) => Math.max(1, c - 1))}
                    className="w-10 h-10 rounded-lg bg-[#3a503d] hover:bg-[#709756] text-white font-bold text-xl transition-colors"
                  >
                    −
                  </button>
                  <span className="text-2xl font-extrabold text-white w-8 text-center">
                    {cantidad}
                  </span>
                  <button
                    type="button"
                    onClick={() => setCantidad((c) => Math.min(maxCupones, c + 1))}
                    className="w-10 h-10 rounded-lg bg-[#3a503d] hover:bg-[#709756] text-white font-bold text-xl transition-colors"
                  >
                    +
                  </button>
                  <span className="text-xs text-gray-500">
                    (máx. {maxCupones})
                  </span>
                </div>
              </div>

              {/* Simulación de pago con tarjeta */}
              <div>
                <label className="block text-sm text-gray-400 mb-2 font-semibold">
                  Datos de tarjeta (simulado)
                </label>
                <div className="flex flex-col gap-3">
                  <input
                    type="text"
                    placeholder="Número de tarjeta"
                    maxLength={19}
                    className="w-full px-4 py-2.5 rounded-lg bg-[#3a503d] border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#709756]"
                    required
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="MM/AA"
                      maxLength={5}
                      className="px-4 py-2.5 rounded-lg bg-[#3a503d] border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#709756]"
                      required
                    />
                    <input
                      type="text"
                      placeholder="CVV"
                      maxLength={4}
                      className="px-4 py-2.5 rounded-lg bg-[#3a503d] border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#709756]"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center border-t border-gray-600 pt-4 text-white">
                <span className="font-semibold text-gray-300">Total a pagar:</span>
                <span className="text-3xl font-extrabold text-[#9bbf7a]">${subtotal}</span>
              </div>

              {/* Botón confirmar */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#709756] hover:bg-[#5c7d46] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-colors text-lg"
              >
                {loading ? "Procesando..." : `Confirmar compra · $${subtotal}`}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}