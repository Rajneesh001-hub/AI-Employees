'use client';

import { FormEvent, useState } from 'react';
import { Activity, ArrowRight, Check, ChevronDown, Clock3, FileText, Globe2, Instagram, LockKeyhole, Mail, MessageCircle, MoreHorizontal, Package, Plus, Search, Settings2, ShieldCheck, Tag, Users, X } from 'lucide-react';
import './settings-integrations.css';

type SettingsTab = 'Business Profile' | 'Knowledge Base' | 'Brand Tone' | 'Team and Roles' | 'Integrations' | 'Audit Log';
type KnowledgeTab = 'Products' | 'FAQs' | 'Policies';
type KnowledgeItem = { id: number; name: string; price: string; details: string; availability: string };

const settingsTabs: { label: SettingsTab; icon: typeof Settings2 }[] = [
  { label: 'Business Profile', icon: Globe2 }, { label: 'Knowledge Base', icon: FileText }, { label: 'Brand Tone', icon: Tag },
  { label: 'Team and Roles', icon: Users }, { label: 'Integrations', icon: Package }, { label: 'Audit Log', icon: Activity },
];

const initialItems: Record<KnowledgeTab, KnowledgeItem[]> = {
  Products: [
    { id: 1, name: 'Festive Kurta Set', price: '₹4,299', details: 'Cotton-silk blend with a hand-finished neckline. Includes kurta and matching bottoms.', availability: 'In stock' },
    { id: 2, name: 'Cotton Co-ord Set', price: '₹3,499', details: 'Lightweight breathable cotton set for everyday comfort. Available in three colours.', availability: 'In stock' },
    { id: 3, name: 'Embroidered Lehenga', price: '₹8,500', details: 'Occasion wear lehenga with detailed embroidery. Blouse piece included.', availability: 'Limited stock' },
    { id: 4, name: 'Linen Shirt', price: '₹2,200', details: 'Relaxed-fit linen shirt. Machine wash cold; available in sizes S to XXL.', availability: 'Out of stock' },
  ],
  FAQs: [
    { id: 11, name: 'How long does delivery take?', price: '', details: 'Orders are usually delivered within 3–7 business days, depending on your location.', availability: 'Published' },
    { id: 12, name: 'Can I exchange a sale item?', price: '', details: 'Sale items can be exchanged within 7 days if unused and tags are attached. Sale items are not eligible for a refund.', availability: 'Published' },
    { id: 13, name: 'What payment methods do you accept?', price: '', details: 'We accept UPI, cards, net banking and cash on delivery where available.', availability: 'Published' },
  ],
  Policies: [
    { id: 21, name: 'Returns and exchanges', price: '', details: 'Unused items with original tags may be exchanged within 7 days of delivery. Sale items are exchange only.', availability: 'Active' },
    { id: 22, name: 'Shipping policy', price: '', details: 'Standard delivery takes 3–7 business days. Delivery timelines may vary by pin code.', availability: 'Active' },
  ],
};

const integrationCards = [
  { name: 'Website Chat', description: 'Let visitors ask questions using your approved business information.', status: 'Active', icon: Globe2, color: 'integration-purple', action: 'Configure chat' },
  { name: 'WhatsApp', description: 'Preview the inbox experience with simulated WhatsApp conversations.', status: 'Simulated demo', note: 'Official connection coming later', icon: MessageCircle, color: 'integration-green', action: 'Open demo' },
  { name: 'Instagram', description: 'Explore how Instagram enquiries appear in your shared inbox.', status: 'Simulated demo', note: 'Official connection coming later', icon: Instagram, color: 'integration-pink', action: 'Open demo' },
  { name: 'Email', description: 'Bring customer email conversations into your workspace.', status: 'Coming later', icon: Mail, color: 'integration-blue', action: 'Coming later' },
];

