import { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import CompraForm from "./CompraForm";

export default function MostrarOfertas() {
  const { user } = useAuth();
  const [ofertasPorRubro, setOfertasPorRubro] = useState({});
  const [rubroActivo, setRubroActivo] = useState(null);
  const [ofertaSeleccionada, setOfertaSeleccionada] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarOfertas();
  }, []);

  async function cargarOfertas() {
    try {
      setLoading(true);
      const q = query(collection(db, "ofertas"), where("estado", "==", "aprobada"));
      const snapshot = await getDocs(q);
      const agrupadas = {};
      const hoy = new Date();

      snapshot.forEach((docSnap) => {
        const oferta = { id: docSnap.id, ...docSnap.data() };

        const inicio = oferta.fechaInicio?.toDate ? oferta.fechaInicio.toDate() : new Date(oferta.fechaInicio);
        const fin    = oferta.fechaFin?.toDate    ? oferta.fechaFin.toDate()    : new Date(oferta.fechaFin);

        if (inicio > hoy || fin < hoy) return;
        if (oferta.cantidadLimite != null && (oferta.cuponesVendidos || 0) >= oferta.cantidadLimite) return;

        const rubro = oferta.rubro || "Sin categoría";
        if (!agrupadas[rubro]) agrupadas[rubro] = [];
        agrupadas[rubro].push({ ...oferta, fechaInicio: inicio, fechaFin: fin });
      });

      setOfertasPorRubro(agrupadas);
      const rubros = Object.keys(agrupadas);
      if (rubros.length > 0) setRubroActivo(rubros[0]);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar las ofertas.");
    } finally {
      setLoading(false);
    }
  }

  function calcularDescuento(regular, oferta) {
    if (!regular || regular === 0) return 0;
    return Math.round(((regular - oferta) / regular) * 100);
  }

  function formatFecha(fecha) {
    if (!fecha) return "—";
    const d = fecha?.toDate ? fecha.toDate() : new Date(fecha);
    return d.toLocaleDateString("es-SV", { day: "2-digit", month: "short", year: "numeric" });
  }

  // ── Cargando ──
  if (loading) {
    return (
      <div className="min-h-screen bg-[#2c3e2e] flex items-center justify-center">
        <p className="text-[#709756] text-xl font-bold animate-pulse">Cargando ofertas...</p>
      </div>
    );
  }

  // ── Error ──
  if (error) {
    return (
      <div className="min-h-screen bg-[#2c3e2e] flex items-center justify-center">
        <p className="text-red-400 text-lg">{error}</p>
      </div>
    );
  }

  const rubros = Object.keys(ofertasPorRubro);

  if (rubros.length === 0) {
    return (
      <div className="min-h-screen bg-[#2c3e2e] flex items-center justify-center">
        <p className="text-gray-400 text-lg">No hay ofertas disponibles en este momento.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#2c3e2e] py-12 px-4 sm:px-6 lg:px-8 text-white font-sans">
      <div className="max-w-7xl mx-auto">

        {/* Encabezado */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">Ofertas Disponibles</h1>
          <p className="text-gray-300 text-lg">Descuentos exclusivos clasificados por categoría</p>
        </div>

        {/* Tabs de rubros */}
        <div className="flex flex-wrap justify-center gap-2 mb-10 border-b border-gray-600 pb-4">
          {rubros.map((rubro) => (
            <button
              key={rubro}
              onClick={() => setRubroActivo(rubro)}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg font-semibold transition-all duration-200
                ${rubroActivo === rubro
                  ? "bg-[#709756] text-white shadow-lg"
                  : "bg-transparent text-gray-400 hover:text-white hover:bg-white/10"
                }`}
            >
              {rubro}
              <span className={`text-xs px-2 py-0.5 rounded-full
                ${rubroActivo === rubro ? "bg-[#5c7d46] text-white" : "bg-white/10 text-gray-300"}`}>
                {ofertasPorRubro[rubro].length}
              </span>
            </button>
          ))}
        </div>

        {/* Grid de tarjetas */}
        {rubroActivo && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {ofertasPorRubro[rubroActivo].map((oferta) => (
              <TarjetaOferta
                key={oferta.id}
                oferta={oferta}
                descuento={calcularDescuento(oferta.precioRegular, oferta.precioOferta)}
                formatFecha={formatFecha}
                user={user}
                onComprar={() => setOfertaSeleccionada(oferta)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal de compra — solo si hay sesión */}
      {ofertaSeleccionada && user && (
        <CompraForm
          oferta={ofertaSeleccionada}
          formatFecha={formatFecha}
          onClose={() => setOfertaSeleccionada(null)}
        />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  TarjetaOferta
// ═══════════════════════════════════════════════════════════════
function TarjetaOferta({ oferta, descuento, formatFecha, user, onComprar }) {
  const cuponesDisponibles =
    oferta.cantidadLimite != null
      ? oferta.cantidadLimite - (oferta.cuponesVendidos || 0)
      : null;

  return (
    <div className="flex flex-col rounded-xl overflow-hidden border border-[#709756] bg-[#3a503d] hover:shadow-xl hover:shadow-black/30 transition-shadow duration-300">

      <div className="h-1.5 bg-gradient-to-r from-[#709756] to-[#9bbf7a]" />

      <div className="p-6 flex flex-col gap-3 flex-1">

        <div className="flex items-start justify-between gap-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#9bbf7a]">
            {oferta.nombreEmpresa || "Empresa"}
          </span>
          {descuento > 0 && (
            <span className="bg-[#709756] text-white text-xs font-black px-3 py-1 rounded-full shrink-0">
              -{descuento}%
            </span>
          )}
        </div>

        <h3 className="text-lg font-bold text-white leading-snug line-clamp-2">
          {oferta.titulo}
        </h3>

        <p className="text-sm text-gray-300 line-clamp-3 leading-relaxed">
          {oferta.descripcion}
        </p>

        <div className="flex items-baseline gap-3 mt-1">
          <span className="text-gray-400 line-through text-sm">
            ${Number(oferta.precioRegular).toFixed(2)}
          </span>
          <span className="text-3xl font-extrabold text-[#9bbf7a]">
            ${Number(oferta.precioOferta).toFixed(2)}
          </span>
        </div>

        <div className="border-t border-gray-600 pt-3 flex flex-col gap-1.5 text-xs text-gray-400">
          <span>📅 Vigente hasta: <strong className="text-gray-200">{formatFecha(oferta.fechaFin)}</strong></span>
          <span>🎫 Canjear antes de: <strong className="text-gray-200">{formatFecha(oferta.fechaLimiteCupon)}</strong></span>
          {cuponesDisponibles !== null && (
            <span>🔢 Cupones restantes: <strong className="text-gray-200">{cuponesDisponibles}</strong></span>
          )}
        </div>

        {/* Botón — comportamiento diferente según si hay sesión */}
        {user ? (
          <button
            onClick={onComprar}
            className="mt-auto w-full bg-[#709756] hover:bg-[#5c7d46] text-white font-bold py-3 rounded-lg transition-colors duration-200"
          >
            Comprar cupón
          </button>
        ) : (
          <div className="mt-auto flex flex-col gap-2">
            <div className="text-center text-xs text-gray-400 bg-[#2c3e2e] rounded-lg px-3 py-2 border border-gray-600">
              Debes iniciar sesión para comprar
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Link
                to="/login"
                className="text-center bg-[#709756] hover:bg-[#5c7d46] text-white font-bold py-2.5 rounded-lg transition-colors duration-200 text-sm"
              >
                Iniciar sesión
              </Link>
              <Link
                to="/registro"
                className="text-center bg-transparent border border-[#709756] hover:bg-[#709756] text-[#9bbf7a] hover:text-white font-bold py-2.5 rounded-lg transition-colors duration-200 text-sm"
              >
                Registrarse
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}