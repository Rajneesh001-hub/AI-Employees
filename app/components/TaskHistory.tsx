'use client';

import { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Bot, CalendarDays, Check, Clock3, FileText, Filter, Headphones, Megaphone, Search, ShieldAlert, Users, X } from 'lucide-react';
import './task-history.css';

type AgentName = 'Marketing' | 'Sales' | 'Support';
type TaskStatus = 'Draft' | 'Needs Review' | 'Approved' | 'Completed' | 'Failed' | 'Escalated';
type TaskItem = { id: number; task: string; agent: AgentName; input: string; status: TaskStatus; approval: string; sources: string[]; createdBy: string; time: string; date: string; output: string; reason?: string };

const initialRows: TaskItem[] = [
  { id: 1, task: 'Diwali collection launch', agent: 'Marketing', input: 'Create an Instagram caption for the new festive kurta collection.', status: 'Needs Review', approval: 'Pending approval', sources: ['Brand voice guidelines', 'Festive Kurta Set · ₹4,299', 'Diwali offers FAQ'], createdBy: 'Arjun Verma', time: '10:42 AM', date: '2026-11-21', output: 'Celebrate every moment in colour. ✨ Our festive kurta collection is here, made for the memories you’ll make this season. Find your new favourite at Style Street.\n\nVisit us in store or send us a message to find your fit. #StyleStreet #FestiveStyle #MadeForTheMoment' },
  { id: 2, task: 'Return policy enquiry', agent: 'Support', input: 'Draft a reply to Priya asking whether sale items can be returned.', status: 'Completed', approval: 'Not required', sources: ['Returns & exchanges policy', 'Sale items FAQ'], createdBy: 'Website chat', time: '10:18 AM', date: '2026-11-21', output: 'Hi Priya! Sale items can be exchanged within 7 days of delivery, provided they’re unused and have their original tags. Sale items aren’t eligible for a refund. If you share your order number, our team can help you with the next step.' },
  { id: 3, task: 'New product availability', agent: 'Support', input: 'Does the navy blue silk saree come in a petite size?', status: 'Escalated', approval: 'Human review needed', sources: ['Product catalogue · 42 items'], createdBy: 'Website chat', time: '9:56 AM', date: '2026-11-21', reason: 'No matching information found', output: 'I couldn’t find a matching product or size detail in the approved business information. This question has been escalated to a person so the customer can receive an accurate answer.' },
  { id: 4, task: 'Lead follow-up draft', agent: 'Sales', input: 'Prepare a follow-up for Rahul Mehta about the men’s kurta set.', status: 'Draft', approval: 'Pending approval', sources: ['Lead record · Rahul Mehta', 'Men’s Festive Kurta Set · ₹4,200'], createdBy: 'Arjun Verma', time: '9:30 AM', date: '2026-11-21', output: 'Hi Rahul, thanks for your interest in our Men’s Festive Kurta Set. Would you like me to check availability in your size or share a few similar styles? Happy to help.' },
  { id: 5, task: 'Weekend sale post ideas', agent: 'Marketing', input: 'Suggest three post ideas for this weekend’s in-store sale.', status: 'Approved', approval: 'Approved by Arjun', sources: ['Brand voice guidelines', 'Store offers · Weekend sale'], createdBy: 'Arjun Verma', time: 'Yesterday', date: '2026-11-20', output: '1. A “Find your festive fit” carousel with three ways to style the collection.\n2. A quick try-on reel featuring this weekend’s customer favourites.\n3. A store visit post highlighting the weekend offer and opening hours.' },
  { id: 6, task: 'Customer interest summary', agent: 'Sales', input: 'Summarize buying interest from today’s new conversations.', status: 'Failed', approval: 'Not required', sources: ['Conversation inbox · 4 threads'], createdBy: 'Arjun Verma', time: 'Yesterday', date: '2026-11-20', output: 'The request could not be completed because the local model did not respond before the task timed out.' },
];

const statusClass: Record<TaskStatus, string> = { Draft: 'history-draft', 'Needs Review': 'history-needs-review', Approved: 'history-approved', Completed: 'history-completed', Failed: 'history-failed', Escalated: 'history-escalated' };
const agentIcons = { Marketing: Megaphone, Sales: Users, Support: Headphones };

