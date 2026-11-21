'use client';

import { FormEvent, useState } from 'react';
import { Bell, CalendarDays, Check, CheckCircle2, ChevronDown, Clock3, Plus, RefreshCw, Search, Sparkles, X } from 'lucide-react';
import './automations.css';

type ReminderStatus = 'Scheduled' | 'Completed' | 'Failed';
type Reminder = { id: number; title: string; lead: string; dueDate: string; dueTime: string; status: ReminderStatus; draftMessage: boolean; failure?: string };

const initialReminders: Reminder[] = [
  { id: 1, title: 'Follow up with Priya about the Diwali kurta set', lead: 'Priya Sharma', dueDate: 'Today, Nov 21', dueTime: '2:30 PM', status: 'Scheduled', draftMessage: true },
  { id: 2, title: 'Check navy kurta availability', lead: 'Rahul Mehta', dueDate: 'Today, Nov 21', dueTime: '5:30 PM', status: 'Scheduled', draftMessage: true },
  { id: 3, title: 'Reply about the return and exchange policy', lead: 'Kavita Desai', dueDate: 'Tomorrow, Nov 22', dueTime: '11:00 AM', status: 'Scheduled', draftMessage: false },
  { id: 4, title: 'Share new winter collection', lead: 'Ananya Kapoor', dueDate: 'Nov 24, 2026', dueTime: '2:00 PM', status: 'Scheduled', draftMessage: true },
  { id: 5, title: 'Send order update', lead: 'Vikram Nair', dueDate: 'Nov 20, 2026', dueTime: '4:30 PM', status: 'Completed', draftMessage: false },
  { id: 6, title: 'Prepare stock follow-up', lead: 'Meera Shah', dueDate: 'Nov 20, 2026', dueTime: '12:00 PM', status: 'Failed', draftMessage: true, failure: 'The reminder worker was unavailable.' },
];

const leads = ['Priya Sharma', 'Rahul Mehta', 'Kavita Desai', 'Ananya Kapoor', 'Vikram Nair', 'Meera Shah'];

