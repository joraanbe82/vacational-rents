'use client'

import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { TEXT_PRIMARY, TEXT_SECONDARY, BG_ORB_TERRACOTA } from '@/lib/constants'
import { ContactInfo } from '@/types/api.types'

interface FooterClientProps {
  contactInfo: ContactInfo
}

export default function FooterClient({ contactInfo }: FooterClientProps) {
  const locale = useLocale()
  const t = useTranslations('footer')
  const tNav = useTranslations('navbar')

  const currentYear = new Date().getFullYear()

  const navLinks = [
    { key: 'home', href: `/${locale}` },
    { key: 'guides', href: `/${locale}/guides` },
    { key: 'dayTrips', href: `/${locale}/day-trips` },
    { key: 'about', href: `/${locale}/about` },
    { key: 'homeOwner', href: `/${locale}/home-owner` },
    { key: 'contact', href: `/${locale}/contact` }
  ]

  return (
    <footer style={{ backgroundColor: BG_ORB_TERRACOTA }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo & Description */}
          <div>
            <h3 className="text-2xl font-light tracking-tight mb-4" style={{ color: TEXT_PRIMARY }}>
              {contactInfo.brandName}
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: TEXT_SECONDARY }}>
              {t('marbella')}
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: TEXT_PRIMARY }}>
              {t('navigation')}
            </h4>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.key}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors"
                    style={{ color: TEXT_SECONDARY }}
                    onMouseEnter={(e) => e.currentTarget.style.color = TEXT_PRIMARY}
                    onMouseLeave={(e) => e.currentTarget.style.color = TEXT_SECONDARY}
                  >
                    {tNav(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: TEXT_PRIMARY }}>
              {t('contact')}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <span style={{ color: TEXT_SECONDARY }}>{t('email')}:</span>
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="ml-2 transition-colors"
                  style={{ color: TEXT_SECONDARY }}
                  onMouseEnter={(e) => e.currentTarget.style.color = TEXT_PRIMARY}
                  onMouseLeave={(e) => e.currentTarget.style.color = TEXT_SECONDARY}
                >
                  {contactInfo.email}
                </a>
              </li>
              <li>
                <span style={{ color: TEXT_SECONDARY }}>{t('phone')}:</span>
                <a
                  href={`tel:${contactInfo.phone.replace(/\s/g, '')}`}
                  className="ml-2 transition-colors"
                  style={{ color: TEXT_SECONDARY }}
                  onMouseEnter={(e) => e.currentTarget.style.color = TEXT_PRIMARY}
                  onMouseLeave={(e) => e.currentTarget.style.color = TEXT_SECONDARY}
                >
                  {contactInfo.phone}
                </a>
              </li>
              <li style={{ color: TEXT_SECONDARY }}>
                {t('address')}:<br />
                {contactInfo.addressLine1}<br />
                {contactInfo.addressLine2}
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t text-center" style={{ borderColor: `${TEXT_PRIMARY}26` }}>
          <p className="text-sm" style={{ color: TEXT_SECONDARY }}>
            © {currentYear} {contactInfo.brandName}. {contactInfo.copyright}
          </p>
        </div>
      </div>
    </footer>
  )
}
