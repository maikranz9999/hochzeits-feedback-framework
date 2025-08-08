import React, { useState, useEffect } from 'react';
import { CSVParser } from '../lib/csvParser';
import { PromptGenerator } from '../lib/promptGenerator';
import { FeedbackRenderer } from './shared/FeedbackRenderer';
import type { Requirement, ModuleConfig, FeedbackResult } from '../lib/types';

interface FeedbackAnalyzerProps {
  module: ModuleConfig;
}

export const FeedbackAnalyzer: React.FC<FeedbackAnalyzerProps> = ({ module }) => {
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [inputText, setInputText] = useState('');
  const [feedback, setFeedback] = useState<FeedbackResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadRequirements();
  }, [module]);

  const loadRequirements = async () => {
    try {
      // Demo-Requirements für GNC - in Produktion aus CSV laden
      const demoRequirements: Requirement[] = [
        {
          abschnitt: "Einführung / Pattern Interrupt",
          mussKann: "Muss",
          regel: "Pattern Interrupt vorhanden",
          beschreibung: "Es muss ein klar formulierter Hook enthalten sein, der sofort die Aufmerksamkeit auf sich zieht und das Interesse weckt.",
          positivBeispiele: "\"am Ende verrate ich euch einen Geheimtipp\" oder \"ich zeige euch 10 exklusive Locations\"",
          negativBeispiele: ""
        },
        {
          abschnitt: "Einführung / Pattern Interrupt", 
          mussKann: "Muss",
          regel: "Persönlicher Anlass für das Video",
          beschreibung: "Der Dienstleister benennt einen konkreten, persönlichen Grund, warum er dieses Video aufnimmt.",
          positivBeispiele: "\"Ich nehme dieses Video auf, weil ich in letzter Zeit immer wieder gesehen habe, dass…\"",
          negativBeispiele: "Keine Begründung oder Motivation für das Video vorhanden"
        },
        {
          abschnitt: "Einführung / Pattern Interrupt",
          mussKann: "Muss", 
          regel: "Erfahrungsbezug zur Zielgruppe",
          beschreibung: "Der Dienstleister muss formulieren, dass er in der Vergangenheit wiederholt ein bestimmtes Problem bei Brautpaaren beobachtet hat.",
          positivBeispiele: "\"Ich habe bei meinen Paaren immer wieder festgestellt, dass…\"",
          negativBeispiele: ""
        },
        {
          abschnitt: "Einführung / Pattern Interrupt",
          mussKann: "Muss",
          regel: "Problem und Nutzen werden angerissen",
          beschreibung: "Es wird kurz dargelegt, welches konkrete Problem viele Brautpaare haben – und warum das Video hilfreich ist.",
          positivBeispiele: "\"Viele Paare haben das Problem, dass… Dieses Video hilft euch dabei, Klarheit zu bekommen.\"",
          negativBeispiele: ""
        },
        {
          abschnitt: "Einführung / Pattern Interrupt",
          mussKann: "Muss",
          regel: "Thema ist klar erkennbar",
          beschreibung: "Der thematische Schwerpunkt des GNC-Videos muss bereits aus den Stichpunkten eindeutig hervorgehen.",
          positivBeispiele: "\"In diesem Video geht's um das Thema XYZ – das habe ich ganz oft in den letzten Monaten gesehen.\"",
          negativBeispiele: "\"Unklare Formulierungen wie 'Ich rede heute einfach mal über ein Thema, das mir wichtig ist'\""
        },
        {
          abschnitt: "Einführung / Pattern Interrupt",
          mussKann: "Muss",
          regel: "Mehrwert wird angekündigt",
          beschreibung: "Es wird ein konkreter Mehrwert in Aussicht gestellt (z. B. Liste, Geheimtipp oder besondere Informationen).",
          positivBeispiele: "\"Und am Ende gibt's noch meine Liste mit 5 Tipps, wie ihr XYZ vermeidet.\"",
          negativBeispiele: ""
        },
        {
          abschnitt: "Hauptteil",
          mussKann: "Kann",
          regel: "Storytelling-Elemente", 
          beschreibung: "Geschichten und persönliche Erfahrungen machen das Video authentischer und interessanter.",
          positivBeispiele: "\"Letzte Woche hatte ich ein Paar, das genau diesen Fehler gemacht hat...\"",
          negativBeispiele: ""
        }
      ];
      setRequirements(demoRequirements);
    } catch (err) {
      setError('Fehler beim Laden der Bewertungskriterien');
    }
  };

  const handleAnalyze = async () => {
    if (!inputText.trim()) {
      setError('Bitte geben Sie einen Text ein.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const prompt = PromptGenerator.generateAnalysisPrompt(requirements, inputText, module.title);
      
      const response = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      if (!response.ok) throw new Error('API-Anfrage fehlgeschlagen');

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      
      if (!content) throw new Error('Keine Antwort erhalten');

      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const feedbackData = JSON.parse(jsonMatch[0]);
        setFeedback(feedbackData);
      } else {
        throw new Error('Ungültiges Antwortformat');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unbekannter Fehler');
    } finally {
      setLoading(false);
    }
  };

  const extractTextFromPDF = async (file: File): Promise<string> => {
    const reader = new FileReader();
    
    return new Promise((resolve, reject) => {
      reader.onload = async () => {
        try {
          const typedarray = new Uint8Array(reader.result as ArrayBuffer);
          const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.js');
          const pdfjsWorker = await import('pdfjs-dist/legacy/build/pdf.worker.js');
          // @ts-ignore
          pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

          const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
          let fullText = '';

          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            const strings = content.items.map((item: any) => item.str);
            fullText += strings.join(' ') + '\n';
          }

          resolve(fullText);
        } catch (error) {
          reject('Fehler beim PDF-Parsing');
        }
      };

      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      if (file.type === 'application/pdf') {
        const text = await extractTextFromPDF(file);
        setInputText(text);
      } else if (file.type === 'text/plain') {
        const reader = new FileReader();
        reader.onload = (e) => {
          setInputText(e.target?.result as string);
        };
        reader.readAsText(file);
      } else {
        setError('Nur PDF- und TXT-Dateien werden unterstützt.');
      }
    } catch (err) {
      setError('Fehler beim Laden der Datei.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            {module.icon} {module.title}
          </h1>
          <p className="text-lg text-gray-600">{module.description}</p>
          <div className="mt-2 text-sm text-gray-500">
            Basierend auf bewährten Marketing-Prinzipien der Hochzeitsbranche
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              📝 Inhalt eingeben
            </h2>
            
            {/* File Upload */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Datei hochladen (PDF oder TXT)
              </label>
              <input
                type="file"
                accept=".pdf,.txt"
                onChange={handleFileUpload}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100 mb-3"
              />
              <button
                onClick={() => setInputText(module.exampleText)}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg mb-3 transition-colors"
              >
                📄 Beispiel-Text laden (Demo)
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Oder direkt eingeben:
              </label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Fügen Sie hier Ihren ${module.title}-Inhalt ein...`}
                className="w-full h-48 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none"
              />
            </div>

            <button
              onClick={handleAnalyze}
              disabled={loading || !inputText.trim()}
              className="w-full bg-gradient-to-r from-rose-500 to-pink-600 text-white py-3 px-6 rounded-lg font-medium hover:from-rose-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Analysiere Inhalt...
                </div>
              ) : (
                `🔍 Inhalt analysieren`
              )}
            </button>

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700">❌ {error}</p>
              </div>
            )}

            {/* Requirements Preview */}
            <div className="mt-6 bg-gray-50 rounded-lg p-4">
              <details>
                <summary className="font-medium text-gray-700 cursor-pointer">
                  📋 Bewertungskriterien anzeigen ({requirements.length} Kriterien)
                </summary>
                <div className="space-y-2 mt-3">
                  {requirements.map((req, index) => (
                    <div key={index} className="bg-white p-3 rounded border text-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 text-xs rounded ${req.mussKann === 'Muss' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                          {req.mussKann}
                        </span>
                        <span className="font-medium text-gray-800">{req.regel}</span>
                      </div>
                      <p className="text-xs text-gray-600 mb-1">{req.beschreibung}</p>
                      {req.positivBeispiele && (
                        <p className="text-xs text-green-600">✓ {req.positivBeispiele}</p>
                      )}
                    </div>
                  ))}
                </div>
              </details>
            </div>
          </div>

          {/* Results Section */}
          {feedback ? (
            <FeedbackRenderer feedback={feedback} moduleColor={module.color} />
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📊</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  Bereit für die Analyse
                </h3>
                <p className="text-gray-500">
                  Geben Sie Ihren Inhalt ein und klicken Sie auf "Analysieren", 
                  um detailliertes Feedback zu erhalten.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
