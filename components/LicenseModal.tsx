import React from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../utils/translations';

interface LicenseModalProps {
    isOpen: boolean;
    onClose: () => void;
    lang: Language;
}

export const LicenseModal: React.FC<LicenseModalProps> = ({ isOpen, onClose, lang }) => {
    const t = TRANSLATIONS[lang] || TRANSLATIONS['ru'];

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center flex-shrink-0">
                    <h3 className="font-bold text-lg text-slate-800">Лицензия</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 overflow-y-auto flex-1 text-center">
                    <div className="inline-block shadow-2xl mb-6 rounded-lg overflow-hidden">
                        <img
                            src="/license.png"
                            alt="Лицензия на медицинскую деятельность №25037178"
                            className="max-w-full h-auto"
                            style={{ maxHeight: '70vh' }}
                        />
                    </div>

                    <p className="text-slate-500 text-sm max-w-lg mx-auto">
                        Лицензия №25037178 от 13.11.2025 г. Деятельность ТОО "AllergoExpressMed" полностью лицензирована и соответствует стандартам здравоохранения Республики Казахстан.
                    </p>
                </div>
            </div>
        </div>
    );
};
