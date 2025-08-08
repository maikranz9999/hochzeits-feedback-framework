import React from 'react';
import type { FeedbackResult } from '../../lib/types';

interface FeedbackRendererProps {
  feedback: FeedbackResult;
  moduleColor: string;
}

export const FeedbackRenderer: React.FC<FeedbackRendererProps> = ({ feedback, moduleColor }) => {
  const getColorClasses = (type: 'success' | 'error' | 'info') => {
    const baseClasses = {
      success: 'bg-green-50 border border-green-200 text-green-800',
      error: 'bg-red-50 border border-red-200 text-red-800', 
      info: 'bg-blue-50 border border-blue-200 text-blue-800'
    };
    return baseClasses[type];
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
        📊 Analyse-Ergebnisse
      </h2>

      {/* Gesamtbewertung */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-800">Gesamtbewertung</h3>
          <div className="flex items-center">
            <span className="text-2xl font-bold text-indigo-600 mr-2">
              {feedback.gesamtbewertung}/10
            </span>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={`text-xl ${i < Math.round(feedback.gesamtbewertung/2) ? 'text-yellow-400' : 'text-gray-300'}`}>
                  ⭐
                </span>
              ))}
            </div>
          </div>
        </div>
        <p className="text-gray-700 text-sm">{feedback.zusammenfassung}</p>
      </div>

      {/* Erfüllte Muss-Kriterien */}
      {feedback.erfuellte_muss.length > 0 && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-green-700 mb-3">
            ✅ Erfüllte Muss-Kriterien ({feedback.erfuellte_muss.length})
          </h3>
          <div className="space-y-2">
            {feedback.erfuellte_muss.map((item, index) => (
              <div key={index} className={`p-3 rounded text-sm ${getColorClasses('success')}`}>
                <strong>{item.regel}</strong> - {item.bewertung}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Verbesserungsbedarf */}
      {feedback.nicht_erfuellte_muss.length > 0 && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-red-700 mb-3">
            ❌ Verbesserungsbedarf bei Muss-Kriterien ({feedback.nicht_erfuellte_muss.length})
          </h3>
          <div className="space-y-3">
            {feedback.nicht_erfuellte_muss.map((item, index) => (
              <div key={index} className={`p-3 rounded text-sm ${getColorClasses('error')}`}>
                <strong>{item.status}: {item.regel}</strong><br />
                <span className="text-gray-600 text-xs mt-1 block">
                  {item.erklaerung} {item.beispiel}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Erfüllte Kann-Kriterien */}
      {feedback.erfuellte_kann.length > 0 && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-blue-700 mb-3">
            💎 Bonus-Punkte erfüllt ({feedback.erfuellte_kann.length})
          </h3>
          <div className="space-y-2">
            {feedback.erfuellte_kann.map((item, index) => (
              <div key={index} className={`p-3 rounded text-sm ${getColorClasses('info')}`}>
                <strong>Erfüllt: {item.regel}</strong><br />
                <span className="text-gray-600 text-xs mt-1 block">{item.bewertung}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
