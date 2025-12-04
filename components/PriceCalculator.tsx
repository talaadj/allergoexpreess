import React, { useState } from 'react';
import { TRANSLATIONS } from '../utils/translations';
import { Language } from '../types';

interface PriceCalculatorProps {
    lang: Language;
    onBooking?: () => void;
}

export const PriceCalculator: React.FC<PriceCalculatorProps> = ({ lang, onBooking }) => {
    const [selectedMeds, setSelectedMeds] = useState<string[]>([]);
    const [isExpress, setIsExpress] = useState(false);
    const t = TRANSLATIONS[lang] || TRANSLATIONS['ru'];

    const medications = t.referralDrugs;
    const pricePerMed = 6500;
    const expressPrice = 8000;

    const toggleMed = (med: string) => {
        setSelectedMeds(prev =>
            prev.includes(med) ? prev.filter(m => m !== med) : [...prev, med]
        );
    };

    const totalPrice = isExpress
        ? selectedMeds.length * expressPrice
        : selectedMeds.length * pricePerMed;

    const handleBooking = () => {
        if (onBooking) {
            onBooking();
        } else {
            // Fallback to WhatsApp
            const message = encodeURIComponent(
                `Запись на анализ\n\nПрепараты (${selectedMeds.length}):\n${selectedMeds.join(', ')}\n\nТип: ${isExpress ? 'Экспресс (8000₸)' : 'Стандарт (6500₸)'}\nИтого: ${totalPrice}₸`
            );
            window.open(`https://wa.me/77075668899?text=${message}`, '_blank');
        }
    };

    return (
        <section id="calculator-section" className="py-16 bg-gradient-to-br from-blue-50 to-white">
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-slate-900 mb-4">
                        💰 Калькулятор стоимости
                    </h2>
                    <p className="text-slate-600 text-lg">
                        Рассчитайте стоимость анализа на несколько препаратов
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Left: Medications List */}
                    <div className="md:col-span-2">
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h3 className="font-semibold text-lg mb-4">Выберите препараты:</h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-2">
                                {medications.map((med) => (
                                    <button
                                        key={med}
                                        onClick={() => toggleMed(med)}
                                        className={`px-4 py-3 rounded-lg text-left text-sm transition-all flex items-center gap-2 ${selectedMeds.includes(med)
                                                ? 'bg-rose-500 text-white shadow-md'
                                                : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                                            }`}
                                    >
                                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${selectedMeds.includes(med) ? 'border-white' : 'border-slate-300'
                                            }`}>
                                            {selectedMeds.includes(med) && (
                                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                        </div>
                                        <span className="flex-1">{med}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Summary */}
                    <div className="md:col-span-1">
                        <div className="bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl shadow-lg p-6 text-white sticky top-4">
                            <h3 className="font-semibold text-lg mb-4">Итого:</h3>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between items-center pb-3 border-b border-white/20">
                                    <span>Препаратов:</span>
                                    <span className="font-bold text-xl">{selectedMeds.length}</span>
                                </div>

                                <div className="flex justify-between items-center pb-3 border-b border-white/20">
                                    <span>Цена за 1:</span>
                                    <span className="font-bold">{isExpress ? '8000' : '6500'} ₸</span>
                                </div>

                                <div className="flex justify-between items-center text-2xl font-bold">
                                    <span>Всего:</span>
                                    <span>{totalPrice.toLocaleString()} ₸</span>
                                </div>
                            </div>

                            {/* Express Toggle */}
                            <label className="flex items-center gap-3 mb-6 cursor-pointer bg-white/10 p-3 rounded-lg hover:bg-white/20 transition-colors">
                                <input
                                    type="checkbox"
                                    checked={isExpress}
                                    onChange={(e) => setIsExpress(e.target.checked)}
                                    className="w-5 h-5 rounded accent-white"
                                />
                                <div>
                                    <div className="font-semibold">⚡ Экспресс</div>
                                    <div className="text-xs text-white/80">Результат за 2 часа</div>
                                </div>
                            </label>

                            {isExpress && (
                                <div className="bg-amber-100 text-amber-800 rounded-lg p-3 text-xs mb-4">
                                    ⚠️ Экспресс доступен только в филиале Шагабутдинова 132
                                </div>
                            )}

                            {selectedMeds.length > 0 ? (
                                <button
                                    onClick={handleBooking}
                                    className="w-full bg-white text-rose-600 py-3 rounded-lg font-semibold hover:bg-rose-50 transition-colors"
                                >
                                    Записаться на анализ
                                </button>
                            ) : (
                                <div className="text-center text-white/60 text-sm py-3">
                                    Выберите препараты для расчета
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
