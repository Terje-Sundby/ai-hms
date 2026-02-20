// ============================================================
// KONFIGURASJON – Rediger dette for å tilpasse portalen
// ============================================================

export const companyName = "Din Bedrift AS";
export const companyLogo = null; // Legg inn URL til logo her, eller null for ikon
export const lastUpdated = "Februar 2026";
export const disclaimer = "Denne portalen er et internt støtteverktøy for bevisstgjøring rundt bruk av AI. Innholdet, inkludert vurderinger av verktøy og dataklassifisering, er basert på generelle råd og utgjør ikke juridisk rådgivning. Bedriften og den enkelte ansatte er selvstendig ansvarlige for å sikre at all bruk av AI skjer i samsvar med gjeldende lovverk (f.eks. GDPR, Åndsverkloven) og bedriftens interne retningslinjer. Leverandøren av portalen fraskriver seg ethvert ansvar for direkte eller indirekte tap som følge av bruk av informasjonen her.";

export const policies = [
  {
    id: 1,
    title: "Sensitive Personopplysninger (GDPR)",
    status: "forbidden",
    description: "Det er strengt forbudt å legge inn navn, fødselsnummer, helseopplysninger eller andre identifiserbare data i offentlige AI-modeller.",
  },
  {
    id: 2,
    title: "Møtereferater & Interne Notater",
    status: "allowed_conditional",
    description: "Tillatt KUN hvis 'Data Training' er skrudd av i innstillingene, eller ved bruk av Enterprise-lisens.",
  },
  {
    id: 3,
    title: "Koding & Excel-formler",
    status: "allowed",
    description: "Fritt frem. Husk å dobbeltsjekke koden før produksjon.",
  },
  {
    id: 4,
    title: "Kontrakter & Juridiske Dokumenter",
    status: "forbidden",
    description: "Interne kontrakter, avtaler og juridiske dokumenter skal ikke lastes opp i offentlige AI-tjenester.",
  },
  {
    id: 5,
    title: "Markedsføring & Innholdsproduksjon",
    status: "allowed",
    description: "Bruk gjerne AI til å skrive utkast, idémyldre og redigere markedsmateriell. Dobbeltsjekk fakta og tone.",
  },
  {
    id: 6,
    title: "Økonomidata & Budsjetter",
    status: "forbidden",
    description: "Interne regnskapstall, budsjetter og finansiell informasjon skal ikke deles med offentlige AI-modeller.",
  },
];

export const tools = [
  { name: "ChatGPT (Gratis)", status: "unsafe", reason: "Bruker data til trening. Ikke legg inn bedriftsinfo." },
  { name: "ChatGPT Enterprise / Team", status: "safe", reason: "Sikker. Data slettes og brukes ikke til trening." },
  { name: "Microsoft Copilot (Innlogget)", status: "safe", reason: "Integrert i M365-lisens. Trygg sone." },
  { name: "Microsoft Copilot (Ikke innlogget)", status: "unsafe", reason: "Behandles som offentlig modell. Unngå bedriftsdata." },
  { name: "Midjourney", status: "caution", reason: "Bildegenerering er ok, men ikke last opp bilder av ansatte/kunder." },
  { name: "Claude (Anthropic)", status: "safe", reason: "Bruker ikke samtaler til trening som standard. Sjekk innstillinger." },
  { name: "Google Gemini (Personlig)", status: "unsafe", reason: "Kobles til Google-konto. Ikke bruk med bedriftsdata." },
  { name: "Google Gemini for Workspace", status: "safe", reason: "Integrert i bedriftens Workspace-lisens. Trygg." },
  { name: "Grammarly (Gratis)", status: "caution", reason: "Sender tekst til skyen. Ikke bruk med sensitive dokumenter." },
  { name: "Grammarly Business", status: "safe", reason: "Bedriftsversjon med databehandleravtale." },
];

export const prompts = [
  {
    category: "Ledelse",
    title: "Strategisk Analyse (SWOT)",
    text: "Opptre som en senior forretningsutvikler. Basert på følgende tekst [LIM INN TEKST], lag en SWOT-analyse. Fokuser spesielt på kommersielle trusler i det norske markedet.",
  },
  {
    category: "Ledelse",
    title: "Møtereferat fra stikkord",
    text: "Lag et strukturert møtereferat basert på disse notatene: [NOTATER]. Inkluder: dato, deltakere, beslutninger og action points med ansvarlig og frist.",
  },
  {
    category: "Kommunikasjon",
    title: "Pressemelding fra stikkord",
    text: "Skriv en pressemelding basert på punktene under. Tonen skal være profesjonell, men engasjerende. Målgruppen er lokalaviser. [PUNKTER]",
  },
  {
    category: "Kommunikasjon",
    title: "E-post – vanskelig budskap",
    text: "Hjelp meg å skrive en profesjonell e-post som formidler følgende vanskelige budskap: [BUDSKAP]. Mottaker er [ROLLE]. Tonen skal være direkte, men empatisk.",
  },
  {
    category: "HR",
    title: "Stillingsannonse",
    text: "Lag utkast til en stillingsannonse for [TITTEL]. Nøkkelkvalifikasjoner er: [LISTE]. Bedriftskulturen vår er preget av [VERDIER]. Bruk inkluderende språk.",
  },
  {
    category: "HR",
    title: "Intervjuspørsmål",
    text: "Lag 8 gode intervjuspørsmål for stillingen som [TITTEL]. Inkluder en blanding av kompetanse-, motivasjons- og situasjonsbaserte spørsmål.",
  },
  {
    category: "Analyse",
    title: "Oppsummer langt dokument",
    text: "Les følgende tekst og lag et sammendrag på maks 200 ord. Fremhev de tre viktigste poengene og eventuelle beslutninger som må tas. [TEKST]",
  },
  {
    category: "Analyse",
    title: "Konkurrentanalyse",
    text: "Analyser følgende konkurrent basert på offentlig tilgjengelig informasjon: [BEDRIFTSNAVN]. Se på: produkter/tjenester, prising, målgruppe, styrker og svakheter.",
  },
  {
    category: "Koding",
    title: "Forklar kode",
    text: "Forklar hva denne koden gjør, linje for linje, på en måte en ikke-teknisk person forstår: [LIM INN KODE]",
  },
];
