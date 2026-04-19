import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import QRCode from 'qrcode';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

export default function CampaignCreate() {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: '', businessName: '', googleReviewLink: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // 1. Insert campaign
      const { data: campaign, error: insertErr } = await supabase
        .from('campaigns')
        .insert({
          user_id: user.id,
          name: form.name,
          business_name: form.businessName,
          google_review_link: form.googleReviewLink,
        })
        .select()
        .single();

      if (insertErr) throw new Error(insertErr.message);

      // 2. Generate QR code with campaign ID
      const reviewUrl = `${window.location.origin}/review/${campaign.id}`;
      const qrCodeDataUrl = await QRCode.toDataURL(reviewUrl, {
        width: 300,
        margin: 2,
        color: { dark: '#0f172a', light: '#ffffff' },
      });

      // 3. Save QR code back to campaign
      await supabase
        .from('campaigns')
        .update({ qr_code_data_url: qrCodeDataUrl })
        .eq('id', campaign.id);

      navigate(`/campaigns/${campaign.id}`);
    } catch (err) {
      setError(err.message || 'Failed to create campaign');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/dashboard" className="hover:text-gray-700">Dashboard</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">New Campaign</span>
        </div>

        <div className="card p-8">
          <h1 className="text-xl font-bold text-gray-900 mb-1">Create campaign</h1>
          <p className="text-sm text-gray-500 mb-6">Set up your review campaign. We'll generate a QR code automatically.</p>

          {error && (
            <div className="mb-5 px-3 py-2.5 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Campaign name</label>
              <input className="input" type="text" placeholder="e.g. Summer 2025 / Table Cards"
                value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              <p className="text-xs text-gray-400 mt-1">Internal name to identify this campaign.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Business name</label>
              <input className="input" type="text" placeholder="e.g. Acme Coffee Co."
                value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} required />
              <p className="text-xs text-gray-400 mt-1">Shown to customers during the review flow.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Google review link</label>
              <input className="input" type="url" placeholder="https://g.page/r/..."
                value={form.googleReviewLink} onChange={(e) => setForm({ ...form, googleReviewLink: e.target.value })} required />
              <p className="text-xs text-gray-400 mt-1">Find this in Google Maps → Your Business → Get more reviews.</p>
            </div>

            <div className="bg-brand-50 border border-brand-100 rounded-lg p-4">
              <div className="flex gap-3">
                <svg className="w-5 h-5 text-brand-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-sm text-brand-700">
                  <p className="font-medium mb-0.5">What happens next?</p>
                  <ul className="text-brand-600 space-y-0.5 text-xs">
                    <li>• A QR code will be generated pointing to your review flow</li>
                    <li>• Customers rating 4+ stars will be redirected to your Google link</li>
                    <li>• Negative feedback stays private in your dashboard</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Link to="/dashboard" className="btn-secondary flex-1">Cancel</Link>
              <button type="submit" disabled={loading} className="btn-primary flex-1">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating…
                  </span>
                ) : 'Create & generate QR code'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
