import React, { useState } from 'react';
import { useSocial } from '../../context/SocialContext';
import { QevoraLogo } from '../common/QevoraLogo';
import { X, Mail, Lock, User, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup' | 'forgot_password';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
}) => {
  const { 
    currentUser, 
    updateCurrentUser, 
    addToast,
    users
  } = useSocial();

  const [mode, setMode] = useState<'login' | 'signup' | 'forgot_password'>(initialMode);
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);

  // Sync mode if initialMode changes
  React.useEffect(() => {
    setMode(initialMode);
    setResetSent(false);
    setError(null);
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setResetSent(true);
      addToast(`Password reset link dispatched to ${email}`, 'info');
    }, 600);
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedEmail = email.trim().toLowerCase();
    const isAdminEmail = trimmedEmail === 'roynirobn@gmail.com';
    const ADMIN_PASSWORD = 'BLACK999YT@';

    // Form validations
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (mode === 'signup' && !displayName.trim()) {
      setError('Please enter your full display name.');
      return;
    }

    // Admin Credentials Validation
    if (isAdminEmail) {
      if (password !== ADMIN_PASSWORD) {
        setError('Incorrect password for admin account.');
        return;
      }
    }

    setIsLoading(true);

    // Simulate authentic authentication response
    setTimeout(() => {
      setIsLoading(false);

      if (isAdminEmail) {
        // Log in / Sign up as SuperAdmin
        updateCurrentUser({
          id: 'user_admin_roynirob',
          name: mode === 'signup' && displayName.trim() ? displayName.trim() : 'Roy Nirob',
          handle: 'roynirob',
          email: 'roynirobn@gmail.com',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
          bio: 'Official Qevora SuperAdmin & Platform Overseer.',
          role: 'admin',
          verified: true,
          isEmailVerified: true,
        });
        addToast('Logged in as SuperAdmin Roy Nirob! Admin Panel unlocked.', 'success');
      } else {
        // Regular User Account (baki sob usser)
        if (mode === 'signup') {
          const handle = displayName.toLowerCase().replace(/[^a-z0-9]/g, '');
          updateCurrentUser({
            id: `user_${Date.now()}`,
            name: displayName.trim(),
            handle: handle || 'user',
            email: trimmedEmail,
            role: 'user', // STRICTLY regular user
            verified: false,
            isEmailVerified: true,
            bio: 'Hey there! Just joined Qevora. Ready to connect and share.',
          });
          addToast(`Welcome to Qevora, ${displayName}!`, 'success');
        } else {
          // Regular user sign in
          const matched = users.find((u) => u.email?.toLowerCase() === trimmedEmail);
          if (matched) {
            updateCurrentUser({
              ...matched,
              role: 'user', // STRICTLY regular user
            });
            addToast(`Signed in successfully as ${matched.name}`, 'success');
          } else {
            const extracted = trimmedEmail.split('@')[0].replace(/[^a-z0-9]/g, '');
            updateCurrentUser({
              id: `user_${Date.now()}`,
              name: extracted ? extracted.charAt(0).toUpperCase() + extracted.slice(1) : 'Member',
              handle: extracted || 'user',
              email: trimmedEmail,
              role: 'user', // STRICTLY regular user
              verified: false,
              isEmailVerified: true,
              bio: 'Qevora member.',
            });
            addToast(`Signed in as @${extracted || 'user'}`, 'success');
          }
        }
      }
      onClose();
    }, 600);
  };

  const handleGoogleSignIn = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      updateCurrentUser({
        role: 'user', // Google sign in is always regular user
      });
      addToast('Signed in via Google account', 'success');
      onClose();
    }, 800);
  };

  const handleDemoSwitch = (user: any) => {
    updateCurrentUser({
      id: user.id,
      name: user.name,
      handle: user.handle,
      avatar: user.avatar,
      bio: user.bio,
      location: user.location,
      website: user.website,
      role: 'user', // Regular user
    });
    addToast(`Switched account to @${user.handle}`, 'info');
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between p-4 pb-2">
          <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
            {mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Password Recovery'}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
            aria-label="Close auth dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Brand Banner with Official Qevora Logo */}
        <div className="flex flex-col items-center px-6 pt-1 pb-3 text-center">
          <div className="mb-2">
            <QevoraLogo variant="full" size="lg" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            {mode === 'login' ? 'Welcome back to Qevora' : 'Join Qevora Today'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Connect · Share · Be You
          </p>
        </div>

        {/* Auth Form */}
        <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {mode !== 'forgot_password' && (
            <>
              {/* Google Sign In Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full min-h-[44px] py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 active:scale-[0.99] text-xs sm:text-sm font-bold text-slate-700 flex items-center justify-center gap-3 transition-all shadow-xs"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-slate-200" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">or with email</span>
                <div className="flex-1 h-px bg-slate-200" />
              </div>
            </>
          )}

          {mode === 'forgot_password' ? (
            /* Forgot Password Form */
            <form onSubmit={handleForgotPassword} className="space-y-3">
              {resetSent ? (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs space-y-2">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Reset Link Sent</span>
                  </div>
                  <p>
                    A password recovery email has been sent to <strong>{email}</strong>. In production, click the token link to set a new password.
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Enter your email address and we will dispatch a secure link to reset your account password.
                  </p>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">Email Address</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="alex@example.com"
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] disabled:bg-blue-300 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition-all mt-2"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Send Password Reset Link</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </>
              )}

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setError(null);
                    setResetSent(false);
                    setMode('login');
                  }}
                  className="text-xs font-semibold text-blue-600 hover:underline"
                >
                  ← Back to Sign In
                </button>
              </div>
            </form>
          ) : (
            /* Login & Signup Form */
            <form onSubmit={handleEmailAuth} className="space-y-3">
              {mode === 'signup' && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Alex Vance"
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@example.com"
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 block">Password</label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => {
                        setError(null);
                        setMode('forgot_password');
                      }}
                      className="text-[11px] font-semibold text-blue-600 hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {mode === 'signup' && (
                <div className="p-2.5 rounded-xl bg-blue-50/60 border border-blue-100 flex items-start gap-2 text-[11px] text-blue-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <span>Your email address will be automatically verified upon registration for this demo account.</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] disabled:bg-blue-300 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition-all mt-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{mode === 'login' ? 'Sign In to Qevora' : 'Create My Account'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Mode toggle */}
          {mode !== 'forgot_password' && (
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setMode(mode === 'login' ? 'signup' : 'login');
                }}
                className="text-xs font-semibold text-blue-600 hover:underline"
              >
                {mode === 'login' 
                  ? "Don't have a Qevora account? Sign up" 
                  : "Already have an account? Sign in"}
              </button>
            </div>
          )}

          {/* Quick SuperAdmin Autofill */}
          <div className="pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setEmail('roynirobn@gmail.com');
                setPassword('BLACK999YT@');
                if (mode === 'signup') setDisplayName('Roy Nirob');
                setError(null);
              }}
              className="w-full py-1.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-medium flex items-center justify-between transition-colors shadow-xs cursor-pointer"
            >
              <span className="font-bold flex items-center gap-1.5 text-blue-400">
                <span>🛡️</span>
                <span>Fill SuperAdmin (Roy Nirob)</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">roynirobn@gmail.com</span>
            </button>
          </div>

          {/* Quick Demo Switcher */}
          <div className="pt-2">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Fast Regular Member Switch:
            </p>
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              {users.slice(0, 4).map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => handleDemoSwitch(u)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium shrink-0 transition-colors"
                >
                  <img
                    src={u.avatar}
                    alt=""
                    className="w-4 h-4 rounded-full object-cover"
                  />
                  <span>{u.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
