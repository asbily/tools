import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Copy, Check, Plus, Trash2, Play, Pause, RotateCcw, DollarSign, Building, Clock, CheckSquare, Dices, Shuffle } from 'lucide-react';
import { WorldClockPlannerTool, HabitTrackerTool, TypingSpeedTestTool } from './ProductivityProTools';

interface BusinessToolProps {
  toolId: string;
}

export const BusinessProductivityTools: React.FC<BusinessToolProps> = ({ toolId }) => {
  const [copied, setCopied] = useState(false);

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (toolId === 'expense-tracker') return <ExpenseTrackerTool />;
  if (toolId === 'business-names') return <BusinessNamesTool onCopy={copyText} copied={copied} />;
  if (toolId === 'meeting-agenda') return <MeetingAgendaTool onCopy={copyText} copied={copied} />;
  if (toolId === 'todo-list') return <TodoListTool />;
  if (toolId === 'pomodoro-timer') return <PomodoroTimerTool />;
  if (toolId === 'stopwatch') return <StopwatchTool />;
  if (toolId === 'random-picker') return <RandomPickerTool />;
  if (toolId === 'world-clock-planner') return <WorldClockPlannerTool />;
  if (toolId === 'habit-tracker') return <HabitTrackerTool />;
  if (toolId === 'typing-speed-test') return <TypingSpeedTestTool />;

  return <div className="text-neutral-500">Business/Productivity tool not found.</div>;
};

