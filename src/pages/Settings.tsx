import { useState } from 'react';
import {
  Settings, Bell, Link2, Shield, CreditCard, User,
  Check, ToggleLeft, ToggleRight, Github, Linkedin, HardDrive
} from 'lucide-react';
import { useDemoData } from '../hooks/useDemoData';

function Toggle({
  enabled, onChange, label, description
}: {
  enabled: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm font-medium text-slate-900">{label}</p>
        {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative w-11 h-6 rounded-full transition-colors ${enabled ? 'bg-emerald-500' : 'bg-slate-300'}`}
      >
        <span
          className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${enabled ? 'translate-x-5.5' : 'translate-x-0.5'}`}
          style={{ transform: enabled ? 'translateX(20px)' : 'translateX(2px)' }}
        />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const { settings: initialSettings } = useDemoData();
  const [settings, setSettings] = useState(initialSettings);
  const [saved, setSaved] = useState(false);

  const updateSetting = (key: keyof typeof settings, value: boolean | string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-4 lg:p-8 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500 mt-1">Manage your account preferences and integrations.</p>
      </div>

      {/* Profile */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <User className="w-5 h-5 text-slate-600" />
          <h2 className="text-lg font-bold text-slate-900">Profile</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">Full Name</label>
            <input
              type="text"
              defaultValue="Arjun Kumar"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">Target Role</label>
            <input
              type="text"
              defaultValue="Senior Backend Engineer"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">Experience Level</label>
            <select className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <option>Entry Level (0–2 years)</option>
              <option>Mid Level (2–5 years)</option>
              <option selected>Senior (5–8 years)</option>
              <option>Staff+ (8+ years)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-5 h-5 text-slate-600" />
          <h2 className="text-lg font-bold text-slate-900">Notifications</h2>
        </div>
        <div className="divide-y divide-slate-100">
          <Toggle
            enabled={settings.notify_new_matches}
            onChange={v => updateSetting('notify_new_matches', v)}
            label="New Career Matches"
            description="Get notified when new job matches are found"
          />
          <Toggle
            enabled={settings.notify_weekly_report}
            onChange={v => updateSetting('notify_weekly_report', v)}
            label="Weekly Progress Report"
            description="Receive a weekly summary of your progress"
          />
          <Toggle
            enabled={settings.notify_interview_reminders}
            onChange={v => updateSetting('notify_interview_reminders', v)}
            label="Interview Reminders"
            description="Reminders to practice interviews"
          />
        </div>
      </div>

      {/* Integrations */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Link2 className="w-5 h-5 text-slate-600" />
          <h2 className="text-lg font-bold text-slate-900">Integrations</h2>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <Linkedin className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">LinkedIn</p>
                <p className="text-xs text-slate-500">Import profile data</p>
              </div>
            </div>
            <button
              onClick={() => updateSetting('linkedin_connected', !settings.linkedin_connected)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                settings.linkedin_connected
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              {settings.linkedin_connected ? 'Connected' : 'Connect'}
            </button>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center">
                <Github className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">GitHub</p>
                <p className="text-xs text-slate-500">Sync projects & contributions</p>
              </div>
            </div>
            <button
              onClick={() => updateSetting('github_connected', !settings.github_connected)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                settings.github_connected
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              {settings.github_connected ? 'Connected' : 'Connect'}
            </button>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center">
                <HardDrive className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">Google Drive</p>
                <p className="text-xs text-slate-500">Resume storage</p>
              </div>
            </div>
            <button
              onClick={() => updateSetting('drive_connected', !settings.drive_connected)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                settings.drive_connected
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              {settings.drive_connected ? 'Connected' : 'Connect'}
            </button>
          </div>
        </div>
      </div>

      {/* Plan */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <CreditCard className="w-5 h-5 text-slate-600" />
          <h2 className="text-lg font-bold text-slate-900">Plan</h2>
        </div>
        <div className="flex items-center justify-between p-4 rounded-lg bg-emerald-50 border border-emerald-200">
          <div>
            <p className="font-bold text-slate-900">Pro Plan</p>
            <p className="text-xs text-slate-600 mt-0.5">Unlimited interviews, AI resume analysis, career matching</p>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-500 text-white text-xs font-bold">ACTIVE</span>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-end gap-3">
        {saved && (
          <span className="flex items-center gap-1 text-sm text-emerald-600 font-medium">
            <Check className="w-4 h-4" /> Saved successfully
          </span>
        )}
        <button
          onClick={handleSave}
          className="px-6 py-2.5 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
