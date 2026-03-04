'use client'

import React, { useState, use } from 'react'
import Link from 'next/link'
import CountrySelect from '@/components/CountrySelect'

interface GuestData {
  firstName: string;
  lastName: string;
  idType: 'DNI' | 'Passport' | 'NIE';
  idNumber: string;
  idIssueDate: string;
  birthDate: string;
  nationality: string;
  email: string;
  saveData: boolean;
}

export default function CheckInPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [isReturning, setIsReturning] = useState(false)
  const [registrationId, setRegistrationId] = useState('')
  const [guests, setGuests] = useState<GuestData[]>([{
    firstName: '', 
    lastName: '', 
    idType: 'DNI', 
    idNumber: '', 
    idIssueDate: '', 
    birthDate: '', 
    nationality: 'Spain', 
    email: '', 
    saveData: false
  }])

  const addGuest = () => {
    setGuests([...guests, { 
      firstName: '', 
      lastName: '', 
      idType: 'DNI', 
      idNumber: '', 
      idIssueDate: '', 
      birthDate: '', 
      nationality: 'Spain', 
      email: '', 
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Datos para enviar al equipo de Java:', {
      reservationId: id,
      isReturning,
      registrationId: isReturning ? registrationId : null,
      guests: isReturning ? null : guests
    })
    alert('Registration submitted successfully')
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-32">
      {/* Navegación Superior */}
      <nav className="w-full bg-white border-b border-slate-200 py-6 px-8 mb-12">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-slate-900 hover:text-blue-700 transition-all group"
          >
            <svg 
              width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
              strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
              className="group-hover:-translate-x-1 transition-transform"
            >
              <path d="m15 18-6-6 6-6"/>
            </svg>
            <span className="text-sm font-bold uppercase tracking-widest">Back to Gallery</span>
          </Link>
          
          <div className="hidden md:block">
            <span className="text-[10px] uppercase tracking-[0.4em] text-slate-400 font-black">
              Property ID: {id}
            </span>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 space-y-10">
        <header className="text-center space-y-4">
          <span className="text-[10px] uppercase tracking-[0.5em] text-blue-700 font-black">
            Official Registration
          </span>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Check-in Online
          </h1>
          <p className="text-slate-700 max-w-md mx-auto text-sm font-medium">
            According to Spanish law (RD 933/2021), we need to register all guests staying at our properties.
          </p>
        </header>

        {/* Selector de Cliente: Nuevo o Habitual */}
        <div className="flex bg-white p-2 rounded-3xl border border-slate-200 shadow-sm max-w-md mx-auto">
          <button 
            type="button"
            onClick={() => setIsReturning(false)}
            className={`flex-1 py-4 rounded-2xl text-xs uppercase tracking-widest font-bold transition-all ${!isReturning ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
          >
            New Guest
          </button>
          <button 
            type="button"
            onClick={() => setIsReturning(true)}
            className={`flex-1 py-4 rounded-2xl text-xs uppercase tracking-widest font-bold transition-all ${isReturning ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
          >
            I have a Reg ID
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {isReturning ? (
            /* VISTA: RECUPERAR DATOS POR ID */
            <div className="bg-white p-12 rounded-[3rem] border border-slate-200 shadow-xl space-y-8 animate-in fade-in zoom-in-95 max-w-2xl mx-auto">
              <div className="text-center space-y-3">
                <h3 className="text-2xl font-black text-slate-900">Welcome back</h3>
                <p className="text-slate-600 text-sm font-medium">Enter your Registration ID to retrieve your data.</p>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-widest text-slate-900 font-black ml-2">
                  Registration ID
                </label>
                <input 
                  required
                  type="text"
                  placeholder="e.g. REG-2026-XXXX"
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-2xl p-6 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 text-lg font-bold transition-all placeholder:text-slate-300"
                  value={registrationId}
                  onChange={(e) => setRegistrationId(e.target.value)}
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-blue-600 text-white py-6 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95"
              >
                Auto-fill & Confirm
              </button>
            </div>
          ) : (
            /* VISTA: FORMULARIO COMPLETO PARA NUEVOS */
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
              {guests.map((guest, index) => (
                <section key={index} className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-10 relative">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-6">
                    <h3 className="text-lg font-black text-slate-900 flex items-center gap-4">
                      <span className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-black">
                        {index + 1}
                      </span>
                      Guest Information {index === 0 && "(Lead Guest)"}
                    </h3>
                    
                    {index > 0 && (
                      <button 
                        type="button" 
                        onClick={() => removeGuest(index)}
                        className="text-red-600 text-[10px] font-black uppercase tracking-widest border-2 border-red-50 px-5 py-2 rounded-full hover:bg-red-50 hover:border-red-100 transition-all"
                      >
                        ✕ Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                    <div className="space-y-3">
                      <label className="text-[10px] uppercase tracking-widest text-slate-900 font-black ml-2">First Name</label>
                      <input 
                        required 
                        className="w-full border-2 border-slate-200 rounded-2xl p-5 text-slate-900 font-bold outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-600 transition-all"
                        onChange={(e) => updateGuest(index, 'firstName', e.target.value)}
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] uppercase tracking-widest text-slate-900 font-black ml-2">Last Names</label>
                      <input 
                        required 
                        className="w-full border-2 border-slate-200 rounded-2xl p-5 text-slate-900 font-bold outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-600 transition-all"
                        onChange={(e) => updateGuest(index, 'lastName', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <label className="text-[10px] uppercase tracking-widest text-slate-900 font-black ml-2">Document Type</label>
                      <select 
                        className="w-full border-2 border-slate-200 rounded-2xl p-5 text-slate-900 font-bold outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-600 bg-white appearance-none cursor-pointer"
                        onChange={(e) => updateGuest(index, 'idType', e.target.value as any)}
                      >
                        <option value="DNI">DNI (Spanish ID)</option>
                        <option value="Passport">Passport</option>
                        <option value="NIE">Foreigner ID</option>
                      </select>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] uppercase tracking-widest text-slate-900 font-black ml-2">ID Number</label>
                      <input 
                        required 
                        className="w-full border-2 border-slate-200 rounded-2xl p-5 text-slate-900 font-bold outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-600 transition-all"
                        onChange={(e) => updateGuest(index, 'idNumber', e.target.value)}
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] uppercase tracking-widest text-slate-900 font-black ml-2">Date of Issue</label>
                      <input 
                        required
                        type="date" 
                        className="w-full border-2 border-slate-200 rounded-2xl p-5 text-slate-900 font-bold outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-600"
                        onChange={(e) => updateGuest(index, 'idIssueDate', e.target.value)}
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] uppercase tracking-widest text-slate-900 font-black ml-2">Birth Date</label>
                      <input 
                        required
                        type="date" 
                        className="w-full border-2 border-slate-200 rounded-2xl p-5 text-slate-900 font-bold outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-600"
                        onChange={(e) => updateGuest(index, 'birthDate', e.target.value)}
                      />
                    </div>

                    <CountrySelect 
                      label="Nationality" 
                      value={guest.nationality} 
                      onChange={(val) => updateGuest(index, 'nationality', val)} 
                    />

                    <div className="space-y-3">
                      <label className="text-[10px] uppercase tracking-widest text-slate-900 font-black ml-2">Email</label>
                      <input 
                        required
                        type="email" 
                        className="w-full border-2 border-slate-200 rounded-2xl p-5 text-slate-900 font-bold outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-600"
                        onChange={(e) => updateGuest(index, 'email', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Checkbox de guardado de datos */}
                  <div className="pt-6">
                    <label className="flex items-center gap-5 p-6 bg-blue-50/40 border border-blue-100 rounded-[2rem] cursor-pointer hover:bg-blue-50 transition-all group shadow-sm">
                      <input 
                        type="checkbox" 
                        className="w-7 h-7 rounded-xl border-2 border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" 
                        onChange={(e) => updateGuest(index, 'saveData', e.target.checked)}
                      />
                      <div className="flex flex-col">
                        <span className="text-sm text-slate-900 font-black">Save my info for future stays</span>
                        <span className="text-[10px] text-blue-700 font-bold uppercase tracking-widest">
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
                  className="w-full py-7 rounded-[2.5rem] border-2 border-dashed border-slate-300 text-slate-600 font-black text-xs uppercase tracking-[0.2em] bg-white hover:bg-slate-50 hover:border-slate-400 transition-all shadow-sm"
                >
                  + Add Another Guest
                </button>
                <button 
                  type="submit"
                  className="w-full bg-slate-900 text-white py-8 rounded-[3rem] font-black uppercase tracking-[0.3em] text-xs shadow-2xl hover:bg-black active:scale-[0.98] transition-all"
                >
                  Submit Official Registration
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </main>
  )
}