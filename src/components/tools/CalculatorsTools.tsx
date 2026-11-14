import React, { useState, useMemo, useEffect } from 'react';
import {
  Calculator,
  Percent,
  TrendingUp,
  Calendar,
  Landmark,
  Zap,
  ArrowRightLeft,
  Copy,
  Check,
  RotateCcw,
  History,
  FileSpreadsheet,
  Clock,
  Sparkles
} from 'lucide-react';
import { CurrencyConverterTool, HealthBmiTool, BillSplitTaxTool } from './CalculatorProTools';

interface CalcToolProps {
  toolId: string;
}

export const CalculatorsTools: React.FC<CalcToolProps> = ({ toolId }) => {
  if (toolId === 'scientific-calc') return <ScientificCalcTool />;
  if (toolId === 'percentage-calc') return <PercentageCalcTool />;
  if (toolId === 'profit-margin') return <ProfitMarginTool />;
  if (toolId === 'age-date') return <AgeDateTool />;
  if (toolId === 'loan-calculator') return <LoanCalculatorTool />;
  if (toolId === 'electricity-calc') return <ElectricityCalcTool />;
  if (toolId === 'unit-converter') return <UnitConverterTool />;
  if (toolId === 'currency-converter') return <CurrencyConverterTool />;
  if (toolId === 'health-bmi-calculator') return <HealthBmiTool />;
  if (toolId === 'bill-split-tax') return <BillSplitTaxTool />;

  return <div className="text-neutral-500">Calculator tool not found.</div>;
};

