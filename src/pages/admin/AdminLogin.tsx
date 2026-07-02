import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Lock, Mail } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sessionChecked, setSessionChecked] = useState(false);
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setIsLogged(Boolean(data.session));
      setSessionChecked(true);
    });
  }, []);

  if (sessionChecked && isLogged) return <Navigate to="/admin" replace />;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);

    if (error) {
      setError('Correo o contraseña incorrectos.');
      return;
    }

    navigate('/admin');
  };

  return (
    <main className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-2xl p-6 shadow-2xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-[#e84c2b]/10 text-[#e84c2b] flex items-center justify-center">
            <Lock size={24} />
          </div>
          <h1 className="text-2xl font-black text-white">Panel administrativo</h1>
          <p className="text-sm text-gray-400 mt-2">Ingresa para administrar productos y stock.</p>
        </div>

        <label className="block text-sm font-semibold text-white mb-2">Correo</label>
        <div className="relative mb-4">
          <Mail size={18} className="absolute left-3 top-3 text-gray-500" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-3 py-3 text-white outline-none focus:border-[#e84c2b]"
            placeholder="admin@cliente.com"
            required
          />
        </div>

        <label className="block text-sm font-semibold text-white mb-2">Contraseña</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white outline-none focus:border-[#e84c2b] mb-4"
          placeholder="••••••••"
          required
        />

        {error && <p className="text-sm text-red-400 mb-4">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#e84c2b] hover:bg-[#d83f20] disabled:opacity-60 text-white font-bold rounded-xl py-3 transition-colors"
        >
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>
    </main>
  );
}
