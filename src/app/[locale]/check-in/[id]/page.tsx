'use client'

import React, { useState, use, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import CountrySelect from '@/components/CountrySelect'
import { useTranslations, useLocale } from 'next-intl'
import { DEFAULT_NATIONALITY, DEFAULT_ID_TYPE, BG_GRADIENT_CENTER, BG_GRADIENT_EDGE, BG_ORB_GOLDEN, BG_ORB_TERRACOTA, TEXT_PRIMARY, TEXT_SECONDARY } from '@/lib/constants'
import { GuestData } from '@/types/checkin.types'

export default function CheckInPage({ params }: { params: Promise<{ id: string; locale: string }> }) {
  const { id } = use(params)
  const locale = useLocale()
  const searchParams = useSearchParams()
  const t = useTranslations('checkin')
  const [isReturning, setIsReturning] = useState(false)
  const [registrationId, setRegistrationId] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [generatedId, setGeneratedId] = useState('')
  const [tokenData, setTokenData] = useState<{
    solicitudId: string
    propertyName: string
    checkInDate: string
    checkOutDate: string
    nights: number
    email: string
  } | null>(null)
  const [tokenError, setTokenError] = useState<'invalid' | 'expired' | 'completed' | null>(null)
  const [isValidatingToken, setIsValidatingToken] = useState(false)
  const [guests, setGuests] = useState<GuestData[]>([{
    firstName: '', 
    lastName: '', 
    idType: DEFAULT_ID_TYPE, 
    idNumber: '', 
    idIssueDate: '', 
    birthDate: '', 
    nationality: DEFAULT_NATIONALITY, 
    email: '', 
    phone: '',
    address: {
      street: '',
      extra: '',
      country: 'Spain',
      city: '',
      postalCode: ''
    },
    saveData: false
  }])

  useEffect(() => {
    const token = searchParams.get('token')
    if (!token) return

    const validateToken = async () => {
      setIsValidatingToken(true)
      try {
        const res = await fetch(`/api/checkin/validate?token=${token}`)
        const data = await res.json()

        if (res.status === 404) {
          setTokenError('invalid')
        } else if (res.status === 410) {
          setTokenError('expired')
        } else if (res.status === 409) {
          setTokenError('completed')
        } else if (data.success) {
          setTokenData(data.data)
        }
      } catch {
        setTokenError('invalid')
      } finally {
        setIsValidatingToken(false)
      }
    }

    validateToken()
  }, [searchParams])

  const addGuest = () => {
    setGuests([...guests, { 
      firstName: '', 
      lastName: '', 
      idType: DEFAULT_ID_TYPE, 
      idNumber: '', 
      idIssueDate: '', 
      birthDate: '', 
      nationality: DEFAULT_NATIONALITY, 
      email: '', 
      phone: '',
      address: {
        street: '',
        extra: '',
        country: 'Spain',
        city: '',
        postalCode: ''
      },
      saveData: false 
    }])
  }

  const removeGuest = (index: number) => {
    if (index === 0) return
    const newGuests = guests.filter((_, i) => i !== index)
    setGuests(newGuests)
  }

  const updateGuest = (index: number, field: keyof GuestData, value: string | boolean) => {
    const newGuests = [...guests]
    newGuests[index] = { ...newGuests[index], [field]: value }
    setGuests(newGuests)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const guestsData = guests.map(guest => ({
        id: '',
        firstName: guest.firstName,
        lastName: guest.lastName,
        documentType: guest.idType,
        documentNumber: guest.idNumber,
        issueDate: guest.idIssueDate,
        birthDate: guest.birthDate,
        nationality: guest.nationality,
        email: guest.email,
        phone: guest.phone,
        address: guest.address
      }))

      const res = await fetch('/api/checkins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          propertyId: id,
          guests: guestsData
        })
      })

      const data = await res.json()

      if (data.success && data.data) {
        setGeneratedId(data.data.id)
        
        if (tokenData) {
          await fetch(`/api/solicitudes/${tokenData.solicitudId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              checkinCompletedAt: new Date().toISOString()
            })
          })
        }
        
        setIsSuccess(true)
      } else {
        alert(data.error || 'Error al enviar el registro')
      }
    } catch {
      alert('Error al enviar el registro')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen pb-32 relative" style={{ backgroundColor: BG_GRADIENT_CENTER }}>
      {/* Fondo gradiente radial */}
      <div 
        className="fixed inset-0 -z-10"
        style={{
          background: `radial-gradient(ellipse at center, ${BG_GRADIENT_CENTER} 0%, ${BG_GRADIENT_EDGE} 100%)`
        }}
      />
      {/* Orbes decorativos */}
      <div 
        className="fixed top-20 right-10 w-96 h-96 rounded-full blur-3xl opacity-30 -z-10"
        style={{ backgroundColor: BG_ORB_GOLDEN }}
      />
      <div 
        className="fixed bottom-20 left-10 w-80 h-80 rounded-full blur-3xl opacity-20 -z-10"
        style={{ backgroundColor: BG_ORB_TERRACOTA }}
      />
      {/* Navegación Superior */}
      <nav className="w-full py-6 px-8 mb-12" style={{ backgroundColor: BG_ORB_GOLDEN, borderBottom: `1px solid ${BG_ORB_TERRACOTA}33` }}>
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Link 
            href={`/${locale}`}
            className="flex items-center gap-2 transition-all group"
            style={{ color: TEXT_PRIMARY }}
            onMouseEnter={(e) => e.currentTarget.style.color = TEXT_SECONDARY}
            onMouseLeave={(e) => e.currentTarget.style.color = TEXT_PRIMARY}
          >
            <svg 
              width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
              strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
              className="group-hover:-translate-x-1 transition-transform"
            >
              <path d="m15 18-6-6 6-6"/>
            </svg>
            <span className="text-sm font-bold uppercase tracking-widest">{t('backToGallery')}</span>
          </Link>
          
          <div className="hidden md:block">
            <span className="text-[10px] uppercase tracking-[0.4em] font-black" style={{ color: TEXT_SECONDARY }}>
              {t('propertyId')}: {id}
            </span>
          </div>
        </div>
      </nav>

      {isValidatingToken ? (
        <div className="max-w-2xl mx-auto px-6 py-20 text-center">
          <p className="text-lg" style={{ color: TEXT_PRIMARY }}>Validando...</p>
        </div>
      ) : tokenError === 'invalid' ? (
        <div className="max-w-2xl mx-auto px-6 py-20 text-center space-y-6">
          <h2 className="text-3xl font-black" style={{ color: TEXT_PRIMARY }}>Link no válido</h2>
          <p style={{ color: TEXT_SECONDARY }}>Este link de check-in no es válido. Por favor, contacta con nosotros.</p>
          <Link href={`/${locale}`}>
            <button className="px-8 py-4 rounded-full font-bold" style={{ backgroundColor: BG_ORB_TERRACOTA, color: TEXT_PRIMARY }}>
              Volver al inicio
            </button>
          </Link>
        </div>
      ) : tokenError === 'expired' ? (
        <div className="max-w-2xl mx-auto px-6 py-20 text-center space-y-6">
          <h2 className="text-3xl font-black" style={{ color: TEXT_PRIMARY }}>Link expirado</h2>
          <p style={{ color: TEXT_SECONDARY }}>Este link ha expirado. Contacta con nosotros para solicitar uno nuevo.</p>
          <Link href={`/${locale}`}>
            <button className="px-8 py-4 rounded-full font-bold" style={{ backgroundColor: BG_ORB_TERRACOTA, color: TEXT_PRIMARY }}>
              Volver al inicio
            </button>
          </Link>
        </div>
      ) : tokenError === 'completed' ? (
        <div className="max-w-2xl mx-auto px-6 py-20 text-center space-y-6">
          <h2 className="text-3xl font-black" style={{ color: TEXT_PRIMARY }}>Check-in completado</h2>
          <p style={{ color: TEXT_SECONDARY }}>El check-in ya fue completado anteriormente.</p>
          <Link href={`/${locale}`}>
            <button className="px-8 py-4 rounded-full font-bold" style={{ backgroundColor: BG_ORB_TERRACOTA, color: TEXT_PRIMARY }}>
              Volver al inicio
            </button>
          </Link>
        </div>
      ) : isSuccess ? (
        /* PANTALLA DE CONFIRMACIÓN */
        <div className="max-w-2xl mx-auto px-6 py-20">
          <div className="p-12 rounded-[3rem] shadow-xl space-y-8 text-center animate-in fade-in zoom-in-95" style={{ backgroundColor: BG_ORB_GOLDEN, border: `1px solid ${BG_ORB_TERRACOTA}33` }}>
            <div className="w-24 h-24 rounded-full mx-auto flex items-center justify-center" style={{ backgroundColor: '#22c55e' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-3xl font-black" style={{ color: TEXT_PRIMARY }}>
                ¡Registro Completado!
              </h2>
              <p className="text-lg" style={{ color: TEXT_SECONDARY }}>
                Tu check-in ha sido registrado correctamente
              </p>
            </div>

            <div className="p-6 rounded-2xl" style={{ backgroundColor: BG_GRADIENT_EDGE }}>
              <p className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: TEXT_SECONDARY }}>
                Tu ID de Registro
              </p>
              <p className="text-3xl font-black tracking-wider" style={{ color: TEXT_PRIMARY }}>
                {generatedId}
              </p>
              <p className="text-xs mt-3" style={{ color: TEXT_SECONDARY }}>
                Guarda este ID para futuros check-ins
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(generatedId)
                  alert('ID copiado al portapapeles')
                }}
                className="flex-1 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs transition-all"
                style={{ backgroundColor: BG_ORB_TERRACOTA, color: TEXT_PRIMARY }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.85'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                📋 Copiar ID
              </button>
              <Link
                href={`/${locale}`}
                className="flex-1 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs transition-all text-center"
                style={{ backgroundColor: TEXT_PRIMARY, color: BG_GRADIENT_CENTER }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.85'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                Volver al Inicio
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto px-6 space-y-10">
        <header className="text-center space-y-4">
          <span className="text-[10px] uppercase tracking-[0.5em] font-black" style={{ color: BG_ORB_TERRACOTA }}>
            {t('officialRegistration')}
          </span>
          <h1 className="text-4xl font-black tracking-tight" style={{ color: TEXT_PRIMARY }}>
            {t('checkInOnline')}
          </h1>
          <p className="max-w-md mx-auto text-sm font-medium" style={{ color: TEXT_SECONDARY }}>
            {t('legalNotice')}
          </p>
        </header>

        {tokenData && (
          <div className="p-6 rounded-2xl space-y-4" style={{ backgroundColor: BG_ORB_GOLDEN, border: `3px solid ${BG_ORB_TERRACOTA}` }}>
            <h3 className="text-sm font-black uppercase tracking-widest" style={{ color: TEXT_PRIMARY }}>
              Información de la Reserva
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-bold" style={{ color: TEXT_SECONDARY }}>Vivienda:</span>
                <p className="font-semibold" style={{ color: TEXT_PRIMARY }}>{tokenData.propertyName}</p>
              </div>
              <div>
                <span className="font-bold" style={{ color: TEXT_SECONDARY }}>Email:</span>
                <p className="font-semibold" style={{ color: TEXT_PRIMARY }}>{tokenData.email}</p>
              </div>
              <div>
                <span className="font-bold" style={{ color: TEXT_SECONDARY }}>Entrada:</span>
                <p className="font-semibold" style={{ color: TEXT_PRIMARY }}>{tokenData.checkInDate}</p>
              </div>
              <div>
                <span className="font-bold" style={{ color: TEXT_SECONDARY }}>Salida:</span>
                <p className="font-semibold" style={{ color: TEXT_PRIMARY }}>{tokenData.checkOutDate}</p>
              </div>
              <div>
                <span className="font-bold" style={{ color: TEXT_SECONDARY }}>Noches:</span>
                <p className="font-semibold" style={{ color: TEXT_PRIMARY }}>{tokenData.nights}</p>
              </div>
            </div>
          </div>
        )}

        {/* Selector de Cliente: Nuevo o Habitual */}
        <div className="flex p-2 rounded-3xl shadow-sm max-w-md mx-auto" style={{ backgroundColor: BG_GRADIENT_CENTER, border: `1px solid ${BG_ORB_GOLDEN}` }}>
          <button 
            type="button"
            onClick={() => setIsReturning(false)}
            className="flex-1 py-4 rounded-2xl text-xs uppercase tracking-widest font-bold transition-all"
            style={{
              backgroundColor: !isReturning ? TEXT_PRIMARY : 'transparent',
              color: !isReturning ? BG_GRADIENT_CENTER : TEXT_SECONDARY
            }}
            onMouseEnter={(e) => {
              if (isReturning) e.currentTarget.style.backgroundColor = BG_ORB_GOLDEN
            }}
            onMouseLeave={(e) => {
              if (isReturning) e.currentTarget.style.backgroundColor = 'transparent'
            }}
          >
            {t('newGuest')}
          </button>
          <button 
            type="button"
            onClick={() => setIsReturning(true)}
            className="flex-1 py-4 rounded-2xl text-xs uppercase tracking-widest font-bold transition-all"
            style={{
              backgroundColor: isReturning ? TEXT_PRIMARY : 'transparent',
              color: isReturning ? BG_GRADIENT_CENTER : TEXT_SECONDARY
            }}
            onMouseEnter={(e) => {
              if (!isReturning) e.currentTarget.style.backgroundColor = BG_ORB_GOLDEN
            }}
            onMouseLeave={(e) => {
              if (!isReturning) e.currentTarget.style.backgroundColor = 'transparent'
            }}
          >
            {t('haveRegId')}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {isReturning ? (
            /* VISTA: RECUPERAR DATOS POR ID */
            <div className="p-12 rounded-[3rem] shadow-xl space-y-8 animate-in fade-in zoom-in-95 max-w-2xl mx-auto" style={{ backgroundColor: BG_ORB_GOLDEN, border: `1px solid ${BG_ORB_TERRACOTA}33` }}>
              <div className="text-center space-y-3">
                <h3 className="text-2xl font-black" style={{ color: TEXT_PRIMARY }}>{t('welcomeBack')}</h3>
                <p className="text-sm font-medium" style={{ color: TEXT_SECONDARY }}>{t('enterRegId')}</p>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-widest font-black ml-2" style={{ color: TEXT_SECONDARY }}>
                  {t('registrationId')}
                </label>
                <input 
                  required
                  type="text"
                  placeholder={t('regIdPlaceholder')}
                  className="w-full rounded-2xl p-6 outline-none text-lg font-bold transition-all"
                  style={{ 
                    backgroundColor: BG_GRADIENT_CENTER,
                    border: `2px solid ${BG_ORB_GOLDEN}`,
                    color: TEXT_PRIMARY
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = BG_ORB_TERRACOTA}
                  onBlur={(e) => e.currentTarget.style.borderColor = BG_ORB_GOLDEN}
                  value={registrationId}
                  onChange={(e) => setRegistrationId(e.target.value)}
                />
              </div>
              <button 
                type="submit"
                className="w-full py-6 rounded-[2rem] font-black uppercase tracking-widest text-xs transition-all shadow-xl active:scale-95"
                style={{ backgroundColor: BG_ORB_TERRACOTA, color: TEXT_PRIMARY }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.85'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                {t('autoFillConfirm')}
              </button>
            </div>
          ) : (
            /* VISTA: FORMULARIO COMPLETO PARA NUEVOS */
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
              {guests.map((guest, index) => (
                <section key={index} className="p-10 rounded-[3rem] shadow-sm space-y-10 relative" style={{ backgroundColor: BG_ORB_GOLDEN, border: `1px solid ${BG_ORB_TERRACOTA}33` }}>
                  <div className="flex justify-between items-center pb-6" style={{ borderBottom: `1px solid ${BG_ORB_GOLDEN}` }}>
                    <h3 className="text-lg font-black flex items-center gap-4" style={{ color: TEXT_PRIMARY }}>
                      <span className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-black" style={{ backgroundColor: TEXT_PRIMARY, color: BG_GRADIENT_CENTER }}>
                        {index + 1}
                      </span>
                      {t('guest')} {index + 1} {index === 0 && t('leadGuest')}
                    </h3>
                    
                    {index > 0 && (
                      <button 
                        type="button" 
                        onClick={() => removeGuest(index)}
                        className="text-[10px] font-black uppercase tracking-widest px-5 py-2 rounded-full transition-all"
                        style={{ color: '#dc2626', border: `2px solid #fee2e2` }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#fee2e2'
                          e.currentTarget.style.borderColor = '#fecaca'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent'
                          e.currentTarget.style.borderColor = '#fee2e2'
                        }}
                      >
                        ✕ {t('removeGuest')}
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                    <div className="space-y-3">
                      <label className="text-[10px] uppercase tracking-widest font-black ml-2" style={{ color: TEXT_SECONDARY }}>{t('firstName')}</label>
                      <input 
                        required 
                        className="w-full rounded-2xl p-5 font-bold outline-none transition-all"
                        style={{ 
                          backgroundColor: BG_GRADIENT_CENTER,
                          border: `2px solid ${BG_ORB_GOLDEN}`,
                          color: TEXT_PRIMARY
                        }}
                        onFocus={(e) => e.currentTarget.style.borderColor = BG_ORB_TERRACOTA}
                        onBlur={(e) => e.currentTarget.style.borderColor = BG_ORB_GOLDEN}
                        onChange={(e) => updateGuest(index, 'firstName', e.target.value)}
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] uppercase tracking-widest font-black ml-2" style={{ color: TEXT_SECONDARY }}>{t('lastName')}</label>
                      <input 
                        required 
                        className="w-full rounded-2xl p-5 font-bold outline-none transition-all"
                        style={{ 
                          backgroundColor: BG_GRADIENT_CENTER,
                          border: `2px solid ${BG_ORB_GOLDEN}`,
                          color: TEXT_PRIMARY
                        }}
                        onFocus={(e) => e.currentTarget.style.borderColor = BG_ORB_TERRACOTA}
                        onBlur={(e) => e.currentTarget.style.borderColor = BG_ORB_GOLDEN}
                        onChange={(e) => updateGuest(index, 'lastName', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <label className="text-[10px] uppercase tracking-widest font-black ml-2" style={{ color: TEXT_SECONDARY }}>{t('idType')}</label>
                      <select 
                        className="w-full rounded-2xl p-5 font-bold outline-none appearance-none cursor-pointer transition-all"
                        style={{ 
                          backgroundColor: BG_GRADIENT_CENTER,
                          border: `2px solid ${BG_ORB_GOLDEN}`,
                          color: TEXT_PRIMARY
                        }}
                        onFocus={(e) => e.currentTarget.style.borderColor = BG_ORB_TERRACOTA}
                        onBlur={(e) => e.currentTarget.style.borderColor = BG_ORB_GOLDEN}
                        onChange={(e) => updateGuest(index, 'idType', e.target.value as 'DNI' | 'Passport' | 'NIE')}
                      >
                        <option value="DNI">{t('idTypes.dni')}</option>
                        <option value="Passport">{t('idTypes.passport')}</option>
                        <option value="NIE">{t('idTypes.nie')}</option>
                      </select>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] uppercase tracking-widest font-black ml-2" style={{ color: TEXT_SECONDARY }}>{t('idNumber')}</label>
                      <input 
                        required 
                        className="w-full rounded-2xl p-5 font-bold outline-none transition-all"
                        style={{ 
                          backgroundColor: BG_GRADIENT_CENTER,
                          border: `2px solid ${BG_ORB_GOLDEN}`,
                          color: TEXT_PRIMARY
                        }}
                        onFocus={(e) => e.currentTarget.style.borderColor = BG_ORB_TERRACOTA}
                        onBlur={(e) => e.currentTarget.style.borderColor = BG_ORB_GOLDEN}
                        onChange={(e) => updateGuest(index, 'idNumber', e.target.value)}
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] uppercase tracking-widest font-black ml-2" style={{ color: TEXT_SECONDARY }}>{t('issueDate')}</label>
                      <input 
                        required
                        type="date" 
                        className="w-full rounded-2xl p-5 font-bold outline-none transition-all"
                        style={{ 
                          backgroundColor: BG_GRADIENT_CENTER,
                          border: `2px solid ${BG_ORB_GOLDEN}`,
                          color: TEXT_PRIMARY
                        }}
                        onFocus={(e) => e.currentTarget.style.borderColor = BG_ORB_TERRACOTA}
                        onBlur={(e) => e.currentTarget.style.borderColor = BG_ORB_GOLDEN}
                        onChange={(e) => updateGuest(index, 'idIssueDate', e.target.value)}
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] uppercase tracking-widest font-black ml-2" style={{ color: TEXT_SECONDARY }}>{t('birthDate')}</label>
                      <input 
                        required
                        type="date" 
                        className="w-full rounded-2xl p-5 font-bold outline-none transition-all"
                        style={{ 
                          backgroundColor: BG_GRADIENT_CENTER,
                          border: `2px solid ${BG_ORB_GOLDEN}`,
                          color: TEXT_PRIMARY
                        }}
                        onFocus={(e) => e.currentTarget.style.borderColor = BG_ORB_TERRACOTA}
                        onBlur={(e) => e.currentTarget.style.borderColor = BG_ORB_GOLDEN}
                        onChange={(e) => updateGuest(index, 'birthDate', e.target.value)}
                      />
                    </div>

                    <CountrySelect 
                      label={t('nationality')}
                      value={guest.nationality} 
                      onChange={(val) => updateGuest(index, 'nationality', val)} 
                    />

                    <div className="space-y-3">
                      <label className="text-[10px] uppercase tracking-widest font-black ml-2" style={{ color: TEXT_SECONDARY }}>{t('email')}</label>
                      <input 
                        required
                        type="email" 
                        className="w-full rounded-2xl p-5 font-bold outline-none transition-all"
                        style={{ 
                          backgroundColor: BG_GRADIENT_CENTER,
                          border: `2px solid ${BG_ORB_GOLDEN}`,
                          color: TEXT_PRIMARY
                        }}
                        onFocus={(e) => e.currentTarget.style.borderColor = BG_ORB_TERRACOTA}
                        onBlur={(e) => e.currentTarget.style.borderColor = BG_ORB_GOLDEN}
                        onChange={(e) => updateGuest(index, 'email', e.target.value)}
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] uppercase tracking-widest font-black ml-2" style={{ color: TEXT_SECONDARY }}>{t('phone')}</label>
                      <input 
                        required={index === 0}
                        type="tel" 
                        placeholder={t('phonePlaceholder')}
                        className="w-full rounded-2xl p-5 font-bold outline-none transition-all"
                        style={{ 
                          backgroundColor: BG_GRADIENT_CENTER,
                          border: `2px solid ${BG_ORB_GOLDEN}`,
                          color: TEXT_PRIMARY
                        }}
                        onFocus={(e) => e.currentTarget.style.borderColor = BG_ORB_TERRACOTA}
                        onBlur={(e) => e.currentTarget.style.borderColor = BG_ORB_GOLDEN}
                        onChange={(e) => updateGuest(index, 'phone', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Sección de dirección del viajero */}
                  <div className="pt-6" style={{ borderTop: `1px solid ${BG_ORB_GOLDEN}` }}>
                    <div className="space-y-6 p-6 rounded-2xl" style={{ backgroundColor: BG_GRADIENT_EDGE, borderLeft: `3px solid ${BG_ORB_TERRACOTA}` }}>
                      <h4 className="text-xs uppercase tracking-widest font-black" style={{ color: TEXT_PRIMARY }}>{t('addressSection')}</h4>
                      
                      <div className="grid grid-cols-1 gap-6">
                        <div className="space-y-3">
                          <label className="text-[10px] uppercase tracking-widest font-black ml-2" style={{ color: TEXT_SECONDARY }}>{t('street')}</label>
                          <input 
                            required
                            className="w-full rounded-2xl p-5 font-bold outline-none transition-all"
                            style={{ 
                              backgroundColor: BG_GRADIENT_CENTER,
                              border: `2px solid ${BG_ORB_GOLDEN}`,
                              color: TEXT_PRIMARY
                            }}
                            onFocus={(e) => e.currentTarget.style.borderColor = BG_ORB_TERRACOTA}
                            onBlur={(e) => e.currentTarget.style.borderColor = BG_ORB_GOLDEN}
                            onChange={(e) => {
                              const newGuests = [...guests]
                              newGuests[index].address.street = e.target.value
                              setGuests(newGuests)
                            }}
                          />
                        </div>

                        <div className="space-y-3">
                          <label className="text-[10px] uppercase tracking-widest font-black ml-2" style={{ color: TEXT_SECONDARY }}>{t('addressExtra')}</label>
                          <input 
                            className="w-full rounded-2xl p-5 font-bold outline-none transition-all"
                            style={{ 
                              backgroundColor: BG_GRADIENT_CENTER,
                              border: `2px solid ${BG_ORB_GOLDEN}`,
                              color: TEXT_PRIMARY
                            }}
                            onFocus={(e) => e.currentTarget.style.borderColor = BG_ORB_TERRACOTA}
                            onBlur={(e) => e.currentTarget.style.borderColor = BG_ORB_GOLDEN}
                            onChange={(e) => {
                              const newGuests = [...guests]
                              newGuests[index].address.extra = e.target.value
                              setGuests(newGuests)
                            }}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="space-y-3">
                            <label className="text-[10px] uppercase tracking-widest font-black ml-2" style={{ color: TEXT_SECONDARY }}>{t('country')}</label>
                            <CountrySelect 
                              label=""
                              value={guest.address.country} 
                              onChange={(val) => {
                                const newGuests = [...guests]
                                newGuests[index].address.country = val
                                setGuests(newGuests)
                              }}
                            />
                          </div>

                          <div className="space-y-3">
                            <label className="text-[10px] uppercase tracking-widest font-black ml-2" style={{ color: TEXT_SECONDARY }}>{t('city')}</label>
                            <input 
                              required
                              className="w-full rounded-2xl p-5 font-bold outline-none transition-all"
                              style={{ 
                                backgroundColor: BG_GRADIENT_CENTER,
                                border: `2px solid ${BG_ORB_GOLDEN}`,
                                color: TEXT_PRIMARY
                              }}
                              onFocus={(e) => e.currentTarget.style.borderColor = BG_ORB_TERRACOTA}
                              onBlur={(e) => e.currentTarget.style.borderColor = BG_ORB_GOLDEN}
                              onChange={(e) => {
                                const newGuests = [...guests]
                                newGuests[index].address.city = e.target.value
                                setGuests(newGuests)
                              }}
                            />
                          </div>

                          <div className="space-y-3">
                            <label className="text-[10px] uppercase tracking-widest font-black ml-2" style={{ color: TEXT_SECONDARY }}>{t('postalCode')}</label>
                            <input 
                              required
                              type="text"
                              pattern="[0-9]*"
                              className="w-full rounded-2xl p-5 font-bold outline-none transition-all"
                              style={{ 
                                backgroundColor: BG_GRADIENT_CENTER,
                                border: `2px solid ${BG_ORB_GOLDEN}`,
                                color: TEXT_PRIMARY
                              }}
                              onFocus={(e) => e.currentTarget.style.borderColor = BG_ORB_TERRACOTA}
                              onBlur={(e) => e.currentTarget.style.borderColor = BG_ORB_GOLDEN}
                              onChange={(e) => {
                                const newGuests = [...guests]
                                newGuests[index].address.postalCode = e.target.value
                                setGuests(newGuests)
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Checkbox de guardado de datos */}
                  <div className="pt-6">
                    <label className="flex items-center gap-5 p-6 rounded-[2rem] cursor-pointer transition-all group shadow-sm" style={{ backgroundColor: `${BG_ORB_TERRACOTA}15`, border: `1px solid ${BG_ORB_TERRACOTA}33` }}>
                      <input 
                        type="checkbox" 
                        className="w-7 h-7 rounded-xl cursor-pointer" 
                        style={{ accentColor: BG_ORB_TERRACOTA }}
                        onChange={(e) => updateGuest(index, 'saveData', e.target.checked)}
                      />
                      <div className="flex flex-col">
                        <span className="text-sm font-black" style={{ color: TEXT_PRIMARY }}>{t('saveForFuture')}</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: TEXT_SECONDARY }}>
                          Enable Fast Check-in next time
                        </span>
                      </div>
                    </label>
                  </div>
                </section>
              ))}

              <div className="space-y-6 pt-6">
                <button 
                  type="button"
                  onClick={addGuest} 
                  className="w-full py-7 rounded-[2.5rem] border-2 border-dashed font-black text-xs uppercase tracking-[0.2em] transition-all shadow-sm"
                  style={{ 
                    borderColor: BG_ORB_GOLDEN,
                    color: TEXT_SECONDARY,
                    backgroundColor: BG_GRADIENT_CENTER
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = BG_ORB_GOLDEN
                    e.currentTarget.style.borderColor = BG_ORB_TERRACOTA
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = BG_GRADIENT_CENTER
                    e.currentTarget.style.borderColor = BG_ORB_GOLDEN
                  }}
                >
                  + {t('addGuest')}
                </button>
                <button 
                  type="submit"
                  className="w-full py-8 rounded-[3rem] font-black uppercase tracking-[0.3em] text-xs shadow-2xl active:scale-[0.98] transition-all"
                  style={{ backgroundColor: TEXT_PRIMARY, color: BG_GRADIENT_CENTER }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '0.85'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                >
                  {isSubmitting ? 'Enviando...' : t('submitRegistration')}
                </button>
              </div>
            </div>
          )}
        </form>
        </div>
      )}
    </main>
  )
}
