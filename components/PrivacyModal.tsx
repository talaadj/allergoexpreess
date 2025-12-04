import React from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../utils/translations';

interface PrivacyModalProps {
    isOpen: boolean;
    onClose: () => void;
    lang: Language;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose, lang }) => {
    const t = TRANSLATIONS[lang] || TRANSLATIONS['ru'];

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center flex-shrink-0">
                    <h3 className="font-bold text-lg text-slate-800">{t.ui.privacyTitle || 'Политика конфиденциальности'}</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 overflow-y-auto flex-1 text-left prose prose-slate max-w-none">
                    <div className="whitespace-pre-wrap text-sm text-slate-600 leading-relaxed">
                        {t.ui.privacyText}
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors font-medium text-sm"
                    >
                        {t.ui.btnCancel || 'Закрыть'}
                    </button>
                </div>
            </div>
        </div>
    );
};
