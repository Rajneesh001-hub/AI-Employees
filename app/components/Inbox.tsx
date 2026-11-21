'use client';

import { useMemo, useState } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, Bell, Check, CheckCheck, ChevronDown, Clock3, Globe2, Headphones, Instagram, LockKeyhole, MessageCircle, MoreHorizontal, Phone, Plus, Search, Send, UserRound, Users, X } from 'lucide-react';
import './inbox.css';

type ConversationStatus = 'Open' | 'AI Active' | 'Waiting for Human' | 'Resolved';
type Channel = 'Website Chat' | 'WhatsApp' | 'Instagram';
type ThreadMessage = { sender: 'customer' | 'ai' | 'human'; author: string; text: string; time: string };
type Conversation = { id: number; name: string; initials: string; color: string; preview: string; time: string; channel: Channel; status: ConversationStatus; simulated: boolean; phone: string; email: string; source: string; leadStage: string; notes: string; messages: ThreadMessage[]; suggestion: string; basedOn: string };

const seedConversations: Conversation[] = [
  { id: 1, name: 'Priya Sharma', initials: 'PS', color: 'rose', preview: 'Can I return this kurta if it doesn’t fit?', time: '10:42 AM', channel: 'Website Chat', status: 'AI Active', simulated: false, phone: '+91 98765 43210', email: 'priya.sharma@email.com', source: 'Website chat', leadStage: 'Qualified', notes: 'Interested in the festive kurta collection. Prefers evening follow-up.', messages: [
    { sender: 'customer', author: 'Priya Sharma', text: 'Hi! I just ordered a kurta from your festive collection. Can I return it if the size doesn’t fit?', time: '10:38 AM' },
    { sender: 'ai', author: 'Support Agent', text: 'Hi Priya! If the item doesn’t fit, you can request an exchange within 7 days of delivery, as long as it’s unused and has its original tags. Sale items aren’t eligible for a refund.', time: '10:39 AM' },
    { sender: 'human', author: 'Arjun Verma', text: 'I can also help you find the right size if you’d like. Just let me know which style you ordered.', time: '10:42 AM' },
  ], suggestion: 'Hi Priya! You can exchange your kurta within 7 days of delivery if it’s unused and has the original tags. Sale items aren’t eligible for a refund. If you share the style and size you ordered, I can help you find the best fit.', basedOn: 'Return Policy' },
  { id: 2, name: 'Rahul Mehta', initials: 'RM', color: 'blue', preview: 'Do you have the navy kurta in size L?', time: '10:18 AM', channel: 'WhatsApp', status: 'Open', simulated: true, phone: '+91 98201 23456', email: 'rahul.mehta@email.com', source: 'Simulated WhatsApp', leadStage: 'Contacted', notes: 'Asked about the men’s festive kurta. Follow up with size availability.', messages: [{ sender: 'customer', author: 'Rahul Mehta', text: 'Do you have the navy kurta in size L?', time: '10:18 AM' }, { sender: 'ai', author: 'Support Agent', text: 'I’m checking the product information we have. I’ll flag this for the team if the size isn’t listed.', time: '10:19 AM' }], suggestion: 'Hi Rahul! I’m checking the latest size availability for the navy kurta. I’ll get back to you as soon as I confirm it with our team.', basedOn: 'Product Catalogue' },
  { id: 3, name: 'Kavita Desai', initials: 'KD', color: 'purple', preview: 'I received the wrong item in my order.', time: '9:56 AM', channel: 'Instagram', status: 'Waiting for Human', simulated: true, phone: '+91 99876 54321', email: 'kavita.desai@email.com', source: 'Simulated Instagram', leadStage: 'New lead', notes: 'Order issue reported. Needs a human to review order details.', messages: [{ sender: 'customer', author: 'Kavita Desai', text: 'I received the wrong item in my order and I’m really disappointed.', time: '9:56 AM' }, { sender: 'ai', author: 'Support Agent', text: 'I’m sorry this happened. I’m bringing in a team member who can review your order and help make this right.', time: '9:57 AM' }], suggestion: 'Hi Kavita, I’m sorry you received the wrong item. I’m reviewing this with our team now so we can help resolve it. Could you share your order number?', basedOn: 'Order Support FAQ' },
  { id: 4, name: 'Aarav Patel', initials: 'AP', color: 'green', preview: 'Thanks, that’s all I needed!', time: 'Yesterday', channel: 'Website Chat', status: 'Resolved', simulated: false, phone: '+91 98760 11223', email: 'aarav.patel@email.com', source: 'Website chat', leadStage: 'New lead', notes: 'Asked about store hours. Enquiry resolved.', messages: [{ sender: 'customer', author: 'Aarav Patel', text: 'What time does your store close today?', time: 'Yesterday' }, { sender: 'ai', author: 'Support Agent', text: 'Our store is open until 9:00 PM today. We’d love to see you!', time: 'Yesterday' }, { sender: 'customer', author: 'Aarav Patel', text: 'Thanks, that’s all I needed!', time: 'Yesterday' }], suggestion: 'Thanks for reaching out, Aarav. We’re here if you have any other questions!', basedOn: 'Store Information' },
];

