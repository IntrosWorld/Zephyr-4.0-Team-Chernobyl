import { useEffect, useState } from "react";
import { Bell, BellOff } from "lucide-react";

function minutesNow() {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

function toMinutes(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

// Best-effort, tab-must-be-open reminders via the Notification API — there's
// no push/service-worker infra here, so this only fires while the app is
// actually open in a browser tab.
export default function RemindersCard({ habits }) {
  const [permission, setPermission] = useState(
    typeof Notification !== "undefined" ? Notification.permission : "unsupported"
  );

  const reminders = habits
    .filter((h) => h.reminderTime)
    .sort((a, b) => toMinutes(a.reminderTime) - toMinutes(b.reminderTime));

  useEffect(() => {
    if (permission !== "granted") return;

    const timers = reminders
      .filter((h) => toMinutes(h.reminderTime) >= minutesNow())
      .map((h) => {
        const delayMs = (toMinutes(h.reminderTime) - minutesNow()) * 60 * 1000;
        return setTimeout(() => {
          new Notification("Habitify", { body: `Time for: ${h.name}` });
        }, delayMs);
      });

    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permission, habits]);

  async function requestPermission() {
    const result = await Notification.requestPermission();
    setPermission(result);
  }

  return (
    <div className="bg-[#c9ede0] border border-[#9ed9c4] rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-medium text-[#0d2b24]">Reminders</div>
        {permission === "default" && (
          <button
            onClick={requestPermission}
            className="text-xs text-[#159c86] hover:underline flex items-center gap-1"
          >
            <Bell size={12} />
            Enable
          </button>
        )}
        {permission === "denied" && (
          <span className="text-xs text-[#a3c7bb] flex items-center gap-1">
            <BellOff size={12} />
            Blocked
          </span>
        )}
      </div>

      {reminders.length === 0 ? (
        <p className="text-sm text-[#6b9285]">Add a reminder time to a habit to see it here.</p>
      ) : (
        <div className="space-y-2">
          {reminders.map((h) => {
            const passed = toMinutes(h.reminderTime) < minutesNow();
            return (
              <div key={h.id} className="flex items-center justify-between text-sm">
                <span className={passed ? "text-[#a3c7bb]" : "text-[#0d2b24]"}>{h.name}</span>
                <span className={passed ? "text-[#a3c7bb]" : "text-[#159c86]"}>{h.reminderTime}</span>
              </div>
            );
          })}
        </div>
      )}

      {permission === "granted" && reminders.length > 0 && (
        <p className="text-[11px] text-[#a3c7bb] mt-3">
          You'll get a browser notification while Habitify is open in a tab.
        </p>
      )}
    </div>
  );
}
