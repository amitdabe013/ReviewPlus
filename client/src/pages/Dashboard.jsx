import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

function StatCard({ label, value, color = 'brand' }) {
  return (
    <div className="card p-5">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
      <p className={`text-3xl font-bold mt-1 text-${color}-600`}>{value}</p>
    </div>
  );
}

function CampaignCard({ campaign, onDelete }) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async (e) => {
    e.preventDefault();
    if (!confirm('Delete this campaign?')) return;
    setDeleting(true);
    const { error } = await supabase.from('campaigns').delete().eq('id', campaign.id);
    if (!error) onDelete(campaign.id);
    else setDeleting(false);
  };

  const avgRating = campaign.total_reviews > 0
    ? (campaign.total_rating / campaign.total_reviews).toFixed(1)
    : '—';

  const reviewUrl = `${window.location.origin}/review/${campaign.id}`;

  return (
    <div className="card p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{campaign.name}</h3>
          <p className="text-sm text-gray-500 truncate">{campaign.business_name}</p>
        </div>
        <span className={`flex-shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${campaign.active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
          {campaign.active ? 'Active' : 'Paused'}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="text-center">
          <p className="text-xl font-bold text-gray-900">{campaign.total_reviews}</p>
          <p className="text-xs text-gray-400">Reviews</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-green-600">{campaign.positive_redirects}</p>
          <p className="text-xs text-gray-400">To Google</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-gray-900">{avgRating}</p>
          <p className="text-xs text-gray-400">Avg rating</p>
        </div>
      </div>

      <div className="flex gap-2 pt-1 border-t border-gray-100">
        <Link to={`/campaigns/${campaign.id}`} className="btn-secondary flex-1 text-xs py-2">
          View details
        </Link>
        <a href={reviewUrl} target="_blank" rel="noreferrer" className="btn-secondary text-xs py-2 px-3" title="Preview review flow">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
        <button onClick={handleDelete} disabled={deleting}
          className="text-xs py-2 px-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('campaigns')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => setCampaigns(data || []))
      .finally(() => setLoading(false));
  }, [user]);

  const totalReviews = campaigns.reduce((s, c) => s + c.total_reviews, 0);
  const totalToGoogle = campaigns.reduce((s, c) => s + c.positive_redirects, 0);
  const totalNeg = campaigns.reduce((s, c) => s + c.negative_feedbacks, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500 mt-0.5">Manage your review campaigns</p>
          </div>
          <Link to="/campaigns/new" className="btn-primary">
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New campaign
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total campaigns" value={campaigns.length} />
          <StatCard label="Total reviews" value={totalReviews} />
          <StatCard label="Sent to Google" value={totalToGoogle} color="green" />
          <StatCard label="Private feedback" value={totalNeg} color="gray" />
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-6 h-6 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : campaigns.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">No campaigns yet</h3>
            <p className="text-sm text-gray-500 mb-5">Create your first campaign to start generating reviews.</p>
            <Link to="/campaigns/new" className="btn-primary">Create campaign</Link>
          </div>
        ) : (
          <div>
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
              Campaigns ({campaigns.length})
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {campaigns.map((c) => (
                <CampaignCard key={c.id} campaign={c} onDelete={(id) => setCampaigns((p) => p.filter((x) => x.id !== id))} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
