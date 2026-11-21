'use client';

import { useMemo, useState } from 'react';
import AIEmployees from './components/AIEmployees';
import TaskHistory from './components/TaskHistory';
import Inbox from './components/Inbox';
import WorkspaceScreens from './components/WorkspaceScreens';
import MarketingScreens from './components/MarketingScreens';
import Automations from './components/Automations';
import Analytics from './components/Analytics';
import SettingsIntegrations from './components/SettingsIntegrations';
import {
  Activity, ArrowDownRight, ArrowRight, ArrowUpRight, Bell, Bot, CalendarDays,
  Check, CheckCheck, ChevronDown, CircleHelp, Clock3, Command, ContactRound,
  FileText, Filter, Headphones, IndianRupee, LayoutDashboard, ListTodo, Menu,
  MessageCircle, MoreHorizontal, Plus, Search, Send, Settings2, ShoppingBag,
  Sparkles, TrendingUp, Users, X, Megaphone, BarChart3, CheckCircle2,
} from 'lucide-react';

const navigation = [
  { label: 'Overview', icon: LayoutDashboard }, { label: 'AI Employees', icon: Bot },
  { label: 'Inbox', icon: MessageCircle, count: '4' }, { label: 'Contacts', icon: ContactRound },
  { label: 'CRM & Leads', icon: Users }, { label: 'Marketing Studio', icon: Megaphone },
  { label: 'Campaigns', icon: Send }, { label: 'Automations', icon: ListTodo },
  { label: 'Analytics', icon: BarChart3 }, { label: 'Settings & Integrations', icon: Settings2 },
];

type TaskStatus = 'Draft' | 'Needs Review' | 'Approved' | 'Completed' | 'Failed' | 'Escalated';
const initialTasks: { name: string; detail: string; agent: string; time: string; status: TaskStatus; icon: typeof Sparkles; tone: string }[] = [
  { name: 'Diwali collection launch', detail: 'Instagram caption · New arrivals', agent: 'Marketing', time: '10:42 AM', status: 'Needs Review', icon: Megaphone, tone: 'purple' },
  { name: 'Response to Priya Sharma', detail: 'Product enquiry · Website chat', agent: 'Support', time: '10:18 AM', status: 'Needs Review', icon: Headphones, tone: 'teal' },
  { name: 'Follow-up reminder created', detail: 'Rahul Mehta · Interested lead', agent: 'Sales', time: '9:56 AM', status: 'Completed', icon: Users, tone: 'blue' },
  { name: 'Weekend sale post ideas', detail: '3 content ideas generated', agent: 'Marketing', time: '9:30 AM', status: 'Draft', icon: Sparkles, tone: 'amber' },
];

const initialLeads = [
  { name: 'Ananya Kapoor', initials: 'AK', color: 'rose', interest: 'Festive wear collection', stage: 'Qualified', value: '₹8,500', source: 'Instagram' },
  { name: 'Rahul Mehta', initials: 'RM', color: 'blue', interest: 'Men’s kurta set', stage: 'Contacted', value: '₹4,200', source: 'Website chat' },
  { name: 'Priya Sharma', initials: 'PS', color: 'green', interest: 'Women’s ethnic wear', stage: 'New lead', value: '₹6,800', source: 'Website chat' },
];

function Status({ value }: { value: TaskStatus }) { return <span className={`status status-${value.toLowerCase().replaceAll(' ', '-')}`}><i />{value}</span>; }

