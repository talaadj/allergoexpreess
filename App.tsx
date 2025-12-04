import React, { useState, useEffect, lazy, Suspense } from 'react';
import { ChatInterface } from './components/ChatInterface';
import { LiveInterface } from './components/LiveInterface';
import { FloatingSidebar } from './components/FloatingSidebar';
import { ServiceGrid } from './components/ServiceGrid';
import { FAQSection } from './components/FAQSection';
import { PriceCalculator } from './components/PriceCalculator';

// Lazy load heavy modal components
const ReferralModal = lazy(() => import('./components/ReferralModal').then(m => ({ default: m.ReferralModal })));
const ResultsModal = lazy(() => import('./components/ResultsModal').then(m => ({ default: m.ResultsModal })));
const LicenseModal = lazy(() => import('./components/LicenseModal').then(m => ({ default: m.LicenseModal })));
const ServiceModal = lazy(() => import('./components/ServiceModal').then(m => ({ default: m.ServiceModal })));
const PrivacyModal = lazy(() => import('./components/PrivacyModal').then(m => ({ default: m.PrivacyModal })));
const FeedbackModal = lazy(() => import('./components/FeedbackModal').then(m => ({ default: m.FeedbackModal })));
const BookingModal = lazy(() => import('./components/BookingModal').then(m => ({ default: m.BookingModal })));
const AdminPanel = lazy(() => import('./components/AdminPanel').then(m => ({ default: m.AdminPanel })));
const PromotionBanner = lazy(() => import('./components/PromotionBanner').then(m => ({ default: m.PromotionBanner })));
import { AppMode, Language, GeoLocation } from './types';
import { TRANSLATIONS } from './utils/translations';

