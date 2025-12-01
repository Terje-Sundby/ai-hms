import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Copy, 
  CheckCircle, 
  BookOpen, 
  MessageSquare,
  Menu,
  X,
  Lock 
} from 'lucide-react';

// --- DATA OG INNHOLD (Rediger dette for å endre tekst) ---

const companyName = "Din Bedrift AS"; 

const disclaimer = "Denne portalen er et internt støtteverktøy for bevisstgjøring rundt bruk av AI. Innholdet, inkludert vurderinger av verktøy og dataklassifisering, er basert på generelle råd og utgjør ikke juridisk rådgivning. Bedriften og den enkelte ansatte er selvstendig ansvarlige for å sikre at all bruk av AI skjer i samsvar med gjeldende lovverk (f.eks. GDPR, Åndsverkloven) og bedriftens interne retningslinjer. Leverandøren av portalen fraskriver seg ethvert ansvar for direkte eller indirekte tap som følge av bruk av informasjonen her.";

const policies = [
  {
    id: 1,
    title: "Sensitive Personopplysninger (GDPR)",
    status: "forbidden",
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

const tools = [
  { name: "ChatGPT (Gratis)", status: "unsafe", reason: "Bruker data til trening. Ikke legg inn bedriftsinfo." },
  { name: "ChatGPT Enterprise / Team", status: "safe", reason: "Sikker. Data slettes og brukes ikke til trening." },
  { name: "Microsoft Copilot (Innlogget)", status: "safe", reason: "Integrert i vår M365-lisens. Trygg sone." },
  { name: "Midjourney", status: "caution", reason: "Bildegenerering er ok, men ikke last opp bilder av ansatte/kunder." },
];

const prompts = [
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

// --- APP KOMPONENTER (Ikke endre under her) ---

const Header = ({ mobileMenuOpen, setMobileMenuOpen }) => (
  <header className="bg-slate-900 text-white sticky top-0 z-50 shadow-lg">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <ShieldCheck size={24} className="text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">AI-Håndboken <span className="text-slate-400 font-normal">| {companyName}</span></span>
        </div>
        
        <nav className="hidden md:flex space-x-8">
          <a href="#retningslinjer" className="hover:text-blue-400 transition-colors">Retningslinjer</a>
          <a href="#verktoy" className="hover:text-blue-400 transition-colors">Verktøy-sjekk</a>
          <a href="#prompts" className="hover:text-blue-400 transition-colors">Prompt-bibliotek</a>
        </nav>

        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-slate-300">
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>
    </div>
    
    {mobileMenuOpen && (
      <div className="md:hidden bg-slate-800 border-t border-slate-700">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <a href="#retningslinjer" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md hover:bg-slate-700">Retningslinjer</a>
          <a href="#verktoy" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md hover:bg-slate-700">Verktøy-sjekk</a>
          <a href="#prompts" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md hover:bg-slate-700">Prompt-bibliotek</a>
        </div>
      </div>
    )}
  </header>
);

const StatusBadge = ({ status }) => {
  const styles = {
    forbidden: "bg-red-100 text-red-800 border-red-200",
    allowed: "bg-green-100 text-green-800 border-green-200",
    allowed_conditional: "bg-yellow-100 text-yellow-800 border-yellow-200",
    unsafe: "bg-red-100 text-red-800",
    safe: "bg-green-100 text-green-800",
    caution: "bg-orange-100 text-orange-800"
  };

  const labels = {
    forbidden: "FORBUDT",
    allowed: "TILLATT",
    allowed_conditional: "BETINGET",
    unsafe: "USIKKER",
    safe: "TRYGG",
    caution: "VIS VARSOMHET"
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${styles[status]}`}>
      {labels[status]}
    </span>
  );
};

const PolicyCard = ({ policy }) => (
  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 transition hover:shadow-md">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-slate-50 rounded-lg text-slate-600">
        <policy.icon size={24} />
      </div>
      <StatusBadge status={policy.status} />
    </div>
    <h3 className="text-lg font-bold text-slate-900 mb-2">{policy.title}</h3>
    <p className="text-slate-600 text-sm leading-relaxed">{policy.description}</p>
  </div>
);

const ToolRow = ({ tool }) => (
  <div className="flex items-center justify-between p-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition">
    <div>
      <h4 className="font-semibold text-slate-900">{tool.name}</h4>
      <p className="text-sm text-slate-500">{tool.reason}</p>
    </div>
    <StatusBadge status={tool.status} />
  </div>
);

const PromptCard = ({ prompt }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-50 rounded-lg border border-slate-200 p-5 flex flex-col h-full">
      <div className="flex justify-between items-start mb-3">
        <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">{prompt.category}</span>
        <button 
          onClick={handleCopy}
          className="text-slate-400 hover:text-blue-600 transition flex items-center gap-1 text-xs font-medium"
        >
          {copied ? <span className="text-green-600">Kopiert!</span> : <span>Kopier</span>}
          {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
        </button>
      </div>
      <h4 className="font-bold text-slate-800 mb-2">{prompt.title}</h4>
      <div className="bg-white p-3 rounded border border-slate-200 text-sm text-slate-600 font-mono mb-4 flex-grow">
        {prompt.text}
      </div>
    </div>
  );
};

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPrompts = prompts.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Header mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
      
      {/* HERO SEKSJON */}
      <div className="bg-gradient-to-r from-blue-900 to-slate-900 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-6 tracking-tight">
            Sikker bruk av AI i <span className="text-blue-400">{companyName}</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-8">
            Din guide til å bruke kunstig intelligens effektivt, trygt og i tråd med selskapets retningslinjer.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#retningslinjer" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-bold transition flex items-center gap-2">
              Les reglene <ShieldCheck size={18} />
            </a>
            <a href="#prompts" className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg font-bold transition flex items-center gap-2">
              Hent prompts <MessageSquare size={18} />
            </a>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
        
        {/* SECTION 1: POLICIES */}
        <section id="retningslinjer" className="scroll-mt-24">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
              <BookOpen size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Retningslinjer for Data & Sikkerhet</h2>
              <p className="text-slate-500">Trafikklysmodellen for hva du kan dele.</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {policies.map(policy => (
              <PolicyCard key={policy.id} policy={policy} />
            ))}
          </div>
        </section>

        {/* SECTION 2: TOOLS */}
        <section id="verktoy" className="scroll-mt-24">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 text-purple-700 rounded-lg">
                  <Search size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Verktøy-sjekk</h2>
                  <p className="text-slate-500 text-sm">Er verktøyet godkjent for bruk?</p>
                </div>
              </div>
            </div>
            <div className="divide-y divide-slate-100">
              {tools.map((tool, index) => (
                <ToolRow key={index} tool={tool} />
              ))}
            </div>
            <div className="p-4 bg-slate-50 text-center">
              <p className="text-sm text-slate-500">Finner du ikke verktøyet? <a href="#" className="text-blue-600 hover:underline">Kontakt IT-avdeling</a></p>
            </div>
          </div>
        </section>

        {/* SECTION 3: PROMPTS */}
        <section id="prompts" className="scroll-mt-24">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
                <MessageSquare size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Prompt Bibliotek</h2>
                <p className="text-slate-500">Testede prompts som gir resultater.</p>
              </div>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Søk i prompts..." 
                className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-full md:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrompts.map((prompt, index) => (
              <PromptCard key={index} prompt={prompt} />
            ))}
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="bg-blue-600 rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Trenger du hjelp med en spesifikk oppgave?</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Vi har superbrukere i hver avdeling som kan hjelpe deg med å finjustere prompts eller sette opp workflows.
          </p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-blue-50 transition shadow-lg">
            Se liste over superbrukere
          </button>
        </section>

      </main>

      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="mb-4">© 2025 {companyName}. Internt bruk.</p>
          
          <div className="bg-slate-800 p-4 rounded-lg text-xs text-slate-500 max-w-3xl mx-auto leading-relaxed border border-slate-700">
            <strong>Juridisk ansvarsfraskrivelse:</strong> {disclaimer}
          </div>

          <p className="text-xs mt-6 opacity-50">Utviklet basert på "The AI-Guide Framework" av Terje Sundby.</p>
        </div>
      </footer>
    </div>
  );
}