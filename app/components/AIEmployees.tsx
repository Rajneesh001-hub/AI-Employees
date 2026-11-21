'use client';

import { useState } from 'react';
import { ArrowRight, Bot, Check, ChevronDown, CircleCheck, FileText, Headphones, LockKeyhole, MessageCircle, Megaphone, MoreHorizontal, Plus, Send, Settings2, Sparkles, TrendingUp, X } from 'lucide-react';
import './ai-employees.css';

type AgentId = 'marketing' | 'sales' | 'support';
type ChatMessage = { from: 'you' | 'agent'; text: string; time: string; draft?: boolean };
type Agent = { id: AgentId; name: string; description: string; icon: typeof Bot; tone: string; capabilities: string[]; permissions: string[]; suggestions: string[]; intro: string; reply: string };

const agents: Agent[] = [
  { id: 'marketing', name: 'AI Marketing Agent', description: 'Create on-brand content and plan campaigns.', icon: Megaphone, tone: 'agent-purple', capabilities: ['Captions & post ideas', 'Reel scripts', 'Product descriptions', 'Campaign concepts'], permissions: ['Read products and prices', 'Read brand voice', 'Create content drafts', 'Save campaign ideas'], suggestions: ['Write an Instagram caption for our new arrivals', 'Give me 3 reel ideas for festive wear', 'Create a product description for a kurta'], intro: 'Hi Arjun! I’m your Marketing Agent. I can help you create content that feels like Style Street.', reply: 'Here’s a first draft for your new collection. We can refine the tone or add product details before you approve it.' },
  { id: 'sales', name: 'AI Sales Agent', description: 'Keep buying interest moving with thoughtful follow-ups.', icon: TrendingUp, tone: 'agent-orange', capabilities: ['Spot buying interest', 'Create & update leads', 'Recommend lead stages', 'Follow-up drafts & reminders'], permissions: ['Read customer and lead records', 'Suggest lead stages', 'Create or update leads', 'Create reminders and drafts'], suggestions: ['Summarize my newest leads', 'Draft a follow-up for Rahul Mehta', 'Which leads need attention today?'], intro: 'Hello Arjun! I’m your Sales Agent. I can help organize leads and plan the next best follow-up.', reply: 'I’ve prepared a follow-up draft and suggested a next step. Review the details before anything is sent.' },
  { id: 'support', name: 'AI Customer Support Agent', description: 'Answer questions with your approved business information.', icon: Headphones, tone: 'agent-teal', capabilities: ['Answer from approved info', 'Draft customer replies', 'Use conversation context', 'Escalate complaints & uncertainty'], permissions: ['Read FAQs and policies', 'Read product details', 'Draft customer replies', 'Escalate sensitive questions'], suggestions: ['Answer a question about our return policy', 'Draft a reply about delivery timelines', 'What should I escalate to a person?'], intro: 'Hi Arjun! I’m your Customer Support Agent. I use your approved business information and flag anything uncertain.', reply: 'I’ve drafted a grounded response using the business information available. Please review it before sharing it with the customer.' },
];

const supportAllowedTools = ['Search knowledge base', 'Create customer record', 'Draft reply', 'Escalate to human', 'Create reminder'];
const supportLockedTools = ['Send external message', 'Publish content', 'Refunds and payments'];

const statusClass: Record<string, string> = { Draft: 'ai-task-draft', 'Needs Review': 'ai-task-needs-review', Approved: 'ai-task-approved', Completed: 'ai-task-completed', Failed: 'ai-task-failed', Escalated: 'ai-task-escalated' };

