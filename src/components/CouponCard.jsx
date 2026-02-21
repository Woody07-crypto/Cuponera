import { useRef } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export default function CouponCard({ cupon }) {
  const isDisponible = cupon.estado === 'disponible';
  const printRef = useRef();

  const handleDownloadPDF = async () => {
    const element = printRef.current;
    const canvas = await html2canvas(element, { scale: 2, backgroundColor: '#3a503d' });
    const data = canvas.toDataURL('image/png');

    const pdf = new jsPDF('landscape', 'mm', 'a5');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`cupon-${cupon.codigo}.pdf`);
  };

  return (
    <div className={`flex flex-col rounded-xl overflow-hidden border ${
      isDisponible ? 'border-[#709756] bg-[#3a503d]' : 'border-gray-600 bg-[#2a362b] opacity-75'
    }`}>

      {/* Contenido del cupón (también se imprime en PDF) */}
      <div ref={printRef} className="p-6 bg-[#3a503d] text-white">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold leading-tight w-2/3">
            {cupon.titulo || "Sin título"}
          </h3>
          <span className={`text-xs px-2 py-1 rounded-full uppercase tracking-wider font-bold ${
            isDisponible         ? 'bg-green-500 text-white'  :
            cupon.estado === 'canjeado' ? 'bg-blue-500 text-white'  :
                                         'bg-red-500 text-white'
          }`}>
            {cupon.estado}
          </span>
        </div>

        {/* ✅ Usa nombreEmpresa (campo real en Firestore) */}
        <p className="text-gray-300 mb-1">
          Empresa: <span className="font-semibold text-white">
            {cupon.nombreEmpresa || cupon.empresa || "—"}
          </span>
        </p>
        <p className="text-gray-300 mb-4 text-sm">
          Válido hasta: {cupon.fechaVencimiento || "—"}
        </p>

        {/* Código del cupón */}
        <div className="bg-[#2c3e2e] p-4 rounded-lg text-center border border-dashed border-[#709756]">
          <p className="text-sm text-gray-400 mb-1">Código del Cupón</p>
          <p className="font-mono tracking-widest text-2xl font-bold text-[#709756]">
            {cupon.codigo}
          </p>
        </div>
      </div>

      {/* Botón descargar PDF — solo para cupones disponibles */}
      {isDisponible && (
        <div className="p-4 bg-[#2a362b] mt-auto">
          <button
            onClick={handleDownloadPDF}
            className="w-full bg-[#709756] hover:bg-[#5c7d46] text-white font-bold py-3 px-4 rounded-lg transition-colors"
          >
            Descargar PDF del Cupón
          </button>
        </div>
      )}
    </div>
  );
}