import React, { useState } from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../utils/translations';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose, lang }) => {
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const t = TRANSLATIONS[lang] || TRANSLATIONS['ru'];

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setIsSubmitting(true);

    // Create mailto link with pre-filled subject and body
    const email = 'allergoexpressmed@gmail.com';
    const subject = encodeURIComponent('Обращение в поддержку');
    const body = encodeURIComponent(text);
    const mailtoUrl = `mailto:${email}?subject=${subject}&body=${body}`;

    // Open email client
    window.location.href = mailtoUrl;

    // Show success message
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setText('');

      // Auto close after success
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 2000);
    }, 500);
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden transform transition-all scale-100">

        {/* Header */}
        <div className="bg-rose-600 px-6 py-4 flex justify-between items-center">
          <h2 className="text-white font-semibold text-lg">
            {t.ui.feedbackTitle}
          </h2>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-8 text-center animate-fade-in">
              <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800">{t.ui.feedbackSuccessTitle}</h3>
              <p className="text-slate-500 mt-2">{t.ui.feedbackSuccessDesc}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <p className="text-sm text-slate-500 mb-4">
                {t.ui.feedbackFormDesc}
              </p>

              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={t.ui.feedbackPlaceholder}
                className="w-full h-32 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none resize-none text-slate-700 placeholder-slate-400 text-sm mb-4"
                required
              />

              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                  disabled={isSubmitting}
                >
                  {t.ui.btnCancel}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !text.trim()}
                  className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-all flex items-center gap-2
                    ${isSubmitting || !text.trim() ? 'bg-slate-300 cursor-not-allowed' : 'bg-rose-600 hover:bg-rose-700 shadow-md hover:shadow-lg'}
                  `}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {t.ui.btnSend}
                    </>
                  ) : (
                    t.ui.btnSend
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};