const statusClass: Record<ConversationStatus, string> = { Open: 'conversation-open', 'AI Active': 'conversation-ai-active', 'Waiting for Human': 'conversation-waiting', Resolved: 'conversation-resolved' };
const statusFilters = ['All', 'Open', 'AI Active', 'Waiting for Human', 'Resolved'];

function ChannelIcon({ channel, size = 13 }: { channel: Channel; size?: number }) {
  if (channel === 'WhatsApp') return <MessageCircle size={size} />;
  if (channel === 'Instagram') return <Instagram size={size} />;
  return <Globe2 size={size} />;
}

export default function Inbox() {
  const [conversations, setConversations] = useState(seedConversations);
  const [selectedId, setSelectedId] = useState(1);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [reply, setReply] = useState(seedConversations[0].suggestion);
  const [editing, setEditing] = useState(false);
  const [humanTakeover, setHumanTakeover] = useState(false);
  const [showReminder, setShowReminder] = useState(false);
  const [reminderText, setReminderText] = useState('Follow up with customer');
  const [toast, setToast] = useState('');

  const selected = conversations.find(item => item.id === selectedId) ?? conversations[0];
  const filtered = useMemo(() => conversations.filter(item => (filter === 'All' || item.status === filter) && `${item.name} ${item.preview}`.toLowerCase().includes(search.toLowerCase())), [conversations, filter, search]);

  function notify(message: string) { setToast(message); window.setTimeout(() => setToast(''), 2200); }
  function chooseConversation(item: Conversation) { setSelectedId(item.id); setReply(item.suggestion); setEditing(false); setHumanTakeover(false); }
  function sendReply() {
    if (!reply.trim()) return;
    const time = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    setConversations(current => current.map(item => item.id === selected.id ? { ...item, status: 'Open', messages: [...item.messages, { sender: 'human', author: 'Arjun Verma', text: reply.trim(), time }], preview: reply.trim() } : item));
    setReply(''); setEditing(false); setHumanTakeover(true); notify('Reply sent in this inbox prototype.');
  }
  function takeOver() {
    setConversations(current => current.map(item => item.id === selected.id ? { ...item, status: 'Open' } : item));
    setHumanTakeover(true); notify('You’re now handling this conversation.');
  }
  function createReminder(event: React.FormEvent<HTMLFormElement>) { event.preventDefault(); setShowReminder(false); notify(`Reminder created: ${reminderText}`); }

  return <div className="inbox-page">
    <div className="inbox-page-heading"><div><span className="inbox-eyebrow"><span /> CUSTOMER CONVERSATIONS</span><h1>Inbox</h1><p>Keep every customer conversation moving in the right direction.</p></div><button className="inbox-top-action" onClick={() => notify('Connect a channel from Settings & Integrations.')}><Plus size={14} />Add channel</button></div>
    <section className="inbox-workspace">
      <aside className="conversation-column"><div className="conversation-column-head"><div><h2>Conversations</h2><span>{conversations.filter(item => item.status !== 'Resolved').length} open</span></div><button className="conversation-options" aria-label="Conversation options" onClick={() => notify('Inbox options')}><MoreHorizontal size={17} /></button></div><label className="conversation-search"><Search size={14} /><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search conversations" /></label><div className="conversation-filters">{statusFilters.map(item => <button key={item} className={filter === item ? 'filter-active' : ''} onClick={() => setFilter(item)}>{item === 'All' ? 'All' : item}</button>)}</div><div className="conversation-list">{filtered.map(item => <button key={item.id} className={`conversation-item ${selectedId === item.id ? 'conversation-selected' : ''}`} onClick={() => chooseConversation(item)}><span className={`conversation-avatar avatar-${item.color}`}>{item.initials}<i><ChannelIcon channel={item.channel} size={9} /></i></span><span className="conversation-main"><span className="conversation-name-row"><b>{item.name}</b><small>{item.time}</small></span><span className="conversation-preview">{item.preview}</span><span className="conversation-meta-row"><span className={`conversation-status ${statusClass[item.status]}`}><i />{item.status}</span>{item.simulated && <span className="simulated-tag">Simulated</span>}</span></span></button>)}{filtered.length === 0 && <div className="conversation-no-results">No conversations found.</div>}</div><div className="channel-legend"><span><Globe2 size={12} />Website Chat</span><span className="channel-sim-note">WhatsApp and Instagram are simulated</span></div></aside>

      <section className="message-column"><header className="message-column-header"><div className={`conversation-avatar large-avatar avatar-${selected.color}`}>{selected.initials}<i><ChannelIcon channel={selected.channel} size={10} /></i></div><div className="message-contact"><b>{selected.name}</b><span><ChannelIcon channel={selected.channel} size={12} />{selected.channel}{selected.simulated && <i className="simulated-tag">Simulated</i>}</span></div><span className={`conversation-status header-status ${statusClass[selected.status]}`}><i />{selected.status}</span><button className="message-header-icon" onClick={() => notify('Conversation marked as resolved.')} aria-label="Resolve conversation"><CheckCheck size={16} /></button><button className="message-header-icon" onClick={() => notify('More conversation actions')} aria-label="More actions"><MoreHorizontal size={17} /></button></header>
        <div className="thread-day"><span />Today<span /></div><div className="message-thread">{selected.messages.map((message, index) => <div key={`${selected.id}-${index}`} className={`thread-message thread-${message.sender}`}><span className={`thread-avatar ${message.sender}`}>{message.sender === 'customer' ? selected.initials : message.sender === 'ai' ? <Headphones size={13} /> : 'AV'}</span><div className="thread-message-body"><div className="thread-author-row"><b>{message.author}</b><time>{message.time}</time>{message.sender === 'ai' && <span className="ai-generated-tag">AI</span>}</div><div className="thread-bubble">{message.text}</div></div></div>)}</div>
        <div className="suggested-reply"><div className="suggested-title"><span><Headphones size={14} />AI suggested reply</span><button onClick={() => setReply(selected.suggestion)}><ArrowDown size={13} />Use draft</button></div><div className="suggested-copy">{selected.suggestion}</div><div className="suggested-source"><span>Based on:</span><button onClick={() => notify(`Source: ${selected.basedOn}`)}><FileReferenceIcon />{selected.basedOn}<ArrowRight size={11} /></button></div></div>
        <div className="reply-composer"><div className="composer-label"><span>{humanTakeover ? 'You’re handling this conversation' : 'Reply to customer'}</span><span className="approval-hint"><LockKeyhole size={11} />Review before sending</span></div>{editing ? <textarea value={reply} onChange={event => setReply(event.target.value)} aria-label="Edit suggested reply" /> : <div className="reply-preview">{reply || 'Choose an AI suggestion or type your reply...'}</div>}<div className="composer-actions"><button className="takeover-button" onClick={takeOver}><UserRound size={13} />{humanTakeover ? 'You have taken over' : 'Take over from AI'}</button><div><button className="edit-reply-button" onClick={() => setEditing(!editing)}>{editing ? 'Done editing' : 'Edit'}</button><button className="send-reply-button" onClick={sendReply} disabled={!reply.trim()}><Send size={13} />Send</button></div></div></div>
      </section>

      <aside className="customer-column"><div className="customer-panel-heading"><h2>Customer details</h2><button aria-label="More customer actions" onClick={() => notify('Customer options')}><MoreHorizontal size={17} /></button></div><div className="customer-profile"><span className={`customer-avatar avatar-${selected.color}`}>{selected.initials}</span><b>{selected.name}</b><span className="customer-since">Customer since Nov 2026</span></div><div className="customer-fields"><div><span><Phone size={13} />Phone</span><b>{selected.phone}</b></div><div><span><MessageCircle size={13} />Email</span><b>{selected.email}</b></div><div><span><Globe2 size={13} />Source</span><b>{selected.source}</b></div></div><div className="customer-section"><div className="customer-section-heading"><b>Linked lead</b><button onClick={() => notify('Opening lead record')}><ArrowRight size={13} /></button></div><div className="linked-lead"><span className="linked-lead-icon"><Users size={14} /></span><span><b>{selected.name}</b><small>Clothing · Style Street</small></span><span className={`lead-stage-pill stage-${selected.leadStage.toLowerCase().replaceAll(' ', '-')}`}>{selected.leadStage}</span></div></div><div className="customer-section notes-section"><div className="customer-section-heading"><b>Notes</b><button onClick={() => notify('Notes editor opened')}><MoreHorizontal size={15} /></button></div><p>{selected.notes}</p><button className="add-note-button" onClick={() => notify('Add a note to this customer')}><Plus size={12} />Add note</button></div><div className="customer-reminder-card"><span className="reminder-card-icon"><Bell size={15} /></span><div><b>Need to follow up?</b><small>Create a reminder for this customer.</small></div><button aria-label="Create reminder" onClick={() => setShowReminder(true)}><Plus size={14} /><span>Create reminder</span></button></div><div className="customer-privacy"><LockKeyhole size={12} />Customer details are private to this workspace.</div></aside>
    </section>
    {showReminder && <div className="inbox-modal-overlay" onClick={() => setShowReminder(false)}><form className="reminder-modal" onSubmit={createReminder} onClick={event => event.stopPropagation()}><div className="reminder-modal-head"><span><Clock3 size={16} /></span><button type="button" onClick={() => setShowReminder(false)} aria-label="Close"><X size={17} /></button></div><h2>Create reminder</h2><p>Set a follow-up for {selected.name}.</p><label>Reminder title<input value={reminderText} onChange={event => setReminderText(event.target.value)} required /></label><div className="reminder-date-inputs"><label>Date<input type="date" defaultValue="2026-11-22" /></label><label>Time<input type="time" defaultValue="10:30" /></label></div><div className="reminder-modal-actions"><button type="button" onClick={() => setShowReminder(false)}>Cancel</button><button type="submit"><Check size={13} />Create reminder</button></div></form></div>}
    {toast && <div className="inbox-toast"><Check size={15} />{toast}</div>}
  </div>;
}

function FileReferenceIcon() { return <span className="file-reference-icon">▤</span>; }
