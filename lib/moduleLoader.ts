import type { ModuleConfig } from './types';

export class ModuleLoader {
  static getAvailableModules(): ModuleConfig[] {
    return [
      {
        id: 'gnc-video',
        title: 'GNC Video Analysetool',
        description: 'Professionelle Analyse für Get-New-Customers Videos',
        icon: '🎬',
        exampleText: `Hallo liebe Brautpaare! Ich nehme dieses Video auf, weil ich in den letzten Wochen immer wieder gesehen habe, dass viele Paare das Problem haben, den perfekten Hochzeitsfotografen zu finden.

Viele Paare haben das Problem, dass sie sich völlig überfordert fühlen bei der Auswahl und am Ende enttäuscht sind von den Ergebnissen. Dieses Video hilft euch dabei, Klarheit zu bekommen und die richtige Entscheidung zu treffen.

In diesem Video zeige ich euch die wichtigsten Kriterien für die Fotografen-Auswahl. Am Ende verrate ich euch meinen Geheimtipp, mit dem ihr sofort erkennt, ob ein Fotograf wirklich zu euch passt.

Also bleibt bis zum Ende dran - es lohnt sich!`,
        csvFile: 'gnc-video.csv',
        color: 'rose'
      }
    ];
  }

  static getModule(moduleId: string): ModuleConfig | null {
    return this.getAvailableModules().find(module => module.id === moduleId) || null;
  }
}
