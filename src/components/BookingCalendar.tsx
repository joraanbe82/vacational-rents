'use client'

import React, { useState } from 'react'
import { DayPicker, DateRange } from 'react-day-picker'
import { format, differenceInDays, startOfToday } from 'date-fns'
import { useTranslations } from 'next-intl'
import { TEXT_PRIMARY, TEXT_SECONDARY, BG_ORB_TERRACOTA, BG_ORB_GOLDEN } from '@/lib/constants'
import BookingRequestModal from '@/components/property/BookingRequestModal'
import 'react-day-picker/dist/style.css'

interface BookingCalendarProps {
  propertyId: string;
  propertyName: string;
  pricePerNight: number;
}

export default function BookingCalendar({ propertyId, propertyName, pricePerNight }: BookingCalendarProps) {
  const t = useTranslations('calendar')
  const [range, setRange] = useState<DateRange | undefined>()
  const [isModalOpen, setIsModalOpen] = useState(false)
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

  const handleOpenModal = () => {
    if (!range?.from || !range?.to) return
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setRange(undefined)
  }

  return (
    <div className="space-y-8">
      {/* Contenedor del Calendario */}
      <div className="bg-white p-4 rounded-[2.5rem] shadow-sm inline-block w-full overflow-hidden" style={{ borderColor: BG_ORB_GOLDEN, borderWidth: '1px' }}>
        <style dangerouslySetInnerHTML={{
          __html: `
            .rdp {
              --rdp-accent-color: ${BG_ORB_TERRACOTA};
              --rdp-background-color: ${BG_ORB_TERRACOTA}33;
              --rdp-accent-color-dark: ${BG_ORB_TERRACOTA};
              --rdp-background-color-dark: ${BG_ORB_TERRACOTA}33;
            }
            .rdp-day_selected {
              background-color: ${BG_ORB_TERRACOTA} !important;
              color: white !important;
            }
            .rdp-day_selected:hover {
              background-color: ${BG_ORB_TERRACOTA} !important;
            }
            .rdp-day:not(.rdp-day_disabled):not(.rdp-day_selected):hover {
              background-color: ${BG_ORB_GOLDEN} !important;
              color: ${TEXT_PRIMARY} !important;
            }
            .rdp-day_today {
              font-weight: bold;
              border: 2px solid ${BG_ORB_TERRACOTA} !important;
            }
            .rdp-day_disabled {
              opacity: 0.35;
            }
            .rdp-head_cell {
              color: ${TEXT_SECONDARY};
              font-weight: 600;
            }
            .rdp-caption {
              color: ${TEXT_PRIMARY};
            }
            .rdp-day {
              color: ${TEXT_PRIMARY};
            }
          `
        }} />
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
        <div className="p-8 rounded-[2.5rem] space-y-6" style={{ backgroundColor: TEXT_PRIMARY, color: '#ffffff' }}>
          <div className="flex justify-between items-center border-b border-white/10 pb-4">
            <span className="text-sm font-light uppercase tracking-widest" style={{ opacity: 0.6 }}>{t('selectedPeriod')}</span>
            <span className="text-sm font-medium">
              {range?.from ? format(range.from, 'dd MMM') : ''} 
              {range?.to ? ` — ${format(range.to, 'dd MMM')}` : '...'}
            </span>
          </div>

          <div className="flex justify-between items-end">
            <div>
              <span className="block text-3xl font-light">{numberOfNights} {numberOfNights === 1 ? t('night') : t('nights')}</span>
              <span className="text-xs" style={{ opacity: 0.5 }}>{pricePerNight} € {t('perNight')}</span>
            </div>
            <div className="text-right">
              <span className="block text-4xl font-medium">{totalPrice} €</span>
              <span className="text-[10px] font-bold uppercase tracking-tighter" style={{ opacity: 0.4 }}>{t('totalPrice')}</span>
            </div>
          </div>

          <button 
            onClick={handleOpenModal}
            disabled={!range?.to}
            className="w-full py-5 rounded-full text-xs uppercase tracking-[0.2em] font-bold transition-all active:scale-[0.97]"
            style={{
              backgroundColor: !range?.to ? `${BG_ORB_GOLDEN}33` : BG_ORB_TERRACOTA,
              color: !range?.to ? `${TEXT_PRIMARY}66` : '#ffffff'
            }}
            onMouseEnter={(e) => {
              if (range?.to) {
                e.currentTarget.style.backgroundColor = BG_ORB_GOLDEN
              }
            }}
            onMouseLeave={(e) => {
              if (range?.to) {
                e.currentTarget.style.backgroundColor = BG_ORB_TERRACOTA
              }
            }}
          >
            {t('confirmReservation')}
          </button>

          <BookingRequestModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            propertyId={propertyId}
            propertyName={propertyName}
            checkInDate={range?.from ? format(range.from, 'dd/MM/yyyy') : ''}
            checkOutDate={range?.to ? format(range.to, 'dd/MM/yyyy') : ''}
            nights={numberOfNights}
          />
        </div>
      </div>
    </div>
  )
}

