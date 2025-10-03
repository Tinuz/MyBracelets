# AI Photo-to-Bracelet Design Feature - Testing Guide

## Overzicht
Deze nieuwe feature gebruikt OpenAI Vision API om foto's te analyseren en automatisch 3 kralenarmband ontwerpen voor te stellen die qua kleur bij de foto passen.

## Setup Vereisten

### 1. OpenAI API Key Instellen
Je moet een OpenAI API key toevoegen aan je `.env` bestand:

```bash
# OpenAI API (for photo analysis feature)
# Get your API key from: https://platform.openai.com/api-keys
OPENAI_API_KEY="sk-proj-..."
```

**Hoe krijg je een API key:**
1. Ga naar https://platform.openai.com/api-keys
2. Maak een account aan of log in
3. Klik op "Create new secret key"
4. Kopieer de key en plak deze in je `.env` bestand

### 2. Dev Server Starten
```bash
npm run dev
```

## Hoe Te Testen

### Stap 1: Navigeer naar de Beads Designer
1. Open http://localhost:3000/nl
2. Klik op "Ontwerp Nu" of navigeer naar `/nl/designer`
3. Kies "Small Beads Bracelet" (4mm kralen)

### Stap 2: Upload een Foto
Je ziet nu een **AI Design Assistant** sectie bovenaan met een upload gebied.

**Test scenario's:**
- ✅ **Drag & Drop**: Sleep een foto naar het upload gebied
- ✅ **Click to Upload**: Klik op het gebied om de file picker te openen
- ✅ **Mobile Test**: Test op een mobiel apparaat via camera upload

**Goede test foto's:**
- Outfit foto's met duidelijke kleuren
- Kledingstukken met meerdere kleuren
- Accessoires of tassen met contrasterende kleuren
- Interieur foto's met kleuren die je mooi vindt

### Stap 3: AI Analyse
Na het uploaden zie je:
1. **Preview** van de foto
2. **Loading State** - "AI analyseert je foto..."
3. **Progress Indicator** tijdens de analyse

### Stap 4: Bekijk Suggesties
Je krijgt 3 ontwerp suggesties:
1. **Monochromatic/Tonal** - Tinten van de hoofdkleur
2. **Complementary** - Contrasterende kleuren
3. **Accent** - Hoofdkleur met accent kleuren

Elk voorstel toont:
- ✅ Beschrijvende naam (bijv. "Ocean Blues")
- ✅ Korte beschrijving
- ✅ Kleur preview (6-8 bolletjes)
- ✅ Miniature armband preview
- ✅ "Gebruik dit ontwerp" knop

### Stap 5: Selecteer een Ontwerp
Klik op "Gebruik dit ontwerp" bij een suggestie:
- ✅ Ontwerp wordt geladen in de designer
- ✅ Kralen worden automatisch geplaatst
- ✅ Je kunt het ontwerp verder aanpassen
- ✅ Scroll naar canvas (smooth scroll)

### Stap 6: Verder Customizen
Na het laden van een suggestie kun je:
- ✅ Kralen verslepen om ze te verplaatsen
- ✅ Nieuwe kralen toevoegen
- ✅ Kralen verwijderen
- ✅ Patroon aanpassen
- ✅ Undo/Redo gebruiken

### Stap 7: Overslaan Optie
Test ook de "Overslaan en zelf ontwerpen" optie:
- ✅ Verbergt de foto upload sectie
- ✅ Toont direct de handmatige designer
- ✅ Je kunt later niet meer terug naar photo upload (tenzij je refresht)

## Expected Flow

```
┌─────────────────┐
│  Upload Foto    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  AI Analyse     │  (OpenAI Vision API)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  3 Suggesties   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Selecteer       │
│ Ontwerp         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Designer       │  (kralen geplaatst)
│  Canvas         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Verder          │
│ Customizen      │
└─────────────────┘
```

## API Endpoints

### POST `/api/beads/analyze-photo`
**Request:**
- `FormData` met `image` file

