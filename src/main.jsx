import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { CalendarDays, Check, ChevronLeft, ChevronRight, ClipboardList, MapPin, Menu, Search, Settings, Users, X } from 'lucide-react';
import './styles.css';

const locations = ['Central London', 'East London', 'North London', 'South London', 'West London'];
const propertySizes = ['Studio', '1 Bed', '2 Bed', '3 Bed', '4+ Bed'];
const teamTypes = ['Individual Cleaner', 'Team of 2', 'Team of 3'];

const sampleCleaners = [
  { id: 1, name: 'Amelia Carter', initials: 'AC', type: 'Team of 2', location: 'Central London', sizes: ['Studio', '1 Bed', '2 Bed'], capacity: 4, available: 'Today', status: 'Available' },
  { id: 2, name: 'Noah Williams', initials: 'NW', type: 'Individual Cleaner', location: 'East London', sizes: ['Studio', '1 Bed'], capacity: 3, available: 'Today', status: 'Available' },
  { id: 3, name: 'Olivia Smith', initials: 'OS', type: 'Team of 3', location: 'North London', sizes: ['2 Bed', '3 Bed', '4+ Bed'], capacity: 5, available: 'Tomorrow', status: 'Available' },
  { id: 4, name: 'Ethan Brown', initials: 'EB', type: 'Team of 2', location: 'South London', sizes: ['1 Bed', '2 Bed', '3 Bed'], capacity: 4, available: 'Jul 29', status: 'Limited' },
  { id: 5, name: 'Sophie Wilson', initials: 'SW', type: 'Individual Cleaner', location: 'West London', sizes: ['Studio', '1 Bed', '2 Bed'], capacity: 2, available: 'Jul 30', status: 'Available' }
];

