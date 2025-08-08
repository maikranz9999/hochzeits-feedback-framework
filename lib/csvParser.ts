import Papa from 'papaparse';
import type { Requirement } from './types';

export class CSVParser {
  static parseRequirements(csvContent: string): Requirement[] {
    const result = Papa.parse(csvContent, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      delimiter: ',',
      transformHeader: (header) => header.trim()
    });

    return result.data.map((row: any) => ({
      abschnitt: row['Abschnitt'] || '',
      mussKann: (row['Muss / Kann'] || 'Kann') as 'Muss' | 'Kann',
      regel: row['Regel'] || '',
      beschreibung: row['Beschreibung der Anforderung'] || '',
      positivBeispiele: row['Positiv-Beispiele'] || '',
      negativBeispiele: row['Negativ-Beispiele'] || ''
    })).filter(req => req.regel.trim() !== '');
  }
}
