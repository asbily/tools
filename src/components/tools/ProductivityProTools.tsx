import React, { useState, useEffect, useRef } from 'react';
import { Globe, Flame, Plus, Trash2, Check, Keyboard, RotateCcw, Award } from 'lucide-react';

// -------------------------------------------------------------
// 1. World Clock & Timezone Meeting Planner
// -------------------------------------------------------------
const CITIES = [
  { name: 'Dhaka', tz: 'Asia/Dhaka', code: 'BDT' },
  { name: 'London', tz: 'Europe/London', code: 'GMT/BST' },
  { name: 'New York', tz: 'America/New_York', code: 'EST/EDT' },
  { name: 'San Francisco', tz: 'America/Los_Angeles', code: 'PST/PDT' },
  { name: 'Dubai', tz: 'Asia/Dubai', code: 'GST' },
  { name: 'Singapore', tz: 'Asia/Singapore', code: 'SGT' },
  { name: 'Tokyo', tz: 'Asia/Tokyo', code: 'JST' },
  { name: 'Berlin', tz: 'Europe/Berlin', code: 'CET/CEST' },
  { name: 'Sydney', tz: 'Australia/Sydney', code: 'AEDT' },
];

export const WorldClockPlannerTool: React.FC = () => {
  const [now, setNow] = useState(() => new Date());
  const [offsetMinutes, setOffsetMinutes] = useState(0);
  const [liveMode, setLiveMode] = useState(true);

  useEffect(() => {
    if (!liveMode) return;
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, [liveMode]);

  const targetDate = new Date(now.getTime() + offsetMinutes * 60_000);

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="font-semibold flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-[#000000] dark:text-[#FFFFFF]" />
            <span>Meeting Time Scrub ({offsetMinutes === 0 ? 'Live Now' : `${offsetMinutes > 0 ? '+' : ''}${(offsetMinutes / 60).toFixed(1)} hrs`})</span>
          </span>
          <button
            type="button"
            onClick={() => {
              setOffsetMinutes(0);
              setLiveMode(true);
            }}
            className="px-2.5 py-1 rounded border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#090909] font-medium hover:bg-[#F6F6F6] cursor-pointer"
          >
            Reset to Live Time
          </button>
        </div>

        <input
          type="range"
          min={-720}
          max={720}
          step={30}
          value={offsetMinutes}
          onChange={(e) => {
            setLiveMode(false);
            setOffsetMinutes(Number(e.target.value));
          }}
          className="w-full accent-[#000000] dark:accent-[#FFFFFF]"
        />
        <div className="flex justify-between text-[10px] font-mono text-neutral-400">
          <span>-12h</span>
          <span>Live Now</span>
          <span>+12h</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CITIES.map((city) => {
          const timeStr = new Intl.DateTimeFormat('en-US', {
            timeZone: city.tz,
            hour: '2-digit',
            minute: '2-digit',
            second: liveMode ? '2-digit' : undefined,
            hour12: true,
          }).format(targetDate);

          const dateStr = new Intl.DateTimeFormat('en-US', {
            timeZone: city.tz,
            weekday: 'short',
            month: 'short',
            day: 'numeric',
          }).format(targetDate);

          const hour24 = Number(
            new Intl.DateTimeFormat('en-US', {
              timeZone: city.tz,
              hour: 'numeric',
              hour12: false,
            }).format(targetDate)
          );
          const isBusinessHours = hour24 >= 9 && hour24 < 18;

          return (
            <div
              key={city.tz}
              className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm">{city.name}</div>
                  <div className="text-[11px] text-neutral-400">{city.code}</div>
                </div>
                <span
                  className={`text-[11px] font-semibold ${
                    isBusinessHours ? 'text-[#000000] dark:text-[#FFFFFF]' : 'text-neutral-400'
                  }`}
                >
                  {isBusinessHours ? 'Work Hours' : 'Off Hours'}
                </span>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-extrabold font-mono tabular-nums">{timeStr}</div>
                <div className="text-xs text-neutral-500 mt-0.5">{dateStr}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 2. Daily Habit & Streak Tracker (LocalStorage)
// -------------------------------------------------------------
interface Habit {
  id: string;
  name: string;
  days: Record<string, boolean>;
}

const getLast7Days = () => {
  const out: { key: string; label: string }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const label = i === 0 ? 'Today' : d.toLocaleDateString('en-US', { weekday: 'short' });
    out.push({ key, label });
  }
  return out;
};

export const HabitTrackerTool: React.FC = () => {
  const days = getLast7Days();
  const [habits, setHabits] = useState<Habit[]>(() => {
    try {
      const saved = localStorage.getItem('asbily_habits');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [
      { id: '1', name: 'Deep Focus Work (60 min)', days: {} },
      { id: '2', name: 'Exercise / Walk (30 min)', days: {} },
      { id: '3', name: 'Read 15 Pages', days: {} },
    ];
  });
  const [newHabit, setNewHabit] = useState('');

  useEffect(() => {
    localStorage.setItem('asbily_habits', JSON.stringify(habits));
  }, [habits]);

  const addHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabit.trim()) return;
    setHabits((prev) => [...prev, { id: String(Date.now()), name: newHabit.trim(), days: {} }]);
    setNewHabit('');
  };

  const toggleDay = (habitId: string, dayKey: string) => {
    setHabits((prev) =>
      prev.map((h) =>
        h.id === habitId ? { ...h, days: { ...h.days, [dayKey]: !h.days[dayKey] } } : h
      )
    );
  };

  const calcStreak = (h: Habit) => {
    let streak = 0;
    for (let i = days.length - 1; i >= 0; i--) {
      if (h.days[days[i].key]) streak++;
      else break;
    }
    return streak;
  };

  return (
    <div className="space-y-6">
      <form onSubmit={addHabit} className="flex gap-2">
        <input
          type="text"
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
          placeholder="Add a daily habit (e.g. Drink 2L Water, Code 1hr)..."
          className="flex-1 p-2.5 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-950 text-sm"
        />
        <button
          type="submit"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#000000] hover:bg-[#090909] dark:bg-[#FFFFFF] dark:hover:bg-[#EDEDED] text-[#FFFFFF] dark:text-[#000000] text-xs font-semibold cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Habit</span>
        </button>
      </form>

      <div className="overflow-x-auto border border-neutral-200 dark:border-neutral-800 rounded-xl">
        <table className="w-full text-xs text-left">
          <thead className="bg-[#F6F6F6] dark:bg-[#050505] border-b border-neutral-200 dark:border-neutral-800">
            <tr>
              <th className="p-3 font-semibold text-neutral-500">Habit</th>
              {days.map((d) => (
                <th key={d.key} className="p-3 font-semibold text-neutral-500 text-center">{d.label}</th>
              ))}
              <th className="p-3 font-semibold text-neutral-500 text-center">Streak</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800 bg-white dark:bg-[#090909]">
            {habits.map((h) => {
              const streak = calcStreak(h);
              return (
                <tr key={h.id} className="hover:bg-[#F6F6F6]/70 dark:hover:bg-white/5">
                  <td className="p-3 font-semibold min-w-[160px]">{h.name}</td>
                  {days.map((d) => {
                    const checked = Boolean(h.days[d.key]);
                    return (
                      <td key={d.key} className="p-2 text-center">
                        <button
                          type="button"
                          onClick={() => toggleDay(h.id, d.key)}
                          className={`w-8 h-8 rounded-lg inline-flex items-center justify-center border transition cursor-pointer ${
                            checked
                              ? 'bg-[#000000] border-[#000000] text-[#FFFFFF] dark:bg-[#FFFFFF] dark:border-[#FFFFFF] dark:text-[#000000]'
                              : 'border-neutral-200 dark:border-neutral-800 hover:border-[#000000] dark:hover:border-[#FFFFFF]'
                          }`}
                        >
                          {checked && <Check className="w-4 h-4" />}
                        </button>
                      </td>
                    );
                  })}
                  <td className="p-3 text-center font-mono tabular-nums font-bold">
                    <span className="inline-flex items-center gap-1 text-[#000000] dark:text-[#FFFFFF]">
                      <Flame className="w-3.5 h-3.5" />
                      {streak}d
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      type="button"
                      onClick={() => setHabits((prev) => prev.filter((x) => x.id !== h.id))}
                      className="text-neutral-400 hover:text-[#000000] dark:hover:text-[#FFFFFF] cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 3. Real Typing Speed (WPM) & Accuracy Test
// -------------------------------------------------------------
const PASSAGES = {
  english:
    'Building reliable software requires clear thinking, disciplined testing, and thoughtful design. When tools run directly inside the browser, users keep full control over their files and privacy without waiting for slow server uploads.',
  code:
    'export async function compressAsset(file: File, quality = 0.85): Promise<Blob> { const bitmap = await createImageBitmap(file); const canvas = document.createElement("canvas"); canvas.width = bitmap.width; return new Promise((resolve) => canvas.toBlob((b) => resolve(b!), "image/webp", quality)); }',
};

export const TypingSpeedTestTool: React.FC = () => {
  const [mode, setMode] = useState<'english' | 'code'>('english');
  const [duration, setDuration] = useState(60);
  const [timeLeft, setTimeLeft] = useState(60);
  const [typed, setTyped] = useState('');
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [bestWpm, setBestWpm] = useState<number>(() => Number(localStorage.getItem('asbily_best_wpm') || '0'));
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const targetText = PASSAGES[mode];

  useEffect(() => {
    if (!started || finished) return;
    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setFinished(true);
          setStarted(false);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [started, finished]);

  const elapsedSec = Math.max(1, duration - timeLeft);
  let correctChars = 0;
  for (let i = 0; i < typed.length; i++) {
    if (typed[i] === targetText[i]) correctChars++;
  }
  const accuracy = typed.length > 0 ? Math.round((correctChars / typed.length) * 100) : 100;
  const wpm = Math.round((correctChars / 5) / (elapsedSec / 60));
  const cpm = Math.round(correctChars / (elapsedSec / 60));

  useEffect(() => {
    if (finished && wpm > bestWpm) {
      setBestWpm(wpm);
      localStorage.setItem('asbily_best_wpm', String(wpm));
    }
  }, [finished, wpm, bestWpm]);

  const handleReset = (nextDur = duration) => {
    setStarted(false);
    setFinished(false);
    setTyped('');
    setTimeLeft(nextDur);
    setTimeout(() => inputRef.current?.focus(), 40);
  };

  const handleChange = (val: string) => {
    if (finished) return;
    if (!started && val.length > 0) setStarted(true);
    setTyped(val.slice(0, targetText.length));
    if (val.length >= targetText.length) {
      setFinished(true);
      setStarted(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="inline-flex p-1 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <button type="button" onClick={() => { setMode('english'); handleReset(); }} className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${mode === 'english' ? 'bg-neutral-900 text-white dark:bg-white dark:text-black' : 'text-neutral-500'}`}>
              English Prose
            </button>
            <button type="button" onClick={() => { setMode('code'); handleReset(); }} className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${mode === 'code' ? 'bg-neutral-900 text-white dark:bg-white dark:text-black' : 'text-neutral-500'}`}>
              TypeScript Code
            </button>
          </div>

          <div className="inline-flex p-1 rounded-xl bg-[#F6F6F6] dark:bg-[#050505] border border-neutral-200 dark:border-neutral-800">
            {[30, 60, 120].map((sec) => (
              <button
                key={sec}
                type="button"
                onClick={() => { setDuration(sec); handleReset(sec); }}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-semibold cursor-pointer ${
                  duration === sec ? 'bg-[#000000] text-[#FFFFFF] dark:bg-[#FFFFFF] dark:text-[#000000]' : 'text-neutral-500'
                }`}
              >
                {sec}s
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => handleReset()}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 text-xs font-semibold hover:bg-[#F6F6F6] dark:hover:bg-white/10 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restart</span>
        </button>
      </div>

      {/* Live Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-[#F6F6F6] dark:bg-[#050505]">
          <div className="text-[11px] text-neutral-500 font-semibold uppercase">Speed (WPM)</div>
          <div className="text-2xl font-extrabold font-mono tabular-nums text-[#000000] dark:text-[#FFFFFF]">{wpm}</div>
        </div>
        <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-[#F6F6F6] dark:bg-[#050505]">
          <div className="text-[11px] text-neutral-500 font-semibold uppercase">Accuracy</div>
          <div className="text-2xl font-extrabold font-mono tabular-nums">{accuracy}%</div>
        </div>
        <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-[#F6F6F6] dark:bg-[#050505]">
          <div className="text-[11px] text-neutral-500 font-semibold uppercase">Time Left</div>
          <div className="text-2xl font-extrabold font-mono tabular-nums">{timeLeft}s</div>
        </div>
        <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-[#F6F6F6] dark:bg-[#050505]">
          <div className="text-[11px] text-neutral-500 font-semibold uppercase flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-[#000000] dark:text-[#FFFFFF]" />
            <span>Personal Best</span>
          </div>
          <div className="text-2xl font-extrabold font-mono tabular-nums">{bestWpm} WPM</div>
        </div>
      </div>

      {/* Prompt Display */}
      <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#090909] font-mono text-sm sm:text-base leading-relaxed select-none">
        {targetText.split('').map((ch, idx) => {
          let cls = 'text-neutral-400 dark:text-neutral-600';
          if (idx < typed.length) {
            cls =
              typed[idx] === ch
                ? 'text-[#000000] dark:text-[#FFFFFF] font-semibold'
                : 'bg-[#000000] text-[#FFFFFF] dark:bg-[#FFFFFF] dark:text-[#000000] line-through';
          } else if (idx === typed.length) {
            cls = 'text-[#000000] dark:text-[#FFFFFF] bg-[#EDEDED] dark:bg-white/20 rounded-xs';
          }
          return (
            <span key={idx} className={cls}>
              {ch}
            </span>
          );
        })}
      </div>

      <textarea
        ref={inputRef}
        value={typed}
        onChange={(e) => handleChange(e.target.value)}
        disabled={finished}
        rows={3}
        placeholder="Click here and start typing to begin the timer..."
        className="w-full p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-[#F6F6F6] dark:bg-[#050505] font-mono text-sm focus:outline-none focus:border-[#000000] dark:focus:border-[#FFFFFF]"
      />

      {finished && (
        <div className="p-4 rounded-xl border border-black/15 dark:border-white/15 bg-[#F6F6F6] dark:bg-[#050505] text-xs flex flex-wrap items-center justify-between gap-2">
          <span>
            Completed! Final Speed: <strong>{wpm} WPM</strong> ({cpm} CPM) · Accuracy: <strong>{accuracy}%</strong>
          </span>
          <button type="button" onClick={() => handleReset()} className="px-3 py-1.5 rounded-lg bg-[#000000] text-[#FFFFFF] dark:bg-[#FFFFFF] dark:text-[#000000] font-semibold cursor-pointer">
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};
