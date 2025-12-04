import React, { useState } from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../utils/translations';

interface FAQSectionProps {
    lang: Language;
}

export const FAQSection: React.FC<FAQSectionProps> = ({ lang }) => {
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
    const t = TRANSLATIONS[lang] || TRANSLATIONS['ru'];

    return (
        <section id="faq-section" className="py-16 bg-gradient-to-br from-slate-50 to-white">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-slate-900 mb-4">
                        {t.ui.faq}
                    </h2>
                    <p className="text-slate-600 text-lg">
                        Ответы на часто задаваемые вопросы
                    </p>
                </div>

                {/* FAQ Items - Only first 3 */}
                <div className="space-y-4">
                    {t.faqs.slice(0, 3).map((faq, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-all hover:shadow-md"
                        >
                            <button
                                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                                className="w-full px-6 py-5 flex justify-between items-center text-left transition-colors hover:bg-slate-50"
                            >
                                <span className="font-semibold text-slate-900 pr-4">
                                    {faq.question}
                                </span>
                                <svg
                                    className={`w-5 h-5 text-rose-500 flex-shrink-0 transition-transform duration-300 ${expandedIndex === index ? 'rotate-180' : ''
                                        }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            <div
                                className={`overflow-hidden transition-all duration-300 ${expandedIndex === index ? 'max-h-96' : 'max-h-0'
                                    }`}
                            >
                                <div className="px-6 pb-5 text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                                    {faq.answer}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="mt-12 text-center">
                    <p className="text-slate-600 mb-4">Не нашли ответ на свой вопрос?</p>
                    <a
                        href="tel:+77075668899"
                        className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-lg hover:shadow-xl"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        Позвонить нам
                    </a>
                </div>
            </div>
        </section>
    );
};
