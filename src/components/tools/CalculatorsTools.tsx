import React, { useState, useMemo } from 'react';
import { Calculator, Percent, TrendingUp, Calendar, Landmark, Zap, ArrowRightLeft } from 'lucide-react';

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

  return <div className="text-neutral-500">Calculator tool not found.</div>;
};

// -------------------------------------------------------------
// Component: Scientific & Basic Calculator (Safe Expression Evaluator, NO eval)
// -------------------------------------------------------------
const ScientificCalcTool: React.FC = () => {
  const [expr, setExpr] = useState('');
  const [result, setResult] = useState('0');

  // Safe arithmetic evaluator without eval()
  const safeEvaluate = (input: string): number => {
    // Sanitize and replace math functions
    const sanitized = input
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/π/g, `${Math.PI}`)
      .replace(/e/g, `${Math.E}`);

    // Simple recursive descent parser
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
        get(); // eat '('
        const res = parseExpression();
        if (peek() === ')') get(); // eat ')'
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
      return parseNumber();
    };

    const parseTerm = (): number => {
      let res = parseFactor();
      while (pos < sanitized.length) {
        while (peek() === ' ') get();
        if (peek() === '*' || peek() === '/') {
          const op = get();
          const next = parseFactor();
          if (op === '*') res *= next;
          else if (op === '/') res = next !== 0 ? res / next : 0;
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
      try {
        const res = safeEvaluate(expr);
        setResult(String(Number(res.toFixed(8))));
      } catch {
        setResult('Error');
      }
    } else {
      setExpr((prev) => prev + val);
    }
  };

  const buttons = [
    ['sin', 'cos', 'tan', 'sqrt', 'C', 'DEL'],
    ['(', ')', '^', '÷', 'log', 'π'],
    ['7', '8', '9', '×', '%'],
    ['4', '5', '6', '-', 'e'],
    ['1', '2', '3', '+'],
    ['0', '.', '='],
  ];

  return (
    <div className="max-w-md mx-auto border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 bg-neutral-50 dark:bg-neutral-900 shadow-sm">
      <div className="bg-white dark:bg-neutral-950 p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 text-right mb-4">
        <div className="text-xs font-mono text-neutral-400 min-h-[1.25rem] truncate">{expr || '0'}</div>
        <div className="text-3xl font-mono font-bold text-[#111111] dark:text-neutral-100 truncate mt-1">{result}</div>
      </div>

      <div className="space-y-2">
        {buttons.map((row, rIdx) => (
          <div key={rIdx} className="grid grid-cols-6 gap-2">
            {row.map((btn) => {
              const isEquals = btn === '=';
              const isOperator = ['+', '-', '×', '÷', '^', '%'].includes(btn);
              const isClear = ['C', 'DEL'].includes(btn);

              return (
                <button
                  key={btn}
                  onClick={() => handlePress(btn)}
                  className={`py-3 rounded text-sm font-semibold transition active:scale-95 ${
                    isEquals
                      ? 'col-span-4 bg-[#111111] text-white dark:bg-white dark:text-black font-bold'
                      : isClear
                      ? 'bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400 border border-red-200 dark:border-red-900'
                      : isOperator
                      ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200'
                      : 'bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  {btn}
                </button>
              );
            })}
          </div>
        ))}
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
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Percentage of */}
        <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 bg-neutral-50 dark:bg-neutral-900 space-y-4">
          <div className="text-xs font-semibold text-neutral-500 uppercase">What is X% of Y?</div>
          <div className="flex items-center gap-2">
            <span className="text-xs">What is</span>
            <input type="number" value={val1} onChange={(e) => setVal1(parseFloat(e.target.value) || 0)} className="w-20 p-2 border rounded bg-white dark:bg-neutral-950 text-sm text-center" />
            <span className="text-xs">% of</span>
            <input type="number" value={val2} onChange={(e) => setVal2(parseFloat(e.target.value) || 0)} className="w-24 p-2 border rounded bg-white dark:bg-neutral-950 text-sm text-center" />
          </div>
          <div className="p-3 bg-white dark:bg-neutral-950 rounded border text-sm font-mono font-bold">
            Answer: {percentOf}
          </div>
        </div>

        {/* X is what percent of Y */}
        <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 bg-neutral-50 dark:bg-neutral-900 space-y-4">
          <div className="text-xs font-semibold text-neutral-500 uppercase">X is what % of Y?</div>
          <div className="flex items-center gap-2">
            <input type="number" value={val1} onChange={(e) => setVal1(parseFloat(e.target.value) || 0)} className="w-20 p-2 border rounded bg-white dark:bg-neutral-950 text-sm text-center" />
            <span className="text-xs">is what % of</span>
            <input type="number" value={val2} onChange={(e) => setVal2(parseFloat(e.target.value) || 0)} className="w-24 p-2 border rounded bg-white dark:bg-neutral-950 text-sm text-center" />
          </div>
          <div className="p-3 bg-white dark:bg-neutral-950 rounded border text-sm font-mono font-bold">
            Answer: {isWhatPercent}%
          </div>
        </div>
      </div>

      {/* Discount Calculator */}
      <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 bg-neutral-50 dark:bg-neutral-900 space-y-4">
        <div className="text-xs font-semibold text-neutral-500 uppercase">Sale & Discount Calculator</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-neutral-500 mb-1">Original Price ($)</label>
            <input type="number" value={origPrice} onChange={(e) => setOrigPrice(parseFloat(e.target.value) || 0)} className="w-full p-2 border rounded bg-white dark:bg-neutral-950 text-sm" />
          </div>
          <div>
            <label className="block text-xs text-neutral-500 mb-1">Discount (% off)</label>
            <input type="number" value={discountPercent} onChange={(e) => setDiscountPercent(parseFloat(e.target.value) || 0)} className="w-full p-2 border rounded bg-white dark:bg-neutral-950 text-sm" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="p-3 bg-white dark:bg-neutral-950 rounded border">
            <div className="text-xs text-neutral-400">You Save:</div>
            <div className="text-lg font-bold text-emerald-600 font-mono">${discountAmount}</div>
          </div>
          <div className="p-3 bg-white dark:bg-neutral-950 rounded border">
            <div className="text-xs text-neutral-400">Final Price:</div>
            <div className="text-lg font-bold text-[#111111] dark:text-neutral-100 font-mono">${finalPrice}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// Component: Profit, Loss & Margin Calculator
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
          <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Cost Price ($)</label>
          <input type="number" value={cost} onChange={(e) => setCost(parseFloat(e.target.value) || 0)} className="w-full p-2.5 border rounded bg-white dark:bg-neutral-950 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Selling Price ($)</label>
          <input type="number" value={selling} onChange={(e) => setSelling(parseFloat(e.target.value) || 0)} className="w-full p-2.5 border rounded bg-white dark:bg-neutral-950 text-sm" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-center">
          <div className="text-xs font-semibold text-neutral-500 uppercase">Gross Profit / Loss</div>
          <div className={`text-2xl font-bold font-mono mt-1 ${grossProfit >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
            ${grossProfit.toFixed(2)}
          </div>
        </div>
        <div className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-center">
          <div className="text-xs font-semibold text-neutral-500 uppercase">Profit Margin</div>
          <div className="text-2xl font-bold font-mono mt-1 text-[#111111] dark:text-neutral-100">{marginPercent}%</div>
        </div>
        <div className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-center">
          <div className="text-xs font-semibold text-neutral-500 uppercase">Markup</div>
          <div className="text-2xl font-bold font-mono mt-1 text-[#111111] dark:text-neutral-100">{markupPercent}%</div>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// Component: Age & Date Difference Calculator
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

    const totalDays = Math.floor((now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));

    // Next birthday countdown
    let nextBday = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBday < now) {
      nextBday.setFullYear(now.getFullYear() + 1);
    }
    const daysToBday = Math.ceil((nextBday.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    return { years, months, days, totalDays, daysToBday };
  }, [birthDate]);

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Select Date of Birth</label>
        <input
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          className="w-full max-w-sm p-2.5 border rounded bg-white dark:bg-neutral-950 text-sm"
        />
      </div>

      {ageDetails && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-center">
            <div className="text-xs font-semibold text-neutral-500 uppercase">Exact Age</div>
            <div className="text-xl font-bold mt-1 text-[#111111] dark:text-neutral-100">
              {ageDetails.years} yrs, {ageDetails.months} m, {ageDetails.days} d
            </div>
          </div>
          <div className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-center">
            <div className="text-xs font-semibold text-neutral-500 uppercase">Total Days Lived</div>
            <div className="text-xl font-bold font-mono mt-1 text-[#111111] dark:text-neutral-100">{ageDetails.totalDays.toLocaleString()} days</div>
          </div>
          <div className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-center">
            <div className="text-xs font-semibold text-neutral-500 uppercase">Next Birthday</div>
            <div className="text-xl font-bold font-mono mt-1 text-emerald-600">in {ageDetails.daysToBday} days</div>
          </div>
        </div>
      )}
    </div>
  );
};

// -------------------------------------------------------------
// Component: Loan & EMI Estimator
// -------------------------------------------------------------
const LoanCalculatorTool: React.FC = () => {
  const [principal, setPrincipal] = useState(25000);
  const [rate, setRate] = useState(7.5);
  const [tenureYears, setTenureYears] = useState(5);

  const emiCalc = useMemo(() => {
    const P = principal;
    const r = rate / 12 / 100;
    const n = tenureYears * 12;

    if (P <= 0 || r <= 0 || n <= 0) return { emi: 0, totalInterest: 0, totalPayment: 0 };

    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - P;

    return {
      emi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalPayment: Math.round(totalPayment),
    };
  }, [principal, rate, tenureYears]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Principal Amount ($)</label>
          <input type="number" value={principal} onChange={(e) => setPrincipal(parseFloat(e.target.value) || 0)} className="w-full p-2.5 border rounded bg-white dark:bg-neutral-950 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Annual Interest Rate (%)</label>
          <input type="number" step="0.1" value={rate} onChange={(e) => setRate(parseFloat(e.target.value) || 0)} className="w-full p-2.5 border rounded bg-white dark:bg-neutral-950 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Tenure (Years)</label>
          <input type="number" value={tenureYears} onChange={(e) => setTenureYears(parseInt(e.target.value) || 1)} className="w-full p-2.5 border rounded bg-white dark:bg-neutral-950 text-sm" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-center">
          <div className="text-xs font-semibold text-neutral-500 uppercase">Monthly EMI</div>
          <div className="text-2xl font-bold font-mono mt-1 text-[#111111] dark:text-neutral-100">${emiCalc.emi} / mo</div>
        </div>
        <div className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-center">
          <div className="text-xs font-semibold text-neutral-500 uppercase">Total Interest</div>
          <div className="text-2xl font-bold font-mono mt-1 text-amber-600">${emiCalc.totalInterest.toLocaleString()}</div>
        </div>
        <div className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-center">
          <div className="text-xs font-semibold text-neutral-500 uppercase">Total Payment (P + I)</div>
          <div className="text-2xl font-bold font-mono mt-1 text-[#111111] dark:text-neutral-100">${emiCalc.totalPayment.toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// Component: Electricity Cost Calculator
// -------------------------------------------------------------
const ElectricityCalcTool: React.FC = () => {
  const [watts, setWatts] = useState(150);
  const [hours, setHours] = useState(8);
  const [tariff, setTariff] = useState(0.18); // $ per kWh

  const dailyKwh = (watts * hours) / 1000;
  const dailyCost = dailyKwh * tariff;
  const monthlyCost = dailyCost * 30;
  const annualCost = dailyCost * 365;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Power Rating (Watts)</label>
          <input type="number" value={watts} onChange={(e) => setWatts(parseFloat(e.target.value) || 0)} className="w-full p-2.5 border rounded bg-white dark:bg-neutral-950 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Usage Hours / Day</label>
          <input type="number" min={1} max={24} value={hours} onChange={(e) => setHours(parseFloat(e.target.value) || 0)} className="w-full p-2.5 border rounded bg-white dark:bg-neutral-950 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Cost per kWh ($)</label>
          <input type="number" step="0.01" value={tariff} onChange={(e) => setTariff(parseFloat(e.target.value) || 0)} className="w-full p-2.5 border rounded bg-white dark:bg-neutral-950 text-sm" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-center">
          <div className="text-xs font-semibold text-neutral-500 uppercase">Daily Cost</div>
          <div className="text-2xl font-bold font-mono mt-1 text-[#111111] dark:text-neutral-100">${dailyCost.toFixed(2)}</div>
          <div className="text-[11px] text-neutral-400 mt-1">{dailyKwh.toFixed(2)} kWh</div>
        </div>
        <div className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-center">
          <div className="text-xs font-semibold text-neutral-500 uppercase">Monthly (30 Days)</div>
          <div className="text-2xl font-bold font-mono mt-1 text-[#111111] dark:text-neutral-100">${monthlyCost.toFixed(2)}</div>
        </div>
        <div className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-center">
          <div className="text-xs font-semibold text-neutral-500 uppercase">Annual (365 Days)</div>
          <div className="text-2xl font-bold font-mono mt-1 text-[#111111] dark:text-neutral-100">${annualCost.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// Component: All-in-One Unit Converter
// -------------------------------------------------------------
const UnitConverterTool: React.FC = () => {
  const [type, setType] = useState<'length' | 'weight' | 'temp' | 'data'>('length');
  const [val, setVal] = useState(1);
  const [fromUnit, setFromUnit] = useState('meter');
  const [toUnit, setToUnit] = useState('foot');

  const conversionFactors: Record<string, Record<string, number>> = {
    length: {
      meter: 1,
      kilometer: 1000,
      centimeter: 0.01,
      millimeter: 0.001,
      foot: 0.3048,
      inch: 0.0254,
      mile: 1609.34,
      yard: 0.9144,
    },
    weight: {
      kilogram: 1,
      gram: 0.001,
      milligram: 0.000001,
      pound: 0.453592,
      ounce: 0.0283495,
      ton: 1000,
    },
    data: {
      byte: 1,
      kilobyte: 1024,
      megabyte: 1024 * 1024,
      gigabyte: 1024 * 1024 * 1024,
      terabyte: 1024 * 1024 * 1024 * 1024,
    },
  };

  const convertedValue = useMemo(() => {
    if (type === 'temp') {
      let celsius = val;
      if (fromUnit === 'fahrenheit') celsius = ((val - 32) * 5) / 9;
      if (fromUnit === 'kelvin') celsius = val - 273.15;

      if (toUnit === 'celsius') return celsius.toFixed(2);
      if (toUnit === 'fahrenheit') return ((celsius * 9) / 5 + 32).toFixed(2);
      if (toUnit === 'kelvin') return (celsius + 273.15).toFixed(2);
      return String(val);
    }

    const category = conversionFactors[type];
    if (!category || !category[fromUnit] || !category[toUnit]) return '0';
    const base = val * category[fromUnit];
    const target = base / category[toUnit];
    return target < 0.0001 ? target.toExponential(4) : target.toFixed(4);
  }, [type, val, fromUnit, toUnit]);

  const unitsForType = useMemo(() => {
    if (type === 'temp') return ['celsius', 'fahrenheit', 'kelvin'];
    return Object.keys(conversionFactors[type] || {});
  }, [type]);

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        {(['length', 'weight', 'temp', 'data'] as const).map((t) => (
          <button
            key={t}
            onClick={() => {
              setType(t);
              const u = t === 'temp' ? ['celsius', 'fahrenheit', 'kelvin'] : Object.keys(conversionFactors[t]);
              setFromUnit(u[0]);
              setToUnit(u[1] || u[0]);
            }}
            className={`px-3 py-1.5 rounded text-xs font-semibold capitalize ${
              type === t ? 'bg-[#111111] text-white dark:bg-white dark:text-black' : 'border border-neutral-200 dark:border-neutral-800'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">From Value</label>
          <input type="number" value={val} onChange={(e) => setVal(parseFloat(e.target.value) || 0)} className="w-full p-2.5 border rounded bg-white dark:bg-neutral-950 text-sm font-mono" />
          <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} className="w-full p-2 border rounded mt-2 text-xs capitalize bg-white dark:bg-neutral-950">
            {unitsForType.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
        </div>

        <div className="flex justify-center">
          <ArrowRightLeft className="w-5 h-5 text-neutral-400" />
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Converted Result</label>
          <div className="w-full p-2.5 border rounded bg-neutral-50 dark:bg-neutral-900 text-sm font-mono font-bold text-[#111111] dark:text-neutral-100">
            {convertedValue}
          </div>
          <select value={toUnit} onChange={(e) => setToUnit(e.target.value)} className="w-full p-2 border rounded mt-2 text-xs capitalize bg-white dark:bg-neutral-950">
            {unitsForType.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
