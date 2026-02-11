import { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import GoogleSignInButton from '../components/GoogleSignInButton.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function SignIn() {
  const { isAuthenticated, login, loginAsDev, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/upload';

  useEffect(() => {
    if (isAuthenticated) navigate(from, { replace: true });
  }, [isAuthenticated, navigate, from]);

  const handleSuccess = async (credential) => {
    try {
      await login(credential);
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      const msg = err?.message === 'Network Error'
        ? "Couldn't reach the server. Check your connection and try again."
        : err?.response?.data?.detail || 'Sign in failed. Please try again.';
      alert(typeof msg === 'string' ? msg : JSON.stringify(msg));
    }
  };

  const handleError = () => {
    alert('Google sign-in failed. Please try again.');
  };

  const handleDevLogin = () => {
    loginAsDev();
    navigate(from, { replace: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="animate-spin w-10 h-10 border-2 border-accent-lime border-t-transparent" />
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  const hasGoogle = !!import.meta.env.VITE_GOOGLE_CLIENT_ID;

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="font-display text-3xl font-bold mb-3 tracking-tight">CLIPIFY</h1>
          <p className="text-white/60">Sign in to use Clipify</p>
        </div>
        <div className="border-2 border-white/20 p-8 space-y-4">
          {hasGoogle ? (
            <GoogleSignInButton onSuccess={handleSuccess} onError={handleError} />
          ) : (
            <button
              type="button"
              onClick={handleDevLogin}
              className="w-full py-4 bg-accent-lime text-black font-bold hover:bg-accent-lime-dim rounded-lg transition uppercase tracking-wide"
            >
              Enter
            </button>
          )}
        </div>
        <p className="text-center text-white/50 text-sm mt-8">
          <Link to="/" className="text-white/80 hover:text-white transition">
            Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