export default function Home() {
  const [active, setActive] = useState('Overview');
  const [tasks, setTasks] = useState(initialTasks);
  const [leads, setLeads] = useState(initialLeads);
  const [query, setQuery] = useState('');
  const [mobileMenu, setMobileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [toast, setToast] = useState('');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskText, setTaskText] = useState('');
  const [period, setPeriod] = useState('Last 7 days');

  const filteredLeads = useMemo(() => leads.filter(l => `${l.name} ${l.interest} ${l.stage}`.toLowerCase().includes(query.toLowerCase())), [leads, query]);
  function notify(message: string) { setToast(message); window.setTimeout(() => setToast(''), 2600); }
  function updateTask(i: number, status: TaskStatus) { setTasks(old => old.map((t, index) => index === i ? { ...t, status } : t)); notify(status === 'Approved' ? 'Approved. This draft is ready for your next step.' : status === 'Draft' ? 'Draft updated.' : 'Item rejected.'); }
  function createTask(e: React.FormEvent) { e.preventDefault(); if (!taskText.trim()) return; setTasks(old => [{ name: taskText, detail: 'New task · Added just now', agent: 'Marketing', time: 'Just now', status: 'Draft', icon: Sparkles, tone: 'purple' }, ...old]); setTaskText(''); setShowTaskModal(false); notify('Your task was added to the AI activity queue.'); }
  function addLead() { const name = window.prompt('What is the customer’s name?'); if (!name?.trim()) return; setLeads(old => [{ name: name.trim(), initials: name.trim().split(/\s+/).map(v => v[0]).join('').slice(0, 2).toUpperCase(), color: 'purple', interest: 'New enquiry', stage: 'New lead', value: '—', source: 'Manual entry' }, ...old]); notify('New lead added to your pipeline.'); }

  return <main className="shell">
    <aside className={`sidebar ${mobileMenu ? 'sidebar-open' : ''}`}>
      <a className="brand" href="#overview" onClick={() => setActive('Overview')}><span className="brand-mark"><Command size={20} strokeWidth={2.5} /></span><span className="brand-name">business<span>OS</span></span></a>
      <button className="workspace"><span className="workspace-logo">S</span><span className="workspace-copy"><b>Style Street</b><small>Free plan</small></span><ChevronDown size={16} /></button>
      <div className="nav-caption">WORKSPACE</div>
      <nav>{navigation.map(({ label, icon: Icon, count }) => <button key={label} onClick={() => { setActive(label); setMobileMenu(false); }} className={`nav-item ${active === label || (active === 'AI Task History' && label === 'AI Employees') ? 'nav-active' : ''}`}><Icon size={18} strokeWidth={1.8} /><span>{label}</span>{count && <span className="nav-count">{count}</span>}</button>)}</nav>
      <div className="sidebar-bottom"><div className="help-card"><span className="help-icon"><CircleHelp size={16} /></span><div><b>Need a hand?</b><small>Visit our help center</small></div><ArrowUpRight size={15} /></div><button className="profile"><span className="avatar owner-avatar">AV</span><span className="profile-copy"><b>Arjun Verma</b><small>Owner</small></span><MoreHorizontal size={18} /></button></div>
    </aside>
    {mobileMenu && <button className="mobile-scrim" aria-label="Close menu" onClick={() => setMobileMenu(false)} />}
    <section className="main-area">
      <header className="topbar"><button className="mobile-menu-button icon-button" onClick={() => setMobileMenu(true)} aria-label="Open menu"><Menu size={20} /></button><div className="breadcrumbs"><span>Style Street</span><span className="crumb-slash">/</span><b>{active}</b></div><div className="topbar-actions"><label className="search-box"><Search size={16} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search anything..." /><kbd>⌘ K</kbd></label><span className="top-divider" /><div className="notification-wrap"><button className={`icon-button notification-button ${showNotifications ? 'icon-selected' : ''}`} aria-label="Notifications" onClick={() => setShowNotifications(!showNotifications)}><Bell size={19} /><i /></button>{showNotifications && <div className="notification-popover"><b>Notifications</b><p><span className="notif-dot" />2 AI drafts need your review</p><p><span className="notif-dot teal-dot" />Priya Sharma sent a new message</p><button onClick={() => { setShowNotifications(false); setActive('Inbox'); }}>Open inbox <ArrowRight size={13} /></button></div>}</div><button className="top-user"><span className="avatar owner-avatar">AV</span><span>Owner</span><ChevronDown size={14} /></button></div></header>
      <div className="page-content">
        {active === 'Overview' ? <>
          <div className="welcome-row"><div><div className="eyebrow"><span className="live-dot" /> YOUR BUSINESS AT A GLANCE</div><h1>Good afternoon, Arjun <span className="wave">✳</span></h1><p className="page-subtitle">Here’s what’s happening with your business today.</p></div><button className="date-button" onClick={() => setPeriod(period === 'Last 7 days' ? 'Last 30 days' : 'Last 7 days')}><CalendarDays size={16} />{period}<ChevronDown size={14} /></button></div>
          <div className="stats-grid stats-six">
            {[
              { label: 'Customers', value: '1,284', icon: Users, tone: 'lavender', change: '+12.8%', up: true },
              { label: 'Active Leads', value: String(leads.length + 45), icon: TrendingUp, tone: 'mint', change: '+8.2%', up: true },
              { label: 'Open Conversations', value: '4', icon: MessageCircle, tone: 'sky', change: '+18.4%', up: true },
              { label: 'AI Tasks', value: String(tasks.length + 38), icon: Sparkles, tone: 'peach', change: '+14.6%', up: true },
              { label: 'Pending Approvals', value: String(tasks.filter(t => t.status === 'Needs Review').length), icon: CheckCircle2, tone: 'lavender', change: 'Needs review', up: false },
              { label: 'Reminders Due', value: '3', icon: Clock3, tone: 'mint', change: 'Today', up: false },
            ].map(item => <article className="stat-card" key={item.label}><div className="stat-top"><span className={`stat-icon ${item.tone}`}><item.icon size={17} /></span><span className="stat-label">{item.label}</span></div><div className="stat-number">{item.value}</div><div className="stat-foot"><span className={item.up ? 'trend-up' : 'stat-context'}>{item.up && <ArrowUpRight size={13} />}{item.change}</span><span>{item.up ? 'vs. last 7 days' : item.label === 'Pending Approvals' ? 'across your team' : 'to follow up'}</span></div></article>)}
          </div>
          <div className="overview-grid overview-top-grid">
            <section className="panel pipeline-panel"><div className="panel-header"><div><h2>Lead pipeline</h2><p>Know what’s moving and what needs a nudge.</p></div><button className="text-link" onClick={() => setActive('CRM & Leads')}>View CRM <ArrowRight size={14} /></button></div><div className="pipeline-total"><span><b>48</b> active leads</span><span className="pipeline-value"><IndianRupee size={14} />2.46L pipeline value</span></div><div className="pipeline-lanes">{[{ name: 'New lead', count: 16, value: '₹82,400', color: 'lane-purple' }, { name: 'Contacted', count: 21, value: '₹1,08,600', color: 'lane-blue' }, { name: 'Qualified', count: 11, value: '₹55,000', color: 'lane-teal' }].map(lane => <div className="pipeline-lane" key={lane.name}><div className="lane-heading"><span className={`lane-dot ${lane.color}`} />{lane.name}<b>{lane.count}</b></div><div className="lane-track"><i className={lane.color} style={{ width: `${Math.max(20, lane.count * 3)}%` }} /></div><span className="lane-value">{lane.value}</span></div>)}</div><button className="panel-footer-link" onClick={() => setActive('CRM & Leads')}>Open lead pipeline <ArrowRight size={14} /></button></section>
            <section className="panel chart-panel"><div className="panel-header"><div><h2>Conversations over time</h2><p>Customer conversations across channels</p></div><button className="select-small" onClick={() => setPeriod(period === 'Last 7 days' ? 'Last 30 days' : 'Last 7 days')}>{period}<ChevronDown size={13} /></button></div><div className="chart-legend"><span><i className="legend-indigo" />Website chat</span><span><i className="legend-teal" />Social inbox</span></div><div className="chart-area"><div className="y-axis"><span>40</span><span>30</span><span>20</span><span>10</span><span>0</span></div><div className="chart-plot"><div className="chart-gridline"/><div className="chart-gridline"/><div className="chart-gridline"/><div className="chart-gridline"/><svg className="chart-svg" viewBox="0 0 680 180" preserveAspectRatio="none"><defs><linearGradient id="conversationFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#7164ee" stopOpacity=".16"/><stop offset="1" stopColor="#7164ee" stopOpacity="0"/></linearGradient></defs><path d="M0 130 C35 125 36 102 78 108 S126 77 165 91 S207 57 251 73 S295 41 339 62 S375 26 423 45 S469 55 504 34 S552 49 590 24 S643 37 680 13 V180 H0Z" fill="url(#conversationFill)"/><path d="M0 130 C35 125 36 102 78 108 S126 77 165 91 S207 57 251 73 S295 41 339 62 S375 26 423 45 S469 55 504 34 S552 49 590 24 S643 37 680 13" fill="none" stroke="#6658e8" strokeWidth="3" strokeLinecap="round"/><path d="M0 154 C45 148 49 138 87 143 S127 128 166 133 S207 111 251 119 S295 99 338 111 S385 91 422 103 S470 86 505 99 S557 74 591 88 S644 68 680 76" fill="none" stroke="#2cb9a6" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="5 6"/></svg><div className="x-axis"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></div></div></div></section>
          </div>
          <div className="overview-grid overview-bottom-grid">
            <section className="panel activity-panel"><div className="panel-header"><div><h2>AI Activity</h2><p>Recent work from your AI employees.</p></div><button className="text-link" onClick={() => setActive('AI Employees')}>View all <ArrowRight size={14} /></button></div><div className="activity-list">{tasks.slice(0, 5).map((task, i) => { const Icon = task.icon; return <div className="activity-row" key={`${task.name}-${i}`}><span className={`activity-icon ${task.tone}`}><Icon size={16} /></span><div className="activity-copy"><div className="activity-title">{task.name}</div><div className="activity-detail">{task.agent} agent<span className="activity-separator">·</span>{task.detail}</div></div><div className="activity-end"><Status value={task.status} /><span className="activity-time">{task.time}</span></div></div>; })}</div></section>
            <section className="panel approvals-panel"><div className="panel-header"><div><h2>Pending Approvals</h2><p>Review AI drafts before they go out.</p></div><span className="approval-count">{tasks.filter(t => t.status === 'Needs Review').length} to review</span></div><div className="approval-list">{tasks.map((task, i) => task.status === 'Needs Review' ? <div className="approval-row" key={`${task.name}-${i}`}><div className="approval-copy"><b>{task.name}</b><span>{task.agent} agent · {task.detail}</span><small>Approval required</small></div><div className="approval-actions"><button className="approve-button" onClick={() => updateTask(i, 'Approved')}><Check size={13} />Approve</button><button className="reject-button" onClick={() => updateTask(i, 'Failed')}>Reject</button></div></div> : null)}{tasks.every(t => t.status !== 'Needs Review') && <div className="empty-approvals"><span><Check size={16} /></span><b>You’re all caught up</b><small>New AI drafts will show up here for review.</small></div>}</div><button className="panel-footer-link" onClick={() => setActive('AI Task History')}>View AI task history <ArrowRight size={14} /></button></section>
          </div>
          <section className="panel today-reminders"><div className="panel-header"><div><h2>Today’s Reminders</h2><p>Follow-ups and tasks on your calendar.</p></div><button className="text-link" onClick={() => setActive('Automations')}>View all reminders <ArrowRight size={14} /></button></div><div className="today-reminder-list"><div className="today-reminder"><span className="today-time">10:30 <small>AM</small></span><span className="reminder-marker marker-purple"/><span className="today-copy"><b>Follow up with Rahul Mehta</b><small>Men’s kurta set · Sales follow-up</small></span><span className="reminder-tag">Sales</span></div><div className="today-reminder"><span className="today-time">2:00 <small>PM</small></span><span className="reminder-marker marker-teal"/><span className="today-copy"><b>Reply to Kavita Desai</b><small>Return policy question · Inbox</small></span><span className="reminder-tag tag-teal">Support</span></div><div className="today-reminder"><span className="today-time">4:30 <small>PM</small></span><span className="reminder-marker marker-orange"/><span className="today-copy"><b>Review Diwali campaign draft</b><small>New collection promotion · Needs approval</small></span><span className="reminder-tag tag-orange">Marketing</span></div></div></section>
          <div className="metrics-note"><span>i</span>Metrics reflect saved business records.</div>
          <footer className="page-footer"><span>© 2026 AI Business OS</span><span><i className="footer-status" /> All systems operational</span><button onClick={() => notify('Help center opened.')}>Help center <ArrowUpRight size={12} /></button></footer>
        </> : active === 'AI Employees' ? <AIEmployees onViewHistory={() => setActive('AI Task History')} /> : active === 'AI Task History' ? <TaskHistory onBack={() => setActive('AI Employees')} /> : active === 'Inbox' ? <Inbox /> : active === 'Contacts' || active === 'CRM & Leads' ? <WorkspaceScreens screen={active} /> : active === 'Marketing Studio' || active === 'Campaigns' ? <MarketingScreens screen={active} /> : active === 'Automations' ? <Automations /> : active === 'Analytics' ? <Analytics /> : active === 'Settings & Integrations' ? <SettingsIntegrations /> : <section className="module-view"><div className="eyebrow"><span className="live-dot" /> STYLE STREET WORKSPACE</div><h1>{active}</h1><p className="page-subtitle">Your {active.toLowerCase()} workspace, all in one place.</p><div className="module-placeholder"><span className="module-symbol"><Megaphone /></span><h2>{`Welcome to ${active}`}</h2><p>Your workspace is ready. Choose an action to get started.</p><div className="module-actions"><button className="primary-button" onClick={() => setShowTaskModal(true)}><Plus size={16} />Create new</button><button className="secondary-button" onClick={() => setActive('Overview')}>Back to overview</button></div></div></section>}
      </div>
      <button className="quick-action" onClick={() => setShowTaskModal(true)}><Sparkles size={16} /><span>Ask AI</span></button>
    </section>
    {showTaskModal && <div className="modal-scrim" onClick={() => setShowTaskModal(false)}><form className="task-modal" onSubmit={createTask} onClick={e => e.stopPropagation()}><div className="modal-top"><span className="modal-spark"><Sparkles size={18} /></span><button type="button" className="icon-button" onClick={() => setShowTaskModal(false)} aria-label="Close"><X size={18} /></button></div><h2>What can AI help with?</h2><p>Tell your Marketing employee what you’d like to create. You’ll review anything before it goes out.</p><label className="task-label" htmlFor="task">Your request</label><textarea id="task" autoFocus value={taskText} onChange={e => setTaskText(e.target.value)} placeholder="e.g. Write an Instagram caption for our new festive collection..." /><div className="modal-note"><CheckCircle2 size={14} /> Your AI draft will need your approval before sharing.</div><div className="modal-buttons"><button type="button" className="secondary-button" onClick={() => setShowTaskModal(false)}>Cancel</button><button type="submit" className="primary-button" disabled={!taskText.trim()}><Sparkles size={15} />Create task</button></div></form></div>}
    {toast && <div className="toast"><CheckCheck size={16} />{toast}</div>}
  </main>;
}