// -------------------------------------------------------------
// Component: Simple Expense & Budget Tracker
// -------------------------------------------------------------
const ExpenseTrackerTool: React.FC = () => {
  const [transactions, setTransactions] = useState<{ id: string; desc: string; amount: number; type: 'income' | 'expense'; category: string }[]>(() => {
    const saved = localStorage.getItem('asbily_expenses');
    return saved ? JSON.parse(saved) : [
      { id: '1', desc: 'SaaS Client Retainer', amount: 2500, type: 'income', category: 'Revenue' },
      { id: '2', desc: 'Cloud Server Hosting', amount: 80, type: 'expense', category: 'Infrastructure' },
      { id: '3', desc: 'Office Supplies', amount: 45, type: 'expense', category: 'Operations' },
    ];
  });

  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [category, setCategory] = useState('Operations');

  useEffect(() => {
    localStorage.setItem('asbily_expenses', JSON.stringify(transactions));
  }, [transactions]);

  const addTx = () => {
    const num = parseFloat(amount);
    if (!desc.trim() || isNaN(num) || num <= 0) return;
    setTransactions((prev) => [
      ...prev,
      { id: Math.random().toString(36).substring(7), desc: desc.trim(), amount: num, type, category },
    ]);
    setDesc('');
    setAmount('');
  };

  const removeTx = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const { totalIncome, totalExpense, balance } = useMemo(() => {
    let inc = 0;
    let exp = 0;
    transactions.forEach((t) => {
      if (t.type === 'income') inc += t.amount;
      else exp += t.amount;
    });
    return { totalIncome: inc, totalExpense: exp, balance: inc - exp };
  }, [transactions]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-center">
          <div className="text-xs font-semibold text-neutral-500 uppercase">Total Income</div>
          <div className="text-2xl font-bold font-mono mt-1 text-emerald-600">${totalIncome.toFixed(2)}</div>
        </div>
        <div className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-center">
          <div className="text-xs font-semibold text-neutral-500 uppercase">Total Expenses</div>
          <div className="text-2xl font-bold font-mono mt-1 text-red-500">${totalExpense.toFixed(2)}</div>
        </div>
        <div className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-center">
          <div className="text-xs font-semibold text-neutral-500 uppercase">Net Balance</div>
          <div className={`text-2xl font-bold font-mono mt-1 ${balance >= 0 ? 'text-[#111111] dark:text-neutral-100' : 'text-red-600'}`}>
            ${balance.toFixed(2)}
          </div>
        </div>
      </div>

      <div className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900 space-y-3">
        <div className="text-xs font-semibold text-neutral-500 uppercase">Record New Entry</div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
          <input
            type="text"
            placeholder="Description (e.g. Hosting)"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="p-2 border rounded text-xs bg-white dark:bg-neutral-950 sm:col-span-2"
          />
          <input
            type="number"
            placeholder="Amount ($)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="p-2 border rounded text-xs bg-white dark:bg-neutral-950"
          />
          <select value={type} onChange={(e) => setType(e.target.value as any)} className="p-2 border rounded text-xs bg-white dark:bg-neutral-950">
            <option value="expense">Expense (-)</option>
            <option value="income">Income (+)</option>
          </select>
        </div>
        <button onClick={addTx} className="px-4 py-2 bg-[#111111] text-white dark:bg-white dark:text-black rounded text-xs font-medium">
          Add Transaction
        </button>
      </div>

      <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg divide-y divide-neutral-200 dark:divide-neutral-800">
        {transactions.map((t) => (
          <div key={t.id} className="p-3 bg-white dark:bg-neutral-950 flex items-center justify-between text-xs">
            <div>
              <span className="font-semibold text-neutral-900 dark:text-neutral-100">{t.desc}</span>
              <span className="ml-2 text-neutral-400">({t.category})</span>
            </div>
            <div className="flex items-center gap-3">
              <span className={`font-mono font-bold ${t.type === 'income' ? 'text-emerald-600' : 'text-red-500'}`}>
                {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
              </span>
              <button onClick={() => removeTx(t.id)} className="text-neutral-400 hover:text-red-500">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// Component: Business Name & Brand Ideas Generator
// -------------------------------------------------------------
const BusinessNamesTool: React.FC<{ onCopy: (t: string) => void; copied: boolean }> = ({ onCopy }) => {
  const [keyword, setKeyword] = useState('cloud');
  const [style, setStyle] = useState<'modern' | 'minimal' | 'tech' | 'fintech'>('tech');

  const names = useMemo(() => {
    const k = keyword.trim().toLowerCase() || 'zen';
    const cap = k.charAt(0).toUpperCase() + k.slice(1);

    const patterns = [
      `${cap}flow`, `${cap}ly`, `${cap}scale`, `${cap}hub`, `Omni${cap}`,
      `${cap}stack`, `Nova${cap}`, `${cap}pulse`, `${cap}craft`, `${cap}wave`,
      `Sync${cap}`, `${cap}sphere`, `Meta${cap}`, `${cap}grid`, `${cap}forge`,
      `${cap}nest`, `Velo${cap}`, `Aura${cap}`, `${cap}base`, `Pure${cap}`
    ];
    return patterns;
  }, [keyword, style]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Seed Keyword</label>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="e.g. cloud, pay, apex, data, studio"
            className="w-full p-2.5 border rounded bg-white dark:bg-neutral-950 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Naming Theme</label>
          <select value={style} onChange={(e) => setStyle(e.target.value as any)} className="w-full p-2.5 border rounded bg-white dark:bg-neutral-950 text-sm">
            <option value="tech">Modern Tech</option>
            <option value="minimal">Minimalist Short</option>
            <option value="modern">SaaS & Platform</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {names.map((n) => (
          <div key={n} className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-3 bg-neutral-50 dark:bg-neutral-900 flex items-center justify-between">
            <span className="font-semibold text-sm text-[#111111] dark:text-neutral-100">{n}</span>
            <button onClick={() => onCopy(n)} className="text-neutral-400 hover:text-black dark:hover:text-white">
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// Component: Meeting Agenda Maker
// -------------------------------------------------------------
const MeetingAgendaTool: React.FC<{ onCopy: (t: string) => void; copied: boolean }> = ({ onCopy, copied }) => {
  const [title, setTitle] = useState('Q4 Product Roadmap Sync');
  const [date, setDate] = useState('2026-10-15');
  const [items, setItems] = useState([
    { topic: 'Opening & Wins', owner: 'Team Lead', duration: 10 },
    { topic: 'Feature Architecture Review', owner: 'Engineering Lead', duration: 25 },
    { topic: 'Design System Discussion', owner: 'UI Designer', duration: 15 },
    { topic: 'Next Milestones & Action Items', owner: 'Product Manager', duration: 10 },
  ]);

  const totalMinutes = items.reduce((acc, it) => acc + (it.duration || 0), 0);

  const formattedAgenda = useMemo(() => {
    let text = `AGENDA: ${title}\nDate: ${date}\nEstimated Duration: ${totalMinutes} mins\n\n`;
    items.forEach((it, idx) => {
      text += `${idx + 1}. ${it.topic} (${it.duration}m) — Lead: ${it.owner}\n`;
    });
    return text;
  }, [title, date, items, totalMinutes]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Meeting Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border rounded bg-white dark:bg-neutral-950 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full p-2 border rounded bg-white dark:bg-neutral-950 text-sm" />
        </div>
      </div>

      <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 bg-neutral-50 dark:bg-neutral-900">
        <div className="flex justify-between items-center text-xs font-semibold text-neutral-500 uppercase mb-2">
          <span>Agenda Items (Total {totalMinutes} mins)</span>
        </div>
        <div className="space-y-2">
          {items.map((it, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                type="text"
                value={it.topic}
                onChange={(e) => {
                  const val = e.target.value;
                  setItems((prev) => prev.map((item, i) => (i === idx ? { ...item, topic: val } : item)));
                }}
                className="flex-1 p-1.5 border rounded text-xs bg-white dark:bg-neutral-950"
              />
              <input
                type="text"
                value={it.owner}
                onChange={(e) => {
                  const val = e.target.value;
                  setItems((prev) => prev.map((item, i) => (i === idx ? { ...item, owner: val } : item)));
                }}
                className="w-28 p-1.5 border rounded text-xs bg-white dark:bg-neutral-950"
              />
              <input
                type="number"
                value={it.duration}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 0;
                  setItems((prev) => prev.map((item, i) => (i === idx ? { ...item, duration: val } : item)));
                }}
                className="w-16 p-1.5 border rounded text-xs text-center bg-white dark:bg-neutral-950"
              />
              <span className="text-xs text-neutral-400">m</span>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => onCopy(formattedAgenda)}
        className="inline-flex items-center gap-1.5 px-4 py-2 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-900 transition"
      >
        {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
        Copy Formatted Agenda
      </button>
    </div>
  );
};

// -------------------------------------------------------------
// Component: Focus To-Do List
// -------------------------------------------------------------
const TodoListTool: React.FC = () => {
  const [todos, setTodos] = useState<{ id: string; text: string; done: boolean; priority: 'low' | 'med' | 'high' }[]>(() => {
    const saved = localStorage.getItem('asbily_todos');
    return saved ? JSON.parse(saved) : [
      { id: '1', text: 'Audit website responsiveness on mobile devices', done: false, priority: 'high' },
      { id: '2', text: 'Generate production robots.txt and sitemap.xml', done: true, priority: 'med' },
      { id: '3', text: 'Check SSL and security headers', done: false, priority: 'low' },
    ];
  });

  const [input, setInput] = useState('');
  const [priority, setPriority] = useState<'low' | 'med' | 'high'>('med');

  useEffect(() => {
    localStorage.setItem('asbily_todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (!input.trim()) return;
    setTodos((prev) => [
      ...prev,
      { id: Math.random().toString(36).substring(7), text: input.trim(), done: false, priority },
    ]);
    setInput('');
  };

  const toggle = (id: string) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const remove = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTodo()}
          placeholder="What do you need to accomplish today?"
          className="flex-1 p-2.5 border rounded-lg bg-white dark:bg-neutral-950 text-sm"
        />
        <select value={priority} onChange={(e) => setPriority(e.target.value as any)} className="p-2 border rounded-lg text-xs bg-white dark:bg-neutral-950">
          <option value="high">High Priority</option>
          <option value="med">Medium Priority</option>
          <option value="low">Low Priority</option>
        </select>
        <button onClick={addTodo} className="px-4 py-2 bg-[#111111] text-white dark:bg-white dark:text-black rounded-lg text-xs font-semibold">
          Add
        </button>
      </div>

      <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg divide-y divide-neutral-200 dark:divide-neutral-800">
        {todos.map((t) => (
          <div key={t.id} className="p-3 bg-white dark:bg-neutral-950 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={t.done}
                onChange={() => toggle(t.id)}
                className="accent-black dark:accent-white cursor-pointer"
              />
              <span className={`text-xs ${t.done ? 'line-through text-neutral-400' : 'text-neutral-900 dark:text-neutral-100 font-medium'}`}>
                {t.text}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-semibold ${
                t.priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400' :
                t.priority === 'med' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400' :
                'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'
              }`}>
                {t.priority}
              </span>
              <button onClick={() => remove(t.id)} className="text-neutral-400 hover:text-red-500">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// Component: Pomodoro Focus Timer with Web Audio Chime
// -------------------------------------------------------------
const PomodoroTimerTool: React.FC = () => {
  const [mode, setMode] = useState<'work' | 'shortBreak' | 'longBreak'>('work');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);

  const playChime = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.8);
    } catch {
      // AudioContext not allowed
    }
  };

  useEffect(() => {
    let timer: any = null;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      playChime();
      setIsRunning(false);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const switchMode = (m: 'work' | 'shortBreak' | 'longBreak') => {
    setMode(m);
    setIsRunning(false);
    if (m === 'work') setTimeLeft(25 * 60);
    if (m === 'shortBreak') setTimeLeft(5 * 60);
    if (m === 'longBreak') setTimeLeft(15 * 60);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeString = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <div className="max-w-md mx-auto text-center space-y-6">
      <div className="flex justify-center gap-2">
        <button
          onClick={() => switchMode('work')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
            mode === 'work' ? 'bg-[#111111] text-white dark:bg-white dark:text-black' : 'border'
          }`}
        >
          Focus (25m)
        </button>
        <button
          onClick={() => switchMode('shortBreak')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
            mode === 'shortBreak' ? 'bg-[#111111] text-white dark:bg-white dark:text-black' : 'border'
          }`}
        >
          Short Break (5m)
        </button>
        <button
          onClick={() => switchMode('longBreak')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
            mode === 'longBreak' ? 'bg-[#111111] text-white dark:bg-white dark:text-black' : 'border'
          }`}
        >
          Long Break (15m)
        </button>
      </div>

      <div className="text-7xl font-mono font-bold tracking-tighter text-[#111111] dark:text-neutral-100 my-6">
        {timeString}
      </div>

      <div className="flex justify-center gap-3">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#111111] text-white dark:bg-white dark:text-black rounded-lg text-sm font-semibold"
        >
          {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {isRunning ? 'Pause' : 'Start Focus'}
        </button>
        <button
          onClick={() => {
            setIsRunning(false);
            switchMode(mode);
          }}
          className="p-2.5 border rounded-lg text-neutral-600 dark:text-neutral-400"
          title="Reset timer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// Component: Stopwatch & Precision Timer
// -------------------------------------------------------------
const StopwatchTool: React.FC = () => {
  const [ms, setMs] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);

  useEffect(() => {
    let interval: any = null;
    if (running) {
      interval = setInterval(() => {
        setMs((prev) => prev + 10);
      }, 10);
    }
    return () => clearInterval(interval);
  }, [running]);

  const format = (timeMs: number) => {
    const mins = Math.floor(timeMs / 60000);
    const secs = Math.floor((timeMs % 60000) / 1000);
    const msecs = Math.floor((timeMs % 1000) / 10);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(msecs).padStart(2, '0')}`;
  };

  return (
    <div className="max-w-md mx-auto text-center space-y-6">
      <div className="text-6xl font-mono font-bold text-[#111111] dark:text-neutral-100">{format(ms)}</div>

      <div className="flex justify-center gap-3">
        <button
          onClick={() => setRunning(!running)}
          className="px-6 py-2 bg-[#111111] text-white dark:bg-white dark:text-black rounded-lg text-sm font-semibold"
        >
          {running ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={() => {
            if (running) setLaps((prev) => [ms, ...prev]);
            else {
              setMs(0);
              setLaps([]);
            }
          }}
          className="px-4 py-2 border rounded-lg text-sm font-semibold"
        >
          {running ? 'Lap' : 'Reset'}
        </button>
      </div>

      {laps.length > 0 && (
        <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-3 max-h-48 overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-900 text-xs font-mono">
          {laps.map((lapTime, idx) => (
            <div key={idx} className="py-1.5 flex justify-between">
              <span>Lap {laps.length - idx}</span>
              <span>{format(lapTime)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// -------------------------------------------------------------
// Component: Random Choice & Team Generator
// -------------------------------------------------------------
const RandomPickerTool: React.FC = () => {
  const [itemsText, setItemsText] = useState('Option A\nOption B\nOption C\nOption D\nOption E');
  const [winner, setWinner] = useState<string | null>(null);
  const [teamCount, setTeamCount] = useState(2);
  const [teams, setTeams] = useState<string[][]>([]);

  const pickOne = () => {
    const list = itemsText.split('\n').filter((l) => l.trim());
    if (list.length === 0) return;
    const randomIdx = Math.floor(Math.random() * list.length);
    setWinner(list[randomIdx].trim());
  };

  const generateTeams = () => {
    const list = itemsText.split('\n').filter((l) => l.trim());
    const shuffled = [...list].sort(() => Math.random() - 0.5);
    const res: string[][] = Array.from({ length: teamCount }, () => []);

    shuffled.forEach((name, i) => {
      res[i % teamCount].push(name.trim());
    });
    setTeams(res);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Items / Names List (one per line)</label>
        <textarea
          value={itemsText}
          onChange={(e) => setItemsText(e.target.value)}
          rows={6}
          className="w-full p-3 border rounded-lg bg-white dark:bg-neutral-950 font-mono text-xs"
        />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button
          onClick={pickOne}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#111111] text-white dark:bg-white dark:text-black rounded-lg text-sm font-semibold"
        >
          <Dices className="w-4 h-4" /> Pick Random Choice
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs">Into</span>
          <input
            type="number"
            min={2}
            max={10}
            value={teamCount}
            onChange={(e) => setTeamCount(parseInt(e.target.value) || 2)}
            className="w-14 p-1.5 border rounded text-xs text-center"
          />
          <span className="text-xs">Teams</span>
          <button onClick={generateTeams} className="px-4 py-2 border rounded-lg text-xs font-semibold">
            Divide Teams
          </button>
        </div>
      </div>

      {winner && (
        <div className="p-6 border-2 border-emerald-500/40 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl text-center">
          <div className="text-xs uppercase font-semibold text-emerald-600">Selected Winner</div>
          <div className="text-2xl font-bold mt-1 text-[#111111] dark:text-neutral-100">{winner}</div>
        </div>
      )}

      {teams.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {teams.map((t, idx) => (
            <div key={idx} className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-3 bg-neutral-50 dark:bg-neutral-900">
              <div className="text-xs font-semibold text-neutral-500 uppercase mb-2">Team {idx + 1} ({t.length})</div>
              <ul className="text-xs space-y-1">
                {t.map((name, i) => (
                  <li key={i} className="font-medium">• {name}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
