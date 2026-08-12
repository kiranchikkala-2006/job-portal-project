import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import API from '../services/api';
import { useToast } from '../context/ToastContext';
import {
  Mail,
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  ShieldCheck,
  RefreshCw,
  Copy,
  Check,
} from 'lucide-react';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { addToast } = useToast();

  // Step state: 1 = Email Input, 2 = OTP Verification, 3 = New Password
  const [step, setStep] = useState(1);

  // Form states
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Status states
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  // Start resend countdown
  const startTimer = () => {
    setResendTimer(30);
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Step 1: Request OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMsg('Please enter your email address.');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg('');
      const res = await API.post('/auth/forgot-password', { email: email.trim() });

      if (res.data.success) {
        addToast(`Verification code sent to ${email}`, 'success');
        setStep(2);
        startTimer();
      }
    } catch (err) {
      const msg =
        err.response?.data?.message || 'Failed to request password reset. Please try again.';
      setErrorMsg(msg);
      addToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp.trim() || otp.trim().length !== 6) {
      setErrorMsg('Please enter a valid 6-digit OTP code.');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg('');
      const res = await API.post('/auth/verify-otp', { email: email.trim(), otp: otp.trim() });

      if (res.data.success) {
        addToast('OTP verified successfully! Please set your new password.', 'success');
        setStep(3);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid OTP code. Please check and try again.';
      setErrorMsg(msg);
      addToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setErrorMsg('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify.');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg('');
      const res = await API.post('/auth/reset-password', {
        email: email.trim(),
        otp: otp.trim(),
        newPassword,
      });

      if (res.data.success) {
        addToast('Password updated successfully! You can now log in.', 'success');
        navigate('/login', { replace: true });
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to reset password. Please try again.';
      setErrorMsg(msg);
      addToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    try {
      setLoading(true);
      setErrorMsg('');
      const res = await API.post('/auth/forgot-password', { email: email.trim() });
      if (res.data.success) {
        addToast(`New verification code sent to ${email}!`, 'info');
        startTimer();
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Error resending code.';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6">
        <div className="w-full max-w-md">
          {/* Main Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/50 p-6 sm:p-8">
            {/* Header branding */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 mb-4 shadow-xs">
                {step === 1 && <Mail className="w-7 h-7" />}
                {step === 2 && <KeyRound className="w-7 h-7 text-purple-600" />}
                {step === 3 && <Lock className="w-7 h-7 text-emerald-600" />}
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {step === 1 && 'Reset Password'}
                {step === 2 && 'Verify Verification Code'}
                {step === 3 && 'Set New Password'}
              </h1>
              <p className="text-xs text-slate-500 mt-1.5 max-w-xs mx-auto">
                {step === 1 &&
                  'Enter your registered account email to receive a 6-digit verification code.'}
                {step === 2 && `Enter the 6-digit code sent to ${email}`}
                {step === 3 && 'Choose a strong password to secure your account.'}
              </p>
            </div>

            {/* Stepper Progress */}
            <div className="flex items-center justify-center gap-2 mb-8">
              <div
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  step >= 1 ? 'w-10 bg-blue-600' : 'w-4 bg-slate-200'
                }`}
              />
              <div
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  step >= 2 ? 'w-10 bg-purple-600' : 'w-4 bg-slate-200'
                }`}
              />
              <div
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  step >= 3 ? 'w-10 bg-emerald-600' : 'w-4 bg-slate-200'
                }`}
              />
            </div>

            {/* Error Message Box */}
            {errorMsg && (
              <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-start gap-2.5 animate-fadeIn">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                <div>{errorMsg}</div>
              </div>
            )}

            {/* STEP 1: EMAIL INPUT */}
            {step === 1 && (
              <form onSubmit={handleRequestOtp} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. john@example.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setErrorMsg('');
                      }}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {loading ? (
                    <span>Searching Account & Sending OTP...</span>
                  ) : (
                    <>
                      <span>Send Verification OTP</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* STEP 2: OTP VERIFICATION */}
            {step === 2 && (
              <form onSubmit={handleVerifyOtp} className="space-y-5">
                {/* Email Sent Notice */}
                <div className="p-4 rounded-2xl bg-purple-50/80 border border-purple-200/80 text-purple-900 flex items-start gap-3 animate-fadeIn">
                  <Mail className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                  <div className="text-xs space-y-0.5">
                    <p className="font-bold text-purple-950">Verification code sent to your email!</p>
                    <p className="text-purple-700">
                      Please check your email inbox (<strong className="text-purple-950">{email}</strong>) for the 6-digit OTP verification code.
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    6-Digit OTP Code
                  </label>
                  <div className="relative">
                    <KeyRound className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      maxLength={6}
                      required
                      placeholder="123456"
                      value={otp}
                      onChange={(e) => {
                        setOtp(e.target.value.replace(/\D/g, ''));
                        setErrorMsg('');
                      }}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-lg font-mono font-bold tracking-widest text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all text-center"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-slate-500 hover:text-slate-800 font-medium flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Change Email
                  </button>

                  <button
                    type="button"
                    disabled={resendTimer > 0 || loading}
                    onClick={handleResendOtp}
                    className={`font-bold flex items-center gap-1 ${
                      resendTimer > 0
                        ? 'text-slate-400 cursor-not-allowed'
                        : 'text-purple-600 hover:text-purple-700'
                    }`}
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                    {resendTimer > 0 ? `Resend code in ${resendTimer}s` : 'Resend Code'}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {loading ? (
                    <span>Verifying Code...</span>
                  ) : (
                    <>
                      <span>Verify Code</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* STEP 3: NEW PASSWORD */}
            {step === 3 && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="At least 6 characters"
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        setErrorMsg('');
                      }}
                      className="w-full pl-11 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Re-enter your new password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setErrorMsg('');
                      }}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {loading ? (
                    <span>Updating Password...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Update Password & Log In</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Back to Login Link */}
            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Sign In
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
