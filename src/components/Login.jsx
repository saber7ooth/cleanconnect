import { useState } from 'react';
import { CalendarDays, ClipboardList, Users } from 'lucide-react';
import { roles, signIn } from '../lib/auth';

export default function Login({ onLogin }) {
  const [role, setRole] = useState(roles.CLEANER);

  const submit = (event) => {
    event.preventDefault();
    onLogin(signIn(role));
  };

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-brand"><span className="brand-mark">C</span><strong>CleanConnect</strong></div>
        <div className="login-heading"><p className="eyebrow">Welcome back</p><h1>Choose your workspace</h1><p>Sign in to manage cleaner availability or the roster.</p></div>
        <form onSubmit={submit}>
          <div className="role-cards">
            <button type="button" className={role === roles.CLEANER ? 'role-card active' : 'role-card'} onClick={() => setRole(roles.CLEANER)}><span className="role-icon"><Users size={20} /></span><span><strong>Cleaner Portal</strong><small>Manage my availability and preferences</small></span></button>
            <button type="button" className={role === roles.ROSTER ? 'role-card active' : 'role-card'} onClick={() => setRole(roles.ROSTER)}><span className="role-icon"><ClipboardList size={20} /></span><span><strong>Roster Team</strong><small>Find, filter and manage cleaners</small></span></button>
          </div>
          <label>Email address<input type="email" defaultValue="demo@cleanconnect.app" required /></label>
          <label>Password<input type="password" defaultValue="password" required /></label>
          <button className="primary-btn login-btn" type="submit"><CalendarDays size={18} /> Continue as {role === roles.CLEANER ? 'Cleaner' : 'Roster Team'}</button>
        </form>
        <p className="demo-note">Demo mode: authentication is local to this prototype. Production authentication will be connected to the backend.</p>
      </section>
    </main>
  );
}