export default function TaskHistory({ onBack }: { onBack: () => void }) {
  const [rows, setRows] = useState(initialRows);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [agentFilter, setAgentFilter] = useState('All agents');
  const [statusFilter, setStatusFilter] = useState('All statuses');
  const [dateFilter, setDateFilter] = useState('Last 7 days');
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(false);
  const [editedOutput, setEditedOutput] = useState('');
  const [toast, setToast] = useState('');

  const selectedTask = rows.find(row => row.id === selectedId) ?? null;
  const filteredRows = useMemo(() => rows.filter(row => {
    const matchesAgent = agentFilter === 'All agents' || row.agent === agentFilter;
    const matchesStatus = statusFilter === 'All statuses' || row.status === statusFilter;
    const matchesDate = dateFilter === 'All time' || (dateFilter === 'Last 7 days' ? row.date >= '2026-11-15' : row.date >= '2026-10-22');
    const matchesSearch = `${row.task} ${row.input} ${row.createdBy} ${row.agent}`.toLowerCase().includes(search.toLowerCase());
    return matchesAgent && matchesStatus && matchesDate && matchesSearch;
  }), [rows, agentFilter, statusFilter, dateFilter, search]);

  function notify(text: string) { setToast(text); window.setTimeout(() => setToast(''), 2200); }
  function openTask(row: TaskItem) { setSelectedId(row.id); setEditedOutput(row.output); setEditing(false); }
  function updateSelected(status: TaskStatus, approval: string) {
    if (!selectedTask) return;
    setRows(current => current.map(row => row.id === selectedTask.id ? { ...row, status, approval } : row));
    setSelectedId(null);
    setEditing(false);
    notify(status === 'Approved' ? 'Task approved.' : 'Task rejected and marked as failed.');
  }
  function saveEdit() {
    if (!selectedTask) return;
    setRows(current => current.map(row => row.id === selectedTask.id ? { ...row, output: editedOutput, status: 'Draft', approval: 'Pending approval' } : row));
    setEditing(false);
    notify('Edited output saved as a draft.');
  }

  return <div className="task-history-page">
    <div className="history-title-row"><div><button className="history-back" onClick={onBack}><ArrowLeft size={14} />AI Employees</button><div className="history-title-line"><div><span className="history-eyebrow"><span /> AUDITABLE AI WORK</span><h1>AI Task History</h1><p>Review what your AI employees worked on and the business information they used.</p></div><span className="history-total"><Bot size={15} />{rows.length} tasks</span></div></div></div>
    <div className="history-toolbar"><div className="history-search"><Search size={15} /><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search tasks..." /></div><div className="history-filter-label"><Filter size={14} />Filters</div><label className="history-select"><span>Agent</span><select value={agentFilter} onChange={event => setAgentFilter(event.target.value)}><option>All agents</option><option>Marketing</option><option>Sales</option><option>Support</option></select></label><label className="history-select"><span>Status</span><select value={statusFilter} onChange={event => setStatusFilter(event.target.value)}><option>All statuses</option><option>Draft</option><option>Needs Review</option><option>Approved</option><option>Completed</option><option>Failed</option><option>Escalated</option></select></label><label className="history-select date-select"><CalendarDays size={14} /><select value={dateFilter} onChange={event => setDateFilter(event.target.value)}><option>Last 7 days</option><option>Last 30 days</option><option>All time</option></select></label></div>
    <section className="history-table-card"><div className="history-table-scroll"><table className="history-table"><thead><tr><th>Task</th><th>Agent</th><th>Input summary</th><th>Status</th><th>Approval state</th><th>Sources used</th><th>Created by</th><th>Time</th></tr></thead><tbody>{filteredRows.map(row => { const Icon = agentIcons[row.agent]; return <tr key={row.id} onClick={() => openTask(row)} tabIndex={0} onKeyDown={event => { if (event.key === 'Enter') openTask(row); }}><td><b>{row.task}</b><small>Task #{String(row.id).padStart(4, '0')}</small></td><td><span className={`history-agent-icon history-agent-${row.agent.toLowerCase()}`}><Icon size={14} />{row.agent}</span></td><td className="input-summary-cell">{row.input}</td><td><span className={`history-status ${statusClass[row.status]}`}><i />{row.status}</span></td><td><span className={`approval-state ${row.approval === 'Pending approval' ? 'approval-pending' : row.approval === 'Human review needed' ? 'approval-human' : row.approval.startsWith('Approved') ? 'approval-done' : ''}`}>{row.approval}</span></td><td><span className="source-count"><FileText size={13} />{row.sources.length} {row.sources.length === 1 ? 'source' : 'sources'}</span></td><td>{row.createdBy}</td><td className="history-time">{row.time}</td></tr>; })}{filteredRows.length === 0 && <tr><td colSpan={8} className="history-empty">No tasks match these filters.</td></tr>}</tbody></table></div><footer className="history-table-footer"><span>Showing <b>{filteredRows.length}</b> of <b>{rows.length}</b> tasks</span><span><ShieldAlert size={13} />Business workspace records are scoped to Style Street</span></footer></section>

    {selectedTask && <div className="task-detail-overlay" onClick={() => setSelectedId(null)}><aside className="task-detail-drawer" role="dialog" aria-modal="true" aria-labelledby="task-detail-title" onClick={event => event.stopPropagation()}><header className="task-detail-header"><div><button className="detail-close" onClick={() => setSelectedId(null)} aria-label="Close task details"><X size={18} /></button><span><small>TASK #{String(selectedTask.id).padStart(4, '0')}</small><h2 id="task-detail-title">Task details</h2></span></div><span className={`history-status ${statusClass[selectedTask.status]}`}><i />{selectedTask.status}</span></header><div className="task-detail-content"><div className="detail-task-name"><span className={`history-agent-icon history-agent-${selectedTask.agent.toLowerCase()}`}>{(() => { const Icon = agentIcons[selectedTask.agent]; return <Icon size={15} />; })()}</span><span><b>{selectedTask.task}</b><small>{selectedTask.agent} Agent · {selectedTask.time} · Created by {selectedTask.createdBy}</small></span></div><section className="detail-section"><h3>Input summary</h3><p>{selectedTask.input}</p></section>{selectedTask.reason && <div className="escalation-reason"><ShieldAlert size={15} /><span><b>Escalation reason</b><small>{selectedTask.reason}</small></span></div>}<section className="detail-section"><div className="detail-section-heading"><h3>Full output</h3>{editing ? <span className="editing-indicator">Editing draft</span> : <span className="output-state">{selectedTask.status}</span>}</div>{editing ? <textarea className="output-editor" value={editedOutput} onChange={event => setEditedOutput(event.target.value)} /> : <div className="full-output">{selectedTask.output}</div>}</section><section className="detail-section"><div className="detail-section-heading"><h3>Knowledge sources used</h3><span className="sources-total">{selectedTask.sources.length} references</span></div><div className="source-reference-list">{selectedTask.sources.map((source, index) => <div className="source-reference" key={source}><span>{index + 1}</span><div><b>{source}</b><small>Style Street knowledge base</small></div><ArrowRight size={13} /></div>)}</div></section><section className="detail-metadata"><div><small>Approval state</small><b>{selectedTask.approval}</b></div><div><small>Agent</small><b>{selectedTask.agent}</b></div><div><small>Created by</small><b>{selectedTask.createdBy}</b></div></section></div><footer className="task-detail-actions">{editing ? <><button className="detail-cancel" onClick={() => { setEditing(false); setEditedOutput(selectedTask.output); }}>Cancel</button><button className="detail-save" onClick={saveEdit}><Check size={14} />Save edit</button></> : <><button className="detail-reject" onClick={() => updateSelected('Failed', 'Rejected')}>Reject</button><button className="detail-edit" onClick={() => { setEditing(true); setEditedOutput(selectedTask.output); }}>Edit</button><button className="detail-approve" onClick={() => updateSelected('Approved', 'Approved by Arjun')}><Check size={14} />Approve</button></>}</footer></aside></div>}
    {toast && <div className="history-toast"><Check size={15} />{toast}</div>}
  </div>;
}
