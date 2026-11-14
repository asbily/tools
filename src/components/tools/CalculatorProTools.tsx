import React, { useState, useEffect, useMemo } from 'react';
import { ArrowRightLeft, RefreshCw, Copy, Check, HeartPulse, Coins, Receipt } from 'lucide-react';

// -------------------------------------------------------------
// 1. Live Currency & Exchange Rate Converter
// -------------------------------------------------------------
const CURRENCY_META: { code: string; name: string; symbol: string }[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'BDT', name: 'Bangladeshi Taka', symbol: '৳' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'SAR', name: 'Saudi Riyal', symbol: '﷼' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩' },
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺' },
  { code: 'PKR', name: 'Pakistani Rupee', symbol: '₨' },
  { code: 'QAR', name: 'Qatari Riyal', symbol: '﷼' },
  { code: 'KWD', name: 'Kuwaiti Dinar', symbol: 'د.ك' },
  { code: 'OMR', name: 'Omani Rial', symbol: '﷼' },
];

const FALLBACK_RATES: Record<string, number> = {
  USD: 1, BDT: 119.5, EUR: 0.92, GBP: 0.79, INR: 84.1, SAR: 3.75, AED: 3.67,
  CAD: 1.39, AUD: 1.53, JPY: 153.2, SGD: 1.34, MYR: 4.38, CHF: 0.88, CNY: 7.21,
  KRW: 1385, TRY: 34.3, PKR: 277.8, QAR: 3.64, KWD: 0.307, OMR: 0.385,
};

