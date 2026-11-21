'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, ChevronDown, Command, Globe2, Mail, Phone, Plus, Sparkles } from 'lucide-react';
import './onboarding.css';

const steps = ['Create workspace', 'Business details', 'Products and FAQs', 'Brand tone and agent permissions', 'Test an AI employee'];
const categories = ['Retail and clothing', 'E-commerce', 'Restaurant or cafe', 'Salon or local service', 'Coaching institute', 'Agency'];

export default function OnboardingPage() {
  const [activeStep, setActiveStep] = useState(2);
  const [category, setCategory] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [description, setDescription] = useState('');
  const [website, setWebsite] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [toast, setToast] = useState('');

  function moveTo(step: number) {
    setActiveStep(Math.min(5, Math.max(1, step)));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function skipStep() {
    setToast('You can add this information later in Settings.');
    window.setTimeout(() => setToast(''), 2400);
    moveTo(activeStep + 1);
  }
  function continueStep(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    moveTo(activeStep + 1);
  }

  return <main className="onboarding-page">
    <header className="onboarding-header">
      <Link className="onboarding-brand" href="/" aria-label="AI Business OS home"><span><Command size={19} strokeWidth={2.5} /></span>business<span className="brand-os">OS</span></Link>
      <div className="onboarding-save"><span />Saved automatically</div>
      <button className="onboarding-exit" onClick={() => { window.location.href = '/'; }}>Exit setup</button>
    </header>

    <section className="onboarding-main">
      <div className="onboarding-welcome"><span className="setup-kicker"><Sparkles size={13} /> LET’S GET YOU SET UP</span><h1>A workspace that works for you.</h1><p>Just a few quick details. You can always change them later.</p></div>

      <div className="onboarding-stepper" aria-label="Onboarding progress">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const complete = stepNumber < activeStep;
          const current = stepNumber === activeStep;
          return <div className={`step-item ${current ? 'step-current' : ''} ${complete ? 'step-complete' : ''}`} key={step}>
            <button type="button" className="step-circle" aria-current={current ? 'step' : undefined} onClick={() => complete && moveTo(stepNumber)} disabled={!complete && !current}>{complete ? <Check size={14} /> : stepNumber}</button>
            <span className="step-label">{step}</span>
            {index < steps.length - 1 && <i className="step-connector" />}
          </div>;
        })}
      </div>

      <section className="onboarding-card">
        <div className="onboarding-card-head"><div><span className="step-eyebrow">STEP {activeStep} OF 5</span><h2>{steps[activeStep - 1]}</h2><p>{activeStep === 2 ? 'Tell us a little about your business.' : 'This takes just a moment. You can update it any time.'}</p></div><div className="step-illustration"><span><Command size={21} /></span><i /><i /><i /></div></div>
        <div className="setup-tip"><span className="tip-spark"><Sparkles size={15} /></span><p>Add only what you need now. You can add more business knowledge later.</p></div>

        {activeStep === 2 ? <form className="business-form" onSubmit={continueStep}>
          <div className="form-field"><label htmlFor="business-name">Business name <span>*</span></label><input id="business-name" value={businessName} onChange={event => setBusinessName(event.target.value)} placeholder="e.g. Style Street" required /></div>
          <div className="form-field"><label htmlFor="business-category">Business category <span>*</span></label><div className="select-wrap"><select id="business-category" value={category} onChange={event => setCategory(event.target.value)} required><option value="" disabled>Select a category</option>{categories.map(item => <option key={item}>{item}</option>)}</select><ChevronDown size={16} /></div></div>
          <div className="form-field"><label htmlFor="business-description">Business description <span className="optional-tag">OPTIONAL</span></label><textarea id="business-description" rows={3} value={description} onChange={event => setDescription(event.target.value)} placeholder="What do you sell or offer? A sentence or two is plenty." /></div>
          <div className="form-divider"><span>CONTACT DETAILS</span><span>OPTIONAL</span></div>
          <div className="form-field"><label htmlFor="business-website">Website <span className="optional-tag">OPTIONAL</span></label><div className="input-icon-wrap"><Globe2 size={16} /><input id="business-website" type="url" value={website} onChange={event => setWebsite(event.target.value)} placeholder="https://yourbusiness.com" /></div></div>
          <div className="contact-fields"><div className="form-field"><label htmlFor="business-email">Contact email <span className="optional-tag">OPTIONAL</span></label><div className="input-icon-wrap"><Mail size={16} /><input id="business-email" type="email" value={contactEmail} onChange={event => setContactEmail(event.target.value)} placeholder="hello@yourbusiness.com" /></div></div><div className="form-field"><label htmlFor="business-phone">Phone number <span className="optional-tag">OPTIONAL</span></label><div className="input-icon-wrap"><Phone size={16} /><input id="business-phone" type="tel" value={contactPhone} onChange={event => setContactPhone(event.target.value)} placeholder="+91 98765 43210" /></div></div></div>
          <div className="form-actions"><button type="button" className="back-button" onClick={() => moveTo(1)}><ArrowLeft size={15} />Back</button><div><button type="button" className="skip-button" onClick={skipStep}>Skip for now</button><button type="submit" className="continue-button">Continue<ArrowRight size={15} /></button></div></div>
        </form> : <div className="other-step-content"><span className="other-step-icon">{activeStep === 5 ? <Sparkles size={21} /> : <Plus size={21} />}</span><h3>{activeStep === 1 ? 'Name your workspace' : activeStep === 3 ? 'Add your first product or FAQ' : activeStep === 4 ? 'Set your brand voice' : 'Meet your AI employee'}</h3><p>{activeStep === 1 ? 'Your workspace keeps your team and business information together.' : activeStep === 3 ? 'A product, a price, or one common question is a great place to start.' : activeStep === 4 ? 'Choose how your AI team should sound and what they can do.' : 'Try a question or request to see your AI employee in action.'}</p><div className="saved-summary"><span className="summary-check"><Check size={13} /></span><span><b>{businessName || 'Your business'}</b><small>{category || 'Business details'}{description ? ` · ${description}` : ''}</small></span></div><div className="form-actions"><button type="button" className="back-button" onClick={() => moveTo(activeStep - 1)}><ArrowLeft size={15} />Back</button><div><button type="button" className="skip-button" onClick={skipStep}>Skip for now</button>{activeStep < 5 ? <button type="button" className="continue-button" onClick={() => moveTo(activeStep + 1)}>Continue<ArrowRight size={15} /></button> : <button type="button" className="continue-button" onClick={() => { window.location.href = '/'; }}>Go to dashboard<ArrowRight size={15} /></button>}</div></div></div>}
      </section>
      <div className="onboarding-privacy"><span className="privacy-lock">✓</span>Your business information stays private to your workspace.</div>
    </section>
    <footer className="onboarding-footer"><span>© 2026 AI Business OS</span><span>Need help? <a href="mailto:support@aibusinessos.example">Contact support</a></span></footer>
    {toast && <div className="onboarding-toast"><Check size={15} />{toast}</div>}
  </main>;
}
