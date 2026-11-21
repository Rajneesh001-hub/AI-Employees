'use client';

import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Eye, EyeOff, LockKeyhole, Mail, Sparkles, UserRound } from 'lucide-react';
import Link from 'next/link';
import './login.css';

type AuthMode = 'login' | 'signup';

export default function LoginPage() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function changeMode(next: AuthMode) {
    setMode(next);
    setSubmitted(false);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <main className="auth-page">
      <section className="auth-form-side">
        <Link className="auth-brand" href="/" aria-label="AI Business OS home">
          <span className="auth-brand-icon"><Sparkles size={18} fill="currentColor" /></span>
          <span>business<span>OS</span></span>
        </Link>

        <div className="auth-card-wrap">
          <div className="auth-heading">
            <span className="auth-kicker">YOUR BUSINESS, IN GOOD HANDS</span>
            <h1>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h1>
            <p>{mode === 'login' ? 'Log in to pick up where you left off.' : 'Set up your workspace and meet your AI team.'}</p>
          </div>

          <div className="auth-tabs" role="tablist" aria-label="Account access">
            <button type="button" role="tab" aria-selected={mode === 'login'} className={mode === 'login' ? 'auth-tab selected' : 'auth-tab'} onClick={() => changeMode('login')}>Log in</button>
            <button type="button" role="tab" aria-selected={mode === 'signup'} className={mode === 'signup' ? 'auth-tab selected' : 'auth-tab'} onClick={() => changeMode('signup')}>Sign up</button>
          </div>

          {submitted ? <div className="auth-success" role="status"><span className="auth-success-icon"><Check size={20} /></span><h2>{mode === 'login' ? 'You’re all set' : 'Account details received'}</h2><p>This screen is a UI prototype. Connect authentication to continue into your workspace.</p><button type="button" className="auth-secondary" onClick={() => setSubmitted(false)}>Back to form</button></div> : <form className="auth-form" onSubmit={handleSubmit}>
            {mode === 'signup' && <label className="auth-field"><span>Your name</span><span className="input-wrap"><UserRound size={17} /><input type="text" name="name" placeholder="e.g. Arjun Verma" autoComplete="name" required /></span></label>}
            <label className="auth-field"><span>Email address</span><span className="input-wrap"><Mail size={17} /><input type="email" name="email" placeholder="you@company.com" autoComplete="email" required /></span></label>
            <label className="auth-field"><span>Password</span><span className="input-wrap"><LockKeyhole size={17} /><input type={showPassword ? 'text' : 'password'} name="password" placeholder="Enter your password" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} minLength={8} required /><button type="button" className="password-toggle" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button></span></label>
            {mode === 'login' && <div className="auth-options"><label className="remember-option"><input type="checkbox" /> <span>Remember me</span></label><button type="button" className="forgot-link" onClick={() => window.alert('Password reset will be available when authentication is connected.')}>Forgot password?</button></div>}
            <button type="submit" className="auth-submit">{mode === 'login' ? 'Log in' : 'Create account'}<ArrowRight size={16} /></button>
            <p className="auth-switch">{mode === 'login' ? 'New to Business OS?' : 'Already have an account?'} <button type="button" onClick={() => changeMode(mode === 'login' ? 'signup' : 'login')}>{mode === 'login' ? 'Create an account' : 'Log in'}</button></p>
          </form>}
          <div className="auth-safe"><LockKeyhole size={14} /><span>Your business data stays private to your workspace.</span></div>
        </div>
        <div className="auth-bottom"><Link href="/"><ArrowLeft size={14} /> Back to overview</Link><span>© 2026 AI Business OS</span></div>
      </section>

      <aside className="auth-showcase">
        <div className="showcase-orb orb-one" /><div className="showcase-orb orb-two" />
        <div className="showcase-content">
          <div className="showcase-logo"><span><Sparkles size={17} fill="currentColor" /></span> YOUR AI TEAM, ALL IN ONE PLACE</div>
          <div className="showcase-title"><span className="showcase-eyebrow">A smarter way to work</span><h2>One platform.<br />Multiple AI employees.</h2><p>Everyday business tasks, handled with a little help from AI.</p></div>
          <div className="showcase-agents">
            <article className="showcase-agent">
              <span className="showcase-agent-icon icon-marketing"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m3 11 18-5-5 18-4-8-9-5Z"/><path d="m12 16 4-4"/></svg></span>
              <span className="showcase-agent-copy"><b>AI Marketing Agent</b><small>Ideas, content & campaigns</small></span><span className="agent-check"><Check size={12} /></span>
            </article>
            <article className="showcase-agent">
              <span className="showcase-agent-icon icon-sales"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m7 14 4-4 4 3 6-7"/><path d="M16 6h5v5"/></svg></span>
              <span className="showcase-agent-copy"><b>AI Sales Agent</b><small>Leads, follow-ups & next steps</small></span><span className="agent-check"><Check size={12} /></span>
            </article>
            <article className="showcase-agent">
              <span className="showcase-agent-icon icon-support"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14v-3a8 8 0 0 1 16 0v3"/><path d="M4 14h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a1 1 0 0 1 1-1Z"/><path d="M20 14h-2a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a1 1 0 0 0-1-1Z"/><path d="M12 20h2"/></svg></span>
              <span className="showcase-agent-copy"><b>AI Customer Support Agent</b><small>Helpful, grounded answers</small></span><span className="agent-check"><Check size={12} /></span>
            </article>
          </div>
          <div className="showcase-note"><span className="note-stars">✳</span><span><b>Always in your corner.</b><small>You stay in control of every decision.</small></span><span className="note-arrow"><ArrowRight size={16} /></span></div>
          <div className="showcase-dots"><i className="dot-current" /><i /><i /></div>
        </div>
        <div className="showcase-bottom"><span>BUILT FOR THE WAY YOU WORK</span><span>01 <i /> 03</span></div>
      </aside>
    </main>
  );
}
