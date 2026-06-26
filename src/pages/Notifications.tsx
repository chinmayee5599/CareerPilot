import { useState } from 'react';
import { Bell, CheckCircle, AlertTriangle, Info, TrendingUp, MapPin, X } from 'lucide-react';
import { useDemoData } from '../hooks/useDemoData';

const typeIcons: Record<string, React.ElementType> = {
  career_match: MapPin,
  tip: Info,
  insight: AlertTriangle,
  report: TrendingUp,
  progress: CheckCircle,
};

const typeColors: Record<string, string> = {
  career_match: 'bg-blue-50 text-blue-600',
  tip: 'bg-amber-50 text-amber-600',
  insight: 'bg-rose-50 text-rose-600',
  report: 'bg-purple-50 text-purple-600',
  progress: 'bg-emerald-50 text-emerald-600',
};

export default function NotificationsPage() {
  const { notifications: initialNotifications } = useDemoData();
  const [notifications, setNotifications] = useState(initialNotifications);

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="p-4 lg:p-8 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Notifications</h1>
          <p className="text-slate-500 mt-1">Stay updated on your career progress.</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No notifications yet.</p>
          </div>
        ) : (
          notifications.map(notification => {
            const Icon = typeIcons[notification.notification_type || ''] || Bell;
            const colorClass = typeColors[notification.notification_type || ''] || 'bg-slate-50 text-slate-600';

            return (
              <div
                key={notification.id}
                className={`flex items-start gap-4 p-4 rounded-xl border transition-colors ${
                  notification.is_read
                    ? 'bg-white border-slate-200'
                    : 'bg-blue-50/50 border-blue-200'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className={`text-sm font-semibold ${notification.is_read ? 'text-slate-700' : 'text-slate-900'}`}>
                        {notification.title}
                      </h3>
                      <p className="text-sm text-slate-600 mt-0.5">{notification.message}</p>
                    </div>
                    {!notification.is_read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="p-1 rounded hover:bg-slate-200 text-slate-400 flex-shrink-0"
                        title="Mark as read"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-2">
                    {new Date(notification.created_at).toLocaleDateString()} at{' '}
                    {new Date(notification.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                {!notification.is_read && (
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500 flex-shrink-0 mt-2" />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
