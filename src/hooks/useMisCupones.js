import { useState, useEffect } from 'react';

export const useMisCupones = () => {
  const [cupones, setCupones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    const fetchCupones = async () => {
      setLoading(true);
      setTimeout(() => {
        setCupones([
          { id: '1', titulo: '2x1 en Hamburguesas Clásicas', empresa: 'Burger King', codigo: 'BKG-7654321', estado: 'disponible', fechaVencimiento: '2026-03-01' },
          { id: '2', titulo: '50% de descuento en Spa', empresa: 'Relax Spa', codigo: 'RLX-1234567', estado: 'disponible', fechaVencimiento: '2026-04-15' },
          { id: '3', titulo: 'Entrada 2D Cine', empresa: 'Cinépolis', codigo: 'CIN-9876543', estado: 'canjeado', fechaVencimiento: '2026-01-10' },
          { id: '4', titulo: 'Cambio de Aceite', empresa: 'Talleres Excel', codigo: 'EXC-1112223', estado: 'vencido', fechaVencimiento: '2025-12-31' },
        ]);
        setLoading(false);
      }, 1000); 
    };

    fetchCupones();
  }, []);

  return { cupones, loading };
};