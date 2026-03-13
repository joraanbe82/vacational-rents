'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Info, Check } from 'lucide-react'
import { BG_ORB_TERRACOTA, TEXT_PRIMARY, TEXT_SECONDARY, BG_ORB_GOLDEN, BG_GRADIENT_CENTER, REGEX_EMAIL, REGEX_PHONE } from '@/lib/constants'

interface BookingRequestModalProps {
  isOpen: boolean
  onClose: () => void
  propertyId: string
  propertyName: string
  checkInDate: string
  checkOutDate: string
  nights: number
}

export default function BookingRequestModal({
  isOpen,
  onClose,
  propertyId,
  propertyName,
  checkInDate,
  checkOutDate,
  nights
}: BookingRequestModalProps) {
  const t = useTranslations('booking')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [emailTouched, setEmailTouched] = useState(false)
  const [phoneTouched, setPhoneTouched] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const emailValid = REGEX_EMAIL.test(email)
  const phoneValid = REGEX_PHONE.test(phone)
  const isFormValid = emailValid && phoneValid && email.length > 0 && phone.length > 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/solicitudes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId,
          propertyName,
          checkInDate,
          checkOutDate,
          nights,
          email,
          phone
        })
      })

      const data = await res.json()

      if (data.success) {
        setIsSuccess(true)
      } else {
        alert(data.error || t('errorMessage'))
      }
    } catch {
      alert(t('errorMessage'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setEmail('')
    setPhone('')
    setEmailTouched(false)
    setPhoneTouched(false)
    setIsSuccess(false)
    onClose()
  }

  const handleEmailChange = (value: string) => {
    setEmail(value)
    if (emailTouched) {
      // Validar en onChange solo si ya fue tocado
    }
  }

  const handlePhoneChange = (value: string) => {
    setPhone(value)
    if (phoneTouched) {
      // Validar en onChange solo si ya fue tocado
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        {isSuccess ? (
          <div className="py-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center" style={{ backgroundColor: '#22c55e' }}>
              <Check size={32} color="white" strokeWidth={3} />
            </div>
            
            <div className="space-y-3">
              <h2 className="text-2xl font-black" style={{ color: TEXT_PRIMARY }}>
                {t('requestSent')}
              </h2>
              <p className="text-sm" style={{ color: TEXT_SECONDARY }}>
                {t('requestSentMessage')}
              </p>
            </div>

            <Button
              onClick={handleClose}
              className="w-full"
              style={{ backgroundColor: TEXT_PRIMARY, color: BG_GRADIENT_CENTER }}
            >
              {t('close')}
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-black" style={{ color: TEXT_PRIMARY }}>
                {t('requestBooking')}
              </DialogTitle>
            </DialogHeader>

            <div className="flex gap-3 p-4 rounded-xl" style={{ backgroundColor: `${BG_ORB_GOLDEN}33` }}>
              <Info size={20} style={{ color: BG_ORB_TERRACOTA, flexShrink: 0, marginTop: 2 }} />
              <p className="text-sm" style={{ color: TEXT_SECONDARY }}>
                {t('requestBookingSubtitle')}
              </p>
            </div>

            <div className="space-y-4 p-4 rounded-xl" style={{ backgroundColor: BG_GRADIENT_CENTER, border: `1px solid ${BG_ORB_GOLDEN}` }}>
              <div className="flex justify-between">
                <span className="text-xs uppercase tracking-widest font-bold" style={{ color: TEXT_SECONDARY }}>
                  {t('propertyName')}
                </span>
                <span className="text-sm font-bold" style={{ color: TEXT_PRIMARY }}>
                  {propertyName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs uppercase tracking-widest font-bold" style={{ color: TEXT_SECONDARY }}>
                  {t('checkInDate')}
                </span>
                <span className="text-sm font-bold" style={{ color: TEXT_PRIMARY }}>
                  {checkInDate}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs uppercase tracking-widest font-bold" style={{ color: TEXT_SECONDARY }}>
                  {t('checkOutDate')}
                </span>
                <span className="text-sm font-bold" style={{ color: TEXT_PRIMARY }}>
                  {checkOutDate}
                </span>
              </div>
              <div className="flex justify-between pt-2" style={{ borderTop: `1px solid ${BG_ORB_GOLDEN}` }}>
                <span className="text-xs uppercase tracking-widest font-bold" style={{ color: TEXT_SECONDARY }}>
                  {t('nights')}
                </span>
                <span className="text-lg font-black" style={{ color: BG_ORB_TERRACOTA }}>
                  {nights}
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <label className="text-xs uppercase tracking-widest font-bold" style={{ color: TEXT_SECONDARY }}>
                  {t('emailLabel')}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  onBlur={() => setEmailTouched(true)}
                  className="w-full p-4 rounded-xl outline-none transition-all"
                  style={{ 
                    backgroundColor: BG_GRADIENT_CENTER,
                    border: `2px solid ${emailTouched && !emailValid ? '#ef4444' : emailTouched && emailValid ? BG_ORB_TERRACOTA : BG_ORB_GOLDEN}`,
                    color: TEXT_PRIMARY
                  }}
                />
                {emailTouched && !emailValid && (
                  <p className="text-xs animate-in fade-in slide-in-from-top-1" style={{ color: '#ef4444' }}>
                    {t('emailError')}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <label className="text-xs uppercase tracking-widest font-bold" style={{ color: TEXT_SECONDARY }}>
                  {t('phoneLabel')}
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  onBlur={() => setPhoneTouched(true)}
                  className="w-full p-4 rounded-xl outline-none transition-all"
                  style={{ 
                    backgroundColor: BG_GRADIENT_CENTER,
                    border: `2px solid ${phoneTouched && !phoneValid ? '#ef4444' : phoneTouched && phoneValid ? BG_ORB_TERRACOTA : BG_ORB_GOLDEN}`,
                    color: TEXT_PRIMARY
                  }}
                />
                {phoneTouched && !phoneValid && (
                  <p className="text-xs animate-in fade-in slide-in-from-top-1" style={{ color: '#ef4444' }}>
                    {t('phoneError')}
                  </p>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  onClick={handleClose}
                  variant="outline"
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  {t('cancel')}
                </Button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-lg font-semibold transition-all duration-200"
                  style={{ 
                    backgroundColor: BG_ORB_TERRACOTA, 
                    color: TEXT_PRIMARY,
                    opacity: !isFormValid || isSubmitting ? 0.5 : 1,
                    pointerEvents: !isFormValid || isSubmitting ? 'none' : 'auto',
                    cursor: !isFormValid || isSubmitting ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isSubmitting ? t('sending') : t('sendRequest')}
                </button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
