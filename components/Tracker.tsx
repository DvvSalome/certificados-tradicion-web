'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { track } from '@/lib/track';

// Registra la VISTA de cada página (incluye los cambios de ruta del router de Next,
// que no recargan la página y por eso no se contarían solos).
export default function Tracker() {
  const pathname = usePathname();
  useEffect(() => { track('view'); }, [pathname]);
  return null;
}
