'use client'

import { useState, useEffect } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { TEXT_PRIMARY, TEXT_SECONDARY, BG_ORB_TERRACOTA, BG_ORB_GOLDEN } from '@/lib/constants'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Municipality, MunicipalityResponse } from '@/types/api.types'

export default function SearchBar() {
  const locale = useLocale()
  const t = useTranslations('search')
  
  const [searchType, setSearchType] = useState<'rent' | 'buy'>('rent')
  const [destination, setDestination] = useState('')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(2)
  const [municipalities, setMunicipalities] = useState<Municipality[]>([])

  useEffect(() => {
    const loadMunicipalities = async () => {
      try {
        const res = await fetch('/api/municipalities')
        const data: MunicipalityResponse = await res.json()
        
        if (data.success && Array.isArray(data.data)) {
          setMunicipalities(data.data)
        }
      } catch {
        // Silently fail
      }
    }

    loadMunicipalities()
  }, [])

  const handleSearch = () => {
    const params = new URLSearchParams()
    
    params.append('type', searchType)
    
    if (destination.trim()) {
      params.append('destination', destination.trim())
    }
    
    if (searchType === 'rent') {
      if (checkIn) params.append('checkIn', checkIn)
      if (checkOut) params.append('checkOut', checkOut)
    }
    
    params.append('guests', guests.toString())
    
    const url = `/${locale}/properties?${params.toString()}`
    window.open(url, '_blank')
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 md:p-8">
        {/* Toggle Alquilar/Comprar */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex rounded-lg p-1" style={{ backgroundColor: BG_ORB_GOLDEN }}>
            <button
              onClick={() => setSearchType('rent')}
              className="px-6 py-2 rounded-md text-sm font-medium transition-all shadow-sm"
              style={{
                backgroundColor: searchType === 'rent' ? BG_ORB_TERRACOTA : 'transparent',
                color: searchType === 'rent' ? '#ffffff' : TEXT_PRIMARY
              }}
              onMouseEnter={(e) => {
                if (searchType !== 'rent') e.currentTarget.style.color = TEXT_SECONDARY
              }}
              onMouseLeave={(e) => {
                if (searchType !== 'rent') e.currentTarget.style.color = TEXT_PRIMARY
              }}
            >
              {t('rent')}
            </button>
            <button
              onClick={() => setSearchType('buy')}
              className="px-6 py-2 rounded-md text-sm font-medium transition-all shadow-sm"
              style={{
                backgroundColor: searchType === 'buy' ? BG_ORB_TERRACOTA : 'transparent',
                color: searchType === 'buy' ? '#ffffff' : TEXT_PRIMARY
              }}
              onMouseEnter={(e) => {
                if (searchType !== 'buy') e.currentTarget.style.color = TEXT_SECONDARY
              }}
              onMouseLeave={(e) => {
                if (searchType !== 'buy') e.currentTarget.style.color = TEXT_PRIMARY
              }}
            >
              {t('buy')}
            </button>
          </div>
        </div>

        {/* Campos de búsqueda */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Destino */}
          <div className="lg:col-span-1">
            <label className="block text-sm font-medium mb-2" style={{ color: TEXT_PRIMARY }}>
              {t('destination')}
            </label>
            <Select value={destination} onValueChange={setDestination}>
              <SelectTrigger 
                className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:border-transparent outline-none transition-all"
                style={{ borderColor: BG_ORB_TERRACOTA }}
              >
                <SelectValue placeholder="Selecciona un municipio" />
              </SelectTrigger>
              <SelectContent>
                {municipalities.map((municipality) => (
                  <SelectItem key={municipality.id} value={municipality.name}>
                    {municipality.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Fecha entrada - Solo visible en Alquilar */}
          {searchType === 'rent' && (
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: TEXT_PRIMARY }}>
                {t('checkIn')}
              </label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:border-transparent outline-none transition-all"
                style={{
                  borderColor: BG_ORB_TERRACOTA
                }}
                onFocus={(e) => {
                  e.currentTarget.style.boxShadow = `0 0 0 2px ${BG_ORB_GOLDEN}`
                }}
                onBlur={(e) => {
                  e.currentTarget.style.boxShadow = 'none'
                }}
              />
            </div>
          )}

          {/* Fecha salida - Solo visible en Alquilar */}
          {searchType === 'rent' && (
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: TEXT_PRIMARY }}>
                {t('checkOut')}
              </label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:border-transparent outline-none transition-all"
                style={{
                  borderColor: BG_ORB_TERRACOTA
                }}
                onFocus={(e) => {
                  e.currentTarget.style.boxShadow = `0 0 0 2px ${BG_ORB_GOLDEN}`
                }}
                onBlur={(e) => {
                  e.currentTarget.style.boxShadow = 'none'
                }}
              />
            </div>
          )}

          {/* Huéspedes */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: TEXT_PRIMARY }}>
              {t('guests')}
            </label>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setGuests(Math.max(1, guests - 1))}
                className="w-10 h-10 rounded-lg border transition-colors flex items-center justify-center"
                style={{
                  borderColor: BG_ORB_TERRACOTA,
                  color: TEXT_SECONDARY
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = BG_ORB_GOLDEN
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }}
                aria-label="Decrease guests"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <span className="flex-1 text-center font-medium" style={{ color: TEXT_PRIMARY }}>{guests}</span>
              <button
                onClick={() => setGuests(guests + 1)}
                className="w-10 h-10 rounded-lg border transition-colors flex items-center justify-center"
                style={{
                  borderColor: BG_ORB_TERRACOTA,
                  color: TEXT_SECONDARY
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = BG_ORB_GOLDEN
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }}
                aria-label="Increase guests"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Botón Buscar */}
        <div className="mt-6">
          <button
            onClick={handleSearch}
            className="w-full text-white font-medium py-4 px-6 rounded-lg transition-colors shadow-lg hover:shadow-xl"
            style={{
              backgroundColor: BG_ORB_TERRACOTA
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = BG_ORB_GOLDEN
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = BG_ORB_TERRACOTA
            }}
          >
            {t('search')}
          </button>
        </div>
      </div>
    </div>
  )
}
