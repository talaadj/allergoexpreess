import React from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../utils/translations';

interface ServiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    lang: Language;
    serviceId: string;
}

export const ServiceModal: React.FC<ServiceModalProps> = ({ isOpen, onClose, lang, serviceId }) => {
    const t = TRANSLATIONS[lang] || TRANSLATIONS['ru'];

    if (!isOpen || !serviceId) return null;

    const getContent = () => {
        switch (serviceId) {
            case 'about':
                return {
                    title: t.ui.aboutTitle,
                    icon: <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
                    body: (
                        <div className="space-y-4">
                            <p className="text-slate-600 leading-relaxed">{t.ui.aboutDesc}</p>
                            <div className="space-y-3 mt-6">
                                {[t.ui.aboutPoint1, t.ui.aboutPoint2, t.ui.aboutPoint3].map((point, i) => (
                                    <div key={i} className="flex gap-3 items-start">
                                        <div className="bg-rose-100 text-rose-600 w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0">{i + 1}</div>
                                        <p className="text-slate-700 pt-1">{point}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-700 mt-4">
                                Контакт: <strong>+7 707 566 8899</strong>
                            </div>
                        </div>
                    )
                };
            case 'method':
                return {
                    title: t.ui.methodTitle,
                    icon: <svg className="w-12 h-12 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>,
                    body: (
                        <div className="space-y-4">
                            <div className="bg-indigo-50 p-5 rounded-xl border border-indigo-100">
                                <h4 className="font-bold text-indigo-900 mb-3 flex items-center gap-2">
                                    <span className="text-xl">🏆</span> Золотой стандарт диагностики
                                </h4>
                                <p className="text-indigo-700 leading-relaxed">{t.ui.methodDesc}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-4">
                                <div className="bg-white border-2 border-indigo-200 p-4 rounded-xl text-center">
                                    <div className="text-3xl font-bold text-indigo-600">95%</div>
                                    <div className="text-sm text-slate-600 mt-1">Точность</div>
                                </div>
                                <div className="bg-white border-2 border-emerald-200 p-4 rounded-xl text-center">
                                    <div className="text-3xl">✨</div>
                                    <div className="text-sm text-slate-600 mt-1">Безопасно</div>
                                </div>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-lg text-sm text-slate-600">
                                <strong>Преимущества:</strong> Нет контакта с аллергеном, результаты в день обращения.
                            </div>
                        </div>
                    )
                };
            case 'ultrasound':
                return {
                    title: 'УЗИ Диагностика',
                    icon: <svg className="w-12 h-12 text-lime-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
                    body: (
                        <div className="space-y-4">
                            <p className="text-slate-600">
                                Мы проводим ультразвуковые исследования на современном оборудовании экспертного класса.
                            </p>
                            <ul className="space-y-2">
                                <li className="flex justify-between border-b border-slate-100 pb-2">
                                    <span>УЗИ брюшной полости</span>
                                    <span className="font-bold text-slate-800">5 000 ₸</span>
                                </li>
                                <li className="flex justify-between border-b border-slate-100 pb-2">
                                    <span>УЗИ почек</span>
                                    <span className="font-bold text-slate-800">4 000 ₸</span>
                                </li>
                                <li className="flex justify-between border-b border-slate-100 pb-2">
                                    <span>УЗИ щитовидной железы</span>
                                    <span className="font-bold text-slate-800">4 000 ₸</span>
                                </li>
                                <li className="flex justify-between border-b border-slate-100 pb-2">
                                    <span>УЗИ сердца (ЭхоКГ)</span>
                                    <span className="font-bold text-slate-800">7 000 ₸</span>
                                </li>
                            </ul>
                            <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-700 mt-4">
                                Запись по телефону: <strong>+7 707 566 8899</strong>
                            </div>
                        </div>
                    )
                };
            case 'homecall':
                return {
                    title: 'Выезд на дом',
                    icon: <svg className="w-12 h-12 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
                    body: (
                        <div className="space-y-4">
                            <p className="text-slate-600">
                                Сдавайте анализы не выходя из дома! Наша выездная бригада приедет в удобное для вас время.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                                    <h4 className="font-bold text-slate-800 mb-1">По городу</h4>
                                    <p className="text-2xl font-bold text-rose-600">1 000 ₸</p>
                                    <p className="text-xs text-slate-500">при заказе до 10 000 ₸</p>
                                </div>
                                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                                    <h4 className="font-bold text-green-800 mb-1">Бесплатно</h4>
                                    <p className="text-sm text-green-700">при заказе свыше</p>
                                    <p className="text-2xl font-bold text-green-600">10 000 ₸</p>
                                </div>
                            </div>
                            <p className="text-sm text-slate-500">
                                * Выезд осуществляется с 08:00 до 14:00. Заявки принимаются круглосуточно.
                            </p>
                        </div>
                    )
                };
            case 'promotions':
                return {
                    title: 'Акции и Скидки',
                    icon: <svg className="w-12 h-12 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg>,
                    body: (
                        <div className="space-y-4">
                            <div className="bg-gradient-to-r from-rose-500 to-pink-500 text-white p-6 rounded-xl shadow-lg">
                                <h4 className="text-xl font-bold mb-2">-20% на Аллергопанели</h4>
                                <p className="opacity-90 mb-4">Сдайте комплексный анализ на пищевые аллергены и получите скидку.</p>
                                <div className="text-xs bg-white/20 inline-block px-2 py-1 rounded">До 31 декабря</div>
                            </div>

                            <div className="bg-white border border-slate-200 p-4 rounded-xl flex gap-4 items-center">
                                <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800">Счастливые часы</h4>
                                    <p className="text-sm text-slate-600">Скидка 10% при сдаче анализов после 14:00</p>
                                </div>
                            </div>
                        </div>
                    )
                };
            default:
                return { title: '', icon: null, body: null };
        }
    };

    const content = getContent();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
                {/* Header */}
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        {content.icon}
                        <h3 className="font-bold text-xl text-slate-800">{content.title}</h3>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {content.body}
                </div>

                <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 text-center">
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-800 font-medium text-sm">
                        Закрыть
                    </button>
                </div>
            </div>
        </div>
    );
};
