import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { cloneElement } from 'react';

function NavDropdown({ label, children }) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);
  const leaveTimerRef = useRef(null);

  const clearLeaveTimer = () => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
  };

  const handleMouseLeave = () => {
    clearLeaveTimer();
    leaveTimerRef.current = setTimeout(() => setOpen(false), 150);
  };

  const handleMouseEnter = () => {
    clearLeaveTimer();
    setOpen(true);
  };

  useEffect(() => {
    if (!open || !triggerRef.current) return;

    const updatePosition = () => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        setPosition({ top: rect.bottom + 4, left: rect.left });
      }
    };

    updatePosition();
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [open]);

  useEffect(() => {
    return () => clearLeaveTimer();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (triggerRef.current && !triggerRef.current.contains(e.target) &&
          !e.target.closest('[data-dropdown-menu]')) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => document.removeEventListener('click', handleClickOutside);
  }, [open]);

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(!open)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="flex items-center gap-1 text-white/90 hover:text-white text-sm font-medium tracking-wide uppercase transition"
      >
        {label}
        <svg
          className={`w-4 h-4 text-white/70 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open &&
        createPortal(
          <div
            data-dropdown-menu
            className="fixed py-2 w-48 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-2xl z-[9999] animate-dropdown-in"
            style={{ top: position.top, left: position.left }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {Array.isArray(children)
              ? children.map((child) =>
                  cloneElement(child, {
                    ...child.props,
                    onClick: (e) => {
                      setOpen(false);
                      child.props.onClick?.(e);
                    },
                  })
                )
              : cloneElement(children, {
                  ...children.props,
                  onClick: (e) => {
                    setOpen(false);
                    children.props.onClick?.(e);
                  },
                })}
          </div>,
          document.body
        )}
    </div>
  );
}

function DropdownLink({ to, children }) {
  return (
    <Link
      to={to}
      className="block px-4 py-2.5 text-white/90 hover:bg-accent-lime/20 hover:text-accent-lime text-sm transition"
    >
      {children}
    </Link>
  );
}

const HAS_GOOGLE = !!import.meta.env.VITE_GOOGLE_CLIENT_ID;

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, loginAsDev, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToCreate = (e) => {
    if (location.pathname === '/') {
      e?.preventDefault();
      document.getElementById('create')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleGetStarted = () => {
    if (HAS_GOOGLE) {
      navigate('/signin');
    } else {
      loginAsDev();
      navigate('/upload');
    }
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const navItems = (
    <>
      <Link to="/" className="text-white/90 hover:text-white text-sm font-medium tracking-wide uppercase" onClick={closeMobileMenu}>
        Home
      </Link>
        <NavDropdown label="AI Video">
        <DropdownLink to="/upload">Text to Video</DropdownLink>
        <DropdownLink to="/upload">Image to Video</DropdownLink>
        <DropdownLink to="/upload">AI Video Effects</DropdownLink>
        <DropdownLink to="/upload">AI Clip Generator</DropdownLink>
      </NavDropdown>
      <NavDropdown label="AI Image">
        <DropdownLink to="/upload">Image Generation</DropdownLink>
        <DropdownLink to="/upload">Image to Video</DropdownLink>
      </NavDropdown>
      <Link to="/upload" className="text-white/90 hover:text-white text-sm font-medium tracking-wide uppercase" onClick={closeMobileMenu}>
        Generate History
      </Link>
      <Link to="/pricing" className="text-white/90 hover:text-white text-sm font-medium tracking-wide uppercase" onClick={closeMobileMenu}>
        Pricing
      </Link>
    </>
  );

  return (
    <header className="bg-[#1a1a1a] border-b border-white/10 overflow-visible">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="font-display font-bold text-lg tracking-tight text-white hover:text-accent-lime transition">
          CLIPIFY.
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          {navItems}
        </nav>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-white/90 hover:text-white rounded-lg hover:bg-white/10 transition"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link
                to="/upload"
                onClick={scrollToCreate}
                className="px-5 py-2.5 bg-accent-lime text-black font-semibold hover:bg-accent-lime-dim rounded-lg transition tracking-wide uppercase text-sm"
              >
                Upload video
              </Link>
              <button
                type="button"
                onClick={() => logout()}
                className="text-white/70 hover:text-white text-sm font-medium uppercase"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={handleGetStarted}
              className="px-5 py-2.5 bg-accent-lime text-black font-semibold hover:bg-accent-lime-dim rounded-lg transition tracking-wide uppercase text-sm"
              type="button"
            >
              {HAS_GOOGLE ? 'Login' : 'Enter'}
            </button>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 py-4 px-6 animate-slide-down">
          <div className="flex flex-col gap-4">
            <Link to="/" className="text-white/90 py-2 uppercase text-sm" onClick={closeMobileMenu}>Home</Link>
            <div>
              <p className="text-white/50 text-xs uppercase tracking-wider mb-2">AI Video</p>
              <div className="pl-4 space-y-1">
                <Link to="/upload" className="block py-2 text-white/80 hover:text-accent-lime text-sm" onClick={closeMobileMenu}>Text to Video</Link>
                <Link to="/upload" className="block py-2 text-white/80 hover:text-accent-lime text-sm" onClick={closeMobileMenu}>Image to Video</Link>
                <Link to="/upload" className="block py-2 text-white/80 hover:text-accent-lime text-sm" onClick={closeMobileMenu}>AI Video Effects</Link>
                <Link to="/upload" className="block py-2 text-white/80 hover:text-accent-lime text-sm" onClick={closeMobileMenu}>AI Clip Generator</Link>
              </div>
            </div>
            <div>
              <p className="text-white/50 text-xs uppercase tracking-wider mb-2">AI Image</p>
              <div className="pl-4 space-y-1">
                <Link to="/upload" className="block py-2 text-white/80 hover:text-accent-lime text-sm" onClick={closeMobileMenu}>Image Generation</Link>
                <Link to="/upload" className="block py-2 text-white/80 hover:text-accent-lime text-sm" onClick={closeMobileMenu}>Image to Video</Link>
              </div>
            </div>
            <Link to="/upload" className="text-white/90 py-2 uppercase text-sm" onClick={closeMobileMenu}>Generate History</Link>
            <Link to="/pricing" className="text-white/90 py-2 uppercase text-sm" onClick={closeMobileMenu}>Pricing</Link>
            {isAuthenticated ? (
              <>
                <Link to="/upload" className="py-3 bg-accent-lime text-black font-semibold text-center rounded-lg uppercase text-sm" onClick={closeMobileMenu}>
                  Upload video
                </Link>
                <button type="button" onClick={() => { logout(); closeMobileMenu(); }} className="text-white/70 py-2 uppercase text-sm text-left">
                  Logout
                </button>
              </>
            ) : (
              <button onClick={() => { handleGetStarted(); closeMobileMenu(); }} className="py-3 bg-accent-lime text-black font-semibold text-center rounded-lg uppercase text-sm">
                {HAS_GOOGLE ? 'Login' : 'Enter'}
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
