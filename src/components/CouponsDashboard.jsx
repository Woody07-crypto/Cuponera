import { useState } from 'react';
import CouponCard from './CouponCard';
import { useMisCupones } from '../hooks/useMisCupones';

export default function CouponsDashboard() {
  const { cupones, loading } = useMisCupones();
  const [activeTab, setActiveTab] = useState('disponible');

  
  const filteredCoupons = cupones.filter(cupon => cupon.estado === activeTab);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#2c3e2e] flex items-center justify-center">
        <p className="text-[#709756] text-xl font-bold animate-pulse">Cargando tus cupones...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#2c3e2e] py-12 px-4 sm:px-6 lg:px-8 text-white font-sans">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold tracking-tight mb-4">Mis Cupones</h2>
          <p className="text-lg text-gray-300">Administra tus compras y descargas</p>
        </div>
        
        
        <div className="flex justify-center space-x-2 sm:space-x-4 mb-10 border-b border-gray-600 pb-4">
          {['disponible', 'canjeado', 'vencido'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 sm:px-6 py-2 rounded-lg font-semibold capitalize transition-all duration-200 ${
                activeTab === tab 
                  ? 'bg-[#709756] text-white shadow-lg' 
                  : 'bg-transparent text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {tab}s
            </button>
          ))}
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredCoupons.length > 0 ? (
            filteredCoupons.map(cupon => (
              <CouponCard key={cupon.id} cupon={cupon} />
            ))
          ) : (
            <div className="col-span-full py-20 text-center bg-[#3a503d] rounded-xl border border-gray-600">
              <p className="text-xl text-gray-400">No tienes cupones en la categoría "{activeTab}s".</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}