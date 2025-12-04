import React, { useState, useEffect } from 'react';
import { ChatInterface } from './components/ChatInterface';
import { LiveInterface } from './components/LiveInterface';
import { ReferralModal } from './components/ReferralModal';
import { ResultsModal } from './components/ResultsModal';
import { LicenseModal } from './components/LicenseModal';
import { ServiceModal } from './components/ServiceModal';
import { PrivacyModal } from './components/PrivacyModal';
import { FloatingSidebar } from './components/FloatingSidebar';
import { ServiceGrid } from './components/ServiceGrid';
import { FeedbackModal } from './components/FeedbackModal';
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
  const [activeService, setActiveService] = useState<string | null>(null);
  const [location, setLocation] = useState<GeoLocation | null>(null);
  const [isAIDrawerOpen, setIsAIDrawerOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const t = TRANSLATIONS[lang];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 2);
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
      onClick: () => window.open('https://www.instagram.com/immunolab.kz/', '_blank')
    },
    {
      id: 'promotions',
      title: t.ui.gridPromotions,
      icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg>,
      color: 'bg-lime-500',
      onClick: () => setActiveService('promotions')
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

  return (
    <div className="min-h-screen w-full bg-white font-sans text-slate-900 overflow-x-hidden flex flex-col">

      {/* Minimalist Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center">
              <img src="/logo-full.png" alt="AllergoExpress ImmunoLab" className="h-10 md:h-12" />
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
              <button onClick={() => setShowReferral(true)} className="text-slate-700 hover:text-rose-600 transition-colors">
                Анализы и цены
              </button>
              <button onClick={() => setActiveService('about')} className="text-slate-700 hover:text-rose-600 transition-colors">
                О нас
              </button>
              <button onClick={scrollToLocations} className="text-slate-700 hover:text-rose-600 transition-colors">
                Контакты
              </button>
            </nav>

            {/* Right Side: Phone + Button */}
            <div className="flex items-center gap-4">
              <div className="hidden lg:flex flex-col items-end">
                <a href="tel:87075668899" className="text-slate-900 font-semibold text-lg hover:text-rose-600 transition-colors">
                  +7 707 566 8899
                </a>
                <span className="text-xs text-slate-500">пн-пт 8:00-19:00, сб 8:00-14:00</span>
              </div>
              <button
                onClick={() => setShowResults(true)}
                className="bg-rose-600 hover:bg-rose-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-sm"
              >
                Получить результаты
              </button>
            </div>
          </div>
        </div>
      </header>


      {/* Simple Hero Section */}
      <div className="bg-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
              Лаборатория <br />
              <span className="text-rose-600">аллергодиагностики</span>
            </h1>
            <p className="text-lg text-slate-600 mb-8 max-w-2xl">
              Современная лаборатория, специализирующаяся на диагностике аллергенов методом ИФА.
              Точность 95%, результаты в день обращения.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setShowReferral(true)}
                className="bg-rose-600 hover:bg-rose-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors shadow-sm"
              >
                Сдать анализы
              </button>
              <button
                onClick={() => setShowResults(true)}
                className="bg-white hover:bg-slate-50 text-slate-700 px-8 py-4 rounded-lg font-semibold transition-colors border border-slate-200"
              >
                Получить результаты
              </button>
            </div>
          </div>
        </div>
      </div>

    </p>
                </>
              )
}
            </div >

  <div className="flex gap-2 mt-8">
    {[0, 1, 2].map((idx) => (
      <button
        key={idx}
        onClick={() => setCurrentSlide(idx)}
        className={`h-2 rounded-full transition-all duration-300 ${currentSlide === idx ? 'w-24 bg-lime-500' : 'w-8 bg-slate-200 hover:bg-slate-300'}`}
      />
    ))}
  </div>
          </div >

  {/* Decorative Image Placeholder */ }
  < div className = {`absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l transition-colors duration-500 hidden md:block ${currentSlide === 0 ? 'from-rose-50' : currentSlide === 1 ? 'from-pink-50' : 'from-lime-50'
    } to-transparent`}></div >
      <div className={`absolute -right-20 -bottom-40 w-96 h-96 rounded-full blur-3xl opacity-50 transition-colors duration-500 ${currentSlide === 0 ? 'bg-lime-100' : currentSlide === 1 ? 'bg-rose-100' : 'bg-green-100'
        }`}></div>
        </div >
      </div >

  {/* About Us Section */ }
  < div className = "py-24 bg-white relative overflow-hidden" >
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-6 tracking-tight">{t.ui.aboutSectionTitle}</h2>
            <div className="w-24 h-1 bg-rose-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { text: t.ui.aboutPoint1, icon: "🏥", title: "Современность" },
              { text: t.ui.aboutPoint2, icon: "📍", title: "Доступность" },
              { text: t.ui.aboutPoint3, icon: "🎯", title: "Цель" },
            ].map((item, idx) => (
              <div key={idx} className="group p-8 rounded-3xl bg-slate-50 hover:bg-white border border-slate-100 hover:border-rose-100 hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform duration-300 text-rose-500 border border-slate-100">
                    {item.icon}
                  </div>
                  <p className="text-slate-700 font-medium text-lg leading-relaxed">
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div >

  {/* Advantages Section */ }
  < div className = "py-24 bg-slate-900 relative overflow-hidden" >
    {/* Abstract Background Shapes */ }
    < div className = "absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none" >
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-rose-500 rounded-full blur-3xl mix-blend-screen"></div>
          <div className="absolute top-1/2 right-0 w-64 h-64 bg-blue-500 rounded-full blur-3xl mix-blend-screen"></div>
        </div >

  <div className="max-w-7xl mx-auto px-4 relative z-10">
    <div className="text-center mb-16">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t.ui.advantagesTitle}</h2>
      <div className="w-20 h-1 bg-rose-500 mx-auto rounded-full"></div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[
        { title: t.ui.adv1Title, desc: t.ui.adv1Desc, icon: "🔬", color: "from-blue-500 to-cyan-400" },
        { title: t.ui.adv2Title, desc: t.ui.adv2Desc, icon: "👨‍⚕️", color: "from-emerald-500 to-teal-400" },
        { title: t.ui.adv3Title, desc: t.ui.adv3Desc, icon: "⚡", color: "from-amber-500 to-orange-400" },
        { title: t.ui.adv4Title, desc: t.ui.adv4Desc, icon: "🚀", color: "from-rose-500 to-pink-400" },
      ].map((item, idx) => (
        <div key={idx} className="group bg-slate-800/50 backdrop-blur-sm p-8 rounded-3xl border border-slate-700 hover:border-slate-600 hover:bg-slate-800 transition-all duration-300 hover:-translate-y-1">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-2xl mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            {item.icon}
          </div>
          <h3 className="font-bold text-xl text-white mb-3">{item.title}</h3>
          <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
        </div>
      ))}
    </div>
  </div>
      </div >

  {/* Service Grid */ }
  < div className = "pb-24" >
    <ServiceGrid items={serviceItems} />
      </div >

  {/* Locations Section */ }
  < div id = "locations-section" className = "bg-white py-16 border-t border-slate-100" >
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">{t.ui.locationsTitle}</h2>
        <p className="text-slate-500">{t.ui.locationsDesc}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
        {t.branches.map((branch, index) => (
          <div key={index} className="bg-slate-50 p-6 rounded-xl border border-slate-100 hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-white p-2 rounded-lg shadow-sm text-rose-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
              <span className="text-xs font-bold bg-slate-200 text-slate-600 px-2 py-1 rounded uppercase">{branch.city}</span>
            </div>
            <h3 className="font-bold text-slate-800 mb-2 min-h-[3rem]">{branch.address}</h3>
            <a href={`tel:${branch.phone}`} className="text-slate-500 hover:text-rose-600 transition-colors flex items-center gap-2 text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              {branch.phone}
            </a>
          </div>
        ))}
      </div>
    </div>
      </div >

  {/* Footer */ }
  < footer className = "bg-slate-900 text-slate-400 py-12 mt-auto" >
    <div className="max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div>
          <h4 className="text-white font-bold text-lg mb-4">AllergoExpress</h4>
          <p className="text-sm leading-relaxed">
            Современная лаборатория с использованием передовых технологий ИФА диагностики.
          </p>
        </div>
        <div>
          <h4 className="text-white font-bold text-lg mb-4">Меню</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-white transition-colors">{t.ui.navTests}</a></li>
            <li><a href="#" className="hover:text-white transition-colors">{t.ui.navAbout}</a></li>
            <li><button onClick={scrollToLocations} className="hover:text-white transition-colors">{t.ui.navLocations}</button></li>
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
        <div>
          <h4 className="text-white font-bold text-lg mb-4">Документы</h4>
          <ul className="space-y-2 text-sm">
            <li><button onClick={() => setShowLicense(true)} className="hover:text-white transition-colors">Лицензия</button></li>
            <li><button onClick={() => setShowPrivacy(true)} className="hover:text-white transition-colors">Политика конфиденциальности</button></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-800 pt-8 text-center text-xs">
        &copy; {new Date().getFullYear()} ТОО AllergoExpressMed. {t.ui.footerRights}
      </div>
    </div>
      </footer >

  {/* Floating Sidebar */ }
  < FloatingSidebar onOpenAI = {() => setIsAIDrawerOpen(true)} lang = { lang } />

    {/* AI Drawer */ }
    < div className = {`fixed inset-y-0 right-0 w-full md:w-[450px] bg-white shadow-2xl transform transition-transform duration-300 z-50 ${isAIDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="h-full flex flex-col relative">
        {/* Drawer Header */}
        <div className="absolute top-0 left-0 right-0 z-20 p-4 flex justify-between items-start pointer-events-none">
          <div className="pointer-events-auto">
            {/* Mode Switcher inside Drawer */}
            <div className="bg-white/90 backdrop-blur shadow-sm p-1 rounded-lg flex items-center border border-slate-200">
              <button
                onClick={() => setMode(AppMode.CHAT)}
                className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wide transition-all ${mode === AppMode.CHAT
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
                  }`}
              >
                Chat
              </button>
              <button
                onClick={() => setMode(AppMode.LIVE)}
                className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wide transition-all ${mode === AppMode.LIVE
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
                  }`}
              >
                Live
              </button>
            </div>
          </div>
          <button
            onClick={() => setIsAIDrawerOpen(false)}
            className="pointer-events-auto bg-white/90 backdrop-blur text-slate-500 hover:text-slate-800 p-2 rounded-full shadow-sm border border-slate-200 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 h-full pt-16">
          {mode === AppMode.CHAT ? (
            <ChatInterface location={location} lang={lang} />
          ) : (
            <LiveInterface onClose={() => setMode(AppMode.CHAT)} />
          )}
        </div>
      </div>
      </div >

  {/* Overlay Backdrop for Drawer */ }
{
  isAIDrawerOpen && (
    <div
      className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40"
      onClick={() => setIsAIDrawerOpen(false)}
    />
  )
}

{/* Modals */ }
      <ReferralModal
        isOpen={showReferral}
        onClose={() => setShowReferral(false)}
        lang={lang}
      />

      <ResultsModal
        isOpen={showResults}
        onClose={() => setShowResults(false)}
        lang={lang}
      />

      <LicenseModal isOpen={showLicense} onClose={() => setShowLicense(false)} lang={lang} />
      <PrivacyModal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} lang={lang} />
      <FeedbackModal isOpen={showFeedback} onClose={() => setShowFeedback(false)} lang={lang} />
      <ServiceModal
        isOpen={!!activeService}
        onClose={() => setActiveService(null)}
        serviceId={activeService || ''}
        lang={lang}
      />
    </div >
  );
}

export default App;