// -------------------------------------------------------------
// Component: Scientific Calculator with Calculation History & Safe AST
// -------------------------------------------------------------
const ScientificCalcTool: React.FC = () => {
  const [expr, setExpr] = useState('');
  const [result, setResult] = useState('0');
  const [history, setHistory] = useState<{ expr: string; res: string }[]>([]);
  const [copied, setCopied] = useState(false);

  // Safe arithmetic parser
  const safeEvaluate = (input: string): number => {
    const sanitized = input
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/π/g, `${Math.PI}`)
      .replace(/\be\b/g, `${Math.E}`);

    let pos = 0;
    const peek = () => sanitized[pos];
    const get = () => sanitized[pos++];

    const parseNumber = (): number => {
      let numStr = '';
      while (pos < sanitized.length && /[0-9.]/.test(peek())) {
        numStr += get();
      }
      return parseFloat(numStr) || 0;
    };

    const parseFactor = (): number => {
      while (peek() === ' ') get();
      if (peek() === '(') {
        get();
        const res = parseExpression();
        if (peek() === ')') get();
        return res;
      }
      if (peek() === '-') {
        get();
        return -parseFactor();
      }
      if (sanitized.startsWith('sin', pos)) {
        pos += 3;
        return Math.sin(parseFactor());
      }
      if (sanitized.startsWith('cos', pos)) {
        pos += 3;
        return Math.cos(parseFactor());
      }
      if (sanitized.startsWith('tan', pos)) {
        pos += 3;
        return Math.tan(parseFactor());
      }
      if (sanitized.startsWith('sqrt', pos)) {
        pos += 4;
        return Math.sqrt(parseFactor());
      }
      if (sanitized.startsWith('log', pos)) {
        pos += 3;
        return Math.log10(parseFactor());
      }
      if (sanitized.startsWith('ln', pos)) {
        pos += 2;
        return Math.log(parseFactor());
      }
      return parseNumber();
    };

    const parseTerm = (): number => {
      let res = parseFactor();
      while (pos < sanitized.length) {
        while (peek() === ' ') get();
        if (peek() === '*' || peek() === '/' || peek() === '%') {
          const op = get();
          if (op === '%') {
            while (peek() === ' ') get();
            const nextCh = peek();
            if (nextCh && /[0-9.(]|sin|cos|tan|sqrt|log|ln/.test(sanitized.slice(pos))) {
              const next = parseFactor();
              res = next !== 0 ? res % next : NaN;
            } else {
              res = res / 100;
            }
          } else {
            const next = parseFactor();
            if (op === '*') res *= next;
            else if (op === '/') res = next !== 0 ? res / next : NaN;
          }
        } else if (peek() === '^') {
          get();
          res = Math.pow(res, parseFactor());
        } else {
          break;
        }
      }
      return res;
    };

    const parseExpression = (): number => {
      let res = parseTerm();
      while (pos < sanitized.length) {
        while (peek() === ' ') get();
        if (peek() === '+' || peek() === '-') {
          const op = get();
          const next = parseTerm();
          if (op === '+') res += next;
          else if (op === '-') res -= next;
        } else {
          break;
        }
      }
      return res;
    };

    return parseExpression();
  };

  const handlePress = (val: string) => {
    if (val === 'C') {
      setExpr('');
      setResult('0');
    } else if (val === 'DEL') {
      setExpr((prev) => prev.slice(0, -1));
    } else if (val === '=') {
      if (!expr.trim()) return;
      try {
        const resVal = safeEvaluate(expr);
        if (!Number.isFinite(resVal) || Number.isNaN(resVal)) {
          setResult('Error');
          return;
        }
        const resStr = String(Number(resVal.toFixed(8)));
        setResult(resStr);
        setHistory((prev) => [{ expr, res: resStr }, ...prev.slice(0, 9)]);
      } catch {
        setResult('Error');
      }
    } else {
      setExpr((prev) => prev + val);
    }
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (/^[0-9.()^%]$/.test(e.key)) handlePress(e.key);
      else if (e.key === '+') handlePress('+');
      else if (e.key === '-') handlePress('-');
      else if (e.key === '*') handlePress('×');
      else if (e.key === '/') { e.preventDefault(); handlePress('÷'); }
      else if (e.key === 'Enter' || e.key === '=') { e.preventDefault(); handlePress('='); }
      else if (e.key === 'Backspace') handlePress('DEL');
      else if (e.key === 'Escape') handlePress('C');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [expr]);

  const copyResult = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const buttons = [
    ['sin', 'cos', 'tan', 'sqrt', 'C', 'DEL'],
    ['(', ')', '^', '÷', 'log', 'π'],
    ['7', '8', '9', '×', '%', 'ln'],
    ['4', '5', '6', '-', 'e', '00'],
    ['1', '2', '3', '+', '0', '.'],
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-4xl mx-auto">
      {/* Calculator Main Keypad */}
      <div className="lg:col-span-8 p-6 rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-900/40 shadow-sm">
        {/* Screen */}
        <div className="bg-white dark:bg-neutral-950 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 text-right mb-5 shadow-inner">
          <div className="text-xs font-mono text-neutral-400 min-h-[1.5rem] truncate select-all">
            {expr || '0'}
          </div>
          <div className="flex items-center justify-between mt-1">
            <button
              onClick={copyResult}
              className="p-1 text-neutral-400 hover:text-[#000000] dark:hover:text-[#FFFFFF] transition"
              title="Copy result"
            >
              {copied ? <Check className="w-4 h-4 text-[#000000] dark:text-[#FFFFFF]" /> : <Copy className="w-4 h-4" />}
            </button>
            <div className="text-3xl sm:text-4xl font-mono font-bold text-[#000000] dark:text-[#FFFFFF] truncate select-all">
              {result}
            </div>
          </div>
        </div>

        {/* Buttons Grid */}
        <div className="space-y-2">
          {buttons.map((row, rIdx) => (
            <div key={rIdx} className="grid grid-cols-6 gap-2">
              {row.map((btn) => {
                const isClear = ['C', 'DEL'].includes(btn);
                const isOperator = ['+', '-', '×', '÷', '^', '%'].includes(btn);

                return (
                  <button
                    key={btn}
                    onClick={() => handlePress(btn)}
                    className={`py-3 rounded-xl text-xs sm:text-sm font-semibold transition active:scale-95 cursor-pointer shadow-xs ${
                      isClear
                        ? 'bg-[#EDEDED] text-[#000000] dark:bg-neutral-800 dark:text-[#FFFFFF] border border-black/15 dark:border-white/15 hover:bg-neutral-300 dark:hover:bg-neutral-700'
                        : isOperator
                        ? 'bg-[#F6F6F6] dark:bg-[#090909] text-[#000000] dark:text-[#FFFFFF] border border-neutral-200 dark:border-neutral-800 font-bold hover:bg-[#EDEDED] dark:hover:bg-neutral-800'
                        : 'bg-[#FFFFFF] dark:bg-[#050505] border border-neutral-200 dark:border-neutral-800 text-[#000000] dark:text-[#FFFFFF] hover:bg-[#F6F6F6] dark:hover:bg-[#090909]'
                    }`}
                  >
                    {btn}
                  </button>
                );
              })}
            </div>
          ))}

          {/* Bottom equals bar */}
          <button
            onClick={() => handlePress('=')}
            className="w-full py-3.5 bg-[#000000] hover:bg-[#090909] text-[#FFFFFF] dark:bg-[#FFFFFF] dark:hover:bg-[#EDEDED] dark:text-[#000000] rounded-xl text-base font-bold transition shadow-sm cursor-pointer mt-2"
          >
            =
          </button>
        </div>
      </div>

      {/* History Tape Sidebar */}
      <div className="lg:col-span-4 p-5 rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-[#FFFFFF] dark:bg-[#090909] shadow-sm space-y-4">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-neutral-500">
          <div className="flex items-center gap-1.5">
            <History className="w-3.5 h-3.5" />
            <span>Calculation Tape</span>
          </div>
          {history.length > 0 && (
            <button
              onClick={() => setHistory([])}
              className="text-[11px] text-neutral-400 hover:text-[#000000] dark:hover:text-[#FFFFFF] cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {history.length > 0 ? (
          <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
            {history.map((item, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setExpr(item.res);
                  setResult(item.res);
                }}
                className="p-2.5 rounded-xl border border-neutral-100 dark:border-neutral-850 hover:bg-neutral-50 dark:hover:bg-neutral-900 cursor-pointer transition text-right font-mono"
              >
                <div className="text-[11px] text-neutral-400 truncate">{item.expr} =</div>
                <div className="text-sm font-bold text-neutral-900 dark:text-neutral-100">{item.res}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-xs text-neutral-400">
            Past equations and results will appear here as you calculate.
          </div>
        )}
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// Component: Percentage & Discount Calculator
// -------------------------------------------------------------
const PercentageCalcTool: React.FC = () => {
  const [val1, setVal1] = useState(25);
  const [val2, setVal2] = useState(200);

  const [origPrice, setOrigPrice] = useState(120);
  const [discountPercent, setDiscountPercent] = useState(20);

  const percentOf = ((val1 / 100) * val2).toFixed(2);
  const isWhatPercent = val2 !== 0 ? (((val1 / val2) * 100).toFixed(2)) : '0';

  const discountAmount = ((origPrice * discountPercent) / 100).toFixed(2);
  const finalPrice = (origPrice - parseFloat(discountAmount)).toFixed(2);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Percentage of */}
        <div className="border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 bg-[#FFFFFF] dark:bg-[#090909] shadow-sm space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-neutral-500">
            What is X% of Y?
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-500">What is</span>
            <input
              type="number"
              value={val1}
              onChange={(e) => setVal1(parseFloat(e.target.value) || 0)}
              className="w-20 p-2 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-[#F6F6F6] dark:bg-[#050505] text-sm font-bold text-center"
            />
            <span className="text-xs text-neutral-500">% of</span>
            <input
              type="number"
              value={val2}
              onChange={(e) => setVal2(parseFloat(e.target.value) || 0)}
              className="w-24 p-2 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-[#F6F6F6] dark:bg-[#050505] text-sm font-bold text-center"
            />
          </div>
          <div className="p-4 bg-[#F6F6F6] dark:bg-[#050505] rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 text-sm font-mono flex items-center justify-between">
            <span className="text-neutral-500">Calculated Result:</span>
            <span className="text-xl font-bold text-[#000000] dark:text-[#FFFFFF]">{percentOf}</span>
          </div>
        </div>

        {/* X is what percent of Y */}
        <div className="border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 bg-[#FFFFFF] dark:bg-[#090909] shadow-sm space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-neutral-500">
            X is what % of Y?
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={val1}
              onChange={(e) => setVal1(parseFloat(e.target.value) || 0)}
              className="w-20 p-2 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-[#F6F6F6] dark:bg-[#050505] text-sm font-bold text-center"
            />
            <span className="text-xs text-neutral-500">is what % of</span>
            <input
              type="number"
              value={val2}
              onChange={(e) => setVal2(parseFloat(e.target.value) || 0)}
              className="w-24 p-2 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-[#F6F6F6] dark:bg-[#050505] text-sm font-bold text-center"
            />
          </div>
          <div className="p-4 bg-[#F6F6F6] dark:bg-[#050505] rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 text-sm font-mono flex items-center justify-between">
            <span className="text-neutral-500">Calculated Percentage:</span>
            <span className="text-xl font-bold text-[#000000] dark:text-[#FFFFFF]">{isWhatPercent}%</span>
          </div>
        </div>
      </div>

      {/* Sale Discount Calculator */}
      <div className="border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 bg-[#FFFFFF] dark:bg-[#090909] shadow-sm space-y-4">
        <div className="text-xs font-bold uppercase tracking-wider text-neutral-500">
          Discount & Savings Calculator
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">Original Price ($)</label>
            <input
              type="number"
              value={origPrice}
              onChange={(e) => setOrigPrice(parseFloat(e.target.value) || 0)}
              className="w-full p-2.5 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-[#F6F6F6] dark:bg-[#050505] text-sm font-mono font-bold"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">Discount (% Off)</label>
            <input
              type="number"
              value={discountPercent}
              onChange={(e) => setDiscountPercent(parseFloat(e.target.value) || 0)}
              className="w-full p-2.5 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-[#F6F6F6] dark:bg-[#050505] text-sm font-mono font-bold"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="p-4 bg-[#000000] dark:bg-[#FFFFFF] rounded-xl border border-[#000000] dark:border-[#FFFFFF]">
            <div className="text-xs font-semibold text-neutral-300 dark:text-neutral-600">Total Money Saved:</div>
            <div className="text-2xl font-bold text-[#FFFFFF] dark:text-[#000000] font-mono mt-0.5">${discountAmount}</div>
          </div>
          <div className="p-4 bg-[#F6F6F6] dark:bg-[#050505] rounded-xl border border-neutral-200/80 dark:border-neutral-800/80">
            <div className="text-xs font-semibold text-neutral-500">Final Discounted Price:</div>
            <div className="text-2xl font-bold text-[#000000] dark:text-[#FFFFFF] font-mono mt-0.5">${finalPrice}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// Component: Profit, Margin & Markup Estimator
// -------------------------------------------------------------
const ProfitMarginTool: React.FC = () => {
  const [cost, setCost] = useState(50);
  const [selling, setSelling] = useState(80);

  const grossProfit = selling - cost;
  const marginPercent = selling > 0 ? ((grossProfit / selling) * 100).toFixed(2) : '0';
  const markupPercent = cost > 0 ? ((grossProfit / cost) * 100).toFixed(2) : '0';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Cost of Goods Sold (COGS) ($)</label>
          <input
            type="number"
            value={cost}
            onChange={(e) => setCost(parseFloat(e.target.value) || 0)}
            className="w-full p-3 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-[#FFFFFF] dark:bg-[#050505] text-sm font-mono font-bold"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Selling Price ($)</label>
          <input
            type="number"
            value={selling}
            onChange={(e) => setSelling(parseFloat(e.target.value) || 0)}
            className="w-full p-3 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-[#FFFFFF] dark:bg-[#050505] text-sm font-mono font-bold"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 border border-neutral-200 dark:border-neutral-800 rounded-2xl bg-[#FFFFFF] dark:bg-[#090909] text-center shadow-sm">
          <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Gross Profit</div>
          <div className={`text-3xl font-bold font-mono mt-2 ${grossProfit >= 0 ? 'text-[#000000] dark:text-[#FFFFFF]' : 'text-neutral-500 underline decoration-dashed'}`}>
            ${grossProfit.toFixed(2)}
          </div>
        </div>
        <div className="p-5 border border-neutral-200 dark:border-neutral-800 rounded-2xl bg-[#FFFFFF] dark:bg-[#090909] text-center shadow-sm">
          <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Profit Margin</div>
          <div className="text-3xl font-bold font-mono mt-2 text-[#000000] dark:text-[#FFFFFF]">{marginPercent}%</div>
        </div>
        <div className="p-5 border border-neutral-200 dark:border-neutral-800 rounded-2xl bg-[#FFFFFF] dark:bg-[#090909] text-center shadow-sm">
          <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Cost Markup</div>
          <div className="text-3xl font-bold font-mono mt-2 text-[#000000] dark:text-[#FFFFFF]">{markupPercent}%</div>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// Component: Precise Age & Date Countdown Calculator
// -------------------------------------------------------------
const AgeDateTool: React.FC = () => {
  const [birthDate, setBirthDate] = useState('2000-01-15');

  const ageDetails = useMemo(() => {
    if (!birthDate) return null;
    const birth = new Date(birthDate);
    const now = new Date();

    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const diffMs = now.getTime() - birth.getTime();
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
    const totalMinutes = Math.floor(diffMs / (1000 * 60));

    // Next birthday countdown
    let nextBday = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBday < now) {
      nextBday.setFullYear(now.getFullYear() + 1);
    }
    const daysToBday = Math.ceil((nextBday.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    // Day of week
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const bornDay = daysOfWeek[birth.getDay()];

    return { years, months, days, totalDays, totalHours, totalMinutes, daysToBday, bornDay };
  }, [birthDate]);

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-900/40">
        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
          Select Date of Birth
        </label>
        <input
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          className="w-full max-w-sm p-3 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-950 text-sm font-semibold"
        />
      </div>

      {ageDetails && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 border border-neutral-200 dark:border-neutral-800 rounded-2xl bg-[#FFFFFF] dark:bg-[#090909] text-center shadow-sm">
            <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Exact Chronological Age</div>
            <div className="text-xl font-bold mt-2 text-[#000000] dark:text-[#FFFFFF]">
              {ageDetails.years} Years, {ageDetails.months} Mos, {ageDetails.days} Days
            </div>
          </div>
          <div className="p-5 border border-neutral-200 dark:border-neutral-800 rounded-2xl bg-[#FFFFFF] dark:bg-[#090909] text-center shadow-sm">
            <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Total Days Lived</div>
            <div className="text-2xl font-bold font-mono mt-2 text-[#000000] dark:text-[#FFFFFF]">
              {ageDetails.totalDays.toLocaleString()} Days
            </div>
          </div>
          <div className="p-5 border border-neutral-200 dark:border-neutral-800 rounded-2xl bg-[#FFFFFF] dark:bg-[#090909] text-center shadow-sm">
            <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Next Birthday</div>
            <div className="text-2xl font-bold font-mono mt-2 text-[#000000] dark:text-[#FFFFFF]">
              in {ageDetails.daysToBday} Days
            </div>
          </div>
          <div className="p-5 border border-neutral-200 dark:border-neutral-800 rounded-2xl bg-[#FFFFFF] dark:bg-[#090909] text-center shadow-sm">
            <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Born On</div>
            <div className="text-2xl font-bold mt-2 text-[#000000] dark:text-[#FFFFFF]">
              {ageDetails.bornDay}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// -------------------------------------------------------------
// Component: Loan & EMI Amortization Estimator
// -------------------------------------------------------------
const LoanCalculatorTool: React.FC = () => {
  const [principal, setPrincipal] = useState(25000);
  const [rate, setRate] = useState(7.5);
  const [tenureYears, setTenureYears] = useState(5);
  const [showSchedule, setShowSchedule] = useState(false);

  const emiCalc = useMemo(() => {
    const P = principal;
    const r = rate / 12 / 100;
    const n = tenureYears * 12;

    if (P <= 0 || r <= 0 || n <= 0) return { emi: 0, totalInterest: 0, totalPayment: 0, schedule: [] };

    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - P;

    // Build first 12 months amortization schedule
    let balance = P;
    const schedule: { month: number; interest: number; principalPaid: number; remaining: number }[] = [];
    for (let m = 1; m <= Math.min(n, 12); m++) {
      const interestPart = balance * r;
      const principalPart = emi - interestPart;
      balance = Math.max(0, balance - principalPart);
      schedule.push({
        month: m,
        interest: Math.round(interestPart),
        principalPaid: Math.round(principalPart),
        remaining: Math.round(balance),
      });
    }

    return {
      emi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalPayment: Math.round(totalPayment),
      schedule,
    };
  }, [principal, rate, tenureYears]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Principal Amount ($)</label>
          <input
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(parseFloat(e.target.value) || 0)}
            className="w-full p-3 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-950 text-sm font-mono font-bold"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Annual Interest Rate (%)</label>
          <input
            type="number"
            step="0.1"
            value={rate}
            onChange={(e) => setRate(parseFloat(e.target.value) || 0)}
            className="w-full p-3 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-950 text-sm font-mono font-bold"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Tenure (Years)</label>
          <input
            type="number"
            value={tenureYears}
            onChange={(e) => setTenureYears(parseInt(e.target.value) || 1)}
            className="w-full p-3 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-950 text-sm font-mono font-bold"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 border border-neutral-200 dark:border-neutral-800 rounded-2xl bg-[#FFFFFF] dark:bg-[#090909] text-center shadow-sm">
          <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Monthly EMI</div>
          <div className="text-3xl font-bold font-mono mt-2 text-[#000000] dark:text-[#FFFFFF]">${emiCalc.emi} / mo</div>
        </div>
        <div className="p-5 border border-neutral-200 dark:border-neutral-800 rounded-2xl bg-[#FFFFFF] dark:bg-[#090909] text-center shadow-sm">
          <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Total Interest</div>
          <div className="text-3xl font-bold font-mono mt-2 text-neutral-700 dark:text-neutral-300">${emiCalc.totalInterest.toLocaleString()}</div>
        </div>
        <div className="p-5 border border-neutral-200 dark:border-neutral-800 rounded-2xl bg-[#FFFFFF] dark:bg-[#090909] text-center shadow-sm">
          <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Total Payment (P + I)</div>
          <div className="text-3xl font-bold font-mono mt-2 text-[#000000] dark:text-[#FFFFFF]">${emiCalc.totalPayment.toLocaleString()}</div>
        </div>
      </div>

      {/* Amortization Schedule Accordion */}
      <div className="border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 bg-[#FFFFFF] dark:bg-[#090909] shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
            Amortization Breakdown (First Year Preview)
          </span>
          <button
            onClick={() => setShowSchedule(!showSchedule)}
            className="text-xs font-semibold text-[#000000] dark:text-[#FFFFFF] hover:underline cursor-pointer"
          >
            {showSchedule ? 'Hide Schedule' : 'View Schedule Table'}
          </button>
        </div>

        {showSchedule && (
          <div className="overflow-x-auto pt-2">
            <table className="w-full text-xs text-left font-mono">
              <thead className="bg-[#F6F6F6] dark:bg-[#050505] border-b border-neutral-200 dark:border-neutral-800 text-neutral-400">
                <tr>
                  <th className="p-2.5">Month</th>
                  <th className="p-2.5">Principal</th>
                  <th className="p-2.5">Interest</th>
                  <th className="p-2.5">Balance Remaining</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-900">
                {emiCalc.schedule.map((row) => (
                  <tr key={row.month} className="hover:bg-[#F6F6F6] dark:hover:bg-[#050505]">
                    <td className="p-2.5 font-bold">Month {row.month}</td>
                    <td className="p-2.5 font-semibold text-[#000000] dark:text-[#FFFFFF]">${row.principalPaid}</td>
                    <td className="p-2.5 text-neutral-500 dark:text-neutral-400">${row.interest}</td>
                    <td className="p-2.5 text-neutral-700 dark:text-neutral-300">${row.remaining.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// Component: Electricity Cost & Consumption Estimator
// -------------------------------------------------------------
const ElectricityCalcTool: React.FC = () => {
  const [watts, setWatts] = useState(150);
  const [hours, setHours] = useState(8);
  const [tariff, setTariff] = useState(0.18);

  const dailyKwh = (watts * hours) / 1000;
  const dailyCost = dailyKwh * tariff;
  const monthlyCost = dailyCost * 30;
  const annualCost = dailyCost * 365;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Power Rating (Watts)</label>
          <input
            type="number"
            value={watts}
            onChange={(e) => setWatts(parseFloat(e.target.value) || 0)}
            className="w-full p-3 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-[#FFFFFF] dark:bg-[#050505] text-sm font-mono font-bold"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Usage Hours / Day</label>
          <input
            type="number"
            min={1}
            max={24}
            value={hours}
            onChange={(e) => setHours(parseFloat(e.target.value) || 0)}
            className="w-full p-3 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-[#FFFFFF] dark:bg-[#050505] text-sm font-mono font-bold"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Rate per kWh ($)</label>
          <input
            type="number"
            step="0.01"
            value={tariff}
            onChange={(e) => setTariff(parseFloat(e.target.value) || 0)}
            className="w-full p-3 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-[#FFFFFF] dark:bg-[#050505] text-sm font-mono font-bold"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 border border-neutral-200 dark:border-neutral-800 rounded-2xl bg-[#FFFFFF] dark:bg-[#090909] text-center shadow-sm">
          <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Daily Cost</div>
          <div className="text-2xl font-bold font-mono mt-1 text-[#000000] dark:text-[#FFFFFF]">${dailyCost.toFixed(2)}</div>
          <div className="text-[11px] text-neutral-400 mt-1 font-mono">{dailyKwh.toFixed(2)} kWh / day</div>
        </div>
        <div className="p-5 border border-neutral-200 dark:border-neutral-800 rounded-2xl bg-[#FFFFFF] dark:bg-[#090909] text-center shadow-sm">
          <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Monthly (30 Days)</div>
          <div className="text-2xl font-bold font-mono mt-1 text-[#000000] dark:text-[#FFFFFF]">${monthlyCost.toFixed(2)}</div>
          <div className="text-[11px] text-neutral-400 mt-1 font-mono">{(dailyKwh * 30).toFixed(1)} kWh / month</div>
        </div>
        <div className="p-5 border border-neutral-200 dark:border-neutral-800 rounded-2xl bg-[#FFFFFF] dark:bg-[#090909] text-center shadow-sm">
          <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Annual (365 Days)</div>
          <div className="text-2xl font-bold font-mono mt-1 text-[#000000] dark:text-[#FFFFFF]">${annualCost.toFixed(2)}</div>
          <div className="text-[11px] text-neutral-400 mt-1 font-mono">{(dailyKwh * 365).toFixed(0)} kWh / year</div>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// Component: Universal Unit Converter (Length, Weight, Temp, Data, Speed, Area)
// -------------------------------------------------------------
const UnitConverterTool: React.FC = () => {
  const [category, setCategory] = useState<'length' | 'weight' | 'temp' | 'data' | 'speed' | 'area'>('length');
  const [val, setVal] = useState<number>(1);
  const [fromUnit, setFromUnit] = useState('meter');
  const [toUnit, setToUnit] = useState('foot');

  const unitConfigs: Record<string, { label: string; defaultFrom: string; defaultTo: string; units: Record<string, number | ((v: number) => number)> }> = {
    length: {
      label: 'Length & Distance',
      defaultFrom: 'meter',
      defaultTo: 'foot',
      units: {
        meter: 1,
        kilometer: 1000,
        centimeter: 0.01,
        millimeter: 0.001,
        mile: 1609.34,
        yard: 0.9144,
        foot: 0.3048,
        inch: 0.0254,
      },
    },
    weight: {
      label: 'Mass & Weight',
      defaultFrom: 'kilogram',
      defaultTo: 'pound',
      units: {
        kilogram: 1,
        gram: 0.001,
        milligram: 0.000001,
        pound: 0.453592,
        ounce: 0.0283495,
        ton: 1000,
      },
    },
    data: {
      label: 'Digital Data & Storage',
      defaultFrom: 'megabyte',
      defaultTo: 'gigabyte',
      units: {
        byte: 1,
        kilobyte: 1024,
        megabyte: 1024 * 1024,
        gigabyte: 1024 * 1024 * 1024,
        terabyte: 1024 * 1024 * 1024 * 1024,
      },
    },
    speed: {
      label: 'Speed & Velocity',
      defaultFrom: 'kmh',
      defaultTo: 'mph',
      units: {
        ms: 1,
        kmh: 0.277778,
        mph: 0.44704,
        knot: 0.514444,
      },
    },
    area: {
      label: 'Area & Land Size',
      defaultFrom: 'sq_meter',
      defaultTo: 'sq_foot',
      units: {
        sq_meter: 1,
        sq_km: 1000000,
        sq_foot: 0.092903,
        acre: 4046.86,
        hectare: 10000,
      },
    },
    temp: {
      label: 'Temperature',
      defaultFrom: 'celsius',
      defaultTo: 'fahrenheit',
      units: {},
    },
  };

  const handleCategoryChange = (cat: any) => {
    setCategory(cat);
    setFromUnit(unitConfigs[cat].defaultFrom);
    setToUnit(unitConfigs[cat].defaultTo);
  };

  const convertedValue = useMemo(() => {
    if (category === 'temp') {
      if (fromUnit === toUnit) return val;
      if (fromUnit === 'celsius' && toUnit === 'fahrenheit') return (val * 9) / 5 + 32;
      if (fromUnit === 'fahrenheit' && toUnit === 'celsius') return ((val - 32) * 5) / 9;
      if (fromUnit === 'celsius' && toUnit === 'kelvin') return val + 273.15;
      if (fromUnit === 'kelvin' && toUnit === 'celsius') return val - 273.15;
      if (fromUnit === 'fahrenheit' && toUnit === 'kelvin') return ((val - 32) * 5) / 9 + 273.15;
      if (fromUnit === 'kelvin' && toUnit === 'fahrenheit') return ((val - 273.15) * 9) / 5 + 32;
      return val;
    }

    const conf = unitConfigs[category].units;
    const fromFactor = conf[fromUnit] as number;
    const toFactor = conf[toUnit] as number;
    if (!fromFactor || !toFactor) return 0;
    const inBase = val * fromFactor;
    return inBase / toFactor;
  }, [category, val, fromUnit, toUnit]);

  const swap = () => {
    const f = fromUnit;
    setFromUnit(toUnit);
    setToUnit(f);
  };

  const unitList = category === 'temp' ? ['celsius', 'fahrenheit', 'kelvin'] : Object.keys(unitConfigs[category].units);

  return (
    <div className="space-y-6">
      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-neutral-100 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800">
        {Object.entries(unitConfigs).map(([key, item]) => (
          <button
            key={key}
            onClick={() => handleCategoryChange(key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              category === key
                ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Main Converter Card */}
      <div className="p-6 rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-[#FFFFFF] dark:bg-[#090909] shadow-sm space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-11 gap-4 items-center">
          {/* From */}
          <div className="sm:col-span-5 space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">From</label>
            <input
              type="number"
              value={val}
              onChange={(e) => setVal(parseFloat(e.target.value) || 0)}
              className="w-full p-3 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-[#F6F6F6] dark:bg-[#050505] font-mono text-base font-bold"
            />
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full p-2.5 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs font-semibold bg-[#FFFFFF] dark:bg-[#050505] uppercase tracking-wider"
            >
              {unitList.map((u) => (
                <option key={u} value={u}>
                  {u.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>

          {/* Swap Button */}
          <div className="sm:col-span-1 flex justify-center pt-5">
            <button
              onClick={swap}
              className="p-3 rounded-full border border-neutral-200 dark:border-neutral-800 hover:bg-[#F6F6F6] dark:hover:bg-[#050505] transition shadow-xs cursor-pointer"
              title="Swap units"
            >
              <ArrowRightLeft className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
            </button>
          </div>

          {/* To */}
          <div className="sm:col-span-5 space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">To (Calculated)</label>
            <div className="w-full p-3 border border-[#000000] dark:border-[#FFFFFF] rounded-xl bg-[#000000] dark:bg-[#FFFFFF] font-mono text-base font-bold text-[#FFFFFF] dark:text-[#000000] truncate select-all">
              {Number(convertedValue.toFixed(6))}
            </div>
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="w-full p-2.5 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs font-semibold bg-[#FFFFFF] dark:bg-[#050505] uppercase tracking-wider"
            >
              {unitList.map((u) => (
                <option key={u} value={u}>
                  {u.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
