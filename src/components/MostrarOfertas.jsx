import { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import CompraForm from "./CompraForm";

const OFERTA_FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80",
  "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
];

function imagenParaOferta(oferta) {
  if (oferta.imagenUrl) return oferta.imagenUrl;
  let h = 0;
  const id = oferta.id || "";
  for (let i = 0; i < id.length; i++) h += id.charCodeAt(i);
  return OFERTA_FALLBACK_IMAGES[h % OFERTA_FALLBACK_IMAGES.length];
}

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
      <div className="min-h-screen bg-[#0f1a13] flex items-center justify-center">
        <p className="text-[#ACCC7B] text-xl font-bold animate-pulse">Cargando ofertas...</p>
      </div>
    );
  }

  // ── Error ──
  if (error) {
    return (
      <div className="min-h-screen bg-[#0f1a13] flex items-center justify-center">
        <p className="text-red-400 text-lg">{error}</p>
      </div>
    );
  }

  const rubros = Object.keys(ofertasPorRubro);
  const sinOfertas = rubros.length === 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f1a13] via-[#1a2e20] to-[#0f1a13] py-10 px-4 sm:px-6 lg:px-8 text-white font-sans">
      <div className="max-w-7xl mx-auto">

        {/* Hero — visible sin iniciar sesión */}
        <section className="relative rounded-2xl overflow-hidden mb-10 min-h-[200px] sm:min-h-[240px] flex items-stretch shadow-xl border border-[#668A4C]/30">
          <img
            src="https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=1600&q=80"
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f1a13] via-[#0f1a13]/90 to-[#0f1a13]/40" />
          <div className="relative z-10 px-6 sm:px-10 py-8 sm:py-10 max-w-2xl flex flex-col justify-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
              Ofertas para todos
            </h1>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              Explora cupones aprobados y vigentes sin necesidad de iniciar sesión.{" "}
              <span className="text-[#ACCC7B] font-semibold">
                Solo te pediremos cuenta al momento de comprar.
              </span>
            </p>
          </div>
        </section>

        {/* Encabezado */}
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
            Ofertas por rubro
          </h2>
          <p className="text-gray-300 text-lg">Descuentos clasificados por categoría</p>
        </div>

        {sinOfertas ? (
          <div className="max-w-2xl mx-auto rounded-2xl border border-gray-600 bg-[#1a241b]/90 p-8 sm:p-10 text-center">
            <p className="text-gray-200 text-lg font-semibold mb-3">
              No hay ofertas disponibles en este momento.
            </p>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Eso puede pasar si en Firestore no hay documentos en{" "}
              <code className="text-[#ACCC7B]">ofertas</code> con{" "}
              <code className="text-[#ACCC7B]">{`estado: "aprobada"`}</code>, si las fechas de
              vigencia ya pasaron o aún no empiezan, o si se agotaron los cupones.
            </p>
            <p className="text-gray-500 text-xs">
              Revisa la consola del navegador (F12) por errores de permisos de Firebase.
            </p>
          </div>
        ) : null}

        {!sinOfertas && (
          <>
            {/* Tabs de rubros */}
            <div className="flex flex-wrap justify-center gap-2 mb-10 border-b border-gray-600 pb-4">
              {rubros.map((rubro) => (
                <button
                  key={rubro}
                  onClick={() => setRubroActivo(rubro)}
                  className={`flex items-center gap-2 px-5 py-2 rounded-lg font-semibold transition-all duration-200
                    ${rubroActivo === rubro
                      ? "bg-[#668A4C] text-white shadow-lg"
                      : "bg-transparent text-gray-400 hover:text-white hover:bg-white/10"
                    }`}
                >
                  {rubro}
                  <span className={`text-xs px-2 py-0.5 rounded-full
                    ${rubroActivo === rubro ? "bg-[#557240] text-white" : "bg-white/10 text-gray-300"}`}>
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
                    imagenSrc={imagenParaOferta(oferta)}
                    descuento={calcularDescuento(oferta.precioRegular, oferta.precioOferta)}
                    formatFecha={formatFecha}
                    user={user}
                    onComprar={() => setOfertaSeleccionada(oferta)}
                  />
                ))}
              </div>
            )}
          </>
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
function TarjetaOferta({ oferta, imagenSrc, descuento, formatFecha, user, onComprar }) {
  const cuponesDisponibles =
    oferta.cantidadLimite != null
      ? oferta.cantidadLimite - (oferta.cuponesVendidos || 0)
      : null;

  return (
    <div className="flex flex-col rounded-xl overflow-hidden border border-[#668A4C]/80 bg-[#1e2c22] hover:shadow-xl hover:shadow-[#668A4C]/10 transition-shadow duration-300">

      <div className="relative h-44 bg-[#243028] shrink-0">
        <img
          src={imagenSrc}
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1e2c22] via-transparent to-black/20" />
        {descuento > 0 && (
          <span className="absolute top-3 right-3 bg-[#668A4C] text-white text-xs font-black px-3 py-1 rounded-full shadow-lg">
            -{descuento}%
          </span>
        )}
      </div>

      <div className="h-1 bg-gradient-to-r from-[#668A4C] to-[#ACCC7B]" />

      <div className="p-6 flex flex-col gap-3 flex-1">

        <div className="flex items-start justify-between gap-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#ACCC7B]">
            {oferta.nombreEmpresa || "Empresa"}
          </span>
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
          <span className="text-3xl font-extrabold text-[#ACCC7B]">
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
            className="mt-auto w-full bg-[#668A4C] hover:bg-[#557240] text-white font-bold py-3 rounded-lg transition-colors duration-200"
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
                className="text-center bg-[#668A4C] hover:bg-[#557240] text-white font-bold py-2.5 rounded-lg transition-colors duration-200 text-sm"
              >
                Iniciar sesión
              </Link>
              <Link
                to="/registro"
                className="text-center bg-transparent border border-[#668A4C] hover:bg-[#668A4C] text-[#ACCC7B] hover:text-white font-bold py-2.5 rounded-lg transition-colors duration-200 text-sm"
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