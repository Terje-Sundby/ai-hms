import React, { useState } from 'react';
import { ShieldCheck, Mail, Lock, Loader } from 'lucide-react';
import { supabase } from './supabaseClient';
import { companyName } from './config';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [mode, setMode] = useState('login'); // 'login' eller 'forgot'

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError('Feil e-post eller passord. Prøv igjen.');
    }
    setLoading(false);
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    });

    if (error) {
      setError('Kunne ikke sende e-post. Sjekk at adressen er riktig.');
    } else {
      setMessage('Vi har sendt deg en lenke for å tilbakestille passordet ditt.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo / Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg">
            <ShieldCheck size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">AI-Håndboken</h1>
          <p className="text-blue-300 mt-1">{companyName}</p>
        </div>

        {/* Kortboks */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">

          {mode === 'login' ? (
            <>
              <h2 className="text-xl font-bold text-slate-900 mb-6">Logg inn</h2>
              <form onSubmit={handleLogin} className="space-y-4">

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">E-post</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="din@epost.no"
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Passord</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                    />
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-300 text-white font-bold py-2.5 rounded-lg transition flex items-center justify-center gap-2"
                >
                  {loading ? <><Loader size={16} className="animate-spin" /> Logger inn...</> : 'Logg inn'}
                </button>

              </form>

              <div className="mt-4 text-center">
                <button
                  onClick={() => { setMode('forgot'); setError(''); }}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Glemt passordet?
                </button>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Tilbakestill passord</h2>
              <p className="text-slate-500 text-sm mb-6">Skriv inn e-postadressen din, så sender vi deg en lenke.</p>

              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">E-post</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="din@epost.no"
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                    />
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                    {error}
                  </div>
                )}
                {message && (
                  <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3">
                    {message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-300 text-white font-bold py-2.5 rounded-lg transition flex items-center justify-center gap-2"
                >
                  {loading ? <><Loader size={16} className="animate-spin" /> Sender...</> : 'Send tilbakestillingslenke'}
                </button>
              </form>

              <div className="mt-4 text-center">
                <button
                  onClick={() => { setMode('login'); setError(''); setMessage(''); }}
                  className="text-sm text-blue-600 hover:underline"
                >
                  ← Tilbake til innlogging
                </button>
              </div>
            </>
          )}
        </div>

        <p className="text-center text-blue-300 text-xs mt-6 opacity-60">
          Utviklet basert på "The AI-Guide Framework" av Terje Sundby
        </p>
      </div>
    </div>
  );
}
