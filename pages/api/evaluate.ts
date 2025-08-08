import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt ist erforderlich' });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: 'OpenAI API Key nicht konfiguriert' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system', 
            content: 'Du bist ein Experte für Hochzeitsdienstleister-Marketing und analysierst Inhalte basierend auf spezifischen Anforderungen. Antworte immer im angeforderten JSON-Format. Verwende die Du-Form und gib konkrete, praxisnahe Beispiele mit "bspw.".'
          },
          { 
            role: 'user', 
            content: prompt 
          }
        ],
        max_tokens: 2500,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('OpenAI API Error:', response.status, errorData);
      throw new Error(`OpenAI API Fehler: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Ungültige Antwort von OpenAI API');
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('API Handler Error:', error);
    res.status(500).json({ 
      error: 'Fehler bei der Analyse', 
      details: error instanceof Error ? error.message : 'Unbekannter Fehler' 
    });
  }
}
