import { Link } from 'react-router-dom';
import Header from '../components/Header.jsx';

export default function Pricing() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <div className="max-w-4xl mx-auto px-6 py-24">
        <h1 className="font-display text-5xl sm:text-6xl font-extrabold mb-4">Pricing</h1>
        <p className="text-white/70 text-lg mb-16">
          Simple, transparent pricing for creators and businesses.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="border border-white/20 rounded-xl p-8 hover:border-accent-lime/50 hover:scale-[1.02] transition-all duration-300">
            <h2 className="font-display text-2xl font-bold text-accent-lime mb-4">Starter</h2>
            <p className="text-4xl font-bold mb-2">Free</p>
            <p className="text-white/60 text-sm mb-6">Get started with limited credits</p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2">
                <span className="text-accent-lime">✓</span>
                <span>10 free clip generations</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-accent-lime">✓</span>
                <span>B-roll + captions</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-accent-lime">✓</span>
                <span>All aspect ratios</span>
              </li>
            </ul>
            <Link
              to="/upload"
              className="block w-full py-3 text-center bg-white/10 hover:bg-accent-lime hover:text-black font-semibold rounded-lg transition uppercase text-sm"
            >
              Get started
            </Link>
          </div>

          <div className="border-2 border-accent-lime rounded-xl p-8 relative hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(207,255,0,0.15)] transition-all duration-300">
            <div className="absolute -top-3 left-6 px-3 py-1 bg-accent-lime text-black text-xs font-bold uppercase rounded">
              Popular
            </div>
            <h2 className="font-display text-2xl font-bold text-accent-lime mb-4">Pro</h2>
            <p className="text-4xl font-bold mb-2">Coming soon</p>
            <p className="text-white/60 text-sm mb-6">Unlimited clips for serious creators</p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2">
                <span className="text-accent-lime">✓</span>
                <span>Unlimited generations</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-accent-lime">✓</span>
                <span>Priority processing</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-accent-lime">✓</span>
                <span>Commercial license</span>
              </li>
            </ul>
            <button
              type="button"
              disabled
              className="block w-full py-3 text-center bg-white/10 text-white/50 font-semibold rounded-lg uppercase text-sm cursor-not-allowed"
            >
              Join waitlist
            </button>
          </div>
        </div>

        <p className="text-white/50 text-sm mt-12 text-center">
          Questions? <Link to="/" className="text-accent-lime hover:underline">Contact us</Link>
        </p>
      </div>
    </div>
  );
}