export const CurrencyConverterTool: React.FC = () => {
  const [amount, setAmount] = useState<string>('100');
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('BDT');
  const [rates, setRates] = useState<Record<string, number>>(() => {
    try {
      const cached = localStorage.getItem('asbily_fx_rates');
      return cached ? JSON.parse(cached).rates : FALLBACK_RATES;
    } catch {
      return FALLBACK_RATES;
    }
  });
  const [lastUpdated, setLastUpdated] = useState<string>(() => {
    try {
      const cached = localStorage.getItem('asbily_fx_rates');
      return cached ? JSON.parse(cached).updated : 'Cached baseline';
    } catch {
      return 'Cached baseline';
    }
  });
  const [loading, setLoading] = useState(false);

  const fetchLiveRates = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://open.er-api.com/v6/latest/USD');
      const data = await res.json();
      if (data && data.result === 'success' && data.rates) {
        setRates(data.rates);
        const nowStr = new Date().toLocaleString();
        setLastUpdated(`Live · ${nowStr}`);
        localStorage.setItem('asbily_fx_rates', JSON.stringify({ rates: data.rates, updated: `Live · ${nowStr}` }));
      }
    } catch {
      // Keep cached or fallback rates cleanly
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveRates();
  }, []);

  const numAmount = parseFloat(amount) || 0;
  const fromRate = rates[from] || 1;
  const toRate = rates[to] || 1;
  const converted = (numAmount / fromRate) * toRate;
  const unitRate = (1 / fromRate) * toRate;

  const swapCurrencies = () => {
    setFrom(to);
    setTo(from);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-neutral-500">
        <span className="flex items-center gap-1.5">
          <Coins className="w-4 h-4 text-[#000000] dark:text-[#FFFFFF]" />
          <span>Rates: {lastUpdated}</span>
        </span>
        <button
          type="button"
          onClick={fetchLiveRates}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-[#F6F6F6] dark:hover:bg-white/10 font-medium cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Refreshing...' : 'Refresh Live Rates'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-11 gap-3 items-end">
        <div className="md:col-span-3">
          <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-3 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-[#090909] text-base font-mono tabular-nums font-bold"
          />
        </div>

        <div className="md:col-span-3">
          <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">From</label>
          <select
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="w-full p-3 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-[#090909] text-sm font-medium"
          >
            {CURRENCY_META.map((c) => (
              <option key={c.code} value={c.code}>{c.code} — {c.name}</option>
            ))}
          </select>
        </div>

        <div className="md:col-span-1 flex justify-center">
          <button
            type="button"
            onClick={swapCurrencies}
            className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-[#F6F6F6] dark:hover:bg-white/10 transition cursor-pointer"
            title="Swap currencies"
          >
            <ArrowRightLeft className="w-4 h-4" />
          </button>
        </div>

        <div className="md:col-span-4">
          <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">To</label>
          <select
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="w-full p-3 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-[#090909] text-sm font-medium"
          >
            {CURRENCY_META.map((c) => (
              <option key={c.code} value={c.code}>{c.code} — {c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Primary Result Box */}
      <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-[#F6F6F6] dark:bg-[#050505] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs text-neutral-500 font-medium">
            {numAmount.toLocaleString()} {from} equals
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold font-mono tabular-nums text-[#000000] dark:text-[#FFFFFF] mt-1">
            {converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {to}
          </div>
        </div>
        <div className="text-xs font-mono tabular-nums text-neutral-500 space-y-1 sm:text-right">
          <div>1 {from} = {unitRate.toFixed(4)} {to}</div>
          <div>1 {to} = {(1 / unitRate).toFixed(4)} {from}</div>
        </div>
      </div>

      {/* Quick Multi-Currency Table */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {['USD', 'BDT', 'EUR', 'GBP', 'INR', 'SAR', 'AED', 'CAD']
          .filter((code) => code !== from)
          .slice(0, 8)
          .map((code) => {
            const val = (numAmount / fromRate) * (rates[code] || 1);
            return (
              <div
                key={code}
                onClick={() => setTo(code)}
                className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#090909] hover:border-[#000000] dark:hover:border-[#FFFFFF] transition cursor-pointer"
              >
                <div className="text-[11px] font-semibold text-neutral-400">{code}</div>
                <div className="text-sm font-bold font-mono tabular-nums mt-0.5">
                  {val.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 2. BMI, BMR & Daily Calorie (TDEE) Calculator
// -------------------------------------------------------------
export const HealthBmiTool: React.FC = () => {
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState(26);
  const [weightKg, setWeightKg] = useState(70);
  const [heightCm, setHeightCm] = useState(174);
  const [weightLb, setWeightLb] = useState(154);
  const [heightFt, setHeightFt] = useState(5);
  const [heightIn, setHeightIn] = useState(8);
  const [activity, setActivity] = useState(1.55);

  const metrics = useMemo(() => {
    const kg = unit === 'metric' ? weightKg : weightLb * 0.453592;
    const cm = unit === 'metric' ? heightCm : (heightFt * 12 + heightIn) * 2.54;
    const m = cm / 100;
    const bmi = m > 0 ? kg / (m * m) : 0;

    let category = 'Normal Weight';
    let colorClass = 'text-[#000000] dark:text-[#FFFFFF]';
    if (bmi < 18.5) {
      category = 'Underweight';
      colorClass = 'text-neutral-600 dark:text-neutral-300';
    } else if (bmi >= 25 && bmi < 30) {
      category = 'Overweight';
      colorClass = 'text-neutral-700 dark:text-neutral-300';
    } else if (bmi >= 30) {
      category = 'Obese';
      colorClass = 'text-[#000000] dark:text-[#FFFFFF] underline';
    }

    const minHealthy = 18.5 * m * m;
    const maxHealthy = 24.9 * m * m;

    // Mifflin-St Jeor Equation
    const bmr = 10 * kg + 6.25 * cm - 5 * age + (gender === 'male' ? 5 : -161);
    const tdee = bmr * activity;

    return { bmi, category, colorClass, minHealthy, maxHealthy, bmr, tdee };
  }, [unit, gender, age, weightKg, heightCm, weightLb, heightFt, heightIn, activity]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <div className="inline-flex p-1 rounded-xl bg-[#F6F6F6] dark:bg-[#050505] border border-neutral-200 dark:border-neutral-800">
          <button type="button" onClick={() => setUnit('metric')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${unit === 'metric' ? 'bg-[#000000] text-[#FFFFFF] dark:bg-[#FFFFFF] dark:text-[#000000]' : 'text-neutral-500'}`}>
            Metric (kg / cm)
          </button>
          <button type="button" onClick={() => setUnit('imperial')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${unit === 'imperial' ? 'bg-[#000000] text-[#FFFFFF] dark:bg-[#FFFFFF] dark:text-[#000000]' : 'text-neutral-500'}`}>
            Imperial (lb / ft·in)
          </button>
        </div>

        <div className="inline-flex p-1 rounded-xl bg-[#F6F6F6] dark:bg-[#050505] border border-neutral-200 dark:border-neutral-800">
          <button type="button" onClick={() => setGender('male')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${gender === 'male' ? 'bg-[#000000] text-[#FFFFFF] dark:bg-[#FFFFFF] dark:text-[#000000]' : 'text-neutral-500'}`}>
            Male
          </button>
          <button type="button" onClick={() => setGender('female')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${gender === 'female' ? 'bg-[#000000] text-[#FFFFFF] dark:bg-[#FFFFFF] dark:text-[#000000]' : 'text-neutral-500'}`}>
            Female
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
        <div>
          <label className="block font-semibold text-neutral-500 uppercase mb-1">Age (years)</label>
          <input type="number" min={10} max={100} value={age} onChange={(e) => setAge(Number(e.target.value) || 25)} className="w-full p-2.5 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-950 font-mono tabular-nums" />
        </div>

        {unit === 'metric' ? (
          <>
            <div>
              <label className="block font-semibold text-neutral-500 uppercase mb-1">Weight (kg)</label>
              <input type="number" min={20} max={300} value={weightKg} onChange={(e) => setWeightKg(Number(e.target.value) || 70)} className="w-full p-2.5 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-950 font-mono tabular-nums" />
            </div>
            <div>
              <label className="block font-semibold text-neutral-500 uppercase mb-1">Height (cm)</label>
              <input type="number" min={100} max={240} value={heightCm} onChange={(e) => setHeightCm(Number(e.target.value) || 170)} className="w-full p-2.5 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-950 font-mono tabular-nums" />
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="block font-semibold text-neutral-500 uppercase mb-1">Weight (lbs)</label>
              <input type="number" min={40} max={600} value={weightLb} onChange={(e) => setWeightLb(Number(e.target.value) || 150)} className="w-full p-2.5 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-950 font-mono tabular-nums" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-neutral-500 uppercase mb-1">Feet</label>
                <input type="number" min={3} max={8} value={heightFt} onChange={(e) => setHeightFt(Number(e.target.value) || 5)} className="w-full p-2.5 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-950 font-mono tabular-nums" />
              </div>
              <div>
                <label className="block font-semibold text-neutral-500 uppercase mb-1">Inches</label>
                <input type="number" min={0} max={11} value={heightIn} onChange={(e) => setHeightIn(Number(e.target.value) || 0)} className="w-full p-2.5 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-950 font-mono tabular-nums" />
              </div>
            </div>
          </>
        )}

        <div>
          <label className="block font-semibold text-neutral-500 uppercase mb-1">Activity Level</label>
          <select value={activity} onChange={(e) => setActivity(Number(e.target.value))} className="w-full p-2.5 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-950">
            <option value={1.2}>Sedentary (Desk job)</option>
            <option value={1.375}>Light Exercise (1–2 days)</option>
            <option value={1.55}>Moderate (3–5 days)</option>
            <option value={1.725}>Active (6–7 days)</option>
            <option value={1.9}>Athlete (2× daily)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-[#F6F6F6] dark:bg-[#050505]">
          <div className="text-xs font-semibold text-neutral-500 uppercase flex items-center gap-1.5">
            <HeartPulse className="w-3.5 h-3.5 text-[#000000] dark:text-[#FFFFFF]" />
            <span>Your BMI</span>
          </div>
          <div className="text-3xl font-extrabold font-mono tabular-nums mt-2">{metrics.bmi.toFixed(1)}</div>
          <div className={`text-xs font-semibold mt-1 ${metrics.colorClass}`}>{metrics.category}</div>
          <div className="text-[11px] text-neutral-500 mt-2">
            Healthy range: {metrics.minHealthy.toFixed(1)} – {metrics.maxHealthy.toFixed(1)} kg
          </div>
        </div>

        <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-[#F6F6F6] dark:bg-[#050505]">
          <div className="text-xs font-semibold text-neutral-500 uppercase">Basal Metabolic Rate (BMR)</div>
          <div className="text-3xl font-extrabold font-mono tabular-nums mt-2">{Math.round(metrics.bmr)}</div>
          <div className="text-xs text-neutral-500 mt-1">kcal / day at rest</div>
        </div>

        <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-[#F6F6F6] dark:bg-[#050505] space-y-1.5">
          <div className="text-xs font-semibold text-neutral-500 uppercase">Daily Calorie Goals (TDEE)</div>
          <div className="flex justify-between text-xs pt-1">
            <span>Weight Loss (-500)</span>
            <strong className="font-mono tabular-nums">{Math.round(metrics.tdee - 500)} kcal</strong>
          </div>
          <div className="flex justify-between text-xs text-[#000000] dark:text-[#FFFFFF] font-bold">
            <span>Maintain Weight</span>
            <strong className="font-mono tabular-nums">{Math.round(metrics.tdee)} kcal</strong>
          </div>
          <div className="flex justify-between text-xs">
            <span>Lean Muscle Gain (+350)</span>
            <strong className="font-mono tabular-nums">{Math.round(metrics.tdee + 350)} kcal</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 3. VAT/Tax & Group Bill Splitter
// -------------------------------------------------------------
export const BillSplitTaxTool: React.FC = () => {
  const [currency, setCurrency] = useState('৳');
  const [subtotal, setSubtotal] = useState(2400);
  const [vatPct, setVatPct] = useState(15);
  const [tipPct, setTipPct] = useState(5);
  const [people, setPeople] = useState(4);
  const [copied, setCopied] = useState(false);

  const vatAmount = (subtotal * vatPct) / 100;
  const tipAmount = (subtotal * tipPct) / 100;
  const grandTotal = subtotal + vatAmount + tipAmount;
  const perPerson = people > 0 ? grandTotal / people : grandTotal;

  const copySummary = () => {
    const text = `Bill Breakdown:\nSubtotal: ${currency}${subtotal.toFixed(2)}\nVAT/Tax (${vatPct}%): ${currency}${vatAmount.toFixed(2)}\nTip (${tipPct}%): ${currency}${tipAmount.toFixed(2)}\nGrand Total: ${currency}${grandTotal.toFixed(2)}\nSplit (${people} people): ${currency}${perPerson.toFixed(2)} each`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
        <div>
          <label className="block font-semibold text-neutral-500 uppercase mb-1">Currency</label>
          <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full p-2.5 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-950">
            <option value="৳">BDT (৳)</option>
            <option value="$">USD ($)</option>
            <option value="€">EUR (€)</option>
            <option value="£">GBP (£)</option>
            <option value="₹">INR (₹)</option>
          </select>
        </div>
        <div>
          <label className="block font-semibold text-neutral-500 uppercase mb-1">Subtotal</label>
          <input type="number" min={0} value={subtotal} onChange={(e) => setSubtotal(Number(e.target.value) || 0)} className="w-full p-2.5 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-950 font-mono tabular-nums" />
        </div>
        <div>
          <label className="block font-semibold text-neutral-500 uppercase mb-1">VAT / Tax (%)</label>
          <input type="number" min={0} max={100} value={vatPct} onChange={(e) => setVatPct(Number(e.target.value) || 0)} className="w-full p-2.5 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-950 font-mono tabular-nums" />
        </div>
        <div>
          <label className="block font-semibold text-neutral-500 uppercase mb-1">Tip (%)</label>
          <input type="number" min={0} max={100} value={tipPct} onChange={(e) => setTipPct(Number(e.target.value) || 0)} className="w-full p-2.5 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-950 font-mono tabular-nums" />
        </div>
        <div>
          <label className="block font-semibold text-neutral-500 uppercase mb-1">People</label>
          <input type="number" min={1} max={100} value={people} onChange={(e) => setPeople(Math.max(1, Number(e.target.value) || 1))} className="w-full p-2.5 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-950 font-mono tabular-nums" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-neutral-500">Subtotal</span>
            <span className="font-mono tabular-nums">{currency}{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">VAT / Tax ({vatPct}%)</span>
            <span className="font-mono tabular-nums">{currency}{vatAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">Service Tip ({tipPct}%)</span>
            <span className="font-mono tabular-nums">{currency}{tipAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-neutral-200 dark:border-neutral-800 font-bold text-sm">
            <span>Grand Total</span>
            <span className="font-mono tabular-nums">{currency}{grandTotal.toFixed(2)}</span>
          </div>
        </div>

        <div className="p-5 rounded-xl border border-white/10 dark:border-black/10 bg-[#090909] text-[#FFFFFF] dark:bg-[#FFFFFF] dark:text-[#000000] flex flex-col justify-between">
          <div>
            <div className="text-xs font-semibold text-neutral-300 dark:text-neutral-600 uppercase flex items-center gap-1.5">
              <Receipt className="w-3.5 h-3.5" />
              <span>Each Person Pays ({people} {people === 1 ? 'person' : 'people'})</span>
            </div>
            <div className="text-3xl font-extrabold font-mono tabular-nums mt-2">
              {currency}{perPerson.toFixed(2)}
            </div>
          </div>

          <button
            type="button"
            onClick={copySummary}
            className="mt-4 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#FFFFFF] text-[#000000] hover:bg-[#EDEDED] dark:bg-[#000000] dark:text-[#FFFFFF] dark:hover:bg-[#090909] text-xs font-semibold cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Breakdown' : 'Copy Shareable Summary'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
