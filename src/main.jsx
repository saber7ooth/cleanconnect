import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { CalendarDays, Check, ChevronLeft, ChevronRight, ClipboardList, LogOut, MapPin, Menu, Search, Settings, Users, X } from 'lucide-react';
import './styles.css';
import Login from './components/Login';
import AssignmentModal from './components/AssignmentModal';
import { locations, propertySizes, sampleCleaners, teamTypes } from './data';
import { getSession, signOut } from './lib/auth';
import { loadState, saveState } from './lib/storage';

function App() {
  const [session, setSession] = useState(getSession());
  const [state, setState] = useState(loadState());
  const [portal, setPortal] = useState(session?.user?.role || 'cleaner');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [month, setMonth] = useState(new Date(2026, 6, 1));
  const [saved, setSaved] = useState(false);
  const [search, setSearch] = useState('');
  const [filterLocation, setFilterLocation] = useState('All locations');
  const [filterTeam, setFilterTeam] = useState('All team types');
  const [selectedCleaner, setSelectedCleaner] = useState(null);
  const [toast, setToast] = useState('');

  useEffect(() => { saveState(state); }, [state]);
  useEffect(() => { if (!toast) return; const timer = setTimeout(() => setToast(''), 2800); return () => clearTimeout(timer); }, [toast]);

  if (!session) return <Login onLogin={(next) => { setSession(next); setPortal(next.user.role); }} />;

  const availability = state.availability;
  const calendar = useMemo(() => buildCalendar(month.getFullYear(), month.getMonth()), [month]);
  const selectedDates = availability.dates;
  const monthLabel = month.toLocaleString('en-US', { month: 'long', year: 'numeric' });
  const filteredCleaners = sampleCleaners.filter((cleaner) => {
    const q = search.toLowerCase();
    return (!q || cleaner.name.toLowerCase().includes(q) || cleaner.location.toLowerCase().includes(q))
      && (filterLocation === 'All locations' || cleaner.location === filterLocation)
      && (filterTeam === 'All team types' || cleaner.type === filterTeam);
  });

  const updateAvailability = (patch) => setState((current) => ({ ...current, availability: { ...current.availability, ...patch } }));
  const toggleDate = (day) => {
    const dateKey = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    updateAvailability({ dates: selectedDates.includes(dateKey) ? selectedDates.filter((date) => date !== dateKey) : [...selectedDates, dateKey] });
  };
  const isSelected = (day) => selectedDates.includes(`${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
  const toggleSize = (size) => updateAvailability({ sizes: availability.sizes.includes(size) ? availability.sizes.filter((s) => s !== size) : [...availability.sizes, size] });
  const handleLogin = (next) => { setSession(next); setPortal(next.user.role); };
  const handleAssign = (assignment) => { setState((current) => ({ ...current, assignments: [...current.assignments, { ...assignment, id: crypto.randomUUID(), createdAt: new Date().toISOString() }] })); setSelectedCleaner(null); setToast(`Assignment created for ${assignment.cleanerName}`); };

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
        <div className="brand"><span className="brand-mark">C</span><span>CleanConnect</span></div>
        <div className="portal-switcher"><span className="portal-label">PORTAL</span>
          {session.user.role === 'cleaner' && <button className={portal === 'cleaner' ? 'active' : ''} onClick={() => setPortal('cleaner')}><Users size={18} /> Cleaner Portal</button>}
          {session.user.role === 'roster' && <button className="active"><ClipboardList size={18} /> Roster Team</button>}
        </div>
        <nav><a className="nav-active"><CalendarDays size={19} /> {portal === 'cleaner' ? 'My Availability' : 'Roster Dashboard'}</a><a><Users size={19} /> {portal === 'cleaner' ? 'My Profile' : 'Cleaners'}</a><a><MapPin size={19} /> Locations</a><a><Settings size={19} /> Settings</a></nav>
        <div className="sidebar-user"><div className="avatar">{session.user.initials}</div><div><strong>{session.user.name}</strong><small>{portal === 'cleaner' ? 'Cleaner' : 'Roster Manager'}</small></div><button className="logout-btn" title="Sign out" onClick={() => { signOut(); setSession(null); }}><LogOut size={16} /></button></div>
      </aside>

      <main className="main">
        <header className="topbar"><button className="mobile-menu" onClick={() => setMobileOpen(!mobileOpen)}><Menu /></button><div><p className="eyebrow">{portal === 'cleaner' ? 'Cleaner Portal' : 'Roster Team Portal'}</p><h1>{portal === 'cleaner' ? 'My Availability' : 'Roster Dashboard'}</h1></div><div className="top-actions"><span className="online-dot" /> <span>Online</span><div className="avatar">{session.user.initials}</div></div></header>

        {portal === 'cleaner' ? <section className="content">
          <div className="welcome-card"><div><p className="eyebrow light">AVAILABILITY</p><h2>Keep your availability up to date</h2><p>Let the roster team know when and where you're ready to clean.</p></div><div className="summary-pill"><CalendarDays size={18} /><strong>{selectedDates.length} days selected</strong></div></div>
          <div className="grid-layout">
            <div className="panel calendar-panel"><div className="panel-heading"><div><h3>Availability calendar</h3><p>Select every day you can accept cleaning jobs.</p></div><div className="month-nav"><button onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}><ChevronLeft size={18} /></button><strong>{monthLabel}</strong><button onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}><ChevronRight size={18} /></button></div></div><div className="weekdays">{['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => <span key={d}>{d}</span>)}</div><div className="calendar-grid">{calendar.map((cell, i) => cell ? <button key={i} className={`day ${isSelected(cell) ? 'selected' : ''}`} onClick={() => toggleDate(cell)}><span>{cell}</span>{isSelected(cell) && <Check size={14} />}</button> : <span key={i} />)}</div><div className="legend"><span><i className="legend-dot selected-dot" /> Available</span><span><i className="legend-dot" /> Not selected</span></div></div>
            <div className="panel preferences-panel"><div className="panel-heading"><div><h3>Cleaning preferences</h3><p>Tell us what jobs suit you best.</p></div></div><label>Preferred location</label><div className="select-wrap"><MapPin size={17} /><select value={availability.location} onChange={e => updateAvailability({ location: e.target.value })}>{locations.map(l => <option key={l}>{l}</option>)}</select></div><label>Property sizes</label><div className="chips">{propertySizes.map(size => <button key={size} className={availability.sizes.includes(size) ? 'chip active' : 'chip'} onClick={() => toggleSize(size)}>{availability.sizes.includes(size) && <Check size={14} />}{size}</button>)}</div><label>Daily cleaning capacity <strong className="value">{availability.capacity} cleans</strong></label><input className="range" type="range" min="1" max="8" value={availability.capacity} onChange={e => updateAvailability({ capacity: Number(e.target.value) })} /><label>Clean team</label><div className="team-options">{teamTypes.map(type => <button key={type} className={availability.teamType === type ? 'team-option active' : 'team-option'} onClick={() => updateAvailability({ teamType: type })}><span className="team-icon"><Users size={17} /></span><span>{type}</span>{availability.teamType === type && <Check size={16} />}</button>)}</div><button className="primary-btn" onClick={() => { saveState(state); setSaved(true); setToast('Your availability has been saved'); setTimeout(() => setSaved(false), 2500); }}>{saved ? <><Check size={18} /> Availability saved</> : 'Save availability'}</button></div>
          </div>
        </section> : <section className="content">
          <div className="stats-grid"><Stat title="Available today" value="18" detail="+3 from yesterday" /><Stat title="Total cleaners" value="42" detail="Across 5 locations" /><Stat title="Cleaning capacity" value="126" detail="Jobs available today" /><Stat title="Teams ready" value="11" detail="2–3 person teams" /></div>
          <div className="panel roster-panel"><div className="panel-heading"><div><h3>Cleaner availability</h3><p>Find the right cleaner or team for your next job.</p></div><button className="secondary-btn"><CalendarDays size={17} /> View calendar</button></div><div className="filters"><div className="search-box"><Search size={18} /><input placeholder="Search cleaners or locations..." value={search} onChange={e => setSearch(e.target.value)} /></div><select value={filterLocation} onChange={e => setFilterLocation(e.target.value)}><option>All locations</option>{locations.map(l => <option key={l}>{l}</option>)}</select><select value={filterTeam} onChange={e => setFilterTeam(e.target.value)}><option>All team types</option>{teamTypes.map(t => <option key={t}>{t}</option>)}</select></div><div className="table-wrap"><table><thead><tr><th>Cleaner / team</th><th>Location</th><th>Property sizes</th><th>Capacity</th><th>Next availability</th><th>Status</th><th>Action</th></tr></thead><tbody>{filteredCleaners.map(c => <tr key={c.id}><td><div className="cleaner-cell"><div className="avatar small">{c.initials}</div><div><strong>{c.name}</strong><small>{c.type}</small></div></div></td><td>{c.location}</td><td><div className="tag-list">{c.sizes.map(s => <span key={s}>{s}</span>)}</div></td><td><strong>{c.capacity}</strong> cleans</td><td>{c.available}</td><td><span className={`status ${c.status.toLowerCase()}`}>{c.status}</span></td><td><button className="assign-btn" onClick={() => setSelectedCleaner(c)}>Assign</button></td></tr>)}</tbody></table></div></div>
          {state.assignments.length > 0 && <div className="panel assignments-panel"><div className="panel-heading"><div><h3>Recent assignments</h3><p>Assignments created during this session.</p></div></div><div className="assignment-list">{state.assignments.slice(-5).reverse().map(a => <div className="assignment-row" key={a.id}><div><strong>{a.cleanerName}</strong><small>{a.property} · {a.location}</small></div><span>{a.date}</span><span className="status available">Assigned</span></div>)}</div></div>}
        </section>}
      </main>
      {selectedCleaner && <AssignmentModal cleaner={selectedCleaner} onClose={() => setSelectedCleaner(null)} onAssign={handleAssign} />}
      {toast && <div className="toast"><Check size={17} /> {toast}<button onClick={() => setToast('')}><X size={14} /></button></div>}
    </div>
  );
}

function Stat({ title, value, detail }) { return <div className="stat-card"><span>{title}</span><strong>{value}</strong><small>{detail}</small></div>; }
function buildCalendar(year, month) { const first = new Date(year, month, 1).getDay(); const days = new Date(year, month + 1, 0).getDate(); return [...Array(first).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)]; }
createRoot(document.getElementById('root')).render(<App />);