function App() {
  const [portal, setPortal] = useState('cleaner');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedDates, setSelectedDates] = useState([23, 24, 25, 28, 29]);
  const [month, setMonth] = useState(new Date(2026, 6, 1));
  const [saved, setSaved] = useState(false);
  const [location, setLocation] = useState('Central London');
  const [sizes, setSizes] = useState(['Studio', '1 Bed', '2 Bed']);
  const [capacity, setCapacity] = useState(4);
  const [teamType, setTeamType] = useState('Team of 2');
  const [search, setSearch] = useState('');
  const [filterLocation, setFilterLocation] = useState('All locations');
  const [filterTeam, setFilterTeam] = useState('All team types');

  const calendar = useMemo(() => buildCalendar(month.getFullYear(), month.getMonth()), [month]);
  const filteredCleaners = sampleCleaners.filter((cleaner) => {
    const q = search.toLowerCase();
    return (!q || cleaner.name.toLowerCase().includes(q) || cleaner.location.toLowerCase().includes(q))
      && (filterLocation === 'All locations' || cleaner.location === filterLocation)
      && (filterTeam === 'All team types' || cleaner.type === filterTeam);
  });

  const toggleDate = (day) => setSelectedDates((dates) => dates.includes(day) ? dates.filter((d) => d !== day) : [...dates, day]);
  const toggleSize = (size) => setSizes((current) => current.includes(size) ? current.filter((s) => s !== size) : [...current, size]);
  const monthLabel = month.toLocaleString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
        <div className="brand"><span className="brand-mark">C</span><span>CleanConnect</span></div>
        <div className="portal-switcher">
          <span className="portal-label">PORTAL</span>
          <button className={portal === 'cleaner' ? 'active' : ''} onClick={() => setPortal('cleaner')}><Users size={18} /> Cleaner Portal</button>
          <button className={portal === 'roster' ? 'active' : ''} onClick={() => setPortal('roster')}><ClipboardList size={18} /> Roster Team</button>
        </div>
        <nav>
          <a className="nav-active"><CalendarDays size={19} /> {portal === 'cleaner' ? 'My Availability' : 'Roster Dashboard'}</a>
          <a><Users size={19} /> {portal === 'cleaner' ? 'My Profile' : 'Cleaners'}</a>
          <a><MapPin size={19} /> Locations</a>
          <a><Settings size={19} /> Settings</a>
        </nav>
        <div className="sidebar-user"><div className="avatar">JS</div><div><strong>Jordan Smith</strong><small>{portal === 'cleaner' ? 'Cleaner' : 'Roster Manager'}</small></div></div>
      </aside>

      <main className="main">
        <header className="topbar"><button className="mobile-menu" onClick={() => setMobileOpen(!mobileOpen)}><Menu /></button><div><p className="eyebrow">{portal === 'cleaner' ? 'Cleaner Portal' : 'Roster Team Portal'}</p><h1>{portal === 'cleaner' ? 'My Availability' : 'Roster Dashboard'}</h1></div><div className="top-actions"><span className="online-dot" /> <span>Online</span><div className="avatar">JS</div></div></header>

        {portal === 'cleaner' ? (
          <section className="content">
            <div className="welcome-card"><div><p className="eyebrow light">AVAILABILITY</p><h2>Keep your availability up to date</h2><p>Let the roster team know when and where you're ready to clean.</p></div><div className="summary-pill"><CalendarDays size={18} /><strong>{selectedDates.length} days selected</strong></div></div>
            <div className="grid-layout">
              <div className="panel calendar-panel">
                <div className="panel-heading"><div><h3>Availability calendar</h3><p>Select every day you can accept cleaning jobs.</p></div><div className="month-nav"><button onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}><ChevronLeft size={18} /></button><strong>{monthLabel}</strong><button onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}><ChevronRight size={18} /></button></div></div>
                <div className="weekdays">{['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => <span key={d}>{d}</span>)}</div>
                <div className="calendar-grid">{calendar.map((cell, i) => cell ? <button key={i} className={`day ${selectedDates.includes(cell) ? 'selected' : ''}`} onClick={() => toggleDate(cell)}><span>{cell}</span>{selectedDates.includes(cell) && <Check size={14} />}</button> : <span key={i} />)}</div>
                <div className="legend"><span><i className="legend-dot selected-dot" /> Available</span><span><i className="legend-dot" /> Not selected</span></div>
              </div>

              <div className="panel preferences-panel">
                <div className="panel-heading"><div><h3>Cleaning preferences</h3><p>Tell us what jobs suit you best.</p></div></div>
                <label>Preferred location</label><div className="select-wrap"><MapPin size={17} /><select value={location} onChange={e => setLocation(e.target.value)}>{locations.map(l => <option key={l}>{l}</option>)}</select></div>
                <label>Property sizes</label><div className="chips">{propertySizes.map(size => <button key={size} className={sizes.includes(size) ? 'chip active' : 'chip'} onClick={() => toggleSize(size)}>{sizes.includes(size) && <Check size={14} />}{size}</button>)}</div>
                <label>Daily cleaning capacity <strong className="value">{capacity} cleans</strong></label><input className="range" type="range" min="1" max="8" value={capacity} onChange={e => setCapacity(Number(e.target.value))} />
                <label>Clean team</label><div className="team-options">{teamTypes.map(type => <button key={type} className={teamType === type ? 'team-option active' : 'team-option'} onClick={() => setTeamType(type)}><span className="team-icon"><Users size={17} /></span><span>{type}</span>{teamType === type && <Check size={16} />}</button>)}</div>
                <button className="primary-btn" onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2500); }}>{saved ? <><Check size={18} /> Availability saved</> : 'Save availability'}</button>
              </div>
            </div>
          </section>
        ) : (
          <section className="content">
            <div className="stats-grid"><Stat title="Available today" value="18" detail="+3 from yesterday" /><Stat title="Total cleaners" value="42" detail="Across 5 locations" /><Stat title="Cleaning capacity" value="126" detail="Jobs available today" /><Stat title="Teams ready" value="11" detail="2–3 person teams" /></div>
            <div className="panel roster-panel"><div className="panel-heading"><div><h3>Cleaner availability</h3><p>Find the right cleaner or team for your next job.</p></div><button className="secondary-btn"><CalendarDays size={17} /> View calendar</button></div>
              <div className="filters"><div className="search-box"><Search size={18} /><input placeholder="Search cleaners or locations..." value={search} onChange={e => setSearch(e.target.value)} /></div><select value={filterLocation} onChange={e => setFilterLocation(e.target.value)}><option>All locations</option>{locations.map(l => <option key={l}>{l}</option>)}</select><select value={filterTeam} onChange={e => setFilterTeam(e.target.value)}><option>All team types</option>{teamTypes.map(t => <option key={t}>{t}</option>)}</select></div>
              <div className="table-wrap"><table><thead><tr><th>Cleaner / team</th><th>Location</th><th>Property sizes</th><th>Capacity</th><th>Next availability</th><th>Status</th></tr></thead><tbody>{filteredCleaners.map(c => <tr key={c.id}><td><div className="cleaner-cell"><div className="avatar small">{c.initials}</div><div><strong>{c.name}</strong><small>{c.type}</small></div></div></td><td>{c.location}</td><td><div className="tag-list">{c.sizes.map(s => <span key={s}>{s}</span>)}</div></td><td><strong>{c.capacity}</strong> cleans</td><td>{c.available}</td><td><span className={`status ${c.status.toLowerCase()}`}>{c.status}</span></td></tr>)}</tbody></table></div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function Stat({ title, value, detail }) { return <div className="stat-card"><span>{title}</span><strong>{value}</strong><small>{detail}</small></div>; }
function buildCalendar(year, month) { const first = new Date(year, month, 1).getDay(); const days = new Date(year, month + 1, 0).getDate(); return [...Array(first).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)]; }

createRoot(document.getElementById('root')).render(<App />);
