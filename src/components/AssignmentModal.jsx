import { useState } from 'react';
import { CalendarDays, Check, X } from 'lucide-react';

export default function AssignmentModal({ cleaner, onClose, onAssign }) {
  const [date, setDate] = useState('2026-07-29');
  const [property, setProperty] = useState(cleaner.sizes[0]);
  const [location, setLocation] = useState(cleaner.location);
  const [notes, setNotes] = useState('');

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-card">
        <div className="modal-heading"><div><p className="eyebrow">Create assignment</p><h2>{cleaner.name}</h2><p>{cleaner.type} · {cleaner.location}</p></div><button className="icon-btn" onClick={onClose}><X size={18} /></button></div>
        <div className="modal-form">
          <label>Cleaning date<div className="input-icon"><CalendarDays size={16} /><input type="date" value={date} onChange={e => setDate(e.target.value)} /></div></label>
          <label>Property size<select value={property} onChange={e => setProperty(e.target.value)}>{cleaner.sizes.map(size => <option key={size}>{size}</option>)}</select></label>
          <label>Location<select value={location} onChange={e => setLocation(e.target.value)}><option>{cleaner.location}</option></select></label>
          <label>Roster notes<textarea rows="3" placeholder="Optional notes for the cleaner..." value={notes} onChange={e => setNotes(e.target.value)} /></label>
        </div>
        <div className="modal-actions"><button className="secondary-btn" onClick={onClose}>Cancel</button><button className="primary-btn" onClick={() => onAssign({ cleanerId: cleaner.id, cleanerName: cleaner.name, date, property, location, notes })}><Check size={17} /> Confirm assignment</button></div>
      </div>
    </div>
  );
}