export default function AIEmployees({ onViewHistory }: { onViewHistory: () => void }) {
  const [enabled, setEnabled] = useState<Record<AgentId, boolean>>({ marketing: true, sales: true, support: true });
  const [selected, setSelected] = useState<AgentId>('marketing');
  const [permissionsAgent, setPermissionsAgent] = useState<Agent | null>(null);
  const [permissionState, setPermissionState] = useState<Record<string, boolean>>({});
  const [draftPermissions, setDraftPermissions] = useState<Record<string, boolean>>({});
  const [supportToolState, setSupportToolState] = useState<Record<string, boolean>>(() => Object.fromEntries(supportAllowedTools.map(tool => [tool, true])));
  const [draftSupportToolState, setDraftSupportToolState] = useState<Record<string, boolean>>({});
  const [customInstructions, setCustomInstructions] = useState('');
  const [draftInstructions, setDraftInstructions] = useState('');
  const [input, setInput] = useState('');
  const [threads, setThreads] = useState<Record<AgentId, ChatMessage[]>>({
    marketing: [
      { from: 'you', text: 'Can you help me promote our new festive kurta collection?', time: '10:32 AM' },
      { from: 'agent', text: 'Absolutely. I can draft a caption, suggest post ideas, or outline a short reel. I’ll keep it aligned with your Style Street brand voice.', time: '10:32 AM', draft: true },
    ],
    sales: [{ from: 'agent', text: agents[1].intro, time: 'Just now' }],
    support: [{ from: 'agent', text: agents[2].intro, time: 'Just now' }],
  });
  const [toast, setToast] = useState('');
  const agent = agents.find(item => item.id === selected) ?? agents[0];

  function notify(message: string) { setToast(message); window.setTimeout(() => setToast(''), 2300); }
  function selectChat(id: AgentId) { setSelected(id); setTimeout(() => document.getElementById('agent-chat')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 20); }
  function openPermissions(item: Agent) {
    setPermissionsAgent(item);
    if (item.id === 'support') {
      setDraftSupportToolState(supportToolState);
      setDraftInstructions(customInstructions);
    }
    const next: Record<string, boolean> = {};
    item.permissions.forEach((_, index) => { next[`${item.id}-${index}`] = permissionState[`${item.id}-${index}`] ?? index < 2; });
    setDraftPermissions(next);
  }
  function savePermissions() {
    setPermissionState(draftPermissions);
    if (permissionsAgent?.id === 'support') {
      setSupportToolState(draftSupportToolState);
      setCustomInstructions(draftInstructions);
    }
    setPermissionsAgent(null);
    notify('Agent permissions saved.');
  }
  function sendMessage(message = input) {
    const text = message.trim();
    if (!text) return;
    if (!enabled[selected]) { notify('Turn this AI employee on to start a chat.'); return; }
    const now = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    setThreads(prev => ({ ...prev, [selected]: [...prev[selected], { from: 'you', text, time: now }, { from: 'agent', text: 'This UI prototype is not connected to an AI model yet. Your request is ready for the Ollama integration.', time: now, draft: true }] }));
    setInput('');
  }

  return <div className="ai-employees-page">
    <div className="ai-page-heading"><div><span className="ai-page-eyebrow"><span /> YOUR AI TEAM</span><h1>AI Employees</h1><p>Meet your virtual team. Each employee has a clear role and permissions you control.</p></div><button className="ai-config-button" onClick={onViewHistory}><FileText size={15} />AI Task History<ArrowRight size={13} /></button></div>
    <div className="ai-agent-grid">{agents.map(item => { const Icon = item.icon; return <article className={`ai-agent-card ${selected === item.id ? 'ai-agent-selected' : ''}`} key={item.id}>
      <div className="ai-card-top"><span className={`ai-agent-icon ${item.tone}`}><Icon size={19} /></span><span className={`ai-agent-state ${enabled[item.id] ? 'is-enabled' : ''}`}><i />{enabled[item.id] ? 'Enabled' : 'Paused'}</span><button className="ai-more" aria-label={`${item.name} options`} onClick={() => openPermissions(item)}><MoreHorizontal size={18} /></button></div>
      <h2>{item.name}</h2><p className="ai-agent-description">{item.description}</p>
      <div className="ai-capability-list">{item.capabilities.map(capability => <span key={capability}><CircleCheck size={13} />{capability}</span>)}</div>
      <div className="ai-card-bottom"><label className="enable-control"><span>Enable agent</span><input type="checkbox" checked={enabled[item.id]} onChange={event => setEnabled(prev => ({ ...prev, [item.id]: event.target.checked }))} /><i /></label><div className="ai-card-actions"><button className="permissions-button" onClick={() => openPermissions(item)}><LockKeyhole size={13} />Permissions</button><button className="chat-button" onClick={() => selectChat(item.id)}><MessageCircle size={13} />Chat</button></div></div>
    </article>; })}</div>

    <div className="ai-approval-note"><span><LockKeyhole size={15} /></span>Agents cannot send messages or publish anything without your approval.<a href="#agent-chat">Learn about approvals <ArrowRight size={13} /></a></div>

    <section className="ai-chat-panel" id="agent-chat">
      <div className="ai-chat-sidebar"><div className="chat-side-heading"><div><h2>Chat with your team</h2><p>Ask an employee to help with a task.</p></div><button aria-label="New chat" onClick={() => setThreads(prev => ({ ...prev, [selected]: [{ from: 'agent', text: agent.intro, time: 'Just now' }] }))}><Plus size={16} /></button></div>
        <div className="chat-agent-list">{agents.map(item => { const Icon = item.icon; return <button key={item.id} className={`chat-agent-choice ${selected === item.id ? 'chat-choice-active' : ''}`} onClick={() => setSelected(item.id)}><span className={`choice-icon ${item.tone}`}><Icon size={16} /></span><span><b>{item.name.replace('AI ', '')}</b><small>{enabled[item.id] ? 'Ready to help' : 'Currently paused'}</small></span><i className={enabled[item.id] ? 'choice-online' : 'choice-offline'} /></button>; })}</div>
        <div className="chat-side-foot"><span className="privacy-mini"><LockKeyhole size={13} /></span><span><b>Your business, your control</b><small>AI drafts need your approval.</small></span></div>
      </div>
      <div className="ai-chat-main"><div className="ai-chat-header"><div className={`choice-icon ${agent.tone}`}><agent.icon size={17} /></div><div className="chat-header-copy"><b>{agent.name}</b><small><i />{enabled[selected] ? 'Available' : 'Paused'}</small></div><button className="chat-header-more" onClick={() => openPermissions(agent)}><Settings2 size={16} /><span>Permissions</span><ChevronDown size={13} /></button></div>
        <div className="ai-message-thread">{threads[selected].map((message, index) => <div className={`ai-message-row ${message.from === 'you' ? 'message-from-you' : ''}`} key={`${selected}-${index}`}>
          {message.from === 'agent' && <span className={`message-avatar ${agent.tone}`}><agent.icon size={14} /></span>}
          <div className="message-body"><div className={`message-bubble ${message.from === 'you' ? 'user-bubble' : 'agent-bubble'}`}>{message.text}</div><div className="message-meta">{message.from === 'you' ? 'You' : agent.name}<span>·</span>{message.time}{message.draft && <span className={`ai-task-status ${statusClass.Draft}`}><i />Draft</span>}</div></div>
        </div>)}</div>
        <div className="starter-suggestions"><span>TRY ASKING</span><div>{agent.suggestions.map(suggestion => <button key={suggestion} onClick={() => sendMessage(suggestion)}>{suggestion}<ArrowRight size={12} /></button>)}</div></div>
        <form className="ai-chat-composer" onSubmit={event => { event.preventDefault(); sendMessage(); }}><input value={input} onChange={event => setInput(event.target.value)} placeholder={`Message ${agent.name}...`} aria-label={`Message ${agent.name}`} /><button type="submit" disabled={!input.trim()} aria-label="Send message"><Send size={16} /></button><small><Sparkles size={12} />AI can make mistakes. Review drafts before sharing.</small></form>
      </div>
    </section>

    {permissionsAgent?.id === 'support' && <div className="support-permission-overlay" onClick={() => setPermissionsAgent(null)}><aside className="support-permission-drawer" role="dialog" aria-modal="true" aria-labelledby="support-permission-title" onClick={event => event.stopPropagation()}><header className="support-drawer-header"><div><span className="support-drawer-icon"><Headphones size={17} /></span><span className="support-drawer-heading"><small>AI EMPLOYEE</small><b id="support-permission-title">Support Agent permissions</b></span></div><button onClick={() => setPermissionsAgent(null)} aria-label="Close permissions"><X size={19} /></button></header><div className="support-drawer-content"><div className="drawer-intro"><h3>Allowed tools</h3><p>Choose which actions this agent can use in your workspace.</p></div><div className="drawer-tool-list">{supportAllowedTools.map((tool, index) => <label className="drawer-tool-row" key={tool}><span className="drawer-tool-number">{String(index + 1).padStart(2, '0')}</span><span className="drawer-tool-copy"><b>{tool}</b><small>{tool === 'Search knowledge base' ? 'Find approved business information' : tool === 'Create customer record' ? 'Add a new customer to Contacts' : tool === 'Draft reply' ? 'Prepare a response for your review' : tool === 'Escalate to human' ? 'Flag uncertain or sensitive requests' : 'Schedule an internal follow-up'}</small></span><span className="drawer-toggle"><input type="checkbox" checked={draftSupportToolState[tool] ?? false} onChange={event => setDraftSupportToolState(prev => ({ ...prev, [tool]: event.target.checked }))} aria-label={tool} /><i /></span></label>)}</div><div className="drawer-section-heading"><h3>Always requires your approval</h3><span>LOCKED</span></div><div className="drawer-locked-list">{supportLockedTools.map(tool => <div className="drawer-locked-row" key={tool}><span className="locked-icon"><LockKeyhole size={14} /></span><span><b>{tool}</b><small>Human approval is always required</small></span><span className="locked-badge">Always on</span></div>)}</div><label className="drawer-instructions"><span><b>Custom agent instructions</b><small>Add guidance for how your Support Agent should respond.</small></span><textarea value={draftInstructions} onChange={event => setDraftInstructions(event.target.value)} placeholder="For example: Keep replies warm and concise. If a customer asks about an item not in the knowledge base, let them know you’ll check with the team." /></label><div className="drawer-privacy-note"><LockKeyhole size={14} />These permissions apply to Style Street’s Support Agent.</div></div><footer className="support-drawer-footer"><button className="permission-cancel" onClick={() => setPermissionsAgent(null)}>Cancel</button><button className="permission-save" onClick={savePermissions}><Check size={14} />Save</button></footer></aside></div>}
    {permissionsAgent && permissionsAgent.id !== 'support' && <div className="permission-overlay" onClick={() => setPermissionsAgent(null)}><section className="permission-modal" onClick={event => event.stopPropagation()}><div className="permission-modal-head"><span className={`ai-agent-icon ${permissionsAgent.tone}`}><permissionsAgent.icon size={18} /></span><button onClick={() => setPermissionsAgent(null)} aria-label="Close permissions"><X size={18} /></button></div><h2>Agent permissions</h2><p>Choose what {permissionsAgent.name} can access and prepare.</p><div className="permission-options">{permissionsAgent.permissions.map((permission, index) => { const key = `${permissionsAgent.id}-${index}`; return <label key={permission}><span><b>{permission}</b><small>{index < 2 ? 'Business workspace information' : 'Requires owner review before any external action'}</small></span><input type="checkbox" checked={draftPermissions[key] ?? false} onChange={event => setDraftPermissions(prev => ({ ...prev, [key]: event.target.checked }))} /></label>; })}</div><div className="permission-note"><LockKeyhole size={14} />Sending and publishing always require your approval.</div><div className="permission-modal-actions"><button className="permission-cancel" onClick={() => setPermissionsAgent(null)}>Cancel</button><button className="permission-save" onClick={savePermissions}>Save permissions</button></div></section></div>}
    {toast && <div className="ai-toast"><Check size={15} />{toast}</div>}
  </div>;
}
