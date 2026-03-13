'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useLocale, useTranslations } from 'next-intl'
import LanguageSwitcher from './LanguageSwitcher'
import { TEXT_PRIMARY, TEXT_SECONDARY, BG_ORB_TERRACOTA, NAVBAR_SCROLL_THRESHOLD, NAVBAR_BLUR_INITIAL, NAVBAR_BLUR_SCROLLED } from '@/lib/constants'
import { NavigationItem } from '@/types/api.types'

interface NavbarClientProps {
  navItems: NavigationItem[]
}

export default function NavbarClient({ navItems }: NavbarClientProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const locale = useLocale()
  const t = useTranslations('navbar')

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > NAVBAR_SCROLL_THRESHOLD)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const visibleItems = navItems.filter(item => item.visible || item.protected)

  const navLinks = visibleItems.map(item => ({
    key: item.id,
    href: `/${locale}${item.href === '/' ? '' : item.href}`
  }))

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        backgroundColor: isScrolled 
          ? `${BG_ORB_TERRACOTA}f7` 
          : `${BG_ORB_TERRACOTA}e6`,
        backdropFilter: isScrolled 
          ? `blur(${NAVBAR_BLUR_SCROLLED}px)` 
          : `blur(${NAVBAR_BLUR_INITIAL}px)`,
        boxShadow: isScrolled 
          ? `0 2px 20px rgba(84, 67, 57, 0.10)` 
          : 'none',
        transition: 'all 300ms ease'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop Layout: Logo centrado encima de pestañas */}
        <div className="hidden lg:block py-6">
          {/* Logo centrado */}
          <div className="flex justify-center mb-6">
            <Link href={`/${locale}`} className="flex items-center">
              <Image
                src="/images/logo.jpeg"
                alt="Costa del Sol"
                width={200}
                height={80}
                className="h-20 w-auto object-contain"
                priority
              />
            </Link>
          </div>

          {/* Pestañas centradas */}
          <div className="flex items-center justify-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.key}
                href={link.href}
                className="text-sm font-medium tracking-wide"
                style={{
                  color: TEXT_PRIMARY,
                  transition: 'all 200ms ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = TEXT_SECONDARY}
                onMouseLeave={(e) => e.currentTarget.style.color = TEXT_PRIMARY}
              >
                {t(link.key)}
              </Link>
            ))}
          </div>

          {/* Language Switcher en esquina superior derecha */}
          <div className="absolute top-6 right-8" style={{
            color: TEXT_PRIMARY
          }}>
            <LanguageSwitcher />
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden flex items-center justify-between h-20">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center">
            <Image
              src="/images/logo.jpeg"
              alt="Costa del Sol"
              width={150}
              height={60}
              className="h-12 w-auto object-contain"
              priority
            />
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-md"
            style={{
              color: TEXT_PRIMARY,
              transition: 'all 300ms ease'
            }}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t" style={{
          backgroundColor: BG_ORB_TERRACOTA,
          borderColor: TEXT_PRIMARY
        }}>
          <div className="px-4 py-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.key}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block font-medium transition-colors"
                style={{
                  color: TEXT_PRIMARY
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = TEXT_SECONDARY}
                onMouseLeave={(e) => e.currentTarget.style.color = TEXT_PRIMARY}
              >
                {t(link.key)}
              </Link>
            ))}
            <div className="pt-4 border-t" style={{
              borderColor: TEXT_PRIMARY
            }}>
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
