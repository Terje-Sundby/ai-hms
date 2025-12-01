import { 
  ShieldCheck, 
  Lock, 
  CheckCircle, 
} from 'lucide-react';

// --- KUNDENS DATA (REDIGER HER) ---

export const companyName = "Din Bedrift AS"; 

export const policies = [
  {
    id: 1,
    title: "Sensitive Personopplysninger (GDPR)",
    status: "forbidden", // Valg: 'forbidden', 'allowed', 'allowed_conditional'
    description: "Det er strengt forbudt å legge inn navn, fødselsnummer, helseopplysninger eller andre identifiserbare data i offentlige AI-modeller.",
    icon: Lock
  },
  {
    id: 2,
    title: "Møtereferater & Interne Notater",
    status: "allowed_conditional",
    description: "Tillatt KUN hvis 'Data Training' er skrudd av i innstillingene, eller ved bruk av vår Enterprise-lisens.",
    icon: ShieldCheck
  },
  {
    id: 3,
    title: "Koding & Excel-formler",
    status: "allowed",
    description: "Fritt frem. Husk å dobbeltsjekke koden før produksjon.",
    icon: CheckCircle
  }
];

export const tools = [
  { name: "ChatGPT (Gratis)", status: "unsafe", reason: "Bruker data til trening. Ikke legg inn bedriftsinfo." },
  { name: "ChatGPT Enterprise / Team", status: "safe", reason: "Sikker. Data slettes og brukes ikke til trening." },
  { name: "Microsoft Copilot (Innlogget)", status: "safe", reason: "Integrert i vår M365-lisens. Trygg sone." },
  { name: "Midjourney", status: "caution", reason: "Bildegenerering er ok, men ikke last opp bilder av ansatte/kunder." },
];

export const prompts = [
  {
    category: "Ledelse",
    title: "Strategisk Analyse (SWOT)",
    text: "Opptre som en senior forretningsutvikler. Basert på følgende tekst [LIM INN TEKST], lag en SWOT-analyse. Fokuser spesielt på kommersielle trusler i det norske markedet."
  },
  {
    category: "Kommunikasjon",
    title: "Pressemelding fra stikkord",
    text: "Skriv en pressemelding basert på punktene under. Tonen skal være profesjonell, men engasjerende. Målgruppen er lokalaviser. [PUNKTER]"
  },
  {
    category: "HR",
    title: "Stillingsannonse",
    text: "Lag utkast til en stillingsannonse for [TITTEL]. Nøkkelkvalifikasjoner er: [LISTE]. Bedriftskulturen vår er preget av [VERDIER]. Bruk inkluderende språk."
  }
];