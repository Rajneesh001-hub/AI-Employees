'use client';

import { FormEvent, useState } from 'react';
import { ArrowRight, CalendarDays, Check, ChevronDown, Clipboard, Copy, Download, Megaphone, MoreHorizontal, Plus, RefreshCw, Save, Send, Sparkles, X } from 'lucide-react';
import './marketing-screens.css';

type TaskStatus = 'Draft' | 'Needs Review' | 'Approved' | 'Completed' | 'Failed' | 'Escalated';
type ContentOption = { id: number; title: string; content: string; status: TaskStatus; editing: boolean; contentType: string; product: string };
type CalendarItem = { id: number; title: string; contentType: string; day: number; status: TaskStatus };
type Campaign = { id: number; name: string; start: string; end: string; count: number; status: TaskStatus; goal: string };

const products = ['Festive Kurta Set · ₹4,299', 'Cotton Co-ord Set · ₹3,499', 'Embroidered Lehenga · ₹8,500', 'New Winter Collection', 'Weekend Sale'];
const tones = ['Warm & friendly', 'Festive & celebratory', 'Premium & polished', 'Playful & fun', 'Minimal & direct'];
const contentTypes = ['Caption', 'Post idea', 'Reel script', 'Product description', 'Promotional message', 'Campaign'];
const weekDays = [{ name: 'Mon', date: 16 }, { name: 'Tue', date: 17 }, { name: 'Wed', date: 18 }, { name: 'Thu', date: 19 }, { name: 'Fri', date: 20 }, { name: 'Sat', date: 21 }, { name: 'Sun', date: 22 }];
const statusClass: Record<TaskStatus, string> = { Draft: 'marketing-draft', 'Needs Review': 'marketing-needs-review', Approved: 'marketing-approved', Completed: 'marketing-completed', Failed: 'marketing-failed', Escalated: 'marketing-escalated' };

const initialOptions: ContentOption[] = [
  { id: 1, title: 'Option 1 · A little more festive', content: 'A little colour, a lot of celebration. ✨ Meet the Festive Kurta Set — made for every moment worth dressing up for. Find your festive favourite at Style Street.\n\n#StyleStreet #FestiveStyle #MadeForTheMoment', status: 'Draft', editing: false, contentType: 'Caption', product: products[0] },
  { id: 2, title: 'Option 2 · Warm & personal', content: 'The best celebrations start with feeling like yourself. Our new Festive Kurta Set brings together thoughtful details and all-day comfort, just in time for the season. Come find your fit at Style Street. ✨', status: 'Draft', editing: false, contentType: 'Caption', product: products[0] },
  { id: 3, title: 'Option 3 · Short & bright', content: 'Your festive plans called. They want this kurta. 💜 Discover the new Festive Kurta Set at Style Street — available now for ₹4,299.', status: 'Draft', editing: false, contentType: 'Caption', product: products[0] },
];

const initialCalendar: CalendarItem[] = [
  { id: 11, title: 'New arrivals teaser', contentType: 'Post idea', day: 18, status: 'Approved' },
  { id: 12, title: 'Weekend styling reel', contentType: 'Reel script', day: 20, status: 'Draft' },
];

const initialCampaigns: Campaign[] = [
  { id: 21, name: 'Diwali Collection Launch', start: 'Nov 16, 2026', end: 'Nov 22, 2026', count: 5, status: 'Needs Review', goal: 'Introduce the festive collection and drive store enquiries.' },
  { id: 22, name: 'Weekend Wardrobe Refresh', start: 'Nov 23, 2026', end: 'Nov 29, 2026', count: 3, status: 'Draft', goal: 'Highlight versatile pieces for everyday styling.' },
  { id: 23, name: 'New Arrivals · Winter Edit', start: 'Dec 1, 2026', end: 'Dec 7, 2026', count: 4, status: 'Approved', goal: 'Showcase new season fabrics and silhouettes.' },
];