export default function SettingsIntegrations() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('Knowledge Base');
  const [knowledgeTab, setKnowledgeTab] = useState<KnowledgeTab>('Products');
  const [items, setItems] = useState(initialItems);
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState<KnowledgeItem | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [formName, setFormName] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formDetails, setFormDetails] = useState('');
  const [formAvailability, setFormAvailability] = useState('In stock');
  const [toast, setToast] = useState('');

  const currentItems = items[knowledgeTab].filter(item => `${item.name} ${item.details}`.toLowerCase().includes(search.toLowerCase()));
  function notify(message: string) { setToast(message); window.setTimeout(() => setToast(''), 2200); }
  function openNewItem() { setSelectedItem(null); setIsNew(true); setFormName(''); setFormPrice(''); setFormDetails(''); setFormAvailability(knowledgeTab === 'Products' ? 'In stock' : knowledgeTab === 'FAQs' ? 'Published' : 'Active'); }
  function openItem(item: KnowledgeItem) { setSelectedItem(item); setIsNew(false); setFormName(item.name); setFormPrice(item.price.replace('₹', '').replaceAll(',', '')); setFormDetails(item.details); setFormAvailability(item.availability); }
  function closeDrawer() { setSelectedItem(null); setIsNew(false); }
  function saveItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const updated: KnowledgeItem = { id: selectedItem?.id ?? Date.now(), name: formName.trim(), price: knowledgeTab === 'Products' ? `₹${Number(formPrice).toLocaleString('en-IN')}` : '', details: formDetails.trim(), availability: formAvailability };
    setItems(current => ({ ...current, [knowledgeTab]: isNew ? [updated, ...current[knowledgeTab]] : current[knowledgeTab].map(item => item.id === updated.id ? updated : item) }));
    closeDrawer(); notify(isNew ? `${knowledgeTab === 'Products' ? 'Product' : knowledgeTab === 'FAQs' ? 'FAQ' : 'Policy'} added to your knowledge base.` : 'Knowledge item updated.');
  }

  return <div className="settings-page">
    <div className="settings-page-heading"><div><span className="settings-eyebrow"><span /> STYLE STREET WORKSPACE</span><h1>Settings & Integrations</h1><p>Manage your business information, team access and connected channels.</p></div><button className="settings-help" onClick={() => notify('Workspace changes are saved locally in this prototype.')}><LockKeyhole size={13} />Workspace settings</button></div>
    <div className="settings-shell"><nav className="settings-tabs" aria-label="Settings sections">{settingsTabs.map(({ label, icon: Icon }) => <button key={label} className={activeTab === label ? 'settings-tab selected' : 'settings-tab'} onClick={() => setActiveTab(label)}><Icon size={15} /><span>{label}</span>{activeTab === label && <ArrowRight size={12} className="settings-tab-arrow" />}</button>)}</nav>

      <main className="settings-content">{activeTab === 'Knowledge Base' ? <>
        <div className="settings-content-heading"><div><span className="settings-content-icon"><FileText size={15} /></span><div><h2>Knowledge Base</h2><p>Business information your AI employees can use to help customers.</p></div></div><span className="knowledge-record-count">{items[knowledgeTab].length} {knowledgeTab.toLowerCase()}</span></div>
        <div className="knowledge-banner"><span><ShieldCheck size={15} /></span><p>The Support Agent only answers from this information and escalates when it is unsure.</p></div>
        <div className="knowledge-toolbar"><div className="knowledge-subtabs">{(['Products', 'FAQs', 'Policies'] as KnowledgeTab[]).map(tab => <button key={tab} className={knowledgeTab === tab ? 'knowledge-subtab active' : 'knowledge-subtab'} onClick={() => { setKnowledgeTab(tab); setSearch(''); }}>{tab}<span>{items[tab].length}</span></button>)}</div><div className="knowledge-actions"><label className="knowledge-search"><Search size={13} /><input value={search} onChange={event => setSearch(event.target.value)} placeholder={`Search ${knowledgeTab.toLowerCase()}...`} /></label><button className="knowledge-add-button" onClick={openNewItem}><Plus size={13} />Add item</button></div></div>
        <div className="knowledge-table-wrap"><table className="knowledge-table"><thead>{knowledgeTab === 'Products' ? <tr><th>Name</th><th>Price</th><th>Details</th><th>Availability</th><th /></tr> : knowledgeTab === 'FAQs' ? <tr><th>Question</th><th>Answer</th><th>Status</th><th /></tr> : <tr><th>Policy</th><th>Details</th><th>Status</th><th /></tr>}</thead><tbody>{currentItems.map(item => <tr key={item.id} onClick={() => openItem(item)} tabIndex={0} onKeyDown={event => { if (event.key === 'Enter') openItem(item); }}>{knowledgeTab === 'Products' ? <><td><span className="knowledge-item-name"><span className="knowledge-item-glyph"><Package size={13} /></span><b>{item.name}</b></span></td><td className="product-price">{item.price}</td><td className="knowledge-details">{item.details}</td><td><span className={`availability-badge ${item.availability === 'In stock' ? 'available' : item.availability === 'Limited stock' ? 'limited' : 'unavailable'}`}><i />{item.availability}</span></td></> : <><td className="knowledge-primary-text">{item.name}</td><td className="knowledge-details">{item.details}</td><td><span className="knowledge-published"><i />{item.availability}</span></td></>}<td><button className="knowledge-row-more" onClick={event => { event.stopPropagation(); openItem(item); }} aria-label={`Edit ${item.name}`}><MoreHorizontal size={15} /></button></td></tr>)}{currentItems.length === 0 && <tr><td colSpan={knowledgeTab === 'Products' ? 5 : 4} className="knowledge-empty">No {knowledgeTab.toLowerCase()} found.</td></tr>}</tbody></table></div>
        <div className="knowledge-footnote"><span><LockKeyhole size={12} />Private to this workspace</span><span>Updated as you save changes</span></div>
      </> : activeTab === 'Integrations' ? <>
        <div className="settings-content-heading"><div><span className="settings-content-icon"><Package size={15} /></span><div><h2>Integrations</h2><p>Connect the channels your customers already use.</p></div></div><span className="integration-count">1 ACTIVE</span></div><div className="integration-callout"><span><ShieldCheck size={14} /></span><p>Social messaging channels below are <b>simulated demos</b>. Official connections can be added later.</p></div><div className="integration-grid">{integrationCards.map(card => { const Icon = card.icon; const unavailable = card.status === 'Coming later'; return <article className="integration-card" key={card.name}><div className="integration-card-top"><span className={`integration-icon ${card.color}`}><Icon size={18} /></span><span className={`integration-status ${card.status === 'Active' ? 'integration-active' : card.status === 'Simulated demo' ? 'integration-simulated' : 'integration-later'}`}><i />{card.status}</span></div><h3>{card.name}</h3><p>{card.description}</p>{card.note && <span className="integration-note"><Clock3 size={11} />{card.note}</span>}<button disabled={unavailable} onClick={() => notify(card.name === 'Website Chat' ? 'Website Chat settings opened.' : `${card.name} demo opened.`)}>{card.action}{!unavailable && <ArrowRight size={13} />}</button></article>; })}</div>
      </> : <OtherSettingsTab tab={activeTab} notify={notify} />}</main>
    </div>

    {(isNew || selectedItem) && <div className="knowledge-drawer-overlay" onClick={closeDrawer}><aside className="knowledge-drawer" role="dialog" aria-modal="true" aria-labelledby="knowledge-drawer-title" onClick={event => event.stopPropagation()}><header className="knowledge-drawer-header"><div><span className="drawer-kicker">{knowledgeTab.toUpperCase()}</span><h2 id="knowledge-drawer-title">{isNew ? `Add ${knowledgeTab === 'Products' ? 'product' : knowledgeTab === 'FAQs' ? 'FAQ' : 'policy'}` : `Edit ${knowledgeTab === 'Products' ? 'product' : knowledgeTab === 'FAQs' ? 'FAQ' : 'policy'}`}</h2><p>This information can be used by your AI employees.</p></div><button onClick={closeDrawer} aria-label="Close drawer"><X size={18} /></button></header><form className="knowledge-drawer-form" onSubmit={saveItem}><label>{knowledgeTab === 'Products' ? 'Product name' : knowledgeTab === 'FAQs' ? 'Question' : 'Policy name'}<input autoFocus required value={formName} onChange={event => setFormName(event.target.value)} placeholder={knowledgeTab === 'Products' ? 'e.g. Cotton Kurta Set' : knowledgeTab === 'FAQs' ? 'e.g. What is your return policy?' : 'e.g. Returns and exchanges'} /></label>{knowledgeTab === 'Products' && <label>Price (₹)<input type="number" min="0" step="1" required value={formPrice} onChange={event => setFormPrice(event.target.value)} placeholder="4299" /></label>}<label>{knowledgeTab === 'FAQs' ? 'Answer' : knowledgeTab === 'Policies' ? 'Policy details' : 'Product details'}<textarea required value={formDetails} onChange={event => setFormDetails(event.target.value)} placeholder={knowledgeTab === 'Products' ? 'Add accurate product details, sizes and materials...' : knowledgeTab === 'FAQs' ? 'Write the approved answer customers should receive...' : 'Describe the approved business policy...'} /></label><label>{knowledgeTab === 'Products' ? 'Availability' : 'Status'}<span className="drawer-select-wrap"><select value={formAvailability} onChange={event => setFormAvailability(event.target.value)}>{(knowledgeTab === 'Products' ? ['In stock', 'Limited stock', 'Out of stock'] : knowledgeTab === 'FAQs' ? ['Published', 'Draft'] : ['Active', 'Draft']).map(item => <option key={item}>{item}</option>)}</select><ChevronDown size={13} /></span></label><div className="drawer-grounding-note"><ShieldCheck size={14} /><span>AI responses will use this saved information as a source.</span></div><footer><button type="button" onClick={closeDrawer}>Cancel</button><button type="submit"><Check size={14} />Save {knowledgeTab === 'Products' ? 'product' : knowledgeTab === 'FAQs' ? 'FAQ' : 'policy'}</button></footer></form></aside></div>}
    {toast && <div className="settings-toast"><Check size={14} />{toast}</div>}
  </div>;
}

