import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const ease = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.13 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease } },
};

function StarRating({ filled = 5 }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} className={`w-4 h-4 ${i <= filled ? 'text-amber-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function PulsingCTA({ children }) {
  return (
    <div className="relative inline-block">
      <motion.div
        className="absolute inset-0 rounded-lg bg-brand-500 pointer-events-none"
        animate={{ scale: [1, 1.35], opacity: [0.45, 0] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 1, ease: 'easeOut' }}
      />
      {children}
    </div>
  );
}

const flowSteps = [
  { icon: '📱', label: 'QR Scan', sub: 'Customer scans', bg: 'bg-violet-50 border-violet-200', text: 'text-violet-700' },
  { icon: '⭐', label: 'Rate Visit', sub: '5-star rating', bg: 'bg-amber-50 border-amber-200', text: 'text-amber-700' },
  { icon: '✨', label: 'AI Review', sub: 'Auto-written', bg: 'bg-blue-50 border-blue-200', text: 'text-blue-700' },
  { icon: '📈', label: 'Google Boost', sub: 'Rank higher', bg: 'bg-green-50 border-green-200', text: 'text-green-700' },
];

const features = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: 'AI-Powered Reviews',
    desc: 'Gemini AI converts casual feedback into polished, authentic Google reviews in seconds.',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8H3m2 8H3m18-8h-1M4 16H3" />
      </svg>
    ),
    title: 'QR Code Campaigns',
    desc: 'Generate QR codes customers scan to leave reviews — works on receipts, tables, packaging.',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: 'Smart Routing',
    desc: 'Happy customers go straight to Google. Unhappy ones stay private so you can follow up.',
  },
];

const testimonials = [
  { name: 'Sarah K.', business: 'The Olive Garden Cafe', text: 'We went from 42 to 180 Google reviews in 6 weeks. ReviewPlus changed our business.', rating: 5 },
  { name: 'Mark T.', business: 'Downtown Auto Repair', text: 'The QR codes on our invoices work incredibly well. Customers love the simple experience.', rating: 5 },
  { name: 'Priya M.', business: 'Luxe Hair Studio', text: "The AI writes better reviews than most customers would anyway. It's genuinely impressive.", rating: 5 },
];

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white">

      {/* ── Nav ── */}
      <nav className="border-b border-gray-100 sticky top-0 bg-white/90 backdrop-blur-sm z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease }}
          >
            <div className="w-7 h-7 bg-brand-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <span className="font-semibold text-gray-900">ReviewPlus</span>
          </motion.div>

          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: 14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease }}
          >
            {user ? (
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Link to="/dashboard" className="btn-primary text-sm py-2 px-4">
                  Go to Dashboard
                </Link>
              </motion.div>
            ) : (
              <>
                <Link to="/login" className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium">
                  Sign in
                </Link>
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <Link to="/signup" className="btn-primary text-sm py-2 px-4">
                    Get started
                  </Link>
                </motion.div>
              </>
            )}
          </motion.div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="pt-20 pb-24 px-4 text-center overflow-hidden">

        {/* Headline */}
        <motion.h1
          className="text-5xl sm:text-6xl font-bold text-gray-900 leading-tight tracking-tight max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.1 }}
        >
          Get More{' '}
          <span className="text-brand-600">5-Star Google</span>{' '}
          Reviews Automatically
        </motion.h1>

        {/* Subtext */}
        <motion.p
          className="mt-5 text-xl text-gray-500 max-w-xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.26 }}
        >
          Turn happy customers into glowing reviews automatically. AI converts casual feedback into polished Google reviews — and routes unhappy customers away.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          className="mt-8 flex items-center justify-center gap-3"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.4 }}
        >
          <PulsingCTA>
            <motion.div
              whileHover={{ scale: 1.05, boxShadow: '0 0 28px rgba(59,130,246,0.5)' }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 18 }}
              className="relative"
            >
              <Link to={user ? '/dashboard' : '/signup'} className="btn-primary px-6 py-3 text-base shadow-sm block">
                {user ? 'Go to Dashboard →' : 'Generate More Reviews →'}
              </Link>
            </motion.div>
          </PulsingCTA>

          {!user && (
            <motion.div
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 18 }}
            >
              <Link to="/login" className="btn-secondary px-6 py-3 text-base">
                Sign in
              </Link>
            </motion.div>
          )}
        </motion.div>

        <motion.p
          className="mt-4 text-sm text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          No credit card required · Free to start
        </motion.p>

        {/* ── Flow Animation ── */}
        <motion.div
          className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-0"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          {flowSteps.map((step, i) => (
            <div key={step.label} className="flex items-center gap-3 sm:gap-0">
              <motion.div
                variants={scaleIn}
                whileHover={{ y: -6, scale: 1.06 }}
                transition={{ type: 'spring', stiffness: 320, damping: 20 }}
                className={`flex flex-col items-center px-5 py-4 rounded-2xl border ${step.bg} ${step.text} shadow-sm w-32 cursor-default`}
              >
                <span className="text-2xl mb-1.5">{step.icon}</span>
                <span className="text-xs font-semibold">{step.label}</span>
                <span className="text-[10px] opacity-60 mt-0.5">{step.sub}</span>
              </motion.div>

              {i < flowSteps.length - 1 && (
                <motion.span
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.18 * i + 0.5, duration: 0.4 }}
                  className="text-gray-300 text-lg font-light mx-2 hidden sm:block select-none"
                >
                  →
                </motion.span>
              )}
            </div>
          ))}
        </motion.div>

        {/* Preview review card */}
        <motion.div
          className="mt-14 max-w-md mx-auto card p-5 text-left shadow-lg"
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.65 }}
          whileHover={{ y: -5, boxShadow: '0 24px 48px rgba(0,0,0,0.10)' }}
        >
          <div className="flex items-start gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-semibold text-sm flex-shrink-0">J</div>
            <div>
              <p className="text-sm font-medium text-gray-900">John D.</p>
              <StarRating filled={5} />
            </div>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            "Absolutely fantastic experience from start to finish. The staff was attentive and professional, and the quality exceeded my expectations. Will definitely be coming back and highly recommend to anyone looking for a top-notch service."
          </p>
          <div className="mt-3 flex items-center gap-1.5">
            <div className="w-4 h-4 bg-brand-600 rounded-sm flex items-center justify-center">
              <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-xs text-gray-400">AI-generated from 3 sentences of feedback</span>
          </div>
        </motion.div>
      </section>

      {/* ── Value Proposition ── */}
      <section className="py-24 bg-gradient-to-br from-brand-700 via-brand-600 to-brand-800 px-4">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
        >
          <motion.p variants={fadeUp} className="text-blue-200 text-xs font-semibold uppercase tracking-widest mb-4">
            Why it matters
          </motion.p>

          <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-bold text-white leading-tight">
            Rank Higher on Google.{' '}
            <span className="text-amber-300">Get More Customers.</span>
          </motion.h2>

          <motion.p variants={fadeUp} className="mt-6 text-lg text-blue-100 leading-relaxed max-w-2xl mx-auto">
            More{' '}
            <span className="text-amber-300 font-semibold">5-star reviews</span>
            {' '}= better{' '}
            <span className="text-amber-300 font-semibold">Google ranking</span>
            {' '}= more{' '}
            <span className="text-amber-300 font-semibold">walk-ins & orders</span>
          </motion.p>

          <motion.div
            className="mt-14 grid grid-cols-3 gap-6 sm:gap-10"
            variants={stagger}
          >
            {[
              { value: '4.8★', label: 'Average rating boost' },
              { value: '4×', label: 'More reviews in 60 days' },
              { value: '3 min', label: 'Setup time' },
            ].map((stat) => (
              <motion.div key={stat.label} variants={fadeUp} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-blue-200 mt-1.5">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ── Features ── */}
      <section className="py-20 bg-gray-50 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
          >
            <motion.h2 variants={fadeUp} className="text-3xl font-bold text-gray-900">
              Everything you need to grow reviews
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-3 text-gray-500">
              Set up in minutes. Works for any local business.
            </motion.p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
          >
            {features.map((f) => (
              <motion.div
                key={f.title}
                variants={fadeUp}
                whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(0,0,0,0.09)' }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="card p-6 cursor-default"
              >
                <motion.div
                  className="w-10 h-10 bg-brand-50 text-brand-600 rounded-lg flex items-center justify-center mb-4"
                  whileHover={{ rotate: 10, scale: 1.18 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 14 }}
                >
                  {f.icon}
                </motion.div>
                <h3 className="font-semibold text-gray-900 mb-1.5">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-gray-900">How it works</h2>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-4 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
          >
            {[
              { step: '01', title: 'Create campaign', desc: 'Add your business name and Google review link.' },
              { step: '02', title: 'Share QR code', desc: 'Print or display the QR code anywhere customers visit.' },
              { step: '03', title: 'Customer scans', desc: 'They answer 2 quick questions about their experience.' },
              { step: '04', title: 'AI writes review', desc: 'Happy? They post to Google. Not happy? You get private feedback.' },
            ].map((s) => (
              <motion.div
                key={s.step}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="text-center cursor-default"
              >
                <div className="text-3xl font-bold text-brand-100 mb-2">{s.step}</div>
                <h4 className="font-semibold text-gray-900 mb-1">{s.title}</h4>
                <p className="text-sm text-gray-500">{s.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-20 bg-gray-50 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            className="text-3xl font-bold text-gray-900 text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Loved by local businesses
          </motion.h2>

          <motion.div
            className="grid md:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
          >
            {testimonials.map((t) => (
              <motion.div
                key={t.name}
                variants={fadeUp}
                whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(0,0,0,0.09)' }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="card p-6 cursor-default"
              >
                <StarRating filled={t.rating} />
                <p className="mt-3 text-sm text-gray-600 leading-relaxed">"{t.text}"</p>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.business}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-20 px-4">
        <motion.div
          className="max-w-2xl mx-auto text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
        >
          <motion.h2 variants={fadeUp} className="text-3xl font-bold text-gray-900">
            Start generating reviews today
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-3 text-gray-500">
            Join thousands of businesses boosting their Google rating.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-6 inline-block">
            <PulsingCTA>
              <motion.div
                whileHover={{ scale: 1.05, boxShadow: '0 0 28px rgba(59,130,246,0.5)' }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                className="relative"
              >
                <Link to="/signup" className="btn-primary px-8 py-3 text-base shadow-sm block">
                  Generate More Reviews →
                </Link>
              </motion.div>
            </PulsingCTA>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-100 py-8 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="text-sm text-gray-400">© 2025 ReviewPlus</span>
          <div className="flex gap-4 text-sm text-gray-400">
            <a href="#" className="hover:text-gray-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-gray-600 transition-colors">Terms</a>
          </div>
        </div>
      </footer>

      {/* ── WhatsApp CTA ── */}
      <motion.a
        href="https://wa.me/918552948957?text=I%20would%20like%20to%20try%20ReviewPlus"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-[#25D366] text-white text-sm font-medium px-4 py-3 rounded-full shadow-lg shadow-green-200"
        initial={{ opacity: 0, scale: 0.7, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.5, ease }}
        whileHover={{ scale: 1.06, boxShadow: '0 8px 30px rgba(37,211,102,0.45)' }}
        whileTap={{ scale: 0.96 }}
      >
        <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        Chat on WhatsApp
      </motion.a>

    </div>
  );
}
