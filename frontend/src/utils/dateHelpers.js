export function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

// Monday-first week containing today, as [{ key: "YYYY-MM-DD", label: "Mon" }, ...]
export function weekKeys() {
  const now = new Date();
  const dayOfWeek = (now.getDay() + 6) % 7; // 0 = Monday
  const monday = new Date(now);
  monday.setDate(now.getDate() - dayOfWeek);

  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    days.push({
      key: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString(undefined, { weekday: "short" }),
    });
  }
  return days;
}

// dateKeys: "YYYY-MM-DD" strings a habit was completed on, any order.
// Today is allowed to be missing without breaking the current streak.
export function streakFromKeys(dateKeys) {
  const set = new Set(dateKeys);

  const cursor = new Date();
  let current = 0;
  if (!set.has(todayKey())) {
    cursor.setDate(cursor.getDate() - 1);
  }
  while (set.has(cursor.toISOString().slice(0, 10))) {
    current++;
    cursor.setDate(cursor.getDate() - 1);
  }

  const sorted = [...set].sort();
  let longest = 0;
  let run = 0;
  let prevKey = null;
  for (const key of sorted) {
    if (prevKey) {
      const expected = new Date(prevKey);
      expected.setDate(expected.getDate() + 1);
      run = expected.toISOString().slice(0, 10) === key ? run + 1 : 1;
    } else {
      run = 1;
    }
    longest = Math.max(longest, run);
    prevKey = key;
  }

  return { current, longest };
}
