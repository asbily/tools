import React, { useState, useEffect, useMemo } from 'react';
import { Copy, Check, Plus, Trash2, GraduationCap, Award, BookMarked, Download, RefreshCw, RotateCcw } from 'lucide-react';

interface StudentToolProps {
  toolId: string;
}

export const StudentTools: React.FC<StudentToolProps> = ({ toolId }) => {
  const [copied, setCopied] = useState(false);

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (toolId === 'gpa-calculator') return <GpaCalculatorTool />;
  if (toolId === 'exam-percentage') return <ExamPercentageTool />;
  if (toolId === 'flashcards') return <FlashcardsTool />;
  if (toolId === 'citation-generator') return <CitationGeneratorTool onCopy={copyText} copied={copied} />;
  if (toolId === 'study-notes') return <StudyNotesTool onCopy={copyText} copied={copied} />;

  return <div className="text-neutral-500">Student tool not found.</div>;
};

// -------------------------------------------------------------
// Component: GPA & CGPA Calculator
// -------------------------------------------------------------
const DEFAULT_COURSES = [
  { name: 'Data Structures', credits: 3, grade: 4.0 },
  { name: 'Linear Algebra', credits: 3, grade: 3.75 },
  { name: 'Technical Writing', credits: 2, grade: 3.5 },
  { name: 'Physics Lab', credits: 1, grade: 4.0 },
];

