import React, { useState } from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../utils/translations';

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    lang: Language;
}

export const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, lang }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        date: '',
        time: '',
        branch: 'Shagabutdinova 132',
        service: 'standard'
    });

    const t = TRANSLATIONS[lang] || TRANSLATIONS['ru'];

    if (!isOpen) return null;

    const timeSlots = [
        '08:00', '09:00', '10:00', '11:00', '12:00',
        '14:00', '15:00', '16:00', '17:00', '18:00'
    ];

    const branches = [
        'Shagabutdinova 132',
        'Rozybakiev 33A',
        'Serkebaeva 146/12',
        'Rayimbek 540/7'
    ];

    const handleSubmit = () => {
        // Формируем сообщение для WhatsApp
        const message = encodeURIComponent(
            `🏥 Запись на анализ\n\n` +
            `👤 Имя: ${formData.name}\n` +
            `📱 Телефон: ${formData.phone}\n` +
            `📅 Дата: ${formData.date}\n` +
            `🕐 Время: ${formData.time}\n` +
            `📍 Филиал: ${formData.branch}\n` +
            `⚡ Услуга: ${formData.service === 'express' ? 'Экспресс (2 часа) - 8000₸' : 'Стандарт (в тот же день) - 6500₸'}`
        );

        window.open(`https://wa.me/77075668899?text=${message}`, '_blank');

        // Сброс формы и закрытие
        setFormData({
            name: '',
            phone: '',
            date: '',
            time: '',
            branch: 'Shagabutdinova 132',
            service: 'standard'
        });
        setStep(1);
        onClose();
    };

    const canProceedStep1 = formData.name.trim() && formData.phone.trim();
    const canProceedStep2 = formData.date && formData.time;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-rose-600 to-rose-500 px-6 py-4 flex justify-between items-center">
                    <h2 className="text-white font-bold text-xl">
                        📅 Онлайн-запись на анализ
                    </h2>
                    <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center justify-center gap-2 px-6 py-4 bg-slate-50 border-b">
                    {[1, 2, 3].map((s) => (
                        <React.Fragment key={s}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${step >= s ? 'bg-rose-500 text-white' : 'bg-slate-200 text-slate-400'
                                }`}>
                                {s}
                            </div>
                            {s < 3 && <div className={`w-16 h-1 transition-all ${step > s ? 'bg-rose-500' : 'bg-slate-200'}`} />}
                        </React.Fragment>
                    ))}
                </div>

                {/* Content */}
                <div className="p-6 min-h-[300px]">
                    {/* Step 1: Personal Info */}
                    {step === 1 && (
                        <div className="space-y-4 animate-fade-in">
                            <h3 className="font-semibold text-lg mb-4">Ваши данные</h3>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Ваше имя *</label>
                                <input
                                    type="text"
                                    placeholder="Введите ваше имя"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Номер телефона *</label>
                                <input
                                    type="tel"
                                    placeholder="+7 (___) ___-__-__"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all"
                                />
                            </div>
                        </div>
                    )}

                    {/* Step 2: Date & Time */}
                    {step === 2 && (
                        <div className="space-y-4 animate-fade-in">
                            <h3 className="font-semibold text-lg mb-4">Дата и время</h3>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Выберите дату *</label>
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    min={new Date().toISOString().split('T')[0]}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Выберите время *</label>
                                <div className="grid grid-cols-5 gap-2">
                                    {timeSlots.map((time) => (
                                        <button
                                            key={time}
                                            onClick={() => setFormData({ ...formData, time })}
                                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${formData.time === time
                                                    ? 'bg-rose-500 text-white shadow-md'
                                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                                }`}
                                        >
                                            {time}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Филиал *</label>
                                <select
                                    value={formData.branch}
                                    onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all"
                                >
                                    {branches.map((branch) => (
                                        <option key={branch} value={branch}>{branch}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Service Type */}
                    {step === 3 && (
                        <div className="space-y-4 animate-fade-in">
                            <h3 className="font-semibold text-lg mb-4">Тип услуги</h3>

                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => setFormData({ ...formData, service: 'standard' })}
                                    className={`p-6 rounded-xl border-2 transition-all ${formData.service === 'standard'
                                            ? 'border-rose-500 bg-rose-50'
                                            : 'border-slate-200 hover:border-slate-300'
                                        }`}
                                >
                                    <div className="text-4xl mb-3">⏰</div>
                                    <div className="font-semibold text-lg mb-1">Стандарт</div>
                                    <div className="text-sm text-slate-600 mb-2">Результат в тот же день</div>
                                    <div className="text-rose-600 font-bold text-xl">6500 ₸</div>
                                </button>

                                <button
                                    onClick={() => setFormData({ ...formData, service: 'express' })}
                                    className={`p-6 rounded-xl border-2 transition-all ${formData.service === 'express'
                                            ? 'border-lime-500 bg-lime-50'
                                            : 'border-slate-200 hover:border-slate-300'
                                        }`}
                                >
                                    <div className="text-4xl mb-3">⚡</div>
                                    <div className="font-semibold text-lg mb-1">Экспресс</div>
                                    <div className="text-sm text-slate-600 mb-2">Результат за 2 часа</div>
                                    <div className="text-lime-600 font-bold text-xl">8000 ₸</div>
                                </button>
                            </div>

                            {formData.service === 'express' && (
                                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800 animate-fade-in">
                                    ⚠️ Экспресс-анализ доступен только в филиале Шагабутдинова 132
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-slate-50 border-t flex justify-between items-center">
                    {step > 1 && (
                        <button
                            onClick={() => setStep(step - 1)}
                            className="px-6 py-2 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors font-medium"
                        >
                            ← Назад
                        </button>
                    )}

                    {step < 3 ? (
                        <button
                            onClick={() => setStep(step + 1)}
                            disabled={
                                (step === 1 && !canProceedStep1) ||
                                (step === 2 && !canProceedStep2)
                            }
                            className="ml-auto px-6 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                        >
                            Далее →
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            className="ml-auto px-6 py-2 bg-lime-600 hover:bg-lime-700 text-white rounded-lg font-semibold transition-colors shadow-md flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Записаться
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