function App() {
  const [mode, setMode] = useState<AppMode>(AppMode.CHAT);
  const [lang, setLang] = useState<Language>('ru');
  const [showReferral, setShowReferral] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showLicense, setShowLicense] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showPromotion, setShowPromotion] = useState(false);
  const [activeService, setActiveService] = useState<string | null>(null);
  const [location, setLocation] = useState<GeoLocation | null>(null);
  const [isAIDrawerOpen, setIsAIDrawerOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const t = TRANSLATIONS[lang] || TRANSLATIONS['ru'];

  if (!t) {
    console.error("Critical Error: Translations not found for lang:", lang);
    return <div className="p-4 text-red-600">Error loading translations. Please refresh.</div>;
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.log("Geolocation error:", error);
        }
      );
    }
  }, []);

  const scrollToLocations = () => {
    const element = document.getElementById('locations-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const serviceItems = [
    {
      id: 'results',
      title: t.ui.btnGetResults,
      icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
      color: 'bg-green-500',
      onClick: () => setShowResults(true)
    },
    {
      id: 'news',
      title: t.ui.gridNews,
      icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>,
      color: 'bg-lime-600',
      onClick: () => window.open('https://www.instagram.com/allergoexpressimmunolab/', '_blank')
    },
    {
      id: 'promotions',
      title: t.ui.gridPromotions,
      icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg>,
      color: 'bg-lime-500',
      onClick: () => setShowPromotion(true)
    },
    {
      id: 'tests',
      title: t.ui.gridTests,
      icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>,
      color: 'bg-lime-600',
      onClick: () => setShowReferral(true)
    },
    {
      id: 'locations',
      title: t.ui.gridLocations,
      icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
      color: 'bg-lime-500',
      onClick: scrollToLocations
    },
    {
      id: 'method',
      title: t.ui.methodTitle,
      icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>,
      color: 'bg-indigo-500',
      onClick: () => setActiveService('method')
    },
    {
      id: 'partnership',
      title: t.ui.partnershipTitle,
      icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
      color: 'bg-emerald-500',
      onClick: () => setShowFeedback(true)
    },
    {
      id: 'about',
      title: t.ui.navAbout,
      icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
      color: 'bg-blue-500',
      onClick: () => setActiveService('about')
    },
    {
      id: 'support',
      title: t.ui.support,
      icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
      color: 'bg-rose-500',
      onClick: () => setShowFeedback(true)
    },
  ];

  useEffect(() => {
    // Secret gesture to open admin panel (Ctrl + Shift + A)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        setShowAdmin(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen w-full bg-slate-50 font-sans text-slate-900 overflow-x-hidden flex flex-col">

      {/* Top Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <img src="/logo-full.png" alt="AllergoExpress ImmunoLab" className="h-12 md:h-14" />
          </div>

          {/* Phones & Menu */}
          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col items-end text-sm font-medium text-slate-600">
              <a href="tel:87075668899" className="hover:text-rose-600 transition-colors">8 707 566 88 99</a>
            </div>

            {/* Language Switcher */}
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as Language)}
              className="bg-slate-100 border-none text-slate-700 text-sm rounded-lg focus:ring-rose-500 block p-2 outline-none cursor-pointer"
            >
              <option value="ru">RU</option>
              <option value="kk">KK</option>
              <option value="en">EN</option>
            </select>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden bg-rose-500 hover:bg-rose-600 text-white p-3 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>

            {/* Desktop AI Button */}
            <button
              onClick={() => setIsAIDrawerOpen(true)}
              className="hidden md:block bg-lime-500 hover:bg-lime-600 text-white p-3 rounded-lg transition-colors min-w-[44px] min-h-[44px]"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-200 animate-fade-in">
            <div className="px-4 py-4 space-y-3">
              <button
                onClick={() => { setIsAIDrawerOpen(true); setIsMobileMenuOpen(false); }}
                className="w-full bg-lime-500 hover:bg-lime-600 text-white px-4 py-3 rounded-lg font-semibold transition-colors min-h-[44px] flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                AI Ассистент
              </button>
              <a
                href="tel:+77075668899"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg font-semibold transition-colors min-h-[44px] flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                +7 707 566 8899
              </a>
              <button
                onClick={() => { setShowBooking(true); setIsMobileMenuOpen(false); }}
                className="w-full bg-rose-500 hover:bg-rose-600 text-white px-4 py-3 rounded-lg font-semibold transition-colors min-h-[44px]"
              >
                📅 Записаться на анализ
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Search Bar */}
      <div className="bg-white py-6 border-b border-slate-100 shadow-sm sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4">
          <div className="relative">
            <input
              type="text"
              placeholder={t.ui.searchPlaceholder}
              className="w-full pl-6 pr-12 py-4 rounded-full border border-slate-200 bg-slate-50 focus:bg-white focus:border-rose-500 focus:ring-4 focus:ring-rose-100 outline-none text-lg transition-all shadow-inner"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-rose-600 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </button>
          </div>
        </div>
      </div>

      {/* Hero Carousel Section */}
      <div className="relative bg-white overflow-hidden h-auto md:h-[400px]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row h-full">
          {/* Left Side - Carousel Images */}
          <div className="w-full md:w-1/2 h-[300px] md:h-auto overflow-hidden relative">
            <div className="relative w-full h-full">
              <div
                className="flex transition-transform duration-700 ease-in-out h-full"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                <div className="min-w-full h-full flex-shrink-0">
                  <img src="/carousel-hero.jpg" alt="Laboratory" className="w-full h-full object-cover" />
                </div>
                <div className="min-w-full h-full flex-shrink-0">
                  <img src="/carousel-promo.png" alt="Promotion" className="w-full h-full object-cover" />
                </div>
                <div className="min-w-full h-full flex-shrink-0">
                  <img src="/carousel-express.png" alt="Express" className="w-full h-full object-cover" />
                </div>
                <div className="min-w-full h-full flex-shrink-0">
                  <img src="/carousel-team.jpg" alt="Medical Team" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
            {/* Overlay Gradient for text readability if needed, or just style */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent md:hidden"></div>
          </div>

          {/* Right Side - Text Content */}
          <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center relative z-10 bg-white">
            <div className="transition-opacity duration-500" style={{ opacity: 1 }}>
              {currentSlide === 0 && (
                <>
                  <h2 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight animate-fade-in-up">
                    {t.ui.heroTitle} <br />
                    <span className="text-slate-400">{t.ui.heroSubtitle}</span>
                  </h2>
                  <p className="text-slate-500 text-lg mb-8 max-w-lg animate-fade-in-up delay-100">
                    {t.ui.heroDesc}
                  </p>
                  <div className="flex gap-4 animate-fade-in-up delay-200">
                    <button
                      onClick={() => setShowReferral(true)}
                      className="bg-rose-600 hover:bg-rose-700 text-white px-6 py-4 rounded-lg font-semibold transition-colors shadow-lg hover:shadow-xl min-h-[48px] min-w-[160px] text-base"
                    >
                      {t.ui.btnGetReferral}
                    </button>
                    <button
                      onClick={() => setShowResults(true)}
                      className="bg-white hover:bg-slate-50 text-slate-900 px-6 py-4 rounded-lg font-semibold transition-colors border-2 border-slate-200 min-h-[48px] min-w-[160px] text-base"
                    >
                      {t.ui.btnGetResults}
                    </button>
                  </div>
                </>
              )}
              {currentSlide === 1 && (
                <>
                  <h2 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight animate-fade-in-up">
                    {t.ui.heroExpressTitle} <br />
                    <span className="text-lime-600">{t.ui.heroExpressSubtitle}</span>
                  </h2>
                  <p className="text-slate-500 text-lg mb-8 max-w-lg animate-fade-in-up delay-100">
                    {t.ui.heroExpressDesc}
                  </p>
                  <div className="flex gap-4 animate-fade-in-up delay-200">
                    <button
                      onClick={() => setShowReferral(true)}
                      className="bg-lime-500 hover:bg-lime-600 text-white px-8 py-4 rounded-lg font-semibold transition-colors shadow-lg hover:shadow-lime-200"
                    >
                      {t.ui.btnGetResults}
                    </button>
                  </div>
                </>
              )}
              {currentSlide === 2 && (
                <>
                  <h2 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight animate-fade-in-up">
                    {t.ui.navAbout} <br />
                    <span className="text-blue-500">Наша Команда</span>
                  </h2>
                  <p className="text-slate-500 text-lg mb-8 max-w-lg animate-fade-in-up delay-100">
                    Профессиональные врачи и лаборанты с многолетним опытом работы в аллергологии.
                  </p>
                  <div className="flex gap-4 animate-fade-in-up delay-200">
                    <button
                      onClick={() => setActiveService('about')}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold transition-colors shadow-lg hover:shadow-blue-200"
                    >
                      Узнать больше
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className="flex gap-2 mt-8">
              {[0, 1, 2].map((idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${currentSlide === idx ? 'w-24 bg-lime-500' : 'w-8 bg-slate-200 hover:bg-slate-300'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Service Grid */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <ServiceGrid items={serviceItems} />
        </div>
      </div>

      {/* Locations Section */}
      <div id="locations-section" className="bg-slate-50 py-16 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Наши филиалы</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {t.branches.map((branch, index) => (
              <div key={index} className="bg-white p-6 rounded-lg border border-slate-200">
                <h3 className="font-bold text-slate-800 mb-2">{branch.address}</h3>
                <a href={`tel:${branch.phone}`} className="text-rose-600 hover:text-rose-700">
                  {branch.phone}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Price Calculator */}
      <PriceCalculator lang={lang} onBooking={() => setShowBooking(true)} />

      {/* FAQ Section */}
      <FAQSection lang={lang} />

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-white font-bold text-lg mb-4">О компании</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => setActiveService('about')} className="hover:text-white">О лаборатории</button></li>
                <li><button onClick={() => setShowLicense(true)} className="hover:text-white">Лицензии</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold text-lg mb-4">Для клиентов</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => setShowResults(true)} className="hover:text-white">Получение результатов</button></li>
                <li><button onClick={() => setShowPrivacy(true)} className="hover:text-white">Политика конфиденциальности</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold text-lg mb-4">Сотрудничество</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => setShowFeedback(true)} className="hover:text-white">Партнерам</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold text-lg mb-4">Контакты</h4>
              <ul className="space-y-2 text-sm">
                <li>+7 707 566 8899</li>
                <li>allergoexpressmed@gmail.com</li>
                <li>г. Алматы, ул. Шагабутдинова 132</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-xs">
            © {new Date().getFullYear()} AllergoExpress ImmunoLab. Все права защищены
            <button onClick={() => setShowAdmin(true)} className="ml-4 text-slate-700 hover:text-slate-500 opacity-30 hover:opacity-100 transition-opacity">⚙️</button>
          </div>
        </div>
      </footer>

      {/* AI Drawer */}
      <div className={`fixed top-0 right-0 h-[100dvh] w-full md:w-[480px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${isAIDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="h-full flex flex-col">
          {/* Drawer Header */}
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white">
            <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              AI Ассистент
            </h3>
            <button
              onClick={() => setIsAIDrawerOpen(false)}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-hidden">
            {mode === AppMode.CHAT ? (
              <ChatInterface location={location} lang={lang} />
            ) : (
              <LiveInterface onClose={() => setMode(AppMode.CHAT)} />
            )}
          </div>
        </div>
      </div>

      {/* Overlay Backdrop for Drawer */}
      {isAIDrawerOpen && (
        <div
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40"
          onClick={() => setIsAIDrawerOpen(false)}
        />
      )}

      {/* Floating Sidebar Trigger (if drawer is closed) */}
      {!isAIDrawerOpen && (
        <FloatingSidebar
          onOpenAI={() => setIsAIDrawerOpen(true)}
          onOpenLive={() => {
            setMode(AppMode.LIVE);
            setIsAIDrawerOpen(true);
          }}
        />
      )}

      {/* Modals - Lazy loaded with Suspense */}
      <Suspense fallback={null}>
        <ReferralModal isOpen={showReferral} onClose={() => setShowReferral(false)} lang={lang} />
        <LicenseModal isOpen={showLicense} onClose={() => setShowLicense(false)} lang={lang} />
        <PrivacyModal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} lang={lang} />
        <FeedbackModal isOpen={showFeedback} onClose={() => setShowFeedback(false)} lang={lang} />
        <BookingModal isOpen={showBooking} onClose={() => setShowBooking(false)} lang={lang} />
        <ServiceModal isOpen={!!activeService} onClose={() => setActiveService(null)} serviceId={activeService || ''} lang={lang} />
        <PromotionBanner isOpen={showPromotion} onClose={() => setShowPromotion(false)} lang={lang} />
        {showAdmin && <AdminPanel lang={lang} onClose={() => setShowAdmin(false)} />}
        {showResults && (
          <ResultsModal
            onClose={() => {
              setShowResults(false);
              try {
                const url = new URL(window.location.href);
                url.searchParams.delete('orderId');
                window.history.replaceState({}, '', url.toString());
              } catch (e) {
                console.error('Error clearing URL:', e);
                window.history.replaceState({}, '', window.location.pathname);
              }
            }}
            initialOrderId={new URLSearchParams(window.location.search).get('orderId') || undefined}
            lang={lang}
          />
        )}
      </Suspense>
    </div>
  );
}

export default App;