const GpaCalculatorTool: React.FC = () => {
  const [courses, setCourses] = useState<{ name: string; credits: number; grade: number }[]>(() => {
    try {
      const saved = localStorage.getItem('asbily_gpa_courses');
      return saved ? JSON.parse(saved) : DEFAULT_COURSES;
    } catch {
      return DEFAULT_COURSES;
    }
  });

  const [priorCredits, setPriorCredits] = useState(() => {
    try {
      const s = localStorage.getItem('asbily_gpa_prior_credits');
      return s !== null ? Number(s) : 30;
    } catch {
      return 30;
    }
  });
  const [priorCgpa, setPriorCgpa] = useState(() => {
    try {
      const s = localStorage.getItem('asbily_gpa_prior_cgpa');
      return s !== null ? Number(s) : 3.6;
    } catch {
      return 3.6;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('asbily_gpa_courses', JSON.stringify(courses));
      localStorage.setItem('asbily_gpa_prior_credits', String(priorCredits));
      localStorage.setItem('asbily_gpa_prior_cgpa', String(priorCgpa));
    } catch {
      // ignore storage quota errors
    }
  }, [courses, priorCredits, priorCgpa]);

  const addCourse = () => {
    setCourses((prev) => [...prev, { name: 'New Course', credits: 3, grade: 3.75 }]);
  };

  const removeCourse = (idx: number) => {
    setCourses((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateCourse = (idx: number, field: string, val: any) => {
    setCourses((prev) => prev.map((c, i) => (i === idx ? { ...c, [field]: val } : c)));
  };

  const { semesterGpa, totalCredits } = useMemo(() => {
    let pts = 0;
    let creds = 0;
    courses.forEach((c) => {
      pts += (c.credits || 0) * (c.grade || 0);
      creds += c.credits || 0;
    });
    return {
      semesterGpa: creds > 0 ? (pts / creds).toFixed(2) : '0.00',
      totalCredits: creds,
    };
  }, [courses]);

  const cumulativeCgpa = useMemo(() => {
    const priorTotalPoints = priorCredits * priorCgpa;
    const currentPoints = courses.reduce((acc, c) => acc + c.credits * c.grade, 0);
    const combinedCredits = priorCredits + totalCredits;
    return combinedCredits > 0 ? ((priorTotalPoints + currentPoints) / combinedCredits).toFixed(2) : '0.00';
  }, [priorCredits, priorCgpa, courses, totalCredits]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="text-xs font-semibold text-neutral-500 uppercase">Current Semester Courses</div>
        <button onClick={addCourse} className="text-xs px-3 py-1.5 border rounded flex items-center gap-1 bg-white dark:bg-neutral-950">
          <Plus className="w-3.5 h-3.5" /> Add Course
        </button>
      </div>

      <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden divide-y divide-neutral-200 dark:divide-neutral-800">
        {courses.map((c, idx) => (
          <div key={idx} className="p-3 bg-white dark:bg-neutral-950 flex flex-col sm:flex-row sm:items-center gap-3">
            <input
              type="text"
              value={c.name}
              onChange={(e) => updateCourse(idx, 'name', e.target.value)}
              placeholder="Course title"
              className="w-full sm:flex-1 p-1.5 border rounded text-xs"
            />
            <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3">
              <div className="flex items-center gap-1">
                <span className="text-xs text-neutral-400">Credits:</span>
                <input
                  type="number"
                  min={1}
                  max={6}
                  value={c.credits}
                  onChange={(e) => updateCourse(idx, 'credits', parseFloat(e.target.value) || 0)}
                  className="w-14 p-1.5 border rounded text-xs text-center"
                />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs text-neutral-400">Grade:</span>
                <select
                  value={c.grade}
                  onChange={(e) => updateCourse(idx, 'grade', parseFloat(e.target.value))}
                  className="p-1.5 border rounded text-xs"
                >
                  <option value={4.0}>A+ / A (4.00)</option>
                  <option value={3.75}>A- (3.75)</option>
                  <option value={3.5}>B+ (3.50)</option>
                  <option value={3.25}>B (3.25)</option>
                  <option value={3.0}>B- (3.00)</option>
                  <option value={2.75}>C+ (2.75)</option>
                  <option value={2.5}>C (2.50)</option>
                  <option value={2.25}>D (2.25)</option>
                  <option value={0.0}>F (0.00)</option>
                </select>
              </div>
              <button onClick={() => removeCourse(idx)} className="p-1 text-neutral-400 hover:text-[#000000] dark:hover:text-[#FFFFFF]">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-center">
          <div className="text-xs font-semibold text-neutral-500 uppercase">Semester GPA ({totalCredits} Credits)</div>
          <div className="text-3xl font-bold font-mono mt-1 text-[#000000] dark:text-[#FFFFFF]">{semesterGpa} / 4.0</div>
        </div>

        <div className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900">
          <div className="text-xs font-semibold text-neutral-500 uppercase mb-2">Cumulative CGPA Calculation</div>
          <div className="grid grid-cols-2 gap-2 text-xs mb-2">
            <div>
              <span className="text-neutral-400">Prior Credits:</span>
              <input type="number" value={priorCredits} onChange={(e) => setPriorCredits(parseFloat(e.target.value) || 0)} className="w-full p-1 border rounded mt-0.5" />
            </div>
            <div>
              <span className="text-neutral-400">Prior CGPA:</span>
              <input type="number" step="0.01" value={priorCgpa} onChange={(e) => setPriorCgpa(parseFloat(e.target.value) || 0)} className="w-full p-1 border rounded mt-0.5" />
            </div>
          </div>
          <div className="text-center pt-1 border-t text-sm font-bold font-mono text-[#000000] dark:text-[#FFFFFF]">
            Total CGPA: {cumulativeCgpa}
          </div>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// Component: Exam Marks & Grade Calculator
// -------------------------------------------------------------
const ExamPercentageTool: React.FC = () => {
  const [obtained, setObtained] = useState(82);
  const [total, setTotal] = useState(100);

  const percentage = total > 0 ? ((obtained / total) * 100).toFixed(2) : '0';

  const letterGrade = useMemo(() => {
    const p = parseFloat(percentage);
    if (p >= 90) return { grade: 'A+', remark: 'Outstanding' };
    if (p >= 80) return { grade: 'A', remark: 'Excellent' };
    if (p >= 70) return { grade: 'B', remark: 'Good' };
    if (p >= 60) return { grade: 'C', remark: 'Satisfactory' };
    if (p >= 50) return { grade: 'D', remark: 'Pass' };
    return { grade: 'F', remark: 'Fail' };
  }, [percentage]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Marks Obtained</label>
          <input type="number" value={obtained} onChange={(e) => setObtained(parseFloat(e.target.value) || 0)} className="w-full p-2.5 border rounded bg-white dark:bg-neutral-950 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Total Possible Marks</label>
          <input type="number" value={total} onChange={(e) => setTotal(parseFloat(e.target.value) || 1)} className="w-full p-2.5 border rounded bg-white dark:bg-neutral-950 text-sm" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-center">
          <div className="text-xs font-semibold text-neutral-500 uppercase">Score Percentage</div>
          <div className="text-2xl font-bold font-mono mt-1 text-[#000000] dark:text-[#FFFFFF]">{percentage}%</div>
        </div>
        <div className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-center">
          <div className="text-xs font-semibold text-neutral-500 uppercase">Letter Grade</div>
          <div className="text-2xl font-bold font-mono mt-1 text-[#000000] dark:text-[#FFFFFF]">{letterGrade.grade}</div>
        </div>
        <div className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-center">
          <div className="text-xs font-semibold text-neutral-500 uppercase">Performance Remark</div>
          <div className="text-lg font-bold mt-1 text-neutral-700 dark:text-neutral-300">{letterGrade.remark}</div>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// Component: Digital Flashcards
// -------------------------------------------------------------
const DEFAULT_FLASHCARDS = [
  { question: 'What is the time complexity of quicksort average case?', answer: 'O(n log n)' },
  { question: 'What does ACID stand for in database management?', answer: 'Atomicity, Consistency, Isolation, Durability' },
  { question: 'What is the purpose of DNS?', answer: 'Translates human-readable domain names into IP addresses' },
];

const FlashcardsTool: React.FC = () => {
  const [deck, setDeck] = useState<{ question: string; answer: string }[]>(() => {
    try {
      const saved = localStorage.getItem('asbily_flashcards');
      const parsed = saved ? JSON.parse(saved) : null;
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_FLASHCARDS;
    } catch {
      return DEFAULT_FLASHCARDS;
    }
  });
  const [currentIdx, setCurrentIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [newQ, setNewQ] = useState('');
  const [newA, setNewA] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('asbily_flashcards', JSON.stringify(deck));
    } catch {
      // ignore storage errors
    }
  }, [deck]);

  const current = deck[currentIdx] || deck[0];

  const nextCard = () => {
    setFlipped(false);
    setCurrentIdx((prev) => (prev + 1) % deck.length);
  };

  const prevCard = () => {
    setFlipped(false);
    setCurrentIdx((prev) => (prev - 1 + deck.length) % deck.length);
  };

  const shuffleDeck = () => {
    setFlipped(false);
    setDeck((prev) => {
      const copy = [...prev];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    });
    setCurrentIdx(0);
  };

  const deleteCurrentCard = () => {
    if (deck.length <= 1) return;
    setFlipped(false);
    setDeck((prev) => {
      const next = prev.filter((_, i) => i !== currentIdx);
      setCurrentIdx((idx) => Math.min(idx, next.length - 1));
      return next;
    });
  };

  const addCard = () => {
    if (!newQ.trim() || !newA.trim()) return;
    setDeck((prev) => [...prev, { question: newQ.trim(), answer: newA.trim() }]);
    setNewQ('');
    setNewA('');
  };

  return (
    <div className="space-y-6">
      <div className="text-center text-xs text-neutral-400">
        Card {currentIdx + 1} of {deck.length} — Click card to flip
      </div>

      <div
        onClick={() => setFlipped(!flipped)}
        className="w-full max-w-lg mx-auto h-56 border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-2xl flex flex-col items-center justify-center p-6 text-center cursor-pointer select-none transition-all hover:border-neutral-500 bg-white dark:bg-neutral-950"
      >
        <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
          {flipped ? 'Answer' : 'Question'}
        </div>
        <div className="text-lg font-medium text-[#000000] dark:text-[#FFFFFF]">
          {flipped ? current.answer : current.question}
        </div>
        <div className="text-[11px] text-neutral-400 mt-4">
          (Click to see {flipped ? 'question' : 'answer'})
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
        <button onClick={prevCard} className="px-4 py-2 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs font-semibold">Previous</button>
        <button onClick={() => setFlipped(!flipped)} className="px-4 py-2 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs font-semibold bg-neutral-100 dark:bg-neutral-800">Flip Card</button>
        <button onClick={nextCard} className="px-4 py-2 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs font-semibold">Next Card</button>
        <button onClick={shuffleDeck} className="px-3 py-2 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs font-semibold inline-flex items-center gap-1">
          <RefreshCw className="w-3.5 h-3.5" /> Shuffle
        </button>
        <button
          onClick={deleteCurrentCard}
          disabled={deck.length <= 1}
          className="px-3 py-2 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs font-semibold inline-flex items-center gap-1 disabled:opacity-40"
        >
          <Trash2 className="w-3.5 h-3.5" /> Delete
        </button>
      </div>

      <div className="border-t border-neutral-200 dark:border-neutral-800 pt-6">
        <div className="text-xs font-semibold text-neutral-500 uppercase mb-3">Add Custom Flashcard</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <input type="text" placeholder="Question / Concept" value={newQ} onChange={(e) => setNewQ(e.target.value)} className="p-2 border rounded text-xs bg-white dark:bg-neutral-950" />
          <input type="text" placeholder="Answer / Definition" value={newA} onChange={(e) => setNewA(e.target.value)} className="p-2 border rounded text-xs bg-white dark:bg-neutral-950" />
        </div>
        <button onClick={addCard} className="px-4 py-2 bg-[#000000] text-[#FFFFFF] dark:bg-[#FFFFFF] dark:text-[#000000] rounded text-xs font-medium">
          Add to Deck
        </button>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// Component: Citation & Bibliography Generator
// -------------------------------------------------------------
const CitationGeneratorTool: React.FC<{ onCopy: (t: string) => void; copied: boolean }> = ({ onCopy, copied }) => {
  const [style, setStyle] = useState<'APA' | 'MLA' | 'Chicago' | 'Harvard'>('APA');
  const [author, setAuthor] = useState('Knuth, Donald E.');
  const [title, setTitle] = useState('The Art of Computer Programming');
  const [year, setYear] = useState('1997');
  const [publisher, setPublisher] = useState('Addison-Wesley');
  const [url, setUrl] = useState('');

  const citation = useMemo(() => {
    if (style === 'APA') {
      return `${author} (${year}). *${title}*. ${publisher}.${url ? ` ${url}` : ''}`;
    }
    if (style === 'MLA') {
      return `${author}. *${title}*. ${publisher}, ${year}.${url ? ` ${url}.` : ''}`;
    }
    if (style === 'Chicago') {
      return `${author}. ${year}. *${title}*. ${publisher}.${url ? ` ${url}.` : ''}`;
    }
    // Harvard
    return `${author}, ${year}. *${title}*. ${publisher}.${url ? ` Available at: <${url}>.` : ''}`;
  }, [style, author, title, year, publisher, url]);

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        {(['APA', 'MLA', 'Chicago', 'Harvard'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStyle(s)}
            className={`px-3 py-1.5 rounded text-xs font-semibold ${
              style === s ? 'bg-[#000000] text-[#FFFFFF] dark:bg-[#FFFFFF] dark:text-[#000000]' : 'border border-neutral-200 dark:border-neutral-800'
            }`}
          >
            {s} Style
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Author(s)</label>
          <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} className="w-full p-2 border rounded text-xs bg-white dark:bg-neutral-950" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Work Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border rounded text-xs bg-white dark:bg-neutral-950" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Publication Year</label>
          <input type="text" value={year} onChange={(e) => setYear(e.target.value)} className="w-full p-2 border rounded text-xs bg-white dark:bg-neutral-950" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Publisher or Journal</label>
          <input type="text" value={publisher} onChange={(e) => setPublisher(e.target.value)} className="w-full p-2 border rounded text-xs bg-white dark:bg-neutral-950" />
        </div>
      </div>

      <div className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900">
        <div className="text-xs font-semibold text-neutral-500 uppercase mb-2">Formatted Citation ({style})</div>
        <div className="text-sm font-serif text-[#000000] dark:text-[#FFFFFF]">{citation}</div>
      </div>

      <button
        onClick={() => onCopy(citation.replace(/\*/g, ''))}
        className="inline-flex items-center gap-1.5 px-4 py-2 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-900 transition"
      >
        {copied ? <Check className="w-4 h-4 text-[#000000] dark:text-[#FFFFFF]" /> : <Copy className="w-4 h-4" />}
        Copy Citation
      </button>
    </div>
  );
};

// -------------------------------------------------------------
// Component: Quick Study Notes & Scratchpad
// -------------------------------------------------------------
const StudyNotesTool: React.FC<{ onCopy: (t: string) => void; copied: boolean }> = ({ onCopy, copied }) => {
  const [notes, setNotes] = useState(() => {
    return localStorage.getItem('asbily_study_notes') || '# Study Session Notes\n\n- Key concept 1:\n- Formula to remember:\n';
  });

  const handleNotesChange = (val: string) => {
    setNotes(val);
    localStorage.setItem('asbily_study_notes', val);
  };

  const wordCount = notes.trim() ? notes.trim().split(/\s+/).length : 0;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center text-xs text-neutral-400">
        <span>Auto-saved locally in browser storage</span>
        <span>{wordCount} words · {notes.length} characters</span>
      </div>

      <textarea
        value={notes}
        onChange={(e) => handleNotesChange(e.target.value)}
        rows={12}
        className="w-full p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-950 text-sm leading-relaxed font-mono focus:outline-none"
      />

      <div className="flex gap-3">
        <button
          onClick={() => onCopy(notes)}
          className="inline-flex items-center gap-1.5 px-4 py-2 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-900 transition"
        >
          {copied ? <Check className="w-4 h-4 text-[#000000] dark:text-[#FFFFFF]" /> : <Copy className="w-4 h-4" />}
          Copy Notes
        </button>
      </div>
    </div>
  );
};
