export interface Requirement {
  abschnitt: string;
  mussKann: 'Muss' | 'Kann';
  regel: string;
  beschreibung: string;
  positivBeispiele: string;
  negativBeispiele: string;
}

export interface ModuleConfig {
  id: string;
  title: string;
  description: string;
  icon: string;
  exampleText: string;
  csvFile: string;
  color: string;
}

export interface FeedbackResult {
  erfuellte_muss: Array<{
    regel: string;
    bewertung: string;
  }>;
  nicht_erfuellte_muss: Array<{
    regel: string;
    status: 'Fehlt' | 'Nur teilweise erfüllt';
    erklaerung: string;
    beispiel: string;
  }>;
  erfuellte_kann: Array<{
    regel: string;
    bewertung: string;
  }>;
  gesamtbewertung: number;
  zusammenfassung: string;
}