export default function Automations() {
  const [reminders, setReminders] = useState(initialReminders);
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState('');
  const [lead, setLead] = useState('');
  const [dueDate, setDueDate] = useState('2026-11-22');
  const [dueTime, setDueTime] = useState('10:30');
  const [draftMessage, setDraftMessage] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All reminders');
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState('');

  const filtered = reminders.filter(reminder => (statusFilter === 'All reminders' || reminder.status === statusFilter) && `${reminder.title} ${reminder.lead}`.toLowerCase().includes(search.toLowerCase()));
  function notify(message: string) { setToast(message); window.setTimeout(() => setToast(''), 4500); }
  function createReminder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const date = new Date(`${dueDate}T00:00:00`).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
    const time = new Date(`2026-01-01T${dueTime}:00`).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' });
    const reminder: Reminder = { id: Date.now(), title: title.trim(), lead, dueDate: date, dueTime: time, status: 'Scheduled', draftMessage };
    setReminders(current => [reminder, ...current]);
    setShowCreate(false); setTitle(''); setLead(''); setDraftMessage(true);
    notify('Reminder scheduled successfully.');
  }
  function retry(id: number) { setReminders(current => current.map(item => item.id === id ? { ...item, status: 'Scheduled', failure: undefined } : item)); notify('Reminder job queued for retry.'); }
  function complete(id: number) { setReminders(current => current.map(item => item.id === id ? { ...item, status: 'Completed', failure: undefined } : item)); notify('Reminder marked as completed.'); }

  return <div className="automation-page">
    <div className="automation-page-heading"><div><span className="automation-eyebrow"><span /> STYLE STREET WORKSPACE</span><h1>Automations</h1><p>Keep important follow-ups from slipping through the cracks.</p></div><div className="automation-heading-actions"><button className="preview-toast-button" onClick={() => notify('Reminder due: Follow up with Priya about the Diwali kurta set')}><Bell size={14} />Preview notification</button><button className="automation-create-button" onClick={() => setShowCreate(true)}><Plus size={14} />Create reminder</button></div></div>

    <section className="reminders-section"><div className="reminders-section-heading"><div><h2>Follow-up reminders</h2><p>Scheduled tasks for you and your team.</p></div><div className="reminder-status-summary"><span><i className="summary-dot scheduled-dot" />{reminders.filter(item => item.status === 'Scheduled').length} scheduled</span><span><i className="summary-dot completed-dot" />{reminders.filter(item => item.status === 'Completed').length} completed</span><span><i className="summary-dot failed-dot" />{reminders.filter(item => item.status === 'Failed').length} failed</span></div></div>
      <div className="reminders-toolbar"><label className="automation-search"><Search size={14} /><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search reminders or leads..." /></label><label className="automation-status-filter"><span>Status</span><select value={statusFilter} onChange={event => setStatusFilter(event.target.value)}><option>All reminders</option><option>Scheduled</option><option>Completed</option><option>Failed</option></select><ChevronDown size={12} /></label><span className="reminder-count">{filtered.length} reminders</span></div>
      <div className="reminder-table-wrap"><table className="reminder-table"><thead><tr><th>Title</th><th>Linked lead</th><th>Due date & time</th><th>Status</th><th>Action</th></tr></thead><tbody>{filtered.map(reminder => <tr key={reminder.id}><td><span className="reminder-title-cell"><span className={`reminder-title-icon ${reminder.status === 'Failed' ? 'reminder-icon-failed' : ''}`}><Clock3 size={14} /></span><span><b>{reminder.title}</b>{reminder.failure && <small>{reminder.failure}</small>}{reminder.draftMessage && <i><Sparkles size={10} />Draft message for approval</i>}</span></span></td><td><span className="reminder-lead"><span>{reminder.lead.split(/\s+/).map(part => part[0]).join('').slice(0, 2).toUpperCase()}</span>{reminder.lead}</span></td><td><span className="reminder-datetime"><b>{reminder.dueDate}</b><small>{reminder.dueTime}</small></span></td><td><span className={`reminder-status-badge status-${reminder.status.toLowerCase()}`}><i />{reminder.status}</span></td><td>{reminder.status === 'Failed' ? <button className="retry-reminder" onClick={() => retry(reminder.id)}><RefreshCw size={12} />Retry</button> : reminder.status === 'Scheduled' ? <button className="complete-reminder" onClick={() => complete(reminder.id)}><CheckCircle2 size={13} />Complete</button> : <span className="completed-label"><Check size={12} />Done</span>}</td></tr>)}{filtered.length === 0 && <tr><td colSpan={5} className="reminders-empty">No reminders match your search.</td></tr>}</tbody></table></div><footer className="reminder-table-footer"><span>Showing {filtered.length} of {reminders.length} reminders</span><span><span className="queue-health-dot" />Reminder queue operational</span></footer>
    </section>

    {showCreate && <div className="automation-modal-overlay" onClick={() => setShowCreate(false)}><form className="create-reminder-modal" onSubmit={createReminder} onClick={event => event.stopPropagation()}><header className="create-reminder-header"><span><CalendarDays size={16} /></span><button type="button" onClick={() => setShowCreate(false)} aria-label="Close"><X size={18} /></button></header><h2>Create reminder</h2><p>Choose what to follow up on and when it’s due.</p><label className="create-field">Title<input autoFocus required value={title} onChange={event => setTitle(event.target.value)} placeholder="e.g. Follow up about the new collection" /></label><label className="create-field">Linked lead<select required value={lead} onChange={event => setLead(event.target.value)}><option value="" disabled>Select a lead</option>{leads.map(item => <option key={item}>{item}</option>)}</select><ChevronDown size={13} /></label><div className="create-datetime-fields"><label className="create-field">Due date<input type="date" required value={dueDate} onChange={event => setDueDate(event.target.value)} /></label><label className="create-field">Time<input type="time" required value={dueTime} onChange={event => setDueTime(event.target.value)} /></label></div><label className="draft-followup-toggle"><span><b>Draft a follow-up message for my approval</b><small>The AI employee prepares a message. You review it before sending.</small></span><input type="checkbox" checked={draftMessage} onChange={event => setDraftMessage(event.target.checked)} /><i /></label><div className="create-reminder-actions"><button type="button" onClick={() => setShowCreate(false)}>Cancel</button><button type="submit"><Plus size={13} />Create reminder</button></div></form></div>}
    {toast && <div className="reminder-notification-toast"><span><Bell size={15} /></span><div><b>Reminder notification</b><small>{toast}</small></div><button onClick={() => setToast('')} aria-label="Dismiss notification"><X size={14} /></button></div>}
  </div>;
}