**Response:**
```json
{
  "success": true,
  "analyzedColors": ["#hex1", "#hex2", ...],
  "mood": "warm, vibrant, playful",
  "suggestions": [
    {
      "name": "Ocean Blues",
      "description": "Cool tones inspired by the sea",
      "colors": ["#1e40af", "#3b82f6", "#60a5fa", ...],
      "beadIds": ["bead-id-1", "bead-id-2", ...]
    },
    ...
  ]
}
```

## Features Geïmplementeerd

### Frontend
- ✅ `PhotoUpload` component met drag & drop
- ✅ `SuggestionsPanel` component met 3 ontwerpen
- ✅ Integratie in `BeadsDesigner`
- ✅ Loading states en error handling
- ✅ Smooth transitions en animations
- ✅ Mobile responsive
- ✅ Nederlandse vertalingen

### Backend
- ✅ OpenAI Vision API integratie
- ✅ Kleur extractie en analyse
- ✅ Matching met beschikbare beads
- ✅ 3 diverse ontwerp suggesties
- ✅ Error handling

### UX Flow
- ✅ Optionele photo upload (kan overgeslagen worden)
- ✅ Alleen zichtbaar bij lege canvas
- ✅ Verdwijnt na selectie van suggestie
- ✅ Klant kan verder customizen na selectie

## Error Scenarios Te Testen

1. **Geen API Key**
   - Error: "Failed to analyze photo"
   - Check: Console toont OpenAI auth error

2. **Invalid File Type**
   - Error: "Please select an image file"
   - Check: .txt of .pdf files worden geweigerd

3. **File Te Groot**
   - Error: "Image size must be less than 10MB"
   - Check: Files > 10MB worden geweigerd

4. **Network Error**
   - Error: "Failed to analyze photo"
   - Check: Graceful fallback met error message

5. **No Matching Beads**
   - Check: API matcht closest available beads
   - Fallback: Gebruikt standaard kleuren

## Performance Notes

- **API Cost**: ~$0.01 per foto analyse (GPT-4o Vision)
- **Response Time**: 3-8 seconden (afhankelijk van foto grootte)
- **File Size Limit**: 10MB max
- **Supported Formats**: JPG, PNG, WEBP

## Keyboard Shortcuts (in Designer)

- `Cmd/Ctrl + Z`: Undo
- `Cmd/Ctrl + Shift + Z`: Redo
- `Escape`: Deselect bead

## Mobile Considerations

- ✅ Camera upload support
- ✅ Touch gestures for dragging
- ✅ Responsive grid layout
- ✅ Optimized for smaller screens

## Troubleshooting

### "Failed to analyze photo"
1. Check if `OPENAI_API_KEY` is set in `.env`
2. Restart dev server after adding key
3. Check OpenAI API quota/billing

### Suggesties tonen geen kleuren
1. Check if beads exist in database
2. Verify colorHex values in Bead model
3. Check browser console for errors

### Photo upload werkt niet
1. Check file type (moet image/* zijn)
2. Check file size (< 10MB)
3. Check browser console for CORS errors

## Next Steps / Improvements

Mogelijke toekomstige verbeteringen:
- [ ] Foto history (eerder geüploade foto's)
- [ ] Meer ontwerp styles (bohemian, minimalist, etc.)
- [ ] Preview van armband op pols (AR feature)
- [ ] Delen van suggesties via social media
- [ ] Opslaan van favoriete suggesties

## Code Locaties

- **API Endpoint**: `app/api/beads/analyze-photo/route.ts`
- **PhotoUpload Component**: `components/designer/PhotoUpload.tsx`
- **SuggestionsPanel Component**: `components/designer/SuggestionsPanel.tsx`
- **BeadsDesigner Integration**: `components/designer/BeadsDesigner.tsx` (lines 60-75, 420-490)
- **Translations**: `messages/nl.json` (photoUpload, suggestions sections)
