import React, { useState } from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import html2pdf from 'html2pdf.js';
import { QRCodeCanvas } from 'qrcode.react';

interface ResultsModalProps {
    onClose: () => void;
    initialOrderId?: string;
    lang?: Language;
}

interface TestResult {
    medication: string;
    result: 'Отрицательный' | 'Положительный';
    level: string;
    igE: string;
    class?: string;
}

interface OrderResult {
    orderId: string;
    patientName: string;
    birthDate?: string;
    date: string;
    status: 'ready' | 'processing';
    medications: string[];
    results: TestResult[];
    iin?: string;
    gender?: string;
    address?: string;
    customer?: string;
    sampleDate?: string;
    sampleTime?: string;
    registrationDate?: string;
}

export const ResultsModal: React.FC<ResultsModalProps> = ({ onClose, initialOrderId, lang = 'ru' }) => {
    const [searchValue, setSearchValue] = useState(initialOrderId || '');
    const [birthDate, setBirthDate] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'found' | 'error'>('idle');
    const [result, setResult] = useState<OrderResult | null>(null);

    const t = TRANSLATIONS[lang] || TRANSLATIONS['ru'];

    // Auto-search if initialOrderId is provided
    React.useEffect(() => {
        if (initialOrderId) {
            handleSearch(initialOrderId);
        }
    }, [initialOrderId]);

    const handleSearch = async (overrideValue?: string) => {
        const valueToSearch = overrideValue || searchValue;
        if (!valueToSearch) return;

        // Require birth date for security
        if (!birthDate && !overrideValue) {
            setStatus('error');
            return;
        }

        setStatus('loading');
        setResult(null);

        try {
            const params = new URLSearchParams();
            params.append('orderId', valueToSearch);
            if (birthDate) {
                params.append('birthDate', birthDate);
            }

            const response = await fetch(`/api/get-result?${params.toString()}`);
            const data = await response.json();

            if (response.ok && data) {
                setStatus('found');
                // Map medications correctly from database format
                const medications = Array.isArray(data.medications) ? data.medications : [];
                setResult({
                    orderId: data.order_id || '',
                    patientName: data.patient_name || '',
                    birthDate: data.birth_date || '',
                    date: data.date || '',
                    status: 'ready',
                    iin: data.iin || '',
                    gender: data.gender || '',
                    address: data.address || '',
                    customer: data.customer || '',
                    sampleDate: data.sample_date || '',
                    sampleTime: data.sample_time || '',
                    registrationDate: data.registration_date || '',
                    medications: medications.map((m: any) => m.name || ''),
                    results: medications.map((m: any) => ({
                        medication: m.name || '',
                        result: m.result || 'Отрицательный',
                        igE: m.igE || '< 0.35',
                        level: m.level || 'отсутствует',
                        class: m.class || '0'
                    }))
                });
            } else {
                setStatus('error');
                setResult(null);
            }
        } catch (error) {
            console.error('Search error:', error);
            setStatus('error');
            setResult(null);
        }
    };

    const handleDownloadPDF = () => {
        if (!result) return;

        const element = document.getElementById('results-content');
        if (!element) return;

        const opt = {
            margin: 0,
            filename: `Результаты_${result.orderId}.pdf`,
            image: { type: 'jpeg' as const, quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
        };

        html2pdf().set(opt).from(element).save();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-4xl rounded-xl md:rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up max-h-[98vh] md:max-h-[95vh] overflow-y-auto flex flex-col">
                {/* Modal Header */}
                <div className="bg-white px-4 md:px-6 py-3 md:py-4 flex justify-between items-center border-b border-slate-100 sticky top-0 z-20">
                    <h3 className="font-bold text-base md:text-lg text-slate-800">{t.ui.btnGetResults}</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors bg-slate-100 p-2 rounded-full hover:bg-slate-200">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content Container */}
                <div className="p-4 md:p-6 lg:p-8 bg-slate-50 flex-1 overflow-y-auto">

                    {/* Search Section */}
                    <div className="bg-white rounded-lg md:rounded-xl shadow-sm border border-slate-200 p-4 md:p-6 mb-6 md:mb-8 print:hidden">
                        <div className="mb-4">
                            <h4 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                Поиск результатов по номеру заказа
                            </h4>
                            <p className="text-sm text-slate-600">Введите номер заказа и дату рождения для получения результатов</p>
                        </div>

                        <div className="space-y-3">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                    placeholder="Введите номер заказа (например: AEM12345678)"
                                    className="w-full pl-4 pr-4 py-2.5 md:py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm md:text-base"
                                />
                            </div>

                            <div className="relative">
                                <input
                                    type="date"
                                    value={birthDate}
                                    onChange={(e) => setBirthDate(e.target.value)}
                                    placeholder="Дата рождения"
                                    className="w-full pl-4 pr-4 py-2.5 md:py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm md:text-base"
                                />
                                <label className="absolute -top-2 left-3 bg-white px-1 text-xs text-slate-600">Дата рождения *</label>
                            </div>

                            <button
                                onClick={() => handleSearch()}
                                disabled={status === 'loading'}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 md:py-3 px-4 md:px-6 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg text-sm md:text-base"
                            >
                                {status === 'loading' ? 'Поиск...' : 'Найти результаты'}
                            </button>
                        </div>
                    </div>

                    {/* Error State */}
                    {status === 'error' && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 md:p-6 rounded-lg mb-6">
                            <div className="flex items-start">
                                <svg className="w-5 h-5 md:w-6 md:h-6 text-red-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div>
                                    <h4 className="font-bold text-red-800 mb-1 text-sm md:text-base">Результат не найден</h4>
                                    <p className="text-red-700 text-xs md:text-sm">
                                        Мы не нашли заказ по таким данным. Проверьте, правильно ли указан номер заказа и дата рождения, или свяжитесь с нами.
                                    </p>
                                    <button
                                        onClick={() => window.open('https://wa.me/77075668899', '_blank')}
                                        className="mt-3 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-xs md:text-sm font-medium inline-flex items-center gap-2"
                                    >
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" /></svg>
                                        Позвонить в регистратуру
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Results Display */}
                    {status === 'found' && result && (
                        <div>
                            {/* Print/Download Section */}
                            <div className="flex flex-col sm:flex-row gap-2 md:gap-3 mb-4 md:mb-6 print:hidden">
                                <button
                                    onClick={handleDownloadPDF}
                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 md:py-3 px-4 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm md:text-base"
                                >
                                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Скачать PDF
                                </button>
                                <button
                                    onClick={() => window.print()}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 md:py-3 px-4 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm md:text-base"
                                >
                                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                    </svg>
                                    Печать
                                </button>
                            </div>

                            {/* Results Content - A4 Format */}
                            <div id="results-content" className="bg-white p-8 mx-auto" style={{ width: '210mm', minHeight: '297mm', position: 'relative' }}>
                                {/* Header */}
                                <div className="flex justify-between items-start mb-4 pb-3 border-b-2 border-green-600">
                                    <div className="flex items-center gap-3">
                                        <img src="/logo-full.png" alt="Logo" className="h-20" />
                                    </div>

                                    {/* Blood drops icon - 3 drops dripping */}
                                    <div className="w-16 h-16 bg-red-50 rounded-lg flex flex-col items-center justify-center border-2 border-red-200 p-1 gap-0.5">
                                        <svg className="w-4 h-4 text-red-500 opacity-60" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                                        </svg>
                                        <svg className="w-5 h-5 text-red-600 opacity-80" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                                        </svg>
                                        <svg className="w-6 h-6 text-red-700" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                                        </svg>
                                    </div>

                                    <div className="text-right text-[9px] leading-tight max-w-[200px]">
                                        <p className="font-semibold">Қазақстан Республикасы Денсаулық сақтау министрлігі</p>
                                        <p>ЖШС "РЕСПУБЛИКАЛЫҚ КЛИНИКАЛЫҚ-ЗЕРТХАНАЛЫҚ ЗЕРТТЕУЛЕР ОРТАЛЫҒЫ"</p>
                                        <p className="mt-1">ТОО "РЕСПУБЛИКАНСКИЙ ЦЕНТР КЛИНИКО-ЛАБОРАТОРНЫХ ИССЛЕДОВАНИЙ"</p>
                                        <p className="mt-1 font-semibold">Алматы қ., Шағабұтдинов к-сі, 132</p>
                                        <p>г. Алматы, ул. Шагабутдинова, 132</p>
                                        <p className="mt-1">Тел: +7 707 566 88 99</p>
                                        <p>allergoexpressmed@gmail.com</p>
                                    </div>
                                </div>

                                <h2 className="text-center text-base font-bold mb-4 uppercase">
                                    Зерттеу нәтижесі (Результат исследования | The result of the study)
                                </h2>

                                {/* Patient Info Grid */}
                                <div className="grid grid-cols-2 gap-6 mb-4 text-[10px]">
                                    <div className="space-y-1">
                                        <p className="font-bold mb-1">Науқас туралы ақпарат (Информация о пациенте):</p>
                                        <div className="flex justify-between border-b border-dotted border-gray-400 pb-0.5">
                                            <span>Т.А.Ә (ФИО):</span>
                                            <span className="font-semibold">{result.patientName}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-dotted border-gray-400 pb-0.5">
                                            <span>ЖСН (ИИН):</span>
                                            <span>{result.iin || result.birthDate?.replace(/-/g, '') || '-'}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-dotted border-gray-400 pb-0.5">
                                            <span>Туған күні (Дата рождения):</span>
                                            <span>{result.birthDate || '-'}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-dotted border-gray-400 pb-0.5">
                                            <span>Жынысы (Пол):</span>
                                            <span>{result.gender || '-'}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-dotted border-gray-400 pb-0.5">
                                            <span>Мекен-жайы (Адрес):</span>
                                            <span>{result.address || 'г. Алматы'}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <p className="font-bold mb-1">Жалпы ақпарат (Общая информация):</p>
                                        <div className="flex justify-between border-b border-dotted border-gray-400 pb-0.5">
                                            <span>Тапсырыс беруші (Заказчик):</span>
                                            <span>{result.customer || 'AllergoExpress'}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-dotted border-gray-400 pb-0.5">
                                            <span>Дәрігер (Врач):</span>
                                            <span>-</span>
                                        </div>

                                        <p className="font-bold mt-2 mb-1">Сынама туралы ақпарат (Информация о пробе):</p>
                                        <div className="flex justify-between border-b border-dotted border-gray-400 pb-0.5">
                                            <span>Үлгі ID (ID образца):</span>
                                            <span className="font-mono font-semibold">{result.orderId}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-dotted border-gray-400 pb-0.5">
                                            <span>Биоматериал:</span>
                                            <span>Сыворотка</span>
                                        </div>
                                        <div className="flex justify-between border-b border-dotted border-gray-400 pb-0.5">
                                            <span>Үлгіні алу күні (Дата взятия):</span>
                                            <span>{result.sampleDate || result.date}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-dotted border-gray-400 pb-0.5">
                                            <span>Үлгіні алу уақыты (Время взятия):</span>
                                            <span>{result.sampleTime || '-'}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-dotted border-gray-400 pb-0.5">
                                            <span>Тіркелген күні (Регистрация):</span>
                                            <span>{result.registrationDate || result.date}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Results Table */}
                                <div className="mb-4">
                                    <h3 className="text-center font-bold text-[11px] mb-2">
                                        Определение специфических Ig E к прочим аллергенам ИФА-методом
                                    </h3>
                                    <table className="w-full border-collapse border border-gray-400 text-[9px]">
                                        <thead>
                                            <tr className="bg-gray-100">
                                                <th className="border border-gray-400 p-1.5 text-left font-bold">
                                                    Көрсеткіш<br />Показатель
                                                </th>
                                                <th className="border border-gray-400 p-1.5 text-center font-bold w-24">
                                                    Нәтижесі<br />Результат
                                                </th>
                                                <th className="border border-gray-400 p-1.5 text-center font-bold w-20">
                                                    Бірліктер<br />Единицы
                                                </th>
                                                <th className="border border-gray-400 p-1.5 text-center font-bold w-32">
                                                    Түсініктеме<br />Комментарий
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {result.results.map((test, idx) => (
                                                <tr key={idx}>
                                                    <td className="border border-gray-400 p-1.5">
                                                        Специфический IgE {test.medication}
                                                    </td>
                                                    <td className="border border-gray-400 p-1.5 text-center font-semibold">
                                                        {test.igE}
                                                    </td>
                                                    <td className="border border-gray-400 p-1.5 text-center">
                                                        МЕ/мл
                                                    </td>
                                                    <td className="border border-gray-400 p-1.5 text-center">
                                                        {test.igE === '< 0.35' ? '< 0.35 - отсутствует' : `${test.class || '0'} класс - ${test.level || 'отсутствует'}`}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Reference Values */}
                                <div className="text-[8px] text-gray-700 mb-6 leading-tight">
                                    <p className="font-bold mb-0.5">Диагностические критерии оценки (Референтные значения | Reference values):</p>
                                    <p>0 класс: &lt; 0.35 МЕ/мл — отсутствует (аллергия крайне маловероятна)</p>
                                    <p>1 класс: 0.35-0.70 МЕ/мл — низкий уровень (клинические проявления маловероятны)</p>
                                    <p>2 класс: 0.71-3.50 МЕ/мл — средний уровень (возможны клинические проявления)</p>
                                    <p>3 класс: 3.51-17.50 МЕ/мл — относительно высокий уровень (клинические проявления вероятны)</p>
                                    <p>4 класс: 17.51-50.0 МЕ/мл — высокий уровень (клинические проявления очень вероятны)</p>
                                    <p>5 класс: 50.1-100.0 МЕ/мл — очень высокий уровень (клинические проявления практически неизбежны)</p>
                                    <p>6 класс: &gt; 100.0 МЕ/мл — чрезвычайно (исключительно) высокий уровень (тяжелые клинические проявления)</p>
                                </div>

                                {/* Footer Section with QR and Signatures - Now part of the flow, not absolute */}
                                <div className="mt-8 break-inside-avoid">
                                    <div className="flex justify-between items-end mb-6 px-8">
                                        {/* Signatures Section */}
                                        <div className="flex-1">
                                            {/* Stamp and signatures row */}
                                            <div className="flex justify-between items-start">
                                                {/* Stamp and signature - Left */}
                                                <div className="relative" style={{ width: '160px' }}>
                                                    {/* Official circular stamp */}
                                                    <div className="absolute left-2 -top-4" style={{ width: '100px', height: '100px', transform: 'rotate(-8deg)' }}>
                                                        <svg viewBox="0 0 120 120" className="w-full h-full">
                                                            {/* Outer double circle */}
                                                            <circle cx="60" cy="60" r="56" fill="none" stroke="#1e3a8a" strokeWidth="3" opacity="0.85" />
                                                            <circle cx="60" cy="60" r="52" fill="none" stroke="#1e3a8a" strokeWidth="1" opacity="0.85" />

                                                            {/* Inner circle */}
                                                            <circle cx="60" cy="60" r="40" fill="none" stroke="#1e3a8a" strokeWidth="1" opacity="0.85" />

                                                            {/* Top text path */}
                                                            <defs>
                                                                <path id="topCircle" d="M 14,60 A 46,46 0 0,1 106,60" fill="none" />
                                                                <path id="bottomCircle" d="M 106,60 A 46,46 0 0,1 14,60" fill="none" />
                                                            </defs>

                                                            {/* Top arc text */}
                                                            <text fill="#1e3a8a" fontWeight="bold" opacity="0.85">
                                                                <textPath href="#topCircle" startOffset="50%" textAnchor="middle" style={{ fontSize: '7px' }}>
                                                                    ★ ALLERGOEXPRESS IMMUNOLAB ★
                                                                </textPath>
                                                            </text>

                                                            {/* Bottom arc text */}
                                                            <text fill="#1e3a8a" fontWeight="bold" opacity="0.85">
                                                                <textPath href="#bottomCircle" startOffset="50%" textAnchor="middle" style={{ fontSize: '6px' }}>
                                                                    г.АЛМАТЫ • ЛИЦЕНЗИЯ №21019421
                                                                </textPath>
                                                            </text>

                                                            {/* Center content */}
                                                            <text x="60" y="52" textAnchor="middle" fill="#1e3a8a" fontWeight="bold" opacity="0.85" style={{ fontSize: '8px' }}>ДЛЯ</text>
                                                            <text x="60" y="62" textAnchor="middle" fill="#1e3a8a" fontWeight="bold" opacity="0.85" style={{ fontSize: '8px' }}>АНАЛИЗОВ</text>
                                                            <text x="60" y="72" textAnchor="middle" fill="#1e3a8a" fontWeight="bold" opacity="0.85" style={{ fontSize: '6px' }}>ТОО</text>
                                                        </svg>
                                                    </div>
                                                    <div className="pt-24 text-center">
                                                        <div className="text-[7px] leading-tight">
                                                            <p>Орындаушы (Исполнитель)</p>
                                                            <p className="text-[6px] mt-1 border-b border-gray-400 pb-1">_________________________</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Doctor signature - Center/Right */}
                                                <div className="text-center" style={{ width: '160px' }}>
                                                    <div className="h-24"></div>
                                                    <div className="text-[7px] leading-tight">
                                                        <p>Дәрігер (Врач)</p>
                                                        <p className="text-[6px] mt-1 border-b border-gray-400 pb-1">_________________________</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* QR Code - Right aligned in flex container */}
                                        <div className="ml-4 flex flex-col items-center justify-end pb-2">
                                            <QRCodeCanvas
                                                value={`https://allergoexpressmed.vercel.app?orderId=${result.orderId}`}
                                                size={80}
                                                level={"H"}
                                                includeMargin={false}
                                            />
                                            <div className="text-[8px] text-center mt-1 font-mono">{result.orderId}</div>
                                        </div>
                                    </div>

                                    {/* Footer - Three languages warning */}
                                    <div className="border-t border-gray-400 pt-0.5 px-8 pb-4">
                                        <div className="grid grid-cols-3 gap-2 text-[5px] leading-[6px] text-gray-600">
                                            <div>
                                                <p className="font-semibold mb-0.5">Қазақша:</p>
                                                <p>Бұл қорытынды алдын ала болып табылады және дәрігермен кеңеспестен соңғы диагноз ретінде пайдаланылмауы тиіс. Зерттеу нәтижелері тек емдеуші дәрігерге арналған және өзін-өзі диагностикалау мен өзін-өзі емдеуге пайдаланылмауы керек.</p>
                                            </div>
                                            <div>
                                                <p className="font-semibold mb-0.5">Русский:</p>
                                                <p>Данное заключение является предварительным и не может использоваться как окончательный диагноз без консультации врача. Результаты исследования предназначены только для лечащего врача и не могут быть использованы для самодиагностики и самолечения.</p>
                                            </div>
                                            <div>
                                                <p className="font-semibold mb-0.5">English:</p>
                                                <p>This conclusion is preliminary and cannot be used as a final diagnosis without consulting a doctor. The test results are intended only for the attending physician and cannot be used for self-diagnosis and self-treatment.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