function OtherSettingsTab({ tab, notify }: { tab: Exclude<SettingsTab, 'Knowledge Base' | 'Integrations'>; notify: (message: string) => void }) {
  if (tab === 'Business Profile') return <div className="other-settings"><span className="settings-content-icon"><Globe2 size={15} /></span><h2>Business Profile</h2><p>Basic information about your Style Street workspace.</p><div className="profile-preview-grid"><label>Business name<input defaultValue="Style Street" /></label><label>Category<input defaultValue="Retail and clothing" /></label><label className="wide-setting">Description<textarea defaultValue="Contemporary clothing and festive wear for every occasion." /></label><label>Website<input placeholder="https://yourbusiness.com" /></label><label>Contact email<input placeholder="hello@stylestreet.in" /></label></div><button className="settings-save-button" onClick={() => notify('Business profile saved.')}>Save profile</button></div>;
  if (tab === 'Brand Tone') return <div className="other-settings"><span className="settings-content-icon"><Tag size={15} /></span><h2>Brand Tone</h2><p>Give your AI employees guidance on how Style Street sounds.</p><label className="brand-tone-field">Voice description<textarea defaultValue="Warm, confident and helpful. We celebrate personal style and make fashion feel welcoming." /></label><div className="tone-chip-list"><span>Warm & friendly</span><span>Confident</span><span>Festive</span><button onClick={() => notify('Tone preference added.')}>+ Add tone</button></div><button className="settings-save-button" onClick={() => notify('Brand tone saved.')}>Save brand tone</button></div>;
  if (tab === 'Team and Roles') return <div className="other-settings"><span className="settings-content-icon"><Users size={15} /></span><h2>Team and Roles</h2><p>Workspace members and their access levels.</p><div className="team-member-row"><span className="team-avatar">AV</span><span><b>Arjun Verma</b><small>arjun@stylestreet.in</small></span><span className="owner-role">Owner</span></div><div className="team-member-row"><span className="team-avatar team-avatar-teal">SM</span><span><b>Sneha Mehta</b><small>sneha@stylestreet.in</small></span><span className="member-role">Agent</span></div><button className="settings-invite-button" onClick={() => notify('Team invitations will be available in a future update.')}><Plus size={13} />Invite team member</button></div>;
  return <div className="other-settings"><span className="settings-content-icon"><Activity size={15} /></span><h2>Audit Log</h2><p>Recent activity recorded in the Style Street workspace.</p><div className="audit-log-list"><div><span><Users size={13} /></span><p><b>Arjun Verma</b> added product <b>Festive Kurta Set</b><small>Today · 10:12 AM</small></p></div><div><span><ShieldCheck size={13} /></span><p><b>Support Agent</b> escalated a question with no matching information<small>Today · 9:56 AM</small></p></div><div><span><Settings2 size={13} /></span><p><b>Arjun Verma</b> updated Support Agent permissions<small>Yesterday · 4:28 PM</small></p></div></div></div>;
}
