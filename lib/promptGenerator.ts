import type { Requirement } from './types';

export class PromptGenerator {
  static generateAnalysisPrompt(requirements: Requirement[], text: string, moduleTitle: string): string {
    const requirementsText = requirements.map(req => 
      `**${req.regel}** (${req.mussKann}):
      ${req.beschreibung}
      ${req.positivBeispiele ? `Positiv-Beispiele: ${req.positivBeispiele}` : ''}
      ${req.negativBeispiele ? `Negativ-Beispiele: ${req.negativBeispiele}` : ''}`
    ).join('\n\n');

    return `Du bist ein Experte für Hochzeitsdienstleister-Marketing und analysierst ${moduleTitle}-Inhalte.

AUFGABE: Analysiere den folgenden Text basierend auf diesen spezifischen Anforderungen:

${requirementsText}

TEXT ZUR ANALYSE:
"${text}"

WICHTIGE BEWERTUNGSREGELN:
- "Fehlt" = Kriterium ist gar nicht erfüllt
- "Nur teilweise erfüllt" = Ansätze vorhanden, aber nicht vollständig/konkret genug
- Duze den Nutzer ("Du hast...", "Füge bspw. hinzu...")
- Gib konkrete Beispiele mit "bspw."

ANTWORTE IM FOLGENDEN JSON-FORMAT:
{
  "erfuellte_muss": [
    {"regel": "Pattern Interrupt vorhanden", "bewertung": "Starker Hook mit Geheimtipp-Versprechen erkennbar"}
  ],
  "nicht_erfuellte_muss": [
    {
      "regel": "Erfahrungsbezug zur Zielgruppe", 
      "status": "Fehlt",
      "erklaerung": "Du hast keine Formulierung über wiederholte Beobachtungen bei Brautpaaren.",
      "beispiel": "Füge bspw. hinzu: 'Ich habe bei meinen letzten 20 Paaren immer wieder festgestellt...'"
    }
  ],
  "erfuellte_kann": [
    {"regel": "Storytelling-Elemente", "bewertung": "Persönliche Erfahrungen werden verwendet"}
  ],
  "gesamtbewertung": 7,
  "zusammenfassung": "Kurze Einschätzung mit konstruktivem Fokus auf Hochzeitsbranche"
}

Sei spezifisch, konstruktiv und praxisorientiert für Hochzeitsdienstleister.`;
  }
}
