'use client'

import React, { useState, useEffect, useRef } from 'react'
import { COUNTRIES } from '@/lib/countries' // Importamos el array completo

interface Props {
  value: string;
  onChange: (val: string) => void;
  label: string;
}

export default function CountrySelect({ value, onChange, label }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState(value)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const filteredCountries = COUNTRIES.filter(c => 
    c.toLowerCase().includes(searchTerm.toLowerCase())
  )

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        // Validamos: si lo escrito no está en la lista, volvemos al valor real
        if (!COUNTRIES.includes(searchTerm)) {
          setSearchTerm(value)
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [searchTerm, value])

  const handleSelect = (country: string) => {
    setSearchTerm(country)
    onChange(country)
    setIsOpen(false)
  }

  return (
    <div className="space-y-2 relative" ref={wrapperRef}>
      <label className="text-[10px] uppercase tracking-widest text-slate-900 font-bold ml-2">
        {label}
      </label>
      
      <div className="relative">
        <input 
          type="text"
          value={searchTerm}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Type to search..."
          className="w-full border border-slate-300 rounded-2xl p-4 text-slate-900 font-medium outline-none focus:ring-2 focus:ring-blue-600 bg-white transition-all shadow-sm"
        />
        {/* Icono de flecha para indicar que es un select */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
      </div>
      
      {/* Dropdown con scroll optimizado */}
      {isOpen && (
        <ul className="absolute z-[100] w-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl max-h-72 overflow-y-auto p-2 space-y-1 animate-in fade-in slide-in-from-top-2">
          {filteredCountries.length > 0 ? (
            filteredCountries.map(country => (
              <li 
                key={country}
                onClick={() => handleSelect(country)}
                className="p-3 text-sm text-slate-900 hover:bg-slate-900 hover:text-white rounded-xl cursor-pointer transition-colors font-semibold"
              >
                {country}
              </li>
            ))
          ) : (
            <li className="p-4 text-xs text-slate-400 text-center italic">No results found</li>
          )}
        </ul>
      )}
    </div>
  )
}