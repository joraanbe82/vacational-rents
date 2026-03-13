'use client'

import Link from 'next/link';
import { BG_ORB_TERRACOTA, BG_ORB_GOLDEN, TEXT_PRIMARY } from '@/lib/constants';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#ffffff' }}>
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4" style={{ color: TEXT_PRIMARY }}>404</h1>
        <p className="text-xl mb-8" style={{ color: TEXT_PRIMARY }}>Página no encontrada</p>
        <Link 
          href="/es"
          className="inline-block px-8 py-3 rounded-lg font-medium transition-colors"
          style={{
            backgroundColor: BG_ORB_TERRACOTA,
            color: '#ffffff'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = BG_ORB_GOLDEN;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = BG_ORB_TERRACOTA;
          }}
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
