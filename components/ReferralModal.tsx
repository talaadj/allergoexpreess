import React, { useState } from 'react';
// @ts-ignore
import html2pdf from 'html2pdf.js';
import { Language } from '../types';
import { TRANSLATIONS } from '../utils/translations';

interface ReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const ReferralModal: React.FC<ReferralModalProps> = ({ isOpen, onClose, lang }) => {
  const [formData, setFormData] = useState({
    clinic: '',
    patientName: '',
    dob: '',
    doctor: '',
    date: '',
    otherDrug: '',
    selectedDrugs: [] as string[]
  });
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const t = TRANSLATIONS[lang] || TRANSLATIONS['ru'];

  if (!isOpen) return null;

  const handleDrugToggle = (drug: string) => {
    setFormData(prev => ({
      ...prev,
      selectedDrugs: prev.selectedDrugs.includes(drug)
        ? prev.selectedDrugs.filter(d => d !== drug)
        : [...prev.selectedDrugs, drug]
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    setIsGeneratingPdf(true);
    const element = document.getElementById('referral-pdf-content');
    const opt = {
      margin: [5, 5, 5, 5] as [number, number, number, number], // Reduced margins for better fit
      filename: `referral-${formData.patientName || 'patient'}.pdf`,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
    };

    try {
      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error("PDF generation failed:", error);
      alert("Failed to generate PDF. Please try printing instead.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // The Content Component (Reused for both Display and Print to ensure WYSIWYG)
  const ReferralFormContent = ({ isPrint = false }) => (
    <div className={`bg-white p-6 max-w-2xl mx-auto relative ${isPrint ? 'w-full max-w-none p-4' : 'border-2 border-slate-800'}`}>

      {/* Addresses Section (Blue) */}
      <div className="mb-4 border-b-2 border-blue-600 pb-3">
        <h3 className="text-center text-blue-700 font-bold text-base uppercase mb-1 print:text-blue-700 print-color-adjust-exact">
          {t.ui.locationsTitle}:
        </h3>
        <div className="grid grid-cols-3 gap-2 text-[7px] leading-tight text-blue-800 print:text-blue-800 print-color-adjust-exact">
          {t.branches.map((branch, idx) => (
            <div key={idx} className="mb-1">
              <p className="font-bold">{branch.address.split(':')[0]}</p>
              <p>{branch.address.split(':')[1]}</p>
              {branch.phone && <p>{branch.phone}</p>}
            </div>
          ))}
        </div>
        <div className="mt-1 text-center text-red-600 font-bold text-[9px] uppercase print:text-red-600 print-color-adjust-exact">
          Подготовка к анализу крови: Кровь сдается строго НАТОЩАК!
          <br />
          За 3 дня исключить прием антигистаминных и лекарственных препаратов.
        </div>
      </div>

      {/* Form Header */}
      <div className="mb-3">
        <div className="flex items-center gap-3 mb-3">
          <img src="/logo-full.png" alt="AllergoExpress Immunolab" className="h-8" />
          <div className="text-left">
            <h1 className="text-lg font-bold text-black uppercase tracking-wider">{t.ui.referralTitle}</h1>
            <p className="text-[10px] font-semibold text-black leading-snug">{t.ui.referralSubtitle}</p>
          </div>
        </div>
      </div>

      {/* Patient Info Inputs */}
      <div className="space-y-2 mb-3">
        <div className="flex items-end gap-2">
          <label className="text-[10px] font-bold text-black min-w-[60px]">{t.ui.referralClinic}</label>
          {isPrint ? (
            <div className="flex-1 border-b border-black px-2 py-0.5 font-medium text-black text-xs">{formData.clinic}</div>
          ) : (
            <>
              <input
                list="clinic-list-print"
                type="text"
                value={formData.clinic}
                onChange={e => setFormData({ ...formData, clinic: e.target.value })}
                className="flex-1 border-b border-black focus:border-rose-500 outline-none px-2 py-0.5 bg-transparent font-medium text-black text-xs"
                placeholder={t.ui.referralClinicPlaceholder}
              />
              <datalist id="clinic-list-print">
                {t.branches.map((branch, index) => (
                  <option key={index} value={branch.address} />
                ))}
              </datalist>
            </>
          )}
        </div>
        <div className="flex gap-4">
          <div className="flex items-end gap-2 flex-1">
            <label className="text-[10px] font-bold text-black min-w-[40px]">{t.ui.referralPatient}</label>
            {isPrint ? (
              <div className="flex-1 border-b border-black px-2 py-0.5 font-medium text-black text-xs">{formData.patientName}</div>
            ) : (
              <input
                type="text"
                value={formData.patientName}
                onChange={e => setFormData({ ...formData, patientName: e.target.value })}
                className="flex-1 border-b border-black focus:border-rose-500 outline-none px-2 py-0.5 bg-transparent font-medium text-black text-xs"
              />
            )}
          </div>
          <div className="flex items-end gap-2 w-1/3">
            <label className="text-[10px] font-bold text-black whitespace-nowrap">{t.ui.referralBirthDate}</label>
            {isPrint ? (
              <div className="flex-1 border-b border-black px-2 py-0.5 font-medium text-black text-xs">{formData.dob}</div>
            ) : (
              <input
                type="text"
                value={formData.dob}
                onChange={e => setFormData({ ...formData, dob: e.target.value })}
                className="flex-1 border-b border-black focus:border-rose-500 outline-none px-2 py-0.5 bg-transparent font-medium text-black text-xs"
              />
            )}
          </div>
        </div>
      </div>

      {/* Drug List - Using table for PDF compatibility */}
      <div className="border-t border-b border-black py-1.5 mb-3">
        <table className="w-full text-[9px]" style={{ borderCollapse: 'collapse' }}>
          <tbody>
            {(() => {
              const drugs = t.referralDrugs;
              const rows = [];
              for (let i = 0; i < drugs.length; i += 2) {
                rows.push(
                  <tr key={i}>
                    <td style={{ padding: '2px 4px', verticalAlign: 'top', width: '50%' }}>
                      <label className="flex items-start gap-1.5 cursor-pointer group" onClick={() => !isPrint && handleDrugToggle(drugs[i])}>
                        <span
                          className={`flex-shrink-0 border border-black flex items-center justify-center print-color-adjust-exact ${formData.selectedDrugs.includes(drugs[i]) ? 'bg-black text-white' : 'bg-white'}`}
                          style={{ width: '10px', height: '10px', fontSize: '7px', marginTop: '1.5px' }}
                        >
                          {formData.selectedDrugs.includes(drugs[i]) ? '✓' : ''}
                        </span>
                        <span className={`text-black leading-tight ${formData.selectedDrugs.includes(drugs[i]) ? 'font-bold' : ''}`}>
                          {drugs[i]}
                        </span>
                      </label>
                    </td>
                    {drugs[i + 1] && (
                      <td style={{ padding: '2px 4px', verticalAlign: 'top', width: '50%' }}>
                        <label className="flex items-start gap-1.5 cursor-pointer group" onClick={() => !isPrint && handleDrugToggle(drugs[i + 1])}>
                          <span
                            className={`flex-shrink-0 border border-black flex items-center justify-center print-color-adjust-exact ${formData.selectedDrugs.includes(drugs[i + 1]) ? 'bg-black text-white' : 'bg-white'}`}
                            style={{ width: '10px', height: '10px', fontSize: '7px', marginTop: '1.5px' }}
                          >
                            {formData.selectedDrugs.includes(drugs[i + 1]) ? '✓' : ''}
                          </span>
                          <span className={`text-black leading-tight ${formData.selectedDrugs.includes(drugs[i + 1]) ? 'font-bold' : ''}`}>
                            {drugs[i + 1]}
                          </span>
                        </label>
                      </td>
                    )}
                  </tr>
                );
              }
              return rows;
            })()}
            <tr>
              <td colSpan={2} style={{ padding: '4px 4px 2px 4px' }}>
                <span className="font-bold text-black">{t.ui.referralOther}</span>
                {isPrint ? (
                  <span className="border-b border-black px-2 text-black text-[9px] inline-block" style={{ minWidth: '200px' }}>{formData.otherDrug}</span>
                ) : (
                  <input
                    type="text"
                    value={formData.otherDrug}
                    onChange={e => setFormData({ ...formData, otherDrug: e.target.value })}
                    className="border-b border-black outline-none px-2 bg-transparent text-black text-[9px]"
                    style={{ minWidth: '200px' }}
                  />
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Footer Info */}
      <div className="flex flex-col gap-1 mb-3">
        <div className="bg-green-700 text-white p-1 text-center print:bg-green-700 print:text-white print-color-adjust-exact">
          <p className="text-[10px] font-bold uppercase">
            {t.ui.referralPrice} - результат в тот же день в 17:00
          </p>
        </div>
        <div className="bg-white border-2 border-red-600 p-1 text-center print:border-red-600 print-color-adjust-exact">
          <p className="text-red-600 text-xs font-extrabold uppercase print:text-red-600">
            Экспресс анализ : 8000тг - результат за 2 часа
          </p>
        </div>
      </div>

      {/* Bottom Info */}
      <div className="flex justify-between items-start text-[9px] text-black mb-3">
        <div className="flex-1">
          <p className="font-bold">Время забора крови 08:00 - 12:00</p>
          <p className="font-bold">Выдача результата 12:00 - 14:00</p>
        </div>
        <div className="text-right flex-1">
          <p className="font-bold text-red-600 print:text-red-600">Экспресс анализ проводится по адресу:</p>
          <p className="font-semibold">г. Алматы, ул. Шагабутдинова 132</p>
        </div>
      </div>

      {/* Signatures */}
      <div className="flex justify-between items-end pt-1.5 border-t border-black">
        <div className="flex items-end gap-2 flex-1">
          <span className="text-xs font-bold text-black">{t.ui.referralDoctor}</span>
          {isPrint ? (
            <div className="flex-1 border-b border-black text-black text-xs py-0.5">{formData.doctor}</div>
          ) : (
            <input
              type="text"
              value={formData.doctor}
              onChange={e => setFormData({ ...formData, doctor: e.target.value })}
              className="flex-1 border-b border-black outline-none bg-transparent text-black text-xs py-0.5"
            />
          )}
        </div>
        <div className="flex items-end gap-2 flex-1">
          <span className="text-xs font-bold text-black">{t.ui.referralDate}</span>
          {isPrint ? (
            <div className="flex-1 border-b border-black text-black text-xs py-0.5">{formData.date}</div>
          ) : (
            <input
              type="text"
              value={formData.date}
              onChange={e => setFormData({ ...formData, date: e.target.value })}
              className="flex-1 border-b border-black outline-none bg-transparent text-black text-xs py-0.5"
            />
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Modal UI */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm print:hidden">
        <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">

          {/* Header */}
          <div className="bg-slate-800 px-6 py-4 flex justify-between items-center flex-shrink-0">
            <h2 className="text-white font-semibold text-lg">{t.ui.btnGetReferral}</h2>
            <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          {/* Scrollable Content (Editing Mode) */}
          <div className="flex-1 overflow-y-auto p-8">
            <ReferralFormContent isPrint={false} />
          </div>

          {/* Actions */}
          <div className="bg-slate-50 p-6 flex justify-end gap-4 border-t border-slate-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium"
            >
              {t.ui.btnCancel}
            </button>
            <button
              onClick={handleDownloadPDF}
              disabled={isGeneratingPdf}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 shadow-md flex items-center gap-2 disabled:opacity-50"
            >
              {isGeneratingPdf ? (
                <span className="animate-pulse">Generating...</span>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  PDF
                </>
              )}
            </button>
            <button
              onClick={handlePrint}
              className="px-6 py-2 bg-rose-600 text-white rounded-lg font-semibold hover:bg-rose-700 shadow-md flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
              {t.ui.btnPrint}
            </button>
          </div>
        </div>
      </div>

      {/* Hidden Print Container - visible only during print */}
      <div className="hidden print:block print:absolute print:top-0 print:left-0 print:w-full print:h-full print:z-[9999] print:bg-white">
        <ReferralFormContent isPrint={true} />
      </div>

      {/* Hidden PDF Container - visible only during PDF generation (off-screen) */}
      <div style={{ position: 'fixed', left: '-9999px', top: 0, zIndex: -1 }}>
        <div id="referral-pdf-content" style={{ width: '210mm', backgroundColor: 'white', padding: '0' }}>
          <ReferralFormContent isPrint={true} />
        </div>
      </div>

      <style>{`
        @media print {
            body > *:not(.print\\:block) {
                display: none !important;
            }
            @page {
                margin: 1cm;
                size: A4;
            }
            /* Force background colors for chrome/safari */
            * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }
        }
      `}</style>
    </>
  );
};
