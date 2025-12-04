import React, { useState } from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../utils/translations';

interface FloatingSidebarProps {
    onOpenAI: () => void;
    lang: Language;
}

export const FloatingSidebar: React.FC<FloatingSidebarProps> = ({ onOpenAI, lang }) => {
    const [isOpen, setIsOpen] = useState(true);
    const t = TRANSLATIONS[lang] || TRANSLATIONS['ru'];

    return (
        <div className={`fixed right-4 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-3 transition-all duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-16'}`}>

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-white text-slate-400 hover:text-slate-600 p-2 rounded-full shadow-md self-end mb-2 transition-colors"
            >
                {isOpen ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                )}
            </button>

            {/* AI Assistant */}
            <button
                onClick={onOpenAI}
                className="bg-white p-3 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all group relative"
                title={t.ui.sidebarAIAssistant}
            >
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full animate-pulse border-2 border-white"></div>
                <div className="text-rose-600 group-hover:text-rose-700">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-slate-800 text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    {t.ui.sidebarAIAssistant}
                </span>
            </button>

            {/* WhatsApp */}
            <a
                href="https://wa.me/77075668899"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white p-3 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all group relative block"
                title="WhatsApp"
            >
                <div className="text-green-500 group-hover:text-green-600">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                </div>
            </a>

            {/* Instagram */}
            <a
                href="https://www.instagram.com/allergoexpressimmunolab/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white p-3 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all group relative block"
                title="Instagram"
            >
                <div className="text-pink-600 group-hover:text-pink-700">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
            </a>

            {/* Address / Locations */}
            <button
                onClick={() => {
                    const element = document.getElementById('locations-section');
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-white p-3 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all group relative block"
                title={t.ui.gridLocations}
            >
                <div className="text-purple-600 group-hover:text-purple-700">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
            </button>

            {/* Phone */}
            <a
                href="tel:+77075668899"
                className="bg-white p-3 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all group relative block"
                title="Call Us"
            >
                <div className="text-blue-600 group-hover:text-blue-700">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                </div>
            </a>

        </div>
    );
};
