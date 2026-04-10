'use client';

import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { Building2, Mail, MapPin, Phone, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { LanguageSwitcher } from './LanguageSwitcher';

export function Footer() {
  const t = useTranslations('footer');
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300 border-t border-gray-700">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="p-1.5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl group-hover:scale-110 transition-transform">
                <svg width="24" height="24" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M 30 45 L 50 30 L 70 45 L 70 70 L 30 70 Z" fill="white"/>
                  <path d="M 25 45 L 50 25 L 75 45" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  <rect x="44" y="55" width="12" height="15" fill="#2563eb" rx="1"/>
                </svg>
              </div>
              <span className="text-xl font-black text-white">
                inhabitme
              </span>
            </Link>
            <p className="text-sm text-gray-300 leading-relaxed">
              {t('tagline', { defaultValue: 'Tu hogar perfecto para trabajar remoto. Alojamientos verificados con WiFi rápido en las mejores ciudades.' })}
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              <a 
                href="https://twitter.com/inhabitme" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 bg-gray-800 hover:bg-blue-600 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Follow us on Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="https://instagram.com/inhabitme" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 bg-gray-800 hover:bg-pink-600 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/carlos-alfaro-2802133ba"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-gray-800 hover:bg-blue-700 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Connect on LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Product Column */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
              {t('product', { defaultValue: 'Producto' })}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/search" className="text-sm hover:text-white transition-colors flex items-center gap-2">
                  {t('search', { defaultValue: 'Buscar alojamiento' })}
                </Link>
              </li>
              <li>
                <Link href="/madrid" className="text-sm hover:text-white transition-colors">
                  {t('cities.madrid', { defaultValue: 'Madrid' })}
                </Link>
              </li>
              <li>
                <Link href="/barcelona" className="text-sm hover:text-white transition-colors">
                  {t('cities.barcelona', { defaultValue: 'Barcelona' })}
                </Link>
              </li>
              <li>
                <Link href="/valencia" className="text-sm hover:text-white transition-colors">
                  {t('cities.valencia', { defaultValue: 'Valencia' })}
                </Link>
              </li>
              <li>
                <Link href="/lisboa" className="text-sm hover:text-white transition-colors">
                  {t('cities.lisboa', { defaultValue: 'Lisboa' })}
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
              {t('company', { defaultValue: 'Empresa' })}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/blog" className="text-sm hover:text-white transition-colors">
                  {t('blog', { defaultValue: 'Blog' })}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm hover:text-white transition-colors">
                  {t('about', { defaultValue: 'Sobre nosotros' })}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm hover:text-white transition-colors">
                  {t('contact', { defaultValue: 'Contacto' })}
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm hover:text-white transition-colors">
                  {t('faq', { defaultValue: 'Preguntas frecuentes' })}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
              {t('legal', { defaultValue: 'Legal' })}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/privacy" className="text-sm hover:text-white transition-colors">
                  {t('privacy', { defaultValue: 'Política de privacidad' })}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm hover:text-white transition-colors">
                  {t('terms', { defaultValue: 'Términos de servicio' })}
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-sm hover:text-white transition-colors">
                  {t('cookies', { defaultValue: 'Política de cookies' })}
                </Link>
              </li>
            </ul>

            {/* Contact Info */}
            <div className="mt-6 space-y-2">
              <a 
                href="mailto:contact@inhabitme.com" 
                className="text-xs hover:text-white transition-colors flex items-center gap-2"
              >
                <Mail className="h-3 w-3" />
                contact@inhabitme.com
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              © {currentYear} <span className="text-white font-semibold">inhabitme</span>. {t('rights', { defaultValue: 'Todos los derechos reservados.' })}
            </p>
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              <p className="text-xs text-gray-400">
                {t('made', { defaultValue: 'Hecho con ❤️ para nómadas digitales' })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
