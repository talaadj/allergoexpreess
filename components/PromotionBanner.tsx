import React from 'react';
// @ts-ignore
import html2pdf from 'html2pdf.js';
import { Language } from '../types';
import { TRANSLATIONS } from '../utils/translations';

interface PromotionBannerProps {
    isOpen: boolean;
    onClose: () => void;
    lang: Language;
}

export const PromotionBanner: React.FC<PromotionBannerProps> = ({ isOpen, onClose, lang }) => {
    const [isGeneratingPdf, setIsGeneratingPdf] = React.useState(false);
    const t = TRANSLATIONS[lang] || TRANSLATIONS['ru'];

    if (!isOpen) return null;

    const handleDownloadPDF = async () => {
        setIsGeneratingPdf(true);
        const element = document.getElementById('promotion-banner-content');
        const opt = {
            margin: 0,
            filename: 'акция-экспресс-анализ.pdf',
            image: { type: 'jpeg' as const, quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, logging: false },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
        };

        try {
            await html2pdf().set(opt).from(element).save();
        } catch (error) {
            console.error("PDF generation failed:", error);
            alert("Не удалось создать PDF. Попробуйте печать.");
        } finally {
            setIsGeneratingPdf(false);
        }
    };

    const BannerContent = () => (
        <div className="w-full h-full bg-gradient-to-br from-green-50 to-green-100 p-8 flex flex-col justify-between print-color-adjust-exact">
            {/* Header */}
            <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-4 mb-4">
                    <img src="/logo-full.png" alt="AllergoExpress Immunolab" className="h-20" />
                </div>
                <h2 className="text-5xl font-extrabold text-blue-700 mb-4">
                    AllergoExpress Immunolab
                </h2>
            </div>

            {/* Main Promotion */}
            <div className="bg-white rounded-3xl shadow-xl p-8 mb-6">
                <div className="text-center mb-6">
                    <div className="inline-block bg-red-600 text-white px-8 py-3 rounded-full mb-4">
                        <span className="text-3xl font-extrabold uppercase">АКЦИЯ</span>
                    </div>
                    <h3 className="text-6xl font-black text-red-600 mb-4 uppercase">
                        -20% СКИДКА
                    </h3>
                    <p className="text-3xl font-bold text-gray-800 mb-2">
                        на экспресс-анализ
                    </p>
                    <p className="text-2xl text-gray-700">
                        Результат за 2 часа!
                    </p>
                </div>

                <div className="bg-green-100 rounded-2xl p-6">
                    <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                            <p className="text-gray-600 text-lg mb-1">Обычная цена:</p>
                            <p className="text-3xl font-bold text-gray-400 line-through">8000 ₸</p>
                        </div>
                        <div>
                            <p className="text-green-700 text-lg mb-1 font-bold">Цена по акции:</p>
                            <p className="text-5xl font-black text-green-600">6400 ₸</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Services List */}
            <div className="bg-blue-500 text-white rounded-2xl p-6 mb-6">
                <h4 className="text-2xl font-bold mb-4 text-center uppercase">
                    Мы проводим анализы на:
                </h4>
                <div className="grid grid-cols-2 gap-3">
                    {[
                        'НА ЛЮБЫЕ АНЕСТЕЗИОЛОГИЧЕСКИЕ ПРЕПАРАТЫ',
                        'НА АНТИБИОТИКИ',
                        'НА ЛАМПИЛИН'
                    ].map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                            <div className="bg-white text-blue-500 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">
                                <span className="text-sm font-bold">✓</span>
                            </div>
                            <span className="text-base font-semibold">{item}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Contact Info with QR Code */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl p-6">
                <div className="flex items-center justify-between gap-8">
                    <div className="flex-1">
                        <div className="mb-4">
                            <p className="text-xl font-bold mb-2">💬 WhatsApp:</p>
                            <p className="text-3xl font-black">+7 (707) 518 60 88</p>
                        </div>
                        <div>
                            <p className="text-lg font-semibold">📧 Email: allergoexpress.immunolab@gmail.com</p>
                        </div>
                    </div>
                    <div className="bg-white p-3 rounded-xl">
                        <img
                            src="https://api.qrserver.com/v1/create-qr-code/?data=https://allergoexpressmed.vercel.app&size=150x150"
                            alt="QR Code"
                            className="w-24 h-24"
                        />
                        <p className="text-xs text-center text-gray-800 mt-1 font-bold">Наш сайт</p>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-6">
                <p className="text-sm text-gray-600">
                    * Акция действует до 31 декабря 2024 года. Подробности уточняйте по телефону.
                </p>
            </div>
        </div>
    );

    return (
        <>
            {/* Modal UI */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm print:hidden">
                <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                    {/* Header */}
                    <div className="bg-green-600 px-6 py-4 flex justify-between items-center flex-shrink-0">
                        <h2 className="text-white font-semibold text-lg">🎉 Баннер с акцией</h2>
                        <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto p-8 bg-gray-100">
                        <div className="bg-white shadow-lg" style={{ aspectRatio: '210/297' }}>
                            <BannerContent />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="bg-slate-50 p-6 flex justify-end gap-4 border-t border-slate-200">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium"
                        >
                            Закрыть
                        </button>
                        <button
                            onClick={handleDownloadPDF}
                            disabled={isGeneratingPdf}
                            className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 shadow-md flex items-center gap-2 disabled:opacity-50"
                        >
                            {isGeneratingPdf ? (
                                <span className="animate-pulse">Создание PDF...</span>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                    Скачать PDF
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Hidden PDF Container */}
            <div style={{ position: 'fixed', left: '-9999px', top: 0, zIndex: -1 }}>
                <div id="promotion-banner-content" style={{ width: '210mm', height: '297mm', backgroundColor: 'white' }}>
                    <BannerContent />
                </div>
            </div>

            <style>{`
        @media print {
          @page {
            margin: 0;
            size: A4;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>
        </>
    );
};
