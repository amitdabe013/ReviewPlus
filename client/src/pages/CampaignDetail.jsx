import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';

function StarDisplay({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} className={`w-3.5 h-3.5 ${i <= rating ? 'text-amber-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function CampaignDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('overview');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    Promise.all([
      supabase.from('campaigns').select('*').eq('id', id).single(),
      supabase.from('reviews').select('*').eq('campaign_id', id).order('created_at', { ascending: false }).limit(50),
    ]).then(([{ data: c, error }, { data: r }]) => {
      if (error || !c) return navigate('/dashboard');
      setCampaign(c);
      setReviews(r || []);
    }).finally(() => setLoading(false));
  }, [id]);

  const copyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/review/${id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQR = () => {
    const link = document.createElement('a');
    link.href = campaign.qr_code_data_url;
    link.download = `${campaign.name}-qr.png`;
    link.click();
  };

  const toggleActive = async () => {
    const { data } = await supabase
      .from('campaigns')
      .update({ active: !campaign.active })
      .eq('id', id)
      .select()
      .single();
    if (data) setCampaign(data);
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50"><Navbar />
      <div className="flex justify-center py-20">
        <div className="w-6 h-6 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  );

  const reviewUrl = `${window.location.origin}/review/${id}`;
  const avgRating = campaign.total_reviews > 0
    ? (campaign.total_rating / campaign.total_reviews).toFixed(1)
    : '—';

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/dashboard" className="hover:text-gray-700">Dashboard</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">{campaign.name}</span>
        </div>

        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <h1 className="text-2xl font-bold text-gray-900">{campaign.name}</h1>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${campaign.active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {campaign.active ? 'Active' : 'Paused'}
              </span>
            </div>
            <p className="text-gray-500">{campaign.business_name}</p>
          </div>
          <button onClick={toggleActive} className="btn-secondary text-sm flex-shrink-0">
            {campaign.active ? 'Pause' : 'Activate'}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-gray-200 mb-6">
          {['overview', 'qr-code', 'reviews'].map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
                tab === t ? 'border-brand-600 text-brand-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {t.replace('-', ' ')}
            </button>
          ))}
        </div>

        {/* Overview */}
        {tab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Total reviews', value: campaign.total_reviews, color: 'text-gray-900' },
                { label: 'Sent to Google', value: campaign.positive_redirects, color: 'text-green-600' },
                { label: 'Private feedback', value: campaign.negative_feedbacks, color: 'text-gray-900' },
                { label: 'Avg rating', value: avgRating, color: 'text-brand-600' },
              ].map((s) => (
                <div key={s.label} className="card p-5">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">{s.label}</p>
                  <p className={`text-3xl font-bold mt-1 ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>

            <div className="card p-5">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Review link</h3>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-xs bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-gray-600 truncate">{reviewUrl}</code>
                <button onClick={copyLink} className="btn-secondary text-sm flex-shrink-0">{copied ? 'Copied!' : 'Copy'}</button>
                <a href={reviewUrl} target="_blank" rel="noreferrer" className="btn-secondary text-sm flex-shrink-0">Open</a>
              </div>
            </div>

            {campaign.total_reviews > 0 && (
              <div className="card p-5">
                <h3 className="text-sm font-medium text-gray-700 mb-4">Conversion</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Sent to Google', value: campaign.positive_redirects, color: 'bg-green-500', textColor: 'text-green-600' },
                    { label: 'Private feedback', value: campaign.negative_feedbacks, color: 'bg-gray-400', textColor: 'text-gray-500' },
                  ].map((s) => (
                    <div key={s.label}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">{s.label}</span>
                        <span className={`font-medium ${s.textColor}`}>
                          {Math.round((s.value / campaign.total_reviews) * 100)}%
                        </span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full ${s.color} rounded-full`} style={{ width: `${(s.value / campaign.total_reviews) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* QR Code */}
        {tab === 'qr-code' && (
          <div className="card p-8 flex flex-col items-center text-center max-w-sm mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Your QR Code</h3>
            <p className="text-sm text-gray-500 mb-6">Print this on receipts, table cards, or displays.</p>
            {campaign.qr_code_data_url ? (
              <>
                <img src={campaign.qr_code_data_url} alt="QR Code" className="w-56 h-56 rounded-xl border border-gray-100 shadow-sm" />
                <p className="text-xs text-gray-400 mt-4 mb-5">Scan to leave a review for {campaign.business_name}</p>
                <div className="flex gap-3 w-full">
                  <button onClick={downloadQR} className="btn-primary flex-1">
                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download PNG
                  </button>
                  <button onClick={copyLink} className="btn-secondary flex-1">{copied ? 'Copied!' : 'Copy link'}</button>
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-400">QR code not available</p>
            )}
          </div>
        )}

        {/* Reviews */}
        {tab === 'reviews' && (
          <div>
            {reviews.length === 0 ? (
              <div className="card p-10 text-center">
                <p className="text-gray-500 text-sm">No reviews yet. Share your QR code to get started.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {reviews.map((r) => (
                  <div key={r.id} className="card p-5">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <StarDisplay rating={r.rating} />
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${r.redirected_to_google ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-600'}`}>
                          {r.redirected_to_google ? 'Sent to Google' : 'Private feedback'}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(r.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    {r.generated_review && (
                      <p className="text-sm text-gray-700 mb-3 italic">"{r.generated_review}"</p>
                    )}
                    {(r.answers?.experience || r.answers?.liked || r.answers?.improvements) && (
                      <div className="text-xs text-gray-400 space-y-1 border-t border-gray-50 pt-3">
                        {r.answers?.experience && <p><span className="font-medium text-gray-500">Experience:</span> {r.answers.experience}</p>}
                        {r.answers?.liked && <p><span className="font-medium text-gray-500">Liked:</span> {r.answers.liked}</p>}
                        {r.answers?.improvements && <p><span className="font-medium text-gray-500">Suggestions:</span> {r.answers.improvements}</p>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
