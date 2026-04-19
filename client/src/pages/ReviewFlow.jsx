import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { generateReviews, submitReview, getPublicCampaign } from '../api';

const RATING_LABELS = ['', 'Terrible', 'Poor', 'Okay', 'Good', 'Excellent'];
const RATING_COLORS = ['', 'text-red-500', 'text-orange-400', 'text-yellow-400', 'text-lime-500', 'text-green-500'];

const StarIcon = ({ filled, glowing }) => (
  <svg className={`w-12 h-12 transition-all duration-150 ${filled ? `text-amber-400 ${glowing ? 'drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]' : ''}` : 'text-gray-200'}`}
    fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

function StarPicker({ value, onChange, disabled }) {
  const [hover, setHover] = useState(0);
  const active = hover || value;
  return (
    <div className="flex gap-2 justify-center">
      {[1, 2, 3, 4, 5].map((i) => (
        <button key={i} type="button" disabled={disabled} onClick={() => onChange(i)}
          onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(0)}
          className="focus:outline-none disabled:cursor-default hover:scale-110 transition-transform">
          <StarIcon filled={i <= active} glowing={i <= active} />
        </button>
      ))}
    </div>
  );
}

function Toast({ message, visible }) {
  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'}`}>
      <div className="flex items-center gap-2.5 bg-gray-900 text-white text-sm px-5 py-3 rounded-2xl shadow-xl">
        <svg className="w-4 h-4 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
        {message}
      </div>
    </div>
  );
}

export default function ReviewFlow() {
  const { campaignId } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [loadError, setLoadError] = useState('');
  const [step, setStep] = useState('rating');
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [redirectUrl, setRedirectUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState({ visible: false, message: '' });
  const toastTimer = useRef(null);

  useEffect(() => {
    getPublicCampaign(campaignId)
      .then(setCampaign)
      .catch(() => setLoadError('This review link is not valid or has been deactivated.'));
  }, [campaignId]);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const showToast = (message) => {
    setToast({ visible: true, message });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast({ visible: false, message: '' }), 3000);
  };

  const handleRating = async (val) => {
    if (loading) return;
    setRating(val);
    setError('');

    if (val <= 3) { setStep('feedback'); return; }

    setStep('generating');
    setLoading(true);
    try {
      const [aiRes, reviewRes] = await Promise.all([
        generateReviews(campaign.business_name, val),
        submitReview(campaignId, val, null),
      ]);
      setReviews(aiRes.reviews);
      setRedirectUrl(reviewRes.redirect || '');
      setStep('select');
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
      setStep('rating');
      setRating(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectReview = async (text) => {
    try { await navigator.clipboard.writeText(text); } catch {}
    showToast('Review copied — paste it on Google!');
    setTimeout(() => {
      window.open(redirectUrl || 'https://search.google.com/local/writereview', '_blank');
    }, 1000);
  };

  if (loadError) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <p className="text-gray-600 text-sm">{loadError}</p>
      </div>
    </div>
  );

  if (!campaign) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-7 h-7 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <>
      <Toast visible={toast.visible} message={toast.message} />
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-gray-100 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="w-14 h-14 bg-brand-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-200 hover:opacity-90 transition-opacity">
              <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </Link>
            <h1 className="text-xl font-semibold text-gray-900">{campaign.business_name}</h1>
            <p className="text-sm text-gray-400 mt-1">How was your experience?</p>
          </div>

          {(step === 'rating' || step === 'generating') && (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 px-8 py-10 text-center">
              <p className="text-base font-medium text-gray-800 mb-7">Rate your visit</p>
              <StarPicker value={rating} onChange={handleRating} disabled={loading} />
              {rating > 0 && !loading && (
                <p className={`mt-4 text-sm font-semibold tracking-wide ${RATING_COLORS[rating]}`}>{RATING_LABELS[rating]}</p>
              )}
              {loading && (
                <div className="mt-7 flex flex-col items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-brand-500 rounded-full animate-bounce [animation-delay:0ms]" />
                    <span className="w-2 h-2 bg-brand-500 rounded-full animate-bounce [animation-delay:120ms]" />
                    <span className="w-2 h-2 bg-brand-500 rounded-full animate-bounce [animation-delay:240ms]" />
                  </div>
                  <p className="text-xs text-gray-400">Generating your review options…</p>
                </div>
              )}
              {error && <p className="mt-4 text-xs text-red-500">{error}</p>}
            </div>
          )}

          {step === 'select' && (
            <div>
              <div className="text-center mb-6">
                <div className="flex justify-center gap-1 mb-3">
                  {[1,2,3,4,5].map((i) => <StarIcon key={i} filled={i <= rating} glowing={false} />)}
                </div>
                <p className="text-base font-semibold text-gray-900">Choose a review to post</p>
                <p className="text-sm text-gray-400 mt-1">Tap one — it'll be copied to your clipboard</p>
              </div>
              <div className="space-y-3">
                {reviews.map((text, i) => (
                  <button key={i} type="button" onClick={() => handleSelectReview(text)}
                    className="w-full text-left px-5 py-4 rounded-2xl bg-white border border-gray-100 hover:border-brand-400 hover:shadow-md transition-all duration-200 group">
                    <p className="text-sm text-gray-700 leading-relaxed group-hover:text-gray-900">"{text}"</p>
                    <span className="inline-flex items-center gap-1.5 mt-3 text-xs font-medium text-brand-600 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy &amp; open Google Reviews
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 'feedback' && (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 px-8 py-10 text-center">
              <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-5">
                <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div className="flex justify-center gap-1 mb-5">
                {[1,2,3,4,5].map((i) => <StarIcon key={i} filled={i <= rating} glowing={false} />)}
              </div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">We value your feedback</h2>
              <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">
                Thank you for sharing. We take all feedback seriously and will use it to improve your experience.
              </p>
            </div>
          )}

          <p className="text-center text-xs text-gray-300 mt-8">Powered by ReviewPlus</p>
        </div>
      </div>
    </>
  );
}
