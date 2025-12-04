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
        <div className="w-full h-full relative overflow-hidden print-color-adjust-exact" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)' }}>
            {/* Animated gradient overlay */}
            <div className="absolute inset-0 opacity-30" style={{ background: 'radial-gradient(circle at 30% 20%, #22c55e 0%, transparent 50%), radial-gradient(circle at 70% 80%, #3b82f6 0%, transparent 50%)' }}></div>

            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-green-500/20 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-blue-500/20 to-transparent rounded-full blur-3xl"></div>

            {/* Content */}
            <div className="relative z-10 p-8 flex flex-col h-full">
                {/* Header with logo */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <img src="/logo-full.png" alt="Logo" className="h-16" />
                        <div>
                            <h1 className="text-2xl font-black text-white tracking-tight">AllergoExpress</h1>
                            <p className="text-green-400 font-semibold">ImmunoLab</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-green-400 text-sm font-medium">Лицензия МЗ РК</p>
                        <p className="text-white/60 text-xs">№ 21019421</p>
                    </div>
                </div>

                {/* URGENCY Banner */}
                <div className="bg-gradient-to-r from-red-600 via-red-500 to-orange-500 py-3 px-6 -mx-8 mb-6 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMjAgMjBMMCA0MFY0MGg0MEwyMCAyMHoiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvc3ZnPg==')] opacity-20"></div>
                    <div className="flex items-center justify-center gap-4 relative">
                        <span className="text-yellow-300 text-3xl">⚡</span>
                        <p className="text-white text-2xl font-black uppercase tracking-wide">
                            Только до 10 января 2026!
                        </p>
                        <span className="text-yellow-300 text-3xl">⚡</span>
                    </div>
                </div>

                {/* Main offer */}
                <div className="flex-1 flex flex-col items-center justify-center text-center mb-6">
                    <div className="mb-4">
                        <span className="inline-block bg-yellow-400 text-black px-6 py-2 rounded-full text-lg font-black uppercase tracking-wider transform -rotate-2 shadow-lg">
                            🔥 Горящее предложение
                        </span>
                    </div>

                    <h2 className="text-6xl font-black text-green-400 mb-4 leading-tight" style={{ textShadow: '0 0 20px rgba(34, 197, 94, 0.5)' }}>
                        СКИДКА
                    </h2>

                    <p className="text-3xl text-white font-bold mb-2">
                        на экспресс-анализ
                    </p>
                    <p className="text-xl text-green-400 font-semibold mb-6">
                        на аллергию к лекарствам
                    </p>

                    {/* Price comparison */}
                    <div className="flex items-center gap-8 mb-6">
                        <div className="text-center">
                            <p className="text-white/50 text-sm mb-1">Было</p>
                            <p className="text-3xl text-white/40 line-through font-bold">8 000 ₸</p>
                        </div>
                        <div className="text-6xl text-green-400">→</div>
                        <div className="text-center">
                            <p className="text-green-400 text-sm mb-1 font-bold">Стало</p>
                            <p className="text-5xl text-white font-black">7 000 ₸</p>
                        </div>
                    </div>

                    {/* Benefits */}
                    <div className="flex gap-6 justify-center flex-wrap">
                        <div className="flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full">
                            <span className="text-2xl">⏱️</span>
                            <span className="text-white font-semibold">Результат за 2 часа</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full">
                            <span className="text-2xl">✅</span>
                            <span className="text-white font-semibold">95% точность</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full">
                            <span className="text-2xl">🔬</span>
                            <span className="text-white font-semibold">Современное оборудование</span>
                        </div>
                    </div>
                </div>

                {/* Tests list */}
                <div className="bg-white/5 backdrop-blur rounded-2xl p-6 mb-6">
                    <h3 className="text-xl font-bold text-white text-center mb-4">
                        Проводим анализы на аллергию к:
                    </h3>
                    <div className="grid grid-cols-3 gap-3">
                        {[
                            '💉 Анестетикам',
                            '💊 Антибиотикам',
                            '🩺 Ампициллину',
                            '💉 Лидокаину',
                            '💊 Амоксициллину',
                            '🩺 И многим другим'
                        ].map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-white/90 text-sm">
                                <span>{item}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA Section */}
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23fff\' fill-opacity=\'0.4\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'1.5\'/%3E%3C/g%3E%3C/svg%3E")' }}></div>
                    <div className="flex items-center justify-between relative">
                        <div>
                            <p className="text-white/80 text-sm mb-1">Звоните прямо сейчас!</p>
                            <p className="text-3xl font-black text-white">+7 (707) 518 60 88</p>
                            <p className="text-white/80 text-sm mt-1">📧 allergoexpress.immunolab@gmail.com</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="bg-white p-2 rounded-xl shadow-lg">
                                <img
                                    src="https://api.qrserver.com/v1/create-qr-code/?data=https://allergoexpressmed.vercel.app&size=100x100"
                                    alt="Website QR"
                                    className="w-20 h-20"
                                />
                            </div>
                            <p className="text-white text-xs mt-2 font-semibold">🌐 Наш сайт</p>
                        </div>
                    </div>
                </div>

                {/* Social proof */}
                <div className="flex items-center justify-center gap-8 mt-4 text-white/60 text-sm">
                    <span>⭐ 4.9 рейтинг</span>
                    <span>👥 1000+ довольных клиентов</span>
                    <span>🏆 5 лет опыта</span>
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* Modal UI */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm print:hidden">
                <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4 flex justify-between items-center flex-shrink-0">
                        <h2 className="text-white font-semibold text-lg">🎉 Маркетинговый баннер</h2>
                        <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto p-8 bg-gray-100">
                        <div className="bg-white shadow-lg rounded-lg overflow-hidden" style={{ aspectRatio: '210/297' }}>
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
                            className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 shadow-md flex items-center gap-2 disabled:opacity-50"
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
                <div id="promotion-banner-content" style={{ width: '210mm', height: '297mm', backgroundColor: '#0f172a' }}>
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
