import React, { useState, useEffect } from 'react';
import {
  ShieldCheck, Search, Copy, CheckCircle, BookOpen, MessageSquare,
  Menu, X, Lock, AlertTriangle, ChevronDown, ChevronUp, LogOut,
} from 'lucide-react';
import { companyName, disclaimer, policies, tools, prompts } from './config';
import { supabase } from './supabaseClient';
import LoginPage from './LoginPage';

const StatusBadge = ({ status }) => {
  const styles = {
    forbidden: "bg-red-100 text-red-800 border border-red-200",
    allowed: "bg-green-100 text-green-800 border border-green-200",
    allowed_conditional: "bg-yellow-100 text-yellow-800 border border-yellow-200",
    unsafe: "bg-red-100 text-red-800",
    safe: "bg-green-100 text-green-800",
    caution: "bg-orange-100 text-orange-800",
  };
  const labels = {
    forbidden: "FORBUDT", allowed: "TILLATT", allowed_conditional: "BETINGET",
    unsafe: "USIKKER", safe: "TRYGG", caution: "VIS VARSOMHET",
  };
  return <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${styles[status]}`}>{labels[status]}</span>;
};

const getPolicyIcon = (id) => {
  const icons = { 1: Lock, 2: ShieldCheck, 3: CheckCircle, 4: Lock, 5: CheckCircle, 6: AlertTriangle };
  const Icon = icons[id] || ShieldCheck;
  return <Icon size={24} />;
};

const PolicyCard = ({ policy }) => (
  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 transition hover:shadow-md">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-slate-50 rounded-lg text-slate-600">{getPolicyIcon(policy.id)}</div>
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
        <button onClick={handleCopy} className="text-slate-400 hover:text-blue-600 transition flex items-center gap-1 text-xs font-medium">
          {copied ? <span className="text-green-600">Kopiert!</span> : <span>Kopier</span>}
          {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
        </button>
      </div>
      <h4 className="font-bold text-slate-800 mb-2">{prompt.title}</h4>
      <div className="bg-white p-3 rounded border border-slate-200 text-sm text-slate-600 font-mono flex-grow leading-relaxed">{prompt.text}</div>
    </div>
  );
};

const Header = ({ mobileMenuOpen, setMobileMenuOpen, userEmail, onLogout }) => (
  <header className="bg-slate-900 text-white sticky top-0 z-50 shadow-lg">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-lg"><ShieldCheck size={24} className="text-white" /></div>
          <span className="font-bold text-xl tracking-tight">AI-Håndboken <span className="text-slate-400 font-normal">| {companyName}</span></span>
        </div>
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#retningslinjer" className="hover:text-blue-400 transition-colors">Retningslinjer</a>
          <a href="#verktoy" className="hover:text-blue-400 transition-colors">Verktøy-sjekk</a>
          <a href="#prompts" className="hover:text-blue-400 transition-colors">Prompt-bibliotek</a>
          <div className="flex items-center gap-3 border-l border-slate-700 pl-6">
            <span className="text-slate-400 text-sm truncate max-w-[160px]">{userEmail}</span>
            <button onClick={onLogout} className="flex items-center gap-1.5 text-slate-400 hover:text-red-400 transition text-sm" title="Logg ut">
              <LogOut size={16} /><span className="hidden lg:inline">Logg ut</span>
            </button>
          </div>
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
          <button onClick={onLogout} className="w-full text-left px-3 py-2 rounded-md hover:bg-slate-700 text-red-400 flex items-center gap-2">
            <LogOut size={16} /> Logg ut
          </button>
        </div>
      </div>
    )}
  </header>
);

const categories = ["Alle", "Ledelse", "Kommunikasjon", "HR", "Analyse", "Koding"];

export default function App() {
  const [session, setSession] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("Alle");
  const [showAllPolicies, setShowAllPolicies] = useState(false);
  const [showAllTools, setShowAllTools] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoadingAuth(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => { await supabase.auth.signOut(); };

  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-center">
          <ShieldCheck size={40} className="mx-auto mb-3 text-blue-400 animate-pulse" />
          <p className="text-slate-400">Laster...</p>
        </div>
      </div>
    );
  }

  if (!session) return <LoginPage />;

  const filteredPrompts = prompts.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.text.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "Alle" || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const visiblePolicies = showAllPolicies ? policies : policies.slice(0, 3);
  const visibleTools = showAllTools ? tools : tools.slice(0, 5);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Header mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} userEmail={session.user.email} onLogout={handleLogout} />

      <div className="bg-gradient-to-r from-blue-900 to-slate-900 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-6 tracking-tight">
            Sikker bruk av AI i <span className="text-blue-400">{companyName}</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-8">
            Din guide til å bruke kunstig intelligens effektivt, trygt og i tråd med selskapets retningslinjer.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#retningslinjer" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-bold transition flex items-center gap-2">Les reglene <ShieldCheck size={18} /></a>
            <a href="#prompts" className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg font-bold transition flex items-center gap-2">Hent prompts <MessageSquare size={18} /></a>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">

        <section id="retningslinjer" className="scroll-mt-24">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-blue-100 text-blue-700 rounded-lg"><BookOpen size={24} /></div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Retningslinjer for Data & Sikkerhet</h2>
              <p className="text-slate-500">Trafikklysmodellen for hva du kan dele.</p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {visiblePolicies.map(policy => <PolicyCard key={policy.id} policy={policy} />)}
          </div>
          {policies.length > 3 && (
            <div className="text-center mt-6">
              <button onClick={() => setShowAllPolicies(!showAllPolicies)} className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition">
                {showAllPolicies ? <><ChevronUp size={18} /> Vis færre</> : <><ChevronDown size={18} /> Vis alle {policies.length} retningslinjer</>}
              </button>
            </div>
          )}
        </section>

        <section id="verktoy" className="scroll-mt-24">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 text-purple-700 rounded-lg"><Search size={24} /></div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Verktøy-sjekk</h2>
                  <p className="text-slate-500 text-sm">Er verktøyet godkjent for bruk?</p>
                </div>
              </div>
            </div>
            <div className="divide-y divide-slate-100">
              {visibleTools.map((tool, index) => <ToolRow key={index} tool={tool} />)}
            </div>
            <div className="p-4 bg-slate-50 flex flex-col sm:flex-row justify-between items-center gap-2">
              {tools.length > 5 && (
                <button onClick={() => setShowAllTools(!showAllTools)} className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium transition">
                  {showAllTools ? <><ChevronUp size={16} /> Vis færre</> : <><ChevronDown size={16} /> Vis alle {tools.length} verktøy</>}
                </button>
              )}
              <p className="text-sm text-slate-500">Finner du ikke verktøyet? <a href="#" className="text-blue-600 hover:underline">Kontakt IT-avdeling</a></p>
            </div>
          </div>
        </section>

        <section id="prompts" className="scroll-mt-24">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg"><MessageSquare size={24} /></div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Prompt Bibliotek</h2>
                <p className="text-slate-500">Testede prompts som gir resultater.</p>
              </div>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="text" placeholder="Søk i prompts..." className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-full md:w-64" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-1.5 rounded-full text-sm font-medium transition border ${activeCategory === cat ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-600 border-slate-200 hover:border-blue-400"}`}>{cat}</button>
            ))}
          </div>
          {filteredPrompts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPrompts.map((prompt, index) => <PromptCard key={index} prompt={prompt} />)}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400">
              <MessageSquare size={40} className="mx-auto mb-3 opacity-40" />
              <p>Ingen prompts funnet for «{searchTerm}»</p>
            </div>
          )}
        </section>

        <section className="bg-blue-600 rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Trenger du hjelp med en spesifikk oppgave?</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">Vi har superbrukere i hver avdeling som kan hjelpe deg med å finjustere prompts eller sette opp workflows.</p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-blue-50 transition shadow-lg">Se liste over superbrukere</button>
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
