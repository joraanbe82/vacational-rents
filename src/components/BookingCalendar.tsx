'use client'

import React, { useState } from 'react'
import { DayPicker, DateRange } from 'react-day-picker'
import { format, differenceInDays, startOfToday } from 'date-fns'
import { useTranslations } from 'next-intl'
import { BOOKING_SIMULATION_DELAY_MS, BOOKING_SUCCESS_RESET_DELAY_MS, BOOKING_CURRENCY } from '@/lib/constants'
import 'react-day-picker/dist/style.css'

interface BookingCalendarProps {
  propertyId: string;
  pricePerNight: number;
}

export default function BookingCalendar({ propertyId, pricePerNight }: BookingCalendarProps) {
  const t = useTranslations('calendar')
  const [range, setRange] = useState<DateRange | undefined>()
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const today = startOfToday()

  // Simulación de respuesta de API (Días ya reservados en Java)
  const disabledDays = [
    new Date(2026, 2, 15), // Ejemplo: 15 de Marzo
    new Date(2026, 2, 16),
    { before: today }
  ]

  const numberOfNights = range?.from && range?.to 
    ? differenceInDays(range.to, range.from)
    : 0

  const totalPrice = numberOfNights * pricePerNight

  // Esta es la función que el equipo de Java "rellenará" después
  const handleReservation = async () => {
    if (!range?.from || !range?.to) return

    setStatus('loading')

    // OBJETO PREPARADO PARA EL BACKEND
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const bookingPayload = {
      propertyId: propertyId,
      startDate: format(range.from, 'yyyy-MM-dd'),
      endDate: format(range.to, 'yyyy-MM-dd'),
      totalNights: numberOfNights,
      totalPrice: totalPrice,
      currency: BOOKING_CURRENCY
    }

// Simulamos latencia de red
    setTimeout(() => {
      setStatus('success')
      // Aquí podrías resetear el calendario tras unos segundos
      setTimeout(() => setStatus('idle'), BOOKING_SUCCESS_RESET_DELAY_MS)
    }, BOOKING_SIMULATION_DELAY_MS)
  }

  return (
    <div className="space-y-8">
      {/* Contenedor del Calendario */}
      <div className="bg-white p-4 rounded-[2.5rem] border border-gray-100 shadow-sm inline-block w-full overflow-hidden">
        <DayPicker
          mode="range"
          selected={range}
          onSelect={setRange}
          disabled={disabledDays}
          numberOfMonths={1}
          className="mx-auto"
        />
      </div>

      {/* Resumen de Reserva (Solo aparece si hay fechas) */}
      <div className={`transition-all duration-500 ${range?.from ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
        <div className="bg-zinc-900 text-white p-8 rounded-[2.5rem] space-y-6">
          <div className="flex justify-between items-center border-b border-white/10 pb-4">
            <span className="text-sm font-light opacity-60 uppercase tracking-widest">{t('selectedPeriod')}</span>
            <span className="text-sm font-medium">
              {range?.from ? format(range.from, 'dd MMM') : ''} 
              {range?.to ? ` — ${format(range.to, 'dd MMM')}` : '...'}
            </span>
          </div>

          <div className="flex justify-between items-end">
            <div>
              <span className="block text-3xl font-light">{numberOfNights} {numberOfNights === 1 ? t('night') : t('nights')}</span>
              <span className="text-xs opacity-50">{pricePerNight} € {t('perNight')}</span>
            </div>
            <div className="text-right">
              <span className="block text-4xl font-medium">{totalPrice} €</span>
              <span className="text-[10px] opacity-40 font-bold uppercase tracking-tighter">{t('totalPrice')}</span>
            </div>
          </div>

          <button 
            onClick={handleReservation}
            disabled={!range?.to || status === 'loading'}
            className="w-full bg-white text-black py-5 rounded-full text-xs uppercase tracking-[0.2em] font-bold hover:bg-gray-200 transition-all active:scale-[0.97] disabled:bg-white/20 disabled:text-white/40"
          >
            {status === 'loading' ? t('processing') : status === 'success' ? t('confirmed') : t('confirmReservation')}
          </button>
        </div>
      </div>
    </div>
  )
}

