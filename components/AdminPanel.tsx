import React, { useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Language } from '../types';

interface AdminPanelProps {
    lang?: Language;
    onClose: () => void;
}

const MEDICATIONS = [
    'Артикаин Гидрохлорид 4%',
    'Артикаин 4%+эпинефрин 1:100 000',
    'Мепивастезин 3%',
    'Ораблок 1:100 000 / красный',
    'Ораблок 1:200 000 / синий',
    'Септанест с адреналином 1:100 000',
    'Септанест с адреналином 1:200 000',
    'Убистезин 4% форте',
    'Убистезин 4%',
    'Ультракаин / Артикаин',
    'Мепивакаин',
    'Лидокаин',
    'Новокаин',
    'Эпинефрин',
    'Цефалоспорин',
    'Амоксициллин',
    'Диклофенак',
    'Ибупрофен',
    'Азитромицин',
    'Кетопрофен',
    'Парацетамол'
];

export const AdminPanel: React.FC<AdminPanelProps> = ({ lang = 'ru', onClose }) => {
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
    const [selectedMeds, setSelectedMeds] = useState<Set<string>>(new Set());
    const [lastSavedOrderId, setLastSavedOrderId] = useState('');

    const [formData, setFormData] = useState({
        orderId: '',
        patientName: '',
        phone: '',
        birthDate: '',
        iin: '', // ИИН
        gender: 'Мужской', // Пол
        address: '', // Адрес
        customer: 'AllergoExpress ImmunoLab', // Заказчик
        sampleDate: new Date().toISOString().split('T')[0], // Дата взятия пробы
        registrationDate: new Date().toISOString().split('T')[0], // Дата регистрации
        date: new Date().toISOString().split('T')[0],
        medications: [] as { name: string; result: string; igE: string; level: string; class: string }[]
    });

    // Auto-generate Order ID on mount
    useEffect(() => {
        if (isAuthenticated && !formData.orderId) {
            const generatedId = `AEM${Date.now().toString().slice(-8)}`;
            setFormData(prev => ({ ...prev, orderId: generatedId }));
        }
    }, [isAuthenticated]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === 'AllergoLab2024!') {
            setIsAuthenticated(true);
            setMessage({ type: '', text: '' });
        } else {
            setMessage({ type: 'error', text: 'Неверный пароль' });
        }
    };

    const toggleMedication = (medName: string) => {
        const newSelected = new Set(selectedMeds);
        if (newSelected.has(medName)) {
            newSelected.delete(medName);
        } else {
            newSelected.add(medName);
        }
        setSelectedMeds(newSelected);
    };

    const addSelectedMedications = () => {
        if (selectedMeds.size === 0) return;

        const newMeds = Array.from(selectedMeds).map(name => ({
            name,
            result: 'Отрицательный',
            igE: '< 0.35',
            level: 'отсутствует',
            class: '0'
        }));

        setFormData({
            ...formData,
            medications: [...formData.medications, ...newMeds]
        });
        setSelectedMeds(new Set());
    };

    const updateMedResult = (index: number, field: string, value: string) => {
        const newMeds = [...formData.medications];
        newMeds[index] = { ...newMeds[index], [field]: value };
        setFormData({ ...formData, medications: newMeds });
    };

    const removeMedication = (index: number) => {
        const newMeds = [...formData.medications];
        newMeds.splice(index, 1);
        setFormData({ ...formData, medications: newMeds });
    };

    const handleSubmit = async () => {
        if (!formData.orderId || !formData.patientName) {
            setMessage({ type: 'error', text: 'Заполните обязательные поля' });
            return;
        }

        if (formData.medications.length === 0) {
            setMessage({ type: 'error', text: 'Добавьте хотя бы один препарат' });
            return;
        }

        setLoading(true);
        // Clean data before submission
        const cleanOrderId = formData.orderId.trim();
        const cleanPhone = formData.phone.replace(/[^\d+]/g, '');
        const submitData = { ...formData, orderId: cleanOrderId, phone: cleanPhone };

        try {
            const response = await fetch('/api/add-result', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(submitData)
            });

            const data = await response.json();

            if (response.ok) {
                setMessage({ type: 'success', text: 'Результат успешно сохранен!' });

                const url = `https://allergoexpressmed.vercel.app/?orderId=${cleanOrderId}`;
                setQrCodeUrl(url);
                setLastSavedOrderId(cleanOrderId);

                // Reset form with new auto-generated ID
                const newId = `AEM${Date.now().toString().slice(-8)}`;
                setFormData({
                    orderId: newId,
                    patientName: '',
                    phone: '',
                    birthDate: '',
                    iin: '',
                    gender: 'Мужской',
                    address: '',
                    customer: 'AllergoExpress ImmunoLab',
                    sampleDate: new Date().toISOString().split('T')[0],
                    registrationDate: new Date().toISOString().split('T')[0],
                    date: new Date().toISOString().split('T')[0],
                    medications: []
                });

                setTimeout(() => setMessage({ type: '', text: '' }), 5000);
            } else {
                throw new Error(data.error || 'Ошибка сохранения');
            }
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/90 backdrop-blur-sm">
                <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm">
                    <h2 className="text-2xl font-bold mb-6 text-center">🔐 Вход для персонала</h2>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Введите пароль"
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        {message.text && (
                            <div className={`text-sm text-center ${message.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
                                {message.text}
                            </div>
                        )}
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                        >
                            Войти
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full text-slate-500 py-2 hover:text-slate-700"
                        >
                            Отмена
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm overflow-y-auto py-10">
            <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl my-auto">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 flex justify-between items-center rounded-t-2xl">
                    <h2 className="text-xl font-bold">📋 Админ-панель: Добавление результатов</h2>
                    <button onClick={onClose} className="text-white/70 hover:text-white text-2xl">✕</button>
                </div>

                <div className="p-8">
                    {/* Patient Info */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
                        <h3 className="font-bold text-lg mb-4">👤 Информация о пациенте</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Номер заказа *</label>
                                <input
                                    type="text"
                                    value={formData.orderId}
                                    onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg bg-white"
                                    placeholder="Авто-генерируется"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">ФИО Пациента *</label>
                                <input
                                    type="text"
                                    value={formData.patientName}
                                    onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg"
                                    placeholder="Иванов Иван Иванович"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">ИИН (Индивидуальный идентификационный номер)</label>
                                <input
                                    type="text"
                                    value={formData.iin}
                                    onChange={(e) => setFormData({ ...formData, iin: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg"
                                    placeholder="123456789012"
                                    maxLength={12}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Пол</label>
                                <select
                                    value={formData.gender}
                                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg"
                                >
                                    <option value="Мужской">Мужской</option>
                                    <option value="Женский">Женский</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Телефон</label>
                                <input
                                    type="text"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg"
                                    placeholder="+7 XXX XXX XX XX"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Дата рождения</label>
                                <input
                                    type="date"
                                    value={formData.birthDate}
                                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Адрес</label>
                                <input
                                    type="text"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg"
                                    placeholder="г. Алматы, ул. ..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Заказчик</label>
                                <select
                                    value={formData.customer}
                                    onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg"
                                >
                                    <option value="AllergoExpress ImmunoLab">AllergoExpress ImmunoLab</option>
                                    <option value="Частное лицо">Частное лицо</option>
                                    <option value="Медицинский центр">Медицинский центр</option>
                                    <option value="Стоматологическая клиника">Стоматологическая клиника</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Дата взятия пробы</label>
                                <input
                                    type="date"
                                    value={formData.sampleDate}
                                    onChange={(e) => setFormData({ ...formData, sampleDate: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Дата регистрации</label>
                                <input
                                    type="date"
                                    value={formData.registrationDate}
                                    onChange={(e) => setFormData({ ...formData, registrationDate: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Дата анализа</label>
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Quick Select Medications */}
                    <div className="border rounded-xl p-6 mb-6">
                        <h3 className="font-semibold text-lg mb-4">💊 Быстрый выбор препаратов</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4 max-h-64 overflow-y-auto p-2 bg-slate-50 rounded-lg">
                            {MEDICATIONS.map(med => (
                                <label key={med} className="flex items-center gap-2 p-2 hover:bg-white rounded cursor-pointer transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={selectedMeds.has(med)}
                                        onChange={() => toggleMedication(med)}
                                        className="w-4 h-4 text-blue-600"
                                    />
                                    <span className="text-sm">{med}</span>
                                </label>
                            ))}
                        </div>
                        <button
                            onClick={addSelectedMedications}
                            disabled={selectedMeds.size === 0}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            ➕ Добавить выбранные ({selectedMeds.size})
                        </button>
                    </div>

                    {/* Added Medications */}
                    <div className="border-t pt-6 mb-6">
                        <h3 className="font-semibold text-lg mb-2">📊 Добавленные препараты ({formData.medications.length})</h3>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-sm">
                            <p className="font-semibold mb-1">💡 Как заполнять:</p>
                            <ul className="text-xs space-y-1 text-slate-700">
                                <li><strong>Концентрация IgE:</strong> Введите значение (например: &lt; 0.35, 0.50, 5.2, 25.0)</li>
                                <li><strong>Класс:</strong> Выберите от 0 до 6 (0 = отсутствует, 6 = очень высокий)</li>
                                <li><strong>Уровень:</strong> Введите описание (например: отсутствует, низкий, средний, высокий)</li>
                            </ul>
                        </div>
                        <div className="space-y-2">
                            {formData.medications.map((med, idx) => (
                                <div key={idx} className="flex items-center gap-3 bg-white border p-3 rounded-lg shadow-sm">
                                    <div className="flex-1 font-medium">{med.name}</div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs text-slate-500">Концентрация IgE (МЕ/мл)</label>
                                        <input
                                            type="text"
                                            value={med.igE}
                                            onChange={(e) => updateMedResult(idx, 'igE', e.target.value)}
                                            className="w-28 px-2 py-1 border rounded text-sm"
                                            placeholder="< 0.35"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs text-slate-500">Класс (0-6)</label>
                                        <select
                                            value={med.class}
                                            onChange={(e) => updateMedResult(idx, 'class', e.target.value)}
                                            className="px-2 py-1 border rounded text-sm w-20"
                                        >
                                            <option value="0">0</option>
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                            <option value="5">5</option>
                                            <option value="6">6</option>
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs text-slate-500">Уровень</label>
                                        <input
                                            type="text"
                                            value={med.level}
                                            onChange={(e) => updateMedResult(idx, 'level', e.target.value)}
                                            className="w-32 px-2 py-1 border rounded text-sm"
                                            placeholder="отсутствует"
                                        />
                                    </div>
                                    <button
                                        onClick={() => removeMedication(idx)}
                                        className="text-red-500 hover:text-red-700 font-bold ml-2"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            ))}
                            {formData.medications.length === 0 && (
                                <div className="text-center text-slate-400 py-8">Выберите препараты выше ☝️</div>
                            )}
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="flex justify-end gap-4 border-t pt-6">
                        {message.text && (
                            <div className={`flex items-center ${message.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
                                {message.text}
                            </div>
                        )}
                        <button
                            onClick={handleSubmit}
                            disabled={loading || formData.medications.length === 0}
                            className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            {loading ? '💾 Сохранение...' : '✅ Сохранить результат'}
                        </button>
                    </div>

                    {/* QR Code Display */}
                    {qrCodeUrl && (
                        <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-green-50 rounded-xl shadow-lg border-2 border-blue-200 flex flex-col items-center text-center animate-fade-in">
                            <h4 className="font-bold text-slate-800 mb-4 text-xl">🎉 QR-код для пациента</h4>
                            <div className="bg-white p-6 rounded-lg shadow-md border-4 border-white mb-4">
                                <QRCodeCanvas value={qrCodeUrl} size={220} level={"H"} />
                            </div>
                            <p className="text-sm text-slate-600 mb-2">Результаты для заказа: <strong>{lastSavedOrderId}</strong></p>
                            <p className="text-xs text-slate-500 mb-4 break-all font-mono bg-white px-3 py-2 rounded max-w-md">{qrCodeUrl}</p>
                            <div className="flex flex-wrap justify-center gap-4">
                                <button
                                    onClick={() => {
                                        const canvas = document.querySelector('canvas');
                                        if (canvas) {
                                            const pngUrl = canvas.toDataURL("image/png");
                                            const downloadLink = document.createElement("a");
                                            downloadLink.href = pngUrl;
                                            downloadLink.download = `QR-${lastSavedOrderId}.png`;
                                            document.body.appendChild(downloadLink);
                                            downloadLink.click();
                                            document.body.removeChild(downloadLink);
                                        }
                                    }}
                                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-md"
                                >
                                    📥 Скачать QR-код
                                </button>
                                <button
                                    onClick={() => {
                                        const text = `Здравствуйте! Ваши результаты анализов готовы. Посмотреть: ${qrCodeUrl}`;
                                        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
                                        window.open(whatsappUrl, '_blank');
                                    }}
                                    className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors text-sm font-medium shadow-md flex items-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" /></svg>
                                    Отправить в WhatsApp
                                </button>
                                <button
                                    onClick={() => setQrCodeUrl(null)}
                                    className="text-slate-600 hover:text-slate-800 px-6 py-3 text-sm border border-slate-300 rounded-lg hover:bg-slate-50"
                                >
                                    Закрыть
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
