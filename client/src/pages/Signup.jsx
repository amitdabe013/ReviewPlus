import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Signup() {
  const [form, setForm] = useState({ name: '', businessName: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) return setError('Password must be at least 6 characters');
    setLoading(true);

    const { error: err } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { name: form.name, business_name: form.businessName } },
    });

    if (err) {
      setError(err.message);
      setLoading(false);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <Link to="/" className="flex items-center gap-2 mb-8">
        <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>
        <span className="font-semibold text-gray-900">ReviewPlus</span>
      </Link>

      <div className="card w-full max-w-sm p-8">
        <h1 className="text-xl font-bold text-gray-900 mb-1">Create your account</h1>
        <p className="text-sm text-gray-500 mb-6">Start generating reviews in minutes</p>

        {error && (
          <div className="mb-4 px-3 py-2.5 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Full name</label>
            <input className="input" type="text" placeholder="Jane Smith"
              value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Business name</label>
            <input className="input" type="text" placeholder="Acme Coffee Co."
              value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <input className="input" type="email" placeholder="you@example.com"
              value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
            <input className="input" type="password" placeholder="Min. 6 characters"
              value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full py-2.5 mt-2">
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-600 hover:text-brand-700 font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