export default function MarketingScreens({ screen }: { screen: 'Marketing Studio' | 'Campaigns' }) {
  const [contentType, setContentType] = useState('Caption');
  const [product, setProduct] = useState(products[0]);
  const [tone, setTone] = useState(tones[0]);
  const [request, setRequest] = useState('');
  const [options, setOptions] = useState(initialOptions);
  const [calendarItems, setCalendarItems] = useState(initialCalendar);
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [showCampaignForm, setShowCampaignForm] = useState(false);
  const [campaignName, setCampaignName] = useState('');
  const [campaignStart, setCampaignStart] = useState('2026-11-23');
  const [campaignEnd, setCampaignEnd] = useState('2026-11-29');
  const [campaignGoal, setCampaignGoal] = useState('');
  const [generating, setGenerating] = useState(false);
  const [toast, setToast] = useState('');

  function notify(message: string) { setToast(message); window.setTimeout(() => setToast(''), 2200); }
  function makeContent(variant: number, nextType = contentType, nextProduct = product, nextTone = tone) {
    const item = nextProduct.split(' · ')[0];
    const brief = request.trim();
    const style = [
      `A little ${nextTone.toLowerCase()}, a lot of Style Street. ✨ Meet the ${item} — made for every moment worth dressing up for. Find your new favourite with us.`,
      `The best looks feel like you. Discover the ${item} at Style Street, thoughtfully chosen for comfort, confidence and a little extra ${nextTone.toLowerCase()} this season.`,
      `Your next favourite just arrived. 💜 The ${item} is here at Style Street. Come find your fit${nextProduct.includes('₹') ? ` — ${nextProduct.split(' · ')[1]}` : ''}.`,
    ][variant % 3];
    const typeText: Record<string, string[]> = {
      Caption: [style, style, style],
      'Post idea': [`A three-look carousel: style the ${item} for a family celebration, a dinner out and a relaxed festive day.`, `A close-up carousel showing the details, fabric and finishing on the ${item}.`, `A “pick your festive look” post featuring the ${item} with a simple styling question for customers.`],
      'Reel script': [`Scene 1: A festive invite lands. Scene 2: Quick transition into the ${item}. Scene 3: Show the details and finish with “Find your festive fit at Style Street.”`, `Open on the ${item} laid out with accessories. Cut to three quick styling moments. Close: “One look, all your celebrations.”`, `Hook: “Need a festive look that still feels like you?” Show the ${item}, a detail shot and a full look. End with a Style Street store visit.`],
      'Product description': `${item}: a thoughtful choice for the season. Designed to bring comfort and ${nextTone.toLowerCase()} to your wardrobe. Visit Style Street for product details and availability.`,
      'Promotional message': `A little something for your next celebration. Discover the ${item} at Style Street and find a look you’ll love wearing. Drop by or message us to learn more.`,
      Campaign: `Campaign concept: “Your Season, Your Style.” Introduce the ${item} through a week of outfit inspiration, product details and customer styling moments. Tone: ${nextTone}.`,
    };
    return brief ? `${typeText[nextType][variant]}\n\nBrief: ${brief}` : typeText[nextType][variant];
  }
  function generate() {
    setGenerating(true);
    window.setTimeout(() => {
      setOptions([0, 1, 2].map((variant, index) => ({ id: Date.now() + index, title: `Option ${index + 1} · ${[tone, 'A fresh angle', 'Short & memorable'][index]}`, content: makeContent(variant), status: 'Draft', editing: false, contentType, product })));
      setGenerating(false);
      notify('Three draft options are ready for your review.');
    }, 450);
  }
  function updateOption(id: number, change: Partial<ContentOption>) { setOptions(current => current.map(option => option.id === id ? { ...option, ...change } : option)); }
  function regenerate(option: ContentOption) { const variant = Math.floor(Math.random() * 3); updateOption(option.id, { content: makeContent(variant, option.contentType, option.product), status: 'Draft' }); notify('Draft regenerated.'); }
  function saveOption(option: ContentOption) {
    updateOption(option.id, { status: 'Completed', editing: false });
    setCalendarItems(current => [...current, { id: Date.now(), title: option.title.split(' · ')[0], contentType: option.contentType, day: weekDays[(current.length + 1) % weekDays.length].date, status: 'Completed' }]);
    notify('Content saved to your weekly calendar.');
  }
  function approveOption(option: ContentOption) { updateOption(option.id, { status: 'Approved', editing: false }); notify('Content approved. It has not been published.'); }
  async function copyContent(content: string) { try { await navigator.clipboard.writeText(content); notify('Content copied to clipboard.'); } catch { notify('Copy isn’t available in this browser.'); } }
  function createCampaign(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const startDate = new Date(`${campaignStart}T00:00:00`).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
    const endDate = new Date(`${campaignEnd}T00:00:00`).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
    setCampaigns(current => [{ id: Date.now(), name: campaignName.trim(), start: startDate, end: endDate, count: 0, status: 'Draft', goal: campaignGoal || 'Campaign brief to be added.' }, ...current]);
    setCampaignName(''); setCampaignGoal(''); setShowCampaignForm(false); notify('Campaign created as a draft.');
  }
  function exportCampaign(campaign: Campaign) {
    const text = `${campaign.name}\n${campaign.start} – ${campaign.end}\nStatus: ${campaign.status}\nContent items: ${campaign.count}\n\n${campaign.goal}`;
    const link = document.createElement('a'); link.href = URL.createObjectURL(new Blob([text], { type: 'text/plain' })); link.download = `${campaign.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.txt`; link.click(); URL.revokeObjectURL(link.href); notify('Campaign brief exported.');
  }

  return <div className="marketing-workspace">
    <div className="marketing-page-heading"><div><span className="marketing-eyebrow"><span /> STYLE STREET WORKSPACE</span><h1>{screen}</h1><p>{screen === 'Marketing Studio' ? 'Create on-brand content with a little help from your Marketing Agent.' : 'Organize your content ideas and campaign drafts.'}</p></div>{screen === 'Campaigns' && <button className="marketing-primary-action" onClick={() => setShowCampaignForm(true)}><Plus size={14} />New campaign</button>}</div>

    {screen === 'Marketing Studio' ? <>
      <div className="marketing-studio-grid"><section className="marketing-request-card"><div className="marketing-card-heading"><span className="marketing-agent-mark"><Megaphone size={16} /></span><div><h2>What would you like to create?</h2><p>Your Marketing Agent uses your brand guidance and product details.</p></div></div><div className="marketing-form-body"><label>Content type<select value={contentType} onChange={event => setContentType(event.target.value)}>{contentTypes.map(item => <option key={item}>{item}</option>)}</select></label><label>Product or service<select value={product} onChange={event => setProduct(event.target.value)}>{products.map(item => <option key={item}>{item}</option>)}</select></label><label>Brand tone<select value={tone} onChange={event => setTone(event.target.value)}>{tones.map(item => <option key={item}>{item}</option>)}</select></label><label>Your brief <span className="optional-label">OPTIONAL</span><textarea value={request} onChange={event => setRequest(event.target.value)} placeholder="Add a goal, key detail or call to action..." /></label><div className="marketing-context"><Sparkles size={13} /><span>Grounded in Style Street products and brand guidance</span></div><button className="generate-button" disabled={generating} onClick={generate}><Sparkles size={15} />{generating ? 'Generating drafts...' : 'Generate with Marketing Agent'}</button></div></section>
        <section className="generated-options-section"><div className="generated-section-head"><div><h2>Generated options</h2><p>Choose a draft to edit, save or approve.</p></div><span className="options-count">{options.length} OPTIONS</span></div><div className="generated-options-list">{options.map(option => <article className="generated-option" key={option.id}><header><div><span className="option-index">{String(options.indexOf(option) + 1).padStart(2, '0')}</span><h3>{option.title}</h3></div><span className={`content-status ${statusClass[option.status]}`}><i />{option.status}</span></header>{option.editing ? <textarea className="option-editor" value={option.content} onChange={event => updateOption(option.id, { content: event.target.value })} /> : <div className="option-copy">{option.content}</div>}<div className="option-meta"><span>{option.contentType}</span><span>·</span><span>{option.product.split(' · ')[0]}</span><button onClick={() => copyContent(option.content)} aria-label="Copy content"><Copy size={12} />Copy</button></div><div className="option-actions"><button className="option-edit" onClick={() => updateOption(option.id, { editing: !option.editing })}>{option.editing ? 'Done editing' : 'Edit'}</button><button className="option-regenerate" onClick={() => regenerate(option)}><RefreshCw size={12} />Regenerate</button><button className="option-save" onClick={() => saveOption(option)}><Save size={12} />Save</button><button className="option-approve" onClick={() => approveOption(option)}><Check size={12} />Approve</button></div></article>)}</div></section></div>
      <section className="content-calendar"><div className="calendar-header"><div><span className="calendar-icon"><CalendarDays size={15} /></span><div><h2>Weekly content calendar</h2><p>Saved content for Nov 16 – Nov 22, 2026</p></div></div><button onClick={() => notify('Showing this week’s saved content.')}><ChevronDown size={13} />This week</button></div><div className="calendar-week">{weekDays.map(day => <div className={`calendar-day ${day.date === 21 ? 'calendar-today' : ''}`} key={day.date}><div className="calendar-day-head"><span>{day.name}</span><b>{day.date}</b>{day.date === 21 && <small>Today</small>}</div><div className="calendar-day-items">{calendarItems.filter(item => item.day === day.date).map(item => <article key={item.id} className={`calendar-content-item calendar-${item.status.toLowerCase().replaceAll(' ', '-')}`}><span>{item.contentType}</span><b>{item.title}</b><small><i />{item.status}</small></article>)}{!calendarItems.some(item => item.day === day.date) && <div className="calendar-empty">—</div>}</div></div>)}</div></section>
    </> : <>
      <div className="campaign-note"><span><Megaphone size={15} /></span><p>Publishing to social media is coming later. <b>Export or copy content for now.</b></p></div>
      <div className="campaign-summary-row"><div><h2>Your campaigns</h2><p>Plan content in one place and keep track of what’s ready.</p></div><span>{campaigns.length} CAMPAIGNS</span></div>
      <div className="campaign-grid">{campaigns.map(campaign => <article className="campaign-card" key={campaign.id}><div className="campaign-card-top"><span className="campaign-art"><Megaphone size={17} /></span><button aria-label="Campaign options" onClick={() => exportCampaign(campaign)}><MoreHorizontal size={17} /></button></div><div className="campaign-card-title"><h3>{campaign.name}</h3><span className={`content-status ${statusClass[campaign.status]}`}><i />{campaign.status}</span></div><p className="campaign-goal">{campaign.goal}</p><div className="campaign-dates"><CalendarDays size={13} /><span>{campaign.start}<i>—</i>{campaign.end}</span></div><div className="campaign-content-count"><span><Clipboard size={13} />Content items</span><b>{campaign.count}</b></div><div className="campaign-card-footer"><span>{campaign.status === 'Approved' ? 'Ready to export' : campaign.status === 'Needs Review' ? 'Review content drafts' : 'Draft campaign'}</span><button onClick={() => exportCampaign(campaign)}><Download size={13} />Export brief</button></div></article>)}</div>
      </>}

    {showCampaignForm && <div className="marketing-modal-scrim" onClick={() => setShowCampaignForm(false)}><form className="campaign-modal" onSubmit={createCampaign} onClick={event => event.stopPropagation()}><div className="campaign-modal-head"><span><Megaphone size={16} /></span><button type="button" onClick={() => setShowCampaignForm(false)} aria-label="Close"><X size={17} /></button></div><h2>New campaign</h2><p>Start with a name and a simple goal. You can add content as you go.</p><label>Campaign name<input autoFocus required value={campaignName} onChange={event => setCampaignName(event.target.value)} placeholder="e.g. Festive collection launch" /></label><div className="campaign-date-fields"><label>Start date<input type="date" required value={campaignStart} onChange={event => setCampaignStart(event.target.value)} /></label><label>End date<input type="date" required value={campaignEnd} onChange={event => setCampaignEnd(event.target.value)} /></label></div><label>Campaign goal<textarea value={campaignGoal} onChange={event => setCampaignGoal(event.target.value)} placeholder="What would you like this campaign to achieve?" /></label><div className="campaign-modal-actions"><button type="button" onClick={() => setShowCampaignForm(false)}>Cancel</button><button type="submit"><Plus size={13} />Create campaign</button></div></form></div>}
    {toast && <div className="marketing-toast"><Check size={14} />{toast}</div>}
  </div>;
}
